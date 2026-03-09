import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// GET /api/attempts -> Get distinct quizzes the user attempted
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get distinct quizzes the user attempted
    const attempts = await prisma.attempt.findMany({
      where: { user_id: userId },
      distinct: ["quiz_id"],
      include: {
        quiz: { select: { id: true, title: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const quizzes = attempts.map((a) => ({
      quizId: a.quiz.id,
      quizTitle: a.quiz.title,
      attemptedAt: a.createdAt,
    }));

    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error("Error fetching attempted quizzes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { quizId, answers } = await request.json();
    // answers = [{ questionId, optionId }, ...]

    if (
      !quizId ||
      !answers ||
      !Array.isArray(answers) ||
      answers.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields: quizId and answers array" },
        { status: 400 },
      );
    }

    // Create one Attempt row per answer in a single transaction
    const attempts = await prisma.$transaction(
      answers.map(
        ({ questionId, optionId }: { questionId: string; optionId: string }) =>
          prisma.attempt.create({
            data: {
              quiz_id: quizId,
              question_id: questionId,
              option_id: optionId,
              user_id: userId,
            },
          }),
      ),
    );

    return NextResponse.json(
      { message: "Attempt saved successfully!", data: attempts },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error saving attempt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

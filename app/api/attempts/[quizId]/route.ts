import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const { quizId } = await context.params;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const attempts = await prisma.attempt.findMany({
      where: { quiz_id: quizId, user_id: userId },
      include: {
        question: { select: { title: true, mark: true, order: true } },
        option: { select: { text: true, isCorrect: true } },
        quiz: { select: { title: true } },
      },
      orderBy: { question: { order: "asc" } },
    });

    if (!attempts.length) {
      return NextResponse.json({ error: "No attempts found" }, { status: 404 });
    }

    const totalMarks = attempts.reduce((sum, a) => sum + a.question.mark, 0);
    const earnedMarks = attempts.reduce(
      (sum, a) => sum + (a.option.isCorrect ? a.question.mark : 0),
      0,
    );

    return NextResponse.json({
      quizTitle: attempts[0].quiz.title,
      totalMarks,
      earnedMarks,
      percentage: Math.round((earnedMarks / totalMarks) * 100),
      attempts: attempts.map((a) => ({
        questionTitle: a.question.title,
        selectedOption: a.option.text,
        isCorrect: a.option.isCorrect,
        mark: a.question.mark,
        earnedMark: a.option.isCorrect ? a.question.mark : 0,
      })),
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

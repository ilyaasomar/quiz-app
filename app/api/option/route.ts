import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { quiz_id, question_id, options } = await request.json();

    // Validate required fields
    if (!quiz_id || !question_id || !options || !Array.isArray(options)) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: quiz_id, question_id, and options array",
        },
        { status: 400 }
      );
    }

    // Validate options array
    if (options.length < 2) {
      return NextResponse.json(
        { error: "At least 2 options are required" },
        { status: 400 }
      );
    }

    // Check if exactly one option is marked as correct
    const correctOptionsCount = options.filter(
      (opt: any) => opt.isCorrect
    ).length;
    if (correctOptionsCount !== 1) {
      return NextResponse.json(
        { error: "Exactly one option must be marked as correct" },
        { status: 400 }
      );
    }

    // Verify that the quiz and question belong to the user
    const quiz = await prisma.quiz.findFirst({
      where: { id: quiz_id, user_id: userId },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found or access denied" },
        { status: 404 }
      );
    }

    const question = await prisma.question.findFirst({
      where: { id: question_id, quiz_id: quiz_id },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found or does not belong to the selected quiz" },
        { status: 404 }
      );
    }

    // Create all options in a transaction
    const createdOptions = await prisma.$transaction(
      options.map((option: { text: string; isCorrect: boolean }) =>
        prisma.option.create({
          data: {
            text: option.text,
            isCorrect: option.isCorrect,
            question_id: question_id,
            quiz_id: quiz_id,
            user_id: userId,
            createdAt: new Date(),
          },
        })
      )
    );

    return NextResponse.json(
      {
        message: "Options created successfully!",
        data: createdOptions,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating options:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { questionId: string } }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { questionId } = await params;
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

    // Delete all existing options for this question and create new ones in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing options
      await tx.option.deleteMany({
        where: {
          question_id: question_id,
          user_id: userId,
        },
      });

      // Create new options
      const createdOptions = await Promise.all(
        options.map((option: { text: string; isCorrect: boolean }) =>
          tx.option.create({
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

      return createdOptions;
    });

    return NextResponse.json(
      {
        message: "Options updated successfully!",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating options:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// delete function
export async function DELETE(
  request: NextRequest,
  { params }: { params: { optionId: string } }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { optionId } = await params;

    // First, find the option to get the question_id
    const option = await prisma.option.findFirst({
      where: {
        id: optionId,
        user_id: userId,
      },
    });

    if (!option) {
      return NextResponse.json(
        { error: "Option not found or access denied" },
        { status: 404 }
      );
    }

    // Delete ALL options that belong to the same question
    const deleteResult = await prisma.option.deleteMany({
      where: {
        question_id: option.question_id,
        user_id: userId,
      },
    });

    return NextResponse.json(
      {
        message: "All options for this question deleted successfully!",
        deletedCount: deleteResult.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting options:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

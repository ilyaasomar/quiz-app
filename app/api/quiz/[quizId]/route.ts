import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// select questions based on quiz_id
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> },
) {
  const { quizId } = await context.params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const questionData = await prisma.question.findMany({
      where: { quiz_id: quizId, user_id: userId },
    });
    return NextResponse.json(questionData, { status: 200 });
  } catch (error) {}
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { quizId: string } },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const { quizId } = await params;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { title, startTime, endTime } = await request.json();
  try {
    const checkQuiz = await prisma.quiz.findFirst({
      where: { id: quizId, user_id: userId },
    });
    if (!checkQuiz) {
      return NextResponse.json({ message: "Quiz not found!" }, { status: 401 });
    }
    const quiz = await prisma.quiz.update({
      where: { id: quizId },
      data: { title, startTime, endTime, user_id: userId },
    });
    if (!quiz) {
      return NextResponse.json(
        { message: "Quiz not updated!" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { message: "Quiz updated successfully!" },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 505 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const { quizId } = await context.params;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const checkQuiz = await prisma.quiz.findFirst({
      where: { id: quizId, user_id: userId },
    });
    if (!checkQuiz) {
      return NextResponse.json({ message: "Quiz not found!" }, { status: 401 });
    }
    await prisma.quiz.delete({ where: { id: quizId } });

    return NextResponse.json(
      { message: "Quiz deleted successfully!" },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 505 },
    );
  }
}

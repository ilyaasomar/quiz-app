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
  const { questionId } = await params;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { title, quiz, mark } = await request.json();

  try {
    const checkQuestion = await prisma.question.findFirst({
      where: { id: questionId, user_id: userId },
    });
    if (!checkQuestion) {
      return NextResponse.json(
        { message: "Question not found!" },
        { status: 401 }
      );
    }
    const question = await prisma.question.update({
      where: { id: questionId },
      data: { title, quiz_id: quiz, mark, user_id: userId },
    });
    if (!question) {
      return NextResponse.json(
        { message: "Question not updated!" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Question updated successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 505 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ questionId: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const { questionId } = await context.params;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const checkQuestion = await prisma.question.findFirst({
      where: { id: questionId, user_id: userId },
    });
    if (!checkQuestion) {
      return NextResponse.json(
        { message: "Question not found!" },
        { status: 401 }
      );
    }
    await prisma.question.delete({ where: { id: questionId } });

    return NextResponse.json(
      { message: "Question deleted successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 505 }
    );
  }
}

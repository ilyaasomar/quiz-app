import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { title, quiz, mark } = await request.json();

  try {
    // generate question order

    const numberOfQuestions = await prisma.question.findMany({
      where: { quiz_id: quiz, user_id: userId },
    });

    const total = numberOfQuestions.length;
    console.log(total);
    const question = await prisma.question.create({
      data: {
        title: title,
        order: total + 1,
        quiz_id: quiz,
        mark: mark,
        user_id: userId,
      },
    });
    return NextResponse.json(
      { message: "Question created successfully!" },
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

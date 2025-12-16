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
  const { title, startTime, endTime } = await request.json();
  //    title: 'Js QUiz',
  //     startTime: '2025-12-16T15:20:00.000Z',
  //     endTime: '2025-12-16T16:00:00.000Z'
  console.log({ title, startTime, endTime });
  try {
    const quiz = await prisma.quiz.create({
      data: { title, startTime, endTime, user_id: userId },
    });
    return NextResponse.json(
      { message: "Quiz created successfully!" },
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

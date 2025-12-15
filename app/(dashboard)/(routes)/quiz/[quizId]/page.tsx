import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import React from "react";
import { QuizForm } from "./form";

const QuizSubPage = async ({ params }: { params: { quizId: string } }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const { quizId } = await params;

  let quiz:
    | {
        id: string;
        title: string;
        user_id: string;
        startTime: Date;
        endTime: Date;
        createdAt: Date;
        updatedAt: Date;
      }
    | null
    | undefined;
  if (quizId !== "create") {
    quiz = await prisma.quiz.findFirst({
      where: { id: quizId, user_id: userId },
    });
  }

  return (
    <div className="gap-4 p-4 md:gap-8 md:p-6">
      <QuizForm initialData={quiz} />
    </div>
  );
};

export default QuizSubPage;

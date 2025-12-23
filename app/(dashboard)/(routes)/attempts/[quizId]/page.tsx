import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import React from "react";
import AttemptForm from "./form";

const AttemptQuizSubPage = async ({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) => {
  const { quizId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const questionWithOptions = await prisma.question.findMany({
    where: { quiz_id: quizId, user_id: userId },
    include: { quiz: true, options: true },
    orderBy: { createdAt: "asc" },
  });
  return (
    <div>
      <AttemptForm data={questionWithOptions} />
    </div>
  );
};

export default AttemptQuizSubPage;

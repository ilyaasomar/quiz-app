import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ResultClient from "./ResultClient";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const attempts = await prisma.attempt.findMany({
    where: { quiz_id: quizId, user_id: session.user.id },
    include: {
      question: { select: { title: true, mark: true, order: true } },
      option: { select: { text: true, isCorrect: true } },
      quiz: { select: { title: true } },
    },
    orderBy: { question: { order: "asc" } },
  });

  if (!attempts.length) redirect("/result");

  const totalMarks = attempts.reduce((sum, a) => sum + a.question.mark, 0);
  const earnedMarks = attempts.reduce(
    (sum, a) => sum + (a.option.isCorrect ? a.question.mark : 0),
    0,
  );

  const data = {
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
  };

  return <ResultClient data={data} />;
}

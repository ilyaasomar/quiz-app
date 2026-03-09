import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ShowResultData from "./components/show-data";

export default async function ResultsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const attempts = await prisma.attempt.findMany({
    where: { user_id: session.user.id },
    distinct: ["quiz_id"],
    include: {
      quiz: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const quizzes = attempts.map((a, i) => ({
    serialNo: i + 1,
    quizId: a.quiz.id,
    quizTitle: a.quiz.title,
    attemptedAt: a.createdAt.toISOString(),
  }));

  return <ShowResultData data={quizzes} />;
}

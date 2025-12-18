import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { QuestionForm } from "./form";

const QuestionSubPage = async ({
  params,
}: {
  params: { questionId: string };
}) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const { questionId } = await params;

  let question;
  if (questionId !== "create") {
    question = await prisma.question.findFirst({
      where: { id: questionId, user_id: userId },
    });
  }

  const quiz = await prisma.quiz.findMany({ where: { user_id: userId } });

  return (
    <div className="gap-4 p-4 md:gap-8 md:p-6">
      <QuestionForm initialData={question} quiz={quiz} />
    </div>
  );
};

export default QuestionSubPage;

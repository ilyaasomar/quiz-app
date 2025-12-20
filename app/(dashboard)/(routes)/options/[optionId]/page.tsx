import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { OptionForm } from "./form";

const OptionSubPage = async ({ params }: { params: { optionId: string } }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const { optionId } = await params;

  let option;
  if (optionId !== "create") {
    option = await prisma.option.findFirst({
      where: { id: optionId, user_id: userId },
    });
  }
  const question = await prisma.question.findMany({
    where: { user_id: userId },
  });

  const quiz = await prisma.quiz.findMany({ where: { user_id: userId } });

  return (
    <div className="gap-4 p-4 md:gap-8 md:p-6">
      <OptionForm initialData={option} question={question} quiz={quiz} />
    </div>
  );
};

export default OptionSubPage;

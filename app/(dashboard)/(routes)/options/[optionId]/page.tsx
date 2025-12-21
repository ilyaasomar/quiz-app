import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { OptionForm } from "./form";

const OptionSubPage = async ({ params }: { params: { optionId: string } }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const { optionId } = await params;

  let formData = null;

  // If not creating new, fetch all options for this question
  if (optionId !== "create") {
    // First, get the option to find the question_id
    const singleOption = await prisma.option.findFirst({
      where: { id: optionId, user_id: userId },
      include: { question: true, quiz: true },
    });

    if (singleOption) {
      // Fetch ALL options for this question
      const allOptions = await prisma.option.findMany({
        where: {
          question_id: singleOption.question_id,
          user_id: userId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // Transform to match form structure
      formData = {
        quiz_id: singleOption.quiz_id,
        question_id: singleOption.question_id,
        options: allOptions.map((opt) => ({
          id: opt.id,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
      };
    }
  }

  const quiz = await prisma.quiz.findMany({ where: { user_id: userId } });

  return (
    <div className="gap-4 p-4 md:gap-8 md:p-6">
      <OptionForm initialData={formData} quiz={quiz} />
    </div>
  );
};

export default OptionSubPage;

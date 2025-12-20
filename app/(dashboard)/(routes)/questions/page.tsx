import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import ShowQuestionData from "./components/show-data";

const QuestionPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const questionData = await prisma.question.findMany({
    where: { user_id: userId },
    include: { quiz: true },
    orderBy: { createdAt: "asc" },
  });

  const formattedQuestions = questionData.map((question, index) => {
    return {
      serialNo: index + 1,
      id: question.id,
      order: question.order,
      title: question.title,
      quiz: question.quiz.title,
      mark: question.mark,
    };
  });
  return (
    <div>
      <ShowQuestionData data={formattedQuestions} />
    </div>
  );
};

export default QuestionPage;

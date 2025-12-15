import ShowQuizData from "./components/show-data";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

const QuizPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const quizData = await prisma.quiz.findMany({ where: { user_id: userId } });

  const formattedQuiz = quizData.map((quiz, index) => ({
    serialNo: index + 1,
    id: quiz.id,
    title: quiz.title,
    startTime: quiz.startTime,
    endTime: quiz.endTime,
  }));
  return (
    <div>
      <ShowQuizData data={formattedQuiz} />
    </div>
  );
};

export default QuizPage;

import ShowQuizData from "./components/show-data";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

const QuizPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const quizData = await prisma.quiz.findMany({ where: { user_id: userId } });

  const formattedQuiz = quizData.map((quiz, index) => {
    const diffMs = quiz.endTime.getTime() - quiz.startTime.getTime();

    // Convert milliseconds to minutes
    const durationMinutes = diffMs / (1000 * 60);

    return {
      serialNo: index + 1,
      id: quiz.id,
      title: quiz.title,
      startTime: quiz.startTime,
      endTime: quiz.endTime,
      duration: durationMinutes,
    };
  });
  return (
    <div>
      <ShowQuizData data={formattedQuiz} />
    </div>
  );
};

export default QuizPage;

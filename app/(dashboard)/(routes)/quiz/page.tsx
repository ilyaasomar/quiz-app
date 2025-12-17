import ShowQuizData from "./components/show-data";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

const QuizPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const quizData = await prisma.quiz.findMany({ where: { user_id: userId }, orderBy:{createdAt:"asc"} });

  const formattedQuiz = quizData.map((quiz, index) => {
    const diffMs = quiz.endTime.getTime() - quiz.startTime.getTime();

    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    // Calculate hours and remaining minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Format the duration string
    let durationTime = "";
    if (hours > 0) {
      durationTime = `${hours} hour${hours > 1 ? "s" : ""}`;
      if (minutes > 0) {
        durationTime += ` ${minutes} minute${minutes !== 1 ? "s" : ""}`;
      }
    } else {
      durationTime = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }

    return {
      serialNo: index + 1,
      id: quiz.id,
      title: quiz.title,
      startTime: quiz.startTime,
      endTime: quiz.endTime,
      duration: durationTime,
    };
  });
  return (
    <div>
      <ShowQuizData data={formattedQuiz} />
    </div>
  );
};

export default QuizPage;

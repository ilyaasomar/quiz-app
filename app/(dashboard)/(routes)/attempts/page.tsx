import ShowQuizData from "./components/show-data";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import ShowQuizAttemptData from "./components/show-data";

const QuizAttemptPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const quizData = await prisma.quiz.findMany({
    where: { user_id: userId },
    orderBy: { createdAt: "desc" },
  });

  const attempt = await prisma.attempt.findMany({
    where: { user_id: userId },
    select: {
      quiz_id: true,
      question_id: true,
      option_id: true,
      user_id: true,
    },
    orderBy: { createdAt: "desc" },
  });

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
      attempt: attempt.filter((at) => at.quiz_id === quiz.id),
    };
  });

  console.log(attempt);
  return (
    <div>
      <ShowQuizAttemptData data={formattedQuiz} />
    </div>
  );
};

export default QuizAttemptPage;

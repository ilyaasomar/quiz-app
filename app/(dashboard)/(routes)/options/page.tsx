import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import ShowOptionData from "./components/show-data";

const OptionsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const optionData = await prisma.option.findMany({
    where: { user_id: userId },
    include: { quiz: true, question: true },
    orderBy: { createdAt: "asc" },
  });

  const formattedOptions = optionData.map((option, index) => {
    return {
      serialNo: index + 1,
      id: option.id,
      text: option.text,
      isCorrect: option.isCorrect,
      question: option.question.title,
      quiz: option.quiz.title,
    };
  });
  return (
    <div>
      <ShowOptionData data={formattedOptions} />
    </div>
  );
};

export default OptionsPage;

import { styles } from "@/app/styles";
import { Button } from "@/components/ui/button";
import { MousePointerClick } from "lucide-react";
import { useRouter } from "next/navigation";
interface ActionsProps {
  id: string;
  startTime: Date;
  endTime: Date;
  attempt: {
    quiz_id: string;
    question_id: string;
    option_id: string;
    user_id: string;
  }[];
}
const Actions = ({ id, startTime, endTime, attempt }: ActionsProps) => {
  const router = useRouter();
  console.log(attempt);
  const attempted = attempt.length > 0;
  console.log(attempted);

  const currentDate = new Date();
  return (
    <div>
      <div className="flex items-center justify-center gap-x-2">
        <Button
          disabled={
            currentDate > endTime || attempted || currentDate < startTime
          }
          onClick={() => router.push(`/attempts/${id}`)}
          className={`rounded-sm ${styles.primaryBgColor} hover:${styles.primaryBgColor} text-white cursor-pointer`}
        >
          <MousePointerClick className="h-5 w-5 text-white" />
          <p className="font-semibold ">
            {attempted
              ? "Attempted"
              : currentDate <= endTime && currentDate >= startTime
                ? "Take quiz"
                : currentDate < startTime
                  ? "Quiz Left"
                  : "Quiz Ended"}
          </p>
        </Button>
      </div>
    </div>
  );
};

export default Actions;

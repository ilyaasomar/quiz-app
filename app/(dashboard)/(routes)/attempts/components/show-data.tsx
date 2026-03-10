import { styles } from "@/app/styles";
import { DataTable } from "@/components/reusable/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./column";

interface ShowQuizAttemptDataProps {
  data: {
    serialNo: number;
    id: string;
    title: string;
    startTime: Date;
    endTime: Date;
    duration: string | number;
    attempt: {
      quiz_id: string;
      question_id: string;
      option_id: string;
      user_id: string;
    }[];
  }[];
}
const ShowQuizAttemptData = ({ data }: ShowQuizAttemptDataProps) => {
  return (
    <div className="flex flex-col gap-5">
      {/* top head */}
      <div className="flex items-center justify-between bg-accent/60 p-4 rounded-sm">
        {/* header */}
        <Header title="Quiz Attempt" />
      </div>
      {/* data table */}
      <div className="py-4">
        <DataTable columns={columns} data={data} searchKey="title" />
      </div>
    </div>
  );
};

export default ShowQuizAttemptData;

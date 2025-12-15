import { styles } from "@/app/styles";
import { DataTable } from "@/components/reusable/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./column";
import Link from "next/link";

interface ShowQuizDataProps {
  data: {
    serialNo: number;
    id: string;
    title: string;
    startTime: Date;
    endTime: Date;
  }[];
}
const ShowQuizData = ({ data }: ShowQuizDataProps) => {
  return (
    <div className="flex flex-col gap-5">
      {/* top head */}
      <div className="flex items-center justify-between bg-accent/60 p-4 rounded-sm">
        {/* header */}
        <Header title="Quiz" />
        {/* button */}
        <Link href="/quiz/create">
          <Button
            className={`rounded-sm px-6 py-3 ${styles.secondaryBgColor} hover:${styles.secondaryBgColor} text-white hover:text-white dark:${styles.secondaryBgColor} text-white`}
          >
            <Plus className="w-6 h-6" />
            New Quiz
          </Button>
        </Link>
      </div>
      {/* datatable */}
      <div className="py-4">
        <DataTable columns={columns} data={data} searchKey="title" />
      </div>
    </div>
  );
};

export default ShowQuizData;

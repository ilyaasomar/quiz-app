import { styles } from "@/app/styles";
import { DataTable } from "@/components/reusable/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./column";
import Link from "next/link";

interface ShowQuestionDataProps {
  data: {
    serialNo: number;
    id: string;
    order: number;
    title: string;
    quiz: string;
    mark: number;
  }[];
}
const ShowQuestionData = ({ data }: ShowQuestionDataProps) => {
  return (
    <div className="flex flex-col gap-5">
      {/* top head */}
      <div className="flex items-center justify-between bg-accent/60 p-4 rounded-sm">
        {/* header */}
        <Header title="Questions" />
        {/* button */}
        <Link href="/questions/create">
          <Button
            className={`rounded-sm px-6  cursor-pointer py-3 ${styles.secondaryBgColor} hover:${styles.secondaryBgColor} text-white hover:text-white dark:${styles.secondaryBgColor} text-white`}
          >
            <Plus className="w-6 h-6" />
            New Question
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

export default ShowQuestionData;

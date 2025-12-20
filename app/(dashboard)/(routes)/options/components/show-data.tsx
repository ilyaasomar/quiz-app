import { styles } from "@/app/styles";
import { DataTable } from "@/components/reusable/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./column";
import Link from "next/link";
import { Decimal } from "@prisma/client/runtime/client";

interface ShowOptionDataProps {
  data: {
    serialNo: number;
    id: string;
    text: string;
    question: string;
    quiz: string;
    isCorrect: boolean;
  }[];
}
const ShowOptionData = ({ data }: ShowOptionDataProps) => {
  return (
    <div className="flex flex-col gap-5">
      {/* top head */}
      <div className="flex items-center justify-between bg-accent/60 p-4 rounded-sm">
        {/* header */}
        <Header title="Options" />
        {/* button */}
        <Link href="/options/create">
          <Button
            className={`rounded-sm px-6  cursor-pointer py-3 ${styles.secondaryBgColor} hover:${styles.secondaryBgColor} text-white hover:text-white dark:${styles.secondaryBgColor} text-white`}
          >
            <Plus className="w-6 h-6" />
            New Option
          </Button>
        </Link>
      </div>
      {/* datatable */}
      <div className="py-4">
        <DataTable columns={columns} data={data} searchKey="text" />
      </div>
    </div>
  );
};

export default ShowOptionData;

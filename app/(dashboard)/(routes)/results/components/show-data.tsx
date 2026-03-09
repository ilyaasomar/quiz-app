import { DataTable } from "@/components/reusable/data-table";
import Header from "@/components/header";
import { columns, ResultColumn } from "./column";

interface ShowResultDataProps {
  data: ResultColumn[];
}

const ShowResultData = ({ data }: ShowResultDataProps) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between bg-accent/60 p-4 rounded-sm">
        <Header title="My Results" />
      </div>
      <div className="py-4">
        <DataTable columns={columns} data={data} searchKey="quizTitle" />
      </div>
    </div>
  );
};

export default ShowResultData;

"use client";

import { ColumnDef } from "@tanstack/react-table";
import Actions from "./actions";

export type OptionColumn = {
  serialNo: number;
  id: string;
  text: string;
  question: string;
  quiz: string;
  isCorrect: boolean;
};

export const columns: ColumnDef<OptionColumn>[] = [
  {
    accessorKey: "serialNo",
    header: "No",
  },
  {
    accessorKey: "text",
    header: "Text",
  },
  {
    accessorKey: "question",
    header: "Question",
  },
  {
    accessorKey: "quiz",
    header: "Quiz",
  },
  {
    accessorKey: "isCorrect",
    header: "Correct",
  },

  {
    header: "Actions",
    cell: ({ row }) => {
      return <Actions id={row.original.id} />;
    },
  },
];

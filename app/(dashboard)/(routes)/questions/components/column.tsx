"use client";

import { ColumnDef } from "@tanstack/react-table";
import Actions from "./actions";

export type QuestionColumn = {
  serialNo: number;
  id: string;
  order: number;
  title: string;
  quiz: string;
  mark: number;
};

export const columns: ColumnDef<QuestionColumn>[] = [
  {
    accessorKey: "serialNo",
    header: "No",
  },
  {
    accessorKey: "order",
    header: "QNO",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "quiz",
    header: "Quiz",
  },
  {
    accessorKey: "mark",
    header: "Marks",
  },

  {
    header: "Actions",
    cell: ({ row }) => {
      return <Actions id={row.original.id} />;
    },
  },
];

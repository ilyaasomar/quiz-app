"use client";

import { ColumnDef } from "@tanstack/react-table";
import Actions from "./actions";
import { Decimal } from "@prisma/client/runtime/client";

export type QuestionColumn = {
  serialNo: number;
  id: string;
  order: number;
  title: string;
  mark: number | Decimal;
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

"use client";

import { ColumnDef } from "@tanstack/react-table";

export type QuizColumn = {
  serialNo: number;
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
};

export const columns: ColumnDef<QuizColumn>[] = [
  {
    accessorKey: "serialNo",
    header: "No",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
  },
  {
    accessorKey: "endTime",
    header: "End Time",
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";

export type QuizColumn = {
  serialNo: number;
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  duration: string | number;
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
    cell: ({ row }) => {
      return row.original.startTime.toLocaleString();
    },
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: ({ row }) => {
      return row.original.endTime.toLocaleString();
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      return row.original.duration + " Minute";
    },
  },
];

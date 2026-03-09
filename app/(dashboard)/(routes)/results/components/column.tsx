"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { styles } from "@/app/styles";

export type ResultColumn = {
  serialNo: number;
  quizId: string;
  quizTitle: string;
  attemptedAt: string;
};

export const columns: ColumnDef<ResultColumn>[] = [
  {
    accessorKey: "serialNo",
    header: "No",
  },
  {
    accessorKey: "quizTitle",
    header: "Quiz Title",
  },
  {
    accessorKey: "attemptedAt",
    header: "Attempted At",
    cell: ({ row }) => {
      return new Date(row.original.attemptedAt).toLocaleString();
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Link href={`/results/${row.original.quizId}`}>
          <div
            className={`flex items-center justify-center w-7 h-7 p-1 rounded-sm ${styles.primaryBgColor} text-white cursor-pointer`}
          >
            <Eye className="h-5 w-5 text-white" />
          </div>
        </Link>
      );
    },
  },
];

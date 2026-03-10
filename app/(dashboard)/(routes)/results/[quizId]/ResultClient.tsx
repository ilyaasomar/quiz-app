"use client";

import {
  CheckCircle2,
  XCircle,
  Trophy,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { styles } from "@/app/styles";

interface Attempt {
  questionTitle: string;
  selectedOption: string;
  isCorrect: boolean;
  mark: number;
  earnedMark: number;
}

interface ResultData {
  quizTitle: string;
  totalMarks: number;
  earnedMarks: number;
  percentage: number;
  attempts: Attempt[];
}

export default function ResultClient({ data }: { data: ResultData }) {
  const { quizTitle, totalMarks, earnedMarks, percentage, attempts } = data;
  const passed = percentage >= 50;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <Link href="/results">
        <Button
          variant="default"
          size="sm"
          className={`${styles.secondaryBgColor} hover:${styles.secondaryBgColor} cursor-pointer gap-2 mb-2 rounded-sm`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Results
        </Button>
      </Link>

      <Card className={passed ? "border-green-500" : "border-red-400"}>
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-2">
            <Trophy
              className={`w-10 h-10 ${passed ? "text-green-500" : "text-red-400"}`}
            />
          </div>
          <CardTitle className="text-2xl">{quizTitle}</CardTitle>
          <p className="text-muted-foreground text-sm">Quiz Results</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 divide-x text-center">
            <div className="py-4">
              <p className="text-3xl font-bold">{percentage}%</p>
              <p className="text-xs text-muted-foreground mt-1">Score</p>
            </div>
            <div className="py-4">
              <p className="text-3xl font-bold">
                {earnedMarks}/{totalMarks}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Marks</p>
            </div>
            <div className="py-4">
              <p className="text-3xl font-bold">
                {attempts.filter((a) => a.isCorrect).length}/{attempts.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Correct</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Badge
              variant={passed ? "default" : "destructive"}
              className="text-sm px-4 py-1"
            >
              {passed ? "Passed 🎉" : "Failed — Try Again"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Question Breakdown
        </h2>

        {attempts.map((attempt, i) => (
          <Card
            key={i}
            className={`border-l-4 ${attempt.isCorrect ? "border-l-green-500" : "border-l-red-400"}`}
          >
            <CardContent className="py-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {attempt.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="font-medium text-sm">{attempt.questionTitle}</p>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    Your answer:{" "}
                    <span
                      className={
                        attempt.isCorrect ? "text-green-600" : "text-red-500"
                      }
                    >
                      {attempt.selectedOption}
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold">
                  {attempt.earnedMark}/{attempt.mark}
                </p>
                <p className="text-xs text-muted-foreground">marks</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

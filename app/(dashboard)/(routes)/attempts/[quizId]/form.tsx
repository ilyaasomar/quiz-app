"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import OptionCard from "./optionCard";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AttemptFormProps {
  data: {
    id: string;
    title: string;
    options: {
      id: string;
      text: string;
    }[];
    quiz: {
      id: string;
      title: string;
    };
  }[];
}

const AttemptForm = ({ data }: AttemptFormProps) => {
  const router = useRouter();
  // 1️⃣ which question page we are on
  const [currentIndex, setCurrentIndex] = useState(0);

  // 2️⃣ store answers: questionId -> optionId
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // 3️⃣ current question (THIS is the magic)
  const currentQuestion = data[currentIndex];

  // 4️⃣ save selected option
  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  // 5️⃣ navigation
  const handleNext = () => {
    if (!answers[currentQuestion.id]) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const isLastQuestion = currentIndex === data.length - 1;

  const mutation = useMutation({
    mutationFn: async (values: {
      quizId: string;
      answers: { questionId: string; optionId: string }[];
    }) => {
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to submit");
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong");
    },
  });
  const handleSubmit = () => {
    const { quizId, _, ...answersData } = answers;
    const payload = {
      quizId: data[0]?.quiz?.id,
      answers: Object.entries(answersData).map(([questionId, optionId]) => ({
        questionId,
        optionId,
      })),
    };
    mutation.mutate(payload);
    console.log(payload);
  };
  return (
    <form className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{data[0].quiz.title}</CardTitle>
          <CardDescription>
            Question {currentIndex + 1} of {data.length}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <OptionCard
            question={currentQuestion}
            selectedOptionId={answers[currentQuestion.id]}
            onSelectOption={handleSelectOption}
          />

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {!isLastQuestion ? (
              <Button type="button" onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit}>
                Submit Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default AttemptForm;

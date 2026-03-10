"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Quiz } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateTimePicker } from "../components/datetime-picket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { styles } from "@/app/styles";
import { useState } from "react";

const formSchema = z
  .object({
    title: z.string().min(2, {
      message: "Quiz title must be at least 2 characters.",
    }),
    startTime: z.date({
      message: "Start date and time is required.",
    }),
    endTime: z.date({
      message: "End date and time is required.",
    }),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time.",
    path: ["endTime"],
  });

interface QuizFormProps {
  initialData: Quiz | null | undefined;
}

export function QuizForm({ initialData }: QuizFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      startTime: undefined,
      endTime: undefined,
    },
  });

  // create and update mutation
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      setLoading(true);
      const url = initialData ? `/api/quiz/${initialData.id}` : "/api/quiz";
      const method = initialData ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          startTime: values.startTime.toISOString(), // Convert to UTC ISO string
          endTime: values.endTime.toISOString(),
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to save quiz");
      }

      setLoading(false);
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      // Invalidate queries to refetch the quiz list
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      // Reset form if creating new
      if (!initialData) {
        form.reset();
      }
      // Navigate back to quiz list
      router.push("/quiz");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  const { isSubmitting, isValid } = form.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Quiz</CardTitle>
            <CardDescription>
              Set up your quiz with a title, start time, and end time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 gap-y-4 md:gap-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Quiz Title</FormLabel>
                    <FormControl>
                      <Input placeholder="JavaScript Basics Quiz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date & Time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date & Time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-start gap-3">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => router.push("/quiz")}
              className="rounded-sm cursor-pointer"
              disabled={isSubmitting || loading}
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Quiz
            </Button>
            <Button
              type="submit"
              className={`rounded-sm cursor-pointer ${styles.secondaryBgColor} hover:${styles.secondaryBgColor}`}
              disabled={isSubmitting || !isValid || loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : ""}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

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
import { Question, Quiz } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { styles } from "@/app/styles";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "question title must be at least 2 characters.",
  }),
  quiz_id: z.string().min(1, {
    message: "quiz must be select.",
  }),
  mark: z.number().min(1, {
    message: "marks must be at least 1 number.",
  }),
});

interface QuestionFormProps {
  initialData: Question | null | undefined;
  quiz: Quiz[];
}

export function QuestionForm({ initialData, quiz }: QuestionFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      quiz_id: "",
      mark: 0,
    },
  });

  // create and update mutation
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      setLoading(true);
      const url = initialData
        ? `/api/question/${initialData.id}`
        : "/api/question";
      const method = initialData ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          mark: values.mark,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to save question");
      }

      setLoading(false);
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      // Invalidate queries to refetch the quiz list
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      // Reset form if creating new
      if (!initialData) {
        form.reset();
      }
      // Navigate back to quiz list
      router.push("/questions");
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
            <CardTitle>Create Question</CardTitle>
            <CardDescription>Register up your question here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What is the correct syntax of JavaScript function"
                        {...field}
                        disabled={isSubmitting || loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quiz_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isSubmitting || loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        // defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Quiz" />
                        </SelectTrigger>
                        <SelectContent>
                          {quiz?.map((q) => (
                            <SelectItem value={q.id}>{q.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marks</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        disabled={isSubmitting || loading}
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
              onClick={() => router.push("/questions")}
              className="rounded-sm cursor-pointer"
              disabled={isSubmitting || loading}
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Questions
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

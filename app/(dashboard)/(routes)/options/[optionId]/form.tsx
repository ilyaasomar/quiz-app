"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { styles } from "@/app/styles";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  quiz_id: z.string().min(1, "Please select a quiz"),
  question_id: z.string().min(1, "Please select a question"),
  options: z
    .array(
      z.object({
        text: z.string().min(1, "Option text is required"),
        isCorrect: z.boolean(),
      })
    )
    .min(2, "You must provide at least 2 options")
    .max(10, "You can provide maximum 10 options")
    .refine(
      (options) => options.filter((opt) => opt.isCorrect).length === 1,
      "Exactly one option must be marked as correct"
    ),
});

interface OptionFormProps {
  initialData?: {
    quiz_id: string;
    question_id: string;
    options: Array<{
      id?: string;
      text: string;
      isCorrect: boolean;
    }>;
  } | null;
  quiz: Quiz[];
}

export function OptionForm({ initialData, quiz }: OptionFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      quiz_id: "",
      question_id: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  });

  const { fields, update, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const selectedQuizId = form.watch("quiz_id");

  const callQuestionApi = async (quizId: string) => {
    const response = await fetch(`/api/quiz/${quizId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    return response.json();
  };

  const { data: questionsData, isLoading } = useQuery({
    queryKey: ["question", selectedQuizId],
    queryFn: () => callQuestionApi(selectedQuizId),
    enabled: !!selectedQuizId,
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      setLoading(true);
      const url = initialData
        ? `/api/option/${values.question_id}`
        : "/api/option";
      const method = initialData ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      setLoading(false);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save options");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Options saved successfully");
      queryClient.invalidateQueries({ queryKey: ["options"] });
      if (!initialData) {
        form.reset();
      }
      router.push("/options");
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
            <CardTitle>Create Options</CardTitle>
            <CardDescription>Register your options here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Quiz and Question Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Quiz" />
                          </SelectTrigger>
                          <SelectContent>
                            {quiz?.map((q) => (
                              <SelectItem key={q.id} value={q.id}>
                                {q.title}
                              </SelectItem>
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
                  name="question_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Select
                          disabled={isSubmitting || loading || !selectedQuizId}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                !selectedQuizId
                                  ? "Select quiz first"
                                  : isLoading
                                  ? "Loading questions..."
                                  : "Select question"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {questionsData?.map((q: Question) => (
                              <SelectItem key={q.id} value={q.id}>
                                {q.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Options Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold">
                      Answer Options
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter at least 2 options and mark the correct one
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ text: "", isCorrect: false })}
                    disabled={isSubmitting || loading || fields.length >= 10}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Option
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm font-medium text-muted-foreground min-w-[20px]">
                          {index + 1}.
                        </span>
                        <FormField
                          control={form.control}
                          name={`options.${index}.text`}
                          render={({ field }) => (
                            <FormItem className="flex-1 space-y-0">
                              <FormControl>
                                <Input
                                  placeholder={`Option ${index + 1}`}
                                  {...field}
                                  disabled={isSubmitting || loading}
                                  className="h-9"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={`correct-${index}`}
                            className="text-sm text-muted-foreground cursor-pointer"
                          >
                            Correct
                          </Label>
                          <input
                            id={`correct-${index}`}
                            type="radio"
                            name="correctOption"
                            checked={form.watch(`options.${index}.isCorrect`)}
                            onChange={() => {
                              fields.forEach((_, i) => {
                                update(i, {
                                  ...form.getValues(`options.${i}`),
                                  isCorrect: i === index,
                                });
                              });
                            }}
                            disabled={isSubmitting || loading}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </div>

                        {fields.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={isSubmitting || loading}
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {form.formState.errors.options && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.options.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-start gap-3">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => router.push("/options")}
              className="rounded-sm cursor-pointer"
              disabled={isSubmitting || loading}
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Options
            </Button>
            <Button
              type="submit"
              className={`rounded-sm cursor-pointer ${styles.secondaryBgColor} hover:${styles.secondaryBgColor}`}
              disabled={isSubmitting || !isValid || loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {initialData ? "Update Options" : "Create Options"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ClipboardList, MousePointerClick } from "lucide-react";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const quizzes = await prisma.quiz.findMany({
    where: { user_id: userId },
    orderBy: { createdAt: "desc" },
  });

  const quizCount = quizzes.length;
  const attemptCount = await prisma.attempt.count({
    where: { user_id: userId },
  });
  const questionCount = await prisma.question.count({
    where: { user_id: userId },
  });

  const formattedQuiz = quizzes.map((quiz, index) => {
    const diffMs = quiz.endTime.getTime() - quiz.startTime.getTime();
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const duration = `${hours}h ${minutes}m`;

    return {
      no: index + 1,
      title: quiz.title,
      startTime: new Date(quiz.startTime).toLocaleString(),
      endTime: new Date(quiz.endTime).toLocaleString(),
      duration,
    };
  });
  return (
    <div className="flex-1 bg-gray-50 dark:bg-[#171717] min-h-screen p-8 space-y-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .dash-font { font-family: 'Plus Jakarta Sans', sans-serif; }
        .card-blue { background: linear-gradient(135deg, #4191F9 0%, #2563eb 100%); }
        .card-green { background: linear-gradient(135deg, #10B981 0%, #059669 100%); }
        .card-gray { background: linear-gradient(135deg, #6B7280 0%, #4B5563 100%); }
        .card-shine::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        }
        .stat-card:hover { transform: translateY(-3px); }
        .stat-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
      `}</style>

      {/* Header */}
      <div className="dash-font">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Welcome back! Here's what's going on.
        </p>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-3 gap-5 dash-font">
        {/* Quizzes — Blue */}
        <div className="stat-card card-blue card-shine relative rounded-2xl p-6 py-8 overflow-hidden shadow-lg shadow-[#4191F9]/25">
          {/* decorative circles */}
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -right-2 w-20 h-20 rounded-full bg-white/5" />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">
                Total Quizzes
              </p>
              <p className="text-4xl font-extrabold text-white leading-none">
                {quizCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Questions — Green */}
        <div className="stat-card card-green card-shine relative rounded-2xl p-6 py-8 overflow-hidden shadow-lg shadow-[#10B981]/25">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -right-2 w-20 h-20 rounded-full bg-white/5" />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">
                Total Questions
              </p>
              <p className="text-4xl font-extrabold text-white leading-none">
                {questionCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Attempts — Gray */}
        <div className="stat-card card-gray card-shine relative rounded-2xl p-6 py-8 overflow-hidden shadow-lg shadow-[#6B7280]/25">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -right-2 w-20 h-20 rounded-full bg-white/5" />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">
                Total Attempts
              </p>
              <p className="text-4xl font-extrabold text-white leading-none">
                {attemptCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <MousePointerClick className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Table */}
      <Card className="border-0 shadow-sm dash-font">
        <CardContent className="p-0">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">
              Quizzes
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              All quizzes with schedule and current status
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 ">
                  {["No", "Title", "Start Time", "End Time", "Duration"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 dark:text-white uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {formattedQuiz.map((quiz, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-800 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 ">
                      <span className="w-7 h-7 rounded-lg bg-[#4191F9]/10  text-[#4191F9] text-xs font-bold flex items-center justify-center">
                        {quiz.no}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-700 dark:text-white">
                        {quiz.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500 dark:text-white">
                        {quiz.startTime as string}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500 dark:text-white">
                        {quiz.endTime as string}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                        {quiz.duration}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 dark:bg-gray-800">
            <p className="text-xs text-gray-400">
              Total quizzes: {quizzes.length}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

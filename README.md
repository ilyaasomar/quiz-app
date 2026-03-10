# Quiz App

A **full-stack quiz application** built with **Next.js**, **TypeScript**, **Prisma**, and **PostgreSQL**, featuring timed multiple-choice quizzes, attempt tracking, and automatic scoring. The app includes a clean dashboard with a collapsible sidebar using **shadcn/ui** components.

---

Demo Here("").
NB: you can register your own user by sign-up form

## Features

- ✅ Timed quizzes
- ✅ Multiple-choice questions (MCQs)
- ✅ Automatic score calculation
- ✅ Quiz attempt tracking
- ✅ Collapsible sidebar UI
- ✅ Modern responsive dashboard

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **UI Components:** shadcn/ui, Tailwind CSS
- **Icons:** Lucide React, React Icons
- **Authentication:** Better Auth

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/quiz-app.git
cd quiz-app

pnpm install
# or
yarn

DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
NEXT_PUBLIC_APP_URL=http://localhost:3000

npx prisma migrate dev --name init

pnpm run dev
# or
yarn dev
```

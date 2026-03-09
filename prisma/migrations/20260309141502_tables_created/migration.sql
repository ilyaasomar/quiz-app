/*
  Warnings:

  - You are about to drop the column `endTime` on the `Attempt` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Attempt` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Attempt` table. All the data in the column will be lost.
  - You are about to drop the column `user_d` on the `Attempt` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Attempt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attempt" DROP CONSTRAINT "Attempt_user_d_fkey";

-- AlterTable
ALTER TABLE "Attempt" DROP COLUMN "endTime",
DROP COLUMN "startTime",
DROP COLUMN "text",
DROP COLUMN "user_d",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

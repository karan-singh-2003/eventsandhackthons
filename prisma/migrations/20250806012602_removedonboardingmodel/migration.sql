/*
  Warnings:

  - You are about to drop the `OnboardingProgress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."OnboardingProgress" DROP CONSTRAINT "OnboardingProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OnboardingProgress" DROP CONSTRAINT "OnboardingProgress_workspaceId_fkey";

-- DropTable
DROP TABLE "public"."OnboardingProgress";

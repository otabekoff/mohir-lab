-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('video', 'text', 'quiz', 'assignment', 'coding', 'project', 'task', 'exam', 'milestone', 'discussion', 'announcement', 'survey', 'resource', 'external', 'live', 'group_work', 'certificate');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('multiple_choice', 'multi_select', 'true_false', 'fill_blank', 'matching', 'short_answer', 'code');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('draft', 'submitted', 'under_review', 'graded', 'returned');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ResourceType" ADD VALUE 'slides';
ALTER TYPE "ResourceType" ADD VALUE 'cheatsheet';
ALTER TYPE "ResourceType" ADD VALUE 'source_code';

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "allowComments" BOOLEAN DEFAULT true,
ADD COLUMN     "allowFileUpload" BOOLEAN DEFAULT true,
ADD COLUMN     "allowTextSubmission" BOOLEAN DEFAULT true,
ADD COLUMN     "allowedFileTypes" TEXT,
ADD COLUMN     "allowedLanguages" TEXT,
ADD COLUMN     "content" TEXT,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "externalType" TEXT,
ADD COLUMN     "externalUrl" TEXT,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "maxFileSize" INTEGER,
ADD COLUMN     "passingScore" INTEGER DEFAULT 70,
ADD COLUMN     "recordingUrl" TEXT,
ADD COLUMN     "requiredLessons" TEXT,
ADD COLUMN     "requiresManualReview" BOOLEAN DEFAULT true,
ADD COLUMN     "scheduledAt" TIMESTAMP(3),
ADD COLUMN     "showAnswers" BOOLEAN DEFAULT true,
ADD COLUMN     "shuffleOptions" BOOLEAN DEFAULT false,
ADD COLUMN     "solutionCode" TEXT,
ADD COLUMN     "starterCode" TEXT,
ADD COLUMN     "subtitlesUrl" TEXT,
ADD COLUMN     "testCases" TEXT,
ADD COLUMN     "timeLimit" INTEGER,
ADD COLUMN     "type" "LessonType" NOT NULL DEFAULT 'video',
ADD COLUMN     "videoThumbnail" TEXT,
ALTER COLUMN "videoUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "LessonProgress" ADD COLUMN     "codePassed" BOOLEAN,
ADD COLUMN     "codeScore" INTEGER,
ADD COLUMN     "lastQuizDate" TIMESTAMP(3),
ADD COLUMN     "quizAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quizScore" INTEGER;

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'multiple_choice',
    "question" TEXT NOT NULL,
    "explanation" TEXT,
    "points" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "matchesTo" TEXT,

    CONSTRAINT "QuizOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAnswer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonSubmission" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'draft',
    "textContent" TEXT,
    "codeContent" TEXT,
    "fileUrls" TEXT,
    "codeOutput" TEXT,
    "testResults" TEXT,
    "passedTests" INTEGER,
    "totalTests" INTEGER,
    "score" INTEGER,
    "feedback" TEXT,
    "gradedBy" TEXT,
    "gradedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonComment" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isInstructor" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuizQuestion_lessonId_idx" ON "QuizQuestion"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizQuestion_lessonId_order_key" ON "QuizQuestion"("lessonId", "order");

-- CreateIndex
CREATE INDEX "QuizOption_questionId_idx" ON "QuizOption"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizOption_questionId_order_key" ON "QuizOption"("questionId", "order");

-- CreateIndex
CREATE INDEX "QuizAnswer_questionId_idx" ON "QuizAnswer"("questionId");

-- CreateIndex
CREATE INDEX "QuizAnswer_userId_idx" ON "QuizAnswer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizAnswer_questionId_userId_key" ON "QuizAnswer"("questionId", "userId");

-- CreateIndex
CREATE INDEX "LessonSubmission_lessonId_idx" ON "LessonSubmission"("lessonId");

-- CreateIndex
CREATE INDEX "LessonSubmission_userId_idx" ON "LessonSubmission"("userId");

-- CreateIndex
CREATE INDEX "LessonSubmission_status_idx" ON "LessonSubmission"("status");

-- CreateIndex
CREATE UNIQUE INDEX "LessonSubmission_lessonId_userId_key" ON "LessonSubmission"("lessonId", "userId");

-- CreateIndex
CREATE INDEX "LessonComment_lessonId_idx" ON "LessonComment"("lessonId");

-- CreateIndex
CREATE INDEX "LessonComment_userId_idx" ON "LessonComment"("userId");

-- CreateIndex
CREATE INDEX "LessonComment_parentId_idx" ON "LessonComment"("parentId");

-- CreateIndex
CREATE INDEX "Lesson_type_idx" ON "Lesson"("type");

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizOption" ADD CONSTRAINT "QuizOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSubmission" ADD CONSTRAINT "LessonSubmission_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonComment" ADD CONSTRAINT "LessonComment_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonComment" ADD CONSTRAINT "LessonComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "LessonComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

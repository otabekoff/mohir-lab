"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  ChevronRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Lesson, QuizQuestion } from "@/types";

interface QuizLessonProps {
  lesson: Lesson;
  questions: QuizQuestion[];
  onComplete?: (score: number, passed: boolean) => void;
  onSubmitAnswer?: (
    questionId: string,
    answer: string,
    isCorrect: boolean,
  ) => void;
  previousAttempts?: number;
  bestScore?: number;
}

interface QuizState {
  currentIndex: number;
  answers: Record<string, string | string[]>;
  submitted: boolean;
  score: number;
  showExplanation: boolean;
}

export function QuizLesson({
  lesson,
  questions,
  onComplete,
  onSubmitAnswer,
  previousAttempts = 0,
  bestScore,
}: QuizLessonProps) {
  const [state, setState] = useState<QuizState>({
    currentIndex: 0,
    answers: {},
    submitted: false,
    score: 0,
    showExplanation: false,
  });
  const [timeLeft, setTimeLeft] = useState<number | null>(
    lesson.timeLimit ? lesson.timeLimit * 60 : null,
  );
  const [quizStarted, setQuizStarted] = useState(false);

  const currentQuestion = questions[state.currentIndex];
  const totalQuestions = questions.length;
  const passingScore = lesson.passingScore || 70;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setState({
      currentIndex: 0,
      answers: {},
      submitted: false,
      score: 0,
      showExplanation: false,
    });
    if (lesson.timeLimit) {
      setTimeLeft(lesson.timeLimit * 60);
    }
  };

  const handleAnswer = (value: string | string[]) => {
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: value,
      },
    }));
  };

  const handleNext = () => {
    if (state.currentIndex < totalQuestions - 1) {
      setState((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        showExplanation: false,
      }));
    }
  };

  const handlePrevious = () => {
    if (state.currentIndex > 0) {
      setState((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex - 1,
        showExplanation: false,
      }));
    }
  };

  const checkAnswer = (question: QuizQuestion, answer: string | string[]) => {
    if (!question.options) return false;

    if (question.type === "multi_select") {
      const correctOptions = question.options
        .filter((o) => o.isCorrect)
        .map((o) => o.id);
      const selectedOptions = Array.isArray(answer) ? answer : [answer];
      return (
        correctOptions.length === selectedOptions.length &&
        correctOptions.every((id) => selectedOptions.includes(id))
      );
    }

    if (question.type === "true_false" || question.type === "multiple_choice") {
      const correctOption = question.options.find((o) => o.isCorrect);
      return correctOption?.id === answer;
    }

    if (question.type === "fill_blank") {
      const correctOption = question.options.find((o) => o.isCorrect);
      return (
        correctOption?.text.toLowerCase().trim() ===
        String(answer).toLowerCase().trim()
      );
    }

    return false;
  };

  const handleSubmitQuiz = useCallback(() => {
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach((question) => {
      const answer = state.answers[question.id];
      totalPoints += question.points;

      if (answer && checkAnswer(question, answer)) {
        earnedPoints += question.points;
        onSubmitAnswer?.(question.id, JSON.stringify(answer), true);
      } else {
        onSubmitAnswer?.(question.id, JSON.stringify(answer), false);
      }
    });

    const scorePercentage = Math.round((earnedPoints / totalPoints) * 100);
    const passed = scorePercentage >= passingScore;

    setState((prev) => ({
      ...prev,
      submitted: true,
      score: scorePercentage,
    }));

    onComplete?.(scorePercentage, passed);
  }, [questions, state.answers, passingScore, onComplete, onSubmitAnswer]);

  // Timer - must be after handleSubmitQuiz is defined
  useEffect(() => {
    if (!quizStarted || timeLeft === null || state.submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, state.submitted, handleSubmitQuiz]);

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const currentAnswer = state.answers[currentQuestion.id];

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Question {state.currentIndex + 1} of {totalQuestions}
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {currentQuestion.points} point
              {currentQuestion.points !== 1 && "s"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-medium">{currentQuestion.question}</p>

          {/* Multiple Choice */}
          {currentQuestion.type === "multiple_choice" &&
            currentQuestion.options && (
              <RadioGroup
                value={currentAnswer as string}
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {currentQuestion.options
                  .sort((a, b) => a.order - b.order)
                  .map((option) => (
                    <div
                      key={option.id}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg border p-4 transition-colors",
                        currentAnswer === option.id &&
                          "border-primary bg-primary/5",
                        state.submitted &&
                          option.isCorrect &&
                          "border-green-500 bg-green-50",
                        state.submitted &&
                          currentAnswer === option.id &&
                          !option.isCorrect &&
                          "border-red-500 bg-red-50",
                      )}
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        disabled={state.submitted}
                      />
                      <Label
                        htmlFor={option.id}
                        className="flex-1 cursor-pointer"
                      >
                        {option.text}
                      </Label>
                      {state.submitted && option.isCorrect && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {state.submitted &&
                        currentAnswer === option.id &&
                        !option.isCorrect && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                    </div>
                  ))}
              </RadioGroup>
            )}

          {/* True/False */}
          {currentQuestion.type === "true_false" && currentQuestion.options && (
            <RadioGroup
              value={currentAnswer as string}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg border p-4 transition-colors",
                    currentAnswer === option.id &&
                      "border-primary bg-primary/5",
                  )}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    disabled={state.submitted}
                  />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* Multi Select */}
          {currentQuestion.type === "multi_select" &&
            currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options
                  .sort((a, b) => a.order - b.order)
                  .map((option) => {
                    const selected = Array.isArray(currentAnswer)
                      ? currentAnswer.includes(option.id)
                      : false;
                    return (
                      <div
                        key={option.id}
                        className={cn(
                          "flex items-center space-x-3 rounded-lg border p-4 transition-colors",
                          selected && "border-primary bg-primary/5",
                        )}
                      >
                        <Checkbox
                          id={option.id}
                          checked={selected}
                          disabled={state.submitted}
                          onCheckedChange={(checked) => {
                            const current = Array.isArray(currentAnswer)
                              ? currentAnswer
                              : [];
                            if (checked) {
                              handleAnswer([...current, option.id]);
                            } else {
                              handleAnswer(
                                current.filter((id) => id !== option.id),
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={option.id}
                          className="flex-1 cursor-pointer"
                        >
                          {option.text}
                        </Label>
                      </div>
                    );
                  })}
              </div>
            )}

          {/* Fill in the blank */}
          {currentQuestion.type === "fill_blank" && (
            <Input
              value={(currentAnswer as string) || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer..."
              disabled={state.submitted}
              className="max-w-md"
            />
          )}

          {/* Explanation (after submit) */}
          {state.submitted &&
            lesson.showAnswers &&
            currentQuestion.explanation && (
              <Alert>
                <HelpCircle className="h-4 w-4" />
                <AlertDescription>
                  {currentQuestion.explanation}
                </AlertDescription>
              </Alert>
            )}
        </CardContent>
      </Card>
    );
  };

  // Quiz not started
  if (!quizStarted) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <HelpCircle className="h-6 w-6 text-purple-600" />
            {lesson.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-muted-foreground">Questions</p>
              <p className="text-2xl font-bold">{totalQuestions}</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-muted-foreground">Passing Score</p>
              <p className="text-2xl font-bold">{passingScore}%</p>
            </div>
            {lesson.timeLimit && (
              <div className="rounded-lg border p-4 text-center">
                <p className="text-muted-foreground">Time Limit</p>
                <p className="text-2xl font-bold">{lesson.timeLimit} min</p>
              </div>
            )}
            {previousAttempts > 0 && (
              <div className="rounded-lg border p-4 text-center">
                <p className="text-muted-foreground">Previous Attempts</p>
                <p className="text-2xl font-bold">{previousAttempts}</p>
              </div>
            )}
          </div>

          {bestScore !== undefined && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your best score: <strong>{bestScore}%</strong>
                {bestScore >= passingScore ? " (Passed)" : " (Not passed)"}
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={handleStartQuiz} className="w-full" size="lg">
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Quiz submitted - show results
  if (state.submitted) {
    const passed = state.score >= passingScore;
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {passed ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <XCircle className="h-8 w-8 text-red-500" />
            )}
            Quiz {passed ? "Passed!" : "Not Passed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="mx-auto w-40">
            <div className="relative">
              <Progress
                value={state.score}
                className={cn(
                  "h-4",
                  passed ? "[&>div]:bg-green-500" : "[&>div]:bg-red-500",
                )}
              />
              <span className="mt-2 block text-3xl font-bold">
                {state.score}%
              </span>
              <span className="text-sm text-muted-foreground">
                Passing score: {passingScore}%
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            {!passed && (
              <Button
                onClick={handleStartQuiz}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}
            {lesson.showAnswers && (
              <Button
                onClick={() =>
                  setState((prev) => ({ ...prev, currentIndex: 0 }))
                }
              >
                Review Answers
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Quiz in progress
  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="flex items-center justify-between rounded-lg border bg-card p-4">
        <div className="flex items-center gap-4">
          <Progress
            value={(state.currentIndex / totalQuestions) * 100}
            className="w-32"
          />
          <span className="text-sm text-muted-foreground">
            {state.currentIndex + 1} / {totalQuestions}
          </span>
        </div>
        {timeLeft !== null && (
          <div
            className={cn(
              "flex items-center gap-2 text-sm font-medium",
              timeLeft < 60 && "text-red-600",
            )}
          >
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Question */}
      {renderQuestion()}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={state.currentIndex === 0}
        >
          Previous
        </Button>

        {state.currentIndex < totalQuestions - 1 ? (
          <Button onClick={handleNext} className="gap-2">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmitQuiz}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            Submit Quiz
          </Button>
        )}
      </div>
    </div>
  );
}

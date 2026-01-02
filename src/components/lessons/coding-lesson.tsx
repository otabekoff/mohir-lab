"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Code,
  Terminal,
  FileCode,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Lesson } from "@/types";

interface CodingLessonProps {
  lesson: Lesson;
  onSubmit?: (code: string) => Promise<{
    passed: boolean;
    output: string;
    testResults: Array<{ name: string; passed: boolean; message?: string }>;
  }>;
  onComplete?: () => void;
  savedCode?: string;
}

interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

export function CodingLesson({
  lesson,
  onSubmit,
  onComplete,
  savedCode,
}: CodingLessonProps) {
  const [code, setCode] = useState(savedCode || lesson.starterCode || "");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [allPassed, setAllPassed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const language = lesson.language || "javascript";

  // Parse test cases from JSON (used by onSubmit handler)
  const _testCases = lesson.testCases ? JSON.parse(lesson.testCases) : [];
  void _testCases; // Reserved for future use in local validation

  const handleRun = async () => {
    if (!onSubmit) return;
    setIsRunning(true);
    setOutput("");
    setTestResults([]);

    try {
      const result = await onSubmit(code);
      setOutput(result.output);
      setTestResults(result.testResults);
      setAllPassed(result.passed);

      if (result.passed) {
        onComplete?.();
      }
    } catch (error) {
      setOutput(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(lesson.starterCode || "");
    setOutput("");
    setTestResults([]);
    setAllPassed(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(300, textarea.scrollHeight)}px`;
    }
  }, [code]);

  // Handle tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      // Set cursor position after tab
      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd =
          start + 2;
      }, 0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Code className="h-5 w-5 text-cyan-600" />
          <h2 className="text-lg font-semibold">{lesson.title}</h2>
          <Badge variant="secondary">{language}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {lesson.solutionCode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSolution(!showSolution)}
            >
              {showSolution ? "Hide Solution" : "Show Solution"}
            </Button>
          )}
        </div>
      </div>

      {/* Instructions */}
      {lesson.description && (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              {lesson.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Code Editor */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b bg-muted/50 py-3">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              <span className="text-sm font-medium">Code Editor</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleReset}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className={cn(
                "w-full resize-none border-0 bg-gray-900 p-4 font-mono text-sm text-gray-100",
                "focus:ring-0 focus:outline-none",
              )}
              style={{ minHeight: "300px" }}
              spellCheck={false}
            />
          </CardContent>
        </Card>

        {/* Output & Test Results */}
        <Card className="overflow-hidden">
          <Tabs defaultValue="output">
            <CardHeader className="border-b bg-muted/50 py-0">
              <TabsList className="h-10 w-full justify-start rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="output"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <Terminal className="mr-1 h-3.5 w-3.5" />
                  Output
                </TabsTrigger>
                <TabsTrigger
                  value="tests"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <CheckCircle className="mr-1 h-3.5 w-3.5" />
                  Tests
                  {testResults.length > 0 && (
                    <Badge
                      variant={allPassed ? "default" : "destructive"}
                      className="ml-2 h-5 px-1.5"
                    >
                      {testResults.filter((t) => t.passed).length}/
                      {testResults.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="p-0">
              <TabsContent value="output" className="m-0">
                <pre
                  className={cn(
                    "min-h-75 overflow-auto bg-gray-900 p-4 font-mono text-sm",
                    output ? "text-gray-100" : "text-gray-500",
                  )}
                >
                  {output || "Run your code to see output..."}
                </pre>
              </TabsContent>
              <TabsContent value="tests" className="m-0 min-h-75 p-4">
                {testResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Run your code to see test results
                  </p>
                ) : (
                  <div className="space-y-2">
                    {testResults.map((test, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-start gap-2 rounded-lg p-3",
                          test.passed
                            ? "bg-green-50 text-green-800"
                            : "bg-red-50 text-red-800",
                        )}
                      >
                        {test.passed ? (
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        ) : (
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{test.name}</p>
                          {test.message && (
                            <p className="text-xs opacity-80">{test.message}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* Run Button */}
      <div className="flex items-center justify-between">
        <div>
          {allPassed && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                All tests passed! Exercise completed.
              </AlertDescription>
            </Alert>
          )}
        </div>
        <Button
          onClick={handleRun}
          disabled={isRunning}
          className="gap-2 bg-cyan-600 hover:bg-cyan-700"
        >
          <Play className="h-4 w-4" />
          {isRunning ? "Running..." : "Run Code"}
        </Button>
      </div>

      {/* Solution (collapsible) */}
      {showSolution && lesson.solutionCode && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Solution</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <pre className="overflow-auto bg-gray-900 p-4 font-mono text-sm text-gray-100">
              {lesson.solutionCode}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

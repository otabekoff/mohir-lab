"use client";

import { useState } from "react";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  Paperclip,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Lesson, LessonSubmission, SubmissionStatus } from "@/types";

interface AssignmentLessonProps {
  lesson: Lesson;
  submission?: LessonSubmission | null;
  onSubmit?: (data: { textContent?: string; files?: File[] }) => Promise<void>;
  onSaveDraft?: (data: {
    textContent?: string;
    files?: File[];
  }) => Promise<void>;
}

const statusConfig: Record<
  SubmissionStatus,
  { label: string; color: string; icon: typeof CheckCircle }
> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: FileText },
  submitted: {
    label: "Submitted",
    color: "bg-blue-100 text-blue-800",
    icon: Send,
  },
  under_review: {
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  graded: {
    label: "Graded",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  returned: {
    label: "Returned",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
};

export function AssignmentLesson({
  lesson,
  submission,
  onSubmit,
  onSaveDraft,
}: AssignmentLessonProps) {
  const [textContent, setTextContent] = useState(submission?.textContent || "");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const allowedTypes =
    lesson.allowedFileTypes?.split(",").map((t) => t.trim()) || [];
  const maxFileSize = lesson.maxFileSize || 10; // MB
  const isOverdue = lesson.dueDate
    ? new Date(lesson.dueDate) < new Date()
    : false;
  const canSubmit =
    !submission ||
    submission.status === "draft" ||
    submission.status === "returned";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Validate files
    const validFiles = selectedFiles.filter((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const sizeInMB = file.size / (1024 * 1024);

      if (allowedTypes.length > 0 && !allowedTypes.includes(ext)) {
        alert(`File type .${ext} is not allowed`);
        return false;
      }

      if (sizeInMB > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of ${maxFileSize}MB`);
        return false;
      }

      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!onSubmit) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ textContent, files });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!onSaveDraft) return;
    setIsSaving(true);
    try {
      await onSaveDraft({ textContent, files });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Assignment Instructions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-orange-600" />
              {lesson.title}
            </CardTitle>
            {submission && (
              <Badge className={statusConfig[submission.status].color}>
                {statusConfig[submission.status].label}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Due date warning */}
          {lesson.dueDate && (
            <Alert variant={isOverdue ? "destructive" : "default"}>
              <Clock className="h-4 w-4" />
              <AlertTitle>Due Date</AlertTitle>
              <AlertDescription>
                {isOverdue
                  ? `This assignment was due on ${new Date(lesson.dueDate).toLocaleDateString()}`
                  : `Due by ${new Date(lesson.dueDate).toLocaleDateString()} at ${new Date(lesson.dueDate).toLocaleTimeString()}`}
              </AlertDescription>
            </Alert>
          )}

          {/* Instructions */}
          {lesson.instructions && (
            <div className="prose max-w-none rounded-lg bg-muted/50 p-4 prose-neutral dark:prose-invert">
              <ReactMarkdown>{lesson.instructions}</ReactMarkdown>
            </div>
          )}

          {/* Requirements */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {lesson.allowFileUpload && (
              <span className="flex items-center gap-1">
                <Paperclip className="h-4 w-4" />
                File upload allowed
              </span>
            )}
            {lesson.allowTextSubmission && (
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Text submission allowed
              </span>
            )}
            {allowedTypes.length > 0 && (
              <span>Allowed: {allowedTypes.join(", ")}</span>
            )}
            <span>Max size: {maxFileSize}MB</span>
          </div>
        </CardContent>
      </Card>

      {/* Graded Feedback */}
      {submission?.status === "graded" && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Graded - Score: {submission.score}/100
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submission.feedback && (
              <div className="rounded-lg bg-white p-4">
                <p className="mb-2 text-sm font-medium text-green-800">
                  Instructor Feedback:
                </p>
                <p className="text-gray-700">{submission.feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Returned for revision */}
      {submission?.status === "returned" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Returned for Revision</AlertTitle>
          <AlertDescription>
            {submission.feedback ||
              "Please review the feedback and resubmit your assignment."}
          </AlertDescription>
        </Alert>
      )}

      {/* Submission Form */}
      {canSubmit && (
        <Card>
          <CardHeader>
            <CardTitle>Your Submission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Text submission */}
            {lesson.allowTextSubmission && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Text Response</label>
                <Textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Write your response here..."
                  rows={8}
                  className="resize-none"
                />
              </div>
            )}

            {/* File upload */}
            {lesson.allowFileUpload && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Attachments</label>

                {/* File dropzone */}
                <div
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
                    "hover:border-primary hover:bg-muted/50",
                  )}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {allowedTypes.length > 0
                      ? allowedTypes.join(", ").toUpperCase()
                      : "Any file type"}{" "}
                    up to {maxFileSize}MB
                  </p>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    accept={
                      allowedTypes.length > 0
                        ? allowedTypes.map((t) => `.${t}`).join(",")
                        : undefined
                    }
                  />
                </div>

                {/* Selected files */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border bg-muted/50 p-3"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Previous files */}
                {submission?.fileUrls && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Previously uploaded:
                    </p>
                    {JSON.parse(submission.fileUrls).map(
                      (url: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Paperclip className="h-4 w-4" />
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {url.split("/").pop()}
                          </a>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            )}

            <Separator />

            {/* Action buttons */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSaving || isSubmitting}
              >
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isSaving}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit Assignment"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Already submitted */}
      {submission?.status === "submitted" && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-center gap-3 py-6">
            <Send className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Assignment Submitted</p>
              <p className="text-sm text-blue-700">
                Submitted on{" "}
                {submission.submittedAt
                  ? new Date(submission.submittedAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {submission?.status === "under_review" && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center gap-3 py-6">
            <Clock className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-900">Under Review</p>
              <p className="text-sm text-yellow-700">
                Your submission is being reviewed by the instructor.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

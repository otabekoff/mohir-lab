"use client";

// ============================================
// Course Sections Manager Component
// ============================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
  Play,
  Clock,
  Loader2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  createSection,
  updateSection,
  deleteSection,
  createLesson,
  updateLesson,
  deleteLesson,
} from "@/actions/admin/courses";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  duration: number;
  order: number;
  isFree: boolean;
}

interface Section {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  sections: Section[];
}

interface CourseSectionsProps {
  course: Course;
}

export function CourseSections({ course }: CourseSectionsProps) {
  const router = useRouter();
  const [openSections, setOpenSections] = useState<string[]>(
    course.sections.map((s) => s.id),
  );
  const [isLoading, setIsLoading] = useState(false);

  // Section dialog state
  const [sectionDialog, setSectionDialog] = useState<{
    open: boolean;
    mode: "add" | "edit";
    sectionId?: string;
    title: string;
  }>({ open: false, mode: "add", title: "" });

  // Lesson dialog state
  const [lessonDialog, setLessonDialog] = useState<{
    open: boolean;
    mode: "add" | "edit";
    sectionId?: string;
    lessonId?: string;
    title: string;
    description: string;
    videoUrl: string;
    duration: string;
    isFree: boolean;
  }>({
    open: false,
    mode: "add",
    title: "",
    description: "",
    videoUrl: "",
    duration: "0",
    isFree: false,
  });

  // Delete confirmation state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "section" | "lesson";
    id: string;
    title: string;
  }>({ open: false, type: "section", id: "", title: "" });

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Section handlers
  const handleAddSection = () => {
    setSectionDialog({ open: true, mode: "add", title: "" });
  };

  const handleEditSection = (section: Section) => {
    setSectionDialog({
      open: true,
      mode: "edit",
      sectionId: section.id,
      title: section.title,
    });
  };

  const handleSaveSection = async () => {
    if (!sectionDialog.title.trim()) {
      toast.error("Section title is required");
      return;
    }

    setIsLoading(true);
    try {
      if (sectionDialog.mode === "add") {
        await createSection(course.id, sectionDialog.title);
        toast.success("Section created");
      } else if (sectionDialog.sectionId) {
        await updateSection(sectionDialog.sectionId, sectionDialog.title);
        toast.success("Section updated");
      }
      setSectionDialog({ open: false, mode: "add", title: "" });
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save section",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Lesson handlers
  const handleAddLesson = (sectionId: string) => {
    setLessonDialog({
      open: true,
      mode: "add",
      sectionId,
      title: "",
      description: "",
      videoUrl: "",
      duration: "0",
      isFree: false,
    });
  };

  const handleEditLesson = (lesson: Lesson) => {
    setLessonDialog({
      open: true,
      mode: "edit",
      lessonId: lesson.id,
      title: lesson.title,
      description: lesson.description || "",
      videoUrl: lesson.videoUrl,
      duration: lesson.duration.toString(),
      isFree: lesson.isFree,
    });
  };

  const handleSaveLesson = async () => {
    if (!lessonDialog.title.trim()) {
      toast.error("Lesson title is required");
      return;
    }
    if (!lessonDialog.videoUrl.trim()) {
      toast.error("Video URL is required");
      return;
    }

    setIsLoading(true);
    try {
      const lessonData = {
        title: lessonDialog.title,
        description: lessonDialog.description || undefined,
        videoUrl: lessonDialog.videoUrl,
        duration: parseInt(lessonDialog.duration) || 0,
        isFree: lessonDialog.isFree,
      };

      if (lessonDialog.mode === "add" && lessonDialog.sectionId) {
        await createLesson(lessonDialog.sectionId, lessonData);
        toast.success("Lesson created");
      } else if (lessonDialog.lessonId) {
        await updateLesson(lessonDialog.lessonId, lessonData);
        toast.success("Lesson updated");
      }
      setLessonDialog({
        open: false,
        mode: "add",
        title: "",
        description: "",
        videoUrl: "",
        duration: "0",
        isFree: false,
      });
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save lesson",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      if (deleteDialog.type === "section") {
        await deleteSection(deleteDialog.id);
        toast.success("Section deleted");
      } else {
        await deleteLesson(deleteDialog.id);
        toast.success("Lesson deleted");
      }
      setDeleteDialog({ open: false, type: "section", id: "", title: "" });
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Course Content</CardTitle>
          <Button className="gap-2" onClick={handleAddSection}>
            <Plus className="h-4 w-4" />
            Add Section
          </Button>
        </CardHeader>
        <CardContent>
          {course.sections.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No sections yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add sections to organize your course content
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {course.sections.map((section, sectionIndex) => (
                <Collapsible
                  key={section.id}
                  open={openSections.includes(section.id)}
                  onOpenChange={() => toggleSection(section.id)}
                  className="rounded-lg border"
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex cursor-pointer items-center gap-2 p-4 hover:bg-muted/50">
                      <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
                      {openSections.includes(section.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div className="flex-1">
                        <span className="font-medium">
                          Section {sectionIndex + 1}: {section.title}
                        </span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({section.lessons.length} lessons)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSection(section);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteDialog({
                            open: true,
                            type: "section",
                            id: section.id,
                            title: section.title,
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="border-t px-4 py-2">
                      {section.lessons.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                          No lessons in this section
                        </p>
                      ) : (
                        <div className="space-y-1">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-2 rounded-md p-2 hover:bg-muted/50"
                            >
                              <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
                              <Play className="h-4 w-4 text-muted-foreground" />
                              <span className="flex-1">
                                {sectionIndex + 1}.{lessonIndex + 1}{" "}
                                {lesson.title}
                              </span>
                              {lesson.isFree && (
                                <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                  Free
                                </span>
                              )}
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDuration(lesson.duration)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditLesson(lesson)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setDeleteDialog({
                                    open: true,
                                    type: "lesson",
                                    id: lesson.id,
                                    title: lesson.title,
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        className="mt-2 w-full gap-2"
                        size="sm"
                        onClick={() => handleAddLesson(section.id)}
                      >
                        <Plus className="h-4 w-4" />
                        Add Lesson
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Dialog */}
      <Dialog
        open={sectionDialog.open}
        onOpenChange={(open) => setSectionDialog({ ...sectionDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {sectionDialog.mode === "add" ? "Add Section" : "Edit Section"}
            </DialogTitle>
            <DialogDescription>
              {sectionDialog.mode === "add"
                ? "Create a new section for your course"
                : "Update the section title"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="section-title">Section Title</Label>
              <Input
                id="section-title"
                value={sectionDialog.title}
                onChange={(e) =>
                  setSectionDialog({ ...sectionDialog, title: e.target.value })
                }
                placeholder="e.g., Getting Started"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setSectionDialog({ ...sectionDialog, open: false })
              }
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSection} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {sectionDialog.mode === "add" ? "Create" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog
        open={lessonDialog.open}
        onOpenChange={(open) => setLessonDialog({ ...lessonDialog, open })}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {lessonDialog.mode === "add" ? "Add Lesson" : "Edit Lesson"}
            </DialogTitle>
            <DialogDescription>
              {lessonDialog.mode === "add"
                ? "Create a new lesson"
                : "Update lesson details"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lesson-title">Title *</Label>
              <Input
                id="lesson-title"
                value={lessonDialog.title}
                onChange={(e) =>
                  setLessonDialog({ ...lessonDialog, title: e.target.value })
                }
                placeholder="e.g., Introduction to React"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-description">Description</Label>
              <Input
                id="lesson-description"
                value={lessonDialog.description}
                onChange={(e) =>
                  setLessonDialog({
                    ...lessonDialog,
                    description: e.target.value,
                  })
                }
                placeholder="Brief description of this lesson"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-video">Video URL *</Label>
              <Input
                id="lesson-video"
                value={lessonDialog.videoUrl}
                onChange={(e) =>
                  setLessonDialog({ ...lessonDialog, videoUrl: e.target.value })
                }
                placeholder="https://example.com/video.mp4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-duration">Duration (seconds)</Label>
              <Input
                id="lesson-duration"
                type="number"
                value={lessonDialog.duration}
                onChange={(e) =>
                  setLessonDialog({ ...lessonDialog, duration: e.target.value })
                }
                placeholder="300"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="lesson-free"
                checked={lessonDialog.isFree}
                onCheckedChange={(checked) =>
                  setLessonDialog({ ...lessonDialog, isFree: checked })
                }
              />
              <Label htmlFor="lesson-free">Free preview</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLessonDialog({ ...lessonDialog, open: false })}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveLesson} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {lessonDialog.mode === "add" ? "Create" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {deleteDialog.type} &quot;
              {deleteDialog.title}&quot;
              {deleteDialog.type === "section" && " and all its lessons"}. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

"use client";

import {
  Video,
  FileText,
  HelpCircle,
  Upload,
  Code,
  FolderOpen,
  Target,
  ClipboardCheck,
  Flag,
  MessageSquare,
  Megaphone,
  ListChecks,
  Paperclip,
  ExternalLink,
  Radio,
  Users,
  Award,
  type LucideIcon,
} from "lucide-react";
import { LessonType } from "@/types";
import { cn } from "@/lib/utils";

interface LessonTypeIconProps {
  type: LessonType;
  className?: string;
  size?: number;
}

const lessonTypeConfig: Record<
  LessonType,
  { icon: LucideIcon; label: string; color: string; bgColor: string }
> = {
  video: {
    icon: Video,
    label: "Video Lesson",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  text: {
    icon: FileText,
    label: "Article",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  quiz: {
    icon: HelpCircle,
    label: "Quiz",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  assignment: {
    icon: Upload,
    label: "Assignment",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  coding: {
    icon: Code,
    label: "Coding Exercise",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
  },
  project: {
    icon: FolderOpen,
    label: "Project",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  task: {
    icon: Target,
    label: "Task",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  exam: {
    icon: ClipboardCheck,
    label: "Exam",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  milestone: {
    icon: Flag,
    label: "Milestone",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  discussion: {
    icon: MessageSquare,
    label: "Discussion",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
  announcement: {
    icon: Megaphone,
    label: "Announcement",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  survey: {
    icon: ListChecks,
    label: "Survey",
    color: "text-violet-600",
    bgColor: "bg-violet-100",
  },
  resource: {
    icon: Paperclip,
    label: "Resource",
    color: "text-slate-600",
    bgColor: "bg-slate-100",
  },
  external: {
    icon: ExternalLink,
    label: "External Link",
    color: "text-sky-600",
    bgColor: "bg-sky-100",
  },
  live: {
    icon: Radio,
    label: "Live Lesson",
    color: "text-rose-600",
    bgColor: "bg-rose-100",
  },
  group_work: {
    icon: Users,
    label: "Group Work",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  certificate: {
    icon: Award,
    label: "Certificate",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
};

export function LessonTypeIcon({
  type,
  className,
  size = 16,
}: LessonTypeIconProps) {
  const config = lessonTypeConfig[type] || lessonTypeConfig.video;
  const Icon = config.icon;

  return <Icon className={cn(config.color, className)} size={size} />;
}

export function LessonTypeBadge({
  type,
  className,
  showLabel = true,
}: LessonTypeIconProps & { showLabel?: boolean }) {
  const config = lessonTypeConfig[type] || lessonTypeConfig.video;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        config.bgColor,
        config.color,
        className,
      )}
    >
      <Icon size={12} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

export function getLessonTypeConfig(type: LessonType) {
  return lessonTypeConfig[type] || lessonTypeConfig.video;
}

export { lessonTypeConfig };

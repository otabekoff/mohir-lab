"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Check, Trash2 } from "lucide-react";
import { markNotificationAsRead, deleteNotification } from "@/actions/settings";
import { toast } from "sonner";

interface NotificationActionsProps {
  notificationId: string;
  isRead: boolean;
}

export function NotificationActions({
  notificationId,
  isRead,
}: NotificationActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleMarkAsRead() {
    try {
      setIsLoading(true);
      await markNotificationAsRead(notificationId);
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to mark as read";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    try {
      setIsLoading(true);
      await deleteNotification(notificationId);
      toast.success("Notification deleted");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete notification";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isLoading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!isRead && (
          <DropdownMenuItem onClick={handleMarkAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark as read
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

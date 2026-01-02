"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import { markAllNotificationsAsRead } from "@/actions/settings";
import { toast } from "sonner";

export function MarkAllReadButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleMarkAllRead() {
    try {
      setIsLoading(true);
      await markAllNotificationsAsRead();
      toast.success("All notifications marked as read");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to mark all as read";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleMarkAllRead} disabled={isLoading}>
      <CheckCheck className="mr-2 h-4 w-4" />
      {isLoading ? "Marking..." : "Mark all as read"}
    </Button>
  );
}

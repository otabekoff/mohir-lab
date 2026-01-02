"use client";

// ============================================
// Send Notification Dialog Component
// ============================================

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import {
  sendNotification,
  sendNotificationToRole,
  sendBulkNotification,
} from "@/actions/admin/notifications";
import type { NotificationType } from "@/generated/prisma";

interface SendNotificationDialogProps {
  targetType: "user" | "role" | "all";
  targetId?: string;
  targetName?: string;
}

const notificationTypes: { value: NotificationType; label: string }[] = [
  { value: "info", label: "Information" },
  { value: "enrollment", label: "Enrollment" },
  { value: "order", label: "Order" },
  { value: "review", label: "Review" },
  { value: "certificate", label: "Certificate" },
];

export function SendNotificationDialog({
  targetType,
  targetId,
  targetName,
}: SendNotificationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    type: "info" as NotificationType,
    title: "",
    message: "",
    role: "customer" as "customer" | "manager",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    startTransition(async () => {
      try {
        let result;

        if (targetType === "user" && targetId) {
          result = await sendNotification({
            userId: targetId,
            type: formData.type,
            title: formData.title,
            message: formData.message,
          });
          toast.success("Notification sent", {
            description: `Notification sent to ${targetName || "user"}`,
          });
        } else if (targetType === "role") {
          result = await sendNotificationToRole({
            role: formData.role,
            type: formData.type,
            title: formData.title,
            message: formData.message,
          });
          toast.success("Notifications sent", {
            description: `Sent to ${result.count} ${formData.role}s`,
          });
        }

        setOpen(false);
        setFormData({
          type: "info",
          title: "",
          message: "",
          role: "customer",
        });
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to send notification",
        );
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="h-4 w-4" />
          {targetType === "user" ? "Notify" : "Send Notification"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
            <DialogDescription>
              {targetType === "user"
                ? `Send a notification to ${targetName || "this user"}`
                : targetType === "role"
                  ? "Send a notification to all users with selected role"
                  : "Send a notification to users"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {targetType === "role" && (
              <div className="space-y-2">
                <Label htmlFor="role">Target Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "customer" | "manager") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">All Customers</SelectItem>
                    <SelectItem value="manager">All Managers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="type">Notification Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: NotificationType) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {notificationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Notification title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Write your message here..."
                rows={3}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

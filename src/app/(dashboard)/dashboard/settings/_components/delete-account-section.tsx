"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteAccount } from "@/actions/settings";
import { toast } from "sonner";

interface DeleteAccountSectionProps {
  userRole: string;
}

export function DeleteAccountSection({ userRole }: DeleteAccountSectionProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    try {
      setIsLoading(true);
      await deleteAccount();
      toast.success("Account deleted successfully");
      signOut({ callbackUrl: "/" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete account";
      toast.error(message);
      setIsLoading(false);
    }
  }

  if (userRole === "owner") {
    return (
      <div className="flex items-start gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <div>
          <p className="font-medium text-destructive">
            Owners cannot delete their account
          </p>
          <p className="text-sm text-muted-foreground">
            As the owner of this platform, you cannot delete your account. If
            you need to transfer ownership, please contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <div>
          <p className="font-medium text-destructive">Warning</p>
          <p className="text-sm text-muted-foreground">
            Deleting your account will permanently remove all your data
            including enrollments, progress, reviews, and order history. This
            action cannot be undone.
          </p>
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Yes, delete my account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

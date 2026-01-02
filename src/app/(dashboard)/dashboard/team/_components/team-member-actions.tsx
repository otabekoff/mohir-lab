"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, UserMinus, Shield, User } from "lucide-react";
import { updateTeamMemberRole, removeTeamMember } from "@/actions/admin/team";
import { toast } from "sonner";

interface TeamMemberActionsProps {
  memberId: string;
  memberName: string;
  currentRole: string;
}

export function TeamMemberActions({
  memberId,
  memberName,
  currentRole,
}: TeamMemberActionsProps) {
  const router = useRouter();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleRoleChange(newRole: "manager" | "customer") {
    try {
      setIsLoading(true);
      await updateTeamMemberRole(memberId, newRole);
      toast.success(`Role updated to ${newRole}`);
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update role";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemove() {
    try {
      setIsLoading(true);
      await removeTeamMember(memberId);
      toast.success("Team member removed");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to remove team member";
      toast.error(message);
    } finally {
      setIsLoading(false);
      setShowRemoveDialog(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isLoading}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {currentRole === "manager" && (
            <DropdownMenuItem onClick={() => handleRoleChange("customer")}>
              <User className="mr-2 h-4 w-4" />
              Demote to Customer
            </DropdownMenuItem>
          )}
          {currentRole === "customer" && (
            <DropdownMenuItem onClick={() => handleRoleChange("manager")}>
              <Shield className="mr-2 h-4 w-4" />
              Promote to Manager
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setShowRemoveDialog(true)}
          >
            <UserMinus className="mr-2 h-4 w-4" />
            Remove from Team
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {memberName} from the team? They
              will be demoted to a regular customer account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              disabled={isLoading}
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

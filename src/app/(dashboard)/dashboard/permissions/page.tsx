// ============================================
// Permissions Management Page
// ============================================

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth.config";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Check, X, Users, UserCog } from "lucide-react";
import { rolePermissions } from "@/lib/constants";

const permissionLabels: Record<string, { label: string; description: string }> =
  {
    "view:dashboard": {
      label: "View Dashboard",
      description: "Access the dashboard overview and stats",
    },
    "manage:courses": {
      label: "Manage Courses",
      description: "Create, edit, and delete courses",
    },
    "manage:categories": {
      label: "Manage Categories",
      description: "Create, edit, and delete course categories",
    },
    "manage:students": {
      label: "Manage Students",
      description: "View and manage student accounts",
    },
    "view:students": {
      label: "View Students",
      description: "View student information (read-only)",
    },
    "manage:reviews": {
      label: "Manage Reviews",
      description: "Approve, edit, and delete course reviews",
    },
    "view:analytics": {
      label: "View Analytics",
      description: "Access detailed analytics and reports",
    },
    "manage:orders": {
      label: "Manage Orders",
      description: "Process and manage order transactions",
    },
    "view:orders": {
      label: "View Orders",
      description: "View order information (read-only)",
    },
    "manage:team": {
      label: "Manage Team",
      description: "Add, remove, and manage team members",
    },
    "manage:permissions": {
      label: "Manage Permissions",
      description: "Configure role-based access control",
    },
    "manage:settings": {
      label: "Manage Settings",
      description: "Configure platform settings",
    },
    "view:my-courses": {
      label: "View My Courses",
      description: "Access enrolled courses",
    },
    "view:certificates": {
      label: "View Certificates",
      description: "Access earned certificates",
    },
    "post:reviews": {
      label: "Post Reviews",
      description: "Submit reviews for completed courses",
    },
  };

// Get all unique permissions across all roles
const allPermissions = Array.from(
  new Set(Object.values(rolePermissions).flat()),
);

export default async function PermissionsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "owner") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Permissions</h1>
        <p className="text-muted-foreground">
          Manage role-based access control for your platform
        </p>
      </div>

      {/* Role Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Owner</CardTitle>
              <CardDescription>Full platform access</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {rolePermissions.owner.length} permissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
              <UserCog className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Manager</CardTitle>
              <CardDescription>Content management access</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {rolePermissions.manager.length} permissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Customer</CardTitle>
              <CardDescription>Learning access only</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {rolePermissions.customer.length} permissions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions Matrix</CardTitle>
          <CardDescription>
            Overview of permissions assigned to each role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">Permission</th>
                  <th className="px-4 py-3 text-center font-medium">Owner</th>
                  <th className="px-4 py-3 text-center font-medium">Manager</th>
                  <th className="px-4 py-3 text-center font-medium">
                    Customer
                  </th>
                </tr>
              </thead>
              <tbody>
                {allPermissions.map((permission) => {
                  const info = permissionLabels[permission];
                  return (
                    <tr key={permission} className="border-b">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">
                            {info?.label || permission}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {info?.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {rolePermissions.owner.includes(permission) ? (
                          <Check className="mx-auto h-5 w-5 text-green-500" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-muted-foreground/30" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {rolePermissions.manager.includes(permission) ? (
                          <Check className="mx-auto h-5 w-5 text-green-500" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-muted-foreground/30" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {rolePermissions.customer.includes(permission) ? (
                          <Check className="mx-auto h-5 w-5 text-green-500" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-muted-foreground/30" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Role Details */}
      <div className="grid gap-6 md:grid-cols-3">
        {(["owner", "manager", "customer"] as const).map((role) => (
          <Card key={role}>
            <CardHeader>
              <CardTitle className="capitalize">{role} Role</CardTitle>
              <CardDescription>
                {role === "owner" && "Full administrative access"}
                {role === "manager" && "Content and course management"}
                {role === "customer" && "Student and learner access"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {rolePermissions[role].map((permission) => (
                  <Badge key={permission} variant="secondary">
                    {permissionLabels[permission]?.label || permission}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <Card className="border-amber-500/50 bg-amber-50 dark:bg-amber-900/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <Shield className="h-5 w-5" />
            Note: Read-Only Permissions View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Role permissions are currently defined in the system configuration.
            To modify permissions, please contact the development team or update
            the configuration files directly. Future versions will support
            dynamic permission management through this interface.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// Dashboard Home Page
// ============================================

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OwnerDashboard } from "./_components/owner-dashboard";
import { ManagerDashboard } from "./_components/manager-dashboard";
import { CustomerDashboard } from "./_components/customer-dashboard";
import type { UserRole } from "@/types";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userRole = session.user.role as UserRole;

  // Render role-specific dashboard
  switch (userRole) {
    case "owner":
      return <OwnerDashboard user={session.user} />;
    case "manager":
      return <ManagerDashboard user={session.user} />;
    case "customer":
      return <CustomerDashboard user={session.user} />;
    default:
      return <CustomerDashboard user={session.user} />;
  }
}

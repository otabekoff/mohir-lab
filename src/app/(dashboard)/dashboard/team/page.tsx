// ============================================
// Team Management Page (Owner Only)
// ============================================

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTeamMembers } from "@/actions/admin/team";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Search, Crown, Shield } from "lucide-react";
import { format } from "date-fns";
import { TeamMemberActions } from "./_components/team-member-actions";
import { InviteTeamMemberDialog } from "./_components/invite-team-member-dialog";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function TeamPage({ searchParams }: PageProps) {
  const session = await auth();
  const params = await searchParams;

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "owner") {
    redirect("/dashboard");
  }

  const { members, pagination } = await getTeamMembers({
    search: params.search,
    page: params.page ? parseInt(params.page) : 1,
  });

  const roleIcons: Record<string, React.ReactNode> = {
    owner: <Crown className="h-4 w-4 text-yellow-500" />,
    manager: <Shield className="h-4 w-4 text-blue-500" />,
  };

  const roleColors: Record<string, string> = {
    owner: "bg-yellow-500/10 text-yellow-600",
    manager: "bg-blue-500/10 text-blue-600",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">
            Manage your team members and their permissions
          </p>
        </div>
        <InviteTeamMemberDialog />
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <form>
              <Input
                name="search"
                placeholder="Search team members..."
                defaultValue={params.search}
                className="pl-10"
              />
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Team Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            {pagination.total} team member{pagination.total !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                No team members found
              </h3>
              <p className="mb-4 text-muted-foreground">
                Invite team members to help manage your platform
              </p>
              <InviteTeamMemberDialog />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-17.5"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.image || ""} />
                          <AvatarFallback>
                            {member.name?.charAt(0) || "T"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {member.name || "Team Member"}
                            </p>
                            {member.id === session.user.id && (
                              <Badge variant="outline" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={roleColors[member.role] || ""}>
                        {roleIcons[member.role]}
                        <span className="ml-1 capitalize">{member.role}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(member.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {member.id !== session.user.id &&
                        member.role !== "owner" && (
                          <TeamMemberActions
                            memberId={member.id}
                            memberName={member.name || "Team Member"}
                            currentRole={member.role}
                          />
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

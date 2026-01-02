// ============================================
// Categories Management Page (Admin/Manager)
// ============================================

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminCategories } from "@/actions/admin/categories";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FolderOpen, Search, BookOpen } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { CategoryActions } from "./_components/category-actions";
import { NewCategoryDialog } from "./_components/new-category-dialog";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const session = await auth();
  const params = await searchParams;

  if (!session?.user) {
    redirect("/login");
  }

  if (!["owner", "manager"].includes(session.user.role || "")) {
    redirect("/dashboard");
  }

  const { categories, pagination } = await getAdminCategories({
    search: params.search,
    page: params.page ? parseInt(params.page) : 1,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage course categories</p>
        </div>
        <NewCategoryDialog />
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <form>
              <Input
                name="search"
                placeholder="Search categories..."
                defaultValue={params.search}
                className="pl-10"
              />
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            {pagination.total} categor{pagination.total !== 1 ? "ies" : "y"}{" "}
            total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                No categories found
              </h3>
              <p className="mb-4 text-muted-foreground">
                Create your first category to organize courses
              </p>
              <NewCategoryDialog />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-17.5"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{category.icon || "📁"}</span>
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-2 py-1 text-sm">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell className="max-w-50 truncate">
                      {category.description || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        {category.coursesCount}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(category.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <CategoryActions category={category} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  asChild
                >
                  <Link
                    href={`/dashboard/categories?page=${pagination.page - 1}${
                      params.search ? `&search=${params.search}` : ""
                    }`}
                  >
                    Previous
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  asChild
                >
                  <Link
                    href={`/dashboard/categories?page=${pagination.page + 1}${
                      params.search ? `&search=${params.search}` : ""
                    }`}
                  >
                    Next
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

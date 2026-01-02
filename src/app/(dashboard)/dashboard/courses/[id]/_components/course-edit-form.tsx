"use client";

// ============================================
// Course Edit Form Component
// ============================================

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { updateCourse } from "@/actions/admin/courses";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string | null;
  previewVideo: string | null;
  price: number;
  discountPrice: number | null;
  level: string;
  instructor: string;
  categoryId: string;
  isPublished: boolean;
  isFeatured: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface CourseEditFormProps {
  course: Course;
  categories: Category[];
}

export function CourseEditForm({ course, categories }: CourseEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    title: course.title,
    slug: course.slug,
    shortDescription: course.shortDescription,
    description: course.description,
    thumbnail: course.thumbnail || "",
    previewVideo: course.previewVideo || "",
    price: course.price.toString(),
    discountPrice: course.discountPrice?.toString() || "",
    categoryId: course.categoryId,
    level: course.level,
    instructor: course.instructor,
    isPublished: course.isPublished,
    isFeatured: course.isFeatured,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        await updateCourse(course.id, {
          title: formData.title,
          slug: formData.slug,
          shortDescription: formData.shortDescription,
          description: formData.description,
          thumbnail: formData.thumbnail || undefined,
          previewVideo: formData.previewVideo || undefined,
          price: parseFloat(formData.price),
          discountPrice: formData.discountPrice
            ? parseFloat(formData.discountPrice)
            : undefined,
          categoryId: formData.categoryId,
          level: formData.level as
            | "beginner"
            | "intermediate"
            | "advanced"
            | "all_levels",
          instructor: formData.instructor,
          isPublished: formData.isPublished,
          isFeatured: formData.isFeatured,
        });

        toast.success("Course updated successfully");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update course",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor</Label>
            <Input
              id="instructor"
              value={formData.instructor}
              onChange={(e) =>
                setFormData({ ...formData, instructor: e.target.value })
              }
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="previewVideo">Preview Video URL</Label>
              <Input
                id="previewVideo"
                value={formData.previewVideo}
                onChange={(e) =>
                  setFormData({ ...formData, previewVideo: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPrice">Discount Price ($)</Label>
              <Input
                id="discountPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.discountPrice}
                onChange={(e) =>
                  setFormData({ ...formData, discountPrice: e.target.value })
                }
                placeholder="Leave empty for no discount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value) =>
                  setFormData({ ...formData, level: value })
                }
              >
                <SelectTrigger id="level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="all_levels">All Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData({ ...formData, categoryId: value })
              }
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="published">Published</Label>
              <p className="text-sm text-muted-foreground">
                Make this course visible to students
              </p>
            </div>
            <Switch
              id="published"
              checked={formData.isPublished}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isPublished: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="featured">Featured</Label>
              <p className="text-sm text-muted-foreground">
                Show on homepage and featured sections
              </p>
            </div>
            <Switch
              id="featured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isFeatured: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    </form>
  );
}

"use client";

// ============================================
// Courses Filters Component
// ============================================

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useCallback, useState } from "react";

const categories = [
  { value: "web-development", label: "Web Development" },
  { value: "data-science", label: "Data Science" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "cloud-computing", label: "Cloud Computing" },
  { value: "business-marketing", label: "Business & Marketing" },
];

const levels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "all-levels", label: "All Levels" },
];

interface CoursesFiltersProps {
  selectedCategory?: string;
  selectedLevel?: string;
}

export function CoursesFilters({
  selectedCategory,
  selectedLevel,
}: CoursesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      params.delete("page"); // Reset page on filter change
      return params.toString();
    },
    [searchParams],
  );

  const handleCategoryChange = (category: string) => {
    const newValue = selectedCategory === category ? null : category;
    router.push(`${pathname}?${createQueryString("category", newValue)}`);
  };

  const handleLevelChange = (level: string) => {
    const newValue = selectedLevel === level ? null : level;
    router.push(`${pathname}?${createQueryString("level", newValue)}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `${pathname}?${createQueryString("search", searchQuery || null)}`,
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    router.push(pathname);
  };

  const hasActiveFilters =
    selectedCategory || selectedLevel || searchParams.get("search");

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" variant="secondary">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={category.value}
                checked={selectedCategory === category.value}
                onCheckedChange={() => handleCategoryChange(category.value)}
              />
              <Label
                htmlFor={category.value}
                className="cursor-pointer text-sm font-normal"
              >
                {category.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Levels */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {levels.map((level) => (
            <div key={level.value} className="flex items-center space-x-2">
              <Checkbox
                id={level.value}
                checked={selectedLevel === level.value}
                onCheckedChange={() => handleLevelChange(level.value)}
              />
              <Label
                htmlFor={level.value}
                className="cursor-pointer text-sm font-normal"
              >
                {level.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={clearFilters}
        >
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}

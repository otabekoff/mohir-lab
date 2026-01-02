// ============================================
// Learning Layout
// ============================================

import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | MohirLab Learning",
    default: "Learning | MohirLab",
  },
};

export default function LearningLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}

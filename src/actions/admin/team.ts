"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper to check owner access
async function checkOwnerAccess() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  
  if (!user || user.role !== "owner") {
    throw new Error("Forbidden - Owner access required");
  }
  
  return { userId: session.user.id };
}

export async function getTeamMembers(options?: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  await checkOwnerAccess();
  
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const skip = (page - 1) * limit;
  
  const where = {
    role: { in: ["owner", "manager"] as ["owner", "manager"] },
    ...(options?.search && {
      OR: [
        { name: { contains: options.search, mode: "insensitive" as const } },
        { email: { contains: options.search, mode: "insensitive" as const } },
      ],
    }),
  };
  
  const [members, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
      orderBy: [
        { role: "asc" },
        { createdAt: "asc" },
      ],
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);
  
  return {
    members,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getTeamMemberById(id: string) {
  await checkOwnerAccess();
  
  const member = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });
  
  if (!member || !["owner", "manager"].includes(member.role)) {
    return null;
  }
  
  return member;
}

export async function inviteTeamMember(data: {
  email: string;
  role: "manager" | "owner";
}) {
  await checkOwnerAccess();
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  
  if (existingUser) {
    // If user exists, update their role
    if (existingUser.role === "owner") {
      throw new Error("This user is already an owner");
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: { role: data.role },
    });
    
    revalidatePath("/dashboard/team");
    
    return {
      success: true,
      message: `${existingUser.name || existingUser.email} has been promoted to ${data.role}`,
      user: updatedUser,
    };
  }
  
  // For new users, you would typically send an invitation email
  // For now, we'll just return a message indicating the invite was sent
  // In production, implement email invitation system
  
  return {
    success: true,
    message: `Invitation sent to ${data.email}`,
    pending: true,
  };
}

export async function updateTeamMemberRole(
  memberId: string,
  role: "manager" | "customer"
) {
  const { userId } = await checkOwnerAccess();
  
  // Prevent owner from demoting themselves
  if (memberId === userId) {
    throw new Error("You cannot change your own role");
  }
  
  const member = await prisma.user.findUnique({
    where: { id: memberId },
    select: { role: true },
  });
  
  if (!member) {
    throw new Error("User not found");
  }
  
  // Prevent demoting another owner
  if (member.role === "owner") {
    throw new Error("Cannot demote another owner");
  }
  
  const updatedMember = await prisma.user.update({
    where: { id: memberId },
    data: { role },
  });
  
  revalidatePath("/dashboard/team");
  
  return { success: true, user: updatedMember };
}

export async function removeTeamMember(memberId: string) {
  const { userId } = await checkOwnerAccess();
  
  // Prevent owner from removing themselves
  if (memberId === userId) {
    throw new Error("You cannot remove yourself from the team");
  }
  
  const member = await prisma.user.findUnique({
    where: { id: memberId },
    select: { role: true, name: true, email: true },
  });
  
  if (!member) {
    throw new Error("User not found");
  }
  
  // Prevent removing another owner
  if (member.role === "owner") {
    throw new Error("Cannot remove another owner");
  }
  
  // Demote to customer instead of deleting
  await prisma.user.update({
    where: { id: memberId },
    data: { role: "customer" },
  });
  
  revalidatePath("/dashboard/team");
  
  return {
    success: true,
    message: `${member.name || member.email} has been removed from the team`,
  };
}

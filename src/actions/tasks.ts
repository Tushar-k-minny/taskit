"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db, tasks } from "@/db";
import { auth } from "@/lib/auth";
import {
  type CreateTaskInput,
  createTaskSchema,
  type UpdateTaskInput,
  updateTaskSchema,
} from "@/lib/validations";

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getTasks(projectId?: string) {
  const session = await getSession();

  const conditions = [eq(tasks.userId, session.user.id)];

  if (projectId) {
    conditions.push(eq(tasks.projectId, projectId));
  }

  const result = await db
    .select()
    .from(tasks)
    .where(and(...conditions))
    .orderBy(desc(tasks.createdAt));

  return result;
}

export async function getTaskById(id: string) {
  const session = await getSession();

  const result = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)))
    .limit(1);

  return result[0] || null;
}

export async function createTask(input: CreateTaskInput) {
  const session = await getSession();

  const validated = createTaskSchema.parse(input);

  const result = await db
    .insert(tasks)
    .values({
      ...validated,
      userId: session.user.id,
    })
    .returning();

  revalidatePath("/tasks");
  revalidatePath("/dashboard");

  return { success: true, data: result[0] };
}

export async function updateTask(input: UpdateTaskInput) {
  const session = await getSession();

  const validated = updateTaskSchema.parse(input);
  const { id, ...data } = validated;

  // Check ownership
  const existing = await getTaskById(id);
  if (!existing) {
    throw new Error("Task not found");
  }

  // Handle completion
  const updates: Record<string, unknown> = {
    ...data,
    updatedAt: new Date(),
  };

  if (data.status === "completed" && existing.status !== "completed") {
    updates.completedAt = new Date();
  } else if (data.status && data.status !== "completed") {
    updates.completedAt = null;
  }

  const result = await db
    .update(tasks)
    .set(updates)
    .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)))
    .returning();

  revalidatePath("/tasks");
  revalidatePath("/dashboard");

  return { success: true, data: result[0] };
}

export async function deleteTask(id: string) {
  const session = await getSession();

  // Check ownership
  const existing = await getTaskById(id);
  if (!existing) {
    throw new Error("Task not found");
  }

  await db
    .delete(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)));

  revalidatePath("/tasks");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function getTaskStats() {
  const session = await getSession();

  const allTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, session.user.id));

  const total = allTasks.length;
  const completed = allTasks.filter((t) => t.status === "completed").length;
  const inProgress = allTasks.filter((t) => t.status === "in_progress").length;
  const todo = allTasks.filter((t) => t.status === "todo").length;

  const overdue = allTasks.filter(
    (t) =>
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed"
  ).length;

  return { total, completed, inProgress, todo, overdue };
}

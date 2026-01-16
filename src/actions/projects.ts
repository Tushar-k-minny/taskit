"use server";

import { and, count, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db, projects, tasks } from "@/db";
import { auth } from "@/lib/auth";
import {
  type CreateProjectInput,
  createProjectSchema,
  type UpdateProjectInput,
  updateProjectSchema,
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

export async function getProjects() {
  const session = await getSession();

  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, session.user.id))
    .orderBy(desc(projects.createdAt));

  return result;
}

export async function getProjectById(id: string) {
  const session = await getSession();

  const result = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)))
    .limit(1);

  return result[0] || null;
}

export async function getProjectsWithTaskCount() {
  const session = await getSession();

  const projectList = await getProjects();

  const projectsWithCounts = await Promise.all(
    projectList.map(async (project) => {
      const taskCount = await db
        .select({ count: count() })
        .from(tasks)
        .where(
          and(
            eq(tasks.projectId, project.id),
            eq(tasks.userId, session.user.id)
          )
        );

      return {
        ...project,
        taskCount: taskCount[0]?.count || 0,
      };
    })
  );

  return projectsWithCounts;
}

export async function createProject(input: CreateProjectInput) {
  const session = await getSession();

  const validated = createProjectSchema.parse(input);

  const result = await db
    .insert(projects)
    .values({
      ...validated,
      userId: session.user.id,
    })
    .returning();

  revalidatePath("/projects");
  revalidatePath("/dashboard");

  return { success: true, data: result[0] };
}

export async function updateProject(input: UpdateProjectInput) {
  const session = await getSession();

  const validated = updateProjectSchema.parse(input);
  const { id, ...data } = validated;

  // Check ownership
  const existing = await getProjectById(id);
  if (!existing) {
    throw new Error("Project not found");
  }

  const result = await db
    .update(projects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)))
    .returning();

  revalidatePath("/projects");
  revalidatePath("/dashboard");

  return { success: true, data: result[0] };
}

export async function deleteProject(id: string) {
  const session = await getSession();

  // Check ownership
  const existing = await getProjectById(id);
  if (!existing) {
    throw new Error("Project not found");
  }

  // Note: Tasks with this projectId will have their projectId set to null (onDelete: "set null")
  await db
    .delete(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)));

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  revalidatePath("/tasks");

  return { success: true };
}

"use client";

import {
  CircleNotch,
  DotsThreeVertical,
  Kanban,
  PencilSimple,
  Plus,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { useState, useTransition } from "react";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/actions/projects";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { Project } from "@/db/schema";
import { formatRelativeDate } from "@/lib/utils";

interface ProjectsClientProps {
  initialProjects?: (Project & { taskCount: number })[];
}

const COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#14b8a6", // Teal
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
];

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [projects, setProjects] = useState(initialProjects || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: COLORS[0],
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setFormData({
      name: project.name,
      description: project.description || "",
      color: project.color,
    });
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        if (editingProject) {
          const result = await updateProject({
            id: editingProject.id,
            ...formData,
          });
          if (result.success && result.data) {
            setProjects((prev) =>
              (prev || []).map((p) =>
                p.id === editingProject.id
                  ? { ...result.data, taskCount: p.taskCount }
                  : p
              )
            );
            toast({ title: "Project updated", variant: "success" });
          }
        } else {
          const result = await createProject(formData);
          if (result.success && result.data) {
            setProjects((prev) => [
              { ...result.data, taskCount: 0 },
              ...(prev || []),
            ]);
            toast({ title: "Project created", variant: "success" });
          }
        }
        setIsDialogOpen(false);
        resetForm();
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        });
      }
    });
  };

  const handleDelete = (projectId: string) => {
    startTransition(async () => {
      try {
        await deleteProject(projectId);
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        toast({ title: "Project deleted", variant: "success" });
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-3xl">Projects</h1>
          <p className="text-muted-foreground">
            Organize your tasks into projects
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4" weight="bold" />
          New Project
        </Button>
      </div>

      {/* Projects grid */}
      {!projects || projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Kanban
              className="mb-4 h-16 w-16 text-muted-foreground/50"
              weight="light"
            />
            <h3 className="mb-2 font-medium text-lg">No projects yet</h3>
            <p className="mb-4 text-muted-foreground">
              Create a project to organize your tasks better.
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4" weight="bold" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(projects || []).map((project) => (
            <Card
              className="group relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              key={project.id}
            >
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: project.color }}
              />
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: `${project.color}20` }}
                  >
                    <Kanban
                      className="h-5 w-5"
                      style={{ color: project.color }}
                      weight="fill"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>
                      {project.taskCount}{" "}
                      {project.taskCount === 1 ? "task" : "tasks"}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      size="icon"
                      variant="ghost"
                    >
                      <DotsThreeVertical className="h-4 w-4" weight="bold" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(project)}>
                      <PencilSimple className="mr-2 h-4 w-4" weight="bold" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" weight="bold" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                {project.description && (
                  <p className="mb-3 line-clamp-2 text-muted-foreground text-sm">
                    {project.description}
                  </p>
                )}
                <p className="text-muted-foreground text-xs">
                  Created {formatRelativeDate(project.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Create Project"}
            </DialogTitle>
            <DialogDescription>
              {editingProject
                ? "Update the project details below."
                : "Create a new project to organize your tasks."}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Project name"
                required
                value={formData.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Optional description"
                rows={3}
                value={formData.description}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    className={`h-8 w-8 rounded-full transition-all duration-200 ${
                      formData.color === color
                        ? "scale-110 ring-2 ring-primary ring-offset-2"
                        : "hover:scale-110"
                    }`}
                    key={color}
                    onClick={() => setFormData((prev) => ({ ...prev, color }))}
                    style={{ backgroundColor: color }}
                    type="button"
                  />
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setIsDialogOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    <CircleNotch
                      className="h-4 w-4 animate-spin"
                      weight="bold"
                    />
                    Saving...
                  </>
                ) : editingProject ? (
                  "Update Project"
                ) : (
                  "Create Project"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

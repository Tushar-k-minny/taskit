"use client";

import {
  CircleNotch,
  DotsThreeVertical,
  Funnel,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { useState, useTransition } from "react";
import { createTask, deleteTask, updateTask } from "@/actions/tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { Project, Task, TaskPriority, TaskStatus } from "@/db/schema";
import { formatRelativeDate } from "@/lib/utils";

interface TasksClientProps {
  initialTasks: Task[];
  projects: Project[];
}

export function TasksClient({ initialTasks, projects }: TasksClientProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isPending] = useTransition();
  const { toast } = useToast();

  const NO_PROJECT_VALUE = "__no_project__";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    priority: "medium" as TaskPriority,
    dueDate: "",
    projectId: NO_PROJECT_VALUE,
  });

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
      projectId: NO_PROJECT_VALUE,
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setEditingTask(null);
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
      projectId: task.projectId || NO_PROJECT_VALUE,
    });
    setEditingTask(task);
    setIsCreateDialogOpen(true);
  };

  const handleUpdateTask = async () => {
    if (!editingTask) {
      return;
    }

    const result = await updateTask({
      id: editingTask.id,
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      projectId:
        formData.projectId === NO_PROJECT_VALUE ? null : formData.projectId,
    });

    if (result.success && result.data) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? result.data : t))
      );
      toast({ title: "Task updated", variant: "success" });
    }
  };

  const handleCreateTask = async () => {
    const result = await createTask({
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      projectId:
        formData.projectId === NO_PROJECT_VALUE ? null : formData.projectId,
    });

    if (result.success && result.data) {
      setTasks((prev) => [result.data, ...prev]);
      toast({ title: "Task created", variant: "success" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTask) {
        await handleUpdateTask();
      } else {
        await handleCreateTask();
      }
    } catch (error) {
      console.error("Failed to save task:", error);
      toast({
        title: "Error",
        description: "Failed to save task",
        variant: "destructive",
      });
    } finally {
      setIsCreateDialogOpen(false);
      resetForm();
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast({ title: "Task deleted", variant: "success" });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const newStatus = task.status === "completed" ? "todo" : "completed";
      const result = await updateTask({ id: task.id, status: newStatus });
      if (result.success && result.data) {
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? result.data : t))
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const statusColors = {
    todo: "secondary",
    in_progress: "warning",
    completed: "success",
  } as const;

  const priorityColors = {
    low: "secondary",
    medium: "default",
    high: "warning",
    urgent: "destructive",
  } as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text font-bold text-3xl text-transparent">
            Tasks
          </h1>
          <p className="text-muted-foreground">
            Manage and track all your tasks
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4" weight="bold" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <MagnifyingGlass
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            weight="bold"
          />
          <Input
            className="pl-10"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            value={searchQuery}
          />
        </div>
        <Select onValueChange={setStatusFilter} value={statusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Funnel className="mr-2 h-4 w-4" weight="bold" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks list */}
      <Card>
        <CardHeader>
          <CardTitle>All Tasks ({filteredTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No tasks found</p>
              <Button onClick={openCreateDialog} variant="link">
                Create your first task
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  className="flex items-center gap-4 rounded-lg border p-4 transition-all duration-200 hover:bg-muted/50 hover:shadow-sm"
                  key={task.id}
                >
                  <Checkbox
                    checked={task.status === "completed"}
                    disabled={isPending}
                    onCheckedChange={() => handleToggleComplete(task)}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-medium ${task.status === "completed" ? "text-muted-foreground line-through" : ""}`}
                    >
                      {task.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
                      <span>{formatRelativeDate(task.createdAt)}</span>
                      {task.dueDate && (
                        <>
                          <span>•</span>
                          <span>Due {formatRelativeDate(task.dueDate)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    <Badge variant={priorityColors[task.priority]}>
                      {task.priority}
                    </Badge>
                    <Badge variant={statusColors[task.status]}>
                      {task.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <DotsThreeVertical className="h-4 w-4" weight="bold" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(task)}>
                        <PencilSimple className="mr-2 h-4 w-4" weight="bold" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(task.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" weight="bold" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog onOpenChange={setIsCreateDialogOpen} open={isCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create Task"}
            </DialogTitle>
            <DialogDescription>
              {editingTask
                ? "Update the task details below."
                : "Add a new task to your list."}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Task title"
                required
                value={formData.title}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: value as TaskStatus,
                    }))
                  }
                  value={formData.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tasks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: value as TaskPriority,
                    }))
                  }
                  value={formData.priority}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="somethings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  type="date"
                  value={formData.dueDate}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, projectId: value }))
                  }
                  value={formData.projectId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_PROJECT_VALUE}>No Project</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setIsCreateDialogOpen(false)}
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
                ) : editingTask ? (
                  "Update Task"
                ) : (
                  "Create Task"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

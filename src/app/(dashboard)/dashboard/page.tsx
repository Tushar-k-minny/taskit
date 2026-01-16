import {
  CheckCircle,
  Clock,
  ListChecks,
  Plus,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Suspense } from "react";
import { getProjectsWithTaskCount } from "@/actions/projects";
import { getTaskStats, getTasks } from "@/actions/tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRelativeDate } from "@/lib/utils";

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your tasks.
          </p>
        </div>
        <Link href="/tasks?new=true">
          <Button>
            <Plus className="h-4 w-4" weight="bold" />
            New Task
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <Suspense fallback={<StatsLoading />}>
        <StatsSection />
      </Suspense>

      {/* Main content grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent tasks */}
        <div className="lg:col-span-2">
          <Suspense fallback={<TasksLoading />}>
            <RecentTasks />
          </Suspense>
        </div>

        {/* Projects sidebar */}
        <div>
          <Suspense fallback={<ProjectsLoading />}>
            <ProjectsList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function StatsSection() {
  const stats = await getTaskStats();

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: ListChecks,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-500/10",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: Warning,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card
          className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          key={stat.title}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}
            >
              <stat.icon className={`h-6 w-6 ${stat.color}`} weight="fill" />
            </div>
            <div>
              <p className="font-bold text-2xl">{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function RecentTasks() {
  const tasks = await getTasks();
  const recentTasks = tasks.slice(0, 5);

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription>
            Your latest tasks across all projects
          </CardDescription>
        </div>
        <Link href="/tasks">
          <Button className="text-primary" size="sm" variant="link">
            View all
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ListChecks
              className="mb-4 h-12 w-12 text-muted-foreground/50"
              weight="light"
            />
            <p className="text-muted-foreground">No tasks yet</p>
            <Link className="mt-2" href="/tasks?new=true">
              <Button size="sm" variant="link">
                Create your first task
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div
                className="flex items-center justify-between rounded-lg border p-4 transition-all duration-200 hover:bg-muted/50 hover:shadow-sm"
                key={task.id}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{task.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
                    <span>{formatRelativeDate(task.createdAt)}</span>
                    {task.dueDate && (
                      <>
                        <span>•</span>
                        <span>Due {formatRelativeDate(task.dueDate)}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={priorityColors[task.priority]}>
                    {task.priority}
                  </Badge>
                  <Badge variant={statusColors[task.status]}>
                    {task.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

async function ProjectsList() {
  const projects = await getProjectsWithTaskCount();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Organize your tasks by project</CardDescription>
        </div>
        <Link href="/projects">
          <Button className="text-primary" size="sm" variant="link">
            View all
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <Plus
                className="h-6 w-6 text-muted-foreground/50"
                weight="light"
              />
            </div>
            <p className="text-muted-foreground">No projects yet</p>
            <Link className="mt-2" href="/projects?new=true">
              <Button size="sm" variant="link">
                Create a project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 5).map((project) => (
              <Link
                className="flex items-center gap-3 rounded-lg p-3 transition-all duration-200 hover:translate-x-1 hover:bg-muted"
                href={`/tasks?project=${project.id}`}
                key={project.id}
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{project.name}</p>
                </div>
                <span className="text-muted-foreground text-sm">
                  {project.taskCount} tasks
                </span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatsLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[Array.from({ length: 4 })].map((_, i) => (
        <Card key={`stats-skeleton-${i}`}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
            <div className="space-y-2">
              <div className="h-7 w-12 animate-pulse rounded bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TasksLoading() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[Array.from({ length: 3 })].map((_, i) => (
          <div
            className="h-16 animate-pulse rounded-lg bg-muted"
            key={`tasks-skeleton-${i}`}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function ProjectsLoading() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-24 animate-pulse rounded bg-muted" />
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[Array.from({ length: 3 })].map((_, i) => (
          <div
            className="h-12 animate-pulse rounded-lg bg-muted"
            key={`projects-skeleton-${i}`}
          />
        ))}
      </CardContent>
    </Card>
  );
}

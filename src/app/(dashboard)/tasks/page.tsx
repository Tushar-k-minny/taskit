import { getProjects } from "@/actions/projects";
import { getTasks } from "@/actions/tasks";
import { TasksClient } from "./tasks-client";

export default async function TasksPage() {
  const [tasks, projects] = await Promise.all([getTasks(), getProjects()]);

  return <TasksClient initialTasks={tasks} projects={projects} />;
}

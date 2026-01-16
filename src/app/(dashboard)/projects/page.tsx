import { getProjectsWithTaskCount } from "@/actions/projects";
import { ProjectsClient } from "./projects-client";

export default async function ProjectsPage() {
  const projects = await getProjectsWithTaskCount();

  return <ProjectsClient initialProjects={projects} />;
}

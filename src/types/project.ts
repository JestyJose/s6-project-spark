export type ProjectStatus = "Idea Submitted" | "Taken";
export type Semester = "S4" | "S6" | "S8";

export interface Project {
  id: string;
  title: string;
  description: string;
  semester: Semester;
  category: string | null;
  status: ProjectStatus;
  team_members: string[];
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

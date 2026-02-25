import { Link } from "react-router-dom";
import type { Project } from "@/types/project";
import StatusBadge from "./StatusBadge";
import { Users, Tag, FileText } from "lucide-react";

const ProjectCard = ({ project }: { project: Project }) => (
  <Link to={`/project/${project.id}`} className="group bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
    <div className={`h-1 w-full ${project.status === "Taken" ? "bg-destructive" : "bg-accent"}`} />
    <div className="p-6 flex flex-col flex-1 gap-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {project.category && (
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {project.category}
          </span>
        )}
        <StatusBadge status={project.status} />
      </div>

      <h3 className="font-sora text-lg font-bold leading-snug text-card-foreground group-hover:text-primary transition-colors">
        {project.title}
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
        {project.description}
      </p>

      {project.pdf_url && (
        <a href={project.pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-accent hover:underline font-medium">
          <FileText className="w-3 h-3" />
          View PDF
        </a>
      )}

      <div className="pt-2 border-t border-border">
        <div className="flex items-start gap-2">
          <Users className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          {project.team_members.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {project.team_members.map((member) => (
                <span key={member} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-medium">
                  {member}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground italic">No team assigned yet</span>
          )}
        </div>
      </div>
    </div>
  </Link>
);

export default ProjectCard;

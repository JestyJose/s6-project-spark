import { Project } from "@/data/projects";
import StatusBadge from "./StatusBadge";
import { Users } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="group bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
      {/* Top accent stripe */}
      <div
        className={`h-1 w-full ${
          project.status === "Taken" ? "bg-destructive" : "bg-accent"
        }`}
      />

      <div className="p-6 flex flex-col flex-1 gap-4">
        {/* Category pill + status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {project.category && (
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              {project.category}
            </span>
          )}
          <StatusBadge status={project.status} />
        </div>

        {/* Title */}
        <h3 className="font-sora text-lg font-700 leading-snug text-card-foreground group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
          {project.description}
        </p>

        {/* Team members */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            {project.teamMembers.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {project.teamMembers.map((member) => (
                  <span
                    key={member}
                    className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-medium"
                  >
                    {member}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic">
                No team assigned yet
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

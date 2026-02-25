import { useParams, Link } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import StatusBadge from "@/components/StatusBadge";
import { ArrowLeft, Users, FileText, ExternalLink, Tag, Loader2, ImageIcon } from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: projects = [], isLoading } = useProjects();
  const project = projects.find((p) => p.id === id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!project) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">📂</p>
        <h2 className="font-sora text-xl font-bold text-foreground mb-2">Project Not Found</h2>
        <p className="text-muted-foreground text-sm mb-6">The project you're looking for doesn't exist.</p>
        <Link to="/" className="text-accent font-semibold hover:underline text-sm">← Back to Projects</Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        {/* Header bar */}
        <div className={`h-1.5 w-full ${project.status === "Taken" ? "bg-destructive" : "bg-accent"}`} />

        <div className="p-6 sm:p-8">
          {/* Top meta */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-secondary text-secondary-foreground uppercase tracking-wide">
              {project.semester}
            </span>
            {project.category && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                <Tag className="w-3 h-3" />
                {project.category}
              </span>
            )}
            <StatusBadge status={project.status} />
          </div>

          <h1 className="font-sora text-2xl sm:text-3xl font-extrabold text-foreground mb-3 leading-tight">
            {project.title}
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Team members */}
          {project.team_members.length > 0 && (
            <div className="flex items-start gap-2 mb-6">
              <Users className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex flex-wrap gap-1.5">
                {project.team_members.map((member) => (
                  <span key={member} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-medium">
                    {member}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action links */}
          <div className="flex flex-wrap gap-3 mb-8">
            {project.pdf_url && (
              <a
                href={project.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                <FileText className="w-4 h-4" />
                View Abstract PDF
              </a>
            )}
            {project.external_link && (
              <a
                href={project.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Project
              </a>
            )}
          </div>

          {/* Images */}
          {project.images && project.images.length > 0 && (
            <div className="mb-8">
              <h2 className="font-sora text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-accent" />
                Project Images
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.images.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow">
                    <img src={url} alt={`${project.title} image ${i + 1}`} className="w-full h-48 object-cover" loading="lazy" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Video */}
          {project.video_url && (
            <div className="mb-4">
              <h2 className="font-sora text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                ▶ Project Video
              </h2>
              <div className="rounded-xl overflow-hidden border border-border">
                {project.video_url.includes("youtube.com") || project.video_url.includes("youtu.be") ? (
                  <iframe
                    src={getYoutubeEmbedUrl(project.video_url)}
                    title="Project Video"
                    className="w-full aspect-video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={project.video_url} controls className="w-full aspect-video" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

function getYoutubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export default ProjectDetail;

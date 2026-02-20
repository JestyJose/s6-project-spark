import { useState } from "react";
import { initialProjects, Project, ProjectStatus } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import { Search, SlidersHorizontal, BookOpen } from "lucide-react";

const statusFilters: { label: string; value: "All" | ProjectStatus }[] = [
  { label: "All Projects", value: "All" },
  { label: "Idea Submitted", value: "Idea Submitted" },
  { label: "Taken", value: "Taken" },
];

const Index = () => {
  const [projects] = useState<Project[]>(() => {
    const stored = localStorage.getItem("s6_projects");
    return stored ? JSON.parse(stored) : initialProjects;
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ProjectStatus>("All");

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.teamMembers.some((m) =>
        m.toLowerCase().includes(search.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    All: projects.length,
    "Idea Submitted": projects.filter((p) => p.status === "Idea Submitted").length,
    Taken: projects.filter((p) => p.status === "Taken").length,
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero section */}
      <section className="gradient-hero rounded-3xl px-8 py-12 mb-10 text-primary-foreground relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 opacity-80" />
            <span className="text-sm font-medium opacity-80 tracking-wide uppercase">
              Academic Year 2025–2026
            </span>
          </div>
          <h1 className="font-sora text-3xl sm:text-4xl font-800 mb-3 leading-tight">
            S6 Project Hub
          </h1>
          <p className="text-primary-foreground/75 text-base max-w-xl leading-relaxed">
            Browse all sixth-semester student project ideas, check team assignments, and track project status at a glance.
          </p>

          <div className="mt-8 flex gap-6 flex-wrap">
            <div>
              <p className="text-3xl font-sora font-bold">{counts.All}</p>
              <p className="text-xs opacity-70 mt-0.5 uppercase tracking-wide">Total Projects</p>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <p className="text-3xl font-sora font-bold">{counts.Taken}</p>
              <p className="text-xs opacity-70 mt-0.5 uppercase tracking-wide">Taken</p>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <p className="text-3xl font-sora font-bold">{counts["Idea Submitted"]}</p>
              <p className="text-xs opacity-70 mt-0.5 uppercase tracking-wide">Idea Submitted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, description, or team member…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-card"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1 shadow-card flex-shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground ml-2 mr-1 hidden sm:block" />
          {statusFilters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                statusFilter === value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {label}
              <span
                className={`ml-1.5 text-[10px] rounded-full px-1.5 py-0.5 ${
                  statusFilter === value
                    ? "bg-white/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {counts[value]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Project grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="font-sora text-xl font-semibold text-foreground mb-2">
            No projects found
          </h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting your search or filter.
          </p>
        </div>
      )}
    </main>
  );
};

export default Index;

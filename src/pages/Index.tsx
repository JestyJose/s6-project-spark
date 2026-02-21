import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import ProjectCard from "@/components/ProjectCard";
import { Search, SlidersHorizontal, BookOpen, Loader2 } from "lucide-react";
import type { Semester, ProjectStatus } from "@/types/project";

const semesters: Semester[] = ["S4", "S6", "S8"];
const statusFilters: { label: string; value: "All" | ProjectStatus }[] = [
  { label: "All", value: "All" },
  { label: "Idea Submitted", value: "Idea Submitted" },
  { label: "Taken", value: "Taken" },
];

const Index = () => {
  const { data: projects = [], isLoading } = useProjects();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ProjectStatus>("All");
  const [activeSemester, setActiveSemester] = useState<Semester>("S6");

  const filtered = projects.filter((p) => {
    const matchSemester = p.semester === activeSemester;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.team_members.some((m) => m.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSemester && matchSearch && matchStatus;
  });

  const semesterCounts = (s: Semester) => projects.filter((p) => p.semester === s).length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <section className="gradient-hero rounded-3xl px-8 py-12 mb-10 text-primary-foreground relative overflow-hidden">
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
          <h1 className="font-sora text-3xl sm:text-4xl font-extrabold mb-3 leading-tight">
            Department Project Hub
          </h1>
          <p className="text-primary-foreground/75 text-base max-w-xl leading-relaxed">
            Browse student project ideas across S4, S6 &amp; S8 semesters. Track status, view teams, and download project documents.
          </p>
          <div className="mt-8 flex gap-6 flex-wrap">
            {semesters.map((s) => (
              <div key={s}>
                <p className="text-3xl font-sora font-bold">{semesterCounts(s)}</p>
                <p className="text-xs opacity-70 mt-0.5 uppercase tracking-wide">{s} Projects</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Semester tabs */}
      <div className="flex items-center gap-2 mb-6">
        {semesters.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSemester(s)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              activeSemester === s
                ? "gradient-hero text-primary-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
            <span className={`ml-2 text-xs rounded-full px-2 py-0.5 ${
              activeSemester === s ? "bg-white/20" : "bg-muted"
            }`}>
              {semesterCounts(s)}
            </span>
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
        <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1 shadow-card flex-shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground ml-2 mr-1 hidden sm:block" />
          {statusFilters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="font-sora text-xl font-semibold text-foreground mb-2">No projects found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your search or filter.</p>
        </div>
      )}
    </main>
  );
};

export default Index;

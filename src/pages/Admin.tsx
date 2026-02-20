import { useState } from "react";
import { Project, ProjectStatus, initialProjects } from "@/data/projects";
import { PlusCircle, Trash2, Shield, ChevronDown } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

const ADMIN_PASSWORD = "s6admin2025";

const emptyForm = {
  title: "",
  description: "",
  status: "Idea Submitted" as ProjectStatus,
  teamMembers: "",
  category: "",
};

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = localStorage.getItem("s6_projects");
    return stored ? JSON.parse(stored) : initialProjects;
  });

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setFormError("Title and description are required.");
      return;
    }
    setFormError("");

    const newProject: Project = {
      id: Date.now().toString(),
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      category: form.category.trim() || undefined,
      teamMembers: form.teamMembers
        ? form.teamMembers
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean)
        : [],
    };

    const updated = [newProject, ...projects];
    setProjects(updated);
    localStorage.setItem("s6_projects", JSON.stringify(updated));
    setForm(emptyForm);
    setSuccessMsg(`"${newProject.title}" has been added successfully!`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDelete = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    localStorage.setItem("s6_projects", JSON.stringify(updated));
  };

  if (!authenticated) {
    return (
      <main className="max-w-md mx-auto px-4 py-20">
        <div className="bg-card rounded-2xl border border-border shadow-card p-8">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center shadow-hero">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <h2 className="font-sora text-2xl font-bold text-center text-foreground mb-1">
            Admin Access
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-8">
            Enter the admin password to continue.
          </p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                placeholder="••••••••••••"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-foreground bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition ${
                  passwordError ? "border-destructive" : "border-border"
                }`}
              />
              {passwordError && (
                <p className="text-destructive text-xs mt-1.5">
                  Incorrect password. Try again.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full gradient-hero text-primary-foreground font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
            >
              Sign In
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-sora text-3xl font-bold text-foreground mb-1">
          Admin Panel
        </h1>
        <p className="text-muted-foreground text-sm">
          Add new project ideas and manage existing ones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Add project form */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 sticky top-24">
            <h2 className="font-sora text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-accent" />
              Add New Project
            </h2>

            {successMsg && (
              <div className="mb-4 bg-[hsl(var(--status-idea-bg))] text-[hsl(var(--status-idea))] text-sm font-medium px-4 py-3 rounded-xl border border-[hsl(var(--status-idea)/0.3)]">
                ✓ {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Smart Campus App"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe the project idea…"
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="e.g. AI / Mobile / IoT"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as ProjectStatus,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none pr-9 cursor-pointer"
                  >
                    <option value="Idea Submitted">Idea Submitted</option>
                    <option value="Taken">Taken</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  Team Members
                </label>
                <input
                  type="text"
                  value={form.teamMembers}
                  onChange={(e) =>
                    setForm({ ...form, teamMembers: e.target.value })
                  }
                  placeholder="Name 1, Name 2, Name 3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Separate names with commas
                </p>
              </div>

              {formError && (
                <p className="text-destructive text-xs">{formError}</p>
              )}

              <button
                type="submit"
                className="gradient-hero text-primary-foreground font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm mt-1"
              >
                Add Project
              </button>
            </form>
          </div>
        </div>

        {/* Projects list */}
        <div className="lg:col-span-3">
          <h2 className="font-sora text-lg font-semibold text-foreground mb-4">
            All Projects
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({projects.length})
            </span>
          </h2>

          <div className="flex flex-col gap-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-card rounded-2xl border border-border shadow-card p-5 flex items-start gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-sora font-semibold text-sm text-foreground truncate">
                      {project.title}
                    </h3>
                    <StatusBadge status={project.status} />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                  {project.teamMembers.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      👥{" "}
                      {project.teamMembers.join(", ")}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="shrink-0 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-[hsl(var(--status-taken-bg))] transition-colors"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Admin;

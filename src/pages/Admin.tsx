import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/useProjects";
import { Navigate } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";
import { PlusCircle, Trash2, Pencil, ChevronDown, Upload, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Semester, ProjectStatus } from "@/types/project";

const emptyForm = {
  title: "",
  description: "",
  semester: "S6" as Semester,
  status: "Idea Submitted" as ProjectStatus,
  team_members: "",
  category: "",
  video_url: "",
  external_link: "",
};

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { data: projects = [], isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  if (authLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return (
    <main className="max-w-md mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">🔒</p>
      <h2 className="font-sora text-xl font-bold text-foreground mb-2">Access Denied</h2>
      <p className="text-muted-foreground text-sm">Your account does not have admin privileges.</p>
    </main>
  );

  const uploadPdf = async (): Promise<string | null> => {
    if (!pdfFile) return null;
    const path = `${Date.now()}-${pdfFile.name}`;
    const { error } = await supabase.storage.from("project-pdfs").upload(path, pdfFile);
    if (error) { setFormError("PDF upload failed: " + error.message); return null; }
    const { data } = supabase.storage.from("project-pdfs").getPublicUrl(path);
    return data.publicUrl;
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];
    const urls: string[] = [];
    for (const file of imageFiles) {
      const path = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("project-images").upload(path, file);
      if (error) { setFormError("Image upload failed: " + error.message); return urls; }
      const { data } = supabase.storage.from("project-images").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setFormError("Title and description are required.");
      return;
    }
    setFormError("");
    setUploading(true);

    const pdfUrl = await uploadPdf();
    const imageUrls = await uploadImages();

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      semester: form.semester,
      status: form.status,
      category: form.category.trim() || null,
      team_members: form.team_members ? form.team_members.split(",").map((m) => m.trim()).filter(Boolean) : [],
      video_url: form.video_url.trim() || null,
      external_link: form.external_link.trim() || null,
      ...(pdfUrl ? { pdf_url: pdfUrl } : {}),
      ...(imageUrls.length > 0 ? { images: imageUrls } : {}),
    };

    try {
      if (editingId) {
        await updateProject.mutateAsync({ id: editingId, ...payload });
        setSuccessMsg("Project updated!");
      } else {
        await createProject.mutateAsync(payload);
        setSuccessMsg("Project added!");
      }
      setForm(emptyForm);
      setEditingId(null);
      setPdfFile(null);
      setImageFiles([]);
      setUploading(false);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setUploading(false);
      setFormError(err.message);
    }
  };

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      semester: p.semester,
      status: p.status,
      team_members: p.team_members.join(", "),
      category: p.category || "",
      video_url: p.video_url || "",
      external_link: p.external_link || "",
    });
    setPdfFile(null);
    setImageFiles([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPdfFile(null);
    setImageFiles([]);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-sora text-3xl font-bold text-foreground mb-1">Admin Panel</h1>
        <p className="text-muted-foreground text-sm">Add, edit, or delete projects across all semesters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 sticky top-24">
            <h2 className="font-sora text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-accent" />
              {editingId ? "Edit Project" : "Add New Project"}
              {editingId && (
                <button onClick={cancelEdit} className="ml-auto text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </h2>

            {successMsg && (
              <div className="mb-4 bg-[hsl(var(--status-idea-bg))] text-[hsl(var(--status-idea))] text-sm font-medium px-4 py-3 rounded-xl border border-[hsl(var(--status-idea)/0.3)]">
                ✓ {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label="Project Title *">
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Smart Campus App" className="form-input" />
              </Field>

              <Field label="Description *">
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the project…" rows={4} className="form-input resize-none" />
              </Field>

              <Field label="Semester">
                <div className="relative">
                  <select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value as Semester })} className="form-input appearance-none pr-9 cursor-pointer">
                    <option value="S4">S4</option>
                    <option value="S6">S6</option>
                    <option value="S8">S8</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </Field>

              <Field label="Category">
                <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. AI / Mobile / IoT" className="form-input" />
              </Field>

              <Field label="Status">
                <div className="relative">
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })} className="form-input appearance-none pr-9 cursor-pointer">
                    <option value="Idea Submitted">Idea Submitted</option>
                    <option value="Taken">Taken</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </Field>

              <Field label="Team Members">
                <input type="text" value={form.team_members} onChange={(e) => setForm({ ...form, team_members: e.target.value })} placeholder="Name 1, Name 2" className="form-input" />
                <p className="text-[11px] text-muted-foreground mt-1">Separate names with commas</p>
              </Field>

              <Field label="Video URL">
                <input type="url" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="YouTube or direct video URL" className="form-input" />
              </Field>

              <Field label="External Link">
                <input type="url" value={form.external_link} onChange={(e) => setForm({ ...form, external_link: e.target.value })} placeholder="https://project-demo.com" className="form-input" />
              </Field>

              <Field label="Project Images">
                <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-border bg-background text-sm text-muted-foreground cursor-pointer hover:border-accent transition-colors">
                  <Upload className="w-4 h-4" />
                  {imageFiles.length > 0 ? `${imageFiles.length} image(s) selected` : "Choose images…"}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setImageFiles(Array.from(e.target.files || []))} />
                </label>
              </Field>

              <Field label="PDF Document">
                <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-border bg-background text-sm text-muted-foreground cursor-pointer hover:border-accent transition-colors">
                  <Upload className="w-4 h-4" />
                  {pdfFile ? pdfFile.name : "Choose PDF file…"}
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
                </label>
              </Field>

              {formError && <p className="text-destructive text-xs">{formError}</p>}

              <button
                type="submit"
                disabled={createProject.isPending || updateProject.isPending || uploading}
                className="gradient-hero text-primary-foreground font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm mt-1 disabled:opacity-50"
              >
                {uploading ? "Uploading…" : editingId ? "Update Project" : "Add Project"}
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-3">
          <h2 className="font-sora text-lg font-semibold text-foreground mb-4">
            All Projects <span className="ml-2 text-sm font-normal text-muted-foreground">({projects.length})</span>
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
          ) : (
            <div className="flex flex-col gap-3">
              {projects.map((project) => (
                <div key={project.id} className="bg-card rounded-2xl border border-border shadow-card p-5 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary text-secondary-foreground uppercase">{project.semester}</span>
                      <h3 className="font-sora font-semibold text-sm text-foreground truncate">{project.title}</h3>
                      <StatusBadge status={project.status as any} />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{project.description}</p>
                    {project.team_members.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1.5">👥 {project.team_members.join(", ")}</p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => startEdit(project)} className="p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-secondary transition-colors" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteProject.mutate(project.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-[hsl(var(--status-taken-bg))] transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{label}</label>
    {children}
  </div>
);

export default Admin;

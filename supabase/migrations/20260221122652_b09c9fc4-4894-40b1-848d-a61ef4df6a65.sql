
-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  semester TEXT NOT NULL CHECK (semester IN ('S4', 'S6', 'S8')),
  category TEXT,
  status TEXT NOT NULL DEFAULT 'Idea Submitted' CHECK (status IN ('Idea Submitted', 'Taken')),
  team_members TEXT[] DEFAULT '{}',
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Anyone can read projects
CREATE POLICY "Anyone can read projects"
  ON public.projects FOR SELECT
  USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can insert projects"
  ON public.projects FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects"
  ON public.projects FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects"
  ON public.projects FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for project PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-pdfs', 'project-pdfs', true);

-- Storage RLS
CREATE POLICY "Anyone can read PDFs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-pdfs');

CREATE POLICY "Admins can upload PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-pdfs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete PDFs"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-pdfs' AND public.has_role(auth.uid(), 'admin'));

-- Seed initial projects
INSERT INTO public.projects (title, description, semester, category, status, team_members) VALUES
  ('Smart Campus Navigation App', 'A mobile-friendly web app that helps students navigate the campus in real-time, with AR overlays and interactive maps.', 'S6', 'Mobile / UX', 'Taken', ARRAY['Aya Benali', 'Karim Djellouli', 'Sara Mammeri']),
  ('AI-Powered Study Planner', 'A platform that uses machine learning to generate personalised study schedules based on course difficulty and performance.', 'S6', 'AI / EdTech', 'Taken', ARRAY['Youcef Hadj', 'Rania Oussama']),
  ('Peer Code Review Platform', 'A collaborative tool for students to submit code and receive structured peer feedback.', 'S6', 'Developer Tools', 'Idea Submitted', ARRAY[]::TEXT[]),
  ('Waste Management Dashboard', 'An IoT-integrated dashboard to monitor bin fill levels across the campus.', 'S6', 'IoT / Sustainability', 'Taken', ARRAY['Lina Bouchenafa', 'Anis Ferhat', 'Meriem Ziani', 'Omar Chettih']),
  ('Library Resource Management', 'A digital system for managing library books, reservations, and overdue tracking.', 'S4', 'Admin Tools', 'Taken', ARRAY['Fatima Zohra', 'Mehdi Khelifi']),
  ('Student Attendance Tracker', 'An automated attendance system using QR codes for lectures and practicals.', 'S4', 'EdTech', 'Idea Submitted', ARRAY[]::TEXT[]),
  ('E-Learning Quiz Platform', 'An interactive quiz and flashcard platform for self-study with progress tracking.', 'S4', 'EdTech', 'Taken', ARRAY['Imane Belhadj', 'Tariq Mansouri', 'Widad Cherif']),
  ('Hospital Patient Portal', 'A web portal for managing patient records, appointments, and medical history.', 'S8', 'Healthcare', 'Taken', ARRAY['Samir Boudali', 'Houria Djamel']),
  ('Smart Energy Monitor', 'An IoT solution to monitor real-time electricity consumption across campus buildings.', 'S8', 'IoT / Sustainability', 'Idea Submitted', ARRAY[]::TEXT[]),
  ('Blockchain Certificate Verification', 'A decentralised platform to issue and verify academic certificates using blockchain.', 'S8', 'Blockchain', 'Taken', ARRAY['Redouane Hamidi', 'Chaima Ouali', 'Fares Belkacem']);

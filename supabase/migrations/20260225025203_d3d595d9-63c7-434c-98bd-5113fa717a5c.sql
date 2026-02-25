
-- Fix storage RLS policies for project-pdfs bucket (likely cause of upload failures)
CREATE POLICY "Admins can upload project PDFs"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'project-pdfs' AND EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can update project PDFs"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'project-pdfs' AND EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can delete project PDFs"
ON storage.objects
FOR DELETE
USING (bucket_id = 'project-pdfs' AND EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Anyone can view project PDFs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-pdfs');

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);

CREATE POLICY "Admins can upload project images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'project-images' AND EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can delete project images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'project-images' AND EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Anyone can view project images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-images');

-- Add new columns to projects table
ALTER TABLE public.projects ADD COLUMN images text[] DEFAULT '{}'::text[];
ALTER TABLE public.projects ADD COLUMN video_url text;
ALTER TABLE public.projects ADD COLUMN external_link text;

-- Create storage bucket for AI agent avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ai-agent-avatars',
  'ai-agent-avatars',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Allow admins to upload/update/delete avatars
CREATE POLICY "Admins can upload agent avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ai-agent-avatars' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update agent avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'ai-agent-avatars' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete agent avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'ai-agent-avatars' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Allow everyone to view avatars (public bucket)
CREATE POLICY "Anyone can view agent avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'ai-agent-avatars');
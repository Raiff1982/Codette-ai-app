/*
  # Fix storage and file policies

  1. Changes
    - Drops existing conflicting policies
    - Creates storage bucket if not exists
    - Sets up proper RLS policies for storage.objects and codette_files
    - Adds admin role verification through user_roles table
  
  2. Security
    - Enables RLS on codette_files table
    - Restricts file uploads and deletions to admin users only
    - Allows authenticated users to read files
*/

-- Start transaction
BEGIN;

-- First ensure RLS is enabled
ALTER TABLE public.codette_files ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  -- Storage policies
  DROP POLICY IF EXISTS "Allow authenticated users to read files" ON storage.objects;
  DROP POLICY IF EXISTS "Allow admin users to upload files" ON storage.objects;
  DROP POLICY IF EXISTS "Allow admin users to delete files" ON storage.objects;
  
  -- Codette files policies
  DROP POLICY IF EXISTS "Allow authenticated users to read files" ON public.codette_files;
  DROP POLICY IF EXISTS "Allow admin users to insert files" ON public.codette_files;
  DROP POLICY IF EXISTS "Allow admin users to delete files" ON public.codette_files;
END $$;

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('codette-files', 'codette-files', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage.objects policies
CREATE POLICY "Allow authenticated users to read files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'codette-files');

CREATE POLICY "Allow admin users to upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'codette-files' 
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Allow admin users to delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'codette-files'
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- Create codette_files policies
CREATE POLICY "Allow authenticated users to read files"
ON public.codette_files FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow admin users to insert files"
ON public.codette_files FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Allow admin users to delete files"
ON public.codette_files FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

COMMIT;
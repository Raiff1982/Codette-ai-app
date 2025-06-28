/*
  # Storage and File Management Policies

  1. Changes
    - Enables RLS on codette_files table
    - Creates storage bucket if not exists
    - Sets up storage.objects policies for read/write access
    - Sets up codette_files policies for file management
    
  2. Security
    - All authenticated users can read files
    - Only admin users can upload/delete files
    - Uses user_roles table for role verification
    - Proper separation of read and write permissions

  3. Policies
    - Storage Objects:
      - Read: All authenticated users
      - Upload: Admin users only
      - Delete: Admin users only
    - Codette Files:
      - Read: All authenticated users
      - Manage (ALL): Admin users only
*/

-- Start transaction
BEGIN;

-- First ensure RLS is enabled
ALTER TABLE public.codette_files ENABLE ROW LEVEL SECURITY;

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('codette-files', 'codette-files', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  -- Drop storage.objects policies
  DROP POLICY IF EXISTS "Allow authenticated users to read files" ON storage.objects;
  DROP POLICY IF EXISTS "Allow admin users to upload files" ON storage.objects;
  DROP POLICY IF EXISTS "Allow admin users to delete files" ON storage.objects;
  
  -- Drop public.codette_files policies
  DROP POLICY IF EXISTS "Allow authenticated users to read files" ON public.codette_files;
  DROP POLICY IF EXISTS "Allow admin users to manage files" ON public.codette_files;
END $$;

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

-- Create public.codette_files policies
CREATE POLICY "Allow authenticated users to read files"
ON public.codette_files FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow admin users to manage files"
ON public.codette_files FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

COMMIT;
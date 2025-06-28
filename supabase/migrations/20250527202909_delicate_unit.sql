/*
  # Fix Storage and Codette Files Policies

  1. Changes
    - Drops existing conflicting policies
    - Creates new policies with proper checks
    - Ensures RLS is enabled
    - Sets up proper admin role checks

  2. Security
    - Enables RLS on codette_files table
    - Adds policies for authenticated users to read files
    - Adds policies for admin users to manage files
    - Uses proper role checks via user_roles table

  3. Tables Affected
    - storage.objects
    - public.codette_files
*/

-- Start transaction
BEGIN;

-- First ensure RLS is enabled
ALTER TABLE public.codette_files ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to avoid conflicts
DO $$ 
BEGIN
  -- Drop storage.objects policies
  DROP POLICY IF EXISTS "Allow authenticated users to read files" ON storage.objects;
  DROP POLICY IF EXISTS "Allow admin users to upload files" ON storage.objects;
  DROP POLICY IF EXISTS "Allow admin users to delete files" ON storage.objects;
  
  -- Drop public.codette_files policies
  DROP POLICY IF EXISTS "Allow authenticated users to read files" ON public.codette_files;
  DROP POLICY IF EXISTS "Allow admin users to insert files" ON public.codette_files;
  DROP POLICY IF EXISTS "Allow admin users to delete files" ON public.codette_files;
  DROP POLICY IF EXISTS "Allow admin users to manage files" ON public.codette_files;
END $$;

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('codette-files', 'codette-files', false)
ON CONFLICT (id) DO NOTHING;

-- Create new storage.objects policies
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

-- Create new public.codette_files policies
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
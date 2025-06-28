/*
  # Storage bucket and policies setup

  1. Changes
    - Create storage bucket for Codette files if it doesn't exist
    - Add RLS policies for file operations if they don't exist
    
  2. Security
    - Enable authenticated users to perform CRUD operations on files
    - Policies are scoped to the codette-files bucket only
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name)
VALUES ('codette-files', 'codette-files')
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the bucket
DO $$ 
BEGIN
  -- Check and create SELECT policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow authenticated users to read files'
  ) THEN
    CREATE POLICY "Allow authenticated users to read files"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'codette-files');
  END IF;

  -- Check and create INSERT policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload files'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload files"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'codette-files');
  END IF;

  -- Check and create UPDATE policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update files'
  ) THEN
    CREATE POLICY "Allow authenticated users to update files"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'codette-files')
    WITH CHECK (bucket_id = 'codette-files');
  END IF;

  -- Check and create DELETE policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete files'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete files"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'codette-files');
  END IF;
END $$;
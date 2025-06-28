-- Start transaction
BEGIN;

-- First ensure RLS is enabled on codette_files
ALTER TABLE public.codette_files ENABLE ROW LEVEL SECURITY;

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('codette-files', 'codette-files', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage.objects policies
DO $$ 
BEGIN
  -- Allow authenticated users to read files
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to read files'
  ) THEN
    CREATE POLICY "Allow authenticated users to read files"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'codette-files');
  END IF;

  -- Allow admin users to upload files
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow admin users to upload files'
  ) THEN
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
  END IF;

  -- Allow admin users to delete files
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow admin users to delete files'
  ) THEN
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
  END IF;
END $$;

-- Create codette_files policies
DO $$ 
BEGIN
  -- Allow authenticated users to read files
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'codette_files' 
    AND policyname = 'Allow authenticated users to read files'
  ) THEN
    CREATE POLICY "Allow authenticated users to read files"
    ON public.codette_files FOR SELECT
    TO authenticated
    USING (true);
  END IF;

  -- Allow admin users to insert files
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'codette_files' 
    AND policyname = 'Allow admin users to insert files'
  ) THEN
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
  END IF;

  -- Allow admin users to delete files
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'codette_files' 
    AND policyname = 'Allow admin users to delete files'
  ) THEN
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
  END IF;
END $$;

COMMIT;
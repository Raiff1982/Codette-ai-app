/*
  # Additional File Management Policies

  1. Changes
    - Add policy for admin file management
  
  2. Security
    - Ensure only admins can manage files
*/

DO $$ 
BEGIN
  -- Update the codette_files table policies
  DROP POLICY IF EXISTS "Allow admin users to manage files" ON public.codette_files;
  
  CREATE POLICY "Allow admin users to manage files"
  ON public.codette_files FOR ALL
  TO authenticated
  USING ((SELECT role FROM user_roles WHERE user_id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM user_roles WHERE user_id = auth.uid()) = 'admin');
END $$;
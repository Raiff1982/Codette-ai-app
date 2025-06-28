/*
  # Remove Kaggle Configuration

  1. Changes
    - Drop kaggle_config table
    - Remove get_kaggle_config function
    - Clean up any related policies

  2. Security
    - Ensures no orphaned data or functions remain
*/

-- Drop the get_kaggle_config function if it exists
DROP FUNCTION IF EXISTS public.get_kaggle_config();

-- Drop the kaggle_config table if it exists
DROP TABLE IF EXISTS public.kaggle_config;
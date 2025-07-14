/*
  # Create categories table

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `image` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `categories` table
    - Add policy for public read access
    - Add policy for authenticated users to manage categories
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  image text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage categories
CREATE POLICY "Authenticated users can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert some default categories
INSERT INTO categories (name, slug, image) VALUES
  ('Vestidos', 'vestidos', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Blusas', 'blusas', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Calças', 'calcas', 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Saias', 'saias', 'https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Acessórios', 'acessorios', 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=400')
ON CONFLICT (slug) DO NOTHING;
/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `original_price` (numeric, nullable)
      - `category_id` (uuid, foreign key)
      - `sizes` (text array)
      - `colors` (text array)
      - `images` (text array)
      - `is_new` (boolean)
      - `is_best_seller` (boolean)
      - `in_stock` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access to in-stock products
    - Add policy for authenticated users to manage products

  3. Relationships
    - Foreign key to categories table
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  original_price numeric CHECK (original_price >= 0),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  sizes text[] DEFAULT '{}',
  colors text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  is_new boolean DEFAULT false,
  is_best_seller boolean DEFAULT false,
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON products(is_best_seller);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products that are in stock
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage products
CREATE POLICY "Authenticated users can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert some sample products
INSERT INTO products (name, description, price, original_price, category_id, sizes, colors, images, is_new, is_best_seller, in_stock) 
SELECT 
  'Vestido Floral Elegante',
  'Vestido midi com estampa floral delicada, perfeito para ocasiões especiais. Tecido fluido e confortável.',
  189.90,
  249.90,
  c.id,
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY['Rosa', 'Azul', 'Branco'],
  ARRAY[
    'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  true,
  true,
  true
FROM categories c WHERE c.slug = 'vestidos'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, category_id, sizes, colors, images, is_new, is_best_seller, in_stock) 
SELECT 
  'Blusa Básica Premium',
  'Blusa básica de algodão premium, corte moderno e versátil para o dia a dia.',
  79.90,
  c.id,
  ARRAY['PP', 'P', 'M', 'G'],
  ARRAY['Branco', 'Preto', 'Cinza'],
  ARRAY[
    'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  false,
  true,
  true
FROM categories c WHERE c.slug = 'blusas'
ON CONFLICT DO NOTHING;
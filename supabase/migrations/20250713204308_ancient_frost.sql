/*
  # Fix RLS policies for public access

  1. Security Changes
    - Update RLS policies to allow public read access to categories and products
    - Keep admin operations restricted to authenticated users
    - Allow public insert for whatsapp_interactions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Categories are manageable by authenticated users" ON categories;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Products are manageable by authenticated users" ON products;
DROP POLICY IF EXISTS "WhatsApp interactions are insertable by everyone" ON whatsapp_interactions;
DROP POLICY IF EXISTS "WhatsApp interactions are viewable by authenticated users" ON whatsapp_interactions;
DROP POLICY IF EXISTS "Admin users are manageable by authenticated users" ON admin_users;

-- Create new policies for categories
CREATE POLICY "Enable read access for all users" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create new policies for products
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create new policies for whatsapp_interactions
CREATE POLICY "Enable insert access for all users" ON whatsapp_interactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users only" ON whatsapp_interactions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create new policies for admin_users
CREATE POLICY "Enable all access for authenticated users only" ON admin_users
  FOR ALL USING (auth.role() = 'authenticated');
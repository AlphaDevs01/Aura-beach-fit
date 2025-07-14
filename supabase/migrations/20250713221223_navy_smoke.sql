/*
  # Create WhatsApp interactions table

  1. New Tables
    - `whatsapp_interactions`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `product_name` (text)
      - `user_agent` (text, nullable)
      - `ip_address` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `whatsapp_interactions` table
    - Add policy for authenticated users to read interactions
    - Add policy for public to insert interactions

  3. Relationships
    - Foreign key to products table
*/

CREATE TABLE IF NOT EXISTS whatsapp_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  user_agent text,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_interactions_product_id ON whatsapp_interactions(product_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_interactions_created_at ON whatsapp_interactions(created_at);

ALTER TABLE whatsapp_interactions ENABLE ROW LEVEL SECURITY;

-- Allow public to insert interactions (for tracking)
CREATE POLICY "Anyone can create WhatsApp interactions"
  ON whatsapp_interactions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to read interactions
CREATE POLICY "Authenticated users can read WhatsApp interactions"
  ON whatsapp_interactions
  FOR SELECT
  TO authenticated
  USING (true);
/*
  # Schema inicial para catálogo de roupas femininas

  1. Novas Tabelas
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `image` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (decimal)
      - `original_price` (decimal, nullable)
      - `category_id` (uuid, foreign key)
      - `sizes` (text array)
      - `colors` (text array)
      - `images` (text array)
      - `is_new` (boolean)
      - `is_best_seller` (boolean)
      - `in_stock` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `whatsapp_interactions`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `product_name` (text)
      - `user_agent` (text)
      - `ip_address` (text)
      - `created_at` (timestamp)
    
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `role` (text)
      - `created_at` (timestamp)

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Políticas para leitura pública de produtos e categorias
    - Políticas para admin users apenas para usuários autenticados
    - Políticas para whatsapp_interactions
*/

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  original_price decimal(10,2),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  sizes text[] DEFAULT '{}',
  colors text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  is_new boolean DEFAULT false,
  is_best_seller boolean DEFAULT false,
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de interações WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  user_agent text,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de usuários admin
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas para categorias (leitura pública)
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Categories are manageable by authenticated users"
  ON categories
  FOR ALL
  TO authenticated
  USING (true);

-- Políticas para produtos (leitura pública)
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Products are manageable by authenticated users"
  ON products
  FOR ALL
  TO authenticated
  USING (true);

-- Políticas para interações WhatsApp
CREATE POLICY "WhatsApp interactions are insertable by everyone"
  ON whatsapp_interactions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "WhatsApp interactions are viewable by authenticated users"
  ON whatsapp_interactions
  FOR SELECT
  TO authenticated
  USING (true);

-- Políticas para admin users
CREATE POLICY "Admin users are manageable by authenticated users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (true);

-- Inserir dados iniciais de categorias
INSERT INTO categories (name, slug, image) VALUES
  ('Vestidos', 'vestidos', 'https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Blusas', 'blusas', 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Calças', 'calcas', 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Saias', 'saias', 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400');

-- Inserir produtos iniciais
INSERT INTO products (name, description, price, original_price, category_id, sizes, colors, images, is_new, is_best_seller, in_stock) 
SELECT 
  'Vestido Floral Primavera',
  'Vestido midi em tecido de viscose com estampa floral delicada. Perfeito para o dia a dia com elegância.',
  149.90,
  199.90,
  c.id,
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY['Rosa', 'Azul', 'Verde'],
  ARRAY['https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600'],
  true,
  false,
  true
FROM categories c WHERE c.slug = 'vestidos';

INSERT INTO products (name, description, price, category_id, sizes, colors, images, is_new, is_best_seller, in_stock)
SELECT 
  'Blusa Romântica de Renda',
  'Blusa feminina com detalhes em renda e manga bufante. Material premium e confortável.',
  89.90,
  c.id,
  ARRAY['P', 'M', 'G'],
  ARRAY['Branco', 'Rosa', 'Bege'],
  ARRAY['https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=600'],
  false,
  true,
  true
FROM categories c WHERE c.slug = 'blusas';

INSERT INTO products (name, description, price, category_id, sizes, colors, images, is_new, is_best_seller, in_stock)
SELECT 
  'Calça Wide Leg Elegante',
  'Calça pantalona de alfaiataria com cintura alta. Tecido premium com caimento perfeito.',
  179.90,
  c.id,
  ARRAY['36', '38', '40', '42', '44'],
  ARRAY['Preto', 'Marinho', 'Caramelo'],
  ARRAY['https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600'],
  true,
  true,
  true
FROM categories c WHERE c.slug = 'calcas';

INSERT INTO products (name, description, price, original_price, category_id, sizes, colors, images, is_new, is_best_seller, in_stock)
SELECT 
  'Saia Plissada Midi',
  'Saia midi plissada em tecido fluido. Versátil para diversas ocasiões.',
  119.90,
  159.90,
  c.id,
  ARRAY['P', 'M', 'G', 'GG'],
  ARRAY['Rosa', 'Preto', 'Nude'],
  ARRAY['https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=600'],
  false,
  false,
  true
FROM categories c WHERE c.slug = 'saias';

-- Inserir usuário admin inicial
INSERT INTO admin_users (email, name, role) VALUES
  ('admin@bellarosa.com', 'Administrador', 'admin');
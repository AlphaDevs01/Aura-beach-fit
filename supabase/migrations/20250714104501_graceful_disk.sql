-- Script completo para configurar o banco de dados e criar usuários admin
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Verificar se as tabelas existem e criar se necessário
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  image text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS whatsapp_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  user_agent text,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now()
);

-- 2. Habilitar RLS em todas as tabelas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON products(is_best_seller);
CREATE INDEX IF NOT EXISTS idx_whatsapp_interactions_product_id ON whatsapp_interactions(product_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_interactions_created_at ON whatsapp_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- 4. Criar função para verificar se é admin
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid()
  );
END;
$$;

-- 5. Criar função para criar usuários admin de forma segura
CREATE OR REPLACE FUNCTION create_admin_user_safe(
  user_email text,
  user_password text,
  user_name text,
  user_role text DEFAULT 'admin'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
  encrypted_pw text;
BEGIN
  -- Gerar ID único
  user_id := gen_random_uuid();
  
  -- Criptografar senha
  encrypted_pw := crypt(user_password, gen_salt('bf'));
  
  -- Inserir no auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    user_id,
    'authenticated',
    'authenticated',
    user_email,
    encrypted_pw,
    NOW(),
    NOW(),
    '',
    NOW(),
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}',
    '{}',
    FALSE,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL,
    FALSE,
    NULL
  );
  
  -- Inserir na tabela admin_users
  INSERT INTO admin_users (id, email, name, role)
  VALUES (user_id, user_email, user_name, user_role);
  
  RETURN user_id;
END;
$$;

-- 6. Criar políticas RLS para categorias
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;

CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can update categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admins can delete categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (is_admin_user());

-- 7. Criar políticas RLS para produtos
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admins can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (is_admin_user());

-- 8. Criar políticas RLS para whatsapp_interactions
DROP POLICY IF EXISTS "Anyone can create WhatsApp interactions" ON whatsapp_interactions;
DROP POLICY IF EXISTS "Authenticated users can read WhatsApp interactions" ON whatsapp_interactions;

CREATE POLICY "Anyone can create WhatsApp interactions"
  ON whatsapp_interactions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read WhatsApp interactions"
  ON whatsapp_interactions
  FOR SELECT
  TO authenticated
  USING (true);

-- 9. Criar políticas RLS para admin_users
DROP POLICY IF EXISTS "Admins can read all admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can create admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can delete admin users" ON admin_users;

CREATE POLICY "Admins can read all admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admins can create admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can update admin users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admins can delete admin users"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (is_admin_user());

-- 10. Inserir categorias padrão se não existirem
INSERT INTO categories (name, slug, image) VALUES
  ('Vestidos', 'vestidos', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Blusas', 'blusas', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Calças', 'calcas', 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Saias', 'saias', 'https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Acessórios', 'acessorios', 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=400')
ON CONFLICT (slug) DO NOTHING;

-- 11. CRIAR OS USUÁRIOS ADMIN SOLICITADOS
-- Vanessa
SELECT create_admin_user_safe(
  'vanessa@aurafitness.com',
  'alphadevss1205',
  'Vanessa',
  'super_admin'
);

-- Duda
SELECT create_admin_user_safe(
  'duda@aurafitness.com',
  'alphadevss1205',
  'Duda',
  'admin'
);

-- 12. Verificar se os usuários foram criados corretamente
SELECT 'Usuários admin criados:' as status;
SELECT email, name, role, created_at FROM admin_users ORDER BY created_at DESC;

SELECT 'Usuários no auth.users:' as status;
SELECT id, email, created_at FROM auth.users WHERE email LIKE '%@aurafitness.com%' ORDER BY created_at DESC;

-- 13. Inserir alguns produtos de exemplo se não existirem
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

-- FIM DO SCRIPT
SELECT 'Setup completo! Banco de dados configurado com sucesso.' as resultado;
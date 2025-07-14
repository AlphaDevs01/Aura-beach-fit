/*
  # Sistema de autenticação para administradores

  1. Novas Funcionalidades
    - Função para criar novos usuários admin
    - Função para verificar se um usuário é admin
    - Políticas de segurança atualizadas
    - Trigger para sincronizar admin_users com auth.users

  2. Segurança
    - RLS habilitado com políticas específicas para admins
    - Função segura para criação de admins
    - Verificação de permissões

  3. Funções Utilitárias
    - create_admin_user: Criar novos admins
    - is_admin: Verificar se usuário é admin
*/

-- Função para verificar se o usuário atual é admin
CREATE OR REPLACE FUNCTION is_admin()
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

-- Função para criar um novo usuário admin
CREATE OR REPLACE FUNCTION create_admin_user(
  email text,
  password text,
  name text,
  role text DEFAULT 'admin'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
  admin_id uuid;
BEGIN
  -- Verificar se o usuário atual é admin (exceto se for o primeiro admin)
  IF EXISTS (SELECT 1 FROM admin_users LIMIT 1) AND NOT is_admin() THEN
    RAISE EXCEPTION 'Apenas administradores podem criar novos admins';
  END IF;

  -- Criar usuário no auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    email,
    crypt(password, gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    '',
    '',
    '',
    ''
  ) RETURNING id INTO user_id;

  -- Criar entrada na tabela admin_users
  INSERT INTO admin_users (id, email, name, role)
  VALUES (user_id, email, name, role)
  RETURNING id INTO admin_id;

  RETURN admin_id;
END;
$$;

-- Atualizar políticas RLS para admin_users
DROP POLICY IF EXISTS "Admin users are manageable by authenticated users" ON admin_users;

CREATE POLICY "Admins can read all admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can create admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update admin users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete admin users"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Atualizar políticas para products
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON products;

CREATE POLICY "Admins can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Atualizar políticas para categories
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON categories;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON categories;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON categories;

CREATE POLICY "Admins can insert categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Criar o primeiro usuário admin se não existir
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admin_users LIMIT 1) THEN
    PERFORM create_admin_user(
      'admin@aurafitness.com',
      'admin123',
      'Administrador Principal',
      'super_admin'
    );
  END IF;
END $$;
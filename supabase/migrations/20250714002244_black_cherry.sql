/*
  # Corrigir sistema de autenticação de admins

  1. Criar função para inserir usuário diretamente no auth.users
  2. Criar usuário admin padrão
  3. Função para criar novos admins de forma segura
  4. Políticas RLS atualizadas
*/

-- Função para criar usuário admin de forma segura
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

-- Criar usuário admin padrão se não existir
DO $$
DECLARE
  admin_exists boolean;
BEGIN
  -- Verificar se já existe um admin
  SELECT EXISTS(SELECT 1 FROM admin_users WHERE email = 'admin@aurafitness.com') INTO admin_exists;
  
  IF NOT admin_exists THEN
    PERFORM create_admin_user_safe(
      'admin@aurafitness.com',
      'admin123',
      'Administrador Principal',
      'super_admin'
    );
  END IF;
END $$;

-- Função simplificada para verificar se é admin
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

-- Atualizar políticas RLS para usar a nova função
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

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

-- Atualizar políticas para categories
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;

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

-- Atualizar políticas para admin_users
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
/*
  # Create admin users table

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text)
      - `role` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `admin_users` table
    - Add policy for authenticated users to read their own data
    - Add policy for admin users to manage all admin users

  3. Relationships
    - Foreign key to auth.users table
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own admin data
CREATE POLICY "Users can read own admin data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow admin users to manage all admin users
CREATE POLICY "Admin users can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );
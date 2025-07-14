-- Script para criar novos usuários administradores
-- Execute este script no SQL Editor do Supabase Dashboard

-- Para criar um novo admin, execute:
SELECT create_admin_user_safe(
  'novo_admin@exemplo.com',  -- Email do novo admin
  'senha123',                -- Senha do novo admin
  'Nome do Admin',           -- Nome completo
  'admin'                    -- Função: 'admin' ou 'super_admin'
);

-- Exemplos de uso:

-- 1. Criar um admin comum:
-- SELECT create_admin_user_safe('joao@loja.com', 'minhasenha', 'João Silva', 'admin');

-- 2. Criar um super admin:
-- SELECT create_admin_user_safe('maria@loja.com', 'senhasegura', 'Maria Santos', 'super_admin');

-- 3. Verificar admins existentes:
-- SELECT * FROM admin_users ORDER BY created_at DESC;

-- 4. Verificar usuários no auth.users:
-- SELECT id, email, created_at FROM auth.users WHERE email LIKE '%@loja.com%';

-- IMPORTANTE: 
-- - Substitua os valores pelos dados reais do novo admin
-- - Use senhas seguras em produção
-- - Execute apenas uma linha SELECT por vez
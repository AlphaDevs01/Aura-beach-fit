# Aura Beach & Fit - Catálogo de Roupas Femininas

Um catálogo moderno e elegante para moda feminina com painel administrativo completo.

## 🚀 Deploy na Vercel

### Pré-requisitos

1. **Conta na Vercel**: [vercel.com](https://vercel.com)
2. **Projeto Supabase configurado** com as variáveis de ambiente
3. **Repositório Git** (GitHub, GitLab, ou Bitbucket)

### Passos para Deploy

#### 1. Configurar Variáveis de Ambiente no Supabase

No seu projeto Supabase, vá em **Settings > API** e copie:
- `Project URL` (VITE_SUPABASE_URL)
- `anon public` key (VITE_SUPABASE_ANON_KEY)

#### 2. Deploy na Vercel

1. **Via Dashboard da Vercel:**
   - Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
   - Clique em "New Project"
   - Conecte seu repositório Git
   - Configure as variáveis de ambiente:
     ```
     VITE_SUPABASE_URL=https://seu-projeto.supabase.co
     VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
     ```
   - Clique em "Deploy"

2. **Via Vercel CLI:**
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel
   
   # Fazer login
   vercel login
   
   # Deploy
   vercel
   
   # Configurar variáveis de ambiente
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   
   # Redeploy com as variáveis
   vercel --prod
   ```

#### 3. Configurar Domínio Personalizado (Opcional)

1. No dashboard da Vercel, vá em **Settings > Domains**
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções da Vercel

### 🔧 Configurações Importantes

#### Variáveis de Ambiente Obrigatórias

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

#### Configuração do Supabase

Certifique-se de que as seguintes configurações estão corretas no Supabase:

1. **Authentication > URL Configuration:**
   - Site URL: `https://seu-dominio.vercel.app`
   - Redirect URLs: `https://seu-dominio.vercel.app/**`

2. **Database > RLS Policies:**
   - Todas as políticas RLS devem estar configuradas corretamente
   - Usuários admin devem estar criados na tabela `admin_users`

### 🔐 Acesso Administrativo

#### Usuários Admin Padrão

Os seguintes usuários admin foram configurados:

1. **Vanessa (Super Admin)**
   - Email: `vanessa@aurafitness.com`
   - Senha: `alphadevss1205`

2. **Duda (Admin)**
   - Email: `duda@aurafitness.com`
   - Senha: `alphadevss1205`

#### Acessar o Painel Admin

1. Vá para `https://seu-dominio.vercel.app/#/admin/login`
2. Use as credenciais acima para fazer login
3. Gerencie produtos, categorias, pedidos e usuários

### 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

### 📱 Funcionalidades

#### Para Clientes
- ✅ Catálogo de produtos com filtros
- ✅ Carrinho de compras
- ✅ Lista de favoritos
- ✅ Integração com WhatsApp
- ✅ Design responsivo

#### Para Administradores
- ✅ Painel administrativo completo
- ✅ Gerenciamento de produtos
- ✅ Gerenciamento de categorias
- ✅ Controle de pedidos e mensagens
- ✅ Gerenciamento de usuários admin
- ✅ Configurações da loja

### 🔍 Solução de Problemas

#### Rotas do Admin não funcionam

Se as rotas do admin não estiverem funcionando após o deploy:

1. **Verifique o arquivo `vercel.json`** - deve estar configurado para SPA
2. **Limpe o cache do navegador** - Ctrl+F5 ou Cmd+Shift+R
3. **Verifique as variáveis de ambiente** na Vercel
4. **Acesse diretamente**: `https://seu-dominio.vercel.app/#/admin/login`

#### Problemas de Autenticação

1. Verifique se as URLs estão configuradas corretamente no Supabase
2. Confirme que os usuários admin existem na tabela `admin_users`
3. Teste o login com as credenciais fornecidas

#### Produtos não carregam

1. Verifique a conexão com o Supabase
2. Confirme que as políticas RLS estão corretas
3. Verifique se há dados nas tabelas `categories` e `products`

### 📞 Suporte

Para suporte técnico, entre em contato através do WhatsApp: (62) 99684-2833

---

**Desenvolvido por AlphaDevSS** 💻
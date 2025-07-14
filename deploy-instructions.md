# 🚀 Instruções de Deploy para Vercel

## Passos Rápidos para Deploy

### 1. Preparar o Repositório

Certifique-se de que todos os arquivos estão commitados no Git:

```bash
git add .
git commit -m "Preparar para deploy na Vercel"
git push origin main
```

### 2. Deploy na Vercel

#### Opção A: Via Dashboard (Recomendado)

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "New Project"
3. Conecte seu repositório GitHub/GitLab/Bitbucket
4. Configure as variáveis de ambiente:
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
   ```
5. Clique em "Deploy"

#### Opção B: Via CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login na Vercel
vercel login

# Deploy
vercel

# Adicionar variáveis de ambiente
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy final
vercel --prod
```

### 3. Configurar Supabase

No painel do Supabase, vá em **Authentication > URL Configuration**:

- **Site URL**: `https://seu-projeto.vercel.app`
- **Redirect URLs**: `https://seu-projeto.vercel.app/**`

### 4. Testar o Deploy

1. **Área Pública**: `https://seu-projeto.vercel.app`
2. **Admin Login**: `https://seu-projeto.vercel.app/#/admin/login`

#### Credenciais de Admin:

**Vanessa (Super Admin):**
- Email: `vanessa@aurafitness.com`
- Senha: `alphadevss1205`

**Duda (Admin):**
- Email: `duda@aurafitness.com`
- Senha: `alphadevss1205`

## ⚠️ Problemas Comuns e Soluções

### Rotas do Admin não funcionam

**Solução**: O arquivo `vercel.json` foi configurado para resolver isso. Se ainda houver problemas:

1. Limpe o cache do navegador (Ctrl+F5)
2. Acesse diretamente: `https://seu-dominio.vercel.app/#/admin/login`
3. Verifique se o arquivo `vercel.json` está no root do projeto

### Erro de variáveis de ambiente

**Solução**: 
1. Vá no dashboard da Vercel > Settings > Environment Variables
2. Adicione as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Faça um novo deploy

### Página em branco

**Solução**:
1. Verifique o console do navegador (F12)
2. Confirme que as variáveis de ambiente estão corretas
3. Verifique se o Supabase está configurado corretamente

## 📋 Checklist Final

- [ ] Código commitado no Git
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] URLs configuradas no Supabase
- [ ] Deploy realizado com sucesso
- [ ] Área pública funcionando
- [ ] Login admin funcionando
- [ ] Produtos carregando corretamente

## 🎉 Pronto!

Seu projeto está agora rodando na Vercel com todas as funcionalidades:

- ✅ Catálogo público funcionando
- ✅ Painel administrativo acessível
- ✅ Integração WhatsApp ativa
- ✅ Sistema de autenticação funcionando

**URL do Admin**: `https://seu-dominio.vercel.app/#/admin/login`
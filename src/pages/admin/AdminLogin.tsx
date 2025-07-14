import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { dispatch } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Tentando fazer login com:', credentials.email);
      
      // Fazer login no Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        console.error('Erro de autenticação:', authError);
        throw new Error('Email ou senha incorretos');
      }

      if (!authData.user) {
        throw new Error('Falha na autenticação');
      }

      console.log('Login bem-sucedido, verificando se é admin...');

      // Verificar se o usuário é admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (adminError || !adminData) {
        console.error('Usuário não é admin:', adminError);
        await supabase.auth.signOut();
        throw new Error('Usuário não tem permissões de administrador');
      }

      console.log('Admin verificado:', adminData);

      // Definir usuário no contexto
      dispatch({
        type: 'SET_USER',
        payload: adminData
      });

      console.log('Redirecionando para /admin');
      navigate('/admin');
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error instanceof Error ? error.message : 'Erro no login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.jpg" 
              alt="Aura beach & fit" 
              className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover"
            />
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h2>
          <p className="text-sm lg:text-base text-gray-600">Entre com suas credenciais para acessar</p>
        </div>

        <form className="bg-white p-6 lg:p-8 rounded-xl shadow-lg space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 lg:px-4 lg:py-3 rounded-lg text-sm lg:text-base">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm lg:text-base"
              placeholder="admin@aurafitness.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-10 lg:pr-12 text-sm lg:text-base"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye className="w-4 h-4 lg:w-5 lg:h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white py-2 lg:py-3 px-4 rounded-lg font-semibold transition-colors text-sm lg:text-base"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
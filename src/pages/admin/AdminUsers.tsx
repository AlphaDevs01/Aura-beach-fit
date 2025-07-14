import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, User, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminUser } from '../../types';

interface AdminUserForm {
  id?: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  password?: string;
}

export default function AdminUsers() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserForm | null>(null);
  const [formData, setFormData] = useState<AdminUserForm>({
    email: '',
    name: '',
    role: 'admin',
    password: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdminUsers(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários admin:', error);
      alert('Erro ao carregar usuários admin');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof AdminUserForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const openForm = (user?: AdminUser) => {
    if (user) {
      setFormData({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as 'admin' | 'super_admin'
      });
      setEditingUser(user);
    } else {
      setFormData({
        email: '',
        name: '',
        role: 'admin',
        password: ''
      });
      setEditingUser(null);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
    setFormData({
      email: '',
      name: '',
      role: 'admin',
      password: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!formData.email || !formData.name) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      if (!editingUser && !formData.password) {
        alert('Senha é obrigatória para novos usuários.');
        return;
      }

      if (editingUser) {
        // Atualizar usuário existente
        const { error } = await supabase
          .from('admin_users')
          .update({
            email: formData.email,
            name: formData.name,
            role: formData.role
          })
          .eq('id', formData.id);

        if (error) throw error;
        alert('Usuário atualizado com sucesso!');
      } else {
        // Criar novo usuário usando a função do banco
        const { data, error } = await supabase.rpc('create_admin_user_safe', {
          user_email: formData.email,
          user_password: formData.password,
          user_name: formData.name,
          user_role: formData.role
        });

        if (error) throw error;
        alert('Usuário criado com sucesso!');
      }

      await fetchAdminUsers();
      closeForm();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert(`Erro ao salvar usuário: ${error?.message || 'Tente novamente.'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchAdminUsers();
      alert('Usuário excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert(`Erro ao excluir usuário: ${error?.message || 'Tente novamente.'}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Usuários Administradores</h1>
          <p className="text-sm lg:text-base text-gray-600">Gerencie os usuários com acesso ao painel administrativo</p>
        </div>
        <button
          onClick={() => openForm()}
          className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg flex items-center gap-2 transition-colors text-sm lg:text-base"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo Admin</span>
          <span className="sm:hidden">Novo</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Mobile Cards View */}
        <div className="block lg:hidden">
          {adminUsers.map((user) => (
            <div key={user.id} className="p-4 border-b border-gray-100 last:border-b-0">
              <div className="flex items-start gap-3">
                <img 
                  src="/logo.jpg" 
                  alt="Aura beach & fit" 
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{user.name}</h3>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                    </div>
                    <span className={`ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      user.role === 'super_admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      <Shield className="w-3 h-3" />
                      {user.role === 'super_admin' ? 'Super' : 'Admin'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openForm(user)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        <span className="hidden sm:inline">Editar</span>
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="hidden sm:inline">Excluir</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Usuário</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">E-mail</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Função</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Criado em</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src="/logo.jpg" 
                        alt="Aura beach & fit" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{user.email}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'super_admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      <Shield className="w-3 h-3" />
                      {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openForm(user)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {adminUsers.length === 0 && (
          <div className="text-center py-12">
            <img 
              src="/logo.jpg" 
              alt="Aura beach & fit" 
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
            />
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-sm lg:text-base text-gray-600 mb-6">Adicione o primeiro usuário administrador</p>
            <button
              onClick={() => openForm()}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg text-sm lg:text-base"
            >
              Adicionar Primeiro Admin
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 lg:p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[95vh] lg:max-h-[90vh] overflow-y-auto">
            <div className="p-4 lg:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                  {editingUser ? 'Editar Usuário' : 'Novo Usuário Admin'}
                </h2>
                <button
                  onClick={closeForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                    placeholder="Nome do administrador"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                    placeholder="admin@exemplo.com"
                    required
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                      placeholder="••••••••"
                      required={!editingUser}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Função
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm lg:text-base"
                  >
                    <option value="admin">Administrador</option>
                    <option value="super_admin">Super Administrador</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Super Admins podem gerenciar outros administradores
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 lg:px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white py-2 px-3 lg:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm lg:text-base"
                  >
                    {saving ? (
                      <>Salvando...</>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingUser ? 'Atualizar' : 'Criar'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
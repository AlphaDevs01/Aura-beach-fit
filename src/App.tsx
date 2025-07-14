import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import AdminProducts from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Settings from './pages/admin/Settings';
import AdminUsers from './pages/admin/AdminUsers';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  return state.user ? <>{children}</> : <Navigate to="/admin/login" />;
}

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/produto/:id" element={<ProductDetail />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/categorias" element={<Products />} />
            <Route path="/categoria/:slug" element={<Products />} />
            <Route path="/contato" element={<div className="p-8">Página de Contato</div>} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="produtos" element={<AdminProducts />} />
              <Route path="categorias" element={<Categories />} />
              <Route path="mensagens" element={<Orders />} />
              <Route path="usuarios" element={<AdminUsers />} />
              <Route path="configuracoes" element={<Settings />} />
            </Route>
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
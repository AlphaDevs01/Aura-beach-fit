import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Shield, Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

export default function Home() {
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const newProducts = products.filter(p => p.is_new).slice(0, 8);
  const bestSellers = products.filter(p => p.is_best_seller).slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center">
        {/* Banner para telas pequenas */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
          style={{ backgroundImage: 'url(/banner-pequeno.jpg)' }}
        ></div>
        
        {/* Banner para telas grandes */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
          style={{ backgroundImage: 'url(/banner-grande.png)' }}
        ></div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Categorias</h2>
            <p className="text-lg text-gray-600">Encontre exatamente o que você procura</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoriesLoading ? (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">Carregando categorias...</p>
              </div>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categoria/${category.slug}`}
                  className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-gray-100"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                    <p className="text-white/80 text-sm">{category.productCount || 0} produtos</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Novidades</h2>
              <p className="text-lg text-gray-600">As últimas tendências da moda feminina</p>
            </div>
            <Link
              to="/produtos?filter=new"
              className="text-pink-600 hover:text-pink-700 font-semibold flex items-center"
            >
              Ver Todos
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsLoading ? (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">Carregando produtos...</p>
              </div>
            ) : newProducts.length > 0 ? (
              newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">Nenhum produto novo encontrado</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Mais Vendidos</h2>
              <p className="text-lg text-gray-600">Os favoritos das nossas clientes</p>
            </div>
            <Link
              to="/produtos?filter=bestseller"
              className="text-pink-600 hover:text-pink-700 font-semibold flex items-center"
            >
              Ver Todos
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsLoading ? (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">Carregando produtos...</p>
              </div>
            ) : bestSellers.length > 0 ? (
              bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">Nenhum produto mais vendido encontrado</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que escolher a Aura beach & fit?</h2>
            <p className="text-lg text-gray-600">Qualidade e atendimento que você merece</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Qualidade Premium</h3>
              <p className="text-gray-600">Peças selecionadas com os melhores materiais</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Atendimento Personalizado</h3>
              <p className="text-gray-600">Nossa equipe está pronta para te ajudar via WhatsApp: (62) 99684-2833</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Compra Segura</h3>
              <p className="text-gray-600">Suas informações sempre protegidas</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">Receba seus produtos com agilidade</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
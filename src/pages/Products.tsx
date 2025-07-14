import React, { useState, useMemo } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

export default function Products() {
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    size: '',
    sortBy: 'newest'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category && product.category.slug === filters.category
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        }
        return product.price >= min;
      });
    }

    if (filters.size) {
      filtered = filtered.filter(product => 
        product.sizes && Array.isArray(product.sizes) && product.sizes.includes(filters.size)
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return filtered;
  }, [filters, products]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Todos os Produtos</h1>
          <p className="text-gray-600">Descubra nossa coleção completa de moda feminina</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="newest">Mais recentes</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="name">Nome A-Z</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{filteredProducts.length} produtos</span>
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 bg-white p-6 rounded-xl shadow-sm h-fit">
              <h3 className="font-semibold text-gray-900 mb-4">Filtros</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Todas</option>
                  {categoriesLoading ? (
                    <option disabled>Carregando...</option>
                  ) : (
                    categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))
                  )}
                </select>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Faixa de Preço</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Todos</option>
                  <option value="0-50">Até R$ 50</option>
                  <option value="50-100">R$ 50 - R$ 100</option>
                  <option value="100-200">R$ 100 - R$ 200</option>
                  <option value="200">Acima de R$ 200</option>
                </select>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tamanho</label>
                <select
                  value={filters.size}
                  onChange={(e) => handleFilterChange('size', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Todos</option>
                  <option value="P">P</option>
                  <option value="M">M</option>
                  <option value="G">G</option>
                  <option value="GG">GG</option>
                </select>
              </div>

              <button
                onClick={() => setFilters({ category: '', priceRange: '', size: '', sortBy: 'newest' })}
                className="w-full text-pink-600 hover:text-pink-700 font-semibold py-2 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {productsLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Carregando produtos...</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-6"
              }>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    className={viewMode === 'list' ? 'flex flex-row' : ''}
                  />
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum produto encontrado com os filtros selecionados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
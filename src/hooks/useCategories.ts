import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Category } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching categories...');
      
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) {
        console.error('Categories fetch error:', categoriesError);
        throw categoriesError;
      }
      
      console.log('Categories fetched:', categoriesData?.length || 0);
      
      // Get product counts for each category in a single query
      const categoriesWithCount = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('in_stock', true);
            
          return {
            ...category,
            productCount: count || 0
          };
        })
      );

      setCategories(categoriesWithCount);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
}
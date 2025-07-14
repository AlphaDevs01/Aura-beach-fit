import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching products...');
      
      // Get products with their categories
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            slug,
            image
          )
        `)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Products fetch error:', productsError);
        throw productsError;
      }
      
      console.log('Products fetched:', productsData?.length || 0);
      
      const productsWithCategories = (productsData || []).map(product => ({
        ...product,
        category: product.categories || null
      }));
      
      setProducts(productsWithCategories);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Get the product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              id,
              name,
              slug,
              image
            )
          `)
          .eq('id', id)
          .single();

        if (productError) throw productError;
        
        setProduct({
          ...productData,
          category: productData.categories || null
        });
      } catch (err) {
        console.error('Erro ao carregar produto:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
}
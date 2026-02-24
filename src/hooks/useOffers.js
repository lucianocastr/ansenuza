import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setOffers(data ?? []);
        setLoading(false);
      });
  }, []);

  return { offers, loading, error };
}

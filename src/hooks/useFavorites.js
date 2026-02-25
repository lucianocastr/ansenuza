import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { offers } from '../data/mockData';

const FAVORITES_KEY = '@ansenuza_favorites';
const DEFAULT_IDS = offers.filter((o) => o.isFavorite).map((o) => o.id);

export function useFavorites() {
  const [ids, setIds] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY).then((val) => {
      if (val === null) {
        setIds(DEFAULT_IDS);
        AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(DEFAULT_IDS));
      } else {
        setIds(JSON.parse(val));
      }
    });
  }, []);

  const toggleFavorite = useCallback((id) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((id) => ids.includes(id), [ids]);

  const favoriteOffers = offers.filter((o) => ids.includes(o.id));

  return { isFavorite, toggleFavorite, favoriteOffers };
}

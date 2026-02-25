import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useFavorites } from '../hooks/useFavorites';

const CATEGORY_COLORS = {
  Hospedaje: colors.primary,
  Servicio: colors.categoryService,
  Negocio: colors.categoryBusiness,
};

export default function OfertaCard({ offer, onPress }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const categoryColor = CATEGORY_COLORS[offer.category] || colors.primary;
  const [imgError, setImgError] = useState(false);

  return (
    <View style={styles.card}>
      {/* Imagen */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imgError ? `https://picsum.photos/seed/${offer.id}_fb/400/300` : offer.image }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />

        {/* Badge categoría */}
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryText}>{offer.category}</Text>
        </View>

        {/* Favorito */}
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => toggleFavorite(offer.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons
            name={isFavorite(offer.id) ? 'favorite' : 'favorite-border'}
            size={20}
            color={isFavorite(offer.id) ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {offer.title}
          </Text>
          <View style={styles.ratingRow}>
            <MaterialIcons name="star" size={14} color={colors.star} />
            <Text style={styles.ratingText}>{offer.rating}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <MaterialIcons name="location-on" size={13} color={colors.textMuted} />
          <Text style={styles.locationText} numberOfLines={1}>
            {offer.location}
          </Text>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>{offer.priceLabel}</Text>
            <Text style={styles.price}>
              ${offer.price}
              <Text style={styles.priceSuffix}>{offer.priceSuffix}</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.detailsBtn} onPress={onPress}>
            <Text style={styles.detailsBtnText}>
              {offer.category === 'Servicio' ? 'Reservar' : 'Ver Detalles'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: { position: 'relative', height: 180 },
  image: { width: '100%', height: '100%' },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  info: { padding: 14 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.text, marginRight: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: 12, fontWeight: '700', color: colors.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 12 },
  locationText: { fontSize: 12, color: colors.textSecondary, flex: 1 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  priceLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  price: { fontSize: 18, fontWeight: '800', color: colors.primary },
  priceSuffix: { fontSize: 11, fontWeight: '500', color: colors.textSecondary },
  detailsBtn: {
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  detailsBtnText: { fontSize: 13, fontWeight: '700', color: colors.primary },
});

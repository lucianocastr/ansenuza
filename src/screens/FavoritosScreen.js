import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useFavorites } from '../hooks/useFavorites';

export default function FavoritosScreen({ navigation }) {
  const { favoriteOffers, toggleFavorite } = useFavorites();

  if (favoriteOffers.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mis Favoritos</Text>
        </View>
        <View style={styles.empty}>
          <MaterialIcons name="favorite-border" size={56} color={colors.border} />
          <Text style={styles.emptyTitle}>Sin favoritos aún</Text>
          <Text style={styles.emptyText}>
            Explorá las ofertas y guardá las que más te gusten tocando el corazón.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Favoritos</Text>
        <Text style={styles.headerCount}>{favoriteOffers.length} guardados</Text>
      </View>

      <FlatList
        data={favoriteOffers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('Explorar', {
                screen: 'DetalleOferta',
                params: { offer: item },
              })
            }
            activeOpacity={0.88}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.locationRow}>
                <MaterialIcons name="location-on" size={13} color={colors.textSecondary} />
                <Text style={styles.location} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>
              <View style={styles.bottomRow}>
                <Text style={styles.price}>
                  ${item.price}
                  <Text style={styles.priceSuffix}> {item.priceSuffix}</Text>
                </Text>
                <View style={styles.ratingRow}>
                  <MaterialIcons name="star" size={13} color={colors.star} />
                  <Text style={styles.rating}>{item.rating}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.heartBtn}
              onPress={() => toggleFavorite(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="favorite" size={22} color={colors.primary} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderPrimary,
    backgroundColor: 'rgba(247,246,248,0.9)',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  headerCount: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  list: { padding: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    paddingRight: 12,
  },
  image: { width: 90, height: 90 },
  info: { flex: 1, padding: 12, gap: 4 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  title: { fontSize: 14, fontWeight: '700', color: colors.text, lineHeight: 19 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  location: { fontSize: 11, color: colors.textSecondary, flex: 1 },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  price: { fontSize: 15, fontWeight: '800', color: colors.text },
  priceSuffix: { fontSize: 11, fontWeight: '400', color: colors.textMuted },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  rating: { fontSize: 12, fontWeight: '700', color: colors.star },
  heartBtn: { padding: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

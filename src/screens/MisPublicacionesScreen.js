import React, { useMemo } from 'react';
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
import { useListings } from '../hooks/useListings';
import ListingItem from '../components/ListingItem';
import SkeletonCard from '../components/SkeletonCard';

export default function MisPublicacionesScreen({ navigation }) {
  const { listings, loading, error, refresh } = useListings();

  const stats = useMemo(() => [
    { label: 'Activas', value: String(listings.filter(l => l.status === 'active').length), color: colors.primary },
    { label: 'Pendientes', value: String(listings.filter(l => l.status === 'pending').length), color: colors.warning },
    { label: 'Pausadas', value: String(listings.filter(l => l.status === 'paused').length), color: colors.textMuted },
  ], [listings]);
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Mis Publicaciones</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="notifications-none" size={22} color={colors.textSecondary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <View style={styles.avatarSmall}>
            <Image
              source={{ uri: 'https://picsum.photos/seed/provider_avatar/80/80' }}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
        </View>
      </View>

      {/* Stats cards */}
      <View style={styles.statsGrid}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statLabel}>{s.label}</Text>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
          </View>
        ))}
      </View>

      {/* Listados */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Listados Actuales</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Filtrar</Text>
          <MaterialIcons name="filter-list" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorState}>
          <MaterialIcons name="cloud-off" size={48} color={colors.textMuted} />
          <Text style={styles.errorText}>No se pudieron cargar las publicaciones</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refresh}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 12, gap: 12 }}>
          {[1, 2, 3].map((k) => <SkeletonCard key={k} />)}
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListingItem
              item={item}
              onStats={() => navigation.navigate('Estadísticas')}
              onEdit={() => navigation.navigate('EditarPublicacion', { item, onSuccess: refresh })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NuevaPublicacion', { onSuccess: refresh })}
        activeOpacity={0.88}
      >
        <MaterialIcons name="add-circle-outline" size={22} color="white" />
        <Text style={styles.fabText}>Crear Nueva Publicación</Text>
      </TouchableOpacity>
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
  headerLeft: {},
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  iconBtn: { position: 'relative', padding: 8 },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.borderPrimary,
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statValue: { fontSize: 24, fontWeight: '800' },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  listTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  filterText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  listContent: { paddingHorizontal: 16, gap: 12, paddingBottom: 160 },
  fab: {
    position: 'absolute',
    bottom: 80,
    left: 24,
    right: 24,
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: { color: 'white', fontSize: 15, fontWeight: '700' },
  errorState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 10, backgroundColor: colors.primary, borderRadius: 10 },
  retryText: { color: 'white', fontWeight: '700', fontSize: 14 },
});

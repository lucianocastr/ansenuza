import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useOffers } from '../hooks/useOffers';
import OfertaCard from '../components/OfertaCard';

const CATEGORIES = ['Todos', 'Hospedaje', 'Negocio', 'Servicio'];

// Chips de filtro (decorativos — fidelidad visual al mock)
const FILTER_CHIPS = [
  { label: 'Filtros', icon: 'tune', isMain: true },
  { label: 'Precio', icon: 'payments', hasArrow: true },
  { label: 'Fechas', icon: 'calendar-month', hasArrow: true },
  { label: 'Nombre', icon: 'sort-by-alpha', hasArrow: false },
];

export default function ListadoOfertasScreen({ navigation }) {
  const { offers, loading } = useOffers();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filtered = useMemo(() => {
    return offers.filter((o) => {
      const matchesSearch =
        o.title.toLowerCase().includes(search.toLowerCase()) ||
        o.location.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'Todos' || o.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ofertas Turísticas</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="notifications-none" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Buscador */}
        <View style={styles.searchWrapper}>
          <MaterialIcons name="search" size={20} color={colors.primary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar ofertas, lugares o servicios..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialIcons name="close" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter chips — fidelidad visual al mock */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsRow}
        >
          {FILTER_CHIPS.map((chip) => (
            <TouchableOpacity
              key={chip.label}
              style={[styles.filterChip, chip.isMain && styles.filterChipMain]}
            >
              <MaterialIcons
                name={chip.icon}
                size={16}
                color={chip.isMain ? colors.white : colors.primary}
              />
              <Text style={[styles.filterChipText, chip.isMain && styles.filterChipTextMain]}>
                {chip.label}
              </Text>
              {chip.hasArrow && (
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={14}
                  color={chip.isMain ? colors.white : colors.textSecondary}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tabs de categoría */}
        <View style={styles.categoryTabs}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catTab, activeCategory === cat && styles.catTabActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.catTabText, activeCategory === cat && styles.catTabTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Lista de ofertas */}
      {loading && (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      )}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OfertaCard
            offer={item}
            onPress={() => navigation.navigate('DetalleOferta', { offer: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="search-off" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>Sin resultados para "{search}"</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderPrimary,
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
  // Filter chips
  filterChipsRow: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipMain: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: { fontSize: 13, fontWeight: '500', color: colors.text },
  filterChipTextMain: { color: colors.white, fontWeight: '600' },
  // Category tabs
  categoryTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    borderRadius: 12,
    padding: 4,
    gap: 2,
  },
  catTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  catTabActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  catTabText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  catTabTextActive: { color: colors.primary },
  listContent: { padding: 16, gap: 16, paddingBottom: 32 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14, color: colors.textSecondary },
});

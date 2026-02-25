import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmada', color: colors.success, bg: colors.successLight, icon: 'check-circle' },
  pending: { label: 'Pendiente', color: colors.warning, bg: colors.warningLight, icon: 'schedule' },
  cancelled: { label: 'Cancelada', color: colors.error, bg: colors.errorLight, icon: 'cancel' },
};

const INITIAL_RESERVAS = [
  {
    id: '1',
    title: 'Hotel Paraíso Azul',
    location: 'Miramar de Ansenuza, Córdoba',
    image: 'https://picsum.photos/seed/hotel1/200/200',
    date: '15 Nov 2025',
    duration: '3 noches',
    guests: '2 personas',
    price: 360,
    status: 'confirmed',
    code: 'ANS-2025-0847',
  },
  {
    id: '2',
    title: 'Tour Flamencos Ansenuza',
    location: 'Miramar de Ansenuza, Córdoba',
    image: 'https://picsum.photos/seed/flamingo1/200/200',
    date: '22 Nov 2025',
    duration: '1 día',
    guests: '4 personas',
    price: 180,
    status: 'pending',
    code: 'ANS-2025-0912',
  },
  {
    id: '3',
    title: 'Escapada Romántica Ansenuza',
    location: 'Mar Chiquita, Córdoba',
    image: 'https://picsum.photos/seed/romantic1/200/200',
    date: '8 Oct 2025',
    duration: '3 noches',
    guests: '2 personas',
    price: 700,
    status: 'cancelled',
    code: 'ANS-2025-0701',
  },
];

const FILTERS = ['Todas', 'Confirmadas', 'Pendientes', 'Canceladas'];

export default function ReservasScreen() {
  const [reservas, setReservas] = useState(INITIAL_RESERVAS);
  const [activeFilter, setActiveFilter] = useState('Todas');

  const filtered = reservas.filter((r) => {
    if (activeFilter === 'Todas') return true;
    if (activeFilter === 'Confirmadas') return r.status === 'confirmed';
    if (activeFilter === 'Pendientes') return r.status === 'pending';
    if (activeFilter === 'Canceladas') return r.status === 'cancelled';
    return true;
  });

  const handleCancel = (id, title) => {
    Alert.alert(
      'Cancelar reserva',
      `¿Estás seguro que querés cancelar "${title}"? Esta acción no se puede deshacer.`,
      [
        { text: 'No, mantener', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () =>
            setReservas((prev) =>
              prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
            ),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Reservas</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons name="confirmation-number" size={56} color={colors.border} />
          <Text style={styles.emptyTitle}>Sin reservas</Text>
          <Text style={styles.emptyText}>
            {activeFilter === 'Todas'
              ? '¡Aún no tenés reservas! Explorá las ofertas disponibles.'
              : `No tenés reservas ${activeFilter.toLowerCase()} por el momento.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const status = STATUS_CONFIG[item.status];
            return (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={styles.info}>
                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                      <MaterialIcons name={status.icon} size={12} color={status.color} />
                      <Text style={[styles.statusText, { color: status.color }]}>
                        {status.label}
                      </Text>
                    </View>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <View style={styles.locationRow}>
                      <MaterialIcons name="location-on" size={12} color={colors.textSecondary} />
                      <Text style={styles.location} numberOfLines={1}>
                        {item.location}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.details}>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="calendar-today" size={14} color={colors.primary} />
                    <Text style={styles.detailText}>{item.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="nights-stay" size={14} color={colors.primary} />
                    <Text style={styles.detailText}>{item.duration}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="people" size={14} color={colors.primary} />
                    <Text style={styles.detailText}>{item.guests}</Text>
                  </View>
                </View>

                <View style={styles.cardBottom}>
                  <View>
                    <Text style={styles.codeLabel}>Código de reserva</Text>
                    <Text style={styles.code}>{item.code}</Text>
                  </View>
                  <View style={styles.priceCol}>
                    <Text style={styles.priceLabel}>Total</Text>
                    <Text style={styles.price}>${item.price}</Text>
                  </View>
                </View>

                {(item.status === 'confirmed' || item.status === 'pending') && (
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => handleCancel(item.id, item.title)}
                  >
                    <Text style={styles.cancelBtnText}>Cancelar reserva</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderPrimary,
    backgroundColor: 'rgba(247,246,248,0.9)',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  filterTextActive: { color: 'white' },
  list: { padding: 16, gap: 12 },
  card: {
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
  },
  cardTop: { flexDirection: 'row', gap: 12, padding: 14 },
  image: { width: 80, height: 80, borderRadius: 10 },
  info: { flex: 1, gap: 6 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.text, lineHeight: 19 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  location: { fontSize: 11, color: colors.textSecondary, flex: 1 },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 14 },
  details: { flexDirection: 'row', gap: 16, padding: 14 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  detailText: { fontSize: 12, color: colors.textSecondary },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  codeLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  code: { fontSize: 13, fontWeight: '700', color: colors.text },
  priceCol: { alignItems: 'flex-end' },
  priceLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  price: { fontSize: 20, fontWeight: '800', color: colors.primary },
  cancelBtn: {
    marginHorizontal: 14,
    marginBottom: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.error,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 13, fontWeight: '700', color: colors.error },
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

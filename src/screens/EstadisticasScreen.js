import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { providerStats } from '../data/mockData';
import { useListings } from '../hooks/useListings';
import StatCard from '../components/StatCard';
import BarChart from '../components/BarChart';

const PERIODS = ['Últimos 30 días', 'Este mes', 'Año'];

export default function EstadisticasScreen({ navigation }) {
  const [activePeriod, setActivePeriod] = useState('Últimos 30 días');
  const { listings } = useListings();
  const s = providerStats;

  const activeCount = listings.filter((l) => l.status === 'active').length;
  const pendingCount = listings.filter((l) => l.status === 'pending').length;
  const pausedCount = listings.filter((l) => l.status === 'paused').length;
  const totalCount = listings.length;

  // Combina datos reales (título/imagen) con métricas mock para la demo
  const displayListings = listings.length > 0
    ? listings.slice(0, 3).map((listing, i) => {
        const mockRef = s.topPublications[i] ?? s.topPublications[0];
        return { ...listing, views: mockRef.views, bookings: mockRef.bookings, revenue: mockRef.revenue };
      })
    : s.topPublications;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Estadísticas de Rendimiento</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Selector de período */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.periodsRow}
        >
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodChip, activePeriod === p && styles.periodChipActive]}
              onPress={() => setActivePeriod(p)}
            >
              <Text style={[styles.periodText, activePeriod === p && styles.periodTextActive]}>
                {p}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={16}
                color={activePeriod === p ? 'white' : colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Resumen de publicaciones reales */}
        {totalCount > 0 && (
          <View style={styles.realStatsCard}>
            <Text style={styles.realStatsTitle}>Mis publicaciones</Text>
            <View style={styles.realStatsRow}>
              <View style={styles.realStatItem}>
                <View style={[styles.realStatDot, { backgroundColor: colors.success }]} />
                <Text style={styles.realStatValue}>{activeCount}</Text>
                <Text style={styles.realStatLabel}>Activas</Text>
              </View>
              <View style={styles.realStatDivider} />
              <View style={styles.realStatItem}>
                <View style={[styles.realStatDot, { backgroundColor: colors.warning }]} />
                <Text style={styles.realStatValue}>{pendingCount}</Text>
                <Text style={styles.realStatLabel}>Pendientes</Text>
              </View>
              <View style={styles.realStatDivider} />
              <View style={styles.realStatItem}>
                <View style={[styles.realStatDot, { backgroundColor: colors.textMuted }]} />
                <Text style={styles.realStatValue}>{pausedCount}</Text>
                <Text style={styles.realStatLabel}>Pausadas</Text>
              </View>
            </View>
          </View>
        )}

        {/* Cards de resumen (métricas de alcance) */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Visualizaciones totales"
            value="12,450"
            icon="visibility"
            trend={s.viewsTrend}
            trendUp={s.viewsTrendUp}
          />
          <StatCard
            label="Reservas confirmadas"
            value="342"
            icon="confirmation-number"
            trend={s.bookingsTrend}
            trendUp={s.bookingsTrendUp}
          />
          <StatCard
            label="Ingresos generados"
            value="$45,200"
            icon="payments"
            trend={s.revenueTrend}
            trendUp={s.revenueTrendUp}
          />
        </View>

        {/* Gráfico */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Visualizaciones vs Reservas</Text>
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.legendText}>Vistas</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.border }]} />
                <Text style={styles.legendText}>Reservas</Text>
              </View>
            </View>
          </View>
          <BarChart data={s.weeklyData} />
        </View>

        {/* Publicaciones más populares */}
        <View style={styles.popularSection}>
          <Text style={styles.popularTitle}>Publicaciones más populares</Text>
          <View style={styles.popularList}>
            {displayListings.map((pub) => (
              <TouchableOpacity
                key={pub.id}
                style={styles.popularItem}
                onPress={() => navigation.navigate('Inicio')}
              >
                <Image source={{ uri: pub.image }} style={styles.pubImage} />
                <View style={styles.pubInfo}>
                  <Text style={styles.pubTitle} numberOfLines={1}>
                    {pub.title}
                  </Text>
                  <View style={styles.pubMeta}>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="visibility" size={13} color={colors.textMuted} />
                      <Text style={styles.metaText}>{pub.views}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="calendar-today" size={13} color={colors.textMuted} />
                      <Text style={styles.metaText}>{pub.bookings}</Text>
                    </View>
                    <Text style={styles.pubRevenue}>{pub.revenue}</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.text, textAlign: 'center' },
  scroll: { paddingBottom: 32 },
  periodsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16, gap: 8 },
  periodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
  },
  periodChipActive: { backgroundColor: colors.primary },
  periodText: { fontSize: 13, fontWeight: '500', color: colors.text },
  periodTextActive: { color: 'white', fontWeight: '600' },
  realStatsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  realStatsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
  },
  realStatsRow: { flexDirection: 'row', alignItems: 'center' },
  realStatItem: { flex: 1, alignItems: 'center', gap: 4 },
  realStatDot: { width: 8, height: 8, borderRadius: 4 },
  realStatValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  realStatLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  realStatDivider: { width: 1, height: 36, backgroundColor: colors.border },
  statsGrid: { paddingHorizontal: 16, gap: 12, marginBottom: 16 },
  chartCard: {
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  legend: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: colors.textSecondary },
  popularSection: { paddingHorizontal: 16 },
  popularTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  popularList: { gap: 10 },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  pubImage: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  pubInfo: { flex: 1, gap: 4 },
  pubTitle: { fontSize: 13, fontWeight: '700', color: colors.text },
  pubMeta: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: colors.textSecondary },
  pubRevenue: { fontSize: 13, fontWeight: '700', color: colors.primary },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';

export default function StatCard({ label, value, icon, trend, trendUp }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.label}>{label}</Text>
        <MaterialIcons name={icon} size={22} color={colors.primary} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.trendRow}>
        <MaterialIcons
          name={trendUp ? 'trending-up' : 'trending-down'}
          size={16}
          color={trendUp ? colors.trendUp : colors.trendDown}
        />
        <Text style={[styles.trendText, { color: trendUp ? colors.trendUp : colors.trendDown }]}>
          {trend}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: { fontSize: 12, color: colors.textSecondary, fontWeight: '500', flex: 1, marginRight: 8 },
  value: { fontSize: 26, fontWeight: '800', color: colors.text },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trendText: { fontSize: 13, fontWeight: '700' },
});

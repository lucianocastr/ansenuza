import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';

const STATUS_CONFIG = {
  active: { label: 'Activo', color: '#10b981', bg: '#d1fae5' },
  pending: { label: 'Pendiente', color: '#f59e0b', bg: '#fef3c7' },
  paused: { label: 'Pausado', color: '#94a3b8', bg: '#f1f5f9' },
};

export default function ListingItem({ item, onStats, onEdit }) {
  const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.paused;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* Imagen con badge */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
            <Text style={styles.statusText}>{status.label}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.price}>
            ${item.price} <Text style={styles.currency}>USD</Text>
          </Text>
        </View>
      </View>

      {/* Acciones */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
          <MaterialIcons name="edit" size={18} color={colors.primary} />
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statsBtn} onPress={onStats}>
          <MaterialIcons name="bar-chart" size={18} color={colors.primary} />
          <Text style={styles.statsText}>Estadísticas</Text>
        </TouchableOpacity>
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: { flexDirection: 'row', gap: 14, padding: 14 },
  imageWrapper: { position: 'relative' },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  statusBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusText: { fontSize: 9, fontWeight: '700', color: 'white', textTransform: 'uppercase' },
  info: { flex: 1, justifyContent: 'space-between' },
  location: { fontSize: 11, fontWeight: '600', color: colors.primary },
  title: { fontSize: 14, fontWeight: '700', color: colors.text, lineHeight: 20 },
  price: { fontSize: 16, fontWeight: '800', color: colors.text },
  currency: { fontSize: 11, fontWeight: '500', color: colors.textMuted },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 1,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  editText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  statsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: colors.primaryLight,
  },
  statsText: { fontSize: 13, fontWeight: '600', color: colors.primary },
});

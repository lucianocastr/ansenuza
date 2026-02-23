import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';

export default function PerfilScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Perfil</Text>
      </View>

      {/* Avatar y nombre */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://picsum.photos/seed/tourist_user/120/120' }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>Turista Ansenuza</Text>
        <Text style={styles.email}>turista@ansenuza.com</Text>
      </View>

      {/* Sección turista */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>MI CUENTA</Text>
        {[
          { icon: 'confirmation-number', label: 'Mis Reservas' },
          { icon: 'favorite-border', label: 'Favoritos' },
          { icon: 'notifications-none', label: 'Notificaciones' },
          { icon: 'help-outline', label: 'Ayuda y soporte' },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem}>
            <MaterialIcons name={item.icon} size={22} color={colors.primary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Acceso proveedor */}
      <View style={styles.providerCard}>
        <View style={styles.providerInfo}>
          <MaterialIcons name="storefront" size={28} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.providerTitle}>¿Tenés un negocio turístico?</Text>
            <Text style={styles.providerSub}>Publicá tus ofertas y llegá a más viajeros</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.providerButton}
          onPress={() => navigation.navigate('LoginProveedor')}
          activeOpacity={0.88}
        >
          <Text style={styles.providerButtonText}>Acceder como Proveedor</Text>
          <MaterialIcons name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  profileSection: { alignItems: 'center', paddingVertical: 28 },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: colors.primary,
    overflow: 'hidden',
    marginBottom: 12,
  },
  avatar: { width: '100%', height: '100%' },
  name: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  email: { fontSize: 13, color: colors.textSecondary },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.text },
  providerCard: {
    marginHorizontal: 20,
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    gap: 16,
  },
  providerInfo: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  providerTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 },
  providerSub: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
  providerButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  providerButtonText: { color: 'white', fontSize: 14, fontWeight: '700' },
});

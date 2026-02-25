import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function PerfilProveedorScreen() {
  const { user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que querés salir del portal de proveedor?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => supabase.auth.signOut(),
          // AuthContext detecta signOut y AppNavigator redirige automáticamente
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Perfil</Text>
      </View>

      {/* Avatar y datos */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: `https://picsum.photos/seed/${user?.id ?? 'provider_default'}/100/100` }} style={styles.avatar} />
        </View>
        <Text style={styles.name}>{user?.user_metadata?.name ?? 'Proveedor'}</Text>
        <Text style={styles.company}>{user?.user_metadata?.company ?? 'Turismo Ansenuza'}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        {/* Badge proveedor */}
        <View style={styles.badge}>
          <MaterialIcons name="verified" size={14} color={colors.primary} />
          <Text style={styles.badgeText}>Proveedor Verificado</Text>
        </View>
      </View>

      {/* Menú */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>CONFIGURACIÓN</Text>
        {[
          { icon: 'edit', label: 'Editar perfil', onPress: () => Alert.alert('Editar perfil', 'Podés actualizar tu nombre, empresa y datos de contacto desde el panel web de Ansenuza.') },
          { icon: 'notifications-none', label: 'Notificaciones', onPress: () => Alert.alert('Notificaciones', 'Las notificaciones push estarán disponibles en la próxima versión.') },
          { icon: 'lock-outline', label: 'Seguridad', onPress: () => Alert.alert('Seguridad', 'Para cambiar tu contraseña, usá la opción "¿Olvidaste tu contraseña?" en el login.') },
          { icon: 'help-outline', label: 'Ayuda y soporte', onPress: () => Alert.alert('Ayuda y soporte', 'Contactanos en soporte@ansenuza.com o al +54 9 3562 000-000. Horario: Lun-Vie 9-18 hs.') },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem} onPress={item.onPress}>
            <MaterialIcons name={item.icon} size={22} color={colors.primary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <MaterialIcons name="logout" size={20} color={colors.error} />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  profileSection: { alignItems: 'center', paddingVertical: 24, gap: 4 },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: colors.primary,
    overflow: 'hidden',
    marginBottom: 8,
  },
  avatar: { width: '100%', height: '100%' },
  name: { fontSize: 18, fontWeight: '700', color: colors.text },
  company: { fontSize: 13, fontWeight: '600', color: colors.primary },
  email: { fontSize: 12, color: colors.textSecondary },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 8,
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: colors.primary },
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
  logoutBtn: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: colors.error },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const CONFIRM_WORD = 'ELIMINAR';

export default function EliminarCuentaScreen({ navigation }) {
  const { user } = useAuth();
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  const isConfirmed = confirmText === CONFIRM_WORD;

  const handleDelete = async () => {
    if (!isConfirmed) return;

    Alert.alert(
      'Confirmar eliminación',
      'Esta acción es irreversible. Se eliminarán todas tus publicaciones y se cerrará tu sesión. La eliminación completa de tu cuenta se procesará en un plazo de 30 días hábiles.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar cuenta',
          style: 'destructive',
          onPress: executeDelete,
        },
      ]
    );
  };

  const executeDelete = async () => {
    setLoading(true);
    try {
      // 1. Eliminar publicaciones del usuario en provider_listings
      const { error: listingsError } = await supabase
        .from('provider_listings')
        .delete()
        .eq('user_id', user.id);

      if (listingsError) throw listingsError;

      // 2. Cerrar sesión — AuthContext detecta el cambio y AppNavigator redirige
      await supabase.auth.signOut();

      // Si por algún motivo no redirigió automáticamente, mostrar aviso
      Alert.alert(
        'Solicitud recibida',
        'Tus datos fueron eliminados y tu cuenta fue cerrada. La eliminación completa del registro de autenticación se procesará en un plazo de 30 días hábiles. Recibirás confirmación en ' + user?.email,
        [{ text: 'Aceptar' }]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Error al procesar la solicitud',
        'No fue posible completar la eliminación. Podés intentarlo nuevamente o enviar tu solicitud a contacto@ismosoft.com.ar'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Eliminar cuenta</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ícono de advertencia */}
        <View style={styles.iconWrapper}>
          <MaterialIcons name="warning" size={48} color={colors.error} />
        </View>

        {/* Título y descripción */}
        <Text style={styles.heading}>¿Estás seguro que querés eliminar tu cuenta?</Text>
        <Text style={styles.description}>
          Esta acción es permanente e irreversible. Una vez procesada, no podrás recuperar tu cuenta ni los datos asociados.
        </Text>

        {/* Lista de lo que se elimina */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Se eliminará permanentemente:</Text>
          {[
            'Tu perfil y datos personales',
            'Todas tus publicaciones activas, pausadas y pendientes',
            'Tu historial de actividad en la plataforma',
            'Tu acceso como proveedor verificado',
          ].map((item) => (
            <View key={item} style={styles.listRow}>
              <MaterialIcons name="remove-circle-outline" size={16} color={colors.error} />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Alternativa */}
        <View style={styles.altCard}>
          <MaterialIcons name="info-outline" size={18} color={colors.primary} />
          <Text style={styles.altText}>
            Si solo querés pausar tu actividad, podés desactivar tus publicaciones desde "Mis Publicaciones" sin eliminar tu cuenta.
          </Text>
        </View>

        {/* Confirmación por texto */}
        <View style={styles.confirmSection}>
          <Text style={styles.confirmLabel}>
            Para confirmar, escribí <Text style={styles.confirmWord}>ELIMINAR</Text> en el campo de abajo:
          </Text>
          <TextInput
            style={[
              styles.input,
              confirmText.length > 0 && (isConfirmed ? styles.inputValid : styles.inputInvalid),
            ]}
            value={confirmText}
            onChangeText={setConfirmText}
            placeholder="Escribí ELIMINAR"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="characters"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        {/* Botón eliminar */}
        <TouchableOpacity
          style={[styles.deleteBtn, (!isConfirmed || loading) && styles.deleteBtnDisabled]}
          onPress={handleDelete}
          disabled={!isConfirmed || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <MaterialIcons name="delete-forever" size={20} color={colors.white} />
              <Text style={styles.deleteBtnText}>Eliminar mi cuenta</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Cancelar */}
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()} disabled={loading}>
          <Text style={styles.cancelText}>Cancelar, mantener mi cuenta</Text>
        </TouchableOpacity>

        {/* Nota legal */}
        <Text style={styles.legalNote}>
          De acuerdo con la Ley 25.326 de Protección de Datos Personales, ciertos registros pueden conservarse por obligación legal hasta 30 días hábiles. Para consultas: contacto@ismosoft.com.ar
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  content: { paddingHorizontal: 20, paddingBottom: 40, alignItems: 'center' },

  iconWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
  },

  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },

  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginBottom: 12,
    gap: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  listText: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },

  altCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    marginBottom: 28,
  },
  altText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
  },

  confirmSection: { width: '100%', marginBottom: 20 },
  confirmLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 20,
  },
  confirmWord: { fontWeight: '800', color: colors.error },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1.5,
  },
  inputValid: { borderColor: colors.error },
  inputInvalid: { borderColor: colors.border },

  deleteBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.error,
    borderRadius: 14,
    height: 52,
    marginBottom: 12,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  deleteBtnDisabled: {
    backgroundColor: colors.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  deleteBtnText: { fontSize: 15, fontWeight: '700', color: colors.white },

  cancelBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginBottom: 24,
  },
  cancelText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },

  legalNote: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});

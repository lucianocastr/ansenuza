import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { MOCK_USER } from '../data/mockData';

export default function LoginProveedorScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Campos requeridos', 'Por favor completá el email y la contraseña.');
      return;
    }

    setLoading(true);
    // Simulación de login (500ms)
    setTimeout(() => {
      setLoading(false);
      if (email === MOCK_USER.email && password === MOCK_USER.password) {
        navigation.reset({ index: 0, routes: [{ name: 'ProviderArea' }] });
      } else {
        Alert.alert(
          'Credenciales incorrectas',
          'Email o contraseña incorrectos.\n\nHint: usa proveedor@ansenuza.com / 123456'
        );
      }
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Blob decorativo */}
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Botón volver */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconBadge}>
              <MaterialIcons name="travel-explore" size={36} color={colors.primary} />
            </View>
            <Text style={styles.title}>Portal de Proveedores</Text>
            <Text style={styles.subtitle}>
              Gestioná tus servicios turísticos y reservas en un solo lugar.
            </Text>
          </View>

          {/* Card del formulario */}
          <View style={styles.card}>
            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="ejemplo@turismo.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Contraseña */}
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Contraseña</Text>
                <TouchableOpacity>
                  <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="lock-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingRight: 48 }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember me */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && <MaterialIcons name="check" size={14} color="white" />}
              </View>
              <Text style={styles.checkboxLabel}>Mantener sesión iniciada</Text>
            </TouchableOpacity>

            {/* Botón login */}
            <TouchableOpacity
              style={[styles.loginButton, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.88}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Ingresando...' : 'Iniciar Sesión'}
              </Text>
              {!loading && <MaterialIcons name="login" size={20} color="white" />}
            </TouchableOpacity>
          </View>

          {/* Registro */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>¿Aún no eres proveedor? </Text>
            <TouchableOpacity>
              <Text style={styles.registerLink}>Regístrate como proveedor</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Conexión Segura</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.footerIcons}>
              <MaterialIcons name="verified-user" size={24} color={colors.textMuted} />
              <MaterialIcons name="public" size={24} color={colors.textMuted} />
              <MaterialIcons name="cloud-done" size={24} color={colors.textMuted} />
            </View>
            <Text style={styles.copyright}>© 2024 Turismo Ansenuza. Todos los derechos reservados.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  blobTop: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
  },
  blobBottom: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
  },
  scroll: { padding: 24, paddingBottom: 40 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: { alignItems: 'center', marginBottom: 32 },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, maxWidth: 300 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    marginBottom: 24,
  },
  field: { gap: 8 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgot: { fontSize: 12, fontWeight: '600', color: colors.primary },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: colors.text },
  eyeButton: { padding: 4, position: 'absolute', right: 12 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkboxLabel: { fontSize: 13, color: colors.textSecondary },
  loginButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: { color: 'white', fontSize: 15, fontWeight: '700' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 32 },
  registerText: { fontSize: 13, color: colors.textSecondary },
  registerLink: { fontSize: 13, fontWeight: '700', color: colors.primary },
  footer: { alignItems: 'center', gap: 16 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 10, fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  footerIcons: { flexDirection: 'row', gap: 24 },
  copyright: { fontSize: 10, color: colors.textMuted, textAlign: 'center' },
});

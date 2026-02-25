import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function BienvenidaScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Círculos decorativos de fondo */}
      <View style={[styles.blob, styles.blobTopRight]} />
      <View style={[styles.blob, styles.blobTopLeft, { width: 160, height: 160 }]} />
      <View style={[styles.blob, styles.blobBottomLeft]} />

      {/* Contenido central */}
      <View style={styles.content}>
        {/* Logo container */}
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://picsum.photos/seed/ansenuza_logo/200/200' }}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>

        {/* Texto */}
        <View style={styles.textContent}>
          <Text style={styles.title}>Miramar de Ansenuza</Text>
          <Text style={styles.subtitle}>
            Descubrí la magia del Mar de Ansenuza y sus maravillas naturales.
          </Text>
        </View>

        {/* Puntos decorativos */}
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: colors.primary, opacity: 0.4 }]} />
          <View style={[styles.dot, { backgroundColor: colors.primary, opacity: 0.2 }]} />
        </View>
      </View>

      {/* Área de acción inferior */}
      <View style={styles.bottomArea}>
        {/* Chip */}
        <View style={styles.chip}>
          <MaterialIcons name="explore" size={18} color={colors.primary} />
          <Text style={styles.chipText}>Naturaleza &amp; Relax</Text>
        </View>

        {/* Botón continuar */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('TouristArea')}
          activeOpacity={0.88}
        >
          <Text style={styles.buttonText}>Continuar</Text>
          <MaterialIcons name="arrow-forward" size={22} color="white" />
        </TouchableOpacity>

        <Text style={styles.caption}>
          Explora el quinto lago salino más grande del mundo
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate('LoginProveedor')}>
          <Text style={styles.providerLink}>¿Sos proveedor? Accedé aquí</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  blob: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
  },
  blobTopRight: {
    top: -80,
    right: -80,
  },
  blobTopLeft: {
    top: 40,
    left: -40,
  },
  blobBottomLeft: {
    bottom: -60,
    left: -80,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    padding: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
  },
  logoImage: {
    width: 164,
    height: 164,
    borderRadius: 999,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bottomArea: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    alignItems: 'center',
    gap: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  caption: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
  providerLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

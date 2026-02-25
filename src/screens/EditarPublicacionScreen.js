import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['Hospedaje', 'Negocio', 'Servicio'];
const FRECUENCIAS = ['Por noche', 'Por persona', 'Total paquete'];

function suffixToFreq(suffix) {
  if (suffix === '/noche') return 'Por noche';
  if (suffix === '/persona') return 'Por persona';
  return 'Total paquete';
}

export default function EditarPublicacionScreen({ navigation, route }) {
  const { item, onSuccess } = route.params;

  const [category, setCategory] = useState(item.category || 'Hospedaje');
  const [title, setTitle] = useState(item.title || '');
  const [description, setDescription] = useState(item.description || '');
  const [price, setPrice] = useState(String(item.price || ''));
  const [frequency, setFrequency] = useState(suffixToFreq(item.price_suffix));
  const [address, setAddress] = useState(item.location || '');
  const [freqOpen, setFreqOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleGuardar = async () => {
    if (!title.trim() || !price.trim()) {
      Alert.alert('Campos requeridos', 'Completá al menos el título y el precio.');
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from('provider_listings')
      .update({
        title: title.trim(),
        price: parseFloat(price),
        location: address.trim() || 'Miramar de Ansenuza, Córdoba',
      })
      .eq('id', item.id);
    setSaving(false);

    if (error) {
      Alert.alert('Error', 'No se pudo guardar. Intentá de nuevo.');
    } else {
      Alert.alert('¡Cambios guardados!', 'Tu publicación fue actualizada.', [
        { text: 'Volver', onPress: () => { onSuccess?.(); navigation.goBack(); } },
      ]);
    }
  };

  const handleToggleStatus = () => {
    if (item.status === 'pending') return;
    const newStatus = item.status === 'active' ? 'paused' : 'active';
    const accion = newStatus === 'active' ? 'activar' : 'pausar';
    Alert.alert(
      `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} publicación?`,
      `La publicación "${title}" será ${newStatus === 'active' ? 'activada' : 'pausada'}.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: accion.charAt(0).toUpperCase() + accion.slice(1),
          onPress: async () => {
            setToggling(true);
            const { error } = await supabase
              .from('provider_listings')
              .update({ status: newStatus })
              .eq('id', item.id);
            setToggling(false);
            if (error) {
              Alert.alert('Error', 'No se pudo cambiar el estado.');
            } else {
              Alert.alert(
                'Listo',
                `Publicación ${newStatus === 'active' ? 'activada' : 'pausada'} correctamente.`,
                [{ text: 'OK', onPress: () => { onSuccess?.(); navigation.goBack(); } }]
              );
            }
          },
        },
      ]
    );
  };

  const isPaused = item.status === 'paused';
  const isPending = item.status === 'pending';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Publicación</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Banner de estado */}
          <TouchableOpacity
            style={[
              styles.statusBanner,
              isPaused ? styles.bannerPaused : isPending ? styles.bannerPending : styles.bannerActive,
            ]}
            onPress={handleToggleStatus}
            disabled={toggling || isPending}
            activeOpacity={isPending ? 1 : 0.8}
          >
            <MaterialIcons
              name={
                isPaused
                  ? 'play-circle-outline'
                  : isPending
                  ? 'pending'
                  : 'pause-circle-outline'
              }
              size={20}
              color={isPaused ? '#10b981' : isPending ? '#f59e0b' : '#f59e0b'}
            />
            <Text
              style={[
                styles.bannerText,
                { color: isPaused ? '#10b981' : isPending ? '#f59e0b' : '#f59e0b' },
              ]}
            >
              {toggling
                ? 'Actualizando...'
                : isPaused
                ? 'Publicación pausada — Tocar para activar'
                : isPending
                ? 'En revisión — No se puede cambiar el estado'
                : 'Publicación activa — Tocar para pausar'}
            </Text>
          </TouchableOpacity>

          {/* Categoría */}
          <View style={styles.section}>
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.chips}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, category === cat && styles.chipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Título */}
          <View style={styles.section}>
            <Text style={styles.label}>Título de la oferta</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Suite con Vista al Mar"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Descripción */}
          <View style={styles.section}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Describí los detalles, beneficios y lo que incluye tu oferta..."
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Precio y frecuencia */}
          <View style={styles.priceRow}>
            <View style={[styles.section, { flex: 1 }]}>
              <Text style={styles.label}>Precio</Text>
              <View style={styles.priceInput}>
                <Text style={styles.priceCurrency}>$</Text>
                <TextInput
                  style={[styles.input, { flex: 1, borderWidth: 0, height: 52 }]}
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            <View style={[styles.section, { flex: 1 }]}>
              <Text style={styles.label}>Frecuencia</Text>
              <TouchableOpacity
                style={styles.selectBtn}
                onPress={() => setFreqOpen(!freqOpen)}
              >
                <Text style={styles.selectText}>{frequency}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              {freqOpen && (
                <View style={styles.dropdown}>
                  {FRECUENCIAS.map((f) => (
                    <TouchableOpacity
                      key={f}
                      style={styles.dropdownItem}
                      onPress={() => { setFrequency(f); setFreqOpen(false); }}
                    >
                      <Text
                        style={[
                          styles.dropdownText,
                          f === frequency && { color: colors.primary, fontWeight: '700' },
                        ]}
                      >
                        {f}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Ubicación */}
          <View style={styles.section}>
            <Text style={styles.label}>Ubicación</Text>
            <TextInput
              style={styles.input}
              placeholder="Dirección exacta o referencia"
              placeholderTextColor={colors.textMuted}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* Acciones */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.7 }]}
              onPress={handleGuardar}
              activeOpacity={0.88}
              disabled={saving}
            >
              <MaterialIcons name="save" size={20} color="white" />
              <Text style={styles.saveBtnText}>{saving ? 'Guardando...' : 'Guardar cambios'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderPrimary,
    backgroundColor: 'rgba(247,246,248,0.9)',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  scroll: { padding: 16, paddingBottom: 40 },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
  },
  bannerActive: { backgroundColor: '#fef9ec', borderColor: '#fde68a' },
  bannerPaused: { backgroundColor: '#f0fdf4', borderColor: '#a7f3d0' },
  bannerPending: { backgroundColor: '#fef9ec', borderColor: '#fde68a' },
  bannerText: { fontSize: 13, fontWeight: '600', flex: 1 },
  section: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8 },
  chips: { flexDirection: 'row', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  chipTextActive: { color: 'white' },
  input: {
    height: 52,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.text,
  },
  textarea: { height: 100, paddingTop: 14 },
  priceRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    paddingLeft: 14,
  },
  priceCurrency: { fontSize: 16, color: colors.textSecondary, marginRight: 2 },
  selectBtn: {
    height: 52,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: { fontSize: 14, color: colors.text },
  dropdown: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  dropdownText: { fontSize: 14, color: colors.text },
  actionsSection: { gap: 12, marginTop: 8 },
  saveBtn: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 14,
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
  saveBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },
  cancelBtn: {
    height: 54,
    backgroundColor: colors.border,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '700', color: colors.textSecondary },
});

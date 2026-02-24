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
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Hospedaje', 'Negocio', 'Servicio'];
const FRECUENCIAS = ['Por noche', 'Por persona', 'Total paquete'];

export default function NuevaPublicacionScreen({ navigation, route }) {
  const { user } = useAuth();
  const [category, setCategory] = useState('Hospedaje');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [frequency, setFrequency] = useState('Por noche');
  const [address, setAddress] = useState('');
  const [freqOpen, setFreqOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handlePublicar = async () => {
    if (!title.trim() || !price.trim()) {
      Alert.alert('Campos requeridos', 'Completá al menos el título y el precio.');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('listings').insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      category,
      price: parseFloat(price),
      price_suffix: frequency === 'Por noche' ? '/noche' : frequency === 'Por persona' ? '/persona' : '/paquete',
      location: address.trim() || 'Miramar de Ansenuza, Córdoba',
      status: 'pending',
      image: `https://picsum.photos/seed/${Date.now()}/200/200`,
    });
    setSaving(false);

    if (error) {
      Alert.alert('Error', 'No se pudo crear la publicación. Intentá de nuevo.');
    } else {
      Alert.alert(
        '¡Publicación creada!',
        `Tu oferta "${title}" fue enviada para revisión. Estará activa en las próximas 24 hs.`,
        [{
          text: 'Volver',
          onPress: () => {
            route.params?.onSuccess?.();
            navigation.goBack();
          },
        }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Nueva Publicación</Text>
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
          {/* Fotos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fotos de la publicación</Text>
            <View style={styles.photosGrid}>
              <TouchableOpacity style={styles.photoAdd}>
                <MaterialIcons name="add-a-photo" size={28} color={colors.primary} />
                <Text style={styles.photoAddText}>Añadir</Text>
              </TouchableOpacity>
              <View style={styles.photoPlaceholder}>
                <MaterialIcons name="image" size={32} color={colors.textMuted} />
              </View>
              <View style={styles.photoPlaceholder}>
                <MaterialIcons name="image" size={32} color={colors.textMuted} />
              </View>
            </View>
          </View>

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
                      <Text style={[styles.dropdownText, f === frequency && { color: colors.primary, fontWeight: '700' }]}>
                        {f}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Fechas (decorativo) */}
          <View style={styles.section}>
            <Text style={styles.label}>Fechas disponibles</Text>
            <TouchableOpacity style={styles.dateBtn}>
              <MaterialIcons name="calendar-month" size={20} color={colors.textSecondary} />
              <Text style={styles.dateBtnText}>Seleccionar rango de fechas</Text>
              <MaterialIcons name="chevron-right" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Ubicación */}
          <View style={styles.section}>
            <Text style={styles.label}>Ubicación</Text>
            <View style={styles.mapPlaceholder}>
              <View style={styles.mapOverlay}>
                <MaterialIcons name="location-on" size={22} color={colors.primary} />
                <Text style={styles.mapText}>Marcar en el mapa</Text>
              </View>
            </View>
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              placeholder="Dirección exacta o referencia"
              placeholderTextColor={colors.textMuted}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* Acciones */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={[styles.publishBtn, saving && { opacity: 0.7 }]}
              onPress={handlePublicar}
              activeOpacity={0.88}
              disabled={saving}
            >
              <MaterialIcons name="publish" size={20} color="white" />
              <Text style={styles.publishBtnText}>{saving ? 'Publicando...' : 'Publicar'}</Text>
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
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8 },
  photosGrid: { flexDirection: 'row', gap: 12 },
  photoAdd: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.borderPrimary,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  photoAddText: { fontSize: 10, fontWeight: '700', color: colors.primary },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  dateBtn: {
    height: 52,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  dateBtnText: { flex: 1, fontSize: 14, color: colors.textSecondary },
  mapPlaceholder: {
    height: 140,
    borderRadius: 12,
    backgroundColor: colors.border,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderPrimary,
  },
  mapOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  mapText: { fontSize: 12, fontWeight: '700', color: colors.text },
  actionsSection: { gap: 12, marginTop: 8 },
  publishBtn: {
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
  publishBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },
  cancelBtn: {
    height: 54,
    backgroundColor: colors.border,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '700', color: colors.textSecondary },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');

function StarRating({ rating }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <MaterialIcons
          key={i}
          name={i <= rating ? 'star' : 'star-border'}
          size={14}
          color={colors.star}
        />
      ))}
    </View>
  );
}

export default function DetalleOfertaScreen({ route, navigation }) {
  const { offer } = route.params;
  const [comment, setComment] = useState('');
  const [isFavorite, setIsFavorite] = useState(offer.isFavorite);
  const [descExpanded, setDescExpanded] = useState(false);
  const insets = useSafeAreaInsets();

  const handleReservar = () => {
    Alert.alert(
      'Consultar disponibilidad',
      `Te ponemos en contacto con ${offer.title}.\n\nTeléfono: ${offer.phone}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Llamar', onPress: () => {} },
      ]
    );
  };

  const handleSendComment = () => {
    if (!comment.trim()) return;
    Alert.alert('Comentario enviado', '¡Gracias por tu comentario!');
    setComment('');
  };

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <SafeAreaView style={styles.topBar} edges={['top']}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Detalle de la Oferta</Text>
        <TouchableOpacity style={styles.navBtn}>
          <MaterialIcons name="share" size={22} color={colors.text} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
      >
        {/* Imagen hero */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: offer.image }} style={styles.heroImage} resizeMode="cover" />

          {/* Dots de paginación (decorativo) */}
          <View style={styles.imageDots}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[styles.dot, i === 0 && { backgroundColor: colors.primary, width: 16 }]}
              />
            ))}
          </View>

          {/* Favorito */}
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <MaterialIcons
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={22}
              color={isFavorite ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          {/* Badges y rating */}
          <View style={styles.badgesRow}>
            {offer.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{offer.badge}</Text>
              </View>
            )}
            <View style={styles.ratingRow}>
              <MaterialIcons name="star" size={16} color={colors.star} />
              <Text style={styles.ratingValue}>{offer.rating}</Text>
              <Text style={styles.ratingCount}>({offer.reviewCount} reseñas)</Text>
            </View>
          </View>

          {/* Título y ubicación */}
          <Text style={styles.offerTitle}>{offer.title}</Text>
          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={16} color={colors.textSecondary} />
            <Text style={styles.locationText}>{offer.location}</Text>
          </View>

          {/* Precio */}
          <View style={styles.priceCard}>
            <View>
              <Text style={styles.priceLabel}>Precio {offer.priceSuffix}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceValue}>${offer.price}</Text>
                {offer.discount && (
                  <Text style={styles.priceOriginal}>${offer.discount.originalPrice}</Text>
                )}
              </View>
            </View>
            {offer.discount && (
              <View style={styles.discountBox}>
                <Text style={styles.discountText}>Ahorrá {offer.discount.percent}%</Text>
                <Text style={styles.discountValid}>Válido hasta el {offer.discount.validUntil}</Text>
              </View>
            )}
          </View>

          {/* Descripción */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre esta experiencia</Text>
            <Text
              style={styles.description}
              numberOfLines={descExpanded ? undefined : 3}
            >
              {offer.description}
            </Text>
            <TouchableOpacity
              style={styles.readMoreBtn}
              onPress={() => setDescExpanded(!descExpanded)}
            >
              <Text style={styles.readMoreText}>
                {descExpanded ? 'Leer menos' : 'Leer más'}
              </Text>
              <MaterialIcons
                name={descExpanded ? 'expand-less' : 'expand-more'}
                size={18}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Contacto */}
          <View style={styles.contactCard}>
            <View style={styles.contactLeft}>
              <View style={styles.contactIcon}>
                <MaterialIcons name="phone" size={20} color="white" />
              </View>
              <View>
                <Text style={styles.contactHint}>¿Tenés dudas?</Text>
                <Text style={styles.contactPhone}>{offer.phone}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Text style={styles.callBtnText}>Llamar ahora</Text>
            </TouchableOpacity>
          </View>

          {/* Reseñas */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Comentarios</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {offer.reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: review.avatar }} style={styles.avatar} />
                  <View style={styles.reviewMeta}>
                    <Text style={styles.reviewName}>{review.name}</Text>
                    <StarRating rating={review.rating} />
                  </View>
                  <Text style={styles.reviewTime}>{review.time}</Text>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}

            {/* Input comentario */}
            <View style={styles.commentInputRow}>
              <View style={styles.commentAvatar}>
                <MaterialIcons name="person" size={20} color={colors.primary} />
              </View>
              <View style={styles.commentInputWrapper}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Escribe un comentario..."
                  placeholderTextColor={colors.textMuted}
                  value={comment}
                  onChangeText={setComment}
                  returnKeyType="send"
                  onSubmitEditing={handleSendComment}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleSendComment}>
                  <MaterialIcons name="send" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón CTA fijo */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.ctaButton} onPress={handleReservar} activeOpacity={0.88}>
          <MaterialIcons name="calendar-today" size={20} color="white" />
          <Text style={styles.ctaButtonText}>Buscar disponibilidad</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(247,246,248,0.92)',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderPrimary,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  navTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  imageContainer: { position: 'relative' },
  heroImage: { width, height: width * 0.62 },
  imageDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  body: { padding: 20 },
  badgesRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  badge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.primary, textTransform: 'uppercase' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingValue: { fontSize: 14, fontWeight: '700', color: colors.star },
  ratingCount: { fontSize: 12, color: colors.textSecondary },
  offerTitle: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 8, lineHeight: 30 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 20 },
  locationText: { fontSize: 13, color: colors.textSecondary },
  priceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  priceLabel: { fontSize: 11, color: colors.textSecondary, textTransform: 'uppercase', fontWeight: '600', marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  priceValue: { fontSize: 26, fontWeight: '800', color: colors.text },
  priceOriginal: { fontSize: 14, color: colors.textMuted, textDecorationLine: 'line-through' },
  discountBox: { alignItems: 'flex-end' },
  discountText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  discountValid: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAll: { fontSize: 13, fontWeight: '700', color: colors.primary },
  description: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 6,
  },
  readMoreText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    marginBottom: 24,
  },
  contactLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactHint: { fontSize: 11, color: colors.textSecondary },
  contactPhone: { fontSize: 14, fontWeight: '700', color: colors.text },
  callBtn: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  callBtnText: { fontSize: 13, fontWeight: '700', color: colors.text },
  reviewCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  reviewMeta: { flex: 1 },
  reviewName: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 2 },
  reviewTime: { fontSize: 10, color: colors.textMuted },
  reviewComment: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    height: 44,
  },
  commentInput: { flex: 1, fontSize: 13, color: colors.text },
  sendBtn: { padding: 4 },
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(247,246,248,0.96)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaButtonText: { color: 'white', fontSize: 15, fontWeight: '700' },
});

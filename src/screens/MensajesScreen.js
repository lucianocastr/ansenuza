import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';

const MOCK_CONVERSATIONS = [
  {
    id: '1',
    name: 'Carla Méndez',
    avatar: 'https://picsum.photos/seed/avatar1/80/80',
    lastMessage: '¿Tienen disponibilidad para el finde de semana del 22?',
    time: 'hace 5 min',
    unread: 2,
    offer: 'Tour Flamencos Ansenuza',
  },
  {
    id: '2',
    name: 'Marcos Ruiz',
    avatar: 'https://picsum.photos/seed/avatar2/80/80',
    lastMessage: 'Perfecto, reservo para 3 noches entonces.',
    time: 'hace 1 h',
    unread: 0,
    offer: 'Cabañas Orilla del Lago',
  },
  {
    id: '3',
    name: 'Sofía García',
    avatar: 'https://picsum.photos/seed/avatar3/80/80',
    lastMessage: '¿El precio incluye el desayuno?',
    time: 'ayer',
    unread: 1,
    offer: 'Tour Flamencos Ansenuza',
  },
  {
    id: '4',
    name: 'Roberto Leal',
    avatar: 'https://picsum.photos/seed/avatar5/80/80',
    lastMessage: 'Muchas gracias por la atención, fue excelente.',
    time: 'hace 3 días',
    unread: 0,
    offer: 'Kayak en Ansenuza',
  },
  {
    id: '5',
    name: 'Luciana Torres',
    avatar: 'https://picsum.photos/seed/avatar4/80/80',
    lastMessage: '¿Cuándo sale el próximo tour?',
    time: 'hace 4 días',
    unread: 0,
    offer: 'Tour Flamencos Ansenuza',
  },
];

export default function MensajesScreen({ navigation }) {
  const totalUnread = MOCK_CONVERSATIONS.reduce((s, c) => s + c.unread, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mensajes</Text>
        {totalUnread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{totalUnread} sin leer</Text>
          </View>
        )}
      </View>

      <FlatList
        data={MOCK_CONVERSATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.row, item.unread > 0 && styles.rowUnread]}
            onPress={() => navigation.navigate('Chat', { conversation: item })}
            activeOpacity={0.85}
          >
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              {item.unread > 0 && <View style={styles.onlineDot} />}
            </View>
            <View style={styles.content}>
              <View style={styles.topRow}>
                <Text style={[styles.name, item.unread > 0 && styles.nameBold]}>
                  {item.name}
                </Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.offer} numberOfLines={1}>
                {item.offer}
              </Text>
              <View style={styles.bottomRow}>
                <Text
                  style={[styles.lastMessage, item.unread > 0 && styles.lastMessageBold]}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>
                {item.unread > 0 && (
                  <View style={styles.unreadCount}>
                    <Text style={styles.unreadCountText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderPrimary,
    backgroundColor: 'rgba(247,246,248,0.9)',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  unreadBadgeText: { fontSize: 11, fontWeight: '700', color: 'white' },
  list: { paddingVertical: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
    backgroundColor: colors.white,
  },
  rowUnread: { backgroundColor: colors.primaryLight },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
  },
  content: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  name: { fontSize: 14, fontWeight: '500', color: colors.text },
  nameBold: { fontWeight: '700' },
  time: { fontSize: 11, color: colors.textMuted },
  offer: { fontSize: 11, color: colors.primary, fontWeight: '600', marginBottom: 3 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lastMessage: { flex: 1, fontSize: 13, color: colors.textSecondary },
  lastMessageBold: { fontWeight: '600', color: colors.text },
  unreadCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadCountText: { fontSize: 11, fontWeight: '700', color: 'white' },
  separator: { height: 1, backgroundColor: colors.border, marginLeft: 82 },
});

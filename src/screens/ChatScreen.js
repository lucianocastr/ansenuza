import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';

const INITIAL_MESSAGES = {
  '1': [
    { id: 'm1', from: 'them', text: 'Hola! Vi su Tour de Flamencos en la app.', time: '10:32' },
    {
      id: 'm2',
      from: 'them',
      text: '¿Tienen disponibilidad para el finde de semana del 22?',
      time: '10:32',
    },
    {
      id: 'm3',
      from: 'me',
      text: '¡Hola Carla! Sí, tenemos lugares disponibles para ese fin de semana.',
      time: '10:35',
    },
    { id: 'm4', from: 'me', text: '¿Para cuántas personas sería?', time: '10:35' },
  ],
  '2': [
    { id: 'm1', from: 'them', text: 'Buenos días! Consulto por las cabañas.', time: 'ayer' },
    {
      id: 'm2',
      from: 'me',
      text: 'Hola Marcos, buen día. ¿En qué te puedo ayudar?',
      time: 'ayer',
    },
    { id: 'm3', from: 'them', text: 'Quería reservar para 3 noches, del 15 al 18.', time: 'ayer' },
    {
      id: 'm4',
      from: 'me',
      text: 'Perfecto, tenemos disponibilidad. Te paso los datos para confirmar.',
      time: 'ayer',
    },
    { id: 'm5', from: 'them', text: 'Perfecto, reservo para 3 noches entonces.', time: 'ayer' },
  ],
  '3': [
    {
      id: 'm1',
      from: 'them',
      text: 'Buenas! Quería consultar sobre el tour de flamencos.',
      time: 'ayer',
    },
    { id: 'm2', from: 'me', text: '¡Hola Sofía! Claro, con mucho gusto.', time: 'ayer' },
    { id: 'm3', from: 'them', text: '¿El precio incluye el desayuno?', time: 'ayer' },
  ],
  default: [
    { id: 'm1', from: 'them', text: 'Hola, tengo una consulta sobre la oferta.', time: 'hoy' },
  ],
};

export default function ChatScreen({ navigation, route }) {
  const { conversation } = route.params;
  const [messages, setMessages] = useState(
    INITIAL_MESSAGES[conversation.id] || INITIAL_MESSAGES.default
  );
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const msg = {
      id: `m${Date.now()}`,
      from: 'me',
      text: input.trim(),
      time: 'ahora',
    };
    setMessages((prev) => [...prev, msg]);
    setInput('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Image source={{ uri: conversation.avatar }} style={styles.headerAvatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{conversation.name}</Text>
          <Text style={styles.headerOffer} numberOfLines={1}>
            {conversation.offer}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.from === 'me' ? styles.bubbleMe : styles.bubbleThem,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  item.from === 'me' ? styles.bubbleTextMe : styles.bubbleTextThem,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.bubbleTime,
                  item.from === 'me' && { color: 'rgba(255,255,255,0.65)' },
                ]}
              >
                {item.time}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={5}
          onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Escribí un mensaje..."
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!input.trim()}
          >
            <MaterialIcons name="send" size={20} color={input.trim() ? 'white' : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderPrimary,
    backgroundColor: 'rgba(247,246,248,0.9)',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20 },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '700', color: colors.text },
  headerOffer: { fontSize: 11, color: colors.primary, fontWeight: '600' },
  messages: { padding: 16, gap: 8 },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 3,
  },
  bubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTextMe: { color: 'white' },
  bubbleTextThem: { color: colors.text },
  bubbleTime: { fontSize: 10, color: colors.textMuted, alignSelf: 'flex-end' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: colors.border },
});

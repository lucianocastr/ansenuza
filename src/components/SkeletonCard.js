import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.imageBlock} />
      <View style={styles.body}>
        <View style={styles.line} />
        <View style={[styles.line, { width: '60%' }]} />
        <View style={styles.footer}>
          <View style={[styles.line, { width: '30%', height: 10 }]} />
          <View style={[styles.btn]} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 0,
  },
  imageBlock: {
    height: 72,
    backgroundColor: colors.border,
    borderRadius: 10,
    margin: 12,
  },
  body: { paddingHorizontal: 12, paddingBottom: 14, gap: 8 },
  line: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    width: '80%',
  },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  btn: { width: 80, height: 28, borderRadius: 8, backgroundColor: colors.border },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

const CHART_HEIGHT = 140;

export default function BarChart({ data }) {
  const maxViews = Math.max(...data.map((d) => d.views));

  return (
    <View style={styles.container}>
      <View style={styles.barsRow}>
        {data.map((item) => {
          const viewsHeight = (item.views / maxViews) * CHART_HEIGHT;
          const bookingsHeight = (item.bookings / maxViews) * CHART_HEIGHT;

          return (
            <View key={item.day} style={styles.barGroup}>
              {/* Barra de fondo (vistas) */}
              <View style={[styles.barTrack, { height: CHART_HEIGHT }]}>
                <View style={[styles.viewsBar, { height: viewsHeight }]} />
                <View style={[styles.bookingsBar, { height: bookingsHeight }]} />
              </View>
              <Text style={styles.dayLabel}>{item.day}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: CHART_HEIGHT + 24,
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  barTrack: {
    width: '80%',
    backgroundColor: colors.background,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  viewsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: `${colors.primary}55`,
    borderRadius: 6,
  },
  bookingsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  dayLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 6,
  },
});

import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { prayerSchedule, PrayerTimes } from '@/constants/prayerSchedule';
import colors from '@/constants/colors';

type PrayerKey = keyof PrayerTimes;
type PrayerIcon = React.ComponentProps<typeof Ionicons>['name'];
const palette = colors.light;

type PrayerDefinition = {
  key: PrayerKey;
  label: string;
  icon: PrayerIcon;
};

const prayers: PrayerDefinition[] = [
  { key: 'imsak', label: 'Ertir / İmsak', icon: 'partly-sunny-outline' },
  { key: 'ogle', label: 'Öýle', icon: 'sunny-outline' },
  { key: 'ikindi', label: 'Ikindi', icon: 'sunny' },
  { key: 'aksam', label: 'Agşam / Akşam', icon: 'moon-outline' },
  { key: 'yatsi', label: 'Ýassy / Yatsı', icon: 'bed-outline' },
];

function getTodayTimes(date: Date): PrayerTimes | null {
  const matchingWindow = prayerSchedule.find(
    (window) =>
      window.month === date.getMonth() + 1 &&
      date.getDate() >= window.fromDay &&
      date.getDate() <= window.toDay,
  );

  if (!matchingWindow) return null;

  return {
    imsak: matchingWindow.imsak,
    ogle: matchingWindow.ogle,
    ikindi: matchingWindow.ikindi,
    aksam: matchingWindow.aksam,
    yatsi: matchingWindow.yatsi,
  };
}

function getNextPrayer(times: PrayerTimes, date: Date) {
  const currentMinutes = date.getHours() * 60 + date.getMinutes();
  const upcoming = prayers.find((prayer) => {
    const [hours, minutes] = times[prayer.key].split(':').map(Number);
    return hours * 60 + minutes > currentMinutes;
  });

  return upcoming ?? prayers[0];
}

export default function PrayerTimesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const today = new Date();
  const times = useMemo(() => getTodayTimes(today), [today.getDate(), today.getMonth()]);
  const nextPrayer = times ? getNextPrayer(times, today) : null;
  const dateText = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
  const topInset =
    Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topInset + 20, paddingBottom: insets.bottom + 36 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>GÜNÜŇ NAMAZY</Text>
            <Text style={styles.title}>Namaz wagtlary</Text>
            <Text style={styles.subtitle}>Her gün üçin takyk wagtlar</Text>
          </View>
          <View style={styles.moonMark}>
            <Ionicons name="moon" size={24} color={colors.accent} />
            <View style={styles.moonStar}>
              <Ionicons name="star" size={9} color={colors.accent} />
            </View>
          </View>
        </View>

        <View style={styles.dateCard}>
          <View style={styles.dateIcon}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.dateCopy}>
            <Text style={styles.dateLabel}>Şu günki senä</Text>
            <Text style={styles.dateHint}>Namaz wagtlaryňyz</Text>
          </View>
          <Text style={styles.dateValue}>{dateText}</Text>
        </View>

        {times ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bu gün</Text>
              {nextPrayer ? (
                <View style={styles.nextPill}>
                  <View style={styles.nextDot} />
                  <Text style={styles.nextText}>Indiki: {nextPrayer.label}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.prayerList}>
              {prayers.map((prayer, index) => (
                <PrayerRow
                  key={prayer.key}
                  prayer={prayer}
                  time={times[prayer.key]}
                  isNext={nextPrayer?.key === prayer.key}
                  isLast={index === prayers.length - 1}
                  colors={colors}
                />
              ))}
            </View>

            <View style={styles.footerNote}>
              <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
              <Text style={styles.footerText}>
                Wagtlar ýerli wagt boýunça görkezilýär
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-clear-outline" size={34} color={colors.primary} />
            <Text style={styles.emptyTitle}>Bu gün üçin wagt tapylmady</Text>
            <Text style={styles.emptyText}>
              Senäňizi we enjamyňyzyň wagt sazlamasyny barlaň.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function PrayerRow({
  prayer,
  time,
  isNext,
  isLast,
  colors,
}: {
  prayer: PrayerDefinition;
  time: string;
  isNext: boolean;
  isLast: boolean;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View
      style={[
        styles.prayerRow,
        {
          backgroundColor: isNext ? colors.primary : colors.card,
          borderColor: isNext ? colors.primary : colors.border,
          marginBottom: isLast ? 0 : 12,
        },
      ]}
    >
      <View style={[styles.prayerIcon, { backgroundColor: isNext ? 'rgba(255,255,255,0.15)' : colors.muted }]}>
        <Ionicons
          name={prayer.icon}
          size={21}
          color={isNext ? colors.accent : colors.primary}
        />
      </View>
      <Text style={[styles.prayerName, { color: isNext ? colors.primaryForeground : colors.foreground }]}>
        {prayer.label}
      </Text>
      <Text style={[styles.prayerTime, { color: isNext ? colors.primaryForeground : colors.primary }]}>
        {time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  eyebrow: {
    color: palette.accent,
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 1.8,
    marginBottom: 7,
  },
  title: {
    color: palette.primaryForeground,
    fontFamily: 'Inter_700Bold',
    fontSize: 29,
    letterSpacing: -0.8,
  },
  subtitle: {
    color: palette.secondary,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 6,
  },
  moonMark: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 28,
    borderWidth: 1,
    height: 56,
    justifyContent: 'center',
    marginTop: 2,
    width: 56,
  },
  moonStar: {
    position: 'absolute',
    right: 12,
    top: 11,
  },
  dateCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    flexDirection: 'row',
    marginBottom: 26,
    minHeight: 82,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  dateIcon: {
    alignItems: 'center',
    backgroundColor: '#E8EFE9',
    borderRadius: 13,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  dateCopy: {
    flex: 1,
    marginLeft: 12,
  },
  dateLabel: {
    color: palette.foreground,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  dateHint: {
    color: palette.mutedForeground,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 4,
  },
  dateValue: {
    color: palette.primary,
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: palette.foreground,
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
  },
  nextPill: {
    alignItems: 'center',
    backgroundColor: '#F1E9C8',
    borderRadius: 20,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  nextDot: {
    backgroundColor: '#B28B22',
    borderRadius: 4,
    height: 7,
    marginRight: 6,
    width: 7,
  },
  nextText: {
    color: palette.accentForeground,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
  },
  prayerList: {
    marginBottom: 18,
  },
  prayerRow: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 72,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  prayerIcon: {
    alignItems: 'center',
    borderRadius: 13,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  prayerName: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    marginLeft: 13,
  },
  prayerTime: {
    fontFamily: 'Inter_700Bold',
    fontSize: 19,
    letterSpacing: -0.2,
  },
  footerNote: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  footerText: {
    color: palette.mutedForeground,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginLeft: 6,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 34,
  },
  emptyTitle: {
    color: palette.foreground,
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    marginTop: 15,
  },
  emptyText: {
    color: palette.mutedForeground,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
});
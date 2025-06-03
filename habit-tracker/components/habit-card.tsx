import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Card, Chip } from 'react-native-paper';

// Create a more flexible interface for the component
interface HabitCardProps {
  title: string;
  description: string;
  frequency: string;
  streak_count: number;
  last_completed: string;
  onToggleComplete: () => void;
}

const HabitCard = ({
  title,
  description,
  frequency,
  streak_count,
  last_completed,
  onToggleComplete,
}: HabitCardProps) => {
  const getFrequencyColor = (freq: string) => {
    switch (freq) {
      case 'daily': return '#4CAF50';
      case 'weekly': return '#FF9800';
      case 'monthly': return '#9C27B0';
      default: return '#6B7280';
    }
  };

  const getStreakIcon = () => {
    if (streak_count >= 30) return 'fire';
    if (streak_count >= 14) return 'trophy';
    if (streak_count >= 7) return 'star';
    return 'chart-line';
  };

  const isCompletedToday = () => {
    const today = new Date().toDateString();
    return last_completed === today;
  };

  return (
    <Card style={styles.card} elevation={2}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <TouchableOpacity
            style={styles.checkButton}
            onPress={onToggleComplete}
          >
            <MaterialCommunityIcons
              name={isCompletedToday() ? "check-circle" : "circle-outline"}
              size={32}
              color={isCompletedToday() ? "#4CAF50" : "#E0E0E0"}
            />
          </TouchableOpacity>
        </View>

        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.chipContainer}>
            <Chip
              mode="outlined"
              style={styles.streakChip}
              textStyle={styles.streakChipText}
              icon={() => (
                <MaterialCommunityIcons
                  name={getStreakIcon()}
                  size={14}
                  color="#FF6B35"
                />
              )}
            >
              {streak_count} day{streak_count !== 1 ? 's' : ''}
            </Chip>

            <Chip
              mode="outlined"
              style={[styles.frequencyChip, { borderColor: getFrequencyColor(frequency) }]}
              textStyle={[styles.frequencyText, { color: getFrequencyColor(frequency) }]}
            >
              {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
            </Chip>
          </View>
        </View>
      </Card.Content>
    </Card>
  )
}

export { HabitCard }

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  checkButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    flex: 1,
  },
  streakChip: {
    alignSelf: 'flex-start',
    alignItems: "baseline",
    height: 28,
    backgroundColor: 'transparent',
    borderColor: '#FF6B35',
  },
  streakChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FF6B35',
  },
  frequencyChip: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    height: 28,
    backgroundColor: 'transparent',
  },
  frequencyText: {
    fontSize: 12,
    fontWeight: '500',
  },
})

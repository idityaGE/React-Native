import { client, COMPLETIONS_COLLECTION_ID, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealtimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/store/auth-context";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, ScrollView, RefreshControl } from "react-native";
import { ID, Query } from "react-native-appwrite";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import { Habit, HabitCompletions } from "@/types/databases.type";
import { useRouter } from "expo-router";
import { HabitCard } from "@/components/habit-card";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Swipeable } from "react-native-gesture-handler";

export default function Index() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [completedHabit, setCompletedHabit] = useState<string[]>([]);
  const { user } = useAuth();
  const router = useRouter();
  const swipableRef = useRef<{ [key: string]: Swipeable | null }>({})

  const fetchTodayCompletions = async () => {
    try {
      const today = new Date().toDateString()
      const res = await databases.listDocuments(
        DATABASE_ID,
        COMPLETIONS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? ""), Query.greaterThanEqual("completed_at", today)]
      )
      const completions = res.documents as HabitCompletions[]
      setCompletedHabit((completions.map(c => c.habit_id)))
    } catch (error) {
    }
  }

  const fetchHabits = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      setHabits(res.documents as Habit[]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchHabits(true);
  };

  useEffect(() => {
    if (user) {
      const habitsChannel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`
      const habisUnsubscription = client.subscribe(
        habitsChannel,
        (res: RealtimeResponse) => {
          if (res.events.includes("databases.*.collections.*.documents.*.create")) {
            onRefresh();
          } else if (res.events.includes("databases.*.collections.*.documents.*.update")) {
            onRefresh();
          } else if (res.events.includes("databases.*.collections.*.documents.*.delete")) {
            onRefresh();
          }
        }
      )

      const completionsChannel = `databases.${DATABASE_ID}.collections.${COMPLETIONS_COLLECTION_ID}.documents`
      const completionsUnsubscription = client.subscribe(
        completionsChannel,
        (res: RealtimeResponse) => {
          if (res.events.includes("databases.*.collections.*.documents.*.create")) {
            fetchTodayCompletions();
          }
        }
      )
      fetchHabits();
      fetchTodayCompletions()

      return () => {
        habisUnsubscription()
        completionsUnsubscription()
      }
    }
  }, [user]);

  const renderLeftActions = () => (
    <View style={styles.deleteAction}>
      <MaterialCommunityIcons size={32} color={'#fff'} name="trash-can-outline" />
    </View>
  )

  const renderRightActions = (habitId: string) => (
    <View style={styles.completeAction}>
      {isHabitCompleted(habitId) ? (
        <Text variant="titleLarge" style={{ color: 'white' }}>Completed!</Text>
      ) : (
        <MaterialCommunityIcons size={32} color="#fff" name="check-circle-outline" />
      )}
    </View>
  )

  const isHabitCompleted = (habitId: string) => completedHabit.includes(habitId)

  const handleDeleteHabit = async (id: string) => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        id
      )
    } catch (error) {
      console.log(error)
    }
  }

  const handleCompletedHabit = async (id: string) => {
    if (!user || completedHabit.includes(id)) return;
    try {
      const currentDate = new Date().toDateString();
      await databases.createDocument(DATABASE_ID, COMPLETIONS_COLLECTION_ID, ID.unique(), {
        habit_id: id,
        user_id: user?.$id,
        completed_at: currentDate
      })
      const habit = habits?.find(h => h.$id === id)
      if (!habit) return;
      await databases.updateDocument(DATABASE_ID, HABITS_COLLECTION_ID, id, {
        streak_count: habit.streak_count + 1,
        last_completed: currentDate
      })
    } catch (error) {
      console.log(error)
    }
  }


  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading habits...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Today's Habits
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        {habits.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <MaterialCommunityIcons
              name="clipboard-check-outline"
              size={80}
              color="#E5E7EB"
            />
            <Text variant="headlineSmall" style={styles.emptyStateTitle}>
              No Habits Yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptyStateSubtitle}>
              Start building healthy habits today. Create your first habit to begin your journey!
            </Text>
            <Button
              icon="plus"
              mode="contained"
              onPress={() => router.push('/add-habit')}
              style={styles.addHabitButton}
            >
              Create Your First Habit
            </Button>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={['#6366F1']}
              />
            }
          >
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Total Habits
                </Text>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {habits.length}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Completed Today
                </Text>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {habits.filter(habit =>
                    habit.last_completed === new Date().toDateString()
                  ).length}
                </Text>
              </View>
            </View>

            <View style={styles.habitsContainer}>
              {habits.map((habit, key) => (
                <Swipeable
                  ref={(ref) => {
                    swipableRef.current[habit.$id] = ref
                  }}
                  key={key}
                  overshootLeft={false}
                  overshootRight={false}
                  renderLeftActions={renderLeftActions}
                  renderRightActions={() => renderRightActions(habit.$id)}
                  onSwipeableOpen={(direction) => {
                    if (direction === 'left') {
                      handleDeleteHabit(habit.$id)
                    } else if (direction === 'right') {
                      handleCompletedHabit(habit.$id)
                    }
                    swipableRef.current[habit.$id]?.close()
                  }}
                >
                  <HabitCard
                    key={habit.$id}
                    title={habit.title}
                    description={habit.description}
                    streak_count={habit.streak_count}
                    last_completed={habit.last_completed}
                    frequency={habit.frequency}
                    onToggleComplete={() => console.log("Toggle Complete")}
                  />
                </Swipeable>
              ))}
            </View>

            <Button
              icon="plus"
              mode="outlined"
              onPress={() => router.push('/add-habit')}
              style={styles.addAnotherButton}
            >
              Add Another Habit
            </Button>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6B7280',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 24,
  },
  emptyStateTitle: {
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  addHabitButton: {
    borderRadius: 12,
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statLabel: {
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  habitsContainer: {
    paddingHorizontal: 4,
  },
  addAnotherButton: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 12,
    borderColor: '#6366F1',
  },
  deleteAction: {
    backgroundColor: "#E53935",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 16,
    borderRadius: 12,
    marginLeft: 16,
    marginRight: 16,
    marginVertical: 8,
  },
  completeAction: {
    backgroundColor: "#4CAF50",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 16,
    borderRadius: 12,
    marginLeft: 16,
    marginRight: 16,
    marginVertical: 8,
  },
});

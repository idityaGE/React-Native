import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Button, SegmentedButtons, TextInput, Text, ActivityIndicator } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/store/auth-context'
import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from '@/lib/appwrite'
import { ID } from 'react-native-appwrite'
import { useRouter } from 'expo-router'

const FREQUENCY = ["daily", 'weekly', 'monthly']
type Frequency = (typeof FREQUENCY)[number]

const AddHabit = () => {
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [frequency, setFrequency] = useState<Frequency>("daily")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { user } = useAuth();
  const router = useRouter()

  const handleAddHabit = async () => {
    if (!user) return;

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await databases.createDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          title: title.trim(),
          description: description.trim(),
          frequency,
          streak_count: 0,
          last_completed: new Date().toDateString(),
          created_at: new Date().toDateString()
        }
      )
      setTitle("");
      setDescription("");
      setFrequency("daily");
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
        return;
      }
      setError("Error occurred during adding habit")
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Add Habit</Text>

          <View style={styles.formContainer}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              label="Title"
              mode='outlined'
              placeholder="Enter habit title"
              style={styles.input}
              disabled={isLoading}
            />

            <TextInput
              value={description}
              onChangeText={setDescription}
              label="Description"
              mode='outlined'
              placeholder="Enter habit description"
              multiline
              numberOfLines={3}
              style={styles.input}
              disabled={isLoading}
            />

            <View style={styles.frequencyContainer}>
              <Text style={styles.sectionLabel}>Frequency</Text>
              <SegmentedButtons
                buttons={FREQUENCY.map((freq) => ({
                  value: freq,
                  label: freq.charAt(0).toUpperCase() + freq.slice(1)
                }))}
                value={frequency}
                onValueChange={(val) => setFrequency(val as Frequency)}
                // disabled={isLoading}
              />
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <Button
              mode='contained'
              disabled={!title.trim() || isLoading}
              onPress={handleAddHabit}
              contentStyle={styles.buttonContent}
              loading={isLoading}
            >
              {isLoading ? '' : 'Add Habit'}
            </Button>

            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Creating habit...</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddHabit

// ...existing code...

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#1F2937',
    fontSize: 28,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    gap: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  frequencyContainer: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    fontSize: 14,
    marginTop: -8,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
})

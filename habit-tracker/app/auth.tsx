import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { Button, Text, TextInput, ActivityIndicator } from 'react-native-paper'
import { useState } from 'react'
import { useAuth } from '@/store/auth-context';
import { useRouter } from 'expo-router';

const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const error = await signUp(email, password);
        if (error) {
          setError(error);
          return;
        }
      } else {
        const error = await signIn(email, password);
        if (error) {
          setError(error);
          return;
        }
      }
      router.replace('/');
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{isSignUp ? "Welcome" : "Welcome Back"}</Text>

        <View style={styles.inputContainer}>
          <TextInput
            label="Email"
            mode="outlined"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            disabled={isLoading}
          />
          <TextInput
            label="Password"
            mode="outlined"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            disabled={isLoading}
          />
        </View>

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode='contained'
            onPress={handleSubmit}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? '' : (isSignUp ? 'Sign Up' : 'Log In')}
          </Button>

          <Button
            mode='outlined'
            onPress={() => setIsSignUp(prev => !prev)}
            style={styles.secondaryButton}
            contentStyle={styles.buttonContent}
            disabled={isLoading}
          >
            {isSignUp ? 'Switch to Log In' : 'Switch to Sign Up'}
          </Button>
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>
              {isSignUp ? 'Creating account...' : 'Signing in...'}
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

export default AuthScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    justifyContent: 'center',
    gap: 24,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
    marginTop: -8,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    marginBottom: 4,
  },
  secondaryButton: {
    marginTop: 4,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
})

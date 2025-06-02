import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import { useState } from 'react'
import { useAuth } from '@/store/auth-context';
import { useRouter } from 'expo-router';

const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError("Password must be atlest 6 charaters");
      return;
    }

    setError(null);

    if (isSignUp) {
      const error = await signUp(email, password);
      if (error) {
        setError(error);
        return
      }
    } else {
      const error = await signIn(email, password)
      if (error) {
        setError(error);
        return
      }
    }
    router.replace('/')

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
          />
          <TextInput
            label="Password"
            mode="outlined"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
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
          >
            {isSignUp ? 'Sign Up' : 'Log In'}
          </Button>

          <Button
            mode='outlined'
            onPress={() => setIsSignUp(prev => !prev)}
            style={styles.secondaryButton}
            contentStyle={styles.buttonContent}
          >
            {isSignUp ? 'Switch to Log In' : 'Switch to Sign Up'}
          </Button>
        </View>
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
})

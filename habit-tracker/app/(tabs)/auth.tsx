import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import { useState } from 'react'

const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError(null);

  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View >
        <Text style={styles.title} >{isSignUp ? "Welcome" : "Welcome Back"}</Text>
        <TextInput
          label="Email"
          mode="outlined"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          label="Password"
          mode="outlined"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error && (
          <Text style={{ color: 'red', margin: 10, textAlign: 'center' }}>{error}</Text>
        )}

        <Button
          mode='contained'
          onPress={handleSubmit}
        >
          {isSignUp ? 'Sign Up' : 'Log In'}
        </Button>

        <Button
          mode='outlined'
          onPress={() => setIsSignUp(prev => !prev)}
        >
          {isSignUp ? 'Switch to Log In' : 'Switch to Sign Up'}
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}

export default AuthScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    marginHorizontal: 20
  },
  content: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
  }

})

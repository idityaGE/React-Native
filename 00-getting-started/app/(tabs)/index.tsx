import { StyleSheet, Text, View } from 'react-native'

const app = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello React Native</Text>
    </View>
  )
}

export default app

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  }
})

import { Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const App = () => {
  return (
    <View className='text-primary flex-1 justify-center items-center' >
      <Text className='text-6xl' >Hello, World!</Text>
      <Link href={{ pathname: '/movie/[id]', params: { id: '1' } }} className='text-blue-500 text-2xl mt-4'>
        Go to Movie 1
      </Link>
    </View>
  )
}

export default App


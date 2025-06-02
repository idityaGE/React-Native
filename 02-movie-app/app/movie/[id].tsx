import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const MovieDetail = () => {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>MovieDetail for ID: {id}</Text>
    </View>
  )
}

export default MovieDetail

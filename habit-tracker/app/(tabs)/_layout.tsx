import { StyleSheet } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Entypo from '@expo/vector-icons/Entypo';

const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarActiveTintColor: '#e91e63',
          tabBarIcon: ({ color, focused }) => {
            return <Entypo name="home" size={24} color={color} />
          }
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarActiveTintColor: '#e91e63',
          tabBarIcon: ({ color, focused }) => {
            return <Entypo name="user" size={24} color={color} />
          }
        }}
      />
    </Tabs>
  )
}

export default TabLayout

const styles = StyleSheet.create({})

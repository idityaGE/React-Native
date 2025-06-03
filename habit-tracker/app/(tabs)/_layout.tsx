import { StyleSheet } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const TabLayout = () => {
  return (
    <Tabs screenOptions={{
      // headerShown: false,
      headerStyle: {
        backgroundColor: '#f5f5f5'
      },
      headerShadowVisible: false,
      tabBarStyle: {
        backgroundColor: '#f5f5f5',
        borderTopWidth: 0,
        shadowOpacity: 0,
        elevation: 0
      },
      tabBarActiveTintColor: '#6200ee',
      tabBarInactiveTintColor: '#666666'
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Today's Habits",
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => {
            return <MaterialCommunityIcons name="calendar" size={size} color={color} />
          }
        }}
      />
      <Tabs.Screen
        name="streaks"
        options={{
          title: 'Streaks',
          tabBarIcon: ({ color, focused, size }) => {
            return <MaterialCommunityIcons name="chart-line" size={size} color={color} />
          }
        }}
      />
      <Tabs.Screen
        name="add-habit"
        options={{
          title: 'Add Habit',
          tabBarIcon: ({ color, focused, size }) => {
            return <MaterialCommunityIcons name="plus-circle" size={size} color={color} />
          }
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused, size }) => {
            return <MaterialCommunityIcons name="account" size={size} color={color} />
          }
        }}
      />
    </Tabs>
  )
}

export default TabLayout

const styles = StyleSheet.create({})

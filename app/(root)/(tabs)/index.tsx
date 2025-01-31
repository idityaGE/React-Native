import { Link } from "expo-router";
import { useState } from "react";
import { Button, Text, View } from "react-native";

export default function Index() {
  const [count, setCount] = useState(0)

  return (
    <View
      style={{
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Text>Count: {count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
      <Button title="Decrement" onPress={() => setCount(count - 1)} /> */}
      <View className="flex gap-3 text-lg">
        <Text className="text-3xl underline text-red-500">Hello Expo</Text>
        <Link href="/sign-in">Sing-In</Link>
        <Link href="/explore">Explore</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/properties/1">Property</Link>
      </View>
    </View>
  );
}

import { useAuth } from "@/store/auth-context";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function Index() {
  const { signOut } = useAuth()

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Welcome</Text>
      <Button
        mode="contained"
        onPress={signOut}
        icon={"logout"}
      >
        SignOut
      </Button>
    </View>
  );
}

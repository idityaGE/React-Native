import { StyleSheet, Text, View } from 'react-native'
import { useAuth } from "@/store/auth-context";
import { Button } from 'react-native-paper';

const Profile = () => {
  const { signOut, user } = useAuth()

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Profile</Text>
      <Text>{user?.email}</Text>
      <Text>{user?.$id}</Text>
      <Button
        mode="contained"
        onPress={signOut}
        icon={"logout"}
      >
        SignOut
      </Button>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})

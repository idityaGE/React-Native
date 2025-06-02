import { Stack, useRouter, useSegments } from "expo-router";
import { use, useEffect } from "react";
import { AuthContextProvider, useAuth } from "@/store/auth-context";

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoadingUser } = useAuth()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    const isAuthGroup = segments[0] === 'auth'
    if (!user && !isAuthGroup && !isLoadingUser) {
      router.replace("/auth");
    } else if (user && isAuthGroup && !isLoadingUser) {
      router.replace('/')
    }
  }, [user, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <RouteGuard>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </RouteGuard>
    </AuthContextProvider>
  )
}

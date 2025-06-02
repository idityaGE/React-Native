import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = true;
  const router = useRouter()
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, router]);
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <RouteGuard>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </RouteGuard>
  )
}

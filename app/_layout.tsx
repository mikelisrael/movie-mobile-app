import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "./global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <>
        {/* <StatusBar hidden /> */}
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
          {/* <Stack.Screen name="(tabs)/saved" options={{ title: "Saved Movies" }} /> */}
          {/* <Stack.Screen name="(tabs)/profile" options={{ title: "Profile" }} /> */}
        </Stack>
      </>
    </QueryClientProvider>
  );
}

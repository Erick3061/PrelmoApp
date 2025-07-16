import { Notification } from '@/components/Notification';
import { useSetConfig } from '@/hooks/useSetConfig';
import { AuthStatus } from '@/interface/auth.store.interface';
import { ThemeMode } from '@/interface/theme.store.interface';
import useAuthStore from '@/utils/auth.store';
import useThemeStore from '@/utils/theme.store';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet } from 'react-native';
import { Appbar, PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

export default function RootLayout() {
  useSetConfig();
  const queryClient = new QueryClient();
  const mode = useThemeStore(state => state.mode);
  const [loaded] = useFonts({ SpaceMono: require('../assets/fonts/poppins.regular.ttf') });
  const { status } = useAuthStore();
  const Header = () => (
    <Appbar.Header>
      <Image
        style={[style.appbar_image]}
        source={require('../assets/images/prelmo2.png')}
      />
    </Appbar.Header>
  );

  if (!loaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <ThemeProvider value={mode === ThemeMode.dark ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Protected guard={status === AuthStatus.authorized}>
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard>
              <Stack.Screen name="sing-in" options={{ header: Header }} />
              <Stack.Screen name="tcap" options={{ presentation: 'modal', animation: 'fade', title: 'Términos, condiciones y aviso de privacidad' }} />
              <Stack.Screen name="+not-found" />
            </Stack.Protected>
          </Stack>
          <Notification />
          <StatusBar style="auto" />
        </ThemeProvider>
      </PaperProvider>
    </QueryClientProvider >
  );
}

export const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.20,
    shadowRadius: 3,
    elevation: 3,
  },
  appbar_image: {
    resizeMode: 'contain',
    height: '45%',
    width: 120
  },
});

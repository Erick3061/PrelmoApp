import { Notification } from '@/components/Notification';
import StackComponent from '@/components/StackComponet';
import { useSetConfig } from '@/hooks/useSetConfig';
import { ThemeMode } from '@/interface/theme.store.interface';
import useThemeStore from '@/utils/theme.store';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

export default function RootLayout() {
  useSetConfig();
  const queryClient = new QueryClient();
  const mode = useThemeStore(state => state.mode);
  const [loaded] = useFonts({ SpaceMono: require('../assets/fonts/poppins.regular.ttf') });

  if (!loaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={mode === ThemeMode.dark ? MD3DarkTheme : MD3LightTheme}>
        <ThemeProvider value={mode === ThemeMode.dark ? DarkTheme : DefaultTheme}>
          <StackComponent />
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
  }
});

import { Notification } from '@/components/Notification';
import StackComponent from '@/components/StackComponet';
import { useSetConfig } from '@/hooks/useSetConfig';
import { ThemeMode } from '@/interface/theme.store.interface';
import useThemeStore from '@/utils/theme.store';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

export default function RootLayout() {
  useSetConfig();
  const queryClient = new QueryClient();
  const theme = useThemeStore(state => state.theme);
  const mode = useThemeStore(state => state.mode);
  const [loaded] = useFonts({ SpaceMono: require('../assets/fonts/poppins.regular.ttf') });

  if (!loaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <ThemeProvider value={theme}>
          <StackComponent />
          <Notification />
          <StatusBar style={mode === ThemeMode.dark ? 'light' : 'dark'} />
        </ThemeProvider>
      </PaperProvider>
    </QueryClientProvider >
  );
}

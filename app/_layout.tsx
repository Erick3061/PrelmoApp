import Loading from '@/components/Loading';
import { Notification } from '@/components/Notification';
import { useSetConfig } from '@/hooks/useSetConfig';
import { AuthStatus } from '@/interface/auth.store.interface';
import AuthService from '@/services/auth.service';
import useAuthStore from '@/utils/auth.store';
import useThemeStore from '@/utils/theme.store';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import * as Clipboard from "expo-clipboard";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Appbar, PaperProvider } from 'react-native-paper';
import { DevToolsBubble } from "react-native-react-query-devtools";
import 'react-native-reanimated';

const style = StyleSheet.create({
  appbar_image: {
    resizeMode: 'contain',
    height: '45%',
    width: 120
  },
});

const Header = () => (
  <Appbar.Header>
    <Image style={[style.appbar_image]} source={require('../assets/images/prelmo2.png')} />
  </Appbar.Header>
);

export default function Root() {
  useSetConfig();
  const queryClient = new QueryClient();
  const theme = useThemeStore(state => state.theme);
  const [loaded] = useFonts({ SpaceMono: require('../assets/fonts/poppins.regular.ttf') });

  if (!loaded) return null;

  const onCopy = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <ThemeProvider value={theme}>
          <RootNavigator />
          <Notification />
        </ThemeProvider>
      </PaperProvider>
      <DevToolsBubble onCopy={onCopy} queryClient={queryClient} />
    </QueryClientProvider >
  );
}


function RootNavigator() {
  const { status, logIn, logOut } = useAuthStore();
  const { isLoading, data, isSuccess, isError } = useQuery({ queryKey: ['CheckAuth'], queryFn: () => AuthService.CheckAuth(), retry: 0 });

  useEffect(() => {
    if (isError) logOut();
  }, [isError, logOut]);

  useEffect(() => {
    if (isSuccess && data) {
      logIn(data);
    }
  }, [isSuccess, data, logIn])

  if (isLoading) return <Loading loading />

  return (
    <Stack screenOptions={{ animation: 'fade' }}>
      <Stack.Protected guard={status === AuthStatus.authorized}>
        <Stack.Screen name="(menu)" options={{ headerShown: false, presentation: 'containedTransparentModal' }} />
      </Stack.Protected>

      <Stack.Protected guard={status !== AuthStatus.authorized}>
        <Stack.Screen name="index" options={{ header: Header, presentation: 'containedTransparentModal' }} />
      </Stack.Protected>
    </Stack>
  )
}
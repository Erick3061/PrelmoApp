import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from './src/navigation/Stack';
import { Provider as StoreProviderRedux } from "react-redux";
import { store } from './src/app/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RequestProvider } from './src/context/RequestContext';


export const App = () => {

  const queryClient = new QueryClient();

  return (
    <StoreProviderRedux store={store}>
      <QueryClientProvider client={queryClient}>
        <RequestProvider>
          <Stack />
        </RequestProvider>
      </QueryClientProvider>
    </StoreProviderRedux>
  )
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
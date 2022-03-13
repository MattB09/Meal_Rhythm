
import { StyleSheet, useColorScheme } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from 'easy-peasy';

import { customLight, customDark } from './src/themes';
import { store } from './src/store';
import AppWrapper from './src/AppWrapper';


export default function App() {
  const themeName = useColorScheme()

  return (
    <ThemeProvider theme={themeName === 'dark' ? customDark : customLight} useDark={themeName === 'dark'}>
      <SafeAreaProvider>
        <StoreProvider store={store}>
          <AppWrapper />
        </StoreProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333'
  },
});

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { ThemeProvider, Button } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { customLight, customDark } from './src/themes'
import Navigator from './src/screens';

export default function App() {
  const themeName = useColorScheme()

  return (
    <ThemeProvider theme={themeName === 'dark' ? customDark : customLight} useDark={themeName === 'dark'}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        {/* <View style={styles.container}>
          <Text>Open up App.tsx to start working on your app!</Text>
          <Button 
            title="Test Theme"
          />
        </View> */}
        <Navigator />
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

import { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth'
import { useTheme, LinearProgress } from 'react-native-elements'

import Navigator from './screens';
import AuthScreen from './screens/auth';
import { useStoreActions, useStoreState, store  } from './store';
import { auth as fbAuth } from './firebase';


export default function AppWrapper() {
  const user = useStoreState((state) => state.auth.user)
  const wasChecked = useStoreState((state) => state.auth.wasChecked)
  const handleAuthChange = useStoreActions((actions) => actions.auth.handleAuthChange )
  const { theme } = useTheme()

  useEffect(() => {
    const unsub = onAuthStateChanged(fbAuth, (user) => {
      handleAuthChange(user)
      console.log("Auth changed.. useEffect inside callback", user?.email)
    })

    return () => {
      unsub()
    }
  }, [user])

  if (!wasChecked) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors?.white, justifyContent: 'center', alignItems: 'center'}}>
        <LinearProgress style={{marginHorizontal: 16, height: 24, width: "90%"}}/>
      </SafeAreaView>
    )
  }

  return (
    <>
      <StatusBar style="auto" />
      { (user === null ) 
      ? <AuthScreen />
      : <Navigator />
      }
    </>
  )
}

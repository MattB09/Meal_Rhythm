import { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth'

import Navigator from './screens';
import AuthScreen from './screens/auth';
import { useStoreActions, useStoreState, store  } from './store';
import { auth as fbAuth } from './firebase';


export default function AppWrapper() {
  const handleAuthChange = useStoreActions((actions) => actions.auth.handleAuthChange )
  const user = useStoreState((state) => state.auth.user)

  useEffect(() => {
    const unsub = onAuthStateChanged(fbAuth, (user) => {
      handleAuthChange(user)
    })

    return () => {
      unsub()
    }
  }, [user])
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

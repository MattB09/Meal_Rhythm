import { Text, Button } from 'react-native-elements';

import { useStoreActions } from '../../store'


export default function DashboardScreen() {
  const signOut = useStoreActions((actions) => actions.auth.signOut)

  function handleSignOut() {
    signOut(null)
  }
  
  return (
    <>
      <Text h1 style={{textAlign: 'center'}}>Dashboard</Text>
      <Button 
        title="Sign Out"
        onPress={handleSignOut}
      />
    </>
  )
}
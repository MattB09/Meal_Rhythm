import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Input, useTheme } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useStoreActions, useStoreState } from '../../store'


export default function AuthScreen() {
  const { theme } = useTheme()
  const signIn = useStoreActions((actions) => actions.auth.signIn)
  const user = useStoreState((state) => state.auth.user)

  const [ email, setEmail ] = useState<string>("")
  const [ password, setPassword ] = useState<string>("")
  const [ passwordVisible, setPasswordVisible ] = useState<boolean>(false)

  useEffect(() => {
    console.log("state change", user?.email)
  }, [user])
  

  function handleSignIn() {
    console.log("pressed")
    signIn({email, password})
  }

  function toggleVisible() {
    setPasswordVisible((prev) => !prev)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors?.white, alignItems: 'center' }}>
      <View style={{width: "90%"}}>
        <Input 
          errorMessage={email === "" ? "Must enter a valid email address" : ""}
          label="Email Address"
          leftIcon={<Icon name="account-outline" size={20} color={theme.colors?.black}/>}
          placeholder="JohnDoe@gmail.com"
          renderErrorMessage={true}
          onChangeText={(text) => setEmail(text)}
        />
        <Input 
          errorMessage={password === "" ? "Must input a password" : ""}
          label="Password"
          leftIcon={<Icon name="lock" size={20} color={theme.colors?.black} />}
          rightIcon={<Icon name="eye" size={20} color={theme.colors?.black} onPress={toggleVisible} />}
          secureTextEntry={!passwordVisible}
          renderErrorMessage={true}
          onChangeText={(text) => setPassword(text)}
        />
        <Button
          title="Sign In"
          onPress={handleSignIn}
        />
      </View>
    </SafeAreaView>
  )
}

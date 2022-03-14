import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Input, useTheme, Text } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useStoreActions, useStoreState } from '../../store'


export default function AuthScreen() {
  const signIn = useStoreActions((actions) => actions.auth.signIn)
  const user = useStoreState((state) => state.auth.user)
  const { theme } = useTheme()

  const [form, setForm ] = useState<string>("signIn")
  const [ email, setEmail ] = useState<string>("")
  const [ password, setPassword ] = useState<string>("")
  const [ confirmP, setConfirmP ] = useState<string>("")
  const [confirmError, setConfirmError] = useState<string>("")
  const [ passwordVisible, setPasswordVisible ] = useState<boolean>(false)


  useEffect(() => {
    console.log("state change", user?.email)
  }, [user])
  

  function handleSignIn() {
    console.log("pressed")
    signIn({email, password})
  }

  function handleSignUp() {
    console.log("todo")
  }

  function toggleVisible() {
    setPasswordVisible((prev) => !prev)
  }

  function handleUpdateConfirm(text: string) {
    setConfirmP(text)
    if (text !== password) {
      setConfirmError("Passwords must match!")
      return
    }
    setConfirmError("")
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors?.white, alignItems: 'center' }}>
      <View style={{width: "90%", marginVertical: "3%"}}>
        <Text h1 style={{textAlign: 'center', marginBottom: "5%"}}>
          { form === 'signIn' ? "Sign In" : "Sign Up"}
        </Text>

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

        { form === "signIn" 
        ?
          <>
            <Button
              title="Sign In"
              onPress={handleSignIn}
            />
            <Button
              containerStyle={{
                marginVertical: 10,
              }}
              title="Sign Up"
              type="clear"
              onPress={() => setForm("signUp")}
            />
          </>
        :
          <>
            <Input 
              errorMessage={confirmError}
              label="Confirm Password"
              leftIcon={<Icon name="lock" size={20} color={theme.colors?.black} />}
              rightIcon={<Icon name="eye" size={20} color={theme.colors?.black} onPress={toggleVisible} />}
              secureTextEntry={!passwordVisible}
              renderErrorMessage={true}
              onChangeText={(text) => handleUpdateConfirm(text)}
            />
            <Button
              title="Sign Up"
              onPress={handleSignUp}
            />

            <Button
              containerStyle={{
                marginVertical: 10,
              }}
              title="Sign In"
              type="clear"
              onPress={() => setForm("signIn")}
            />
          </>
        }

      </View>
    </SafeAreaView>
  )
}

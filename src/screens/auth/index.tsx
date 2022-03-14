import { useState, useEffect } from 'react';
import { View, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Input, useTheme, Text } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useStoreActions, useStoreState } from '../../store'

// password regex - at least one lower, upper, and digit
const RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*\w{7,14}$/

export default function AuthScreen() {
  const signIn = useStoreActions((actions) => actions.auth.signIn)
  const signUp = useStoreActions((actions) => actions.auth.signUp)
  const signInError = useStoreState((state) => state.auth.signInError)
  const signUpError = useStoreState((state) => state.auth.signUpError)
  const { theme } = useTheme()

  const [form, setForm ] = useState<string>("signIn")

  const [ email, setEmail ] = useState<string>("")
  const [ emailError, setEmailError ] = useState<string>("")

  const [ password, setPassword ] = useState<string>("")
  const [ passwordError, setPasswordError ] = useState<string>("")
  const [ confirmP, setConfirmP ] = useState<string>("")
  const [confirmError, setConfirmError] = useState<string>("")
  const [ passwordVisible, setPasswordVisible ] = useState<boolean>(false)


  function handleEmailChange(text: string) {
    setEmail(text);
    if (text.length === 0 || !text.includes('@')) {
      setEmailError("Must input a valid email address");
      return
    }
    setEmailError("")
  }
  
  function handlePasswordChange(text: string) {
    setPassword(text);
    if (text.length === 0) {
      setPasswordError("You must set a password");
      return
    } 
    if (!RE.test(text)) {
      setPasswordError("Password not strong enough.");
      return
    }
    setPasswordError("");
  }

  function handleConfirmChange(text: string) {
    setConfirmP(text);
    if (text !== password) {
      setConfirmError("Passwords must match!");
      return
    }
    setConfirmError("");
  }

  function handleSignUp() {
    console.log("todo");
  }

  function toggleVisible() {
    setPasswordVisible((prev) => !prev);
  }

  function disableSignIn() {
    if (email.length === 0 || password.length === 0) return true;
    if (emailError.length > 0 || passwordError.length > 0) return true;
    return false;
  }

  function disableSignUp() {
    if (disableSignIn() || confirmP.length === 0) return true;
    if (confirmError.length > 0) return true;
    return false;
  }

  return (
    <SafeAreaView style={{ width: "100%", height: "100%", backgroundColor: theme.colors?.white}}>
      <KeyboardAvoidingView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{width: "90%", marginVertical: "3%"}}>

            <Text h2 style={{textAlign: 'center', marginBottom: "5%"}}>
              { form === 'signIn' ? "Sign In" : "Sign Up"}
            </Text>

            <Input 
              errorMessage={emailError}
              label="Email Address"
              leftIcon={<Icon name="account-outline" size={20} color={theme.colors?.black}/>}
              placeholder="JohnDoe@gmail.com"
              renderErrorMessage={true}
              onChangeText={(text) => handleEmailChange(text)}
            />
            <Input 
              errorMessage={passwordError}
              label="Password"
              leftIcon={<Icon name="lock" size={20} color={theme.colors?.black} />}
              rightIcon={<Icon name="eye" size={20} color={theme.colors?.black} onPress={toggleVisible} />}
              secureTextEntry={!passwordVisible}
              renderErrorMessage={true}
              onChangeText={(text) => handlePasswordChange(text)}
            />

            { form === "signIn" 
            ?
              <>
                <Text style={{color: theme.colors?.error}}>{ signInError }</Text>

                <Button
                  title="Sign In"
                  onPress={() => signIn({email, password})}
                  disabled={disableSignIn()}
                  containerStyle={{marginTop: 8}}
                />
                <Button
                  containerStyle={{
                    marginTop: 16,
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
                  onChangeText={(text) => handleConfirmChange(text)}
                />

                <Text style={{color: theme.colors?.error}}>{ signUpError }</Text>

                <Button
                  title="Sign Up"
                  onPress={() => signUp({email, password})}
                  disabled={disableSignUp()}
                  containerStyle={{marginTop: 16}}
                />

                <Button
                  containerStyle={{
                    marginTop: 16,
                  }}
                  title="Sign In"
                  type="clear"
                  onPress={() => setForm("signIn")}
                />
              </>
            }

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

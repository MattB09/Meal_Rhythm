import { useState } from 'react';
import { Text, useTheme, Input, Button } from 'react-native-elements';
import { View, KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';


import { useStoreActions, useStoreState } from '../../store';
import type { Weight } from '../../store/weight';



export default function AddWeightModal({visible, closeFunc}:any) {
  const user = useStoreState((state) => state.auth.user)
  const saveWeight = useStoreActions((actions) => actions.weight.saveWeight)

  const { theme } = useTheme();

  const [weight, setWeight] = useState<string>("")
  const [weightError, setWeightError] = useState<string>("")
  const [note, setNote] = useState<string>("")

  function handleUpdateWeight(text: string) {
    setWeight(text)
    if (text.length === 0 || !weightIsValid(text)) {
      setWeightError("Enter a valid weight with maximum 2 decimal places")
      return
    }
    setWeightError("")
  }

  function weightIsValid(text: string):boolean {
    return /^\d{1,3}(\.\d{0,2})?$|^\.\d\d?$/.test(text);
  }

  function handleSaveWeight() {
    if (weight === "" || weightError) return
    let actualNote = (note === "") ? null : note
    let d = new Date()
    saveWeight({
      uid: user!.uid, 
      weight: {
        id: d.toUTCString(),
        date: d,
        weight: Number(weight),
        note: actualNote
      }
    });
    handleClose()
  }

  function handleClose() {
    setWeight("")
    setWeightError("")
    setNote("")
    closeFunc()
  }


  return (
  <Modal
    transparent={true}
    visible={visible}
    onDismiss={closeFunc}
    animationType="slide"
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex:1, justifyContent: 'center', alignItems: 'center'}} 
    >
      <TouchableWithoutFeedback 
        onPress={Keyboard.dismiss} 
        accessible={false}
      >
        <View style={{ width: '90%', backgroundColor: theme.colors?.primary, padding: 16, borderRadius:30 }}>
          <Text h3 style={{color: theme.colors?.black, textAlign: 'center', marginBottom: 8}}>Log your weight</Text>
          <Input 
            style={{color: theme.colors?.black}}
            label="Weight (kg)"
            labelStyle={{color:theme.colors?.grey1}}
            errorMessage={weightError}
            renderErrorMessage={weightError !== ""}
            onChangeText={(text) => handleUpdateWeight(text)}
          />
          <Input 
            style={{color: theme.colors?.black}}
            label="Note"
            labelStyle={{color:theme.colors?.grey1}}
            multiline
            numberOfLines={2}
            onChangeText={(text) => setNote(text)}
          />
          
          <Button
            containerStyle={{ marginVertical: 8 }}
            buttonStyle={{ backgroundColor: theme.colors?.secondary }}
            title="Save"
            titleStyle={{color: theme.colors?.black}}
            onPress={handleSaveWeight}
            disabled={weightError.length > 0}
          />
          <Button
            containerStyle={{ marginVertical: 8 }}
            buttonStyle={{ backgroundColor: theme.colors?.grey3 }}
            title="Cancel"
            titleStyle={{color: theme.colors?.black}}
            onPress={handleClose}
          />
        </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  </Modal>
)}

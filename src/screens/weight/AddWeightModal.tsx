import { useState } from 'react';
import { Text, useTheme, Input, Button } from 'react-native-elements';
import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Modal } from 'react-native';


import { useStoreActions, useStoreState } from '../../store';
import type { Weight } from '../../store/weight';



export default function AddWeightModal({visible, closeFunc}:any) {
  const user = useStoreState((state) => state.auth.user)
  const saveWeight = useStoreActions((actions) => actions.weight.saveWeight)

  const { theme } = useTheme();

  const [weight, setWeight] = useState<string>("")
  const [note, setNote] = useState<string>("")

  function handleSaveWeight() {
    if (weight === "" || !Number(weight)) return
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
    setWeight("")
    setNote("")
    closeFunc()
  }


  return (
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback
          style={{width: "90%", backgroundColor: "red"}} 
          onPress={Keyboard.dismiss} 
          accessible={false}
        >
          <Modal
              style={{width: "90%", height: "70%"}}
              visible={visible}
              onDismiss={closeFunc}
            >
              <Text h3 style={{color: theme.colors?.white, textAlign: 'center', marginBottom: 8}}>Log your weight</Text>
              <Input 
                style={{color: theme.colors?.white}}
                label="Weight (kg)"
                placeholder="72.3"
                onChangeText={(text) => setWeight(text)}
              />
              <Input 
                style={{color: theme.colors?.white}}
                label="Note"
                placeholder="I ate a lot yesterday..."
                multiline
                numberOfLines={2}
                onChangeText={(text) => setNote(text)}
              />
              
              <Button
                containerStyle={{
                  marginVertical: 8,
                }}
                title="Save"
                onPress={handleSaveWeight}
              />
              <Button
                containerStyle={{
                  marginVertical: 8,
                }}
                title="Cancel"
                onPress={closeFunc}
              />
          </Modal>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
  )
}

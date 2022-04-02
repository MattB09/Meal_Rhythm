import { useState } from 'react';
import { Text, useTheme, Input, Button } from 'react-native-elements';
import { View, KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useStoreActions, useStoreState } from '../../store';
import type { Weight } from '../../store/weight';


type editWeightModalProps = {
  visible: boolean,
  closeFunc: () => void, 
  item: Weight
}


export default function EditWeightModal({visible, closeFunc, item}:editWeightModalProps) {
  const user = useStoreState((state) => state.auth.user)
  const saveWeight = useStoreActions((actions) => actions.weight.saveWeight)
  const deleteWeight = useStoreActions((actions) => actions.weight.deleteWeight)

  const { theme } = useTheme();

  const [weight, setWeight] = useState<string>(item.weight ? item.weight.toString() : "")
  const [weightError, setWeightError] = useState<string>("")
  const [note, setNote] = useState<string>(item.note || "")

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
    saveWeight({
      uid: user!.uid, 
      weight: {
        id: item.id,
        date: item.date,
        weight: Number(weight),
        note: actualNote
      },
      type: 'edit'
    });
    handleClose()
  }

  function handleDeleteWeight() {
    deleteWeight({uid: user!.uid, weightId: item.id})
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

          <View style={{width: "100%", flexDirection: "row"}}>
            <Icon name="close-circle-outline" size={30} color={theme.colors?.black} 
              onPress={handleClose} 
            />
            <Text h3 style={{color: theme.colors?.black, textAlign: 'center', marginBottom: 8, flexGrow: 2}}>Edit</Text>
            <Icon name="delete-circle-outline" size={30} color={theme.colors?.error} 
              onPress={handleDeleteWeight} 
            />
          </View>

          <Input 
            style={{color: theme.colors?.black}}
            label="Weight (kg)"
            labelStyle={{color:theme.colors?.grey1}}
            errorMessage={weightError}
            renderErrorMessage={weightError !== ""}
            onChangeText={(text) => handleUpdateWeight(text)}
            value={weight}
          />
          <Input 
            style={{color: theme.colors?.black}}
            label="Note"
            labelStyle={{color:theme.colors?.grey1}}
            multiline
            numberOfLines={2}
            onChangeText={(text) => setNote(text)}
            value={note}
          />
          
          <Button
            containerStyle={{ marginVertical: 8 }}
            buttonStyle={{ backgroundColor: theme.colors?.secondary }}
            title="Save"
            titleStyle={{color: theme.colors?.black}}
            onPress={handleSaveWeight}
            disabled={weightError.length > 0}
          />

        </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  </Modal>
)}
import { useState } from 'react';
import { Text, useTheme, Input, Button } from 'react-native-elements';
import { View, KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from 'react-native-root-toast';

import { useStoreActions, useStoreState } from '../../store';
import { dateIsInPast, displayTimeFromStr } from '../../helpers/timeHelpers'


export default function AddWeightModal({visible, closeFunc}:any) {
  const user = useStoreState((state) => state.auth.user)
  const saveWeight = useStoreActions((actions) => actions.weight.saveWeight)

  const { theme } = useTheme();

  const [weight, setWeight] = useState<string>("")
  const [weightError, setWeightError] = useState<string>("")
  const [date, setDate] = useState<string>(new Date().toLocaleString())
  const [DTPickerVisible, setDTPickerVisible] = useState<boolean>(false)
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
    let d = new Date(date)
    saveWeight({
      uid: user!.uid, 
      weight: {
        id: d.toUTCString(),
        date: d,
        weight: Number(weight),
        note: actualNote
      },
      type: 'save'
    });
    handleClose()
  }

  function handleClose() {
    setWeight("")
    setWeightError("")
    setNote("")
    setDate(new Date().toLocaleString())
    closeFunc()
  }

  function handleChangeDate(newDate: Date) {
    if (!dateIsInPast(newDate)) {
      Toast.show('Start date cannot be in the future...', {
        duration: Toast.durations.SHORT,
        position: 100,
        'backgroundColor': 'red'
      })
      return
    }
    setDate(newDate.toLocaleString())
    setDTPickerVisible(false)
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
            <Text h3 style={{color: theme.colors?.black, textAlign: 'center', marginBottom: 8, flexGrow: 2}}>Add Weight</Text>
          </View>

          <View style={{width: "100%", paddingHorizontal: 10, marginTop: 0, paddingTop: 0}}>
            <Text style={{color: theme.colors?.grey1, fontWeight: 'bold', fontSize:16, marginTop: 0, paddingTop: 0}}>Date</Text>
            <View style={{width: "100%", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
              <Text>{displayTimeFromStr(date)}</Text>
              <Button 
                containerStyle={{ width: 100 }}
                buttonStyle={{ backgroundColor: theme.colors?.grey2 }}
                titleStyle={{fontSize: 12}}
                title="Change Date"
                onPress={() => setDTPickerVisible(true)}
              />
            </View>
          </View>
          
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
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

    <DateTimePickerModal 
      isVisible={DTPickerVisible}
      mode="datetime"
      onConfirm={handleChangeDate}
      onCancel={() => setDTPickerVisible(false)}
      date={new Date(date)}
    />
  </Modal>
)}

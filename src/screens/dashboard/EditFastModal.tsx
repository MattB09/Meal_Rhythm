import { useState } from 'react';
import { Text, useTheme, Input, Button } from 'react-native-elements';
import { View, KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useStoreActions, useStoreState } from '../../store';
import type { Fast } from '../../store/fast';


type editFastModalProps = {
  visible: boolean,
  closeFunc: () => void,
  item: Fast
}


export default function EditFastModal({visible, closeFunc, item}: editFastModalProps) {

  const { theme } = useTheme();

  function handleClose() {
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
                // onPress={handleDeleteWeight} 
              />
            </View>

            <Button
              containerStyle={{ marginVertical: 8 }}
              buttonStyle={{ backgroundColor: theme.colors?.secondary }}
              title="Save"
              titleStyle={{color: theme.colors?.black}}
              // onPress={handleSaveWeight}
              // disabled={weightError.length > 0}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  )
}
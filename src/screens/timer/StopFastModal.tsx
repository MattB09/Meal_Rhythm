import { useState } from 'react';
import { Text, useTheme, Input, Button, BottomSheet } from 'react-native-elements';
import { View, KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useStoreActions, useStoreState } from '../../store';


type StopFastModalProps = {
  visible: boolean, 
  closeFunc: () => void,
  saveFunc: () => void,
  deleteFunc: () => void,
  openDP: (mode?: string, cb: () => void) => void,
}


export default function StopFastModal({visible, closeFunc, saveFunc, deleteFunc, openDP}: StopFastModalProps) {

  const { theme } = useTheme();

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
                onPress={closeFunc} 
              />
              <Text h3 style={{color: theme.colors?.black, textAlign: 'center', marginBottom: 8, flexGrow: 2}}>Edit</Text>
              <Icon name="delete-circle-outline" size={30} color={theme.colors?.error} 
                // onPress={handleDeleteWeight} 
              />
            </View>
            <Button 
              title="show DP"
              // onPress={() => openDP('end', () => )}
            />
          </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </Modal>
  )
}
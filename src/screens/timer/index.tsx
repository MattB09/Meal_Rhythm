import { useState, useEffect } from 'react';
import { useTheme, Text, LinearProgress, Button } from 'react-native-elements';
import { View } from 'react-native'
import { default as AS } from '@react-native-async-storage/async-storage';

import { useStoreState, useStoreActions } from '../../store';
import Progress from './Progress';


export default function TimerScreen() {
  const user = useStoreState((state) => state.auth.user)

  const { theme } = useTheme()

  const [start, setStart] = useState<Date|null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    checkExistingStart()
  }, [])

  async function checkExistingStart() {
    try {
      let existing: string|null = await AS.getItem(`start_${user!.uid}`)
      if (!existing || JSON.parse(existing) == null) return

      let existingDate: Date = new Date(JSON.parse(existing))
      setStart(existingDate)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  function handleStartFast() {
    // set the start time and save in local storage
    const d: Date = new Date();
    setStart(d)
    saveStart(d)
  }

  function saveStart(startTime: Date) {

  }

  function handleEndFast() {
    setStart(null)
  }


  if (loading) {
    return (<LinearProgress style={{marginHorizontal: 16, height: 24, width: "90%"}}/>)
  } else {
    return (
      <View style={{flex: 1, alignItems: 'center', paddingHorizontal: 8}}>

        <Text h1 style={{textAlign: 'center'}}>Timer</Text>

        <Progress start={start} target={16} />

        { !start 
          ? <Button
            containerStyle={{ marginVertical: 8, width: "100%" }}
            buttonStyle={{ backgroundColor: theme.colors?.primary }}
            title="Begin fasting"
            titleStyle={{color: theme.colors?.black}}
            onPress={handleStartFast}
          />
        : <Button
            containerStyle={{ marginVertical: 8, width: "100%" }}
            buttonStyle={{ backgroundColor: theme.colors?.primary }}
            title="Stop fasting"
            titleStyle={{color: theme.colors?.black}}
            onPress={handleEndFast}
          />
        }

      </View>
    )
  }
}



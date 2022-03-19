import { useState, useEffect } from 'react';
import { useTheme, Text, LinearProgress, Button, Badge } from 'react-native-elements';
import { View } from 'react-native'
import { default as AS } from '@react-native-async-storage/async-storage';

import { useStoreState, useStoreActions } from '../../store';
import Progress from './Progress';
import { calculateElapsedSeconds } from '../../helpers/timeHelpers';
import { action } from 'easy-peasy';


export default function TimerScreen() {
  const user = useStoreState((state) => state.auth.user)
  const saveFastAction = useStoreActions((actions) => actions.fast.saveFast)

  const { theme } = useTheme()

  const [start, setStart] = useState<Date|null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    checkExistingStart()
  }, [])

  async function checkExistingStart() {
    try {
      let existing: string|null = await AS.getItem(`start_${user!.uid}`)
      if (!existing || existing == null) return

      let existingDate: Date = new Date(existing)
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

  async function saveStart(startTime: null|Date) {
    try {
      const startStr: string = startTime ? startTime.toUTCString() : 'null'
      await AS.setItem(`start_${user!.uid}`, startStr)
    } catch (e) {
      console.log(e)
    }
  }

  function handleEndFast() {
    const endTime: Date = new Date()
    const elapsedSeconds = calculateElapsedSeconds(start!, endTime)
    saveFast(endTime, elapsedSeconds)
    setStart(null)
    saveStart(null)
  }

  async function saveFast(endTime: Date, elapsedSeconds: number): Promise<void> {
    try {
      saveFastAction({
        uid: user!.uid,
        fast: {
          id: start!.toUTCString(),
          startTime: start!,
          endTime,
          elapsedSeconds,
          feeling: null,
          note: null,
        },
        type: 'save'
        },
      )
    } catch (e) {
      console.log(e)
    }
  }


  if (loading) {
    return (<LinearProgress style={{marginHorizontal: 16, height: 24, width: "90%"}}/>)
  } else {
    return (
      <View style={{flex: 1, alignItems: 'center', paddingHorizontal: 8}}>

        <Text h1 style={{textAlign: 'center'}}>Timer</Text>

        <Progress start={start} target={18} />

        { !start 
          ? <Button
            containerStyle={{ marginVertical: 8, width: "90%" }}
            buttonStyle={{ backgroundColor: theme.colors?.primary }}
            title="Begin fasting"
            titleStyle={{color: theme.colors?.black}}
            onPress={handleStartFast}
          />
        : <>
            <Badge
              badgeStyle={{backgroundColor: theme.colors?.grey2, paddingVertical: 4, paddingHorizontal: 16, height: 'auto', borderColor: theme.colors?.grey2, borderRadius: 30}}
              containerStyle={{ marginBottom: 16,}}
              value="18 hour fast"
              textStyle={{ fontSize: 15 }}
            />
            <Button
              containerStyle={{ marginVertical: 8, width: "90%" }}
              buttonStyle={{ backgroundColor: theme.colors?.primary }}
              title="Stop fasting"
              titleStyle={{color: theme.colors?.black}}
              onPress={handleEndFast}
            />
          </>
        }

      </View>
    )
  }
}



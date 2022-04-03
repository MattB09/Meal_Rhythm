import { useState, useEffect } from 'react';
import { useTheme, Text, LinearProgress, Button, Badge } from 'react-native-elements';
import { ScrollView, View } from 'react-native'
import { default as AS } from '@react-native-async-storage/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { useStoreState, useStoreActions } from '../../store';
import Progress from './Progress';
import { calculateElapsedSeconds, displayTime, calculateTargetEndTime } from '../../helpers/timeHelpers';
// import StopFastModal from './StopFastModal';


export default function TimerScreen() {
  const user = useStoreState((state) => state.auth.user)
  const saveFastAction = useStoreActions((actions) => actions.fast.saveFast)

  const { theme } = useTheme()

  const [start, setStart] = useState<Date|null>(null)
  const [end, setEnd] = useState<Date|null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [dpVisible, setDpVisible] = useState<boolean>(false)
  const [dpMode, setDpMode] = useState<string>('start')
  const [stopVisible, setStopVisible] = useState<boolean>(false)

  useEffect(() => {
    checkExistingStart()
  }, [])

  useEffect(() => {
    if (start) {
      setEnd(calculateTargetEndTime(start, 18))
    } else {
      setEnd(null)
    }
  }, [start])

  async function checkExistingStart() {
    try {
      let existing: string|null = await AS.getItem(`start_${user!.uid}`)
      if (!existing || existing == null) {
        setStart(null)
        return
      }

      let existingDate: Date = new Date(existing)
      setStart(existingDate)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  function handleStartFast(d=new Date()) {
    // set the start time and save in local storage
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

  // function handleShowDpModal(mode='start') {
  //   console.log('clicked', mode, dpMode, dpVisible)
  //   setDpMode(mode)
  //   setDpVisible(true)
  // }

  function handleStartChanged(newStart: Date) {
    handleStartFast(newStart)
    setDpVisible(false)
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
      <View style={{flex: 1}}>

        <Text h1 style={{textAlign: 'center'}}>Timer</Text>
        
        <DateTimePickerModal 
          isVisible={dpVisible}
          mode="datetime"
          onConfirm={handleStartChanged}
          onCancel={() => setDpVisible(false)}
          date={dpMode == 'start' ? start! : end!}
          onHide={() => setDpVisible(false)}
        />

        {/* <StopFastModal 
          visible={stopVisible} 
          closeFunc={() => setStopVisible(false)}
          saveFunc={() => null}
          deleteFunc={() => null}
          openDP={() => handleShowDpModal()}
        /> */}

        <ScrollView style={{flex: 1}} contentContainerStyle={{alignItems: 'center', paddingHorizontal: 8, paddingBottom: 24}}>

          <Progress start={start} target={18} />

          { !start || !end
            ? <Button
              containerStyle={{ marginVertical: 8, width: "90%" }}
              buttonStyle={{ backgroundColor: theme.colors?.primary }}
              title="Begin fasting"
              titleStyle={{color: theme.colors?.black}}
              onPress={() => handleStartFast()}
            />
          : <>
              <Badge
                badgeStyle={{backgroundColor: theme.colors?.grey2, paddingVertical: 4, paddingHorizontal: 16, height: 'auto', borderColor: theme.colors?.grey2, borderRadius: 30}}
                containerStyle={{ marginTop: 0, marginBottom: 32,}}
                value="18 hour fast"
                textStyle={{ fontSize: 20 }}
              />

              <View style={{width: "100%", flexDirection: "row", justifyContent: 'space-around', marginBottom: 24}}>
                <View style={{ alignItems: 'center'}}>
                  <Text>Start</Text>
                  <Text>{displayTime(start)}</Text>
                  <Button
                    containerStyle={{ marginTop: 8, width: 64 }}
                    buttonStyle={{ backgroundColor: theme.colors?.grey2}}
                    title="Edit"
                    titleStyle={{fontSize: 12}}
                    onPress={() => setDpVisible(true)}
                  />
                </View>

                <View style={{ alignItems: 'center'}}>
                  <Text>End</Text>
                  <Text>{displayTime(end)}</Text>
                </View>

              </View>

              <Button
                containerStyle={{ width: "90%" }}
                buttonStyle={{ backgroundColor: theme.colors?.primary }}
                title="Stop fasting"
                titleStyle={{color: theme.colors?.black}}
                // onPress={() => setStopVisible(true)}
                onPress={handleEndFast}
              />
            </>
          }

        </ScrollView>
      </View>
    )
  }
}



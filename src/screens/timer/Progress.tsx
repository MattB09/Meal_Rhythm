import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements'

import { displayElapsed, calculateElapsedSeconds } from '../../helpers/timeHelpers'


export type ProgressProps = {
  start: Date | null;
  target: number;
}


export default function Progress({start, target}: ProgressProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)

  let id: any

  useEffect(() => {
    if (start) {
      const seconds = calculateElapsedSeconds(start)
      setElapsedSeconds(seconds)
      if (id) return

      id = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev % 60 === 0) {
            return calculateElapsedSeconds(start)
          }
          return prev + 1
        })
      }, 1000)
    } else {
      setElapsedSeconds(0)
      if (!id) return
      clearInterval(id)
    }

    return () => {
      if (!id) return
      clearInterval(id)
    }
  }, [start, target])

  return (
    <View style={{width: '100%'}}>
      <Text h4>{ displayElapsed(elapsedSeconds) }</Text>
    </View>
  )
}


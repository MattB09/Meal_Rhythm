import { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-elements'
import { VictoryPie, VictoryLabel } from 'victory-native';
import { Svg } from 'react-native-svg'

import { displayElapsed, calculateElapsedSeconds } from '../../helpers/timeHelpers'


export type ProgressProps = {
  start: Date | null;
  target: number;
}


export default function Progress({start, target}: ProgressProps) {
  const { theme } = useTheme()
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)
  const [ data, setData ] = useState<any>([
    {x: 1, y: 0},
    {x: 2, y: 100}
  ])

  const screenWidth = Dimensions.get('window').width
  const screenHeight = Dimensions.get('window').height
  let id: any

  useEffect(() => {
    if (start) {
      const seconds = calculateElapsedSeconds(start)
      let percent = (seconds / (target * 3600) * 100)
      setElapsedSeconds(seconds)
      setData([
        {x: 1, y: percent},
        {x: 2, y: 100-percent}
      ])
      if (id) return

      id = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev % 3 === 0) {
            return calculateElapsedSeconds(start)
          }
          let percent = (prev / (target * 3600) * 100)
          setData([
            {x: 1, y: percent},
            {x: 2, y: 100-percent}
          ])
          return prev + 1
        })
      }, 1000)
    } else {
      setElapsedSeconds(0)
      setData([
        {x: 1, y: 0},
        {x: 2, y: 100}
      ])
      if (!id) return
      clearInterval(id)
    }

    return () => {
      if (!id) return
      clearInterval(id)
    }
  }, [start, target])

  return (
    <View style={{width: '100%', padding: 8, alignItems: 'center', paddingBottom: 0}}>
      <Svg
        height={screenHeight / 2}
        width={screenWidth}
        viewBox={`0 0 ${screenWidth} ${screenHeight / 2}`}
      >
        <VictoryPie
          standalone={false}
          style={{
            data: { fill: ({datum}) => {
              return theme.colors!.grey5!
            }}
          }}
          radius={(datum) => screenWidth / 2.2}
          innerRadius={screenWidth / 3}
          labels={() => null}
          data={[{x: 1, y:100}]}
        />
        <VictoryPie
          standalone={false}
          style={{
            data: { fill: ({datum}) => {
              return datum.x === 1 ? theme.colors!.secondary! : 'transparent'
            }}
          }}
          radius={(datum) => screenWidth / 2.2}
          innerRadius={screenWidth / 3}
          cornerRadius={({datum}) => {
            return datum.x === 1 ? 25 : -25
          }}
          labels={() => null}
          data={data}
        />
        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={screenWidth/2} y={(screenHeight/4) -15}
          style={{fill: theme.colors?.black, fontSize: 40}}
          text={elapsedSeconds ? displayElapsed(elapsedSeconds) : displayElapsed(0)}
        />
      </Svg>
    </View>
  )
}


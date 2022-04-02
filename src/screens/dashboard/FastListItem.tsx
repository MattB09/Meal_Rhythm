import { ListItem, Text, useTheme } from 'react-native-elements';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import type { Fast } from '../../store/fast';
import { displayTime, displayElapsed } from '../../helpers/timeHelpers'


type FastListItemProps = {
  item: Fast,
  index: number,
  setItem: (ind:number) => void,
}


export default function WeightListItem({item, index, setItem}:FastListItemProps) {
  const { theme } = useTheme();

  return (
    <ListItem 
      containerStyle={{backgroundColor: theme.colors?.grey5, borderRadius: 10, marginBottom: 8, width: "100%"}}>
      <ListItem.Content>
        <ListItem.Title><Text>Duration: { displayElapsed(item.elapsedSeconds) }</Text></ListItem.Title>
        <ListItem.Subtitle>Start: { displayTime(item.startTime) }</ListItem.Subtitle>
        <ListItem.Subtitle>End: { displayTime(item.endTime) }</ListItem.Subtitle>
        { item.note && <ListItem.Subtitle><Text>{item.note}</Text></ListItem.Subtitle>}
      </ListItem.Content>
      <Icon name="pencil-circle" size={30} color={theme.colors?.grey2} onPress={() => setItem(index)}/>
    </ListItem>
  )
}

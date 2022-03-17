import { ListItem, Text, useTheme, Button } from 'react-native-elements';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import type { Weight } from '../../store/weight';


type WeightListItemProps = {
  item: Weight
}


export default function WeightListItem({item}:WeightListItemProps) {
  const { theme } = useTheme();

  return (
    <ListItem 
      containerStyle={{backgroundColor: theme.colors?.grey5, borderRadius: 10, marginBottom: 8, width: "100%"}}>
      <ListItem.Content>
        <ListItem.Title><Text>{item.weight}</Text></ListItem.Title>
        <ListItem.Subtitle>{item.date.toLocaleDateString()}</ListItem.Subtitle>
        { item.note && <ListItem.Subtitle><Text>{item.note}</Text></ListItem.Subtitle>}
      </ListItem.Content>
      <Icon name="pencil-circle" size={30} color={theme.colors?.grey2} />
    </ListItem>
  )
}

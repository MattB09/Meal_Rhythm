import { useEffect } from 'react';
import { Text, FAB, useTheme } from 'react-native-elements';
import { View, FlatList, ScrollView } from 'react-native';

import { useStoreActions, useStoreState } from '../../store';
import WeightListItem from './WeightListItem';
import type { Weight } from '../../store/weight';


export default function WeightScreen() {
  const user = useStoreState((state) => state.auth.user)
  const weightList = useStoreState((state) => state.weight.weightList)
  const fetching = useStoreState((state) => state.weight.fetchingWeight)
  const fetchWeights = useStoreActions((actions) => actions.weight.fetchWeights)
  const saveWeight = useStoreActions((actions) => actions.weight.saveWeight)

  const { theme } = useTheme();


  useEffect(() => {
    fetchWeights(user!.uid)
  }, [])

  function handleRefresh() {
    fetchWeights(user!.uid)
  }

  function handleSaveWeight() {
    let d = new Date()
    saveWeight({
      uid: user!.uid, 
      weight: {
        id: d.toUTCString(),
        date: d,
        weight: 66.7,
        note: "I ate a lot!"
      }
    });
  }

  
  return (
    <View style={{flex: 1, width: "100%", paddingHorizontal: 8}}>
      <Text h1 style={{textAlign: 'center', marginBottom: 16}}>Weight</Text>
      <View style={{height: "60%"}}>
        <FlatList
          data={weightList}
          renderItem={(item: any) => <WeightListItem item={item.item} />} 
          keyExtractor={(item) => item.id}
          style={{flex: 1}}
          onRefresh={handleRefresh}
          refreshing={fetching}
          ListEmptyComponent={<Text>You haven't recorded your weight yet. Click the plus button in the bottom right to get started!</Text>}
        />
      </View>
      <ScrollView style={{height: "80%"}}>
        <Text>This is where the analytics will go</Text>
      </ScrollView>
      <FAB
        visible
        placement="right"
        icon={{ name: 'add', color: 'white' }}
        color={theme.colors?.primary}
        onPress={handleSaveWeight}
      />

    </View>
  )
}
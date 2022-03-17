import { useEffect, useState } from 'react';
import { Text, FAB, useTheme, Overlay, Input, Button, ButtonGroup } from 'react-native-elements';
import { View, FlatList } from 'react-native';

import { useStoreActions, useStoreState } from '../../store';
import WeightListItem from './WeightListItem';
import type { Weight } from '../../store/weight';
import AddWeightModal from './AddWeightModal';


export default function WeightScreen() {
  const user = useStoreState((state) => state.auth.user)
  const weightList = useStoreState((state) => state.weight.weightList)
  const fetching = useStoreState((state) => state.weight.fetchingWeight)
  const fetchWeights = useStoreActions((actions) => actions.weight.fetchWeights)


  const { theme } = useTheme();

  const [weights, setWeights] = useState<Weight[]>([])
  const [addVisible, setAddVisible] = useState<boolean>(false)

  useEffect(() => {
    fetchWeights(user!.uid)
  }, [])

  useEffect(()=> {
    setWeights(weightList)
  }, [weightList])

  function handleRefresh() {
    fetchWeights(user!.uid)
  }

  function handleOpenAddModal() {
    setAddVisible(true)
  }

  function handleCloseAddModal() {
    setAddVisible(false)
  }
  
  return (
    <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 8}}>
      <Text h1 style={{textAlign: 'center', marginBottom: 16}}>Weight</Text>

      <FlatList
        data={weights}
        renderItem={({item}) => (
          <WeightListItem item={item} />
        )} 
        keyExtractor={item => item.id}
        extraData={weights}
        onRefresh={handleRefresh}
        refreshing={fetching}
        ListEmptyComponent={<Text>You haven't recorded your weight yet. Click the plus button in the bottom right to get started!</Text>}
      />

      <AddWeightModal visible={addVisible} closeFunc={handleCloseAddModal}/>

      <FAB
        visible
        placement="right"
        icon={{ name: 'add', color: 'white' }}
        color={theme.colors?.primary}
        onPress={handleOpenAddModal}
      />

    </View>
  )
}
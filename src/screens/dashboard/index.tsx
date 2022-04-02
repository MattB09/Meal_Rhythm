import { useEffect, useState } from 'react'
import { Text, useTheme, Button } from 'react-native-elements';
import { View, FlatList } from 'react-native';

import { useStoreActions, useStoreState } from '../../store';
import { Fast } from '../../store/fast';
import FastListItem from './FastListItem';
import EditFastModal from './EditFastModal';


export default function DashboardScreen() {
  const user = useStoreState((state) => state.auth.user)
  const fastList = useStoreState((state) => state.fast.fastList)
  const fetching = useStoreState((state) => state.fast.fetchingFast)
  const fetchFasts = useStoreActions((actions) => actions.fast.fetchFasts)
  const signOut = useStoreActions((actions) => actions.auth.signOut)

  const { theme } = useTheme()

  const [fasts, setFasts] = useState<Fast[]>([]) 
  const [editVisible, setEditVisible] = useState<boolean>(false)
  const [editItem, setEditItem] = useState<number>(-1)

  useEffect(() => {
    handleRefresh()
  }, [])

  useEffect(() => {
    setFasts(fastList)
  }, [fastList])

  function handleRefresh() {
    fetchFasts(user!.uid)
  }

  function handleSignOut() {
    signOut(null)
  }

  function setItem(ind: number) {
    setEditItem(ind)
    setEditVisible(true)
  }

  function handleCloseEditModal() {
    setEditItem(-1)
    setEditVisible(false)
  }
  
  return (
    <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 8}}>
      <Text h1 style={{textAlign: 'center', marginBottom: 16}}>Weight</Text>

      <FlatList
        data={fasts}
        renderItem={({item, index}) => (
          <FastListItem item={item} index={index} setItem={setItem} />
        )} 
        keyExtractor={item => item.id}
        extraData={fasts}
        onRefresh={handleRefresh}
        refreshing={fetching}
        ListEmptyComponent={<Text>You haven't recorded your weight yet. Click the plus button in the bottom right to get started!</Text>}
      />

      { editItem >= 0 
        ? <EditFastModal visible={editVisible} closeFunc={handleCloseEditModal} item={fasts[editItem]} />
        : null
      }

      <Button 
        title="Sign Out"
        onPress={handleSignOut}
      />
    </View>
  )
}
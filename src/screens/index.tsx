import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Tab, Text, TabView, useTheme } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Navigator() {
  const [index, setIndex] = useState<number>(0);
  const { theme } = useTheme()

  const tabContainerStyles = {
    backgroundColor: theme.colors?.white,
    paddingHorizontal: 0
  }

  const tabTitleStyles = {
    fontSize: 12, 
    paddingHorizontal: 0,
    color: theme.colors?.black
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors?.white }}>

      <TabView value={index} onChange={setIndex} animationType='spring'>

        <TabView.Item style={{ width: "100%" }}>
            <Text h1 style={styles.header}>Timer</Text>
        </TabView.Item>

        <TabView.Item style={{ width: "100%" }}>
            <Text h1 style={styles.header}>Plans</Text>
        </TabView.Item>

        <TabView.Item style={{ width: "100%" }}>
            <Text h1 style={styles.header}>Weight</Text>
        </TabView.Item>

        <TabView.Item style={{ width: "100%" }}>
            <Text h1 style={styles.header}>Dashboard</Text>
        </TabView.Item>

      </TabView>

      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: theme.colors?.secondary,
          height: 5,
        }}
        variant="primary"
      >

        <Tab.Item 
          title='Timer'
          titleStyle={tabTitleStyles}
          containerStyle={tabContainerStyles}
          icon={{ name: 'timer', type: 'ionicon'}}
        />

        <Tab.Item 
          title='Plans'
          titleStyle={tabTitleStyles}
          containerStyle={tabContainerStyles}
          icon={{ name: 'playlist-edit', type: 'material-community'}}
        />

        <Tab.Item 
          title='Weight'
          titleStyle={tabTitleStyles}
          containerStyle={tabContainerStyles}
          icon={{ name: 'scale-bathroom', type: 'material-community'}}
        />

        <Tab.Item 
          title='Dashboard'
          titleStyle={tabTitleStyles}
          containerStyle={tabContainerStyles}
          icon={{ name: 'poll', type: 'material-community'}}
        />

      </Tab>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    textAlign: 'center'
  }
})
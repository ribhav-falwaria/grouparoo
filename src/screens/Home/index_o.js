import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { Tab, TabBar } from '@ui-kitten/components'
import { TrainingsListScreen } from './traininig-list.component'

const TrainingsTabBar = ({ navigation, state }) => {
  const onTabSelect = index => {
    navigation.navigate(state.routeNames[index])
  }

  const renderTab = route => <Tab key={route} title={route.toUpperCase()} />

  return (
    <TabBar selectedIndex={state.index} onSelect={onTabSelect}>
      {state.routeNames.map(renderTab)}
    </TabBar>
  )
}

const TopTab = createMaterialTopTabNavigator()

export default () => (
  <TopTab.Navigator tabBar={props => <TrainingsTabBar {...props} />}>
    <TopTab.Screen name='Easy' component={TrainingsListScreen} />
    <TopTab.Screen name='Middle' component={TrainingsListScreen} />
    <TopTab.Screen name='Hard' component={TrainingsListScreen} />
  </TopTab.Navigator>
)

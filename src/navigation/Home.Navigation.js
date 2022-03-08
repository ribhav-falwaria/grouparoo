import React, { useContext } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'

import Drawer from './Drawer.Navigation'
import RootBottomNavigation from './Bottom.Navigation'
import { LocalizationContext } from '../components/Translation'
import {
  HomeDrawerNavigationScreens,
  BottomNavigationScreens,
  HomeNavigationScreens
} from '../screens/NavigationScreens'
import { HomeIcon } from '../screens/components/ThemedIcons'
const HomeDrawer = createDrawerNavigator()
const BottomTab = createBottomTabNavigator()
const HomeStack = createStackNavigator()
const BOTTOM_STACKS = [
  'HomeStack'
]
const TabBarVisibilityOptions = ({ navigation, route }) => {
  const isBottomRoute = BOTTOM_STACKS.indexOf(route.name) > -1
  return { tabBarVisible: isBottomRoute }
}

const HomeStackNavigation = () => {
  const { homeNavigations } = HomeNavigationScreens({})
  return (
    <HomeStack.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animationEnabled: false
      }}
    >
      {homeNavigations.map((screen, ix) => (
        <HomeStack.Screen
          key={`bottom-${ix}`}
          name={screen.name}
          component={screen.Component}
          options={{
            title: screen.title,
            Icon: screen.Icon,
            ...screen.options
          }}
        />
      ))}
    </HomeStack.Navigator>
  )
}

const HomeTabsNavigator = () => {
  const { bottomNavigations, initialRouteName } = BottomNavigationScreens({})
  return (
    <BottomTab.Navigator
      screenOptions={TabBarVisibilityOptions}
      initialRouteName={initialRouteName}
      tabBar={props => <RootBottomNavigation {...props} bottomNavigations={bottomNavigations} />}
    >
      <BottomTab.Screen name='HomeStack' component={HomeStackNavigation} />

    </BottomTab.Navigator>
  )
}

const HomeNavigator = () => {
  const { drawerNavigations, initialRouteName } = HomeDrawerNavigationScreens({})
  const { translations } = useContext(LocalizationContext)
  // Just show the dummy screen for permissions.
  drawerNavigations.unshift({
    name: 'Home',
    title: 'home.title',
    drawerTitle: 'home.title',
    Component: HomeTabsNavigator,
    Icon: HomeIcon
  })
  return (
    <HomeDrawer.Navigator
      screenOptions={{ gestureEnabled: false }}
      initialRouteName={initialRouteName}
      drawerContent={props => (
        <Drawer {...props} navigationData={drawerNavigations} />
      )}
    >
      {drawerNavigations.map((screen, ix) => (
        <HomeDrawer.Screen
          key={`drawer-${ix}`}
          name={screen.name}
          component={screen.Component}
          options={{
            title: screen.title,
            Icon: screen.Icon,
            ...screen.options
          }}
        />
      ))}
    </HomeDrawer.Navigator>
  )
}

export default HomeNavigator

import * as React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Drawer from './Drawer.Navigation'
import RootBottomNavigation from './Bottom.Navigation'
import {
  HomeDrawerNavigationScreens,
  BottomNavigationScreens
} from '../screens/NavigationScreens'
import { HomeIcon } from '../screens/components/ThemedIcons'
const HomeDrawer = createDrawerNavigator()
const BottomTab = createBottomTabNavigator()

const TabBarVisibilityOptions = ({ route }) => {
  const isNestedRoute = route.state?.index > 0
  return { tabBarVisible: !isNestedRoute }
}

const HomeTabsNavigator = () => {
  const { bottomNavigations, initialRouteName } = BottomNavigationScreens({})
  return (
    <BottomTab.Navigator
      screenOptions={TabBarVisibilityOptions}
      initialRouteName={initialRouteName}
      tabBar={props => <RootBottomNavigation {...props} bottomNavigations={bottomNavigations} />}
    >
      {bottomNavigations.map((screen, ix) => (
        <BottomTab.Screen
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
    </BottomTab.Navigator>
  )
}

const HomeNavigator = () => {
  const { drawerNavigations, initialRouteName } = HomeDrawerNavigationScreens({})
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

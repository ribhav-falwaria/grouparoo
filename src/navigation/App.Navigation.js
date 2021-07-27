import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { StatusBar } from 'react-native'
import { useTheme } from '@ui-kitten/components'
import { navigationRef } from './NavigationService'
import AuthNavigator from './Auth.Navigation'
import HomeNavigator from './Home.Navigation'
const Stack = createStackNavigator()

const AppNavigator = props => {
  const isLoggedIn = useSelector(state => state.authentication.isLoggedIn)
  const theme = useTheme()
  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar
        animated
        backgroundColor={theme['background-basic-color-1']}
        barStyle='dark-content'
        showHideTransition='none'
        hidden={false}
      />
      <Stack.Navigator headerMode='none'>
        {isLoggedIn === true && (
          <Stack.Screen
            name='Home'
            component={HomeNavigator}
            options={{}}
          />
        )}
        {isLoggedIn === false && (
          <Stack.Screen
            name='Authentication'
            component={AuthNavigator}
            options={{
              // When logging out, a pop animation feels intuitive
              // You can remove this if you want the default 'push' animation
              animationTypeForReplace: isLoggedIn ? 'push' : 'pop'
              // headerRight: () => <ThemeController />
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator

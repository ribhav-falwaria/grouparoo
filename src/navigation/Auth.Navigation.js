import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTheme } from '@ui-kitten/components'
import { AuthNavigationScreens } from '../screens/NavigationScreens'
import { LocalizationContext } from '../components/Translation'
const AuthStack = createStackNavigator()

// When logging out, a pop animation feels intuitive
// You can remove this if you want the default 'push' animation

const AuthNavigator = () => {
  const { translations } = useContext(LocalizationContext)
  const theme = useTheme()
  const isLoggedIn = useSelector(state => state.authentication.isLoggedIn)
  const { authNavigations, initialRouteName } = AuthNavigationScreens()
  return (
    <AuthStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme['background-basic-color-4'],
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0 // remove shadow on iOS

        },
        headerTintColor: theme['color-primary-500'],
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
    >
      {authNavigations.map((screen, ix) => (
        <AuthStack.Screen
          key={`auth-${ix}`}
          name={screen.name}
          component={screen.Component}
          options={{
            animationTypeForReplace: isLoggedIn ? 'push' : 'pop',
            title: translations[screen.title]
          }}
        />
      ))}
    </AuthStack.Navigator>
  )
}

export default AuthNavigator

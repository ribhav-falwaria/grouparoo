import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { StatusBar } from 'react-native'
import { useTheme } from '@ui-kitten/components'
import { navigationRef } from './NavigationService'
import AuthNavigator from './Auth.Navigation'
import HomeNavigator from './Home.Navigation'
import OnboardNavigator from './Onboard.Navigation'
import LoadingSpinner from '../screens/components/LoadingSpinner'
const Stack = createStackNavigator()
const AppNavigator = props => {
  const {
    isLoggedIn,
    hasActiveLoan,
    isPermissionsRequested,
    loading,
    isFirstTime,
    isAllPermissionsValid
  } = props
  const theme = useTheme()
  if (props.loading || loading) {
    return <LoadingSpinner />
  }
  // FIXME: Hack to get loan data
  const isOnboarding = (hasActiveLoan === false || isPermissionsRequested === false)
  const screenProps = {
    isLoggedIn,
    isPermissionsRequested,
    loading,
    isFirstTime,
    isAllPermissionsValid,
    isOnboarding
  }
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
        {
          isLoggedIn === true && isOnboarding === true && (
            <Stack.Screen
              name='Onboarding'
              options={{}}
              screenProps={screenProps}
            >
              {(props) => <OnboardNavigator screenProps={screenProps} {...props} />}
            </Stack.Screen>
          )
        }
        {isLoggedIn === true && isOnboarding === false && (
          <Stack.Screen
            name='Home'
            options={{}}
            screenProps={screenProps}
          >
            {(props) => <HomeNavigator screenProps={screenProps} {...props} />}
          </Stack.Screen>
        )}
        {isLoggedIn === false && (
          <Stack.Screen
            name='Authentication'
            options={{
              // When logging out, a pop animation feels intuitive
              // You can remove this if you want the default 'push' animation
              animationTypeForReplace: isLoggedIn ? 'push' : 'pop'
              // headerRight: () => <ThemeController />
            }}
          >
            {(props) => <AuthNavigator screenProps={screenProps} {...props} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator

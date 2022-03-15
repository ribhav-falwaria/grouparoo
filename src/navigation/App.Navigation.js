import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "react-native";
import { useTheme } from "@ui-kitten/components";
import { navigationRef } from "./NavigationService";
import AuthNavigator from "./Auth.Navigation";
import HomeNavigator from "./Home.Navigation";
import OnboardNavigator from "./Onboard.Navigation";
import LoadingSpinner from "../screens/components/LoadingSpinner";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";
const Stack = createStackNavigator();
const AppNavigator = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " AppNavigator method starts here",
      { props },
      "AppNavigator()",
      "App.Navigation.js"
    )
  );
  const {
    isLoggedIn,
    hasActiveLoan,
    isPermissionsRequested,
    loading,
    isFirstTime,
    isAllPermissionsValid,
  } = props;
  const theme = useTheme();
  if (props.loading || loading) {
    return <LoadingSpinner />;
  }
  // FIXME: Hack to get loan data
  const isOnboarding = false; //(hasActiveLoan === false || isPermissionsRequested === false)
  const screenProps = {
    isLoggedIn,
    isPermissionsRequested,
    loading,
    isFirstTime,
    isAllPermissionsValid,
    isOnboarding,
  };
  const isHome = isLoggedIn === true && isOnboarding === false;
  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar
        animated
        backgroundColor={
          isHome
            ? theme["background-basic-color-2"]
            : theme["background-basic-color-1"]
        }
        barStyle="dark-content"
        showHideTransition="none"
        hidden={false}
      />
      <Stack.Navigator
        headerMode="none"
        screenOptions={{
          gestureEnabled: false,
          animationEnabled: false,
        }}
      >
        {isLoggedIn === true && isOnboarding === true && (
          <Stack.Screen
            name="Onboarding"
            options={{}}
            screenProps={screenProps}
          >
            {(props) => (
              <OnboardNavigator screenProps={screenProps} {...props} />
            )}
          </Stack.Screen>
        )}
        {isHome && (
          <Stack.Screen name="Home" options={{}} screenProps={screenProps}>
            {(props) => <HomeNavigator screenProps={screenProps} {...props} />}
          </Stack.Screen>
        )}
        {isLoggedIn === false && (
          <Stack.Screen
            name="Authentication"
            options={{
              // When logging out, a pop animation feels intuitive
              // You can remove this if you want the default 'push' animation
              animationTypeForReplace: isLoggedIn ? "push" : "pop",
              // headerRight: () => <ThemeController />
            }}
          >
            {(props) => <AuthNavigator screenProps={screenProps} {...props} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

import React, { useContext } from "react";
import { useRequest } from "ahooks";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthNavigationScreens } from "../screens/NavigationScreens";
import { LocalizationContext } from "../components/Translation";
import LoadingSpinner from "../screens/components/LoadingSpinner";
import { AppStorage } from "../services/app-storage.service";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";
const AuthStack = createStackNavigator();
const shouldShowIntroScreen = async () => {
  crashlytics().log(
    ErrorUtil.createLog(
      " shouldShowIntroScreen method starts here",
      undefined,
      "shouldShowIntroScreen()",
      "Auth.Navigation.js"
    )
  );
  const showIntroScreen = await AppStorage.toggleIntroScreen();
  return { showIntroScreen };
};
// When logging out, a pop animation feels intuitive
// You can remove this if you want the default 'push' animation

const AuthNavigator = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " AuthNavigator method starts here",
      { props },
      "AuthNavigator()",
      "Auth.Navigation.js"
    )
  );
  const {
    screenProps: { isFirstTime },
  } = props;
  const { translations } = useContext(LocalizationContext);
  const { data, loading } = useRequest(shouldShowIntroScreen);
  if (props.loading || loading) {
    return <LoadingSpinner />;
  }
  const { authNavigations, initialRouteName } = AuthNavigationScreens({
    isFirstTime,
    showIntroScreen: data.showIntroScreen,
  });
  return (
    <AuthStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animationEnabled: false,
        // headerStyle: {
        //   backgroundColor: theme['background-basic-color-1'],
        //   elevation: 0, // remove shadow on Android
        //   shadowOpacity: 0 // remove shadow on iOS

        // },
        // headerTintColor: theme['color-primary-500'],
        // headerTitleStyle: {
        //   fontWeight: 'bold'
        // }
      }}
    >
      {authNavigations.map((screen, ix) => (
        <AuthStack.Screen
          key={`auth-${ix}`}
          name={screen.name}
          component={screen.Component}
          initialParams={{ title: translations[screen.title] }}
          options={{
            animationTypeForReplace: "push",
            title: translations[screen.title],
          }}
        />
      ))}
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;

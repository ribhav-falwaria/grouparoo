import React, { useContext } from "react";
import { View, BackHandler } from "react-native";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";
import {
  StyleService,
  useStyleSheet,
  Text,
  Button,
  TopNavigation,
  TopNavigationAction,
  Icon,
} from "@ui-kitten/components";
import { openSettings } from "react-native-permissions";

import { LocalizationContext } from "../../components/Translation";
import styleConstants from "../styleConstants";

const ProvidePermissions = ({ navigation }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " ProvidePermissions method starts here",
      { navigation },
      "ProvidePermissions()",
      "ProvidePermissions.js"
    )
  );
  const { translations } = useContext(LocalizationContext);
  const styles = useStyleSheet(themedStyles);
  const onGoToSettings = async () => {
    crashlytics().log(
      ErrorUtil.createLog(
        " onGoToSettings method starts here",
        undefined,
        "onGoToSettings()",
        "ProvidePermissions.js"
      )
    );
    await openSettings();
  };
  const onExit = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        " onExit method starts here",
        undefined,
        "onExit()",
        "ProvidePermissions.js"
      )
    );
    BackHandler.exitApp();
  };
  const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );
  const navigateBack = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        " navigateBack method starts here",
        undefined,
        "navigateBack()",
        "ProvidePermissions.js"
      )
    );
    navigation.goBack();
  };
  return (
    <>
      <TopNavigation
        style={styles.topNavigationStyle}
        alignment="center"
        accessoryLeft={BackAction}
      />
      <View style={styles.container}>
        <View>
          <Text category="h5" status="default">
            {translations["permissions.grantAccess.title"]}
          </Text>
          <Text style={styles.content} category="p1">
            {translations["permissions.grantAccess.content"]}
          </Text>
        </View>

        <View style={styles.bottomButtonContainer}>
          <Button
            status="primary"
            style={styles.registerButton}
            onPress={onExit}
          >
            {translations["app.exit"]}
          </Button>
          <Button
            status="primary"
            style={styles.registerButton}
            onPress={onGoToSettings}
          >
            {translations["permissions.grantAccess.gotoSettings"]}
          </Button>
        </View>
      </View>
    </>
  );
};
const themedStyles = StyleService.create({
  topNavigationStyle: {
    backgroundColor: "background-basic-color-1",
  },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  permissionsList: {
    paddingVertical: 16,
  },
  content: {
    ...styleConstants.content,
  },
  subHeading: {
    ...styleConstants.subHeading,
  },
  bottomButtonContainer: {
    paddingTop: 32,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  registerButton: {
    marginLeft: 5,
  },
});

export default ProvidePermissions;

import React, { useState, useContext } from "react";
import notifee from "@notifee/react-native";
import { useRequest } from "ahooks";
import SimpleModal from "../screens/components/SimpleModal";
import { LocalizationContext } from "./Translation";
import { WarningIcon } from "../screens/components/ThemedIcons";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";
const Stack = createStackNavigator();
const BatteryOptimization = async () => {
  crashlytics().log(
    ErrorUtil.createLog(
      " BatteryOptimization method starts here",
      undefined,
      "BatteryOptimization()",
      "Optimizations.js"
    )
  );
  const { translation } = useContext(LocalizationContext);
  const [showModal, setShowModal] = useState(false);
  // 1. checks if battery optimization is enabled
  const { loading, data } = useRequest(
    async () => {
      const batteryOptimizationEnabled =
        await notifee.isBatteryOptimizationEnabled();
      return batteryOptimizationEnabled;
    },
    {
      onSuccess: (data) => {
        setShowModal(data.batteryOptimizationEnabled);
      },
    }
  );
  if (data.batteryOptimizationEnabled) {
    // 2. ask your users to disable the feature
    return (
      <SimpleModal
        visible={showModal}
        onCancel={setShowModal(false)}
        onOk={setShowModal(false)}
        title={translation["restrictions.detected"]}
        description={translation["restrictions.battery.description"]}
        Icon={WarningIcon}
        cancelText={translations["modal.cancel"]}
        okText={translations["modal.ok"]}
      />
    );
  }
};

const PowerManager = () => {
  crashlytics().log(
    ErrorUtil.createLog(
      " PowerManager method starts here",
      undefined,
      "PowerManager()",
      "Optimizations.js"
    )
  );
  const { loading, data } = useRequest(async () => {
    const powerManagerInfo = await notifee.getPowerManagerInfo();
    return powerManagerInfo;
  });
  if (data.powerManagerInfo.activity) {
    // 2. ask your users to adjust their settings
    Alert.alert(
      "Restrictions Detected",
      "To ensure notifications are delivered, please adjust your settings to prevent the app from being killed",
      [
        // 3. launch intent to navigate the user to the appropriate screen
        {
          text: "OK, open settings",
          onPress: async () => await notifee.openPowerManagerSettings(),
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  }
};
export { BatteryOptimization, PowerManager };

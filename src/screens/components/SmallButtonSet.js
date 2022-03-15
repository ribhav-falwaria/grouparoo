import React from "react";
import { View } from "react-native";
import { StyleService, useStyleSheet, Button } from "@ui-kitten/components";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const SmallButtonSet = ({ displaySet, values, onPress, selectedValue }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "SmallButtonSet method starts here",
      { displaySet, values, onPress, selectedValue },
      "SmallButtonSet()",
      "SmallButtonSet.js"
    )
  );
  const styles = useStyleSheet(themedStyles);
  return (
    <View style={styles.buttonContainer}>
      {values.map((v, ix) => (
        <Button
          size="tiny"
          status="info"
          appearance={selectedValue === v ? "filled" : "outline"}
          style={styles.buttonStyle}
          key={`smb-${ix}`}
          onPress={() => onPress(v)}
        >
          {displaySet[ix]}
        </Button>
      ))}
    </View>
  );
};

const themedStyles = StyleService.create({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: -16,
  },
  buttonStyle: {
    borderRadius: 24,
    marginLeft: 4,
    padding: -8,
  },
});
export default SmallButtonSet;

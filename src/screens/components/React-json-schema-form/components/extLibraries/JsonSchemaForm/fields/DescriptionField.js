import React, { useContext } from "react";
import { View } from "react-native";
import { Text, StyleService, useStyleSheet } from "@ui-kitten/components";
import styleConstants from "../../../../styleConstants";
import { LocalizationContext } from "../../../../translation/Translation";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

const DescriptionField = ({ description }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "DescriptionField method starts here ",
      { description },
      "DescriptionField()",
      "DescriptionField.js"
    )
  );
  const styles = useStyleSheet(themedStyles);
  const { translations } = useContext(LocalizationContext);
  if (description) {
    return (
      <View style={styles.container}>
        <Text category="label" status="info">
          {description}
        </Text>
      </View>
    );
  }
  return null;
};

const themedStyles = StyleService.create({
  content: {
    ...styleConstants.content,
    marginTop: 4,
  },
});

export default DescriptionField;

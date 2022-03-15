import React, { useContext } from "react";
import { View } from "react-native";
import { Text, StyleService, useStyleSheet } from "@ui-kitten/components";
import styleConstants from "../../../../styleConstants";
import { LocalizationContext } from "../../../../translation/Translation";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

const TitleDescriptionField = ({ description }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "TitleDescriptionField method starts here ",
      { description },
      "TitleDescriptionField()",
      "TitleDescriptionField.js"
    )
  );
  const styles = useStyleSheet(themedStyles);
  const { translations } = useContext(LocalizationContext);
  if (description && description.length > 0) {
    return (
      <View style={styles.container}>
        <Text category="s1" appearance="hint">
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

export default TitleDescriptionField;

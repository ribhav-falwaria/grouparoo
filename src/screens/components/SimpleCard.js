import React, { useContext } from "react";
import { View } from "react-native";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from "rn-placeholder";
import { Card, Text, StyleService, useStyleSheet } from "@ui-kitten/components";
import styleConstants from "../styleConstants";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const Loading = () => (
  <Placeholder Animation={Fade} Left={PlaceholderMedia}>
    <PlaceholderLine width={80} />
    <PlaceholderLine />
    <PlaceholderLine width={30} />
  </Placeholder>
);

const SimpleCard = ({ heading, Icon, content, onPress, loading }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "SimpleCard method starts here",
      { heading, Icon, content, onPress, loading },
      "SimpleCard()",
      "SimpleCard.js"
    )
  );
  if (loading) {
    return <Loading />;
  }
  const styles = useStyleSheet(themedStyles);
  return (
    <Card style={styles.cardContainer} onPress={onPress}>
      <View style={styles.cardTitleContainer}>
        <Icon />
        <Text style={styles.heading} category="h6" appearance="default">
          {heading}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.content} category="c1" appearance="hint">
          {content}
        </Text>
      </View>
    </Card>
  );
};

const themedStyles = StyleService.create({
  cardContainer: {
    ...styleConstants.cardContainer,
  },
  cardTitleContainer: {
    ...styleConstants.cardTitleContainer,
    flexDirection: "row",
    alignItems: "center",
  },
  contentContainer: {
    ...styleConstants.contentContainer,
  },
  heading: {
    ...styleConstants.heading,
  },
  content: {
    ...styleConstants.content,
  },
});

export default SimpleCard;

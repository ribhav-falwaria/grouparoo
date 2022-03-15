import React, { useContext } from "react";
import { View } from "react-native";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from "rn-placeholder";

import { Card, Text, StyleService, useStyleSheet } from "@ui-kitten/components";
import { LocalizationContext } from "../../components/Translation";
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

const FaqCard = ({ heading, Icon, onPress, loading }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "FaqCard method starts here",
      { heading, Icon, onPress, loading },
      "FaqCard()",
      "FaqCard.js"
    )
  );
  if (loading) {
    return <Loading />;
  }
  const styles = useStyleSheet(themedStyles);
  const { translations } = useContext(LocalizationContext);
  return (
    <Card style={styles.cardContainer} onPress={onPress}>
      <View style={styles.cardTitleContainer}>
        <Icon />
        <Text
          style={styles.heading}
          category="h5"
          status="primary"
          appearance="default"
        >
          {translations[heading]}
        </Text>
      </View>
    </Card>
  );
};

const themedStyles = StyleService.create({
  cardContainer: {
    ...styleConstants.cardContainer,
    ...styleConstants.faqCard,
  },
  cardTitleContainer: {
    ...styleConstants.cardTitleContainer,
    flexDirection: "column",
    alignItems: "flex-start",
    // justifyContent: 'left'
  },
  contentContainer: {
    marginVertical: 8,
  },
  heading: {
    ...styleConstants.heading,
  },
  content: {
    ...styleConstants.content,
  },
});

export default FaqCard;

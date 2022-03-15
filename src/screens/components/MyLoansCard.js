import React, { useContext } from "react";
import { View } from "react-native";
import { useSelector, useStore } from "react-redux";
import { Card, Text, StyleService, useStyleSheet } from "@ui-kitten/components";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from "rn-placeholder";
import { rupeeFormatter } from "../../utils/";

import { LocalizationContext } from "../../components/Translation";
import styleConstants from "../styleConstants";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const Loading = () => (
  <Placeholder
    Animation={Fade}
    Left={PlaceholderMedia}
    Right={PlaceholderMedia}
  >
    <PlaceholderLine width={80} />
    <PlaceholderLine />
    <PlaceholderLine width={30} />
    <PlaceholderLine width={30} />
  </Placeholder>
);

const MyLoansCard = ({ loanId, Icon, onPress, loading, heading }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "MyLoansCard method starts here",
      { loanId, Icon, onPress, loading, heading },
      "MyLoansCard()",
      "MyLoansCard.js"
    )
  );
  if (loading) {
    return <Loading />;
  }
  const state = useSelector((state) => state);
  const store = useStore();
  const selector = store.select((models) => ({
    loanAmount: models.loans.getLoanAmount,
    maturityDate: models.loans.getMaturityDate,
    loanAccountNumber: models.loans.getLoanAccountNumber,
    remainingPrincipal: models.loans.getRemainingPrincipal,
  }));
  const { loanAmount, loanAccountNumber, maturityDate, remainingPrincipal } =
    selector(state, { loanId });
  const styles = useStyleSheet(themedStyles);
  const { translations } = useContext(LocalizationContext);
  const cardHeading = translations.formatString(translations[heading], {
    loanAccountNumber: loanAccountNumber,
  });
  return (
    <Card style={styles.cardContainer} onPress={onPress}>
      <View style={styles.cardTitleContainer}>
        <View style={styles.cardTitleContainer}>
          <Icon />
          <Text category="h6" status="primary" appearance="default">
            {cardHeading}
          </Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.loanDetailColumn}>
          <Text category="p1" status="default">
            {translations["myLoans.loanAmount"]}
          </Text>
          <Text category="s1" status="primary" style={styles.content}>
            <Text category="p1" status="basic">
              {"₹ "}
            </Text>
            {rupeeFormatter(loanAmount)}
          </Text>
        </View>
        <View style={styles.loanDetailColumn}>
          <Text category="p1" status="default">
            {translations["loan.maturityDate"]}
          </Text>
          <Text category="s1" status="primary" style={styles.content}>
            {`${maturityDate}`}
          </Text>
        </View>
      </View>
    </Card>
  );
};
const themedStyles = StyleService.create({
  cardContainer: {
    ...styleConstants.cardContainer,
  },
  subHeading: {
    ...styleConstants.subHeading,
  },
  cardTitleContainer: {
    ...styleConstants.cardTitleContainer,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  contentContainer: {
    ...styleConstants.contentContainer,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heading: {
    ...styleConstants.heading,
  },
  headingAmount: {
    marginLeft: "auto",
  },
  content: {
    marginTop: 4,
  },
  loanDetailColumn: {
    flexDirection: "column",
  },
});
export default MyLoansCard;

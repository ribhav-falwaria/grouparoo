import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { useToggle } from "ahooks";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useStore, useSelector } from "react-redux";
import {
  Button,
  Card,
  List,
  StyleService,
  Text,
  useStyleSheet,
  useTheme,
  Divider,
  ListItem,
} from "@ui-kitten/components";
import styleConstants from "../styleConstants";
import { LocalizationContext } from "../../components/Translation";
import { rupeeFormatter } from "../../utils";
import { CheckIconSmall, CancelIcon } from "../components/ThemedIcons";
import RupeeText from "../components/RupeeText";
import PercentText from "../components/PercentText";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const MyLoan = ({ navigation, loanId }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "MyLoan method starts here",
      { navigation, loanId },
      "MyLoan()",
      "MyLoan.js"
    )
  );
  const [viewMore, { toggle }] = useToggle(false);
  const store = useStore();
  const state = useSelector((state) => state);
  const styles = useStyleSheet(themedStyles);
  const { translations } = useContext(LocalizationContext);
  const theme = useTheme();
  const selector = store.select((models) => ({
    loanAmount: models.loans.getLoanAmount,
    maturityDate: models.loans.getMaturityDate,
    loanAccountNumber: models.loans.getLoanAccountNumber,
    remainingTenure: models.loans.getRemainingTenure,
    remainingPrincipal: models.loans.getRemainingPrincipal,
    productName: models.loans.getProductName,
    isPrepayEnabled: models.loans.getIsPrepayEnabled,
    interestDetails: models.loans.getInterestDetails,
    amortizationAmount: models.loans.getAmortizationDetails,
    disbursementDate: models.loans.getDisbursementDate,
    dpdAmount: models.loans.getTotalDpdAmount,
    repaymentSchedule: models.loans.getRepaymentSchedule,
    nextInstallment: models.loans.getNextInstallment,
  }));
  const {
    productName,
    loanAmount,
    loanAccountNumber,
    maturityDate,
    remainingTenure,
    remainingPrincipal,
    isPrepayEnabled,
    interestDetails,
    amortizationAmount,
    disbursementDate,
    dpdAmount,
    repaymentSchedule,
    nextInstallment,
  } = selector(state, { loanId });

  const onPrepayPress = () => {};
  const onPressRepaymentPayNow = () => {};
  const onPressUpcoming = () => {};

  const TopOverlay = () => (
    <View style={styles.overlay}>
      <View>
        <View style={styles.viewContainer}>
          <View style={styles.section}>
            <Text style={styles.heading} category="h4" appearance="default">
              {`${translations["loan.loanAccountNumberShort"]} : ${loanAccountNumber}`}
            </Text>
            <View style={styles.subSection}>
              <View>
                <Text style={styles.content} category="p1" status="default">
                  {translations["myLoans.loanAmount"]}
                </Text>
                <Text
                  style={styles.subHeading}
                  category="h5"
                  appearance="default"
                  status="primary"
                >
                  <RupeeText />
                  {rupeeFormatter(loanAmount)}
                </Text>
              </View>
              {isPrepayEnabled === true && (
                <View>
                  <Button size="small" onPress={onPrepayPress}>
                    {translations["myLoans.prepay"]}
                  </Button>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
  const loanBasicInformation = [
    {
      heading: "loan.maturityDate",
      value: maturityDate,
      rupeeFormat: false,
    },
    {
      heading: "loan.remainingPrincipal",
      value: rupeeFormatter(remainingPrincipal),
      rupeeFormat: true,
    },
  ];
  // if (interestDetails.interestAmount > 0) {
  //   loanBasicInformation.unshift({
  //     heading: 'loan.interestAmount',
  //     value: `${rupeeFormatter(interestDetails.interestAmount)} ${translations[amortizationAmount.units]
  //       }`,
  //     rupeeFormat: true
  //   })
  // } else {
  //   loanBasicInformation.unshift({
  //     heading: 'loan.interestRate',
  //     value: interestDetails.interestRate,
  //     percentFormat: true
  //   })
  // }
  const RenderBasicLoanInformation = () => (
    <>
      <Text
        style={styles.subHeading}
        category="h6"
        appearance="default"
        status="primary"
      >
        {translations["loan.loanDetails"]}
      </Text>
      <View style={styles.loanInformation}>
        {loanBasicInformation.map((lb, ix) => {
          return lb.value === null ? null : (
            <View style={styles.subSection} key={`$loaninfo-${ix}`}>
              <Text style={styles.content} category="p1" status="default">
                {translations[lb.heading]}
              </Text>
              <Text
                style={styles.subHeading}
                category="p1"
                appearance="default"
                status="primary"
              >
                {lb.rupeeFormat && <RupeeText />}
                {lb.value}
                {lb.percentFormat && <PercentText />}
              </Text>
            </View>
          );
        })}
      </View>
    </>
  );
  const RenderPendingRepayment = () => (
    <View style={styles.repaymentContainer}>
      <View style={styles.repaymentRow}>
        <Text
          style={styles.subHeading}
          category="s1"
          appearance="default"
          status="primary"
        >
          {translations["repayment.title"]}
        </Text>
        <Text
          style={styles.subHeading}
          category="s1"
          appearance="default"
          status="danger"
        >
          <RupeeText />
          {rupeeFormatter(dpdAmount)}
        </Text>
      </View>
      <View style={styles.repaymentRowButton}>
        <Button size="small" onPress={onPressRepaymentPayNow}>
          {translations["pay.now"]}
        </Button>
      </View>
    </View>
  );
  const RenderUpComingRepayment = () => {
    if (nextInstallment.length === 0) {
      return null;
    }
    return (
      <View style={styles.repaymentContainer}>
        <Text
          style={styles.subHeading}
          category="h6"
          appearance="default"
          status="primary"
        >
          {translations["repayment.upcomingRepayment"]}
        </Text>
        <View style={styles.repaymentRow}>
          <View>
            <Text style={styles.content} category="p1" status="default">
              {translations["repayment.installmentDate"]}
            </Text>
            {nextInstallment.pastDueDays > 0 && (
              <Text
                style={styles.subHeading}
                category="s1"
                appearance="default"
                status="danger"
              >
                {translations["repayment.immediate"]}
              </Text>
            )}
            {nextInstallment.pastDueDays === 0 && (
              <Text
                style={styles.subHeading}
                category="s1"
                appearance="default"
                status="primary"
              >
                {nextInstallment.installmentDate}
              </Text>
            )}
          </View>
          <View>
            <Text style={styles.content} category="p1" status="default">
              {translations["repayment.installment"]}
            </Text>
            <Text
              style={styles.subHeading}
              category="s1"
              appearance="default"
              status="primary"
            >
              <RupeeText />
              {rupeeFormatter(nextInstallment.total)}
            </Text>
            {nextInstallment.pastDueDays > 0 && (
              <Button
                style={styles.payNow}
                size="small"
                onPress={onPressUpcoming}
              >
                {translations["pay.now"]}
              </Button>
            )}
          </View>
        </View>
      </View>
    );
  };
  const renderListItem = ({ item, index }) => {
    crashlytics().log(
      ErrorUtil.createLog(
        "renderListItem method starts here",
        { item, index },
        "renderListItem()",
        "MyLoan.js"
      )
    );
    const renderAmount = (props) => {
      crashlytics().log(
        ErrorUtil.createLog(
          "renderAmount method starts here",
          { props },
          "renderAmount()",
          "MyLoan.js"
        )
      );
      return (
        <View style={styles.repaymentAmountStyle}>
          <Text category="p1" status={item.isFullyPaid ? "primary" : "danger"}>
            <RupeeText />
            {rupeeFormatter(item.amount)}
          </Text>
          {item.isFullyPaid === true && (
            <Text
              category="p2"
              appearence="hint"
              status={item.isFullyPaid ? "primary" : "danger"}
            >
              {translations["loan.paid"]}
            </Text>
          )}
          {item.isFullyPaid === false && (
            <Text
              category="p2"
              appearence="hint"
              status={item.isFullyPaid ? "primary" : "danger"}
            >
              {translations["loan.notPaid"]}
            </Text>
          )}
        </View>
      );
    };
    return (
      <ListItem
        style={styles.listContainer}
        title={`${item.repaymentDate}`}
        description={translations[item.description]}
        accessoryLeft={item.isFullyPaid ? CheckIconSmall : CancelIcon}
        accessoryRight={renderAmount}
      />
    );
  };
  const ListTitle = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        "ListTitle method starts here",
        undefined,
        "ListTitle()",
        "MyLoan.js"
      )
    );
    return (
      <View style={styles.viewContainer}>
        <Text
          style={styles.subHeading}
          category="h6"
          appearance="default"
          status="primary"
        >
          {translations["repayment.history"]}
        </Text>
      </View>
    );
  };
  const RenderListHeader = () => (
    <>
      <TopOverlay />
      <Card
        style={styles.bookingCard}
        appearance="filled"
        disabled
        footer={renderFooter}
      >
        <RenderBasicLoanInformation />
      </Card>
      <ListTitle />
    </>
  );
  const renderFooter = (props) => (
    <View style={[props.style]}>
      {dpdAmount > 0 && <RenderPendingRepayment />}
      <RenderUpComingRepayment />
    </View>
  );
  let listToRender;
  if (viewMore) {
    listToRender = repaymentSchedule;
  } else {
    listToRender = repaymentSchedule.slice(0, 10);
  }
  const ListFooter = () => (
    <>
      {viewMore === true && (
        <View style={styles.viewMore} onClick={() => toggle()}>
          <Text category="p1" appearence="hint" status="primary">
            {translations["view.less"]}
          </Text>
        </View>
      )}
      {viewMore === false && (
        <View style={styles.viewMore} onClick={() => toggle()}>
          <Text category="p1" appearence="hint" status="primary">
            {translations["view.more"]}
          </Text>
        </View>
      )}
    </>
  );
  return (
    <View style={styles.container}>
      <List
        data={listToRender}
        ItemSeparatorComponent={Divider}
        renderItem={renderListItem}
        ListHeaderComponent={RenderListHeader}
        ListFooterComponent={ListFooter}
        showVerticalScrollBar={false}
      />
    </View>
  );
};

const themedStyles = StyleService.create({
  viewContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  container: {
    backgroundColor: "background-basic-color-2",
  },
  listContainer: {
    marginHorizontal: 16,
  },
  heading: {
    ...styleConstants.heading,
  },
  subHeading: {
    ...styleConstants.subHeading,
  },
  section: {
    ...styleConstants.section,
    flexDirection: "column",
  },
  content: {
    ...styleConstants.content,
  },
  overlay: {
    height: heightPercentageToDP("30%"),
  },
  subSection: {
    flexDirection: "column",
    marginTop: 8,
  },
  bookingCard: {
    marginTop: -1 * heightPercentageToDP("10%"),
    margin: 16,
  },
  loanInformation: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  repaymentContainer: {
    ...styleConstants.contentContainer,
  },
  repaymentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  repaymentRowButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  payNow: {
    marginVertical: 4,
  },
  viewMore: {
    justifyContent: "center",
    alignItems: "center",
  },
  repaymentAmountStyle: {
    width: widthPercentageToDP("20%"),
    alignItems: "flex-end",
    paddingHorizontal: 8,
  },
});

export default MyLoan;

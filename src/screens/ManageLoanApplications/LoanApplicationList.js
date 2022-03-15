import React, { useContext } from "react";
import { View } from "react-native";
import { useDispatch, useStore, useSelector } from "react-redux";
import isUndefined from "lodash.isundefined";
import {
  Button,
  Icon,
  List,
  ListItem,
  Text,
  StyleService,
  useStyleSheet,
  Spinner,
  Divider,
} from "@ui-kitten/components";
import { LocalizationContext } from "../../components/Translation";
import styleConstants from "../styleConstants";
import dayjs from "dayjs";
import { rupeeFormatter } from "../../utils";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const LoanApplicationList = ({
  activeLoanApplications,
  onEditLoanApplication,
}) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "LoanApplicationList method starts here",
      { activeLoanApplications, onEditLoanApplication },
      "LoanApplicationList()",
      "LoanApplicationList.js"
    )
  );
  const dispatch = useDispatch();
  const { translations } = useContext(LocalizationContext);
  const store = useStore();
  const state = useSelector((state) => state);
  const isLoading = state.loanApplications.loading;
  const styles = useStyleSheet(themedStyles);
  const loanTypes = store.select.loanTypes.getLoanTypes(state);
  const renderItemAccessory = (item) => {
    const spinnerAccessory = (props) => {
      return (
        <View style={props.style}>
          <Spinner size="tiny" />
        </View>
      );
    };
    return (
      <View style={styles.accessoryContainer}>
        <Button
          style={styles.buttonStyle}
          size="tiny"
          status="primary"
          disabled={isLoading}
          onPress={() => onEditLoanApplication(item.loanApplicationId)}
          accessoryRight={(props) =>
            isLoading ? spinnerAccessory(props) : null
          }
        >
          {translations["application.complete"]}
        </Button>
        <Button
          size="tiny"
          status="danger"
          disabled={isLoading}
          onPress={() =>
            dispatch.loanApplications.removeLoanApplication(
              item.loanApplicationId
            )
          }
          accessoryRight={(props) =>
            isLoading ? spinnerAccessory(props) : null
          }
        >
          {translations["application.delete"]}
        </Button>
      </View>
    );
  };
  const renderItemIcon = (props) => (
    <Icon {...props} name="file-text-outline" />
  );
  const renderTitle = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        "renderTitle method starts here",
        undefined,
        "renderTitle()",
        "LoanApplicationList.js"
      )
    );
    return (
      <View>
        <Text style={styles.content} category="p2">
          {translations["application.manageApplications"]}
        </Text>
      </View>
    );
  };
  const renderItem = ({ item, index }) => {
    crashlytics().log(
      ErrorUtil.createLog(
        "renderItem method starts here",
        { item, index },
        "renderItem()",
        "LoanApplicationList.js"
      )
    );
    let description = `${translations["application.createdOn"]}: ${dayjs(
      item.createdOn
    ).format("DD-MMM-YYYY")}`;
    if (item.loanAmount) {
      description =
        description +
        `${translations["application.form.loanAmount"]}: ${rupeeFormatter(
          item.loanAmount
        )}`;
    }
    const loanType = loanTypes.find((lt) => lt.productType === item.loanType);
    const title = isUndefined(loanType)
      ? `${translations["application.applicationNumber"]} : ${item.loanApplicationId}`
      : `${loanType.name} : ${item.loanApplicationId}`;
    return (
      <ListItem
        title={title}
        description={description}
        accessoryLeft={renderItemIcon}
        accessoryRight={() => renderItemAccessory(item)}
      />
    );
  };
  if (activeLoanApplications.length === 0) {
    return (
      <View>
        <Text>'Holy'</Text>
      </View>
    );
  }
  return (
    <List
      style={styles.container}
      ListHeaderComponent={renderTitle}
      data={activeLoanApplications}
      renderItem={renderItem}
      ItemSeparatorComponent={Divider}
      showsVerticalScrollIndicator={false}
    />
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: "background-basic-color-1",
  },
  accessoryContainer: {
    flexDirection: "column",
  },
  buttonStyle: {
    marginVertical: 4,
  },
  content: {
    ...styleConstants.content,
  },
});
export default LoanApplicationList;

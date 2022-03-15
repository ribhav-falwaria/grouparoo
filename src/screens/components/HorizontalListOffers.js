import React, { useContext } from "react";
import { useStore, useSelector, useDispatch } from "react-redux";
import { useRequest } from "ahooks";
import { List, StyleService, useStyleSheet } from "@ui-kitten/components";
import BlockCard from "../components/BlockCard";
import { LocalizationContext } from "../../components/Translation";
import styleConstants from "../styleConstants";
import { AllIcons } from "../components/ThemedIcons";
import offers from "../../store/models/offers";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const renderHorizontalOfferItem = ({ item }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "renderHorizontalOfferItem method starts here",
      { item },
      "renderHorizontalOfferItem()",
      "renderHorizontalOfferItem.js"
    )
  );
  return (
    <BlockCard
      loading={item.loading}
      heading={item.title}
      Icon={AllIcons[item.icon]}
      Content={item.content}
      onPress={() => item.onPress(item)}
    />
  );
};

const getOffers = async (dispatch, { customer }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "getOffers method starts here",
      { dispatch, customer },
      "getOffers()",
      "renderHorizontalOfferItem.js"
    )
  );
  return dispatch.offers.getAllOffers(customer);
};
const HorizontalListOffers = ({ navigation }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "HorizontalListOffers method starts here",
      { navigation },
      "HorizontalListOffers()",
      "renderHorizontalOfferItem.js"
    )
  );
  const store = useStore();
  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const { loading } = useRequest(() => getOffers(dispatch, state));
  const onPress = (item) => {
    // Navigate to the screen provided in Item
  };
  const offers = store.select.offers.getOffers(state);
  const styles = useStyleSheet(themedStyles);
  offers.forEach((o) => {
    o.onPress = onPress;
  });
  return (
    <List
      contentContainerStyle={styles.horizontalList}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={loading ? Array(3).fill({ loading }) : offers}
      renderItem={renderHorizontalOfferItem}
    />
  );
};

const themedStyles = StyleService.create({});

export default HorizontalListOffers;

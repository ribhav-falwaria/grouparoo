import { testOffers } from "./test";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../screens/Errors/ErrorUtil";
const offers = {
  name: "offers",
  selectors: {
    getOffers: (select) => (rootState) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " getOffers method starts here",
          { rootState },
          "getOffers()",
          "offers.js"
        )
      );
      return rootState.offers;
    },
  },
  state: [],
  reducers: {
    setOffers: (state, offers) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setOffers method starts here",
          { state, offers },
          "setOffers()",
          "offers.js"
        )
      );
      state = [...offers];
      return state;
    },
  },
  effects: (dispatch) => ({
    getAllOffers(customerId, rootState) {
      crashlytics().log(
        ErrorUtil.createLog(
          " getAllOffers method starts here",
          { customerId, rootState },
          "getAllOffers()",
          "offers.js"
        )
      );
      dispatch.offers.setOffers(testOffers);
    },
  }),
};
export default offers;

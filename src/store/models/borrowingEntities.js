import apiService from "../../apiService";
import { config } from "../../config";

import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../screens/Errors/ErrorUtil";
const borrowingEntities = {
  name: "borrowingEntities",
  state: {},
  selectors: {
    getBorrowingEntity: (select) => (rootState) =>
      rootState.borrowingEntities[config.entityType],
  },
  reducers: {
    setBorrowerEntities: (state, { borrowingEntities }) => {
      borrowingEntities.forEach((be) => {
        state[be.entityType] = be;
      });
      return state;
    },
  },
  effects: (dispatch) => ({
    async getBorrowingEntities(_, rootState) {
      crashlytics().log(
        ErrorUtil.createLog(
          " getBorrowingEntities method starts here",
          { _, rootState },
          "getBorrowingEntities()",
          "borrowingEntities.js"
        )
      );
      const borrowingEntities = await apiService.appApi.borrowingEntities.get();
      dispatch.borrowingEntities.setBorrowerEntities({ borrowingEntities });
    },
  }),
};
export default borrowingEntities;

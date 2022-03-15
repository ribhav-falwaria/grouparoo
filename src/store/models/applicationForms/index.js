import createListModels from "../../createListModels";
import { api } from "./api";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../screens/Errors/ErrorUtil";
const applicationForms = {
  name: "applicationForms",
  api,
  extensions: {
    state: [],
    reducers: {},
    effects: (dispatch, baseEffects) => ({
      async create(payload, rootState) {
        crashlytics().log(
          ErrorUtil.createLog(
            " create method starts here",
            { payload, rootState },
            "create()",
            "applicationForms.js"
          )
        );
        const { data } = payload;
        return baseEffects.createAsync(data);
      },
      async update(payload, rootState) {
        crashlytics().log(
          ErrorUtil.createLog(
            " update method starts here",
            { payload, rootState },
            "update()",
            "applicationForms.js"
          )
        );
        const { id, data } = payload;
        baseEffects.updateAsync(id, data);
      },
      async remove(payload, rootState) {
        crashlytics().log(
          ErrorUtil.createLog(
            " remove method starts here",
            { payload, rootState },
            "remove()",
            "applicationForms.js"
          )
        );
        const { id } = payload;
        baseEffects.removeAsync(id);
      },
      async get(payload, rootState) {
        crashlytics().log(
          ErrorUtil.createLog(
            " get method starts here",
            { payload, rootState },
            "get()",
            "applicationForms.js"
          )
        );
        const { id } = payload;
        baseEffects.getAsync(id);
      },
      async getById(payload, rootState) {
        crashlytics().log(
          ErrorUtil.createLog(
            " getById method starts here",
            { payload, rootState },
            "getById()",
            "applicationForms.js"
          )
        );
        const { id, params } = payload;
        return baseEffects.getByIdAsync(id, params);
      },
    }),
  },
};
export default createListModels(
  applicationForms.name,
  applicationForms.api,
  applicationForms.extensions
);

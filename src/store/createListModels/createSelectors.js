import get from "lodash.get";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../screens/Errors/ErrorUtil";

export default (modelName, defaultListName, selectors) =>
  crashlytics().log(
    ErrorUtil.createLog(
      "createSelectors method starts here",
      { modelName, defaultListName, selectors },
      "createSelectors()",
      "createSelectorscreateEffects.js"
    )
  )(
    Object.assign(
      {},
      {
        getById: () => (rootState, id) => rootState[modelName].byId[id],
        list:
          (select) =>
          (rootState, listName = defaultListName) =>
            (rootState[modelName][listName] || [])
              .map((id) => select[modelName].getById(rootState, id))
              .filter((item) => item),
        getPagination:
          () =>
          (rootState, listName = defaultListName) =>
            rootState[modelName].pagination[listName] || { pages: {} },
        getNextPageParams:
          () =>
          (rootState, listName = defaultListName) =>
            get(rootState[modelName], `pagination[${listName}].pages.next`),
        getNextPageStatus:
          (select) =>
          (rootState, listName = defaultListName) =>
            Boolean(select[modelName].getNextPageParams(rootState, listName)),
      },
      selectors
    )
  );

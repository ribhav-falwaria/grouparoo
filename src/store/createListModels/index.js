import createInitialState from "./createInitialState";
import createReducers from "./createReducers";
import createEffects from "./createEffects";
import createSelectors from "./createSelectors";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../screens/Errors/ErrorUtil";

export default (
  modelName,
  api,
  {
    idKey = "id",
    listNames = ["allIds"],
    initialState,
    reducers,
    effects,
    selectors,
  } = {}
) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "createListModels method starts here",
      { idKey, listNames, initialState, reducers, effects, selectors },
      "createListModels()",
      "app-reload.createListModels.js"
    )
  );
  if (!api) {
    throw new Error(
      "[REMATCH_MODEL_LIST] An API service is required. Pass an object with these methods: get, getById, update, create and remove."
    );
  }

  return {
    state: createInitialState(listNames, initialState),
    reducers: createReducers(listNames[0], idKey, reducers),
    effects: createEffects(modelName, listNames[0], idKey, api, effects),
    selectors: createSelectors(modelName, listNames[0], selectors),
    name: modelName,
  };
};

import { init } from "@rematch/core";
import models from "./models";
import loading from "@rematch/loading";
import updated from "@rematch/updated";
// import persist from '@rematch/persist'
// import storage from 'redux-persist/lib/storage'
import immerPlugin from "@rematch/immer";
import selectPlugin from "@rematch/select";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";

const store = init(
  crashlytics().log(
    ErrorUtil.createLog(
      "store method starts here",
      undefined,
      "store()",
      "store.js"
    )
  ),
  {
    models,
    plugins: [
      updated(),
      loading(),
      // persist({
      //   key: 'persist-storage',
      //   storage,
      //   whitelist: ['settings']
      // }),
      immerPlugin({
        whitelist: ["settings"],
      }),
      selectPlugin(),
    ],
  }
);

export default store;

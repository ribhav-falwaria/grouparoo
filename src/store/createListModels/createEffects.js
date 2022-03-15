import noop from "lodash.noop";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../screens/Errors/ErrorUtil";
export default (modelName, defaultListName, idKey, api, effects) =>
  (dispatch) => {
    const ownDispatch = dispatch[modelName];

    const baseEffects = {
      async getAsync({
        listName = defaultListName,
        params,
        onSuccess = noop,
        onFail = noop,
        onFinish = noop,
        ...rest
      } = {}) {
        crashlytics().log(
          ErrorUtil.createLog(
            "baseEffects method starts here",
            undefined,
            "baseEffects()",
            "createEffects.js"
          )
        );
        try {
          const data = await api.get(params);
          onSuccess(data);
          ownDispatch.write({ data, listName, ...rest });
        } catch (error) {
          crashlytics().log(
            ErrorUtil.createError(
              error,
              error.message,
              error.message,
              { listName, params, onSuccess, onFail, onFinishnoop, ...rest },
              "baseEffects()",
              "createEffects.js"
            )
          );
          if (onFail) {
            onFail(error);
          }
          throw error;
        } finally {
          onFinish();
        }
      },

      async getByIdAsync({
        id,
        params,
        onSuccess = noop,
        onFail = noop,
        onFinish = noop,
      }) {
        crashlytics().log(
          ErrorUtil.createLog(
            "getByIdAsync method starts here",
            { id, params, onSuccess, onFail, onFinish },
            "getByIdAsync()",
            "createEffects.js"
          )
        );
        try {
          const data = await api.getById(id, params);
          onSuccess(data);
          ownDispatch.writeById({ id, data });
        } catch (error) {
          crashlytics().log(
            ErrorUtil.createError(
              error,
              error.message,
              error.message,
              { id, params, onSuccess, onFail, onFinish },
              "getByIdAsync()",
              "createEffects.js"
            )
          );
          if (onFail) {
            onFail(error);
          }
          throw error;
        } finally {
          onFinish();
        }
      },

      async createAsync({
        data,
        updateList,
        listName = defaultListName,
        onSuccess = noop,
        onFail = noop,
        onFinish = noop,
      }) {
        crashlytics().log(
          ErrorUtil.createLog(
            "createAsync method starts here",
            { data, updateList, listName, onSuccess, onFail, onFinish },
            "createAsync()",
            "createEffects.js"
          )
        );
        try {
          const response = await api.create(data);
          ownDispatch.writeById(response);
          onSuccess(response);
          if (updateList) {
            await ownDispatch.getAsync({ listName });
          }
        } catch (error) {
          crashlytics().log(
            ErrorUtil.createError(
              error,
              error.message,
              error.message,
              { data, updateList, listName, onSuccess, onFail, onFinish },
              "createAsync()",
              "createEffects.js"
            )
          );
          if (onFail) {
            onFail(error);
          }
          throw error;
        } finally {
          onFinish();
        }
      },

      async updateAsync({
        data,
        updateList,
        listName,
        onSuccess = noop,
        onFail = noop,
        onFinish = noop,
      }) {
        crashlytics().log(
          ErrorUtil.createLog(
            "updateAsync method starts here",
            { data, updateList, listName, onSuccess, onFail, onFinish },
            "updateAsync()",
            "createEffects.js"
          )
        );
        try {
          const response = await api.update(data[idKey], data);
          onSuccess(response);
          ownDispatch.writeById(response);
          if (updateList) {
            await ownDispatch.getAsync({ listName });
          }
        } catch (error) {
          crashlytics().log(
            ErrorUtil.createError(
              error,
              error.message,
              error.message,
              { data, updateList, listName, onSuccess, onFail, onFinish },
              "updateAsync()",
              "createEffects.js"
            )
          );
          if (onFail) {
            onFail(error);
          }
          throw error;
        } finally {
          onFinish();
        }
      },

      async removeAsync({
        id,
        params,
        updateList,
        listName = defaultListName,
        onSuccess = noop,
        onFail = noop,
        onFinish = noop,
      }) {
        crashlytics().log(
          ErrorUtil.createLog(
            "updateAsync method starts here",
            { id, params, updateList, listName, onSuccess, onFail, onFinish },
            "removeAsync()",
            "createEffects.js"
          )
        );

        try {
          await api.remove(id, params);
          onSuccess();
          if (updateList) {
            await ownDispatch.getAsync({ listName });
          }
        } catch (error) {
          crashlytics().log(
            ErrorUtil.createError(
              error,
              error.message,
              error.message,
              { id, params, updateList, listName, onSuccess, onFail, onFinish },
              "removeAsync()",
              "createEffects.js"
            )
          );
          if (onFail) {
            onFail(error);
          }
          throw error;
        } finally {
          onFinish();
        }
      },
    };

    return Object.assign(
      {},
      baseEffects,
      effects && effects(dispatch, baseEffects)
    );
  };

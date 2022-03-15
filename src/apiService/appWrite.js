import { Appwrite, Query } from "appwrite";
import { config } from "../config";
import isUndefined from "lodash.isundefined";
import isNull from "lodash.isnull";
import isEmpty from "lodash.isempty";
import crashlytics from "@react-native-firebase/crashlytics";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";
import { Gzip } from "../utils";
const sdk = new Appwrite();

const unpackData = (b64Data) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " unpackData method starts here",
      { b64Data },
      "unpackData()",
      "appWrite.js"
    )
  );
  const unzippedData = Gzip.unzip(b64Data);
  return JSON.parse(unzippedData);
};
const isInvalidValue = (val) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " isInvalidValue method starts here",
      { val },
      "isInvalidValue()",
      "appWrite.js"
    )
  );
  return (
    isUndefined(val) ||
    isNull(val) ||
    val === "np" ||
    val === -1 ||
    val.length === 0
  );
};
// Fill with your Appwrite API endpoint and Project ID!
sdk.setEndpoint(config.appWrite.url).setProject(config.appWrite.projectId);

const getCompletionStatus = async (functionId, executionId) => {
  let completed = false;
  let responseWithStatus;
  crashlytics().log(
    ErrorUtil.createLog(
      " getCompletionStatus method starts here",
      { functionId, executionId },
      "getCompletionStatus()",
      "appWrite.js"
    )
  );
  while (!completed) {
    responseWithStatus = await sdk.functions.getExecution(
      functionId,
      executionId
    );
    if (
      responseWithStatus.status === "completed" ||
      responseWithStatus === "failed"
    ) {
      completed = true;
    }
    if (!completed) {
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  }
  return responseWithStatus;
};
export const appApi = {
  stateEvents: {
    send: async (appStateEvents) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " send method starts here",
          { appStateEvents },
          "send()",
          "appWrite.js"
        )
      );
      try {
        await sdk.database.createDocument(
          config.appWrite.appStateEventsCollectionId,
          "unique()",
          appStateEvents
        );
      } catch (err) {
        crashlytics().log(
          ErrorUtil.createError(
            err,
            err.message,
            err.message,
            { appStateEvents },
            "send()",
            "appWrite.js"
          )
        );
        crashlytics().log(err);
      }
    },
  },
  cashfree: {
    signatureVerify: {
      execute: async (signatureData) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " execute method starts here",
            { signatureData },
            "execute()",
            "appWrite.js"
          )
        );
        try {
          const executionDetails = await sdk.functions.createExecution(
            config.appWrite.cashfreeSignatureFunctionId,
            signatureData
          );
          return executionDetails.$id;
        } catch (e) {
          crashlytics().log(
            ErrorUtil.createError(
              e,
              e.message,
              e.message,
              { signatureData },
              "execute()",
              "appWrite.js"
            )
          );
          crashlytics().recordError(e);
          throw new Error("CANNOT_GET_VERIFY_EXECUTION_ID");
        }
      },
      get: async (executionId) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " get method starts here",
            { executionId },
            "get()",
            "appWrite.js"
          )
        );
        const responseWithStatus = await getCompletionStatus(
          config.appWrite.cashfreeSignatureFunctionId,
          executionId
        );
        if (responseWithStatus.status === "completed") {
          const response = JSON.parse(responseWithStatus.stdout);
          if (response.status !== "OK") {
            throw new Error("VERIFY_EXECUTION_FAILED");
          }
          return response.verified;
        } else {
          throw new Error("CANNOT_GET_VERIFY_EXECUTION");
        }
      },
    },
    token: {
      execute: async (loanAppId, amount, env) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " execute method starts here",
            { executionId },
            "execute()",
            "appWrite.js"
          )
        );
        try {
          const payload = JSON.stringify({
            loanAppId,
            amount,
            env,
          });
          const executionDetails = await sdk.functions.createExecution(
            config.appWrite.cashFreeTokenFunctionId,
            payload
          );
          return executionDetails.$id;
        } catch (err) {
          crashlytics().log(
            ErrorUtil.createError(
              err,
              err.message,
              err.message,
              { loanAppId, amount, env },
              "execute()",
              "appWrite.js"
            )
          );
          crashlytics().log(err);
          throw new Error("CANNOT_GET_CASHFREE_TOKEN_EXECUTION_ID");
        }
      },
      get: async (executionId) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " get method starts here",
            { executionId },
            "get()",
            "appWrite.js"
          )
        );
        const responseWithStatus = await getCompletionStatus(
          config.appWrite.cashFreeTokenFunctionId,
          executionId
        );
        if (responseWithStatus.status === "completed") {
          const response = JSON.parse(responseWithStatus.stdout);
          if (response.status !== "OK") {
            throw new Error("CANNOT_GET_CASHFREE_TOKEN");
          }
          return response.cftoken;
        } else {
          throw new Error("CANNOT_GET_CASHFREE_TOKEN");
        }
      },
    },
  },
  borrowingEntities: {
    get: async () => {
      crashlytics().log(
        ErrorUtil.createLog(
          " get method starts here",
          undefined,
          "get()",
          "appWrite.js"
        )
      );
      try {
        const borrowingEntities = await sdk.database.listDocuments(
          config.appWrite.borrowingEntitiesCollectionId
        );
        return borrowingEntities.documents;
      } catch (err) {
        crashlytics().log(
          ErrorUtil.createError(
            err,
            err.message,
            err.message,
            undefined,
            "execute()",
            "appWrite.js"
          )
        );
        crashlytics().log(err);
        throw new Error("CANNOT_GET_BORROWING_ENTITIES");
      }
    },
  },
  loanTypes: {
    getAll: async () => {
      crashlytics().log(
        ErrorUtil.createLog(
          " getAll method starts here",
          undefined,
          "getAll()",
          "appWrite.js"
        )
      );
      try {
        const response = await sdk.database.listDocuments(
          config.appWrite.loanTypesCollectionId
        );
        return response.documents;
      } catch (e) {
        crashlytics().log(
          ErrorUtil.createError(
            e,
            e.message,
            e.message,
            undefined,
            "getAll()",
            "appWrite.js"
          )
        );
        crashlytics().log(e);
        throw new Error("CANNOT_GET_LOAN_TYPES");
      }
    },
  },
  loanProducts: {
    getAll: {
      execute: async () => {
        crashlytics().log(
          ErrorUtil.createLog(
            " execute method starts here",
            undefined,
            "execute()",
            "appWrite.js"
          )
        );
        try {
          const executionDetails = await sdk.functions.createExecution(
            config.appWrite.loanProductMetadataFunctionId
          );
          return executionDetails.$id;
        } catch (err) {
          crashlytics().log(
            ErrorUtil.createError(
              err,
              err.message,
              err.message,
              undefined,
              "execute()",
              "appWrite.js"
            )
          );
          crashlytics().log(err);
          throw new Error("CANNOT_GET_LOAN_PRODUCTS_EXECUTION_ID");
        }
      },
      get: async (executionId) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " get method starts here",
            { executionId },
            "get()",
            "appWrite.js"
          )
        );
        const responseWithStatus = await getCompletionStatus(
          config.appWrite.loanProductMetadataFunctionId,
          executionId
        );
        if (responseWithStatus.status === "completed") {
          const allProducts = unpackData(responseWithStatus.stdout);
          return allProducts;
        } else {
          throw new Error("CANNOT_GET_ALL_PRODUCTS");
        }
      },
    },
  },
  user: {
    get: async () => {
      crashlytics().log(
        ErrorUtil.createLog(
          " get method starts here",
          undefined,
          "get()",
          "appWrite.js"
        )
      );
      try {
        const account = await sdk.account.get();
        return account;
      } catch (e) {
        crashlytics().log(
          ErrorUtil.createError(
            e,
            e.message,
            e.message,
            undefined,
            "get()",
            "appWrite.js"
          )
        );
        crashlytics().log(e);
        throw new Error("NO_LOGGEDIN_USER");
      }
    },
    updatePassword: async (password) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " updatePassword method starts here",
          undefined,
          "updatePassword()",
          "appWrite.js"
        )
      );
      try {
        await sdk.account.updatePassword(password);
      } catch (e) {
        crashlytics().log(
          ErrorUtil.createError(
            e,
            e.message,
            e.message,
            { password },
            "get()",
            "appWrite.js"
          )
        );
        crashlytics().log(e);
        throw new Error("CANNOT_SET_PASSWORD");
      }
    },
    updateAccountEmail: async (email) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " updateAccountEmail method starts here",
          { email },
          "updateAccountEmail()",
          "appWrite.js"
        )
      );
      try {
        await sdk.account.updateEmail(email);
      } catch (e) {
        crashlytics().log(
          ErrorUtil.createError(
            e,
            e.message,
            e.message,
            { password },
            "updateAccountEmail()",
            "appWrite.js"
          )
        );
        throw new Error("CANNOT_UPDATE_EMAIL");
      }
    },
    getJwtToken: async () => {
      crashlytics().log(
        ErrorUtil.createLog(
          " getJwtToken method starts here",
          undefined,
          "getJwtToken()",
          "appWrite.js"
        )
      );
      try {
        const jwt = await sdk.account.createJWT();
        return jwt;
      } catch (e) {
        crashlytics().log(
          ErrorUtil.createError(
            e,
            e.message,
            e.message,
            undefined,
            "getJwtToken()",
            "appWrite.js"
          )
        );
        crashlytics().log(e);
        throw new Error("CANNOT_CREATE_JWT");
      }
    },
  },
  auth: {
    login: async (email, password) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " login method starts here",
          { email, password },
          "login()",
          "appWrite.js"
        )
      );
      try {
        await sdk.account.createSession(email, password);
        const user = await sdk.account.get();
        return user;
      } catch (e) {
        crashlytics().log(
          ErrorUtil.createError(
            e,
            e.message,
            e.message,
            undefined,
            "getJwtToken()",
            "appWrite.js"
          )
        );

        crashlytics().log(e);
        throw new Error("CANNOT_CREATE_SESSION");
      }
    },
    register: async ({ email, password, fullName }) => {
      try {
        await sdk.account.create("unique()", email, password, fullName);
        await sdk.account.createSession(email, password);
        const user = await sdk.account.get();
        return user;
      } catch (e) {
        if (e.message === "Account already exists") {
          throw new Error("ACCOUNT_EXISTS");
        } else {
          crashlytics().log(e);
          throw new Error("CANNOT_REGISTER_USER");
        }
      }
    },
  },
  customer: {
    getExistingAddresses: async (customerId) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " getExistingAddresses method starts here",
          { customerId },
          "getExistingAddresses()",
          "appWrite.js"
        )
      );
      try {
        const query = Query.equal("customerId", customerId);
        const response = await sdk.data.listDocuments(
          config.appWrite.addressCollectionId,
          query
        );
        return response.documents;
      } catch (e) {
        crashlytics().log(
          ErrorUtil.createError(
            e,
            e.message,
            e.message,
            { customerId },
            "getExistingAddresses()",
            "appWrite.js"
          )
        );
        console.log(e);
        throw new Error("CANNOT_GET_ADDRESSES_FOR_CUSTOMERID");
      }
    },
    getCustomerByUserId: async (userId) => {
      const { appWrite } = config;
      const customerQuery = [Query.equal("userId", userId)];
      crashlytics().log(
        ErrorUtil.createLog(
          "getCustomerByUserId method starts here",
          { userId },
          "getCustomerByUserId()",
          "appWrite.js"
        )
      );
      try {
        const response = await sdk.database.listDocuments(
          appWrite.customersCollectionId,
          customerQuery
        );
        if (response.documents.length > 0) {
          const customerData = response.documents[0];
          // remove all default values
          Object.keys(customerData).forEach((key) => {
            if (customerData[key] === "np") {
              customerData[key] = undefined;
            }
          });
          return customerData;
        } else {
          return {};
        }
      } catch (e) {
        crashlytics().log(
          ErrorUtil.createError(
            e,
            e.message,
            e.message,
            { userId },
            "getCustomerByUserId()",
            "appWrite.js"
          )
        );
        crashlytics().log(e);
        throw new Error("CANNOT_GET_CUSTOMER_BY_USREID");
      }
    },
    get: async (id) => {
      const { appWrite } = config;
      crashlytics().log(
        ErrorUtil.createLog(
          "get method starts here",
          { id },
          "get()",
          "appWrite.js"
        )
      );
      try {
        const customerData = await sdk.database.getDocument(
          appWrite.customersCollectionId,
          id
        );
        return customerData;
      } catch (e) {
        crashlytics().log(
          ErrorUtil.createError(
            e,
            e.message,
            e.message,
            { id },
            "get()",
            "appWrite.js"
          )
        );
        crashlytics().log(e);
        throw new Error("CANNOT_GET_CUSTOMER_BY_ID");
      }
    },
    create: async (customerData, userId) => {
      const { appWrite } = config;
      customerData.createdOn = Date.now();
      customerData.updatedOn = Date.now();
      crashlytics().log(
        ErrorUtil.createLog(
          "create method starts here",
          { customerData, userId },
          "create()",
          "appWrite.js"
        )
      );
      try {
        const data = await sdk.database.createDocument(
          appWrite.customersCollectionId,
          "unique()",
          customerData,
          [`user:${userId}`],
          [`user:${userId}`]
        );
        customerData.$id = data.$id;
        return data;
      } catch (e) {
        crashlytics().log(
          ErrorUtil.createError(
            e,
            e.message,
            e.message,
            { customerData, userId },
            "create()",
            "appWrite.js"
          )
        );
        crashlytics().log(e);
        throw new Error("CANNOT_CREATE_NEW_CUSTOMER");
      }
    },
  },
  preferences: {
    get: async () => {
      crashlytics().log(
        ErrorUtil.createLog(
          "get method starts here",
          undefined,
          "get()",
          "appWrite.js"
        )
      );
      try {
        const preferences = await sdk.account.getPrefs();
        return preferences;
      } catch (e) {
        crashlytics().log(
          ErrorUtil.createError(
            e,
            e.message,
            e.message,
            undefined,
            "get()",
            "appWrite.js"
          )
        );
        crashlytics().log(e);
        throw new Error("CANNOT_GET_PREFERENCES");
      }
    },
    set: async (preferences) => {
      crashlytics().log(
        ErrorUtil.createLog(
          "set method starts here",
          { preferences },
          "set()",
          "appWrite.js"
        )
      );
      try {
        const prefs = await sdk.account.updatePrefs(preferences);
        return prefs;
      } catch (e) {
        crashlytics().log(
          ErrorUtil.createError(
            e,
            e.message,
            e.message,
            { preferences },
            "set()",
            "appWrite.js"
          )
        );
        crashlytics().log(e);
        throw new Error("CANNOT_UPDATE_PREFERENCES");
      }
    },
  },
  loans: {
    getAllLoans: {
      execute: async (customerId) => {
        crashlytics().log(
          ErrorUtil.createLog(
            "execute method starts here",
            { customerId },
            "execute()",
            "appWrite.js"
          )
        );
        try {
          const payload = JSON.stringify({
            data: {
              type: "customerLoans",
              customerId,
            },
          });
          const executionDetails = await sdk.functions.createExecution(
            config.appWrite.lmsManagementFunctionId,
            payload
          );
          return executionDetails.$id;
        } catch (e) {
          crashlytics().log(
            ErrorUtil.createError(
              e,
              e.message,
              e.message,
              { customerId },
              "execute()",
              "appWrite.js"
            )
          );
          crashlytics().log(e);
          throw new Error("CANNOT_EXECUTE_GET_LOANS");
        }
      },
      get: async (executionId) => {
        crashlytics().log(
          ErrorUtil.createLog(
            "get method starts here",
            { executionId },
            "get()",
            "appWrite.js"
          )
        );
        try {
          const responseWithStatus = await getCompletionStatus(
            config.appWrite.lmsManagementFunctionId,
            executionId
          );
          if (responseWithStatus.status === "completed") {
            const allLoans = unpackData(responseWithStatus.stdout);
            return allLoans;
          } else {
            throw new Error("CANNOT_GET_ALL_LOANS_FOR_CUSTOMER");
          }
        } catch (e) {
          crashlytics().log(
            ErrorUtil.createError(
              e,
              e.message,
              e.message,
              { executionId },
              "get()",
              "appWrite.js"
            )
          );
          crashlytics().log(e);
          throw new Error("CANNOT_GET_ALL_LOANS");
        }
      },
    },
  },
  loanApplication: {
    createLoanApplicationId: {
      execute: async () => {
        crashlytics().log(
          ErrorUtil.createLog(
            "execute method starts here",
            undefined,
            "execute()",
            "appWrite.js"
          )
        );
        try {
          const executionDetails = await sdk.functions.createExecution(
            config.appWrite.loanApplicationIdGenerationFunctionId,
            config.LOAN_APPLICATION_TYPE
          );
          return executionDetails.$id;
        } catch (e) {
          crashlytics().log(
            ErrorUtil.createError(
              e,
              e.message,
              e.message,
              undefined,
              "execute()",
              "appWrite.js"
            )
          );
          crashlytics().log(e);
          throw new Error("CANNOT_EXECUTE_LOAN_APP_ID");
        }
      },
      get: async (executionId) => {
        crashlytics().log(
          ErrorUtil.createLog(
            "get method starts here",
            { executionId },
            "get()",
            "appWrite.js"
          )
        );

        try {
          const responseWithStatus = await getCompletionStatus(
            config.appWrite.loanApplicationIdGenerationFunctionId,
            executionId
          );
          if (responseWithStatus.status === "completed") {
            const { loanApplicationId } = JSON.parse(responseWithStatus.stdout);
            return loanApplicationId.toString();
          } else {
            throw new Error("CANNOT_GET_LOAN_APPLICATION_ID");
          }
        } catch (e) {
          crashlytics().log(
            ErrorUtil.createError(
              e,
              e.message,
              e.message,
              { executionId },
              "get()",
              "appWrite.js"
            )
          );

          crashlytics().log(e);
          throw new Error("CANNOT_GET_LOAN_APP_ID");
        }
      },
    },
    get: async (loanApplicationId) => {
      crashlytics().log(
        ErrorUtil.createLog(
          "get method starts here",
          { loanApplicationId },
          "get()",
          "appWrite.js"
        )
      );
      const { appWrite } = config;
      try {
        const loanApplication = await sdk.database.getDocument(
          appWrite.loanApplicationCollectionId,
          loanApplicationId
        );
        if (!isEmpty(loanApplication)) {
          Object.keys(loanApplication).forEach((key) => {
            if (isInvalidValue(loanApplication[key])) {
              delete loanApplication[key];
            }
          });
          return loanApplication;
        } else {
          return {};
        }
      } catch (e) {
        crashlytics().log(
          ErrorUtil.createError(
            e,
            e.message,
            e.message,
            { loanApplicationId },
            "get()",
            "appWrite.js"
          )
        );
        crashlytics().log(e);
        throw new Error("CANNOT_GET_LOAN_APPLICATION");
      }
    },
    getAllLoanApplications: async (customerId) => {
      crashlytics().log(
        ErrorUtil.createLog(
          "getAllLoanApplications method starts here",
          { customerId },
          "getAllLoanApplications()",
          "appWrite.js"
        )
      );
      const { appWrite } = config;
      const loanAppQuery = [Query.equal("customerId", customerId)];
      try {
        const loanApplication = await sdk.database.listDocuments(
          appWrite.loanApplicationCollectionId,
          loanAppQuery
        );
        if (loanApplication.documents.length > 0) {
          loanApplication.documents.forEach((la) => {
            Object.keys(la).forEach((key) => {
              if (isInvalidValue(la[key])) {
                delete la[key];
              }
            });
          });
          return loanApplication.documents;
        } else {
          return [];
        }
      } catch (e) {
        crashlytics().log(
          ErrorUtil.createError(
            e,
            e.message,
            e.message,
            { customerId },
            "getAllLoanApplications()",
            "appWrite.js"
          )
        );

        crashlytics().log(e);
        throw new Error("CANNOT_GET_ALL_LOAN_APPLICATIONS");
      }
    },
    create: async (formData, userId) => {
      crashlytics().log(
        ErrorUtil.createLog(
          "create method starts here",
          { formData, userId },
          "create()",
          "appWrite.js"
        )
      );
      const { appWrite } = config;
      if (
        isUndefined(formData.loanApplicationId) ||
        formData.loanApplicationId.length === 0
      ) {
        formData.loanApplicationId = "dummy";
      }
      formData.createdOn = Date.now();
      formData.updatedOn = Date.now();
      const loanApplication = await sdk.database.createDocument(
        appWrite.loanApplicationCollectionId,
        "unique()",
        formData,
        [`user:${userId}`],
        [`user:${userId}`]
      );
      Object.keys(loanApplication).forEach((key) => {
        if (isInvalidValue(loanApplication[key])) {
          delete loanApplication[key];
        }
      });
      return loanApplication;
    },
    // FIXME: Change this
    getAllOffers: {
      execute: async (loanApplicationId) => {
        crashlytics().log(
          ErrorUtil.createLog(
            "execute method starts here",
            { loanApplicationId },
            "execute()",
            "appWrite.js"
          )
        );
        try {
          const executionDetails = await sdk.functions.createExecution(
            config.appWrite.retrieveLoanOffersFunctionId,
            loanApplicationId
          );
          return executionDetails.$id;
        } catch (err) {
          crashlytics().log(
            ErrorUtil.createError(
              err,
              err.message,
              err.message,
              { loanApplicationId },
              "execute()",
              "appWrite.js"
            )
          );
          crashlytics().log(err);
          throw new Error("CANNOT_CREATE_LOAN_OFFER_EXECUTION");
        }
      },
      get: async (executionId) => {
        crashlytics().log(
          ErrorUtil.createLog(
            "execute method starts here",
            { executionId },
            "execute()",
            "appWrite.js"
          )
        );
        try {
          const responseWithStatus = await getCompletionStatus(
            config.appWrite.retrieveLoanOffersFunctionId,
            executionId
          );
          if (responseWithStatus === "completed") {
            const loanDeatails = JSON.parse(responseWithStatus.stdout);
            return loanDeatails;
          } else {
            throw new Error("CANNOT_GET_LOAN_OFFER_DETAILS");
          }
        } catch (err) {
          crashlytics().log(
            ErrorUtil.createError(
              err,
              err.message,
              err.message,
              { executionId },
              "execute()",
              "appWrite.js"
            )
          );
          crashlytics().log(err);
          throw new Error("CANNOT_GET_LOAN_OFFER_DETAILS");
        }
      },
    },
  },
};

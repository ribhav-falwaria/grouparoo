import { Appwrite, Query } from 'appwrite'
import { config } from '../config'
import isUndefined from 'lodash.isundefined'
import isNull from 'lodash.isnull'
import isEmpty from 'lodash.isempty'
const sdk = new Appwrite()
const isInvalidValue = (val) => {
  return isUndefined(val) || isNull(val) || val === 'np' || val === -1 || val.length === 0
}
// Fill with your Appwrite API endpoint and Project ID!
sdk.setEndpoint(config.appWrite.url).setProject(config.appWrite.projectId)

const getCompletionStatus = async (functionId, executionId) => {
  let completed = false
  let responseWithStatus
  while (!completed) {
    responseWithStatus = await sdk.functions.getExecution(functionId, executionId)
    if (responseWithStatus.status === 'completed' || responseWithStatus === 'failed') {
      completed = true
    }
    if (!completed) {
      await new Promise(resolve => setTimeout(resolve, 20))
    }
  }
  return responseWithStatus
}
export const appApi = {
  borrowingEntities: {
    get: async () => {
      try {
        const borrowingEntities = await sdk.database.listDocuments(config.appWrite.borrowingEntitiesCollectionId)
        return borrowingEntities.documents
      } catch (err) {
        console.log(err)
        throw new Error('CANNOT_GET_BORROWING_ENTITIES')
      }
    }
  },
  loanTypes: {
    getAll: async () => {
      try {
        const response = await sdk.database.listDocuments(config.appWrite.loanTypesCollectionId)
        return response.documents
      } catch (e) {
        console.log(e)
        throw new Error('CANNOT_GET_LOAN_TYPES')
      }
    }
  },
  loanProducts: {
    getAll: {
      execute: async () => {
        try {
          const executionDetails = await sdk.functions.createExecution(config.appWrite.loanProductMetadataFunctionId)
          return executionDetails.$id
        } catch (err) {
          console.log(err)
          throw new Error('CANNOT_GET_LOAN_PRODUCTS_EXECUTION_ID')
        }
      },
      get: async (executionId) => {
        const responseWithStatus = await getCompletionStatus(config.appWrite.loanProductMetadataFunctionId, executionId)
        if (responseWithStatus.status === 'completed') {
          const allProducts = JSON.parse(responseWithStatus.stdout)
          return allProducts
        } else {
          throw new Error('CANNOT_GET_ALL_PRODUCTS')
        }
      }
    }
  },
  user: {
    get: async () => {
      try {
        const account = await sdk.account.get()
        return account
      } catch (e) {
        console.log(e)
        throw new Error('NO_LOGGEDIN_USER')
      }
    },
    updatePassword: async (password) => {
      try {
        await sdk.account.updatePassword(password)
      } catch (e) {
        console.log(e)
        throw new Error('CANNOT_SET_PASSWORD')
      }
    },
    updateAccountEmail: async (email) => {
      try {
        await sdk.account.updateEmail(email)
      } catch (e) {
        throw new Error('CANNOT_UPDATE_EMAIL')
      }
    },
    getJwtToken: async () => {
      try {
        const jwt = await sdk.account.createJWT()
        return jwt
      } catch (e) {
        console.log(e)
        throw new Error('CANNOT_CREATE_JWT')
      }
    }
  },
  auth: {
    login: async (email, password) => {
      try {
        await sdk.account.createSession(email, password)
        const user = await sdk.account.get()
        return user
      } catch (e) {
        console.log(e)
        throw new Error('CANNOT_CREATE_SESSION')
      }
    },
    register: async ({ email, password, fullName }) => {
      try {
        await sdk.account.create('unique()', email, password, fullName)
        await sdk.account.createSession(email, password)
        const user = await sdk.account.get()
        return user
      } catch (e) {
        if (e.message === 'Account already exists') {
          throw new Error('ACCOUNT_EXISTS')
        } else {
          console.log(e)
          throw new Error('CANNOT_REGISTER_USER')
        }
      }
    }
  },
  customer: {
    getExistingAddresses: async (customerId) => {
      try {
        const query = Query.equal('customerId', customerId)
        const response = await sdk.data.listDocuments(config.appWrite.addressCollectionId, query)
        return response.documents
      } catch (e) {
        console.log(e)
        throw new Error('CANNOT_GET_ADDRESSES_FOR_CUSTOMERID')
      }
    },
    getCustomerByUserId: async (userId) => {
      const { appWrite } = config
      const customerQuery = [
        Query.equal('userId', userId)
      ]
      try {
        const response = await sdk.database.listDocuments(appWrite.customersCollectionId, customerQuery)
        if (response.documents.length > 0) {
          const customerData = response.documents[0]
          // remove all default values
          Object.keys(customerData).forEach(key => {
            if (customerData[key] === 'np') {
              customerData[key] = undefined
            }
          })
          return customerData
        } else {
          return {}
        }
      } catch (e) {
        console.log(e)
        throw new Error('CANNOT_GET_CUSTOMER_BY_USREID')
      }
    },
    get: async (id) => {
      const { appWrite } = config
      try {
        const customerData = await sdk.database.getDocument(appWrite.customersCollectionId, id)
        return customerData
      } catch (e) {
        console.log(e)
        throw new Error('CANNOT_GET_CUSTOMER_BY_ID')
      }
    },
    create: async (customerData, userId) => {
      const { appWrite } = config
      customerData.createdOn = Date.now()
      customerData.updatedOn = Date.now()
      try {
        const data = await sdk.database.createDocument(
          appWrite.customersCollectionId,
          'unique()',
          customerData,
          [`user:${userId}`],
          [`user:${userId}`]
        )
        customerData.$id = data.$id
        return data
      } catch (e) {
        console.log(e)
        throw new Error('CANNOT_CREATE_NEW_CUSTOMER')
      }
    }
  },
  preferences: {
    get: async () => {
      try {
        const preferences = await sdk.account.getPrefs()
        return preferences
      } catch (e) {
        console.log(e)
        throw new Error('CANNOT_GET_PREFERENCES')
      }
    },
    set: async (preferences) => {
      try {
        const prefs = await sdk.account.updatePrefs(preferences)
        return prefs
      } catch (e) {
        console.log(e)
        throw new Error('CANNOT_UPDATE_PREFERENCES')
      }
    }
  },
  loans: {
    getAllLoans: {
      execute: async (customerId) => {
        try {
          const payload = JSON.stringify(
            {
              data: {
                type: 'customerLoans',
                customerId
              }
            }
          )
          const executionDetails = await sdk.functions.createExecution(config.appWrite.lmsManagementFunctionId, payload)
          return executionDetails.$id
        } catch (e) {
          console.log(e)
          throw new Error('CANNOT_EXECUTE_GET_LOANS')
        }
      },
      get: async (executionId) => {
        try {
          const responseWithStatus = await getCompletionStatus(config.appWrite.lmsManagementFunctionId, executionId)
          if (responseWithStatus.status === 'completed') {
            const allLoans = JSON.parse(responseWithStatus.stdout)
            return allLoans
          } else {
            throw new Error('CANNOT_GET_ALL_LOANS_FOR_CUSTOMER')
          }
        } catch (e) {
          console.log(e)
          throw new Error('CANNOT_GET_ALL_LOANS')
        }
      }
    }
  },
  loanApplication: {
    createLoanApplicationId: {
      execute: async () => {
        try {
          const executionDetails = await sdk.functions.createExecution(config.appWrite.loanApplicationIdGenerationFunctionId, config.LOAN_APPLICATION_TYPE)
          return executionDetails.$id
        } catch (e) {
          console.log(e)
          throw new Error('CANNOT_EXECUTE_LOAN_APP_ID')
        }
      },
      get: async (executionId) => {
        try {
          const responseWithStatus = await getCompletionStatus(config.appWrite.loanApplicationIdGenerationFunctionId, executionId)
          if (responseWithStatus.status === 'completed') {
            const { loanApplicationId } = JSON.parse(responseWithStatus.stdout)
            return loanApplicationId.toString()
          } else {
            throw new Error('CANNOT_GET_LOAN_APPLICATION_ID')
          }
        } catch (e) {
          console.log(e)
          throw new Error('CANNOT_GET_LOAN_APP_ID')
        }
      }
    },
    get: async (loanApplicationId) => {
      const { appWrite } = config
      try {
        const loanApplication = await sdk.database.getDocument(appWrite.loanApplicationCollectionId, loanApplicationId)
        if (!isEmpty(loanApplication)) {
          Object.keys(loanApplication).forEach(key => {
            if (isInvalidValue(loanApplication[key])) {
              delete loanApplication[key]
            }
          })
          return loanApplication
        } else {
          return {}
        }
      } catch (e) {
        console.log(e)
        throw new Error('CANNOT_GET_LOAN_APPLICATION')
      }
    },
    getAllLoanApplications: async (customerId) => {
      const { appWrite } = config
      const loanAppQuery = [
        Query.equal('customerId', customerId)
      ]
      try {
        const loanApplication = await sdk.database.listDocuments(appWrite.loanApplicationCollectionId, loanAppQuery)
        if (loanApplication.documents.length > 0) {
          loanApplication.documents.forEach(la => {
            Object.keys(la).forEach(key => {
              if (isInvalidValue(la[key])) {
                delete la[key]
              }
            })
          })
          return loanApplication.documents
        } else {
          return []
        }
      } catch (e) {
        console.log(e)
        throw new Error('CANNOT_GET_ALL_LOAN_APPLICATIONS')
      }
    },
    create: async (formData, userId) => {
      const { appWrite } = config
      if (isUndefined(formData.loanApplicationId) || formData.loanApplicationId.length === 0) {
        formData.loanApplicationId = 'dummy'
      }
      formData.createdOn = Date.now()
      formData.updatedOn = Date.now()
      const loanApplication = await sdk.database.createDocument(
        appWrite.loanApplicationCollectionId,
        'unique()',
        formData,
        [`user:${userId}`],
        [`user:${userId}`]
      )
      Object.keys(loanApplication).forEach(key => {
        if (isInvalidValue(loanApplication[key])) {
          delete loanApplication[key]
        }
      })
      return loanApplication
    },
    // FIXME: Change this
    getAllOffers: {
      execute: async (loanApplicationId) => {
        try {
          const executionDetails = await sdk.functions.createExecution(config.appWrite.retrieveLoanOffersFunctionId, loanApplicationId)
          return executionDetails.$id
        } catch (err) {
          console.log(err)
          throw new Error('CANNOT_CREATE_LOAN_OFFER_EXECUTION')
        }
      },
      get: async (executionId) => {
        try {
          const responseWithStatus = await getCompletionStatus(config.appWrite.retrieveLoanOffersFunctionId, executionId)
          if (responseWithStatus === 'completed') {
            const loanDeatails = JSON.parse(responseWithStatus.stdout)
            return loanDeatails
          } else {
            throw new Error('CANNOT_GET_LOAN_OFFER_DETAILS')
          }
        } catch (err) {
          console.log(err)
          throw new Error('CANNOT_GET_LOAN_OFFER_DETAILS')
        }
      }
    }
  }
}

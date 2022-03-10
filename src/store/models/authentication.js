import { AppStorage } from '../../services/app-storage.service'
import apiService from '../../apiService'
import { config } from '../../config'
import { getAppFcmToken } from '../../services/push.notifications'
const authentication = {
  name: 'authentication',
  state: {
    isLoggedIn: false, // FIXME: Made this true for things to work
    id: '',
    userName: '',
    isFirstTime: true
  },
  selectors: {
    isUserLoggedIn: select => (rootState) => {
      return rootState.authentication.isLoggedIn
    },
    isFirstTime: select => (rootState) => {
      return rootState.authentication.isFirstTime
    }
  },
  reducers: {
    'customer/setCustomer': (state, { customer, isFirstTime }) => {
      state.isLoggedIn = true
      state.id = customer.$id
      state.userName = customer.email
      state.isFirstTime = isFirstTime
      return state
    },
    loginFailed: (state, { isFirstTime, accountExists }) => {
      state.isLoggedIn = false
      state.isFirstTime = isFirstTime
      state.accountExists = accountExists
      return state
    }
  },
  effects: dispatch => ({
    async signInUser ({ email, password }, rootState) {
      try {
        const isFirstTime = await AppStorage.getIsFirstTime('default')
        const customer = await apiService.appApi.auth.login(email, password)
        const customerDetails = await apiService.appApi.customer.getCustomerByUserId(customer.$id)
        const loanApplications = await apiService.appApi.loanApplication.getAllLoanApplications(customerDetails.$id)
        Promise.all([
          dispatch.customer.setCustomer({ customer, isFirstTime, customerDetails, loanApplications }),
          dispatch.loanProducts.getAllProducts(),
          dispatch.loanTypes.getAllLoanTypes(),
          dispatch.borrowingEntities.getBorrowingEntities()
        ])
      } catch (e) {
        // FIXME: Endpoint to push errors
        return dispatch.appStates.setSigninError({ signinError: true })
      }
    },
    async checkAndAuthenticateUser (payload, rootState) {
      let isFirstTime = await AppStorage.getIsFirstTime('default')
      isFirstTime = isFirstTime === 'default' ? true : isFirstTime
      if (isFirstTime) {
        return dispatch.authentication.loginFailed({ isFirstTime })
      }
      try {
        const customer = await apiService.appApi.user.get()
        await AppStorage.setFirstTime(false)
        const customerDetails = await apiService.appApi.customer.getCustomerByUserId(customer.$id)
        const loanApplications = await apiService.appApi.loanApplication.getAllLoanApplications(customerDetails.$id)

        return Promise.all([
          dispatch.customer.setCustomer({
            customer,
            customerDetails,
            loanApplications,
            prefs: customer.prefs,
            isFirstTime: false
          }),
          dispatch.loanProducts.getAllProducts(),
          dispatch.loanTypes.getAllLoanTypes(),
          dispatch.borrowingEntities.getBorrowingEntities()
        ])
      } catch (e) {
        // Not logged in or not registered.
        console.log(e)
        dispatch.authentication.loginFailed({ isFirstTime })
      }
    },
    async registerOrUpdateUser ({ formData, password }, rootState) {
      // Can be an existing user or a new user
      // first try to login with default password
      const isFirstTime = await AppStorage.getIsFirstTime('default')
      let customer
      try {
        customer = await apiService.appApi.auth.login(formData.email, config.DEFAULT_PASSWORD)
        await apiService.appApi.user.updatePassword(password)
        await AppStorage.setFirstTime(false)
      } catch (e) {
        /// Probably user does not exist in the system
        try {
          customer = await apiService.appApi.auth.register({
            email: formData.email,
            password,
            fullName: formData.fullName
          })
          await AppStorage.setFirstTime(false)
        } catch (e) {
          // now something is really wrong
          let accountExists = false
          console.log(e.stack)
          if (e.message === 'ACCOUNT_EXISTS') {
            accountExists = true
          }
          return dispatch.authentication.loginFailed({ isFirstTime, accountExists })
        }
        // Now that we have the customer, we need to also get the customer details
        const prefs = await apiService.appApi.preferences.set({
          langauage: 'en',
          theme: 'light'
        })
        try {
          let customerDetails
          customerDetails = await apiService.appApi.customer.getCustomerByUserId(customer.$id)
          if (Object.keys(customerDetails).length === 0) {
            // Create new customer in the database.
            let fcmId = await AppStorage.getFcmToken('default')
            // This should not be default
            if (fcmId === 'default') {
              // Get fcmId again here
              fcmId = await getAppFcmToken()
              await AppStorage.setFcmToken(fcmId)
            }
            customerDetails = await apiService.appApi.customer.create({
              userId: customer.$id,
              name: formData.fullName,
              primaryEmail: formData.email,
              primaryPhone: formData.primaryPhone,
              isPrimaryPhoneVerified: formData.isPrimaryPhoneVerified || 'no',
              fcmId
            }, customer.$id)
          }
          Promise.all([
            dispatch.customer.setCustomer({ customer, customerDetails, prefs, isFirstTime: false, loanApplications: [] }),
            dispatch.loanProducts.getAllProducts(),
            dispatch.loanTypes.getAllLoanTypes(),
            dispatch.borrowingEntities.getBorrowingEntities()
          ])
        } catch (e) {
          console.log(e.stack)
          throw new Error('CANNOT_CREATE_CUSTOMER_DETAILS')
        }
      }
    }
  })
}
export default authentication

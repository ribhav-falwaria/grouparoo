import jwt_decode from 'jwt-decode'
import apiService from '../../apiService'
import isUndefined from 'lodash.isundefined'

const validateJwt = (jwt) => {
  let valid = true
  if (!isUndefined(jwt)) {
    const decodedJwt = jwt_decode(jwt)
    if (Date.now() >= decodedJwt.exp * 1000) {
      valid = false
    }
  } else {
    valid = false
  }
  return valid
}
const customer = {
  name: 'customer',
  state: {
  },
  selectors: {
    getCustomer: select => (rootState) => {
      return rootState.customer
    },
    getJwt: select => (rootState) => {
      if (validateJwt(rootState.customer.jwt)) {
        return rootState.customer.jwt
      }
    }
  },
  reducers: {
    setCustomer: (state, { customer, customerDetails, prefs }) => {
      state = customer
      state.id = customer.$id
      const nameSplit = customer.name.split(' ')
      state.firstName = nameSplit[0]
      state.lastName = nameSplit.slice(1, nameSplit.length).join(' ')
      state.customerDetails = customerDetails
      state.prefs = prefs
      return state
    },
    updateCustomer: (state, payload) => {
      return state
    },
    loadDummyData: (state) => {
      state = {
        firstName: ''
      }
    },
    setJwt: (state, { jwt }) => {
      state.jwt = jwt
      return state
    }
  },
  effects: dispatch => ({
    async getCustomerJwt (payload, rootState) {
      const { customer } = rootState
      if (!validateJwt(customer.jwt)) {
        const { jwt } = await apiService.appApi.user.getJwtToken()
        dispatch.customer.setJwt({ jwt })
      }
    },
    async getCustomerData (payload, rootState) {},
    async getCustomerLoanApplications (payload, rootState) {},
    async getCustomerFormData (payload, rootState) {},
    async getCustomerPreferences (payload, rootState) {}
  })
}
export default customer

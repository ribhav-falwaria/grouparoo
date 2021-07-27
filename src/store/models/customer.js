const dummyCustomer = {
  firstName: 'Goshi',
  lastName: 'Doshi',
  primaryEmail: 'goshi@doshi.com',
  primaryPhone: '+91 9987388937'
}

const customer = {
  name: 'customer',
  state: {
    ...dummyCustomer
  },
  selectors: (slice, createSelector, hasProps) => ({
    getCustomer () {
      return slice(customer => customer)
    }
  }),
  reducers: {
    updateCustomer: (state, payload) => {
      return state
    },
    loadDummyData: (state) => {
      state = {
        firstName: ''
      }
    }
  },
  effects: dispatch => ({
    async getCustmer (payload, rootState) {},
    async updateCustomer (payload, rootState) {},
    async createCustomer (payload, rootState) {}
  })
}
export default customer


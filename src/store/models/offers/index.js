import { testOffers } from './test'
const offers = {
  name: 'offers',
  selectors: {
    getOffers: select => rootState => {
      return rootState.offers
    }
  },
  state: [],
  reducers: {
    setOffers: (state, offers) => {
      state = [...offers]
      return state
    }
  },
  effects: (dispatch) => ({
    getAllOffers (customerId, rootState) {
      dispatch.offers.setOffers(testOffers)
    }
  })
}
export default offers

import appConstants from '../constants/appConstants'

const cache = {
  name: 'cache',
  state: {
    state: [],
    city: {},
    authToken: appConstants.authToken
  },
  reducers: {
    setState: (state, payload) => {
      state.state = payload
      return state
    },
    setCity: (state, { stateCode, cities }) => {
      state.city[stateCode] = cities
      return state
    },
    setAuthToken: (state, payload) => {
      return {
        ...state,
        authToken: payload
      }
    }
  }
}
export default cache

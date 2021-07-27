const authentication = {
  name: 'authentication',
  state: {
    isLoggedIn: false, // FIXME: Made this true for things to work
    _id: '',
    userName: '',
    token: ''
  },
  selectors: (slice, createSelector, hasProps) => ({
    isLoggedIn () {
      return slice(authentication => authentication.isLoggedIn)
    }
  }),
  reducers: {
    loginSuccess: (state, payload) => {
      return state
    },
    loginFailed: (state, payload) => {

    }
  },
  effects: dispatch => ({
    async loginRequest (payload, rootState) {},
    async Logout (paylod, rootState) {}
  })
}
export default authentication

import { AppStorage } from '../../services/app-storage.service'
const authentication = {
  name: 'authentication',
  state: {
    isLoggedIn: false, // FIXME: Made this true for things to work
    id: '',
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
    async checkAndAuthenticateUser (payload, rootState) {
      const jwtToken = await AppStorage.getClientJwt('clientToken', 'default')
      if (jwtToken === 'default') {
        // check if there is a firebase token provided
      }
    },
    async Logout (paylod, rootState) {}
  })
}
export default authentication

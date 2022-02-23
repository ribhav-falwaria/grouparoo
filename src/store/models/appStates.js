const appStates = {
  name: 'appStates',
  state: {
    signinError: false
  },
  selectors: {
    getSigninError: (select) => (rootState) => {
      return rootState.appStates.signinError
    }
  },
  effects: {
    setSigninError: (state, { signinError }) => {
      state = Object.assign({}, state)
      state.signinError = signinError
      return state
    }
  }
}

export default appStates

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
  reducers: {
    UpdateSignInError: (state, { signinError }) => {
      state.signinError = signinError
      return state
    }
  },
  effects: dispatch => ({
    setSigninError: ({ signinError }, state) => {
      dispatch.appStates.UpdateSignInError({ signinError })
    }
  })
}

export default appStates

const theme = {
  name: 'theme',
  state: {
    theme: 'light'
  },
  selectors: (slice, createSelector, hasProps) => ({
    getTheme () {
      return slice(theme => theme.theme)
    }
  }),
  reducers: {
    setDarkTheme (state) {
      state.theme = 'dark'
      return state
    },
    setLightTheme (state) {
      state.theme = 'light'
      return state
    },
    toggleTheme (state) {
      state.theme = (state.theme === 'dark') ? 'light' : 'dark'
      return state
    }
  }
}
export default theme

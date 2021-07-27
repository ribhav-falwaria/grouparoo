
const settings = {
  name: 'settings',
  state: {
    language: 'en',
    supportLanguages: {
      en: 'English',
      hi: 'Hindi',
      kn: 'Kannada',
      ta: 'Tamil',
      te: 'Telugu',
      mr: 'Marathi',
      bn: 'Bengali'
    }
  },
  selectors: {
    getLanguage: () => (rootState) => rootState.settings.language
  },
  reducers: {
    setLanguage: (state, language) => {
      state.language = language
      return language
    }
  }
}

export default settings

const theme = {
  name: "theme",
  state: {
    theme: "light",
  },
  selectors: (slice, createSelector, hasProps) => ({
    getTheme() {
      crashlytics().log(
        ErrorUtil.createLog(
          " getTheme method starts here",
          undefined,
          "getTheme()",
          "theme.js"
        )
      );
      return slice((theme) => theme.theme);
    },
  }),
  reducers: {
    setDarkTheme(state) {
      crashlytics().log(
        ErrorUtil.createLog(
          " setDarkTheme method starts here",
          { state },
          "setDarkTheme()",
          "theme.js"
        )
      );
      state.theme = "dark";
      return state;
    },
    setLightTheme(state) {
      crashlytics().log(
        ErrorUtil.createLog(
          " setLightTheme method starts here",
          { state },
          "setLightTheme()",
          "theme.js"
        )
      );
      state.theme = "light";
      return state;
    },
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      return state;
    },
  },
};
export default theme;

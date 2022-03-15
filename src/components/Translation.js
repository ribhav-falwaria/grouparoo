import AsyncStorage from "@react-native-community/async-storage"; // 1
import React, { createContext, useState, useEffect } from "react";
import LocalizedStrings from "react-native-localization"; // 2
import * as RNLocalize from "react-native-localize"; // 3
import { languages } from "../localization";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";

// From https://lokalise.com/blog/react-native-localization/
// FIXME: Need to implement the settings part.
const DEFAULT_LANGUAGE = "en";
const APP_LANGUAGE = "appLanguage";

const translations = new LocalizedStrings(languages); // 4

export const LocalizationContext = createContext({
  // 5
  translations,
  setAppLanguage: () => {}, // 6
  appLanguage: DEFAULT_LANGUAGE, // 7
  initializeAppLanguage: () => {}, // 8
});

export const LocalizationProvider = ({ children }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " LocalizationProvider method starts here",
      { children },
      "LocalizationProvider()",
      "Translation.js"
    )
  );
  // 9
  const [appLanguage, setAppLanguage] = useState(DEFAULT_LANGUAGE);

  // 11
  const setLanguage = (language) => {
    translations.setLanguage(language);
    setAppLanguage(language);
    AsyncStorage.setItem(APP_LANGUAGE, language);
  };

  // 12
  const initializeAppLanguage = async () => {
    crashlytics().log(
      ErrorUtil.createLog(
        " initializeAppLanguage method starts here",
        undefined,
        "initializeAppLanguage()",
        "Translation.js"
      )
    );
    const currentLanguage = await AsyncStorage.getItem(APP_LANGUAGE);

    if (currentLanguage) {
      setLanguage(currentLanguage);
    } else {
      let localeCode = DEFAULT_LANGUAGE;
      const supportedLocaleCodes = translations.getAvailableLanguages();
      const phoneLocaleCodes = RNLocalize.getLocales().map(
        (locale) => locale.languageCode
      );
      phoneLocaleCodes.some((code) => {
        if (supportedLocaleCodes.includes(code)) {
          localeCode = code;
          return true;
        }
        return false;
      });
      setLanguage(localeCode);
    }
  };

  return (
    <LocalizationContext.Provider
      value={{
        translations,
        setAppLanguage: setLanguage, // 10
        appLanguage,
        initializeAppLanguage,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

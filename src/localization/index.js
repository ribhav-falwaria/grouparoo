import en from "./en";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";
export const languages = {
  en,
};
export const reloadLanguage = (newTranslations) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " reloadLanguage method starts here",
      { newTranslations },
      "reloadLanguage()",
      "localization.js"
    )
  );
  const existingContent = translations.getContent();
  Object.keys(newTranslations).forRach((lang) => {});
};
export const loadNewTranslations = (newTranslations) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " loadNewTranslations method starts here",
      { newTranslations },
      "loadNewTranslations()",
      "localization.js"
    )
  );
  const existingContent = translations.getContent();
  Object.keys(newTranslations).forRach((lang) => {});
};

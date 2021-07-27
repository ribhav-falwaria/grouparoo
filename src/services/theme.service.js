import React from 'react';
import { Appearance, AppearancePreferences, ColorSchemeName } from 'react-native-appearance';
import { AppStorage } from './app-storage.service';

// export type Mapping = 'eva' | 'material';
// export type Theme = 'light' | 'dark' | 'brand';

// export interface MappingContextValue {
//   /**
//    * Should return the name of current mapping
//    */
//   currentMapping: Mapping;
//   /**
//    * Should switch mapping globally
//    */
//   setCurrentMapping: (mapping: Mapping) => void;
//   /**
//    * Should return true if current mapping is Eva
//    */
//   isEva: () => boolean;
// }

// export interface ThemeContextValue {
//   /**
//    * Should return the name of current theme
//    */
//   currentTheme: Theme;
//   /**
//    * Should switch theme globally
//    */
//   setCurrentTheme: (theme: Theme) => void;
//   /**
//    * Should return true if current theme is dark or dark mode enabled
//    */
//   isDarkMode: () => boolean;
//   /**
//    * Should create a theme based on current
//    */
//   createTheme: (upstreamTheme: Theme) => any;
// }

export class Theming {
  /**
   * @see MappingContextValue
   *
   * Creates context value with standard configuration:
   *
   * - `currentMapping` is set depending `mapping` argument.
   * - `setCurrentMapping` will be called when device appearance is changed.
   * - `isEva` returns true if current mapping is `eva`.
   *
   * @param {Record<Mapping, any>} mappings - set of mappings available in app.
   * @param {Mapping} mapping - mapping name to use. Could be `eva` or `material`.
   *
   * @returns {[MappingContextValue, any]} - array of two values:
   * - value to be set in `MappingContext.Provider`
   * - and `mapping` and `customMapping` to be set in `ApplicationProvider`.
   */
  static useMapping = (mappings,
                       mapping) => {

    /**
     * Currently, there is no way to switch during the run time,
     * so the Async Storage and Expo Updates is used.
     *
     * Writes mapping to AsyncStorage and reloads an app
     */
    const setCurrentMapping = (nextMapping) => {
      AppStorage.setMapping(nextMapping);
    };

    const isEva = () => {
      return mapping === 'eva';
    };

    const mappingContext = {
      currentMapping: mapping,
      setCurrentMapping,
      isEva,
    };

    return [mappingContext, mappings[mapping]];
  };

  /**
   * @see ThemeContextValue
   *
   * Creates context value with standard configuration:
   *
   * - `currentTheme` is set depending on current appearance set on the device.
   * - `setCurrentTheme` will be called when device appearance is changed.
   * - `isDarkMode` returns true if current device appearance is `dark`.
   * - `createTheme` will take an `upstreamTheme` and merge it with `currentTheme`.
   *
   * @param {Record<Mapping, Record<Theme, any>>} themes - set of themes available in app.
   * @param {Mapping} mapping - mapping name to use. Could be `Eva` or `Material`.
   * @param {Theme} theme - name of theme that will be applied if there is no preferred appearance set.
   *
   * @returns {[ThemeContextValue, any]} - array of two values:
   * - value to be set in `ThemeContext.Provider`
   * - and theme to be set in `ApplicationProvider`.
   */
  static useTheming (themes, mapping, theme) {

    const [currentTheme, setCurrentTheme] = React.useState(theme);

    React.useEffect(() => {
      const subscription = Appearance.addChangeListener((preferences) => {
        const appearanceTheme = Theming.createAppearanceTheme(
          preferences.colorScheme,
          theme,
        );
        setCurrentTheme(appearanceTheme);
      });

      return () => subscription.remove();
    }, []);

    const isDarkMode = () => {
      return currentTheme === 'dark';
    };

    const createTheme = (upstreamTheme) => {
      return { ...themes[mapping][currentTheme], ...themes[mapping][upstreamTheme][currentTheme] };
    };

    const themeContext = {
      currentTheme,
      setCurrentTheme: (nextTheme) => {
        AppStorage.setTheme(nextTheme);
        setCurrentTheme(nextTheme);
      },
      isDarkMode,
      createTheme,
    };

    return [themeContext, themes[mapping][currentTheme]];
  };

  static useTheme (upstreamTheme) {
    const themeContext = React.useContext(Theming.ThemeContext);
    return themeContext.createTheme(upstreamTheme);
  };

  static createAppearanceTheme (appearance, preferredTheme) {
    if (appearance === 'no-preference') {
      return preferredTheme;
    }
    return appearance;
  };
}

Theming.MappingContext = React.createContext(null)
Theming.ThemeContext = React.createContext(null)




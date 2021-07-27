/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the UI Kitten customermobileapp
 * https://github.com/akveo/react-native-ui-kitten
 *
 * Documentation: https://akveo.github.io/react-native-ui-kitten/docs
 *
 * @format
 */

import React, { useContext } from 'react'
import AppNavigation from './navigation/App.Navigation'
import { LocalizationContext } from './components/Translation'

/**
 * Use any valid `name` property from eva icons (e.g `github`, or `heart-outline`)
 * https://akveo.github.io/eva-icons
 */

const MainApp = ({ props }) => {
  const { initializeAppLanguage } = useContext(LocalizationContext)
  initializeAppLanguage()

  return (
    <>
      <AppNavigation />
    </>
  )
}

export default MainApp

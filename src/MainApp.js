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
import { useRequest } from 'ahooks'
import { useStore, useSelector, useDispatch } from 'react-redux'

import AppNavigation from './navigation/App.Navigation'
import { LocalizationContext } from './components/Translation'

/**
 * Use any valid `name` property from eva icons (e.g `github`, or `heart-outline`)
 * https://akveo.github.io/eva-icons
 */
const checkAndAuthenticateUser = async(dispatch) => {
  await dispatch.authentication.checkAndAuthenticateUser()
}


const MainApp = ({ props }) => {
  const dispatch = useDispatch()
  const state = useSelector(state => state)

  const { initializeAppLanguage } = useContext(LocalizationContext)
  initializeAppLanguage()
  const loading = useRequest(() => checkAndAuthenticateUser(dispatch))
  return (
    <>
      <AppNavigation />
    </>
  )
}

export default MainApp

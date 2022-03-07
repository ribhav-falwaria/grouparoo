import React, { useState, useEffect } from 'react'
import { AppState, View, StyleSheet } from 'react-native'
import { BlurView, VibrancyView } from '@react-native-community/blur'

// render `inactive` screen via top-level `AppStateManager` component
const AppStateManager = (props) => {
  const [appState, setAppState] = useState(AppState.currentState)
  const handleAppStateChange = (state) => {
    setAppState(state)
  }
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)
    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])
  return (
    <>
      {appState === 'inactive' && (
        <View style={styles.container}>
          {props.children}
          <BlurView
            style={styles.absolute}
            blurType='light'
            blurAmount={10}
            reducedTransparencyFallbackColor='white'
          />
        </View>
      )}
      {appState !== 'inactive' && props.children}
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
})

export default AppStateManager

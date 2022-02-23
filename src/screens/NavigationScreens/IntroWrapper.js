import React from 'react'
import {
  TopNavigation,
  TopNavigationAction,
  useTheme,
  useStyleSheet,
  StyleService
} from '@ui-kitten/components'
import styleConstants from '../styleConstants'
import SafeAreaLayout from '../../components/SafeAreaLayout.component'
const IntroWrapper = props => {
  const styles = useStyleSheet(themedStyles)
  return (
    <SafeAreaLayout style={styles.safeArea} insets='top' level='2'>
      {props.children}
    </SafeAreaLayout>
  )
}

const themedStyles = StyleService.create({
  safeArea: {
    ...styleConstants.introScreen
  }
})

export default IntroWrapper

import React from 'react'
import {
  useStyleSheet,
  StyleService
} from '@ui-kitten/components'
import styleConstants from '../styleConstants'
import SafeAreaLayout from '../../components/SafeAreaLayout.component'
const FormWrapper = props => {
  const styles = useStyleSheet(themedStyles)
  return (
    <SafeAreaLayout style={styles.safeArea} insets='top' level='4'>
      {props.children}
    </SafeAreaLayout>
  )
}

const themedStyles = StyleService.create({
  safeArea: {
    ...styleConstants.authScreen
  },
  safeAreaAlternate: {
    ...styleConstants.alternateScreen
  }
})

export default FormWrapper

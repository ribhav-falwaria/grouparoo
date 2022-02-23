import React from 'react'
import {
  useStyleSheet,
  StyleService,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Text
} from '@ui-kitten/components'
import styleConstants from '../styleConstants'
import SafeAreaLayout from '../../components/SafeAreaLayout.component'
import { config } from '../../config'
const AuthWrapper = props => {
  const styles = useStyleSheet(themedStyles)
  const BackIcon = (props) => (
    <Icon {...props} name='arrow-back' />
  )
  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack}/>
  )
  const navigateBack = () => {
    props.navigation.goBack()
  }
  return (
    <SafeAreaLayout style={styles.safeArea} insets='top' level='1'>
      <TopNavigation
        style={styles.topNavigationStyle}
        alignment='center'
        accessoryLeft={BackAction}
        // title={() => <Text category='h4' status='primary'>{config.appName}</Text>}
      />
      {props.children}
    </SafeAreaLayout>
  )
}

const themedStyles = StyleService.create({
  safeArea: {
    ...styleConstants.authScreen
  },
  topNavigationStyle: {
    backgroundColor: 'background-basic-color-1'
  }
})

export default AuthWrapper

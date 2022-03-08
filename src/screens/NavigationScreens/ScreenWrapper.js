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
import { MenuIcon, CallIcon, NotificationIcon } from '../../components/Icons.component'
const ScreenWrapper = props => {
  const { alternateScreen } = props
  const theme = useTheme()
  const styles = useStyleSheet(themedStyles)
  const menuIconOnPress = () => {
    props.navigation.toggleDrawer()
  }
  const renderDrawerAction = () => (
    <TopNavigationAction
      icon={(imageProps) => <MenuIcon {...imageProps} fill={theme['color-primary-500']} />}
      onPress={menuIconOnPress}
    />
  )
  const renderRightActions = () => (
    <>
      <TopNavigationAction icon={(imageProps) => <CallIcon {...imageProps} fill={theme['color-primary-500']} />} />
      <TopNavigationAction icon={(imageProps) => <NotificationIcon {...imageProps} fill={theme['color-primary-500']} />} />
    </>
  )
  return (
    <SafeAreaLayout style={alternateScreen ? styles.safeAreaAlternate : styles.safeArea} insets='top' level='2'>
      <TopNavigation
        style={alternateScreen ? styles.topNavigationStyle : {}}
        accessoryLeft={renderDrawerAction}
        accessoryRight={renderRightActions}
      />
      {props.children}
    </SafeAreaLayout>
  )
}

const themedStyles = StyleService.create({
  safeArea: {
    ...styleConstants.screen
  },
  topNavigationStyle: {
    backgroundColor: 'color-primary-transparent-200'
  },
  safeAreaAlternate: {
    ...styleConstants.alternateScreen
  }
})

export default ScreenWrapper

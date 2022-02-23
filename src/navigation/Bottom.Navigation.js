import React, { useRef, useContext } from 'react'
import { Animated } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  BottomNavigationTab,
  BottomNavigation,
  Divider,
  StyleService
} from '@ui-kitten/components'
import { LocalizationContext } from '../components/Translation'
const useVisibilityAnimation = visible => {
  // const animation = new Animated.Value(visible ? 1 : 0)
  const interpAnim = useRef(new Animated.Value(0)).current
  React.useEffect(() => {
    Animated.timing(interpAnim, {
      duration: 200,
      toValue: visible ? 1 : 0,
      useNativeDriver: true
    }).start()
  }, [visible])
  return {
    transform: [
      {
        translateY: interpAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0]
        })
      }
    ],
    position: visible ? null : 'absolute'
  }
}

const RootBottomNavigation = ({
  navigation,
  state,
  descriptors,
  bottomNavigations
}) => {
  const focusedRoute = state.routes[state.index]
  const { tabBarVisible } = descriptors[focusedRoute.key].options
  const safeAreaInsets = useSafeAreaInsets()
  const { translations } = useContext(LocalizationContext)
  const transforms = useVisibilityAnimation(tabBarVisible)

  const onSelect = index => {
    navigation.navigate(state.routeNames[index], {})
  }

  return (
    <Animated.View
      style={[
        styles.container,
        transforms,
        { paddingBottom: tabBarVisible ? safeAreaInsets.bottom : 0 }
      ]}
    >
      <Divider />
      <BottomNavigation
        appearance='noIndicator'
        selectedIndex={state.index}
        onSelect={onSelect}
      >
        {bottomNavigations.map((bottomNav, ix) => (
          <BottomNavigationTab
            key={`'bottomnav-${ix}`}
            title={translations[bottomNav.drawerTitle]}
            icon={bottomNav.Icon}
          />
        ))}
      </BottomNavigation>
    </Animated.View>
  )
}

const styles = StyleService.create({
  container: {
    left: 0,
    right: 0,
    bottom: 0
  }
})

export default RootBottomNavigation

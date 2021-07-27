import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Layout
} from '@ui-kitten/components'

// type Inset = 'top' | 'bottom';

const SafeAreaLayout = ({ insets, ...props }) => {
  const insetsConfig = useSafeAreaInsets()
  return (
    <Layout
      {...props}
      style={[
        props.style,
        {
          paddingTop: insets === 'top' ? insetsConfig.top : 0,
          paddingBottom: insets === 'bottom' ? insetsConfig.bottom : 0
        }
      ]}
    />
  )
}
export default SafeAreaLayout

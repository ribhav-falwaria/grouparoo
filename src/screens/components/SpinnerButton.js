import React from 'react'
import { View } from 'react-native'
import { Button, Spinner, StyleService, useStyleSheet } from '@ui-kitten/components'
const SpinnerButton = props => {
  const styles = useStyleSheet(themedStyles)
  const loadingIndicator = props => {
    if (!props.loading) {
      return null
    }
    return (
      <View style={[props.style, styles.indicator]}>
        <Spinner size={props.size || 'medium'} />
      </View>
    )
  }

  return (
    <Button
      style={props.style}
      appearance={props.appearance || 'filled'}
      disabled={props.disabled}
      status={props.status || 'primary'}
      size={props.size || 'medium'}
      accessoryRight={loadingIndicator}
      onPress={props.onPress}
    >
      {props.children}
    </Button>
  )
}
const themedStyles = StyleService.create({
  indicator: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})
export default SpinnerButton

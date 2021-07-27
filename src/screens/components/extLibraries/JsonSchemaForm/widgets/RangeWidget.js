import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { rangeSpec } from '../utils'
import Slider from '@react-native-community/slider'
import { useFormContext } from '../FormContext'

const RangeWidget = ({ value, readonly, disabled, schema, onChange, rawErrors = [], required }) => {
  const { theme } = useFormContext()
  const { min = 0, step = 1, max = 100 } = rangeSpec(schema)
  const hasErrors = rawErrors.length > 0

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.ends,
          {
            color: theme.textColor
          }
        ]}
      >
        {min}
      </Text>
      <Slider
        style={styles.slider}
        value={value}
        step={step}
        disabled={disabled || readonly}
        minimumValue={min}
        maximumValue={max}
        onValueChange={onChange}
        thumbTintColor={theme.highlightColor}
        minimumTrackTintColor={theme.highlightColor}
      />
      <Text
        style={[
          styles.ends,
          {
            color: theme.highlightColor
          }
        ]}
      >
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row'
  },
  ends: {
    fontSize: 14,
    color: 'gray'
  },
  slider: {
    flex: 1,
    marginHorizontal: 15,
    height: 40
  }
})

export default RangeWidget

import React from 'react'
import { View } from 'react-native'
import {
  StyleService,
  useStyleSheet,
  Button
} from '@ui-kitten/components'

const SmallButtonSet = ({
  displaySet,
  values,
  onPress,
  selectedValue
}) => {
  const styles = useStyleSheet(themedStyles)
  return (
    <View style={styles.buttonContainer}>
      {values.map((v, ix) => (
        <Button
          size='tiny'
          status='info'
          appearance={selectedValue === v ? 'filled' : 'outline'}
          style={styles.buttonStyle}
          key={`smb-${ix}`}
          onPress={() => onPress(v)}
        >
          {displaySet[ix]}
        </Button>
      ))}
    </View>
  )
}

const themedStyles = StyleService.create({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -16
  },
  buttonStyle: {
    borderRadius: 24,
    marginLeft: 4,
    padding: -8
  }
})
export default SmallButtonSet

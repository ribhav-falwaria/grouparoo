import React from 'react'
import { View } from 'react-native'
import { Text, useStyleSheet, StyleService, CheckBox, Divider } from '@ui-kitten/components'
import { TouchableOpacity } from 'react-native-gesture-handler'

const AddressDisplay = (props) => {
  const styles = useStyleSheet(themedStyles)
  return (
    <TouchableOpacity onPress={() => props.onSelectAddress(props)}>
      <View style={styles.container}>
        <View>
          <CheckBox checked={props.selected}>
            <View style={styles.addressContainer}>
              <Text category='s1'>{props.source}</Text>
              <Text>
                <Text category='p1' style={{ flexWrap: 'wrap' }}>{`${props.address1}`}</Text>
                {props.adressLine2 && (<Text category='p1' style={{ flexWrap: 'wrap' }}>{`\n${props.adress2}`}</Text>)}
                <Text category='p1' style={{ flexWrap: 'wrap' }}>{`\n${props.city}, ${props.state}-${props.zipCode}`}</Text>
              </Text>
            </View>
          </CheckBox>
        </View>
      </View>
    </TouchableOpacity>
  )
}
const themedStyles = StyleService.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24
  },
  addressContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  }
})
export default AddressDisplay

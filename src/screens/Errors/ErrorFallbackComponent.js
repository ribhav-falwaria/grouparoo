import React, { useContext } from 'react'
import {
  Text,
  Button,
  StyleService,
  useStyleSheet
} from '@ui-kitten/components'
import { View, Image } from 'react-native'
import crashlytics from '@react-native-firebase/crashlytics'
import { LocalizationContext } from '../../components/Translation'
import { widthPercentageToDP } from 'react-native-responsive-screen'

const ErrorFallbackComponent = ({ error, resetError }) => {
  const { translations } = useContext(LocalizationContext)
  crashlytics().recordError(error)
  const styles = useStyleSheet(themedStyles)
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={require('../../assets/images/error-page-icon.png')} style={styles.image} resizeMode='center' />
        <Text style={styles.textHeading} category='h2' status='primary'>
          {translations['error.something.went.wrong']}
        </Text>
        <Text style={styles.textDescription} category='h6'>
          {translations['error.something.went.wrong.description']}
        </Text>
      </View>
      <View>
        <View style={{ marginTop: 16 }}>
          <Button onPress={resetError} status='primary' style={styles.button}>
            {translations['error.tryagain'].toUpperCase()}
          </Button>
        </View>
      </View>
    </View>
  )
}

const themedStyles = StyleService.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.8
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  textHeading: {
    fontWeight: 'bold',
    marginTop: 25
  },
  textDescription: {
    fontWeight: 'bold',
    marginTop: 15
  },
  image: {
    width: widthPercentageToDP('50%'),
    height: widthPercentageToDP('50%')
  },
  button: {
    width: widthPercentageToDP('90%'),
    margin: 16
  }

})

export default ErrorFallbackComponent

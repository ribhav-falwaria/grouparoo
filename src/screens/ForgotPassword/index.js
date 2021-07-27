import React, { useContext } from 'react'
import { View } from 'react-native'
import { Button, Input, Text, StyleService, useStyleSheet } from '@ui-kitten/components'
import { EmailIcon } from './extra/icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { LocalizationContext } from '../../components/Translation'
import styleConstants from '../styleConstants'

export default ({ navigation }) => {
  const [email, setEmail] = React.useState()
  const styles = useStyleSheet(themedStyles)
  const onResetPasswordButtonPress = () => {
    navigation && navigation.goBack()
  }
  const { translations } = useContext(LocalizationContext)
  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={styles.enterEmailLabel}>
          {translations['auth.forgotPassword.enterEmail']}
        </Text>
        <View style={styles.formContainer}>
          <Input
            status='basic'
            placeholder='Email'
            accessoryRight={EmailIcon}
            value={email}
            size='large'
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.buttonContanier}>
          <Button size='large' onPress={onResetPasswordButtonPress}>
            {translations['auth.forgotPassword.reset']}
          </Button>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 24
  },
  forgotPasswordLabel: {
    zIndex: 1,
    alignSelf: 'center',
    marginTop: 24
  },
  enterEmailLabel: {
    zIndex: 1,
    alignSelf: 'center',
    marginTop: 64,
    ...styleConstants.subHeading
  },
  buttonContanier: {
    paddingVertical: 24
  }
})

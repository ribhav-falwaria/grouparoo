import React, { useContext } from 'react'
import { View } from 'react-native'
import { Button, Input, Text, StyleService, useStyleSheet } from '@ui-kitten/components'
import { EmailIcon } from './extra/icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { LocalizationContext } from '../../components/Translation'
import styleConstants from '../styleConstants'
import ScreenTitle from '../components/ScreenTitle'
export default ({ navigation, route }) => {
  const [email, setEmail] = React.useState()
  const styles = useStyleSheet(themedStyles)
  const onResetPasswordButtonPress = () => {
    navigation && navigation.goBack()
  }
  const { translations } = useContext(LocalizationContext)
  const title = route.params?.title || translations['auth.forgotPassword']
  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <ScreenTitle title={title} description={translations['auth.forgotPassword.enterEmail']} />
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
    paddingHorizontal: 16
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
  content: {
    ...styleConstants.content
  },
  buttonContanier: {
    paddingVertical: 24
  }
})

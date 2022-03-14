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
  const [resetRequested, setResetRequested] = React.useState(false)
  const styles = useStyleSheet(themedStyles)
  const onResetPasswordButtonPress = () => {
    setResetRequested(true)
  }
  const onGotoLogin = () => {
    navigation && navigation.navigate('SignIn')
  }
  const { translations } = useContext(LocalizationContext)
  const title = route.params?.title || translations['auth.forgotPassword']

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <ScreenTitle title={title} description={translations['auth.forgotPassword.enterEmail']} />
        {!resetRequested && (
          <>
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
          </>
        )}
        {resetRequested && (
          <>
            <View>
              <Text category='h2'>
                {translations['auth.forgotPassword.message.title']}
              </Text>
              <Text category='s1' status='primary'>
                {translations['auth.forgotPassword.message.description']}
              </Text>
            </View>
            <View style={styles.buttonContanier}>
              <Button size='large' onPress={onGotoLogin}>
                {translations['auth.forgotPassword.goToLogin']}
              </Button>
            </View>
          </>
        )}
      </View>
    </KeyboardAwareScrollView>
  )
}

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between'
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

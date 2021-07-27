import React, { useContext } from 'react'
import { View } from 'react-native'
import {
  Button,
  Input,
  Text,
  Divider,
  StyleService,
  useStyleSheet
} from '@ui-kitten/components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FormLabel from '../components/FormLabel'
import { FacebookIcon, GoogleIcon } from './extra/icons'
import { LocalizationContext } from '../../components/Translation'
import styleConstants from '../styleConstants'

const SignIn = ({ navigation }) => {
  const [email, setEmail] = React.useState()
  const [password, setPassword] = React.useState()
  const { translations } = useContext(LocalizationContext)
  const styles = useStyleSheet(themedStyles)
  const onSignInButtonPress = () => {
    navigation && navigation.goBack()
  }

  const onSignUpButtonPress = () => {
    navigation && navigation.navigate('SignUp')
  }
  const onForgotButtonPressed = () => {
    navigation && navigation.navigate('ForgotPassword')
  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.socialAuthContainer}>
        <Text style={styles.socialAuthHintText} category='h6'>
          {translations['auth.socialMediaSignIn']}
        </Text>
        <View style={styles.socialAuthButtonsContainer}>
          <Button
            appearance='ghost'
            size='giant'
            status='info'
            accessoryLeft={GoogleIcon}
          />
          <Button
            appearance='ghost'
            size='giant'
            status='info'
            accessoryLeft={FacebookIcon}
          />
        </View>
      </View>
      <View style={styles.orContainer}>
        <Divider style={styles.divider} />
        <Text style={styles.orLabel} category='h5'>
          OR
        </Text>
        <Divider style={styles.divider} />
      </View>
      <Text style={styles.emailSignLabel} category='h6'>
        {translations['auth.signInWithEmail']}
      </Text>
      <View style={styles.formContainer}>
        <Input
          label={<FormLabel content={translations['form.email']} />}
          placeholder={translations['form.email']}
          value={email}
          size='large'
          onChangeText={setEmail}
        />
        <Input
          style={styles.passwordInput}
          secureTextEntry
          placeholder={translations['form.password']}
          label={<FormLabel content={translations['form.password']} />}
          value={password}
          size='large'
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.bottomButtonContainer}>
        <Button status='primary' onPress={onSignInButtonPress}>
          {translations['auth.signInButton']}
        </Button>
        <Button
          style={styles.signUpButton}
          appearance='ghost'
          status='primary'
          onPress={onForgotButtonPressed}
        >
          {translations['auth.forgotPassword.forgotButton']}
        </Button>
        <Button
          style={styles.signUpButton}
          appearance='ghost'
          status='primary'
          onPress={onSignUpButtonPress}
        >
          {translations['auth.signUpReminder']}
        </Button>
      </View>
    </KeyboardAwareScrollView>
  )
}

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 16
    // justifyContent: 'flex-start'
  },

  socialAuthContainer: {
    marginTop: 48
  },
  formContainer: {
    flex: 1,
    marginTop: 32
  },
  passwordInput: {
    marginTop: 16
  },
  signInLabel: {
    flex: 1
  },
  signUpButton: {
    paddingHorizontal: 0
  },
  labelStyle: {
    ...styleConstants.content
  },
  socialAuthButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  socialAuthHintText: {
    alignSelf: 'center',
    marginBottom: 0,
    ...styleConstants.subHeading
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16
  },
  divider: {
    flex: 1
  },
  orLabel: {
    marginHorizontal: 8,
    ...styleConstants.content
  },
  emailSignLabel: {
    alignSelf: 'center',
    marginTop: 8,
    ...styleConstants.subHeading
  },
  bottomButtonContainer: {
    paddingTop: 32
  }
})

export default SignIn

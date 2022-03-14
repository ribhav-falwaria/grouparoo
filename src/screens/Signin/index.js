import React, { useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  Button,
  Input,
  Text,
  StyleService,
  useStyleSheet,
  Spinner
} from '@ui-kitten/components'
import { useStore, useSelector, useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FormIcons } from '../components/ThemedIcons'
import { useRequest } from 'ahooks'
import ScreenTitle from '../components/ScreenTitle'
import { LocalizationContext } from '../../components/Translation'
import styleConstants from '../styleConstants'

const loginUser = async (dispatch, { email, password }) => {
  await dispatch.authentication.signInUser({ email, password })
}
let isSignInBtnPressed = false
const SignIn = ({ navigation, route }) => {
  const [email, setEmail] = React.useState()
  const [password, setPassword] = React.useState()
  const { translations } = useContext(LocalizationContext)
  const title = route.params?.title || translations['auth.SignIn']
  const store = useStore()
  const dispatch = useDispatch()
  const state = useSelector(state => state)
  const styles = useStyleSheet(themedStyles)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const loginUserRequest = useRequest(loginUser, {
    manual: true
  })
  const selection = store.select(models => ({
    isLoggedIn: models.authentication.isUserLoggedIn,
    showLoginError: models.appStates.getSigninError
  }))
  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  }
  useEffect(() => {
    if (isSignInBtnPressed && validateEmail(email)) {
      setIsEmailValid(true)
    }
  }, [isSignInBtnPressed, email])
  const {
    isLoggedIn,
    showLoginError
  } = selection(state)
  const onSignInButtonPress = async () => {
    isSignInBtnPressed = true
    const isValidMail = validateEmail(email.trim())
    if (!isValidMail) {
      setIsEmailValid(false)
    } else {
      await loginUserRequest.run(dispatch, { email: email.trim(), password: password.trim() })
    }
  }
  const renderError = () => {
    return (<Text status='danger' category='p1'>{translations['auth.invalid.email']}</Text>)
  }
  const onSignUpButtonPress = () => {
    navigation.navigate('SignUp', {})
  }
  const onForgotButtonPressed = () => {
    navigation.navigate('ForgotPassword', {})
  }
  const loadingIndicator = props => {
    if (!loginUserRequest.loading) {
      return null
    }
    return (
      <View style={[props.style, styles.indicator]}>
        <Spinner size='small' status='basic' />
      </View>
    )
  }
  const showError = (loginUserRequest.loading === false) && (showLoginError === true && isLoggedIn === false)
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <ScreenTitle title={title} description={translations['auth.signInWithEmail']} />
      {
        showError === true && (
          <Text style={styles.signinErrorLabel} category='p2' status='danger'>
            {translations['auth.signIn.error']}
          </Text>
        )
      }
      <View style={styles.formContainer}>
        <Input
          label={translations['form.email']}
          placeholder={translations['form.email']}
          value={email}
          status={showError && 'danger'}
          onChangeText={setEmail}
          accessoryRight={FormIcons.FormEmailIcon}
          caption={!isEmailValid ? renderError : <></>}
        />
        <Input
          style={styles.passwordInput}
          secureTextEntry
          placeholder={translations['form.password']}
          label={translations['form.password']}
          value={password}
          status={showError && 'danger'}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.bottomButtonContainer}>
        <Button
          status='primary'
          onPress={onSignInButtonPress}
          accessoryRight={loadingIndicator}
        >
          {translations['auth.signInButton'].toUpperCase()}
        </Button>
        <Button
          style={styles.signUpButton}
          appearance='ghost'
          size='small'
          status='basic'
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
  signinErrorLabel: {
    marginTop: 8,
    paddingHorizontal: 16
  },
  content: {
    ...styleConstants.content
  },
  bottomButtonContainer: {
    paddingTop: 32
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default SignIn

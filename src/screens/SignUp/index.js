import React, { useContext } from 'react'
import { View } from 'react-native'
import { useRequest } from 'ahooks'
import apiServices from '../../apiService'

import {
  Button,
  CheckBox,
  Divider,
  Input,
  StyleService,
  Text,
  useStyleSheet,
  Spinner
} from '@ui-kitten/components'
import { FacebookIcon, GoogleIcon } from './extra/icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FormLabel from '../components/FormLabel'
import { LocalizationContext } from '../../components/Translation'
import styleConstants from '../styleConstants'
const writeFormLabel = content => <FormLabel content={content} />

const SignUp = ({ navigation }) => {
  const [name, setName] = React.useState()
  const [email, setEmail] = React.useState()
  const [primaryPhone, setPrimaryPhone] = React.useState()
  const [termsAccepted, setTermsAccepted] = React.useState(false)
  const [whatsappAccepted, setWhatsappAccepted] = React.useState(true)
  const { translations } = useContext(LocalizationContext)
  const styles = useStyleSheet(themedStyles)
  const { loading, run } = useRequest(apiServices.sendOtp, { manual: true })
  const onSignUpButtonPress = async () => {
    await run(primaryPhone)
    navigation &&
      navigation.navigate('Otp', {
        name,
        email,
        primaryPhone,
        termsAccepted,
        whatsappAccepted
      })
  }

  const onSignInButtonPress = () => {
    navigation && navigation.navigate('SignIn')
  }

  const renderTermsLabel = React.useCallback(
    evaProps => (
      <Text {...evaProps} style={styles.termsCheckBoxText}>
        {translations['auth.tnc']}
      </Text>
    ),
    []
  )
  const renderWhatsappLabel = React.useCallback(
    evaProps => (
      <Text {...evaProps} category='p1' appearance='hint'>
        {translations['form.whatsappTnc']}
      </Text>
    ),
    []
  )
  const loadingIndicator = props => {
    if (loading) {
      return null
    }
    return (
      <View style={[props.style, styles.indicator]}>
        <Spinner size='small' />
      </View>
    )
  }
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Text style={styles.content} category='p1'>
        {translations['auth.signup.excited']}
      </Text>
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
        {translations['auth.signUpWithEmail']}
      </Text>
      <View style={[styles.container, styles.formContainer]}>
        <Input
          placeholder={translations['form.placeholder.name']}
          label={writeFormLabel(translations['form.firstName'])}
          autoCapitalize='words'
          value={name}
          size='large'
          onChangeText={setName}
        />
        <Input
          style={styles.formInput}
          placeholder='rajesh.kumar@gmail.com'
          label={writeFormLabel(translations['form.email'])}
          value={email}
          size='large'
          onChangeText={setEmail}
        />
        <Input
          style={styles.formInput}
          label={writeFormLabel(translations['form.mobileNumber'])}
          placeholder={translations['form.mobileNumber']}
          value={primaryPhone}
          size='large'
          onChangeText={setPrimaryPhone}
        />
        <CheckBox
          style={styles.termsCheckBox}
          checked={whatsappAccepted}
          onChange={checked => setWhatsappAccepted(checked)}
        >
          {renderWhatsappLabel}
        </CheckBox>
        <CheckBox
          style={styles.termsCheckBox}
          checked={termsAccepted}
          onChange={checked => setTermsAccepted(checked)}
        >
          {renderTermsLabel}
        </CheckBox>
      </View>
      <View style={styles.bottomButtonContainer}>
        <Button
          style={styles.signUpButton}
          onPress={onSignUpButtonPress}
          accessoryRight={loadingIndicator}
        >
          {translations['auth.signUp']}
        </Button>
        <Button
          style={styles.signInButton}
          appearance='ghost'
          status='primary'
          onPress={onSignInButtonPress}
        >
          {translations['auth.signInReminder']}
        </Button>
      </View>
    </KeyboardAwareScrollView>
  )
}

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  headerContainer: {
    minHeight: 216,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 44
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32
  },
  socialAuthContainer: {
    marginTop: 24
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
  formContainer: {
    marginTop: 32,
    paddingHorizontal: 16
  },
  evaButton: {
    maxWidth: 72,
    paddingHorizontal: 0
  },
  signInLabel: {
    flex: 1
  },
  signInButton: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 0
  },
  signUpButton: {
    marginTop: 16,
    marginBottom: 0,
    marginHorizontal: 16
  },
  socialAuthIcon: {
    tintColor: 'text-basic-color'
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8
  },
  divider: {
    flex: 1
  },
  content: {
    ...styleConstants.content
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
  formInput: {
    marginTop: 16
  },
  termsCheckBox: {
    marginTop: 20
  },
  termsCheckBoxText: {
    fontSize: 11,
    lineHeight: 14,
    color: 'text-hint-color',
    marginLeft: 10
  },
  bottomButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default SignUp

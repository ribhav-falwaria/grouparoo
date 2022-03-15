import React, { useContext } from "react";
import { View } from "react-native";
import {
  Button,
  Input,
  Text,
  StyleService,
  useStyleSheet,
  Spinner,
} from "@ui-kitten/components";
import { useStore, useSelector, useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FormIcons } from "../components/ThemedIcons";
import { useRequest } from "ahooks";
import ScreenTitle from "../components/ScreenTitle";
import { LocalizationContext } from "../../components/Translation";
import styleConstants from "../styleConstants";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const loginUser = async (dispatch, { email, password }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "loginUser method starts here",
      { dispatch, email, password },
      "loginUser()",
      "Signin.js"
    )
  );
  await dispatch.authentication.signInUser({ email, password });
};

const SignIn = ({ navigation, route }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "SignIn method starts here",
      { navigation, route },
      "SignIn()",
      "Signin.js"
    )
  );
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const { translations } = useContext(LocalizationContext);
  const title = route.params?.title || translations["auth.SignIn"];
  const store = useStore();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const styles = useStyleSheet(themedStyles);
  const loginUserRequest = useRequest(loginUser, {
    manual: true,
  });
  if (loginUserRequest.error) {
    console.log("error");
  }
  const selection = store.select((models) => ({
    isLoggedIn: models.authentication.isUserLoggedIn,
    showLoginError: models.appStates.getSigninError,
  }));
  const { isLoggedIn, showLoginError } = selection(state);
  const onSignInButtonPress = async () => {
    crashlytics().log(
      ErrorUtil.createLog(
        "onSignInButtonPress method starts here",
        undefined,
        "onSignInButtonPress()",
        "Signin.js"
      )
    );
    await loginUserRequest.run(dispatch, { email, password });
  };
  const onSignUpButtonPress = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        "onSignUpButtonPress method starts here",
        undefined,
        "onSignUpButtonPress()",
        "Signin.js"
      )
    );
    navigation.navigate("SignUp", {});
  };
  const onForgotButtonPressed = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        "onForgotButtonPressed method starts here",
        undefined,
        "onForgotButtonPressed()",
        "Signin.js"
      )
    );
    navigation.navigate("ForgotPassword", {});
  };
  const loadingIndicator = (props) => {
    crashlytics().log(
      ErrorUtil.createLog(
        "loadingIndicator method starts here",
        { props },
        "loadingIndicator()",
        "Signin.js"
      )
    );
    if (!loginUserRequest.loading) {
      return null;
    }
    return (
      <View style={[props.style, styles.indicator]}>
        <Spinner size="small" status="basic" />
      </View>
    );
  };
  const showError =
    loginUserRequest.loading === false &&
    showLoginError === true &&
    isLoggedIn === false;
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <ScreenTitle
        title={title}
        description={translations["auth.signInWithEmail"]}
      />
      {showError === true && (
        <Text style={styles.signinErrorLabel} category="p2" status="danger">
          {translations["auth.signIn.error"]}
        </Text>
      )}
      <View style={styles.formContainer}>
        <Input
          label={translations["form.email"]}
          placeholder={translations["form.email"]}
          value={email}
          status={showError && "danger"}
          onChangeText={setEmail}
          accessoryRight={FormIcons.FormEmailIcon}
        />
        <Input
          style={styles.passwordInput}
          secureTextEntry
          placeholder={translations["form.password"]}
          label={translations["form.password"]}
          value={password}
          status={showError && "danger"}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.bottomButtonContainer}>
        <Button
          status="primary"
          onPress={onSignInButtonPress}
          accessoryRight={loadingIndicator}
        >
          {translations["auth.signInButton"].toUpperCase()}
        </Button>
        <Button
          style={styles.signUpButton}
          appearance="ghost"
          size="small"
          status="basic"
          onPress={onForgotButtonPressed}
        >
          {translations["auth.forgotPassword.forgotButton"]}
        </Button>
        <Button
          style={styles.signUpButton}
          appearance="ghost"
          status="primary"
          onPress={onSignUpButtonPress}
        >
          {translations["auth.signUpReminder"]}
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 16,
    // justifyContent: 'flex-start'
  },

  socialAuthContainer: {
    marginTop: 48,
  },
  formContainer: {
    flex: 1,
    marginTop: 32,
  },
  passwordInput: {
    marginTop: 16,
  },
  signInLabel: {
    flex: 1,
  },
  signUpButton: {
    paddingHorizontal: 0,
  },
  labelStyle: {
    ...styleConstants.content,
  },
  socialAuthButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialAuthHintText: {
    alignSelf: "center",
    marginBottom: 0,
    ...styleConstants.subHeading,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
  },
  divider: {
    flex: 1,
  },
  orLabel: {
    marginHorizontal: 8,
    ...styleConstants.content,
  },
  signinErrorLabel: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  content: {
    ...styleConstants.content,
  },
  bottomButtonContainer: {
    paddingTop: 32,
  },
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SignIn;

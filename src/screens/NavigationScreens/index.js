import React from "react";
import orderBy from "lodash.orderby";
import Home from "../Home";
import MyLoans from "../MyLoans";
import SignIn from "../Signin";
import SignUp from "../SignUp";
import SetPassword from "../SetPassword";
import ForgotPassword from "../ForgotPassword";
import Otp from "../Otp";
import AppPermissions from "../AppPermissions";
import ManageLoanApplications from "../ManageLoanApplications";
import ApplicationForm from "../ApplicationForm";
import AppIntro from "../AppIntro";
import Payments from "../Payments";
import Repayments from "../Repayments";
import {
  HomeIcon,
  MyLoansIcon,
  ApplicationFormIcon,
  SignInIcon,
  SignUpIcon,
  ForgotPasswordIcon,
  AppPermissionsIcon,
  ManageLoanApplicationsIcon,
  RepaymentIcon,
} from "../components/ThemedIcons";
import ScreenWrapper from "./ScreenWrapper";
import AuthWrapper from "./AuthWrapper";
import FormWrapper from "./FormWrapper";
import IntroWrapper from "./IntroWrapper";
import ModalWrapper from "./ModalWrapper";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const WrapScreen = (Component, props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "WrapScreen method starts here",
      { Component, props },
      "WrapScreen()",
      "NavigationScreens.js"
    )
  );
  return (
    <ScreenWrapper {...props}>
      <Component {...props} />
    </ScreenWrapper>
  );
};
const WrapIntroScreen = (Component, props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "WrapIntroScreen method starts here",
      { Component, props },
      "WrapIntroScreen()",
      "NavigationScreens.js"
    )
  );
  return (
    <IntroWrapper {...props}>
      <Component {...props} />
    </IntroWrapper>
  );
};
const WrapAuthScreen = (Component, props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "WrapAuthScreen method starts here",
      { Component, props },
      "WrapAuthScreen()",
      "NavigationScreens.js"
    )
  );
  return (
    <AuthWrapper {...props}>
      <Component {...props} />
    </AuthWrapper>
  );
};
const WrapFormScreen = (Component, props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "WrapFormScreen method starts here",
      { Component, props },
      "WrapFormScreen()",
      "NavigationScreens.js"
    )
  );
  return (
    <FormWrapper {...props}>
      <Component {...props} />
    </FormWrapper>
  );
};
const WrapModalScreen = (Component, props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "WrapModalScreen method starts here",
      { Component, props },
      "WrapModalScreen()",
      "NavigationScreens.js"
    )
  );
  return (
    <ModalWrapper {...props}>
      <Component {...props} />
    </ModalWrapper>
  );
};
export const NavigationScreens = (options) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "NavigationScreens method starts here",
      { options },
      "NavigationScreens()",
      "NavigationScreens.js"
    )
  );
  const navigations = [
    {
      name: "Home",
      Component: (props) => WrapScreen(Home, props),
      title: "home.title",
      drawerTitle: "home.title",
      navigations: ["tab", "home"],
      Icon: HomeIcon,
      options,
      drawerOrder: 1,
      tabOrder: 1,
    },
    {
      name: "MyLoans",
      Component: (props) => WrapScreen(MyLoans, { ...props }),
      title: "myLoans.title",
      drawerTitle: "myLoans.title",
      navigations: ["drawer", "home"],
      Icon: MyLoansIcon,
      drawerOrder: 2,
      options,
    },
    {
      name: "Payments",
      Component: (props) => WrapModalScreen(Payments, { ...props }),
      title: "payments.title",
      drawerTitle: "",
      navigations: ["home"],
      Icon: RepaymentIcon,
      drawerOrder: 2,
      options,
    },
    {
      name: "Repayments",
      Component: (props) => WrapScreen(Repayments, { ...props }),
      title: "repayment.title",
      drawerTitle: "myLoans.repayments",
      navigations: ["home", "drawer"],
      Icon: RepaymentIcon,
      drawerOrder: 2,
      options,
    },
    {
      name: "AppIntro",
      Component: (props) => WrapIntroScreen(AppIntro, props),
      title: null,
      navigations: ["auth"],
      icon: null,
      options,
    },
    {
      name: "SignIn",
      Component: (props) => WrapAuthScreen(SignIn, props),
      title: "auth.signIn",
      navigations: ["auth"],
      icon: SignInIcon,
      options,
    },
    {
      name: "SetPassword",
      Component: (props) => WrapAuthScreen(SetPassword, props),
      title: "auth.SetPassword",
      navigations: ["auth"],
      icon: null,
      options,
    },
    {
      name: "SignUp",
      Component: (props) => WrapAuthScreen(SignUp, props),
      title: "auth.SignUp",
      navigations: ["auth"],
      icon: SignUpIcon,
      options,
    },
    {
      name: "ForgotPassword",
      Component: (props) => WrapAuthScreen(ForgotPassword, props),
      title: "auth.forgotPassword",
      navigations: ["auth"],
      icon: ForgotPasswordIcon,
      options,
    },
    {
      name: "Otp",
      Component: (props) => WrapAuthScreen(Otp, props),
      title: "auth.otp",
      navigations: ["auth"],
      options,
    },
    {
      name: "ApplicationForm",
      Component: (props) => WrapFormScreen(ApplicationForm, props),
      title: "form.applicationForm",
      navigations: ["home", "onboard"],
      icon: ApplicationFormIcon,
      options,
      tabOrder: 102,
    },
    {
      name: "Permissions",
      Component: (props) => WrapFormScreen(AppPermissions, props),
      title: "form.appPermissions",
      navigations: ["onboard"],
      icon: AppPermissionsIcon,
      options,
      tabOrder: 102,
    },
    {
      name: "ManageLoanApplications",
      Component: (props) => ScreenWrapper(ManageLoanApplications, props),
      title: "form.manageLoanApplications",
      navigations: ["home"],
      icon: ManageLoanApplicationsIcon,
      options,
      tabOrder: 102,
    },
  ];
  return navigations;
};

export const HomeDrawerNavigationScreens = (options) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "HomeDrawerNavigationScreens method starts here",
      { options },
      "HomeDrawerNavigationScreens()",
      "NavigationScreens.js"
    )
  );
  const navigations = NavigationScreens(options);
  const drawerNavigations = navigations.filter(
    (dn) => dn.navigations.indexOf("drawer") > -1
  );
  return {
    drawerNavigations: orderBy(drawerNavigations, ["drawerOrder"], ["asc"]),
    initialRouteName: "Home",
  };
};

export const BottomNavigationScreens = (options) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "BottomNavigationScreens method starts here",
      { options },
      "BottomNavigationScreens()",
      "NavigationScreens.js"
    )
  );
  const navigations = NavigationScreens(options);
  const bottomNavigations = navigations.filter(
    (n) => n.navigations.indexOf("tab") > -1
  );
  return {
    bottomNavigations: orderBy(bottomNavigations, ["tabOrder"], ["asc"]),
  };
};

export const OnboardNavigationScreens = (options) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "OnboardNavigationScreens method starts here",
      { options },
      "OnboardNavigationScreens()",
      "NavigationScreens.js"
    )
  );
  const { isPermissionsRequested, isAllPermissionsValid } = options;
  const navigations = NavigationScreens(options);
  const onboardNavigations = navigations
    .filter((n) => n.navigations.indexOf("onboard") > -1)
    .reduce((v, o) => {
      v[o.name] = o;
      return v;
    }, {});
  const isReadyForApplication = isPermissionsRequested && isAllPermissionsValid;
  return isReadyForApplication
    ? onboardNavigations.ApplicationForm
    : onboardNavigations.Permissions;
};

export const AuthNavigationScreens = ({ showIntroScreen, isFirstTime }) => {
  const navigations = NavigationScreens();
  const authNavigations = navigations.filter(
    (n) => n.navigations.indexOf("auth") > -1
  );
  let initialRouteName;
  if (isFirstTime) {
    if (showIntroScreen) {
      initialRouteName = "AppIntro";
    } else {
      initialRouteName = "SignUp";
    }
  } else {
    initialRouteName = "SignIn";
  }
  return {
    authNavigations,
    initialRouteName,
  };
};
export const HomeNavigationScreens = (options) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "HomeNavigationScreens method starts here",
      { options },
      "HomeNavigationScreens()",
      "NavigationScreens.js"
    )
  );
  const navigations = NavigationScreens(options);
  const homeNavigations = navigations.filter(
    (n) => n.navigations.indexOf("home") > -1
  );
  return {
    homeNavigations,
  };
};

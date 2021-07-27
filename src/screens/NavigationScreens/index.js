import React from 'react'
import orderBy from 'lodash.orderby'
import Home from '../Home'
import MyLoans from '../MyLoans'
import SignIn from '../Signin'
import SignUp from '../SignUp'
import ForgotPassword from '../ForgotPassword'
import Otp from '../Otp'
import ApplicationForm from '../ApplicationForm/'
// import Otp from './Otp'
import {
  HomeIcon,
  MyLoansIcon,
  ApplicationFormIcon,
  SignInIcon,
  SignUpIcon,
  ForgotPasswordIcon
} from '../components/ThemedIcons'
import ScreenWrapper from './ScreenWrapper'
import AuthWrapper from './AuthWrapper'
import FormWrapper from './FormWrapper'
const WrapScreen = (Component, props) => {
  return (
    <ScreenWrapper {...props}>
      <Component {...props} />
    </ScreenWrapper>
  )
}
const WrapAuthScreen = (Component, props) => {
  return (
    <AuthWrapper {...props}>
      <Component {...props} />
    </AuthWrapper>
  )
}
const WrapFormScreen = (Component, props) => {
  return (
    <FormWrapper {...props}>
      <Component {...props} />
    </FormWrapper>
  )
}
export const NavigationScreens = options => {
  const navigations = [
    {
      name: 'Home',
      Component: (props) => WrapScreen(Home, props),
      title: 'home.title',
      drawerTitle: 'home.title',
      navigations: ['tab', 'home'],
      Icon: HomeIcon,
      options,
      drawerOrder: 1,
      tabOrder: 1
    },
    {
      name: 'MyLoans',
      Component: (props) => WrapScreen(MyLoans, { ...props, alternateScreen: true }),
      title: 'myLoans.title',
      drawerTitle: 'myLoans.title',
      navigations: ['drawer', 'home'],
      Icon: MyLoansIcon,
      drawerOrder: 2,
      options
    },
    {
      name: 'SignIn',
      Component: (props) => WrapAuthScreen(SignIn, props),
      title: 'auth.signIn',
      navigations: ['auth'],
      icon: SignInIcon,
      options
    },
    {
      name: 'SignUp',
      Component: (props) => WrapAuthScreen(SignUp, props),
      title: 'auth.SignUp',
      navigations: ['auth'],
      icon: SignUpIcon,
      options
    },
    {
      name: 'ForgotPassword',
      Component: (props) => WrapAuthScreen(ForgotPassword, props),
      title: 'auth.forgotPassword',
      navigations: ['auth'],
      icon: ForgotPasswordIcon,
      options
    },
    {
      name: 'Otp',
      Component: (props) => WrapAuthScreen(Otp, props),
      title: 'auth.otp',
      navigations: ['auth'],
      options
    },
    {
      name: 'ApplicationForm',
      Component: (props) => WrapFormScreen(ApplicationForm, props),
      title: 'form.applicationForm',
      navigations: ['auth', 'home'],
      icon: ApplicationFormIcon,
      options
    }
  ]
  return navigations
}

export const HomeDrawerNavigationScreens = options => {
  const navigations = NavigationScreens(options)
  const drawerNavigations = navigations.filter(dn => dn.navigations.indexOf('drawer') > -1)
  return {
    drawerNavigations: orderBy(drawerNavigations, ['drawerOrder'], ['asc']),
    initialRouteName: 'Home'
  }
}

export const BottomNavigationScreens = options => {
  const navigations = NavigationScreens(options)
  const bottomNavigations = navigations.filter(
    n => n.navigations.indexOf('tab') > -1
  )
  return {
    bottomNavigations: orderBy(bottomNavigations, ['tabOrder'],['asc']),
  }
}
export const AuthNavigationScreens = options => {
  const navigations = NavigationScreens(options)
  const authNavigations = navigations.filter(
    n => n.navigations.indexOf('auth') > -1
  )
  return {
    authNavigations, initialRouteName: 'ApplicationForm'
  }
}
export const HomeNavigationScreens = options => {
  const navigations = NavigationScreens(options)
  const homeNavigations = navigations.filter(
    n => n.navigations.indexOf('tab') > -1
  )
  return {
    homeNavigations
  }
}

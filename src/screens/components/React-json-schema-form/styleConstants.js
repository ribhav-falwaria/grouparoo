import {
  widthPercentageToDP,
  heightPercentageToDP
} from 'react-native-responsive-screen'

const styleConstants = {
  heading: {
    paddingVertical: 4,
    fontWeight: '700'
  },
  subHeading: {
    paddingVertical: 4,
    fontWeight: '400',
    color: 'color-primary-500'
  },
  formContainer: {
    marginTop: 32
  },
  formTitleContainer: {
    marginBottom: 32
  },
  contentContainer: {
    marginVertical: 8
  },
  content: {
    color: 'color-primary-300'
  },
  contentHighlight: {

  },
  screen: {
    paddingHorizontal: 16,
    paddingVertical: 0,
    flex: 1
  },
  authScreen: {
    paddingHorizontal: 16,
    paddingVertical: 0,
    flex: 1
  },
  alternateScreen: {
    paddingVertical: 0,
    flex: 1
  },
  section: {
    paddingVertical: 8
  },
  cardContainer: {
    marginVertical: 4
  },
  blockCard: {
    width: widthPercentageToDP('40%'),
    height: widthPercentageToDP('40%')
  },
  faqCard: {
    width: widthPercentageToDP('40%'),
    height: widthPercentageToDP('40%') / 2
  },
  cardTitleContainer: {
    paddingBottom: 4,
    paddingHorizontal: 0
  },
  iconStyle: {
    marginRight: 8
  }
}

export default styleConstants

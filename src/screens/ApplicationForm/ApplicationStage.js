import React, { useContext } from 'react'
import { TopNavigation, StyleService, useStyleSheet } from '@ui-kitten/components'
import IntroductionScreenComponent from '../components/IntroductionScreen'
import { LoanApplicationHelpIcons } from '../components/ThemedIcons'
import { LocalizationContext } from '../../components/Translation'

const ApplicationStage = ({ onPress, enable }) => {
  const { translations } = useContext(LocalizationContext)
  const styles = useStyleSheet(themedStyles)
  const help = {
    title: translations['application.stageComplete.title'],
    description: translations['application.stageComplete.description'],
    content: translations['application.stageComplete.content'],
    confirmText: translations['help.loan.loanAgreement.confirm'],
    items: [
      {
        Icon: LoanApplicationHelpIcons.DoneIcon,
        title: translations['help.loan.step1.title']
      },
      {
        Icon: LoanApplicationHelpIcons.DoneIcon,
        title: translations['help.loan.step2.title']
      },
      {
        Icon: enable ? LoanApplicationHelpIcons.DoneIcon : LoanApplicationHelpIcons.InProgressIcon,
        title: translations['help.loan.step3.title'],
        description: enable ? translations['help.loan.step3.action.done'] : translations['help.loan.step3.action']
      },
      {
        Icon: LoanApplicationHelpIcons.AcceptOfferIconGrey,
        title: translations['help.loan.step4.title'],
        description: translations['help.loan.step4.description']
      }
    ]
  }


  return (
    <>
      <TopNavigation
        style={styles.topNavigationStyle}
        alignment='center'
      />
      <IntroductionScreenComponent
        title={help.title}
        description={help.description}
        content={help.content}
        items={help.items}
        confirmText={help.confirmText}
        onPress={onPress}
        disabled={!enable}
      />
    </>
  )
}

const themedStyles = StyleService.create({
  topNavigationStyle: {
    backgroundColor: 'background-basic-color-1'
  }
})
export default ApplicationStage

import React, { useContext } from "react";
import IntroductionScreenComponent from "../components/IntroductionScreen";
import { LoanApplicationHelpIcons } from "../components/ThemedIcons";
import { LocalizationContext } from "../../components/Translation";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const LoanApplicationHelp = ({ onPress }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " LoanApplicationHelp method starts here",
      { onPress },
      "LoanApplicationHelp()",
      "LoanApplicationHelp.js"
    )
  );
  const { translations } = useContext(LocalizationContext);

  const help = {
    title: translations["help.loan.businessLoan"],
    description: translations["help.loan.businessLoanDescription"],
    content: translations["help.loan.content"],
    confirmText: translations["help.loan.confirmText"],
    items: [
      {
        Icon: LoanApplicationHelpIcons.DocumentsIcon,
        title: translations["help.loan.step1.title"],
        description: translations["help.loan.step1.description"],
        link: "https://udyamregistration.gov.in/Government-India/Ministry-MSME-registration.htm",
        linkText: translations["help.loan.step1.linkText"],
        ListItemIcon: LoanApplicationHelpIcons.CheckedItemIcon,
        list: [
          translations["help.loan.step1.list.pan"],
          translations["help.loan.step1.list.udyamOrGSTN"],
          translations["help.loan.step1.list.bankStatement"],
          translations["help.loan.step1.list.adhaarCard"],
          translations["help.loan.step1.list.coborrowerAadhaar"],
        ],
      },
      {
        Icon: LoanApplicationHelpIcons.CreditCheckIcon,
        title: translations["help.loan.step2.title"],
        description: translations["help.loan.step2.description"],
      },
      {
        Icon: LoanApplicationHelpIcons.SalesAgentIcon,
        title: translations["help.loan.step3.title"],
        description: translations["help.loan.step3.description"],
      },
      {
        Icon: LoanApplicationHelpIcons.AcceptOfferIcon,
        title: translations["help.loan.step4.title"],
        description: translations["help.loan.step4.description"],
      },
    ],
  };
  return (
    <IntroductionScreenComponent
      title={help.title}
      description={help.description}
      content={help.content}
      items={help.items}
      confirmText={help.confirmText}
      onPress={onPress}
    />
  );
};
export default LoanApplicationHelp;

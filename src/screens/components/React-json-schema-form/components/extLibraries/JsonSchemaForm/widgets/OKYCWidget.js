import React, { useState, useContext } from "react";
import { Text } from "@ui-kitten/components";
import { useDispatch} from "react-redux";
import { useRequest } from "ahooks";
import IconUtil from "../../../common/IconUtil";
import OKYCComponent from "../common/OKYCComponent";
import { LocalizationContext } from "../../../../translation/Translation";

const OKYCWidget = (props) => {
  const dispatch = useDispatch();
  const { translations } = useContext(LocalizationContext);
  const [isKycDone, setIsKycDone] = useState(false);
  const [isAadharDataFetched, setIsAadharDataFetched] = useState(false);
  const useSaveAdhaarData = useRequest(
    async (kycData) =>
      await dispatch.formDetails.setaadharData({
        kycData: kycData,
        kycMatchData: kycData.kycMatchData,
      }),
    {
      manual: true
    }
  );
  const onOtpSuccessHandler = (kycData) => {
    props.onChange('Yes')
    setIsKycDone(true)
    setIsAadharDataFetched(true)
    useSaveAdhaarData.run(kycData)
  }
  return (
    <>
      {!isAadharDataFetched && !props.value && (
        <OKYCComponent onOtpSuccess={onOtpSuccessHandler} />
      )}
      {(isKycDone || props.value === 'Yes') && (
        <Text>
          {translations['okyc.facematch.success']}
          <IconUtil.CheckIcon 
          style={{ marginLeft: 10 }} 
          />
        </Text>
      )}
    </>
  );
};
export default OKYCWidget

import React, { useState } from "react";
import { useToast } from "react-native-toast-notifications";
import AadharPanRequestBody from "../../../../services/aadhar-pan-requestbodyheader";
import DataService from "../../../../services/DataService";
import ResourceFactoryConstants from "../../../../services/ResourceFactoryConstants";
import MaskedInput from "../../textMask/text-input-mask";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import isEmpty from "lodash.isempty";
import { useFormContext } from "../FormContext";
import { Text } from "@ui-kitten/components";
import IconUtil from "../../../common/IconUtil";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

const PanWidget = ({
  id,
  readonly,
  disabled,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  autofocus,
  options,
  multiline,
  secureEntry,
  schema,
  placeholder,
  textContentType = "none",
  rawErrors = [],
  required,
}) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "PanWidget method starts here ",
      {
        id,
        readonly,
        disabled,
        label,
        value,
        onChange,
        onBlur,
        onFocus,
        autofocus,
        options,
        multiline,
        secureEntry,
        schema,
        placeholder,
        textContentType,
        rawErrors,
        required,
      },
      "PanWidget()",
      "PanWidget.js"
    )
  );
  const { theme } = useFormContext();
  const hasErrors = rawErrors.length > 0;
  const [loaderVisibility, setLoaderVisibility] = useState(false);
  const resourseFactoryConstants = new ResourceFactoryConstants();
  const toast = useToast();
  const [pan, setPan] = useState(value || "");
  const aadharPanService = new AadharPanRequestBody();
  const getTickMark = () => {
    if (!value) {
      return null;
    } else {
      return <IconUtil.CheckIcon size={20} color="green" />;
    }
  };

  const onClickHandler = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        "onClickHandler method starts here ",
        undefined,
        "onClickHandler()",
        "PanWidget.js"
      )
    );
    if (isEmpty(pan) || (pan && pan.length !== 10)) {
      return;
    }
    const requestBody = {};
    const url = resourseFactoryConstants.constants.pan.verifyPanNumber;
    const header = aadharPanService.getPanRequestBodyHeaders();
    const request = {
      pan_details: {
        pan_number: pan,
      },
      consent: "yes",
      consent_message: "yes",
    };
    requestBody.headers = header;
    requestBody.request = request;
    setLoaderVisibility(true);
    DataService.postData(url, requestBody)
      .then((res) => {
        const data = res.data;
        if (data.verification_status === "SUCCESS") {
          onChange(pan);
          toast.show("Validated Successfully", { type: "success" });
        } else {
          onChange(undefined);
          toast.show(data?.response_status?.message, { type: "danger" });
          setPan("");
        }
        setLoaderVisibility(false);
      })
      .catch((err) => {
        toast.show(err.message, { type: "danger" });
        setLoaderVisibility(false);
      });
  };

  return (
    <>
      <LoadingSpinner visible={loaderVisibility} />
      <MaskedInput
        type="custom"
        options={{
          mask: "AAAAA9999A",
        }}
        includeRawValueInChangeText
        placeholder={placeholder || "XXXXX1234X"}
        autoFocus={autofocus}
        editable={!disabled && !readonly}
        keyboardType="visible-password"
        value={pan}
        secureTextEntry={secureEntry}
        textContentType={textContentType}
        onChangeText={(newText) => {
          setPan(newText);
        }}
        onBlur={onClickHandler}
        selectionColor={theme.highlightColor}
        placeholderTextColor={theme.placeholderTextColor}
        status={hasErrors && "danger"}
        accessoryRight={() => getTickMark()}
      />
    </>
  );
};

export default PanWidget;

import React, { useContext, useState } from "react";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import isUndefined from "lodash.isundefined";
import isEmpty from "lodash.isempty";
import { useRequest } from "ahooks";
import RNFetchBlob from "rn-fetch-blob";
import { LocalizationContext } from "../../../../../translation/Translation";
import ImageUploadComponent from "../../common/ImageUploadComponent";
import ResourceFactoryConstants from "../../../../../services/ResourceFactoryConstants";
import DataService from "../../../../../services/DataService";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../../Errors/ErrorUtil";

const uploadFileUsingRNFetchBlob = async (base64, fileName) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "uploadFileUsingRNFetchBlob method starts here ",
      { base64, fileName },
      "uploadFileUsingRNFetchBlob()",
      "AadhaarMaskWidget.js"
    )
  );
  const resourceFactoryConstants = new ResourceFactoryConstants();
  try {
    const res = await RNFetchBlob.fetch(
      "POST",
      resourceFactoryConstants.constants.lending.uploadFile,
      { "Content-Type": "multipart/form-data" },
      [{ name: "file", filename: fileName, data: base64 }]
    );
    const data = JSON.parse(res.data);
    if (data.status === "SUCCESS") {
      return data.fileId;
    } else {
      console.log(data);
      throw new Error("CANNOT_UPLOAD_FILE_TO_DOC_SERVER");
    }
  } catch (e) {
    crashlytics().log(
      ErrorUtil.createError(
        e,
        e.message,
        e.message,
        { base64, fileName },
        "uploadFileUsingRNFetchBlob()",
        "AadhaarMaskWidget.js"
      )
    );
    console.log(
      "Inside uploadFileUsingRNFetchBlob() method, exception caught",
      e
    );
    if (e.message === "CANNOT_UPLOAD_FILE_TO_DOC_SERVER") {
      throw e;
    } else {
      throw new Error("CANNOT_REACH_AADHAAR_UPLOAD_SERVER");
    }
  }
};

const maskAadhaar = async (dispatch, file, isBack) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "maskAadhaar method starts here ",
      { dispatch, file, isBack },
      "maskAadhaar()",
      "AadhaarMaskWidget.js"
    )
  );
  const resourceFactoryConstants = new ResourceFactoryConstants();
  try {
    const formData = new FormData();
    formData.append("file", file);
    const url =
      resourceFactoryConstants.constants.aadharMask.uploadAadharWithFronAndBack;
    const res = await DataService.postData(url, formData);
    const responseData = res.data;
    if (responseData.status === "SUCCESS") {
      const fileId = await uploadFileUsingRNFetchBlob(
        responseData.maskedImage,
        file.name
      );
      if (isBack) {
        await dispatch.formDetails.setAadharBackFile(file);
      } else {
        await dispatch.formDetails.setAadharFrontFile(file);
      }
      return { fileId, uploadedFileName: file.name };
    } else {
      console.log(responseData);
      throw new Error("CANNOT_MASK_AADHAAR_INCORRECT_FILE");
    }
  } catch (err) {
    console.log("Inside maskAadhaar() method, exception caught", err);
    if (err.message === "CANNOT_MASK_AADHAAR_INCORRECT_FILE") {
      throw err;
    } else {
      throw new Error("CANNOT_REACH_AADHAR_MASKING_SERVICE");
    }
  }
};

const AadhaarMaskWidget = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "AadhaarMaskWidget method starts here ",
      { props },
      "AadhaarMaskWidget()",
      "AadhaarMaskWidget.js"
    )
  );
  const { aadharBackFile, aadharFrontFile } = useSelector((state) => ({
    aadharFrontFile: state.formDetails.aadharFrontFile,
    aadharBackFile: state.formDetails.aadharBackFile,
  }));
  const { translations } = useContext(LocalizationContext);
  const dispatch = useDispatch();
  const fileToUse = props.isBack ? aadharBackFile : aadharFrontFile;
  const hasError = isUndefined(props.rawErrors)
    ? 0
    : props.rawErrors.length > 0;
  const [isUploadDone, setIsUploadDone] = useState(!isEmpty(fileToUse));
  const useRemoveFile = useRequest(
    () => {
      return props.isBack
        ? dispatch.formDetails.setAadharBackFile(undefined)
        : dispatch.formDetails.setAadharFrontFile(undefined);
    },
    {
      manual: true,
    }
  );
  const useMaskAadharCard = useRequest(maskAadhaar, {
    manual: true,
    onBefore: () => {
      setIsUploadDone(false);
    },
    onSuccess: ({ fileId, uploadedFileName }, params) => {
      props.onChange(`${fileId}::${uploadedFileName}`);
      setIsUploadDone(true);
    },
    onError: (error, params) => {
      console.log(error);
      setIsUploadDone(false);
      if (
        error.message === "CANNOT_REACH_AADHAR_MASKING_SERVICE" ||
        error.message === "CANNOT_REACH_AADHAAR_UPLOAD_SERVER"
      ) {
        throw error;
      } else {
        Toast.show({
          type: "error",
          position: "bottom",
          props: {
            title: translations["aadhar.title"],
            description: translations["aadhar.mask.failed"],
          },
        });
      }
    },
  });
  // let docId, fileName
  // if (props.value) {
  //   const tempArr = props.value.split('::')
  //   docId = tempArr[0]
  //   fileName = tempArr[1]
  // }
  const removeFile = (uri) => {
    crashlytics().log(
      ErrorUtil.createLog(
        "removeFile method starts here ",
        { uri },
        "removeFile()",
        "AadhaarMaskWidget.js"
      )
    );
    if (uri.length > 0) {
      useRemoveFile.run();
      // remove from props
      props.onChange(undefined);
      setIsUploadDone(false);
    }
  };
  const onFileChange = async (file) => {
    crashlytics().log(
      ErrorUtil.createLog(
        "onFileChange method starts here ",
        { file },
        "onFileChange()",
        "AadhaarMaskWidget.js"
      )
    );
    setIsUploadDone(false);
    const fileDetails = {
      uri: file.uri,
      type: file.type,
      name: props.fileName,
    };
    file.name = props.fileName;
    useMaskAadharCard.run(dispatch, fileDetails, props.isBack);
  };
  return (
    <>
      <ImageUploadComponent
        hasError={hasError}
        isUploadDone={isUploadDone}
        onFileChange={onFileChange}
        loading={useMaskAadharCard.loading}
        selectText={props.selectText}
        uris={fileToUse ? [fileToUse.uri] : []}
        removeFile={removeFile}
      />
    </>
  );
};
export default AadhaarMaskWidget;

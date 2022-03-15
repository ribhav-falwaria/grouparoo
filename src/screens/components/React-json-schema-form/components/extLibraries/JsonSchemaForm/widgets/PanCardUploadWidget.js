import React, { useContext, useState } from "react";
import Toast from "react-native-toast-message";
import isEmpty from "lodash.isempty";
import isUndefined from "lodash.isundefined";
import { useRequest } from "ahooks";
import { useDispatch, useSelector } from "react-redux";
import { LocalizationContext } from "../../../../translation/Translation";
import DocumentUploadService from "../../../../services/DocumentUploadService";
import ResourceFactoryConstants from "../../../../services/ResourceFactoryConstants";
import ImageUploadComponent from "../common/ImageUploadComponent";
import DataService from "../../../../services/DataService";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";
const uploadedFileName = "pancard.jpg";

const uploadFileToServer = async (dispatch, file) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "uploadFileToServer method starts here ",
      { dispatch, file },
      "uploadFileToServer()",
      "PanCardUploadWidget.js"
    )
  );
  if (isEmpty(file)) {
    return;
  }
  const resourceFactoryConstants = new ResourceFactoryConstants();
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await DataService.postData(
      resourceFactoryConstants.constants.pan.verfifyPanOcr,
      formData
    );
    const resData = res.data;
    if (resData.status === "SUCCESS") {
      await Promise.all([
        dispatch.formDetails.setPanData(resData),
        dispatch.formDetails.setPanFile(file),
        dispatch.formDetails.setIsPanVerified("Yes"),
      ]);

      const docResponse = await uploadToAppWrite(file);
      return docResponse;
    } else {
      console.log(resData.message);
      throw new Error("CANNOT_VALIDATE_PAN");
    }
  } catch (e) {
    crashlytics().log(
      ErrorUtil.createError(
        e,
        e.message,
        e.message,
        { dispatch, file },
        "uploadFileToServer()",
        "PanCardUploadWidget.js"
      )
    );
    console.log(e);
    console.log(e.stack);
    if (e.message === "CANNOT_VALIDATE_PAN") {
      throw e;
    } else {
      throw new Error("CANNOT_REACH_PAN_VALIDATION_SERVICE");
    }
  }
};

const uploadToAppWrite = async (file) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "uploadToAppWrite method starts here ",
      { file },
      "uploadToAppWrite()",
      "PanCardUploadWidget.js"
    )
  );
  const documentUploadService = new DocumentUploadService();
  try {
    const res = await documentUploadService.uploadFileToAppWrite([file]);
    const responseData = res.data;
    if (responseData.status === "SUCCESS") {
      return {
        uploadedDocId: responseData.fileId,
        file,
      };
    } else {
      console.log(responseData);
      throw new Error("UPLOAD_PAN_TO_DOC_SERVER_FAILED");
    }
  } catch (e) {
    crashlytics().log(
      ErrorUtil.createError(
        e,
        e.message,
        e.message,
        { file },
        "uploadToAppWrite()",
        "PanCardUploadWidget.js"
      )
    );
    console.log(e);
    if (e.message === "UPLOAD_PAN_TO_DOC_SERVER_FAILED") {
      throw e;
    } else {
      throw new Error("CANNOT_REACH_DOCUMENT_UPLOAD_SERVICE");
    }
  }
};

const PanCardUploadWidget = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "PanCardUploadWidget method starts here ",
      { props },
      "PanCardUploadWidget()",
      "PanCardUploadWidget.js"
    )
  );
  const dispatch = useDispatch();
  const panFile = useSelector((state) => state.formDetails.panFile);
  const hasError = isUndefined(props.rawErrors)
    ? 0
    : props.rawErrors.length > 0;
  const [isUploadDone, setIsUploadDone] = useState(!isEmpty(panFile));
  const useRemoveFile = useRequest(
    () => dispatch.formDetails.setPanFile(undefined),
    {
      manual: true,
    }
  );
  const uploadFile = useRequest(uploadFileToServer, {
    manual: true,
    onSuccess: (results, params) => {
      const { uploadedDocId } = results;
      props.onChange(uploadedDocId + "::" + uploadedFileName);
      setIsUploadDone(true);
      Toast.show({
        type: "success",
        position: "bottom",
        props: {
          title: translations["pan.title"],
          description: translations["pan.success"],
        },
      });
    },
    onError: (error, params) => {
      console.log(error);
      setIsUploadDone(true);
      if (
        error.message === "CANNOT_REACH_PAN_VALIDATION_SERVICE" ||
        error.message === "CANNOT_REACH_DOCUMENT_UPLOAD_SERVICE"
      ) {
        throw error;
      } else {
        Toast.show({
          type: "error",
          position: "bottom",
          props: {
            title: translations["pan.title"],
            description: translations["pan.failed"],
          },
        });
      }
    },
  });
  const { translations } = useContext(LocalizationContext);
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
        "PanCardUploadWidget.js"
      )
    );

    if (uri.length > 0) {
      useRemoveFile.run();
      // remove from props
      props.onChange(undefined);
      setIsUploadDone(false);
    }
  };
  const onFileChange = async (data) => {
    setIsUploadDone(false);
    const fileDetails = {
      uri: data.uri,
      type: data.type,
      name: "panCard.jpg",
    };
    uploadFile.run(dispatch, fileDetails);
    // do automatic upload to the server
  };
  return (
    <>
      {/* {props.value && (
        <>
          <Text category='s1' status='success'>
            {translations['Upload.successfully']}
          </Text>
          <DownloadComponent fileUrl={fileName} uploadedDocId={docId} />
        </>
      )} */}
      <ImageUploadComponent
        hasError={hasError}
        isUploadDone={isUploadDone}
        onFileChange={onFileChange}
        uris={panFile ? [panFile.uri] : []}
        loading={uploadFile.loading}
        selectText={translations["pan.uploadText"]}
        removeFile={removeFile}
      />
    </>
  );
};
export default PanCardUploadWidget;

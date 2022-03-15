import React, { useContext, useState } from "react";
import { useRequest } from "ahooks";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Text } from "@ui-kitten/components";
import isEmpty from "lodash.isempty";
import Toast from "react-native-toast-message";
import { LocalizationContext } from "../../../../translation/Translation";
import DocumentUploadService from "../../../../services/DocumentUploadService";
import ResourceFactoryConstants from "../../../../services/ResourceFactoryConstants";
import DocumentPicker from "react-native-document-picker";
import DataService from "../../../../services/DataService";
import DocumentUploadComponent from "../common/DocumentUploadComponent";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

const getNewFileAdded = (newFiles, oldFiles = []) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "getNewFileAdded method starts here ",
      { newFiles, oldFiles },
      "getNewFileAdded()",
      "ITRUploadField.js"
    )
  );
  if (newFiles.length === 0) {
    return [];
  }
  if (oldFiles.length === 0) {
    return newFiles;
  }
  const addedFiles = [];
  newFiles.forEach((file) => {
    if (!oldFiles.some((of) => of.uri === file.uri)) {
      addedFiles.push(file);
    }
  });
  return addedFiles;
};

const uploadITR = async (dispatch, files) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "uploadITR method starts here ",
      { dispatch, files },
      "uploadITR()",
      "ITRUploadField.js"
    )
  );
  try {
    let uploadedDocIds = [];
    for (let r = 0; r < files.length; r++) {
      const docDetails = await uploadToAppWrite(files[r]);
      uploadedDocIds.push(
        `${docDetails.uploadedDocId}'::'${docDetails.uploadedFileName}`
      );
    }
    files.forEach((file) => {
      file.uploading = false;
    });
    await dispatch.formDetails.setIsBankStatementVerified("Yes");
    await dispatch.formDetails.setItrFiles(files);
    return { uploadedDocIds };
  } catch (e) {
    crashlytics().log(
      ErrorUtil.createError(
        e,
        e.message,
        e.message,
        { dispatch, files },
        "uploadITR()",
        "ITRUploadField.js"
      )
    );
    console.log("Inside uploadITR() exception occured", e);
    throw new Error("CANNOT_REACH_ITR_VALIDATION_SERVICE");
  }
};
const uploadToAppWrite = async (file) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "uploadToAppWrite method starts here ",
      { file },
      "uploadToAppWrite()",
      "ITRUploadField.js"
    )
  );
  const documentUploadService = new DocumentUploadService();
  if (isEmpty(file)) {
    return;
  }
  try {
    const res = await documentUploadService.uploadFileToAppWrite(file);
    const responseData = res.data;
    if (responseData.status === "SUCCESS") {
      return {
        uploadedDocId: responseData.fileId,
        uploadedFileName: file.name,
      };
    } else {
      console.log("Inside uploadToAppWrite() exception occurred", responseData);
      throw new Error("UPLOAD_ITR_TO_DOC_SERVER_FAILED");
    }
  } catch (err) {
    crashlytics().log(
      ErrorUtil.createError(
        err,
        err.message,
        err.message,
        { file },
        "uploadToAppWrite()",
        "ITRUploadField.js"
      )
    );
    console.log("Inside uploadToAppWrite(), exception caught", err);
    throw new Error("CANNOT_REACH_ITR_UPLOAD_SERVER");
  }
};
const ITRUploadField = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "ITRUploadField method starts here ",
      { props },
      "ITRUploadField()",
      "ITRUploadField.js"
    )
  );
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const store = useStore();
  // need a copy of bank statement files and not direct reference to state
  const itrFiles = store.select.formDetails.getItrFiles(state);
  const itrFilesCopy = JSON.parse(JSON.stringify(itrFiles));

  const [isUploadDone, setIsUploadDone] = useState(false);
  const { translations } = useContext(LocalizationContext);
  const useRemoveFile = useRequest(
    (file) => dispatch.formDetails.removeItrFiles(file),
    {
      manual: true,
    }
  );
  const uploadFiles = useRequest(uploadITR, {
    manual: true,
    onSuccess: (result, params) => {
      const { uploadedDocIds } = result;
      const allUploadedDocIds = props.value
        ? [...props.value, ...uploadedDocIds]
        : uploadedDocIds;
      props.onChange(allUploadedDocIds);
      setIsUploadDone(true);
      Toast.show({
        type: "success",
        position: "bottom",
        visibilityTime: 2000,
        props: {
          title: translations["itr.title"],
          description: translations["itr.success"],
        },
      });
    },
    onError: (error, params) => {
      crashlytics().log(
        ErrorUtil.createError(
          error,
          error.message,
          error.message,
          { error, params },
          "ITRUploadField()",
          "ITRUploadField.js"
        )
      );

      console.log("Inside onError() method", error);
      setIsUploadDone(true);
      if (
        error.message === "CANNOT_REACH_ITR_VALIDATION_SERVICE" ||
        error.message === "CANNOT_REACH_ITR_UPLOAD_SERVER"
      ) {
        itrFilesCopy = [];
        throw error;
      } else {
        Toast.show({
          type: "error",
          position: "bottom",
          props: {
            title: translations["itr.title"],
            description: translations["itr.failed"],
          },
        });
      }
    },
  });
  const removeFile = (file) => {
    crashlytics().log(
      ErrorUtil.createLog(
        "removeFile method starts here ",
        { file },
        "removeFile()",
        "ITRUploadField.js"
      )
    );
    if (!isEmpty(file) > 0) {
      useRemoveFile.run(file);
      // remove from props
      const newProps = props.formData.filter((v) => v.indexOf(file.name) > -1);
      props.onChange([...newProps]);
    }
  };

  const onFileChange = (allFiles) => {
    crashlytics().log(
      ErrorUtil.createLog(
        "onFileChange method starts here ",
        { allFiles },
        "onFileChange()",
        "ITRUploadField.js"
      )
    );
    setIsUploadDone(false);
    const newFilesAdded = getNewFileAdded(allFiles, itrFiles);
    if (newFilesAdded.length > 0) {
      uploadFiles.run(dispatch, newFilesAdded);
    }
  };
  return (
    <>
      <Text appearance="hint" category="label">
        {props.schema.title}
      </Text>
      <DocumentUploadComponent
        isUploadDone={isUploadDone}
        onFileChange={onFileChange}
        multiple
        files={itrFilesCopy}
        type={[DocumentPicker.types.pdf]}
        loading={uploadFiles.loading}
        selectText={translations["itr.uploadText"]}
        removeFile={removeFile}
      />
      <Text appearance="hint" category="label" status="info">
        {props.schema.description}
      </Text>
    </>
  );
};
export default ITRUploadField;

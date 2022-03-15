import { StyleService, Text } from "@ui-kitten/components";
import React, { useContext, useState } from "react";
import { useToast } from "react-native-toast-notifications";
import { LocalizationContext } from "../../../../translation/Translation";
import DocumentUploadService from "../../../../services/DocumentUploadService";
import DocumentPicker from "react-native-document-picker";
import DocumentUploadComponent from "../common/DocumentUploadComponent";
import isEmpty from "lodash.isempty";
import ReactJsonSchemaUtil from "../../../../services/ReactJsonSchemaFormUtil";
import DownloadComponent from "../common/DownloadComponent";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

const FileUploadWidget = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "FileUploadWidget method starts here ",
      { props },
      "FileUploadWidget()",
      "FileUploadWidget.js"
    )
  );
  let uploadedFileName, uploadedDocId;
  const toast = useToast();
  const [isUploadDone, setIsUploadDone] = useState(false);
  const { translations } = useContext(LocalizationContext);
  const [files, setFiles] = useState([]);
  const documentUploadService = new DocumentUploadService();
  const [loaderVisibility, setLoaderVisibility] = useState(false);
  let docId, fileName;
  if (props.value) {
    const tempArr = props.value.split("::");
    docId = tempArr[0];
    fileName = tempArr[1];
  }

  const uploadToAppWrite = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        "uploadToAppWrite method starts here ",
        undefined,
        "uploadToAppWrite()",
        "FileUploadWidget.js"
      )
    );
    if (isEmpty(files)) {
      return;
    }
    uploadedFileName = ReactJsonSchemaUtil.getFileName(files).join("::");
    setLoaderVisibility(true);
    documentUploadService
      .uploadFileToAppWrite(files)
      .then((res) => {
        const responseData = res.data;
        if (responseData.status === "SUCCESS") {
          uploadedDocId = responseData.fileId;
          props.onChange(uploadedDocId + "::" + uploadedFileName);
          toast.show(translations["Upload.successfully"], { type: "success" });
          setLoaderVisibility(false);
          setIsUploadDone(true);
        } else {
          toast.show(translations["common.error"], { type: "danger" });
          setLoaderVisibility(false);
        }
      })
      .catch((err) => {
        crashlytics().log(
          ErrorUtil.createError(
            err,
            err.message,
            err.message,
            undefined,
            "uploadToAppWrite()",
            "FileUploadWidget.js"
          )
        );
        toast.show(err.message, { type: "danger" });
        setLoaderVisibility(false);
      });
  };
  const onFileChange = (data) => {
    crashlytics().log(
      ErrorUtil.createLog(
        "onFileChange method starts here ",
        { data },
        "onFileChange()",
        "FileUploadWidget.js"
      )
    );
    setIsUploadDone(false);
    setFiles(data);
  };
  return (
    <>
      {props.value && (
        <>
          <Text style={styles.text} status="success">
            Sussessfully Uploaded
          </Text>
          <DownloadComponent fileUrl={fileName} uploadedDocId={docId} />
        </>
      )}
      <DocumentUploadComponent
        isUploadDone={isUploadDone}
        onFileChange={onFileChange}
        onUploadHandler={uploadToAppWrite}
        multiple={false} // as of now, saving one file
        type={[DocumentPicker.types.pdf]}
        value={props.value}
        loading={loaderVisibility}
        selectText={translations["upload.choose"]}
      />
    </>
  );
};
const styles = StyleService.create({
  text: {
    margin: 4,
  },
});
export default FileUploadWidget;

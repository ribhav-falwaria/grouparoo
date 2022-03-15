import DataService from "./DataService";
import ResourceFactoryConstants from "./ResourceFactoryConstants";
import BodyHeaderService from "./BodyHeaderService";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../Errors/ErrorUtil";

class DocumentUploadService {
  bodyHeaderService = new BodyHeaderService();
  resourceFactoryConstants = new ResourceFactoryConstants();

  uploadFileToAppWrite(files) {
    crashlytics().log(
      ErrorUtil.createLog(
        " uploadFileToAppWrite method starts here",
        { files },
        "uploadFileToAppWrite()",
        "DocumentUploadService.js"
      )
    );
    const formData = new FormData();
    this.resourceFactoryConstants = new ResourceFactoryConstants();
    if (Array.isArray(files)) {
      for (let file of files) {
        formData.append("file", file);
      }
    } else {
      formData.append("file", files);
    }

    return DataService.postData(
      this.resourceFactoryConstants.constants.lending.uploadFile,
      formData
    );
  }
  downloadFile(docUrl) {
    crashlytics().log(
      ErrorUtil.createLog(
        " downloadFile method starts here",
        { docUrl },
        "downloadFile()",
        "DocumentUploadService.js"
      )
    );
    return DataService.getDataV1(docUrl, {
      responseType: "blob",
    });
  }
}
export default DocumentUploadService;

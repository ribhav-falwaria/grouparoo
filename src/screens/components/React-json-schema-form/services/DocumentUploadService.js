import DataService from "./DataService";
import ResourceFactoryConstants from "./ResourceFactoryConstants";
import BodyHeaderService from "./BodyHeaderService";

class DocumentUploadService {
  bodyHeaderService = new BodyHeaderService();
  resourceFactoryConstants = new ResourceFactoryConstants();

  uploadFileToAppWrite(files) {
    const formData = new FormData();
    this.resourceFactoryConstants = new ResourceFactoryConstants();
    if (Array.isArray(files)) {
      for (let file of files) {
        formData.append("file", file);
      }
    } else {
      formData.append('file', files)
    }

    return DataService.postData(
      this.resourceFactoryConstants.constants.lending.uploadFile,
      formData
    );
  }
  downloadFile(docUrl) {
    return DataService.getDataV1(docUrl, {
      responseType: "blob",
    });
  }
}
export default DocumentUploadService;

import React from "react";
import { Text } from "@ui-kitten/components";
import { Fragment } from "react";
import { Platform, PermissionsAndroid, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import RNFetchBlob from "rn-fetch-blob";
import ResourceFactoryConstants from "../../../../services/ResourceFactoryConstants";
import { useToast } from "react-native-toast-notifications";
const DownloadComponent = ({ fileUrl, uploadedDocId, fileName }) => {
  const resourceFactoryConstants = new ResourceFactoryConstants();
  const toast = useToast();
  let url = uploadedDocId
    ? `${resourceFactoryConstants.constants.lending.downloadFile}${uploadedDocId}`
    : fileUrl;
  const checkPermission = async () => {
    if (Platform.OS === "ios") {
      downloadFile();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message:
              "Application needs access to your storage to download File",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile();
        } else {
          toast.show("Storage Permission Not Granted", { type: "danger" });
        }
      } catch (err) {
        // To handle permission related exception
        console.log("++++" + err);
      }
    }
  };

  const downloadFile = () => {
    let date = new Date();
    let FILE_URL = fileUrl;
    let file_ext = getFileExtention(FILE_URL);
    file_ext = "." + file_ext[0];
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          "/file_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: "downloading file...",
        notification: true,
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch("GET", url)
      .then((res) => {
        alert("File Downloaded Successfully.");
      }).catch((err)=>{
        console.log("Error while downloading",err);
      });
  };

  const getFileExtention = (fileUrl) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };
  return (
    <Fragment>
      <TouchableOpacity onPress={checkPermission}>
        <Text status="primary" style={styles.downloadText}>
          {/* Download {fileName ? fileName : ""} */}
          Download
        </Text>
      </TouchableOpacity>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  downloadText: {
    fontWeight: "bold",
    marginLeft: 4,
  },
});

export default DownloadComponent;

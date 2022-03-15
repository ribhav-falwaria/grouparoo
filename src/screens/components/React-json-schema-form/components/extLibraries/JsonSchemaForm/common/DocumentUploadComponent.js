import {
  Card,
  StyleService,
  Text,
  useStyleSheet,
  Spinner,
} from "@ui-kitten/components";
import React, { useContext, useRef, useState } from "react";
import { View } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import isUndefined from "lodash.isundefined";
import { LocalizationContext } from "../../../../translation/Translation";
import DocumentPicker from "react-native-document-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import BottomSheet from "./BottomSheet";
import IconUtil from "../../../common/IconUtil";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";
/** @description Do not use this component for image upload */
const mergeTempFilesWithExisting = (tempFiles, existingFiles) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "mergeTempFilesWithExisting method starts here",
      { tempFiles, existingFiles },
      "mergeTempFilesWithExisting()",
      "DocumentUploadComponent.js"
    )
  );
  const filesToDisplay = [...existingFiles];
  tempFiles.forEach((file) => {
    const doesFileExist = existingFiles.find((f) => f.uri === file.uri);
    if (isUndefined(doesFileExist)) {
      filesToDisplay.push(file);
    }
  });
  return filesToDisplay;
};

const DocumentUploadComponent = ({
  isUploadDone,
  multiple = false,
  onFileChange,
  type = [DocumentPicker.types.pdf],
  selectText,
  files = [],
  removeFile,
}) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "DocumentUploadComponent method starts here",
      {
        isUploadDone,
        multiple,
        onFileChange,
        type,
        selectText,
        files,
        removeFile,
      },
      "DocumentUploadComponent()",
      "DocumentUploadComponent.js"
    )
  );
  const refRBSheet = useRef();
  const themeStyle = useStyleSheet(theme);
  const { translations } = useContext(LocalizationContext);
  const [tempFiles, setTempFiles] = useState([]);
  const onSelectFile = async () => {
    const uploadedFiles = [];
    crashlytics().log(
      ErrorUtil.createLog(
        "onSelectFile method starts here",
        undefined,
        "onSelectFile()",
        "DocumentUploadComponent.js"
      )
    );
    try {
      let results;
      if (multiple) {
        results = await DocumentPicker.pickMultiple({
          type: type,
        });
        for (const res of results) {
          uploadedFiles.push({
            uri: res.uri,
            type: res.type,
            name: res.name,
            uploading: true,
          });
        }
      } else {
        results = await DocumentPicker.pick({
          type: type,
        });
        uploadedFiles.push({
          uri: results.uri,
          type: results.type,
          name: results.name,
          uploading: true,
        });
      }
      onFileChange([...files, ...uploadedFiles]);
      setTempFiles(uploadedFiles);
      refRBSheet.current.close();
    } catch (err) {
      crashlytics().log(
        ErrorUtil.createError(
          err,
          err.message,
          err.message,
          undefined,
          "onSelectFile()",
          "DocumentUploadComponent.js"
        )
      );
      if (!DocumentPicker.isCancel(err)) {
        throw err;
      }
    }
  };
  const onDeleteHandler = (id) => {
    crashlytics().log(
      ErrorUtil.createLog(
        "onDeleteHandler method starts here",
        { id },
        "onDeleteHandler()",
        "DocumentUploadComponent.js"
      )
    );
    const deletedFile = files[id];
    // delete this from tempFiles as well
    const newTempFiles = tempFiles.filter((f) => {
      f.uri !== deletedFile.uri;
    });
    setTempFiles([...newTempFiles]);
    removeFile(deletedFile);

    crashlytics().log(
      ErrorUtil.createLog(
        "onDeleteHandler method ends here",
        { id },
        "onDeleteHandler()",
        "DocumentUploadComponent.js"
      )
    );
  };
  const displayFiles = mergeTempFilesWithExisting(tempFiles, files);
  return (
    <>
      {displayFiles.length === 0 && (
        <TouchableOpacity onPress={() => refRBSheet.current.open()}>
          <Card style={themeStyle.cardContainer}>
            <Text category="s1" status="default">
              {selectText}
            </Text>
          </Card>
        </TouchableOpacity>
      )}
      {displayFiles.length > 0 && (
        <Card style={themeStyle.cardContainerV1}>
          <View style={themeStyle.fileContainer}>
            <View>
              {displayFiles &&
                displayFiles.map((file, index) => {
                  return (
                    <Card key={index}>
                      <View style={themeStyle.fileCardContainer}>
                        <View>
                          <Text category="p1">{file.name}</Text>
                        </View>
                        {file.uploading && <Spinner size="small" />}
                        {!file.uploading && (
                          <TouchableOpacity
                            onPress={() => {
                              onDeleteHandler(index);
                            }}
                          >
                            <Text appearance="hint">
                              <IconUtil.CancelIcon />
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </Card>
                  );
                })}
            </View>
            {multiple && (
              <TouchableOpacity onPress={() => refRBSheet.current.open()}>
                <Card>
                  <View style={themeStyle.fileCardContainer}>
                    <Text category="s1" status="info">
                      {translations["upload.choose.addAnother"]}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            )}
          </View>
        </Card>
      )}
      <BottomSheet
        onSelectFile={onSelectFile}
        refRBSheet={refRBSheet}
        height={150}
      />
    </>
  );
};

const theme = StyleService.create({
  fileContainer: {
    flex: 1,
    fiexDirection: "column",
    justifyContent: "space-between",
  },
  cardContainer: {
    flex: 1,
    height: heightPercentageToDP("25%"),
    backgroundColor: "background-basic-color-2",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainerV1: {
    flex: 1,
    minHeight: heightPercentageToDP("25%"),
    height: "100%",
    backgroundColor: "background-basic-color-2",
  },
  fileCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    marginTop: 10,
  },
});
export default DocumentUploadComponent;

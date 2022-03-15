import { Button } from "@ui-kitten/components";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Linking } from "react-native";
import Toast from "react-native-toast-message";
import DataService from "../../../../services/DataService";
import ResourceFactoryConstants from "../../../../services/ResourceFactoryConstants";
import RNFetchBlob from "rn-fetch-blob";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import ReactJsonSchemaUtil from "../../../../services/ReactJsonSchemaFormUtil";
import { LocalizationContext } from "../../../../translation/Translation";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";
import { useRequest } from "ahooks";
import isEmpty from "lodash.isempty";
import FormSuccess from "../../../Forms/FormSuccess";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

const uploadToAppWrite = async (file, url) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "uploadToAppWrite method starts here ",
      { file, url },
      "uploadToAppWrite()",
      "EsignInputWidget.js"
    )
  );
  try {
    const response = await RNFetchBlob.fetch(
      "POST",
      url,
      {
        "Content-Type": "multipart/form-data",
      },
      [{ name: "file", filename: "agreement", data: file }]
    );
    if (response?.respInfo?.status === 200) {
      const data = JSON.parse(response.data);
      return {
        uploadedDocId: data.fileId,
        file,
      };
    } else {
      throw new Error("UPLOAD_TO_APPWRITE_SERVER_FAILED");
    }
  } catch (e) {
    crashlytics().log(
      ErrorUtil.createError(
        e,
        e.message,
        e.message,
        { file, url },
        "uploadToAppWrite()",
        "EsignInputWidget.js"
      )
    );
    if (e.message === "UPLOAD_TO_APPWRITE_SERVER_FAILED") {
      throw e;
    } else {
      throw new Error("CANNOT_REACH_APPWRITE_SERVICE");
    }
  }
};

const EsignInputWidget = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "EsignInputWidget method starts here ",
      { props },
      "EsignInputWidget()",
      "EsignInputWidget.js"
    )
  );
  const { translations } = useContext(LocalizationContext);
  const resourceFactoryConstants = new ResourceFactoryConstants();
  const [isEsignDone, setIsEsignDone] = useState(!!props.value);
  const [file, setFile] = useState("");
  const [appUrl, setAppUrl] = useState(null);

  const fileUrl =
    props?.schema?.url ||
    "https://www.agstartups.org.br/uploads/2020/07/sample.pdf";

  useEffect(async () => {
    const initialUrl = await Linking.getInitialURL();
    crashlytics().log(
      ErrorUtil.createLog(
        "Linking Url",
        { initialUrl },
        "useEffect",
        "EsignInputWidget.js"
      )
    );
    setAppUrl(initialUrl || "novopay://com.novoloan.customerapp/open");
  }, []);

  const handleUrl = (event) => {
    crashlytics().log(
      ErrorUtil.createLog(
        "handleUrl method starts here ",
        { event },
        "handleUrl()",
        "EsignInputWidget.js"
      )
    );
    let temp = false;
    let isEsignCallBack = false;
    const returnUrl = event.url;
    const queryParamObject = ReactJsonSchemaUtil.getQueryParams(returnUrl);
    for (const key in queryParamObject) {
      if (key === "esign_status" && queryParamObject[key] === "success") {
        setIsEsignDone(true);
        temp = true;
      }
      if (key === "esign_status") {
        isEsignCallBack = true;
      }
    }
    if (!temp && isEsignCallBack) {
      Toast.show({
        type: "error",
        position: "bottom",
        props: {
          title: translations["esign.title"],
          description: translations["esign.unexpected.error"],
        },
      });
    }
  };

  const useTodownFileBlob = useRequest(
    async (fileUrl) => {
      const response = await DataService.getDataV1(fileUrl, {
        responseType: "blob",
      });
      if (response.status === 200 && response.data) {
        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = function () {
          const base64data = reader.result;
          setFile(base64data.split(",")[1]);
        };
      } else {
        throw new Error("ERROR_WHILE_DOWNLOADING_BLOB");
      }
    },
    {
      manual: true,
      onError: (err) => {
        crashlytics().log(
          ErrorUtil.createError(
            err,
            err.message,
            err.message,
            undefined,
            "useTodownFileBlob",
            "EsignInputWidget.js"
          )
        );
        throw err;
      },
    }
  );

  const useEsignProcessHandler = useRequest(
    async (url, file, appUrl) => {
      crashlytics().log(
        ErrorUtil.createLog(
          "useEsignProcessHandler method starts here ",
          { url, file, appUrl },
          "useEsignProcessHandler()",
          "EsignInputWidget.js"
        )
      );
      try {
        const response = await RNFetchBlob.fetch(
          "POST",
          url,
          {
            "Content-Type": "multipart/form-data",
          },
          [
            { name: "file", filename: "agreement", data: file },
            { name: "page_no", data: "1" },
            {
              name: "redirect_url",
              data: encodeURIComponent(appUrl),
            },
          ]
        );
        if (response?.respInfo?.status === 200) {
          const data = JSON.parse(response.data);
          if (data.status === "Uploaded Document") {
            const esignUrl = data.url;
            Alert.alert(
              translations["esign.title"],
              translations["esign.redirect"],
              [
                {
                  text: translations["text.okay"],
                  onPress: () => {
                    openLink(esignUrl);
                  },
                },
              ]
            );
          } else {
            crashlytics().log(
              ErrorUtil.createLog(
                "Upload Failed while uploading to veri5Digital with message",
                data,
                "useEsignProcessHandler",
                "EsignInputWidget.js"
              )
            );
          }
        } else {
          throw new Error("UNEXPECTED_ERROR_WHILE_UPLOADING");
        }
      } catch (error) {
        crashlytics().log(
          ErrorUtil.createError(
            error,
            error.message,
            error.message,
            { url, file, appUrl },
            "useEsignProcessHandler()",
            "EsignInputWidget.js"
          )
        );
        throw new Error("ERROR_REACHING_TO_ESIGN_UPLOAD_SERVER");
      }
    },
    { manual: true }
  );

  const useUploadToAppwrite = useRequest(uploadToAppWrite, {
    manual: true,
    onSuccess: (res) => {
      props.onChange(res?.uploadedDocId);
    },
    onError: (err) => {
      crashlytics().log(
        ErrorUtil.createError(
          err,
          err.message,
          err.message,
          undefined,
          "useUploadToAppwrite",
          "EsignInputWidget.js"
        )
      );
      throw err;
    },
  });

  useEffect(() => {
    useTodownFileBlob.run(fileUrl);
  }, []);

  useEffect(async () => {
    if (isEsignDone && !isEmpty(file) && !props.value) {
      useUploadToAppwrite.run(
        file,
        resourceFactoryConstants.constants.lending.uploadFile
      );
    }
  }, [isEsignDone, JSON.stringify(file)]);

  const openLink = async (esignUrl) => {
    crashlytics().log(
      ErrorUtil.createLog(
        "openLink method starts here ",
        { esignUrl },
        "openLink()",
        "EsignInputWidget.js"
      )
    );
    const supported = await Linking.canOpenURL(esignUrl);
    if (supported) {
      Linking.addEventListener("url", handleUrl);
      await Linking.openURL(esignUrl);
    } else {
      crashlytics().log(
        ErrorUtil.createLog(
          "Can not open this url",
          esignUrl,
          "useTodownFileBlob",
          "EsignInputWidget.js"
        )
      );
    }
  };

  const esignProcessHandler = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        "esignProcessHandler method starts here ",
        undefined,
        "esignProcessHandler()",
        "EsignInputWidget.js"
      )
    );
    if (!appUrl) {
      crashlytics().log(
        ErrorUtil.createLog(
          "App Url is not defined",
          appUrl,
          "esignProcessHandler",
          "EsignInputWidget"
        )
      );
      return;
    }
    useEsignProcessHandler.run(
      resourceFactoryConstants.constants.eSign.uploadPdfForeSign,
      file,
      appUrl
    );
  };
  return (
    <>
      <LoadingSpinner
        visible={useEsignProcessHandler.loading || useTodownFileBlob.loading}
      />
      {!isEsignDone && (
        <Button
          appearance="outline"
          status="primary"
          onPress={esignProcessHandler}
          style={{ marginTop: 5 }}
        >
          {translations["esign.start.esign"]}
        </Button>
      )}
      {isEsignDone && (
        <FormSuccess
          description={translations["esign.successfull"]}
          isButtonVisible={false}
        />
      )}
    </>
  );
};

export default EsignInputWidget;

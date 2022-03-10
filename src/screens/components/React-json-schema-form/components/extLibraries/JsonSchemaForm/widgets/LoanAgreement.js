import { Button, CheckBox, Spinner, Text } from "@ui-kitten/components";
import React, { Fragment, useEffect, useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import isEmpty from "lodash.isempty";
import Pdf from "react-native-pdf";
import { WebView } from "react-native-webview";
import DownloadComponent from "../common/DownloadComponent";

const LoanAgreementWidget = (props) => {
  const { value, rawErrors, required } = props;
  const [isValid, setIsValid] = useState();
  useEffect(() => {
    if (!isEmpty(rawErrors)) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [rawErrors, value, required]);
  const url =
    props?.schema?.url ||
    "https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf";
  const [show, setShow] = useState(true);
  return (
    <Fragment>
      <View style={styles.container}>
        {/* <Pdf source={{ uri: url }} style={styles.pdf} /> */}
        {show && <Spinner />}
        <WebView
          style={{
            height: Dimensions.get("window").height - 275,
            width: Dimensions.get("window").width,
          }}
          source={{
            uri: `https://docs.google.com/gview?embedded=true&url=${url}`,
          }}
          onLoad={() => setShow(false)}
        />
      </View>
      <Button appearance="outline" style={{ marginTop: 6 }}>
        <DownloadComponent fileUrl={url} />
      </Button>
      <CheckBox
        checked={props.value && props.value === "Yes" ? true : false}
        style={{ marginTop: 5 }}
        onChange={(checked) => props.onChange(checked ? "Yes" : undefined)}
      >
        {"I agree to the terms and conditions."}
      </CheckBox>
    </Fragment>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 15,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default LoanAgreementWidget;
import { Button, CheckBox, Spinner, Text } from "@ui-kitten/components";
import React, { Fragment, useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import Pdf from "react-native-pdf";
import { WebView } from "react-native-webview";
import DownloadComponent from "../common/DownloadComponent";

const LoanAgreementWidget = (props) => {
  props.onChange("Yes");
  const url =
    props?.schema?.url ||
    "https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf";
  const [show, setShow] = useState(true);
  console.log(Dimensions.get("window").height - 275);
  return (
    <Fragment>
      <View style={styles.container}>
        {/* <Pdf source={{ uri: url }} style={styles.pdf} /> */}
        {show && <Spinner />}
        <WebView
          style={{ height: Dimensions.get("window").height - 275, width: Dimensions.get("window").width }}
          source={{
            uri: `https://docs.google.com/gview?embedded=true&url=${url}`,
          }}
          onLoad={() => setShow(false)}
        />
      </View>
      <CheckBox checked={true} style={{ marginTop: 5 }}>
        {"I accept the agreement."}
      </CheckBox>
      <Button appearance="outline" style={{ marginTop: 6 }}>
        <DownloadComponent
          fileUrl={url}
        />
      </Button>
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

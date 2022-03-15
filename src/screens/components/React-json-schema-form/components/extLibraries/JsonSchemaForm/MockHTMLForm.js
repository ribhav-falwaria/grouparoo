import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

class Event {
  preventDefault() {}
}

global.Event = global.Event || Event;
global.CustomEvent = global.CustomEvent || Event;

export class MockHTMLForm extends Component {
  render() {
    crashlytics().log(
      ErrorUtil.createLog(
        "MockHTMLForm method starts here ",
        undefined,
        "MockHTMLForm()",
        "MockHTMLForm.js"
      )
    );
    return <View style={styles.formContainer}>{this.props.children}</View>;
  }

  dispatchEvent(e) {
    e.persist = () => null;
    this.props.onSubmit(e);
  }
}
const styles = StyleSheet.create({
  formContainer: {
    justifyContent: "flex-start",
  },
});

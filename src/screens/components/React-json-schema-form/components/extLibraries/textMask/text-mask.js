import React, { createRef } from "react";
import { Text } from "@ui-kitten/components";
import BaseTextComponent from "./base-text-component";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../screens/Errors/ErrorUtil";

export default class TextMask extends BaseTextComponent {
  constructor(props) {
    super(props);
    this.myRef = createRef();
  }

  getElement() {
    crashlytics().log(
      ErrorUtil.createLog(
        "getElement method starts here ",
        undefined,
        "getElement()",
        "TextMask.js"
      )
    );
    return this.myRef;
  }

  render() {
    return (
      <Text ref={this.myRef} {...this.props}>
        {this.getDisplayValueFor(this.props.value)}
      </Text>
    );
  }
}

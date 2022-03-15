import React from "react";
import { Input } from "@ui-kitten/components";
import BaseTextComponent from "./base-text-component";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../screens/Errors/ErrorUtil";

export default class TextInputMask extends BaseTextComponent {
  getElement() {
    crashlytics().log(
      ErrorUtil.createLog(
        "getElement method starts here ",
        undefined,
        "getElement()",
        "TextInputMask.js"
      )
    );
    return this._inputElement;
  }

  _onChangeText(text) {
    crashlytics().log(
      ErrorUtil.createLog(
        "_onChangeText method starts here ",
        { text },
        "_onChangeText()",
        "TextInputMask.js"
      )
    );
    if (!this._checkText(text)) {
      return;
    }

    const { maskedText, rawText } = this.updateValue(text);

    if (this.props.onChangeText) {
      this._trySetNativeProps(maskedText);
      this.props.onChangeText(maskedText, rawText);
    }
  }

  _trySetNativeProps(maskedText) {
    crashlytics().log(
      ErrorUtil.createLog(
        "_trySetNativeProps method starts here ",
        { maskedText },
        "_trySetNativeProps()",
        "TextInputMask.js"
      )
    );
    try {
      const element = this.getElement();
      element.setNativeProps && element.setNativeProps({ text: maskedText });
    } catch (error) {
      crashlytics().log(
        ErrorUtil.createError(
          error,
          error.message,
          error.message,
          { maskedText },
          "_trySetNativeProps()",
          "TextInputMask.js"
        )
      );
      // silent
    }
  }

  _checkText(text) {
    crashlytics().log(
      ErrorUtil.createLog(
        "_checkText method starts here ",
        { text },
        "_checkText()",
        "TextInputMask.js"
      )
    );
    if (this.props.checkText) {
      return this.props.checkText(this.props.value, text);
    }

    return true;
  }

  _getKeyboardType() {
    crashlytics().log(
      ErrorUtil.createLog(
        "_getKeyboardType method starts here ",
        undefined,
        "_getKeyboardType()",
        "TextInputMask.js"
      )
    );
    return this.props.keyboardType || this._maskHandler.getKeyboardType();
  }

  render() {
    return (
      <Input
        ref={(ref) => {
          if (ref) {
            this._inputElement = ref;

            if (typeof this.props.refInput === "function") {
              this.props.refInput(ref);
            }
          }
        }}
        keyboardType={this._getKeyboardType()}
        {...this.props}
        onChangeText={(text) => this._onChangeText(text)}
        value={this.getDisplayValueFor(this.props.value)}
      />
    );
  }
}

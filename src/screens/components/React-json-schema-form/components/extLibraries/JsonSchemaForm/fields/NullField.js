import { Component } from "react";
import * as types from "../types";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

class NullField extends Component {
  componentDidMount() {
    if (this.props.formData === undefined) {
      this.props.onChange(null);
    }
  }

  render() {
    return null;
  }
}

if (process.env.NODE_ENV !== "production") {
  NullField.propTypes = types.fieldProps;
}

export default NullField;

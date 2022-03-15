import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Text } from "@ui-kitten/components";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";
function UnsupportedField({ schema, idSchema, reason }) {
  crashlytics().log(
    ErrorUtil.createLog(
      "UnsupportedField method starts here ",
      { schema, idSchema, reason },
      "UnsupportedField()",
      "UnsupportedField.js"
    )
  );
  return (
    <View>
      <Text>
        Unsupported field schema
        {idSchema && idSchema.$id && (
          <Text>
            {" for"} field <Text>{idSchema.$id}</Text>
          </Text>
        )}
        {reason && <Text>: {reason}</Text>}.
      </Text>
      {schema && <Text>{JSON.stringify(schema, null, 2)}</Text>}
    </View>
  );
}

if (process.env.NODE_ENV !== "production") {
  UnsupportedField.propTypes = {
    schema: PropTypes.object.isRequired,
    idSchema: PropTypes.object,
    reason: PropTypes.string,
  };
}

export default UnsupportedField;

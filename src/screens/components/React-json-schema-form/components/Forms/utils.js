import isUndefined from "lodash.isundefined";
import isEmpty from "lodash.isempty";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

export const getSchemaForStep = ({ schema, uiSchema, step }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "getSchemaForStep method starts here",
      { schema, uiSchema, step },
      "getSchemaForStep()",
      "utils.js"
    )
  );
  const newSchema = {
    title: "",
    type: "object",
    required: [],
    properties: {},
  };
  const newUiSchema = {
    "ui:order": [],
  };
  newSchema.title = step.stepTitle;
  newSchema.description = step.stepDescription || "";
  const orderIndex = [];
  step.stepFields.forEach((field) => {
    // Taking care of schema
    const schemaField = schema.properties[field];
    // check if field has any dependent field... add this widget too
    if (schema?.dependencies && schema.dependencies[field]) {
      const oneOfArray = schema.dependencies[field].oneOf;
      for (const oneOfElement of oneOfArray) {
        const properties = oneOfElement.properties;
        for (const propertyElement in properties) {
          if (propertyElement !== field && uiSchema[propertyElement]) {
            newUiSchema[propertyElement] = uiSchema[propertyElement];
          }
        }
      }
    }
    newSchema.properties[field] = schemaField;
    if (schema.required.indexOf(field) > -1) {
      newSchema.required.push(field);
    }
    // Taking care of uiSchema
    const fieldUiSchema = uiSchema[field];
    if (fieldUiSchema) {
      newUiSchema[field] = fieldUiSchema;
    }
    const ix = uiSchema["ui:order"].findIndex((item) => item === field);
    orderIndex.push({
      ix,
      field,
    });
  });
  // orderIndex = orderBy(orderIndex, ["ix"], ["asc"]);
  // orderIndex.forEach((oi) => {
  //   newUiSchema["ui:order"].push(oi.field);
  // });
  newUiSchema["ui:order"] = uiSchema["ui:order"];
  // check dependencies are there, include it in new schema
  if (!isUndefined(schema.dependencies)) {
    newSchema.dependencies = schema.dependencies;
  }
  return {
    newSchema,
    newUiSchema,
  };
};

export const findStepForFormData = (steps, formData) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "findStepForFormData method starts here",
      { steps, formData },
      "findStepForFormData()",
      "utils.js"
    )
  );
  const FIRST_STEP_INDEX = 1;
  if (isEmpty(formData)) {
    return FIRST_STEP_INDEX;
  }
  let currentStepKey;
  const stepKeys = Object.keys(steps)
    .map((ky) => parseInt(ky))
    .sort((a, b) => a - b);
  for (let r = 0; r < stepKeys.length; r++) {
    const key = stepKeys[r];
    const { stepFields } = steps[key.toString()];
    const isAllFieldsPresent = stepFields.some((v) => {
      const val = formData[v];
      let isFieldPresent = false;
      if (typeof val === "object" && val !== null) {
        isFieldPresent = !isEmpty(val);
      } else {
        isFieldPresent =
          val !== null && !isUndefined(val) && val.toString().length > 0;
      }
      return isFieldPresent;
    });
    if (!isAllFieldsPresent) {
      currentStepKey = key;
      break;
    }
  }
  return parseInt(currentStepKey);
};

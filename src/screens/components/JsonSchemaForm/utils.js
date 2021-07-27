import orderBy from 'lodash.orderby'
export const getSchemaForStep = ({ schema, uiSchema, step }) => {
  const newSchema = {
    title: '',
    type: 'object',
    required: [],
    properties: {

    }
  }
  const newUiSchema = {
    'ui:order': []
  }
  newSchema.title = step.stepTitle
  newSchema.description = step.stepDescription
  let orderIndex = []
  step.stepFields.forEach(field => {
    // Taking care of schema
    const schemaField = schema.properties[field]

    newSchema.properties[field] = schemaField
    if (schema.required.indexOf(field) > -1) {
      newSchema.required.push(field)
    }
    // Taking care of uiSchema
    const fieldUiSchema = uiSchema[field]
    newUiSchema[field] = fieldUiSchema
    const ix = uiSchema['ui:order'].findIndex((item) => item === field)
    orderIndex.push({
      ix, field
    })
  })
  orderIndex = orderBy(orderIndex, ['ix'], ['asc'])
  orderIndex.forEach(oi => {
    newUiSchema['ui:order'].push(oi.field)
  })
  return {
    newSchema,
    newUiSchema
  }
}

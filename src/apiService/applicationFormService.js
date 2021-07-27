import format from 'string-format'
const endpoints = {
  getSchemaAndSteps:
    'https://dev-codeapp.novopay.in/novocode/getSchemaAndStepsByName?formName={name}&schemaSteps={schemaSteps}',
  getUiSchemaByName:
    'https://dev-codeapp.novopay.in/novocode/getUiSchemaByName?formName={formName}',
  getStepsByName:
    'https://dev-codeapp.novopay.in/novocode/getSchemaStepsById?formName={formName}&stepName={}'
}
const getApplicationFormById = async (formName, obj) => {
  try {
    const response = await fetch(format(endpoints.getSchemaAndSteps, { formName, schemaSteps: obj.schemaSteps }))
    const data = await response.json()
    if (data.status.toLowerCase() === 'success') {
      data.id = formName
      return data
    }
  } catch (err) {
    console.log(err.message)
    return {}
  }
}
export default {
  getApplicationFormById
}

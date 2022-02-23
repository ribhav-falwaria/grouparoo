import Ajv from 'ajv'

const signUpSchema = {
  type: 'object',
  required: ['fullName', 'email', 'primaryPhone'],
  properties: {
    fullName: {
      type: 'string',
      minLength: 5
    },
    email: {
      type: 'string',
      pattern: '^\\w+([\\.-]?\\w+)+@\\w+([\\.:]?\\w+)+(\\.[a-zA-Z0-9]{2,3})+$'
    },
    primaryPhone: {
      type: 'string',
      minLength: 10,
      maxLength: 10,
      pattern: '^[6-9]\\d{9}$'
    }
  }
}

const validateFormData = (formData) => {
  const errors = {}
  const ajv = new Ajv({ allErrors: true })
  const validate = ajv.compile(signUpSchema)
  const valid = validate(formData)
  if (!valid) {
    validate.errors.forEach(err => {
      const path = err.dataPath.split('.')
      errors[path[path.length - 1]] = true
    })
  }
  return errors
}
export {
  validateFormData
}

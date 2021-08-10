import format from 'string-format'
import { customAlphabet } from 'nanoid/non-secure'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10)
const endpoints = {
  saveFormDataName: 'https://dev-codeapp.novopay.in/novocode/updateActionForm',
  getFormDataByName:
    'https://dev-codeapp.novopay.in/novocode/getActionFormByName?formName={formName}&formDocId={_id}'
}

const updateLoanApplication = async (customerId, { formData, formName }) => {
  try {
    const response = await fetch(endpoints.saveFormDataById, {
      method: 'POST',
      body: {
        formName,
        values: formData,
        userId: customerId
      }
    })
    const data = await response.json()
    if (data.status.toLowerCase() === 'success') {
      if (data.actionForm) {
        return {
          id: data.actionForm.values.id,
          data: {
            values: data.actionForm.formData,
            errors: data.actionForm.errors || {},
            formName
          }
        }
      } else {
        // dummy
        return {
          id: formData._id || nanoid(),
          data: {
            formData,
            formName,
            errors: {}
          }
        }
      }
    }
  } catch (err) {
    console.log(err.message)
    return {}
  }
}
const getLoanApplication = async (id, { formName }) => {
  try {
    const response = await fetch(
      format(endpoints.getFormDataByName, { _id: id, formName })
    )
    const data = await response.json()
    if (data.status.toLowerCase() === 'success') {
      return {
        id,
        data: {
          formData: data.formAction.values,
          formName
        }
      }
    }
  } catch (err) {
    console.log(err.message)
    return {}
  }
}

export default {
  getLoanApplication,
  updateLoanApplication
}

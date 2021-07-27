import { createContext, useContext } from 'react'

export const defaultProps = {
  theme: {
    primaryColor: '#2196F3',
    highlightColor: '#2196F3',
    borderColor: '#979B9E',
    textColor: '#333333',
    placeholderTextColor: '#999999',
    errorColor: '#a94442'
  },
  requiredTitle: '*',
  arrayAddTitle: 'Add'
}

export const FormContext = createContext(defaultProps)
export const useFormContext = () => useContext(FormContext)

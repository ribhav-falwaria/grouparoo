import TextWidget from './TextWidget'
import React from 'react'

const EmailWidget = props => (
  <TextWidget {...props} textContentType='emailAddress' />
)

export default EmailWidget

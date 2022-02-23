import React, { forwardRef } from 'react'
import Form from './Form'

function withTheme (themeProps) {
  //console.log("widgets====>",widgets);
  return forwardRef(({ fields, widgets, ...directProps }, ref) => {
    fields = { ...themeProps.fields, ...fields }
    widgets = { ...themeProps.widgets, ...widgets }
    return (
      <Form
        {...themeProps}
        {...directProps}
        fields={fields}
        widgets={widgets}
        ref={ref}
      />
    )
  })
}
export default withTheme

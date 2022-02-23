import React, { useState } from 'react'
import { Button } from '@ui-kitten/components'

const ButtonWithDisable = ({ onPress, isDisabled, ...rest }) => {
  const [disabled, setDisabled] = useState(isDisabled || false)
  const onThisPress = () => {
    setDisabled()
    onPress()
  }
  return (
    <Button {...rest} onPress={onThisPress} disabled={disabled}>
      {rest.children}
    </Button>
  )
}

export default ButtonWithDisable

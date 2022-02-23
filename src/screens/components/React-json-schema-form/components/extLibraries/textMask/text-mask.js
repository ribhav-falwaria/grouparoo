import React, { createRef } from 'react'
import { Text } from '@ui-kitten/components'
import BaseTextComponent from './base-text-component'

export default class TextMask extends BaseTextComponent {
  constructor (props) {
    super(props)
    this.myRef = createRef()
  }

  getElement () {
    return this.myRef
  }

  render () {
    return (
      <Text ref={this.myRef} {...this.props}>
        {this.getDisplayValueFor(this.props.value)}
      </Text>
    )
  }
}

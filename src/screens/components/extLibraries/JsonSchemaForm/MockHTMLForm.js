import React, { Component } from 'react'
import { View } from 'react-native'

class Event {
  preventDefault () {}
}

global.Event = global.Event || Event
global.CustomEvent = global.CustomEvent || Event

export class MockHTMLForm extends Component {
  render () {
    return <View>{this.props.children}</View>
  }

  dispatchEvent (e) {
    e.persist = () => null
    this.props.onSubmit(e)
  }
}

import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'

class Event {
  preventDefault () {}
}

global.Event = global.Event || Event
global.CustomEvent = global.CustomEvent || Event

export class MockHTMLForm extends Component {
  render () {
    return <View style={styles.formContainer}>{this.props.children}</View>
  }

  dispatchEvent (e) {
    e.persist = () => null
    this.props.onSubmit(e)
  }
}
const styles = StyleSheet.create({
  formContainer: {
    justifyContent: 'flex-start'
  }
})

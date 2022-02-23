import React from 'react'
import { View } from 'react-native'
import {
  StyleService,
  useStyleSheet,
  Button,
  Modal,
  Card,
  Text,
  ButtonGroup
} from '@ui-kitten/components'

const SimpleModal = ({
  visible,
  onCancel,
  onOk,
  title,
  description,
  Icon,
  cancelText,
  okText

}) => {
  const styles = useStyleSheet(themedStyles)
  return (
    <Modal visible={visible} backdropStyle={styles.backdrop}>
      <Card disabled>
        <View style={styles.headingContainer}>
          <Text category='h6'>{title}</Text>
        </View>
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon />
          </View>
        )}
        <View style={styles.descriptionContainer}>
          <Text category='p2'>{description}</Text>
        </View>
        <ButtonGroup appearance='ghost' size='small' status='info'>
          <Button onPress={onCancel}>
            {cancelText}
          </Button>
          <Button onPress={onOk}>
            {okText}
          </Button>
        </ButtonGroup>

      </Card>
    </Modal>
  )
}
const themedStyles = StyleService.create({
  headingContainer: {
    marginVertical: 8
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    marginVertical: 4
  },
  descriptionContainer: {
    marginVertical: 8
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
})

export default SimpleModal

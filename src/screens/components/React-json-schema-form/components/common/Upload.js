import React, { useContext } from 'react'
import DocumentPicker from 'react-native-document-picker'
import { StyleSheet, View } from 'react-native'
import { useFormContext } from '../extLibraries/JsonSchemaForm'
import { LocalizationContext } from '../../../components/Translation'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { Button } from '@ui-kitten/components'
import IconUtil from './IconUtil'

const Upload = ({
  onFileChange,
  isFromCamera = true,
  isFromLibrary = true,
  isFromFiles = true
}) => {
  const { theme } = useFormContext()
  const { translations } = useContext(LocalizationContext)
  const filePickerHandler = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles]
      })
      onFileChange(res)
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        throw err
      }
    }
  }
  const openCameraHandler = () => {
    launchCamera(
      {
        mediaType: 'photo'
      },
      (res) => {
        if (res.assets) {
          onFileChange(res.assets)
        }
        console.log('Camera:', res)
      }
    )
  }
  const openLibraryHandler = () => {
    launchImageLibrary(
      {
        mediaType: 'photo'
      },
      (res) => {
        if (res.assets) {
          onFileChange(res.assets)
        }
        console.log('Library:', res)
      }
    )
  }

  return (
    <View style={styles.uploadContainer}>
      {isFromCamera && (
        <View style={{ width: '80%' }}>
          <Button
            style={{ ...styles.button, backgroundColor: theme.highlightColor }}
            onPress={openCameraHandler}
            accessoryLeft={IconUtil.CameraIcon}
          >
            {translations['file.upload.camera']}
          </Button>
        </View>
      )}
      {isFromLibrary && (
        <View style={{ width: '80%' }}>
          <Button
            style={{ ...styles.button, backgroundColor: theme.highlightColor }}
            accessoryLeft={IconUtil.AttachmentIcon}
            onPress={openLibraryHandler}
          >
            {translations['file.upload.gallery']}
          </Button>
        </View>
      )}
      {isFromFiles && (
        <View style={{ width: '80%' }}>
          <Button
            style={{ ...styles.button, backgroundColor: theme.highlightColor }}
            onPress={filePickerHandler}
            accessoryLeft={IconUtil.AttachmentIcon}
          >
            {translations['file.upload.files']}
          </Button>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  uploadContainer: {
    flex: 1,
    marginTop: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  button: {
    marginVertical: 4,
    color: 'white'
  }
})
export default Upload

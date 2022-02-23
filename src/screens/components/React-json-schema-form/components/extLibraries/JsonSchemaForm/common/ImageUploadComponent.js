import { Card, Text, useStyleSheet, StyleService, Spinner } from '@ui-kitten/components'
import React, { useContext, useRef } from 'react'
import isUndefined from 'lodash.isundefined'
import { View, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ImagePicker from 'react-native-image-crop-picker'
import { LocalizationContext } from '../../../../translation/Translation'
import BottomSheet from './BottomSheet'
import {
  heightPercentageToDP
} from 'react-native-responsive-screen'
import IconUtil from '../../../common/IconUtil'

const ImageUploadComponent = ({
  isUploadDone,
  onFileChange,
  useFrontCamera,
  loading,
  hasError,
  uris,
  selectText,
  multiple,
  maxFiles = 1,
  secondFileText,
  removeFile
}) => {
  const refRBSheet = useRef()
  const themeStyle = useStyleSheet(styles)
  const { translations } = useContext(LocalizationContext)
  const onDeleteUpload = (uri) => {
    removeFile(uri)
  }
  const onOpenCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      freeStyleCropEnabled: true,
      useFrontCamera: useFrontCamera || false
    }).then((image) => {
      onFileChange({
        uri: image.path,
        type: image.mime
      })
      refRBSheet.current.close()
    })
  }
  const onSelectFile = () => {
    refRBSheet.current.close()
    ImagePicker.openPicker({
      cropping: true,
      freeStyleCropEnabled: true
    }).then((image) => {
      onFileChange({
        uri: image.path,
        type: image.mime
      })
    })
  }
  return (
    <>
      {(isUndefined(uris) || uris.length === 0 || !isUploadDone) && (
        <TouchableOpacity onPress={() => refRBSheet.current.open()}>
          <Card style={themeStyle.cardContainer} status={hasError && 'danger'}>
            {!loading && (
              <Text category='s1'>
                {selectText}
              </Text>
            )}
            {loading && <Spinner />}
          </Card>
        </TouchableOpacity>
      )}
      {!isUndefined(uris) && uris.length > 0 && (
        <View>
          <Card style={themeStyle.cardContainerV1} status={hasError && 'danger'}>
            {uris.length > 0 && uris.map((uri, ix) => (
              <DisplayImageCard
                key={`image-upload-${ix}`}
                onDeleteUpload={onDeleteUpload}
                loading
                uri={uri}
              />
            ))}
            {multiple && uris.length <= maxFiles && (
              <TouchableOpacity onPress={() => refRBSheet.current.open()}>
                <View style={themeStyle.fileCardContainer}>
                  <Text category='s1' status='info'>
                    {!secondFileText && translations['upload.choose.addAnother']}
                    {secondFileText && translations[secondFileText]}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </Card>

        </View>
      )}
      <BottomSheet
        onOpenCamera={onOpenCamera}
        onSelectFile={onSelectFile}
        refRBSheet={refRBSheet}
        height={200}
      />
    </>
  )
}

const DisplayImageCard = ({
  uri,
  onDeleteUpload
}) => {
  const themeStyle = useStyleSheet(styles)
  return (
    <View style={themeStyle.imageConatiner}>
      <Image style={themeStyle.image} source={{ uri: uri }} />
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity onPress={() => onDeleteUpload(uri)}>
          <IconUtil.CancelButtonIcon />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleService.create({
  closeButtonContainer: {
    position: 'absolute',
    right: -10,
    top: -10,
    backgroundColor: '#fff',
    borderRadius: 10
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 8
  },
  cardContainer: {
    flex: 1,
    height: heightPercentageToDP('25%'),
    backgroundColor: 'background-basic-color-2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardContainerV1: {
    flex: 1,
    minHeight: heightPercentageToDP('25%'),
    height: '100%',
    backgroundColor: 'background-basic-color-2'
  },
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  imageConatiner: {
    flex: 1,
    marginLeft: 0,
    justifyContent: 'space-between'
  },
  image: {
    height: 200,
    borderRadius: 10
  },
  text: {
    margin: 4
  }
})

export default ImageUploadComponent

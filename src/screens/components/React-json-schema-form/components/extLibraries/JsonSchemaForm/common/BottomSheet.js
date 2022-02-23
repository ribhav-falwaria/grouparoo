import React from 'react'
import { StyleSheet } from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import UploadOptionBottom from './UploadOptionBottom'
const BottomSheet = ({
  onOpenCamera,
  onSelectFile,
  refRBSheet,
  height = 250
}) => {
  const onCancel = () => {
    refRBSheet.current.close()
  }
  return (
    <>
      <RBSheet
        height={height}
        ref={refRBSheet}
        closeOnDragDown
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: 'gray',
            opacity: 0.9
          },
          container: {
          },
          draggableIcon: {
            backgroundColor: 'grey'
          }
        }}
      >
        <UploadOptionBottom
          onOpoenCamera={onOpenCamera}
          onSelectFile={onSelectFile}
          onCancel={onCancel}
        />
      </RBSheet>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-end'
  },
  button: {
    margin: 5
  }
})
export default BottomSheet

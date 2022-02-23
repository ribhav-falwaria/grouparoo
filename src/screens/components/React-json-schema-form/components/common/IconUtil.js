import React from 'react'
import { Icon, useTheme } from '@ui-kitten/components'
const buildEvaIcon = (name, fill, width, height) => {
  const theme = useTheme()
  const fillColor = fill ? theme[fill] : theme['color-warning-300']
  return (
    <Icon name={name} style={{ marginRight: 4 }} fill={fillColor} width={width || 20} height={height || 20} />
  )
}
const IconUtil = {
  UploadIcon: (props) => {
    return buildEvaIcon('upload-outline', 'color-primary-default')
  },
  SyncIcon: (props) => {
    return buildEvaIcon('sync', 'color-info-default')
  },
  AttachmentIcon: (props) => {
    return buildEvaIcon('attach-2-outline')
  },
  CameraIcon: (props) => {
    return buildEvaIcon('camera-outline')
  },
  CancelIcon: (props) => {
    return buildEvaIcon('close', 'color-danger-default')
  },
  CancelButtonIcon: (props) => {
    return buildEvaIcon('close-circle', 'color-danger-default', 24, 24)
  },
  CloseCircle: (props) => {
    return buildEvaIcon('alert-circle-outline')
  },
  NextIcon: (props) => {
    return buildEvaIcon('chevron-right-outline', 'color-basic-100', 24, 24)
  },
  BackIcon: (props) => {
    return buildEvaIcon('chevron-left-outline', 'text-basic-color', 24, 24)
  },
  ErrorIcon: (props) => {
    return buildEvaIcon('close-outline', 'color-danger-default', 24, 24)
  },
  CheckIcon: (props) => {
    return buildEvaIcon('checkmark-outline', 'color-success-default', 24, 24)
  }
}

export default IconUtil

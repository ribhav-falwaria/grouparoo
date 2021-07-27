import { Linking, Platform } from 'react-native'
import SafariView from 'react-native-safari-view'

export class WebBrowserService {
  static openBrowserAsync (url) {
    if (Platform.OS === 'ios') {
      return WebBrowserService.openInAppUrl(url).catch(() =>
        WebBrowserService.openUrl(url)
      )
    } else {
      return WebBrowserService.openUrl(url)
    }
  }

  static openInAppUrl (url) {
    return SafariView.isAvailable().then(() => SafariView.show({ url }))
  }

  static openUrl (url) {
    return Linking.openURL(url)
  }
}

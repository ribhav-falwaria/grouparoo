import React, { useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Avatar,
  Divider,
  Drawer,
  DrawerItem,
  Layout,
  Text,
  IndexPath
} from '@ui-kitten/components'
import SafeAreaLayout from '../components/SafeAreaLayout.component'
import { AppInfoService } from '../services/app-info.service'
import { LocalizationContext } from '../components/Translation'

const HomeDrawer = ({ navigation, navigationData, state }) => {
  const { translations } = useContext(LocalizationContext)
  navigationData.forEach(n => {
    n.handleOnPress = () => {
      navigation.toggleDrawer()
      navigation.navigate(n.name, {})
    }
  })
  const renderHeader = () => (
    <SafeAreaLayout insets='top' level='2'>
      <Layout style={styles.header} level='2'>
        <View style={styles.profileContainer}>
          <Avatar
            size='giant'
            source={require('../assets/images/image-app-icon.png')}
          />
          <Text style={styles.profileName} category='h6'>
            Novopay Money
          </Text>
        </View>
      </Layout>
    </SafeAreaLayout>
  )

  const renderFooter = () => (
    <SafeAreaLayout insets='bottom'>
      <>
        <Divider />
        <View style={styles.footer}>
          <Text>{`Version ${AppInfoService.getVersion()}`}</Text>
        </View>
      </>
    </SafeAreaLayout>
  )
  return (
    <Drawer
      header={renderHeader}
      footer={renderFooter}
      selectedIndex={new IndexPath(state.index)}
      onSelect={index => navigation.navigate(state.routeNames[index.row], {})}
    >
      {navigationData.map((el, index) => (
        <DrawerItem
          key={index}
          title={translations[el.drawerTitle]}
          onPress={el.handleOnPress}
          accessoryLeft={el.Icon}
        />
      ))}
    </Drawer>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  header: {
    height: 128,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 16
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileName: {
    marginHorizontal: 16
  }
})

export default HomeDrawer

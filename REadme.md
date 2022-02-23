watchman watch-del-all &&
rm -rf $TMPDIR/react-native-packager-cache-* &&
rm -rf $TMPDIR/metro-bundler-cache-* && 
rm -rf node_modules/ && 
yarn cache clean &&
yarn install && 
yarn start --reset-cache
adb connect 192.168.10.1:5555
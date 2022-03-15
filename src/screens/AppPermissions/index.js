import React, { useContext, useState, useEffect } from "react";
import { View, BackHandler } from "react-native";
import { useStore, useSelector, useDispatch } from "react-redux";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";
import { useRequest } from "ahooks";
import {
  StyleService,
  useStyleSheet,
  Button,
  List,
  Spinner,
  TopNavigation,
  TopNavigationAction,
  Icon,
} from "@ui-kitten/components";
import SimpleModal from "../components/SimpleModal";
import ProvidePermissions from "./ProvidePermissions";
import { AllIcons, WarningIcon } from "../components/ThemedIcons";
import { processPermissions } from "../../services/permissions";
import SimpleCard from "../components/SimpleCard";
import { LocalizationContext } from "../../components/Translation";
import styleConstants from "../styleConstants";
import ScreenTitle from "../components/ScreenTitle";
const updatePermissions = async (dispatch, permissionStatuses) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " updatePermissions method starts here",
      { dispatch, permissionStatuses },
      "updatePermissions()",
      "AppPermissions.js"
    )
  );
  await dispatch.permissionsHelp.updatePermissionStatuses({
    permissionStatuses,
    isPermissionsRequested: true,
  });
};

const AppPermissions = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " AppPermissions method starts here",
      { props },
      "AppPermissions()",
      "AppPermissions.js"
    )
  );
  const { navigation, route } = props;
  const [visible, setVisible] = React.useState(false);

  const { translations } = useContext(LocalizationContext);
  const title = route.params?.title || translations["form.appPermissions"];

  const [loading, setLoading] = useState(false);
  const store = useStore();
  const dispatch = useDispatch();
  const styles = useStyleSheet(themedStyles);
  const state = useSelector((state) => state);
  const updatePermissionRequest = useRequest(updatePermissions, {
    manual: true,
  });
  const selection = store.select((models) => ({
    isPermissionsRequested: models.permissionsHelp.getIsPermissionsRequested,
    isAllPermissionsValid: models.permissionsHelp.allPermissionsValid,
    helpSteps: models.permissionsHelp.getHelpSteps,
    helpTitle: models.permissionsHelp.getHelpTitle,
    rationale: models.permissionsHelp.getPermissionsRationale,
  }));
  const {
    helpSteps,
    helpTitle,
    rationale,
    isPermissionsRequested,
    isAllPermissionsValid,
  } = selection(state);
  const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );
  const navigateBack = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        " navigateBack method starts here",
        undefined,
        "navigateBack()",
        "AppPermissions.js"
      )
    );
    setVisible(true);
    // props.navigation.goBack()
  };
  const exitApp = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        " exitApp method starts here",
        undefined,
        "exitApp()",
        "AppPermissions.js"
      )
    );
    BackHandler.exitApp();
  };
  const onContinuePress = async () => {
    crashlytics().log(
      ErrorUtil.createLog(
        " onContinuePress method starts here",
        undefined,
        "onContinuePress()",
        "AppPermissions.js"
      )
    );
    setLoading(true);
    const permissionResults = await processPermissions(rationale, translations);
    updatePermissionRequest.run(dispatch, permissionResults);
  };
  // useEffect(() => {
  //   if (isPermissionsRequested && isAllPermissionsValid) {
  //     // Execute after all the rendering is done.
  //     navigation.navigate('ApplicationForm')
  //   }
  // })
  if (isPermissionsRequested && !isAllPermissionsValid) {
    return <ProvidePermissions />;
  }
  // If permissions are requested but not valid
  const loadingIndicator = (props) => {
    crashlytics().log(
      ErrorUtil.createLog(
        " loadingIndicator method starts here",
        undefined,
        "loadingIndicator()",
        "AppPermissions.js"
      )
    );
    if (!loading) {
      return null;
    }
    return (
      <View style={[props.style, styles.indicator]}>
        <Spinner size="small" status="basic" />
      </View>
    );
  };
  const renderItem = (step) => {
    crashlytics().log(
      ErrorUtil.createLog(
        " renderItem method starts here",
        { step },
        "renderItem()",
        "AppPermissions.js"
      )
    );
    return (
      <SimpleCard
        heading={translations[step.item.title]}
        content={translations[step.item.content]}
        Icon={AllIcons[step.item.icon]}
      />
    );
  };
  const renderHeader = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        " renderHeader method starts here",
        undefined,
        "renderHeader()",
        "AppPermissions.js"
      )
    );
    return (
      <ScreenTitle
        title={title}
        description={translations[helpTitle.description]}
      />
    );
  };
  const renderFooter = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        " renderFooter method starts here",
        undefined,
        "renderFooter()",
        "AppPermissions.js"
      )
    );
    return (
      <View>
        <Button
          status="primary"
          style={styles.registerButton}
          onPress={() => onContinuePress()}
          accessoryRight={loadingIndicator}
        >
          {translations["permissions.continue"].toUpperCase()}
        </Button>
      </View>
    );
  };
  return (
    <>
      <TopNavigation
        style={styles.topNavigationStyle}
        alignment="center"
        accessoryLeft={BackAction}
      />

      <View style={styles.container}>
        <List
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          data={helpSteps}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListFooterComponentStyle={styles.footer}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <SimpleModal
        visible={visible}
        okText={translations["modal.ok"]}
        cancelText={translations["modal.cancel"]}
        onCancel={() => setVisible(false)}
        onOk={exitApp}
        title={translations["permissions.exitConfirmation.title"]}
        description={translations["permissions.exitConfirmation.description"]}
        Icon={WarningIcon}
      />
    </>
  );
};
const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
  heading: {
    marginBottom: 16,
  },
  topNavigationStyle: {
    backgroundColor: "background-basic-color-1",
  },
  contentContainer: {
    // flex: 1,
    backgroundColor: "background-basic-color-1",
  },
  permissionsList: {
    paddingVertical: 16,
  },
  content: {
    ...styleConstants.content,
  },
  bottomButtonContainer: {
    paddingVertical: 8,
  },
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: "flex-end",
    marginBottom: 16,
  },
});

export default AppPermissions;

import React from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { TouchableOpacity } from "react-native-gesture-handler";
import Clock from "../../assets/images/Clock.svg";
import Tick from "../../assets/images/Tick.svg";
import Success from "../../assets/images/Success.svg";

import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";
const window = Dimensions.get("window");
const slides = [
  {
    key: 1,
    title: "Welcome to LendR",
    text: "Smart Loans for \nSmart Businesses",
  },
  {
    key: 2,
    title: "Apply for Loans \nin under 5 Minutes",
    text: "We're designed with you in mind, \nso we'll just need the basics about \nyour business to make a decision.",
    image: () => <Clock />,
  },
  {
    key: 3,
    title: "Get Instant \nLoan Approvals",
    text: "We give you an instant offer, \nregardless of whether you need a \ncash injection today or long-term credit.",
    image: () => <Tick />,
  },
  {
    key: 4,
    title: "Loan Disbursed \nwithin 24 Hours",
    text: "When your application is approved, \nwe pay out right away.",
    image: () => <Success />,
  },
];

const AppIntro = ({ navigation }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " AppIntro method starts here",
      { navigation },
      "AppIntro()",
      "AppIntro.js"
    )
  );
  const _renderItem = ({ item }) => {
    crashlytics().log(
      ErrorUtil.createLog(
        " _renderItem method starts here",
        { item },
        "_renderItem()",
        "AppIntro.js"
      )
    );
    return (
      <>
        {item.key === 1 && (
          <View style={styles.container}>
            <View style={styles.background}>
              <Image
                style={styles.icon}
                source={require("../../assets/images/Logo-NP-Icon.png")}
              />
            </View>
          </View>
        )}
        {(item.key === 2 || item.key === 3 || item.key === 4) && (
          <View style={{ flex: 1, alignItems: "center", marginTop: 80 }}>
            {item.image()}
          </View>
        )}
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.bottomButton} onPress={_onDone}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const _onDone = () => {
    //  Need to fix it later
    navigation.navigate("SignIn");
  };

  return (
    <AppIntroSlider
      showDoneButton={false}
      showNextButton={false}
      showSkipButton={false}
      activeDotStyle={{
        width: 8,
        height: 8,
        marginLeft: 16,
        backgroundColor: "#3334a2",
        marginBottom: 120,
      }}
      dotStyle={{
        width: 8,
        height: 8,
        marginLeft: 16,
        backgroundColor: "#d8d8d8",
        marginBottom: 120,
      }}
      renderItem={_renderItem}
      data={slides}
      onDone={_onDone}
    />
  );
};

export default AppIntro;

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 24,
    color: "#3334a2",
    fontWeight: "bold",
  },
  image: {
    marginTop: 44,
  },
  text: {
    paddingTop: 32,
    textAlign: "center",
    fontSize: 16,
    color: "#3334a2",
  },
  bottomButton: {
    backgroundColor: "#3334a2",
    borderRadius: 12,
    alignSelf: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width - 25,
    height: 54,
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 0.8,
    alignSelf: "center",
    width: window.width,
    overflow: "hidden",
    height: window.width,
    marginBottom: 56,
  },
  background: {
    borderRadius: window.width,
    width: window.width * 2,
    height: window.width * 2,
    marginLeft: -(window.width / 2),
    position: "absolute",
    bottom: 0,
    overflow: "hidden",
    backgroundColor: "#3334a2",
  },
  icon: {
    height: 100,
    width: 100,
    position: "absolute",
    bottom: 48,
    alignSelf: "center",
    alignItems: "center",
  },
});

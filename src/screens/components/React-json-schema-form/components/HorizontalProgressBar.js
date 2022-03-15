import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../Errors/ErrorUtil";

// setInterval custom hook by Dan Abramov
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const HorizontalProgressBar = ({ progressNum, auto }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "HorizontalProgressBar method starts here",
      { progressNum, auto },
      "HorizontalProgressBar()",
      "HorizontalProgressBar.js"
    )
  );
  const animation = useRef(new Animated.Value(0));
  const [progress, setProgress] = useState(progressNum || 0);
  if (auto) {
    useInterval(() => {
      // update progress until 100
      if (progress < 100) {
        setProgress(progress + 5);
      }
    }, 500);
  }

  useEffect(() => {
    Animated.timing(animation.current, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "#8BED4F", width },
          ]}
        />
      </View>
    </View>
  );
};

export default HorizontalProgressBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ecf0f1",
    marginHorizontal: -36,
  },
  progressBar: {
    flexDirection: "row",
    height: 8,
    width: "100%",
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 5,
  },
});

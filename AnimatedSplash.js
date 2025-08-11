import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing, Text } from "react-native";

export default function AnimatedSplash({ onAnimationEnd }) {
  const fadeAnim = useRef(new Animated.Value(0)).current; // logo fade
  const translateY = useRef(new Animated.Value(30)).current; // logo slide up
  const textFadeAnim = useRef(new Animated.Value(0)).current; // text fade

  useEffect(() => {
    Animated.sequence([
      // Step 1: Logo fade + move up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]),
      // Step 2: Show welcome text
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.delay(700), // Hold the final state for a moment
      // Step 3: Fade everything out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textFadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onAnimationEnd && onAnimationEnd();
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("./assets/Splash.png")}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.text, { opacity: textFadeAnim }]}>
        Welcome to Nirnayan
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Green background
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  text: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "600",
    color: "#04c704",
  },
});

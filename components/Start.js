import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import image from "../assets/Background.png";

export default function Start(props) {
  const [name, setName] = useState(" ");
  const [bgColor, setColor] = useState(" ");

  // backgroud colors to choose
  const colors = {
    black: "#090C08",
    purple: "#474056",
    gray: "#8A95A5",
    green: "#B9C6AE",
  };

  return (
    // Main view
    <View
      style={{
        flex: 1,
      }}
    >
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.titleText}>App title</Text>

        {/* Secondary view */}
        <View style={styles.view}>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              onChangeText={(name) => setName(name)}
              value={name}
              placeholder="Your name..."
            ></TextInput>
          </View>

          {/* Allow the user to choose between different background colors */}
          <Text
            style={styles.paragraphText}
            accessibilityHint="Lets you choose among four options for your background color."
          >
            Choose background color
          </Text>
          <View style={styles.colorPalette}>
            <TouchableOpacity
              style={styles.color1}
              onPress={() => setColor(colors.black)}
              accessibilityLabel="black"
            ></TouchableOpacity>
            <TouchableOpacity
              style={[styles.color1, styles.color2]}
              onPress={() => setColor(colors.purple)}
              accessibilityLabel="purple"
            ></TouchableOpacity>
            <TouchableOpacity
              style={[styles.color1, styles.color3]}
              onPress={() => setColor(colors.gray)}
              accessibilityLabel="gray"
            ></TouchableOpacity>
            <TouchableOpacity
              style={[styles.color1, styles.color4]}
              onPress={() => setColor(colors.green)}
              accessibilityLabel="green"
            ></TouchableOpacity>
          </View>

          {/* This button redirects the user to the chat page */}
          <Pressable
            style={styles.button}
            onPress={() =>
              props.navigation.navigate("Chat", {
                name,
                bgColor,
              })
            }
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </Pressable>
        </View>
      </ImageBackground>
      {/* Ensures that the input field won’t be hidden beneath the keyboard */}
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  view: {
    width: "88%",
    height: "44%",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#FFFFFF",
  },
  inputBox: {
    borderWidth: 2,
    borderRadius: 1,
    borderColor: "grey",
    width: "88%",
    height: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  input: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 0.5,
  },
  paragraphText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 1,
    alignItems: "flex-start",
  },
  colorPalette: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
  },
  color1: {
    backgroundColor: "#090C08",
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  color2: {
    backgroundColor: "#474056",
  },
  color3: {
    backgroundColor: "#8A95A5",
  },
  color4: {
    backgroundColor: "#B9C6AE",
  },
  button: {
    width: "88%",
    height: 70,
    borderRadius: 8,
    backgroundColor: "#757083",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
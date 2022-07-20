import React, { useState } from "react";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDRpnQNgXcRpr1TDBFhmA2eP-2D7ANVJ_o",
  authDomain: "web-app-5e13f.firebaseapp.com",
  projectId: "web-app-5e13f",
  storageBucket: "web-app-5e13f.appspot.com",
  messagingSenderId: "1059875359492",
  appId: "1:1059875359492:web:993c18589fb6ef151b9e51",
  measurementId: "G-S526CTD1E2"
};


// import react native gesture handler
import "react-native-gesture-handler";

// import react Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Start from "../components/Start";
import Chat from "../components/Chat";

// Create the navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Screen1">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
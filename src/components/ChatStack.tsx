import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "../screens/Home";
import { FirstTime } from "../screens/FirstTime";
import { Chat } from "../screens/Chat";
import { ReadQR } from "../screens/ReadQR";
import { ShowQR } from "../screens/ShowQR";

const BaseStack = createStackNavigator();

const options = {
  headerStyle: {
    backgroundColor: "indigo",
  },
  headerTitleStyle: {
    fontWeight: "bold",
    color: "white",
  },
  headerTintColor: '#fff'
};

export function ChatStack() {
  // TODO: Add chat to the chatstack navigator
  return (
    <BaseStack.Navigator>
      <BaseStack.Screen name="Home" options={options} component={Home} />
      <BaseStack.Screen name="Chat" options={options} component={Chat} />
      <BaseStack.Screen name="ReadQR" options={options} component={ReadQR} />
      <BaseStack.Screen name="ShowQR" options={options} component={ShowQR} />
    </BaseStack.Navigator>
  );
}

export function FirstJoinStack() {
  // TODO: Add chat to the chatstack navigator
  return (
    <BaseStack.Navigator>
      <BaseStack.Screen name="Welcome!" component={FirstTime} />
    </BaseStack.Navigator>
  );
}

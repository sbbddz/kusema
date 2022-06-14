import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { QRChat } from "../models/QRChat";

export type Props = {
  chat: QRChat;
};

export const ChatComponent: React.FC<Props> = ({ chat }) => {
  const navigator = useNavigation();

  const handlePress = () => {
    navigator.navigate("Chat", chat);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.chatContainer}>
      <Text style={styles.chatText}>💬 {chat.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: 10,
    padding: 10,
    backgroundColor: "#B695C0",
    borderRadius: 15,
  },
  chatText: {
    fontWeight: "bold",
  },
});

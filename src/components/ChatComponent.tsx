import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { QRChat } from "../models/QRChat";
import { Database } from "../services/database";

export type Props = {
  chat: QRChat;
  chats: QRChat[];
  setChats: (chats: QRChat[]) => void;
};

export const ChatComponent: React.FC<Props> = ({ chat, chats, setChats }) => {
  const navigator = useNavigation();
  const db = Database.getInstance();

  const handlePress = () => {
    navigator.navigate("Chat", chat);
  };

  const handleLongPress = () => {
    Alert.alert("Delete chat", "Are you sure?", [
      {
        text: "Cancel",
        onPress: () => console.log("cancel"),
        style: "cancel",
      },
      {
        text: "Ok",
        onPress: () => {
          db.removeChat(chat.guidChat).then((x) => {
            setChats(chats.filter((y) => y.guidChat !== chat.guidChat));
          });
        },
      },
    ]);
  };

  return (
    <>
      <TouchableOpacity
        onLongPress={handleLongPress}
        onPress={handlePress}
        style={styles.chatContainer}
      >
        <Text style={styles.chatText}>💬 {chat.name}</Text>
      </TouchableOpacity>
    </>
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
  modalView: {
    marginTop: 200,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

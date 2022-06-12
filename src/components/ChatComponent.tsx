import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Contact } from "../models/Contact";

export type Props = {
  contact: Contact;
};

export const ChatComponent: React.FC<Props> = ({ contact }) => {
  const navigator = useNavigation();

  const handlePress = () => {
    navigator.navigate("Chat", contact);
  };

  return (
    <View style={styles.chatContainer}>
      <Text onPress={handlePress}>Chat con: {contact.displayName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 15
  },
});

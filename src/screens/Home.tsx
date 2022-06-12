import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChatComponent } from "../components/ChatComponent";
import { useContacts } from "../hooks/useContacts";
import { DatabaseContext } from "../services/database";
import { Database } from "../services/database";

export function Home() {
  const [contactsChats, setContactsChat] = useContacts();
  const { deleteDatabase } = useContext(DatabaseContext);
  const db = Database.getInstance();

  useEffect(() => {
    db.getContactChats().then(
      (res) => setContactsChat(res),
      (err) => Alert.alert("Can't load chats in database. DB is corrupted?")
    );
  }, []);

  // TODO: Pass params to chat (id to chat with)
  return (
    <View style={styles.container}>
      <ScrollView>
        {contactsChats &&
          contactsChats.map((x) => {
            return <ChatComponent key={x.id} contact={x} />;
          })}
      </ScrollView>
      <TouchableOpacity style={styles.addFixed}>
        <Text>➕</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteDatabase()}
        style={styles.shareFixed}
      >
        <Text>👥</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "teal",
    marginTop: 15,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 35,
  },
  addFixed: {
    position: "absolute",
    right: 0,
    bottom: 100,
    marginRight: 15,
    backgroundColor: "#cdcdcd",
    padding: 12,
    borderRadius: 100,
  },
  shareFixed: {
    position: "absolute",
    right: 0,
    bottom: 50,
    marginRight: 15,
    backgroundColor: "#cdcdcd",
    padding: 12,
    borderRadius: 100,
  },
});

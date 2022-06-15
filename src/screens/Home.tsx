import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect } from "react";
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
  const isFocused = useIsFocused();
  const { deleteDatabase } = useContext(DatabaseContext);
  const navigator = useNavigation();
  const db = Database.getInstance();

  useEffect(() => {
    db.getContactChats().then(
      (res) => {
        console.log(res);
        setContactsChat(res);
      },
      (err) => Alert.alert("Can't load chats in database. DB is corrupted?")
    );
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <ScrollView>
        {contactsChats &&
          contactsChats.map((x) => {
            return <ChatComponent key={x.guidChat} chat={x} />;
          })}
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigator.navigate("ReadQR")}
        style={styles.addFixed}
      >
        <Text
          style={{
            padding: 15,
            fontSize: 50,
            color: "white",
            fontWeight: "bold",
          }}
        >
          +
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigator.navigate("ShowQR")}
        style={styles.shareFixed}
      >
        <Text
          style={{
            padding: 15,
            fontSize: 30,
            color: "white",
            fontWeight: "bold",
          }}
        >
          👤
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteDatabase()}
        style={styles.shareFixed2}
      >
        <Text>X</Text>
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
    backgroundColor: "indigo",
    borderRadius: 100,
  },
  shareFixed: {
    position: "absolute",
    right: 0,
    bottom: 10,
    marginRight: 15,
    backgroundColor: "indigo",
    borderRadius: 100,
  },
  shareFixed2: {
    position: "absolute",
    right: 0,
    bottom: 150,
    marginRight: 15,
    backgroundColor: "indigo",
    padding: 12,
    borderRadius: 100,
  },
});

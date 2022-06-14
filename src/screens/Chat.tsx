import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { firestoreDatabase } from "../services/firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { QRChat } from "../models/QRChat";
import { Database } from "../services/database";
import { User } from "../models/User";
import { Text } from "react-native";
import { encryptMessage, decryptMessage } from "../services/encryption";

type RootStackParamList = {
  chat: QRChat;
};

type Props = NativeStackScreenProps<RootStackParamList, "chat">;

export const Chat: React.FC = ({ route, navigation }: Props) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [user, setUser] = useState<User | undefined>(undefined);
  const db = Database.getInstance();

  useEffect(() => {
    db.getUser().then((u) => setUser(u));
  }, []);

  useLayoutEffect(() => {
    const docRef = doc(firestoreDatabase, "chats", route.params.guidChat);
    const colRef = collection(docRef, "messages");
    const unsubscribe = onSnapshot(
      query(colRef, orderBy("createdAt", "desc")),
      (querySnapshot) => {
        let messages: IMessage[] = [];
        querySnapshot.forEach((doc) => {
          let rawData = doc.data();
          messages.push({
            _id: doc.id,
            text: decryptMessage(
              rawData["text"],
              route.params.encryptionKey
            ).toString(),
            user: rawData["user"],
          } as IMessage);
        });

        setMessages(messages);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSend = useCallback((messages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    const docRef = doc(firestoreDatabase, "chats", route.params.guidChat);
    const colRef = collection(docRef, "messages");
    const encryptedText = encryptMessage(
      messages[0].text,
      route.params.encryptionKey
    ).ciphertext;

    addDoc(colRef, { ...messages[0], text: encryptedText });
  }, []);

  return (
    (user && (
      <GiftedChat messages={messages} onSend={handleSend} user={user} />
    )) || <Text>Loading...</Text>
  );
};

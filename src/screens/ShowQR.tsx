import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { QRChat } from "../models/QRChat";
import { Database } from "../services/database";
import uuid from "react-native-uuid";

export const ShowQR = () => {
  const db = Database.getInstance();
  const [qrChat, setQRChat] = useState<QRChat>();
  const [qrChatTitle, setQrChatTitle] = useState<string>("Conversation");

  useEffect(() => {
    const chat = generateQRChat();
    setQRChat(chat);

    // ESTO ES LO QUE DEBERIA DE FUNCIONAR POR FAVOR ARREGLALO
    return () => {
      if (qrChat === undefined) alert("Could not load chat into local storage");
      else db.addChat(qrChat).then((res) => console.log(res));
    };
  }, []);

  useEffect(() => {
    const chat = generateQRChat();
    setQRChat(chat);
  }, [qrChatTitle]);

  const generateQRChat = (): QRChat => {
    let chat = {
      guidChat: uuid.v4() as string,
      name: qrChatTitle,
      encryptionKey: uuid.v4() as string,
    };

    return chat;
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      <TextInput value={qrChatTitle} onChangeText={setQrChatTitle} />
      <Text
        style={{
          fontSize: 23,
          fontWeight: "bold",
          color: "indigo",
          textAlign: "center",
        }}
      >
        Share this with your friends and start a private conversation!
      </Text>
      {qrChat && <QRCode size={350} value={JSON.stringify(qrChat)} />}
    </View>
  );
};

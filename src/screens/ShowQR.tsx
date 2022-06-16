import React, { useEffect, useRef, useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { QRChat } from "../models/QRChat";
import { Database } from "../services/database";
import uuid from "react-native-uuid";

export const ShowQR = () => {
  const db = Database.getInstance();
  const componentWillUnmount = useRef(false);
  const [qrChat, setQRChat] = useState<QRChat>();
  const [qrChatTitle, setQrChatTitle] = useState<string>("");

  function useOnUnmount(callback: () => void) {
    const onUnmount = useRef<(() => void) | null>(null);
    onUnmount.current = callback;

    useEffect(() => {
      return () => onUnmount.current?.();
    }, []);
  }

  useOnUnmount(() => {
    if (!qrChat) return;
    db.addChat(qrChat).then((_) => Alert.alert("Chat added successfully!"));
  });

  useEffect(() => {
    setQrChatTitle("Conversation");
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

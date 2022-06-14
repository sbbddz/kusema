import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { QRChat } from "../models/QRChat";
import { Database } from "../services/database";
import uuid from "react-native-uuid";
import { User } from "../models/User";

export const ShowQR = () => {
  const db = Database.getInstance();
  const [qrChat, setQRChat] = useState<QRChat>();

  useEffect(() => {
    db.getUser().then(
      (x) => {
        setQRChat(generateQRChat(x));
      },
      (err) => console.log(err)
    );
  }, []);

  const generateQRChat = (user: User): QRChat => {
    let chat = {
      guidChat: uuid.v4() as string,
      name: user.name,
      encryptionKey: uuid.v4() as string,
    };

    db.addChat(chat).then((res) => console.log(res));
    return chat;
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {qrChat && <QRCode size={350} value={JSON.stringify(qrChat)} />}
    </View>
  );
};

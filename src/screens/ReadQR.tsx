import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Database } from "../services/database";
import { QRChat } from "../models/QRChat";

interface QRState {
  isScanned: boolean;
  data: undefined | string;
}

export const ReadQR = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState({ isScanned: false, data: undefined });
  const db = Database.getInstance();

  useLayoutEffect(() => {
    askPermissions();
  }, []);

  const askPermissions = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status == "granted");
      setScanned({ isScanned: false, data: undefined });
    })();
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned({ isScanned: true, data: data });
    let qrChat: QRChat = JSON.parse(data);

    db.addChat(qrChat).then(
      (x) => {
        alert("Chat added sucessfully!");
      },
      (err) => alert("Error occurred while adding chat to the database!")
    );
  };

  if (hasPermission && hasPermission && !scanned.isScanned) {
    return (
      <View style={{ flex: 1, justifyContent: "space-evenly", alignItems: "center" }}>
        <Text style={{ fontSize: 23, fontWeight: "bold", color: "indigo"}}>Scan a valid QR Chat code!</Text>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={{ width: 500, height: 500, borderRadius: "30%" }}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          padding: 100,
        }}
      >
        <Text>Loading...</Text>
      </View>
    </View>
  );
};

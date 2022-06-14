import React, { useContext, useState } from "react";
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Database, DB } from "../services/database";
import kusemaLogo from "../../assets/kusemalogo.png";
import { DatabaseContext } from "../services/database";

interface Props {
  setDb: (db: DB) => void;
}

export function FirstTime(props: Props) {
  const db = Database.getInstance();
  const { createDatabase } = useContext(DatabaseContext);
  const [displayName, setDisplayName] = useState<string>("");

  const handleClick = () => {
    db.initDatabase(displayName).then(
      (x) => {
        createDatabase(x);
      },
      (err) => {
        console.log(err);
        Alert.alert(
          "Un error ha ocurrido al generar la base de datos en el sistema!"
        );
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View>
          <Image source={kusemaLogo} height={150} />
        </View>
        <Text style={styles.title}>Kusema</Text>
        <Text>
          Kusema is the only truly encrypted way to communicate with people.
        </Text>
        <TextInput
          style={styles.displayName}
          placeholder="Write your display name!"
          onChangeText={setDisplayName}
        />
      </View>
      {!!displayName && (
        <Button
          title={`Start now ${displayName}!`}
          color="#2d2d2d"
          onPress={handleClick}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    color: "indigo",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 90,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: "center",
    width: "60%",
  },
  displayName: {
    margin: 15,
  },
});

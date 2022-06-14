import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useMemo, useReducer } from "react";
import { Alert } from "react-native";
import { ChatStack, FirstJoinStack } from "./src/components/ChatStack";
import { DatabaseContext } from "./src/services/database";
import { Database, DB } from "./src/services/database";

export interface DatabaseState {
  hasDatabase: boolean;
  db: DB;
}

interface DatabaseAction {
  type: string;
  db: DB;
}

export default function App() {
  const database = Database.getInstance();

  const databaseReducer = (
    prevState: DatabaseState,
    action: DatabaseAction
  ) => {
    switch (action.type) {
      case "CREATE_DATABASE":
        return {
          ...prevState,
          hasDatabase: true,
          db: action.db,
        };
      case "DELETE_DATABASE":
        return {
          ...prevState,
          hasDatabase: false,
        };
      case "HAS_DATABASE":
        return {
          ...prevState,
          hasDatabase: true,
        };
      default:
        return prevState;
    }
  };

  const [state, dispatch] = useReducer(databaseReducer, {
    hasDatabase: false,
    db: null,
  });

  useEffect(() => {
    database.checkIfDatabaseExists().then(
      (res) => {
        if (res) dispatch({ type: "HAS_DATABASE", db: res });
      },
      (err) =>
        Alert.alert("Error checking if database exists. Maybe is corrupt?")
    );
  }, []);

  const databaseContext = useMemo(
    () => ({
      createDatabase: (db: DB) => {
        dispatch({ type: "CREATE_DATABASE", db });
      },
      deleteDatabase: () => {
        database.deleteDatabase().then(
          () => {
            dispatch({ type: "DELETE_DATABASE", db: null });
          },
          (err) => console.log(err)
        );
      },
    }),
    []
  );

  return (
    <DatabaseContext.Provider value={databaseContext}>
      <NavigationContainer>
        {(!state.hasDatabase && <FirstJoinStack />) || <ChatStack />}
      </NavigationContainer>
    </DatabaseContext.Provider>
  );
}

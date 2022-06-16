import * as SQLite from "expo-sqlite";
import { createContext } from "react";
import { Platform } from "react-native";
import { User } from "../models/User";
import uuid from "react-native-uuid";
import { QRChat } from "../models/QRChat";

export type DB = SQLite.Database | null;

export const DatabaseContext = createContext();

export class Database {
  private database: DB;
  private static instance: Database;

  private constructor() {
    this.database = this.openDatabase();
  }

  public checkIfDatabaseExists(): Promise<DB> {
    return new Promise((resolve, reject) => {
      if (!this.database) {
        reject("Database not found in device context");
        return;
      }
      this.database.transaction(
        (x) => {
          x.executeSql("select * from user", [], (_, { rows }) => {
            if (rows.length > 0) resolve(this.database);
            resolve(null);
          });
        },
        (_) => resolve(null)
      );
    });
  }

  public removeDatabase(): void {
    if (!this.database) return;

    this.database.transaction(
      (x) => {
        x.executeSql("delete from user");
      },
      (_) => {
        throw new Error("Can't delete users");
      }
    );
  }

  public removeChat(guid: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (!this.database) {
        reject("Couldn't delete chat from database");
        return;
      }

      this.database.transaction(
        (x) => {
          x.executeSql("delete from chats where guid = ?", [guid]);
          resolve(true);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  public getDatabase(): DB {
    return this.database;
  }

  public async initDatabase(name: string): Promise<DB> {
    const user = await this.generateUserBasedInName(name);
    return this.createTables(user);
  }

  public getContactChats(): Promise<QRChat[]> {
    return new Promise((resolve, reject) => {
      if (!this.database) {
        reject("No database in context!");
        return;
      }

      this.database.transaction((x) => {
        x.executeSql("select * from chats", [], (_, { rows }) => {
          resolve(
            rows._array.map(
              (x) =>
                ({
                  guidChat: x.guid,
                  encryptionKey: x.encryptionKey,
                  name: x.name,
                } as QRChat)
            )
          );
        });
      });
    });
  }

  // FOR DEBUGGING PURPOSES ONLY
  public deleteDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.database) {
        reject();
        return;
      }

      this.database.transaction(
        (x) => {
          x.executeSql("delete from user;");
          x.executeSql("delete from chats;");
          x.executeSql("drop table if exists user;");
          x.executeSql("drop table if exists chats;");
          resolve();
        },
        (err) => {
          console.error(err);
          reject(err);
        }
      );
    });
  }

  public getUser(): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      if (!this.database) {
        reject("Imposible to create database!");
        return;
      }

      this.database.transaction((x) => {
        x.executeSql("select id, name from user", [], (_, { rows }) => {
          resolve({
            _id: rows.item(0)["id"],
            name: rows.item(0)["name"],
          });
        });
      });
    });
  }

  public addChat(chat: QRChat) {
    return new Promise<boolean>((resolve, reject) => {
      if (!this.database) {
        reject("No database in context!");
        return;
      }

      console.log(chat);
      this.database.transaction(
        (x) => {
          x.executeSql(
            `insert into chats (guid, name, encryptionKey) values ('${chat.guidChat}', '${chat.name}', '${chat.encryptionKey}')`
          );
          resolve(true);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  private createTables(user: User): Promise<DB> {
    return new Promise<DB>((resolve, reject) => {
      if (!this.database) {
        reject("Imposible to create database!");
        return;
      }

      this.database.transaction(
        (x) => {
          x.executeSql(
            "create table if not exists user (id text primary key not null, name text not null)"
          );
          x.executeSql(
            "create table if not exists chats (guid text primary key not null, name text not null, encryptionKey text not null)"
          );
          x.executeSql(
            `insert into user (id, name) values ('${user._id}', '${user.name}')`
          );
          resolve(this.database);
        },
        (_) => {
          console.error(_);
          reject(_);
        }
      );
    });
  }

  private openDatabase(): DB {
    if (Platform.OS === "web") {
      throw new Error("Web is not supported for now...");
    }

    const db = SQLite.openDatabase("kusema.db");
    return db;
  }

  private async generateUserBasedInName(name: string): Promise<User> {
    return {
      _id: uuid.v4().toString(),
      name,
    };
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

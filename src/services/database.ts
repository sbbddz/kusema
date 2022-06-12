import * as SQLite from "expo-sqlite";
import { createContext } from "react";
import { Platform } from "react-native";
import { IMessage } from "react-native-gifted-chat";
import { Contact } from "../models/Contact";

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

  public getDatabase(): DB {
    return this.database;
  }

  public initDatabase(): Promise<DB> {
    return this.createTables();
  }

  public getContactChats(): Promise<Contact[]> {
    return new Promise((resolve, reject) => {
      if (!this.database) {
        reject("No database in context!");
        return;
      }

      this.database.transaction((x) => {
        x.executeSql("select * from contacts", [], (_, { rows }) => {
          resolve(rows._array);
        });
      });
    });
  }

  public getMessagesByContact(contact: Contact): Promise<IMessage[]> {
    return new Promise((resolve, reject) => {
      if (!this.database) {
        reject("No database in context!");
        return;
      }

      this.database.transaction(
        (x) => {
          x.executeSql(
            "select * from messages where contact = ?",
            [contact.id],
            (_, { rows }) => {
              const mappedRows = rows._array.map(x => ({
                _id: x["id"],
                text: x["message"],
                createdAt: x["time"],
                user: {
                  name: 'Probando',
                  avatar: 'https://placeimg.com/140/140/any',
                }
              } as IMessage))
              resolve(mappedRows)
            }
          );
        },
        (err) => console.log(err)
      );
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
          x.executeSql("delete from contacts;");
          x.executeSql("delete from messages;");
          x.executeSql("drop table if exists user;");
          x.executeSql("drop table if exists contacts;");
          x.executeSql("drop table if exists messages;");
          resolve();
        },
        (err) => reject(err)
      );
    });
  }

  private createTables(): Promise<DB> {
    return new Promise<DB>((resolve, reject) => {
      if (!this.database) {
        reject("Imposible to create database!");
        return;
      }

      this.database.transaction(
        (x) => {
          x.executeSql(
            "create table if not exists user (id integer primary key not null, displayName text not null, privateKey text not null, publicKey text not null, guid text not null)"
          );
          x.executeSql(
            "create table if not exists contacts (id text primary key not null, displayName text not null, publicKey text not null)"
          );
          x.executeSql(
            "create table if not exists messages (id integer primary key autoincrement not null, contact text not null, sentByUser bool not null, time date, message text)"
          );

          // TODO: Only debug!
          x.executeSql(
            "insert into user (id, displayName, privateKey, publicKey, guid) VALUES (0, 'Jose Antonio', 'fdsa', 'fdas', 'fdasss')"
          );
          x.executeSql(
            "insert into messages (contact, sentByUser, time, message) VALUES ('324', true, date('now'), 'Hola que tal')"
          );
          /*x.executeSql(
            "insert into messages (id, userFrom, time, message) VALUES (324, false, date('now'), 'Hola')"
          );*/
          x.executeSql(
            "insert into contacts (id, displayName, publicKey) VALUES ('324', 'Jose Manuel', 'AAAAA')"
          );

          resolve(this.database);
        },
        (_) => {
          //console.log(_);
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

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

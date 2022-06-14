import { initializeApp } from 'firebase/app';
import { addDoc, collection, doc, getFirestore, orderBy, setDoc } from 'firebase/firestore';
import Constants from 'expo-constants'
import { IMessage } from 'react-native-gifted-chat';
import { User } from '../models/User';

const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
  databaseURL: Constants.manifest.extra.databaseURL
};

initializeApp(firebaseConfig);

export const firestoreDatabase = getFirestore();
export const firestoreCollection = collection(firestoreDatabase, 'chats')

export const getPendingMessagesFromGuid = (guid: string) => {
  const q = query(firestoreCollection);
}

export const sendMessageToGuidChat = (guidChat: string, message: IMessage) => {
  const { _id, createdAt, text } = message;
  return addDoc(collection(firestoreDatabase, 'chats'), {
    _id, createdAt, text, guidChat
  });
}

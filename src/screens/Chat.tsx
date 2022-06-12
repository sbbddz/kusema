import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Contact } from "../models/Contact";
import { Database } from "../services/database";

type RootStackParamList = {
  contact: Contact;
};

type Props = NativeStackScreenProps<RootStackParamList, "contact">;

export const Chat: React.FC = ({ route, navigation }: Props) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const db = Database.getInstance();

  useEffect(() => {
    let contact: Contact = route.params;
    db.getMessagesByContact(contact).then((res) => setMessages(res));
  }, []);

  const handleSend = () => {
    console.log("a");
  };

  return messages && <GiftedChat messages={messages} onSend={handleSend} />;
};

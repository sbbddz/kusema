import { useState } from "react";
import { QRChat } from "../models/QRChat";

export const useContacts = () => {
  const [contacts, setState] = useState<QRChat[]>([]);

  const setContacts = (contacts: QRChat[]) => {
    setState(contacts);
  };

  return [contacts, setContacts] as const;
};

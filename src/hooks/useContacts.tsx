import { useState } from "react";
import { Contact } from "../models/Contact";

export const useContacts = () => {
  const [contacts, setState] = useState<Contact[]>([]);

  const setContacts = (contacts: Contact[]) => {
    setState(contacts);
  };

  return [contacts, setContacts] as const;
};

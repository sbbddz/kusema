import CryptoES from "crypto-es";
// @ts-ignore
import C from "crypto-js";

export const encryptMessage = (message: string, encryptKey: string) => {
  let encryptedText = CryptoES.AES.encrypt(message, encryptKey).toString();
  return encryptedText;
};

export const decryptMessage = (message: string, encryptKey: string) => {
  let decryptedText = CryptoES.AES.decrypt(message, encryptKey).toString(
    C.enc.Utf8
  );
  return decryptedText;
};

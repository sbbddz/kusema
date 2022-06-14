import CryptoES from 'crypto-es';

export const encryptMessage = (message: string, encryptKey: string) => {
  return CryptoES.AES.encrypt(message, encryptKey);
}

export const decryptMessage = (message: string, encryptKey: string) => {
  return CryptoES.AES.decrypt(message, encryptKey);
}

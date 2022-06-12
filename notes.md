First time joined app -> (does not exists any sqllite db) -> message intro about the app and create the database, with the display name.

HOME -> 
 - List of contacts added by QR code. (list of chats btw)
 - Floating button with a plus sign -> add a qr code of a contact

QR CODES ->
 -  QR Code will have stored the public decryption key of the contact and the username (display name)

GENERATE QR CODE ->
 - Another floating button, on top of the plus sign that will share in the screen your own QR Code

CHAT WITH X ->
 - Using react native library, will send and receive the messages with the users (decrypt and encrypt before existing the phone)

ENCRYPTION ->
 - OpenPGP.js -> https://github.com/orhan/react-native-openpgp

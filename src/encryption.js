// src/cryptoUtils.js
import CryptoJS from "crypto-js";

// You can change this secret key to anything secure (store it safely)
const SECRET_KEY = "my-super-secret-key-12345";

// Encrypt function
export const encryptData = (data) => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      SECRET_KEY
    ).toString();
    console.log("Encrypted data:", ciphertext);
    return ciphertext;
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

// Decrypt function
export const decryptData = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

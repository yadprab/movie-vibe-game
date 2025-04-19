/**
 * Simple encryption/decryption utilities for movie titles
 * This is a basic implementation for demonstration purposes
 */

// A simple encryption key
const ENCRYPTION_KEY = 'CINEMYSTERY_KEY';

/**
 * Encrypt a string using a simple XOR cipher
 * @param text The text to encrypt
 * @returns The encrypted text as a base64 string
 */
export const encryptText = (text: string): string => {
  if (!text) return '';
  
  // XOR each character with the corresponding character in the key
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    result += String.fromCharCode(charCode);
  }
  
  // Convert to base64 for safe storage
  return btoa(result);
};

/**
 * Decrypt a string that was encrypted with encryptText
 * @param encryptedText The encrypted text (base64 string)
 * @returns The decrypted text
 */
export const decryptText = (encryptedText: string): string => {
  if (!encryptedText) return '';
  
  try {
    // Convert from base64
    const base64Decoded = atob(encryptedText);
    
    // XOR each character with the corresponding character in the key
    let result = '';
    for (let i = 0; i < base64Decoded.length; i++) {
      const charCode = base64Decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    
    return result;
  } catch (error) {
    console.error('Failed to decrypt text:', error);
    return '';
  }
};

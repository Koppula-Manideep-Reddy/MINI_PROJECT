export interface CipherResult {
  encrypted: string;
  key: string;
  authCode: string;
}

export interface StoredCipher {
  encrypted: string;
  key: string;
  authCode: string;
  timestamp: number;
}

// Generate random auth code
export const generateAuthCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Caesar Cipher
export const caesarEncrypt = (text: string, shift: number): string => {
  return text.split('').map(char => {
    if (char.match(/[a-z]/i)) {
      const code = char.charCodeAt(0);
      const base = code >= 65 && code <= 90 ? 65 : 97;
      return String.fromCharCode(((code - base + shift) % 26) + base);
    }
    return char;
  }).join('');
};

export const caesarDecrypt = (text: string, shift: number): string => {
  return caesarEncrypt(text, 26 - shift);
};

// Vigenère Cipher
export const vigenereEncrypt = (text: string, keyword: string): string => {
  const key = keyword.toUpperCase();
  let result = '';
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char.match(/[a-z]/i)) {
      const textCode = char.toUpperCase().charCodeAt(0) - 65;
      const keyCode = key[keyIndex % key.length].charCodeAt(0) - 65;
      const encryptedCode = (textCode + keyCode) % 26;
      
      result += String.fromCharCode(encryptedCode + 65);
      keyIndex++;
    } else {
      result += char;
    }
  }
  
  return result;
};

export const vigenereDecrypt = (text: string, keyword: string): string => {
  const key = keyword.toUpperCase();
  let result = '';
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char.match(/[a-z]/i)) {
      const textCode = char.toUpperCase().charCodeAt(0) - 65;
      const keyCode = key[keyIndex % key.length].charCodeAt(0) - 65;
      const decryptedCode = (textCode - keyCode + 26) % 26;
      
      result += String.fromCharCode(decryptedCode + 65);
      keyIndex++;
    } else {
      result += char;
    }
  }
  
  return result;
};

// Substitution Cipher
export const generateSubstitutionKey = (): string => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet.split('').sort(() => Math.random() - 0.5).join('');
};

export const substitutionEncrypt = (text: string, substitutionKey: string): string => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return text.toUpperCase().split('').map(char => {
    const index = alphabet.indexOf(char);
    return index !== -1 ? substitutionKey[index] : char;
  }).join('');
};

export const substitutionDecrypt = (text: string, substitutionKey: string): string => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return text.toUpperCase().split('').map(char => {
    const index = substitutionKey.indexOf(char);
    return index !== -1 ? alphabet[index] : char;
  }).join('');
};

// Main encryption function
export const encryptText = (text: string, method: string, key?: string): CipherResult => {
  const authCode = generateAuthCode();
  let encrypted: string;
  let cipherKey: string;

  switch (method) {
    case 'caesar':
      const shift = Math.floor(Math.random() * 25) + 1;
      encrypted = caesarEncrypt(text, shift);
      cipherKey = shift.toString();
      break;
    
    case 'vigenere':
      if (!key || key.trim() === '') {
        throw new Error('Vigenère cipher requires a keyword');
      }
      encrypted = vigenereEncrypt(text, key);
      cipherKey = key.toUpperCase();
      break;
    
    case 'substitution':
      const substitutionKey = generateSubstitutionKey();
      encrypted = substitutionEncrypt(text, substitutionKey);
      cipherKey = substitutionKey;
      break;
    
    default:
      throw new Error('Unknown encryption method');
  }

  // Store in localStorage
  const storedCipher: StoredCipher = {
    encrypted,
    key: cipherKey,
    authCode,
    timestamp: Date.now()
  };
  
  localStorage.setItem('aegis_cipher', JSON.stringify(storedCipher));

  return { encrypted, key: cipherKey, authCode };
};

// Main decryption function
export const decryptText = (encrypted: string, key: string, authCode: string, method: string): string => {
  // Verify against stored cipher
  const stored = localStorage.getItem('aegis_cipher');
  if (!stored) {
    throw new Error('No stored cipher found');
  }

  const storedCipher: StoredCipher = JSON.parse(stored);
  
  if (storedCipher.encrypted !== encrypted || 
      storedCipher.key !== key || 
      storedCipher.authCode !== authCode) {
    throw new Error('Authentication failed');
  }

  switch (method) {
    case 'caesar':
      return caesarDecrypt(encrypted, parseInt(key));
    
    case 'vigenere':
      return vigenereDecrypt(encrypted, key);
    
    case 'substitution':
      return substitutionDecrypt(encrypted, key);
    
    default:
      throw new Error('Unknown decryption method');
  }
};
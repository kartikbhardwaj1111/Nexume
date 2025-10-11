/**
 * Encryption Service for secure local storage
 * Provides client-side encryption for sensitive user data
 */

class EncryptionService {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
    this.ivLength = 12;
  }

  /**
   * Generate a cryptographic key for encryption
   * @returns {Promise<CryptoKey>} Generated key
   */
  async generateKey() {
    return await crypto.subtle.generateKey(
      {
        name: this.algorithm,
        length: this.keyLength,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Derive a key from a password using PBKDF2
   * @param {string} password - User password or session identifier
   * @param {Uint8Array} salt - Salt for key derivation
   * @returns {Promise<CryptoKey>} Derived key
   */
  async deriveKey(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: this.algorithm, length: this.keyLength },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt data using AES-GCM
   * @param {string} data - Data to encrypt
   * @param {CryptoKey} key - Encryption key
   * @returns {Promise<Object>} Encrypted data with IV
   */
  async encrypt(data, key) {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(this.ivLength));
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: this.algorithm,
        iv: iv,
      },
      key,
      encoder.encode(data)
    );

    return {
      encrypted: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv),
    };
  }

  /**
   * Decrypt data using AES-GCM
   * @param {Object} encryptedData - Encrypted data with IV
   * @param {CryptoKey} key - Decryption key
   * @returns {Promise<string>} Decrypted data
   */
  async decrypt(encryptedData, key) {
    const decoder = new TextDecoder();
    
    const decrypted = await crypto.subtle.decrypt(
      {
        name: this.algorithm,
        iv: new Uint8Array(encryptedData.iv),
      },
      key,
      new Uint8Array(encryptedData.encrypted)
    );

    return decoder.decode(decrypted);
  }

  /**
   * Generate a random salt for key derivation
   * @returns {Uint8Array} Random salt
   */
  generateSalt() {
    return crypto.getRandomValues(new Uint8Array(16));
  }

  /**
   * Export key to raw format for storage
   * @param {CryptoKey} key - Key to export
   * @returns {Promise<ArrayBuffer>} Exported key
   */
  async exportKey(key) {
    return await crypto.subtle.exportKey('raw', key);
  }

  /**
   * Import key from raw format
   * @param {ArrayBuffer} keyData - Raw key data
   * @returns {Promise<CryptoKey>} Imported key
   */
  async importKey(keyData) {
    return await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: this.algorithm },
      true,
      ['encrypt', 'decrypt']
    );
  }
}

export default EncryptionService;
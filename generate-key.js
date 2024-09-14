const crypto = require('crypto');

// Function to generate a secure random key
const generateSecureKey = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate and print a secure key
const secureKey = generateSecureKey();
console.log('Generated Secure Key:', secureKey);

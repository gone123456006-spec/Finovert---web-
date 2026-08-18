import bcrypt from 'bcryptjs';

const ROUNDS = 12;

export function isBcryptHash(value) {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value);
}

export async function hashPassword(plain) {
  return bcrypt.hash(String(plain), ROUNDS);
}

export async function verifyPassword(plain, stored) {
  if (!plain || !stored) return false;
  if (isBcryptHash(stored)) {
    return bcrypt.compare(String(plain), stored);
  }
  // Legacy plaintext rows — accept once, then caller should re-hash
  return String(plain) === String(stored);
}

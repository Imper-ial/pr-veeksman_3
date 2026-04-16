function isValidEmail(value) {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

function isStrongEnoughPassword(value) {
  if (!value) return false;
  return String(value).length >= 8;
}

function isValidPhone(value) {
  if (!value) return true; // telefon er valgfri
  return /^[0-9+\s-]{6,20}$/.test(String(value).trim());
}

function hasText(value, minLength = 1) {
  if (!value) return false;
  return String(value).trim().length >= minLength;
}

module.exports = {
  isValidEmail,
  isStrongEnoughPassword,
  isValidPhone,
  hasText
};

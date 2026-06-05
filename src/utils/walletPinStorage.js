const PIN_KEY = 'budg8it_wallet_pin'
const EMAIL_KEY = 'budg8it_wallet_email'
const DEFAULT_EMAIL = 'serah@budg8it.com'

export function hasWalletPin() {
  try {
    return !!localStorage.getItem(PIN_KEY)
  } catch {
    return false
  }
}

export function getStoredPin() {
  try {
    return localStorage.getItem(PIN_KEY) ?? ''
  } catch {
    return ''
  }
}

export function saveWalletPin(pin) {
  localStorage.setItem(PIN_KEY, pin)
}

export function verifyWalletPin(pin) {
  return getStoredPin() === pin
}

export function getRegisteredEmail() {
  try {
    return localStorage.getItem(EMAIL_KEY) || DEFAULT_EMAIL
  } catch {
    return DEFAULT_EMAIL
  }
}

export function saveRegisteredEmail(email) {
  localStorage.setItem(EMAIL_KEY, email.trim().toLowerCase())
}

export function verifyRegisteredEmail(email) {
  return email.trim().toLowerCase() === getRegisteredEmail().toLowerCase()
}

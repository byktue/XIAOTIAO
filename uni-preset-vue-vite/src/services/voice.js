const STORAGE_KEY = 'voiceBroadcastEnabled'
const EVENT_NAME = 'voice-broadcast:change'
const HAPTIC_STORAGE_KEY = 'hapticFeedbackEnabled'
const HAPTIC_EVENT_NAME = 'haptic-feedback:change'
const uniApi = typeof uni !== 'undefined' ? uni : null
let cachedPreference = readStoredPreference(STORAGE_KEY)
let cachedHapticPreference = readStoredPreference(HAPTIC_STORAGE_KEY)

function readStoredPreference(key) {
  if (!uniApi) {
    return true
  }
  const stored = uniApi.getStorageSync(key)
  if (stored === '' || stored === undefined || stored === null) {
    return true
  }
  if (typeof stored === 'boolean') {
    return stored
  }
  if (typeof stored === 'string') {
    return stored === 'true'
  }
  return !!stored
}

export function getVoicePreference() {
  return cachedPreference
}

export function setVoicePreference(enabled) {
  cachedPreference = !!enabled
  if (uniApi) {
    uniApi.setStorageSync(STORAGE_KEY, cachedPreference)
    uniApi.$emit?.(EVENT_NAME, cachedPreference)
  }
  return cachedPreference
}

export function toggleVoicePreference() {
  return setVoicePreference(!getVoicePreference())
}

export function onVoicePreferenceChange(handler) {
  if (!uniApi || typeof handler !== 'function') {
    return () => {}
  }
  const listener = (value) => handler(value)
  uniApi.$on(EVENT_NAME, listener)
  return () => uniApi.$off(EVENT_NAME, listener)
}

export function speak(text) {
  if (!getVoicePreference()) {
    return false
  }
  console.info('[voice-placeholder] speak:', text)
  return true
}

export function getHapticPreference() {
  return cachedHapticPreference
}

export function setHapticPreference(enabled) {
  cachedHapticPreference = !!enabled
  if (uniApi) {
    uniApi.setStorageSync(HAPTIC_STORAGE_KEY, cachedHapticPreference)
    uniApi.$emit?.(HAPTIC_EVENT_NAME, cachedHapticPreference)
  }
  return cachedHapticPreference
}

export function toggleHapticPreference() {
  return setHapticPreference(!getHapticPreference())
}

export function onHapticPreferenceChange(handler) {
  if (!uniApi || typeof handler !== 'function') {
    return () => {}
  }
  const listener = (value) => handler(value)
  uniApi.$on(HAPTIC_EVENT_NAME, listener)
  return () => uniApi.$off(HAPTIC_EVENT_NAME, listener)
}

export function vibrateShort(options = {}) {
  if (!getHapticPreference() || !uniApi || typeof uniApi.vibrateShort !== 'function') {
    return false
  }
  try {
    uniApi.vibrateShort(options)
    return true
  } catch (err) {
    console.info('vibrate not supported', err)
    return false
  }
}

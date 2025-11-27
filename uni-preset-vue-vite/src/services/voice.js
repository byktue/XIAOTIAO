const STORAGE_KEY = 'voiceBroadcastEnabled'
const EVENT_NAME = 'voice-broadcast:change'
const uniApi = typeof uni !== 'undefined' ? uni : null
let cachedPreference = readStoredPreference()

function readStoredPreference() {
  if (!uniApi) {
    return true
  }
  const stored = uniApi.getStorageSync(STORAGE_KEY)
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

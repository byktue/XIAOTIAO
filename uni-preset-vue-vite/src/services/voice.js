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
  const msgText = String(text || '')
  console.info('[voice] speak:', msgText)
  // H5: 使用 Web Speech API（SpeechSynthesis）在浏览器中发声
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(msgText)
      // 尝试选择中文语音（若可用）
      const voices = window.speechSynthesis.getVoices()
      if (voices && voices.length) {
        utter.voice = voices.find(v => /zh|cn|ch/i.test(v.lang)) || voices[0]
      }
      // 兼容设置
      utter.lang = utter.lang || (navigator.language || 'zh-CN')
      utter.rate = 1
      // 取消当前队列并播放
      try { window.speechSynthesis.cancel() } catch (e) {}
      window.speechSynthesis.speak(utter)
      return true
    }
  } catch (err) {
    console.warn('[voice] TTS failed', err)
  }

  // fallback: 仍然记录并返回 true（不影响调用方）
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

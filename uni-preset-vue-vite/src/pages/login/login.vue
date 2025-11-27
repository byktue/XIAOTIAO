<template>
  <view class="login-page">
    <view class="login-container" :class="{ 'slide-up': showContainer, 'error-shake': feedbackActive }">
      <view class="logo-area">
        <view class="logo">L</view>
        <text class="title">欢迎回来</text>
        <text class="subtitle">请输入您的账号和密码</text>
      </view>

      <view class="form-container">
        <view class="form-group">
          <view class="input-wrapper" :class="[{ focused: usernameFocused }, invalidField === 'username' ? 'invalid' : '']">
            <text class="input-icon">👤</text>
            <input
              v-model="formData.username"
              type="text"
              class="form-input"
              :placeholder="getDynamicPlaceholder('username')"
              :placeholder-style="getPlaceholderStyle('username')"
              aria-label="账号输入框"
              title="请输入账号"
              @focus="onFieldFocus('username')"
              @blur="onFieldBlur('username')"
            />
          </view>
        </view>

        <view class="form-group">
          <view class="input-wrapper" :class="[{ focused: passwordFocused }, invalidField === 'password' ? 'invalid' : '']">
            <text class="input-icon">🔒</text>
            <input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              :placeholder="getDynamicPlaceholder('password')"
              :placeholder-style="getPlaceholderStyle('password')"
              aria-label="密码输入框"
              title="请输入密码"
              @focus="onFieldFocus('password')"
              @blur="onFieldBlur('password')"
            />
            <view class="password-toggle" @click="togglePassword">
              <text>{{ showPassword ? '🙈' : '👁️' }}</text>
            </view>
          </view>
        </view>

        <view class="remember-me" @click="toggleRemember">
          <checkbox-group @change="handleRememberChange">
            <checkbox :checked="formData.remember" color="#667eea" aria-label="记住我" />
          </checkbox-group>
          <text class="remember-text">记住我</text>
        </view>

        <button
          class="login-btn"
          :class="{ loading: isLoading }"
          :disabled="isLoading"
          @click="handleLogin"
        >
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </view>

      <view class="divider">
        <view class="divider-line"></view>
        <text class="divider-text">或</text>
        <view class="divider-line"></view>
      </view>

      <view class="register-link">
        <text>还没有账号？</text>
        <text class="register-btn" @click="handleRegister">立即注册</text>
      </view>
    </view>

    <view class="toast" :class="{ show: showToast }">
      <text>{{ toastMessage }}</text>
    </view>
  </view>
</template>

<script>
import { speak, vibrateShort } from '../../services/voice.js'

export default {
  data() {
    return {
      formData: {
        username: '',
        password: '',
        remember: false
      },
      placeholderTexts: {
        username: '请输入账号',
        password: '请输入密码'
      },
      showPassword: false,
      usernameFocused: false,
      passwordFocused: false,
      invalidField: '',
      isLoading: false,
      showToast: false,
      toastMessage: '',
      showContainer: false,
      feedbackActive: false
    }
  },
  onLoad() {
    const savedUsername = uni.getStorageSync('savedUsername')
    if (savedUsername) {
      this.formData.username = savedUsername
      this.formData.remember = true
    }

    const app = getApp()
    if (app && app.globalData && app.globalData.registeredUsername) {
      this.formData.username = app.globalData.registeredUsername
      app.globalData.registeredUsername = null
    }

    setTimeout(() => {
      this.showContainer = true
    }, 100)
  },
  methods: {
    onFieldFocus(field) {
      if (field === 'username') this.usernameFocused = true
      if (field === 'password') this.passwordFocused = true
      const hints = {
        username: '账号输入框已聚焦，请输入您的登录账号',
        password: '密码输入框已聚焦，输入内容将被保护'
      }
      speak(hints[field] || '输入区域已激活')
    },
    onFieldBlur(field) {
      if (field === 'username') this.usernameFocused = false
      if (field === 'password') this.passwordFocused = false
    },
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    toggleRemember() {
      this.formData.remember = !this.formData.remember
    },
    handleRememberChange(e) {
      this.formData.remember = e.detail.value.length > 0
    },
    handleRegister() {
      uni.navigateTo({
        url: '/pages/register/register'
      })
    },
    async handleLogin() {
      speak('登录按钮已按下，正在为您检查输入')
      if (!this.formData.username.trim()) {
        this.triggerValidationFeedback('请输入账号', 'username')
        return
      }

      if (!this.formData.password) {
        this.triggerValidationFeedback('请输入密码', 'password')
        return
      }

      this.isLoading = true
      try {
        speak('正在登录，请稍候')
        await new Promise(resolve => setTimeout(resolve, 1500))

        if (this.formData.remember) {
          uni.setStorageSync('savedUsername', this.formData.username)
        } else {
          uni.removeStorageSync('savedUsername')
        }

        uni.setStorageSync('isLoggedIn', true)
        uni.setStorageSync('userInfo', {
          username: this.formData.username
        })

        this.showToastMessage('登录成功！', { voice: true })

        setTimeout(() => {
          uni.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
      } catch (error) {
        console.error('登录失败:', error)
        this.triggerValidationFeedback('登录失败，请重试')
      } finally {
        this.isLoading = false
      }
    },
    triggerValidationFeedback(message, field) {
      if (field) {
        this.invalidField = field
        setTimeout(() => {
          this.invalidField = ''
        }, 1000)
      }
      this.feedbackActive = true
      setTimeout(() => {
        this.feedbackActive = false
      }, 400)
      vibrateShort({ style: 'heavy' })
      this.showToastMessage(message, { voice: true })
    },
    showToastMessage(message, options = {}) {
      this.toastMessage = message
      this.showToast = true
      if (options.voice) {
        speak(message)
      }
      setTimeout(() => {
        this.showToast = false
      }, 2000)
    },
    getDynamicPlaceholder(field) {
      const base = this.placeholderTexts?.[field] || ''
      const value = this.formData?.[field]
      return value ? '' : base
    },
    getPlaceholderStyle(field) {
      const value = this.formData?.[field]
      return value ? 'color: transparent;' : 'color: #b0b8c3;'
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, #8f6bff55, transparent 55%), linear-gradient(135deg, #5b71ff 0%, #8f6bff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60rpx 40rpx;
  position: relative;
}

.login-container {
  width: 100%;
  max-width: 760rpx;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 56rpx;
  padding: 96rpx 72rpx;
  box-shadow: 0 40rpx 120rpx rgba(91, 113, 255, 0.28);
  -webkit-backdrop-filter: blur(24rpx);
  backdrop-filter: blur(24rpx);
  opacity: 0;
  transform: translateY(60rpx);
  transition: all 0.5s ease-out;

  &.slide-up {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-area {
  text-align: center;
  margin-bottom: 96rpx;
}

.logo {
  width: 180rpx;
  height: 180rpx;
  background: linear-gradient(135deg, #5b71ff 0%, #8f6bff 100%);
  border-radius: 48rpx;
  margin: 0 auto 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 80rpx;
  font-weight: bold;
  box-shadow: 0 18rpx 48rpx rgba(91, 113, 255, 0.4);
}

.title {
  display: block;
  font-size: 60rpx;
  font-weight: 600;
  color: #1c2333;
  margin-bottom: 16rpx;
}

.subtitle {
  display: block;
  font-size: 32rpx;
  color: #5c6673;
}

.form-container {
  width: 100%;
}

.form-group {
  margin-bottom: 56rpx;
  position: relative;
}

.input-wrapper {
  position: relative;
  transition: transform 0.2s ease;

  &.focused {
    transform: scale(1.02);
  }
}

.input-icon {
  position: absolute;
  left: 36rpx;
  top: 50%;
  transform: translateY(-50%);
  color: #7b8794;
  font-size: 44rpx;
  z-index: 1;
}

.form-input {
  width: 100%;
  height: 118rpx;
  padding: 0 40rpx 0 110rpx;
  border: 4rpx solid #e0e0e0;
  border-radius: 32rpx;
  font-size: 34rpx;
  background: #f8f9fa;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #b0b8c3;
}

.input-wrapper.focused .form-input {
  border-color: #5b71ff;
  background: #fff;
  box-shadow: 0 0 0 10rpx rgba(91, 113, 255, 0.12);
}

.input-wrapper.invalid .form-input {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 10rpx rgba(255, 107, 107, 0.18);
}

.password-toggle {
  position: absolute;
  right: 36rpx;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #7b8794;
  font-size: 44rpx;
  padding: 8rpx;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:active {
  opacity: 0.7;
}


.remember-me {
  display: flex;
  align-items: center;
  margin-bottom: 72rpx;
  font-size: 32rpx;
  color: #5c6673;
  cursor: pointer;
}

checkbox-group {
  display: flex;
  align-items: center;
}

.remember-text {
  margin-left: 16rpx;
  user-select: none;
}

.login-btn {
  width: 100%;
  height: 120rpx;
  background: linear-gradient(135deg, #5b71ff 0%, #8f6bff 100%);
  border: none;
  border-radius: 32rpx;
  color: white;
  font-size: 38rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 12rpx 34rpx rgba(91, 113, 255, 0.35);
  margin-bottom: 56rpx;
}

.login-btn:active:not(:disabled) {
  transform: scale(0.98);
  box-shadow: 0 6rpx 20rpx rgba(91, 113, 255, 0.28);
}

.login-btn:disabled {
  opacity: 0.6;
}

.login-container.error-shake {
  animation: shake 0.4s ease;
}

@keyframes shake {
  0% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateX(-12rpx);
  }
  50% {
    transform: translateX(12rpx);
  }
  75% {
    transform: translateX(-8rpx);
  }
  100% {
    transform: translateX(0);
  }
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 48rpx 0;
  position: relative;
}

.divider-line {
  flex: 1;
  height: 2rpx;
  background: #e0e0e0;
}

.divider-text {
  margin: 0 24rpx;
  color: #7b8794;
  font-size: 32rpx;
}

.register-link {
  text-align: center;
  font-size: 32rpx;
  color: #5c6673;
}

.register-btn {
  color: #5b71ff;
  font-weight: 600;
  margin-left: 16rpx;
}

.register-btn:active {
  color: #8f6bff;
}

.toast {
  position: fixed;
  top: 40rpx;
  left: 50%;
  transform: translateX(-50%) translateY(-200rpx);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 24rpx 48rpx;
  border-radius: 16rpx;
  font-size: 32rpx;
  z-index: 1000;
  opacity: 0;
  transition: all 0.3s ease;
  white-space: nowrap;

  &.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>


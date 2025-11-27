<template>
  <view class="register-page">
    <view class="register-container" :class="{ 'slide-up': showContainer, 'error-shake': feedbackActive }">
      <view class="logo-area">
        <view class="logo">R</view>
        <text class="title">创建账号</text>
        <text class="subtitle">请填写以下信息完成注册</text>
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

        <view class="form-group">
          <view class="input-wrapper" :class="[{ focused: confirmPasswordFocused }, invalidField === 'confirm' ? 'invalid' : '']">
            <text class="input-icon">🔒</text>
            <input
              v-model="formData.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input"
              :placeholder="getDynamicPlaceholder('confirmPassword')"
              :placeholder-style="getPlaceholderStyle('confirmPassword')"
              aria-label="确认密码输入框"
              title="请再次输入密码"
              @focus="onFieldFocus('confirm')"
              @blur="onFieldBlur('confirm')"
            />
            <view class="password-toggle" @click="toggleConfirmPassword">
              <text>{{ showConfirmPassword ? '🙈' : '👁️' }}</text>
            </view>
          </view>
        </view>

        <view class="form-group">
          <view class="input-wrapper" :class="[{ focused: phoneFocused }, invalidField === 'phone' ? 'invalid' : '']">
            <text class="input-icon">📱</text>
            <input
              v-model="formData.phone"
              type="number"
              class="form-input"
              :placeholder="getDynamicPlaceholder('phone')"
              :placeholder-style="getPlaceholderStyle('phone')"
              aria-label="手机号输入框"
              title="请输入手机号"
              @focus="onFieldFocus('phone')"
              @blur="onFieldBlur('phone')"
            />
          </view>
        </view>

        <button
          class="register-btn"
          :class="{ 'loading': isLoading }"
          :disabled="isLoading"
          @click="handleRegister"
        >
          {{ isLoading ? '注册中...' : '注册' }}
        </button>
      </view>

      <view class="divider">
        <view class="divider-line"></view>
        <text class="divider-text">或</text>
        <view class="divider-line"></view>
      </view>

      <view class="login-link">
        <text>已有账号？</text>
        <text class="login-btn-text" @click="handleLogin">立即登录</text>
      </view>
    </view>

    <!-- Toast提示 -->
    <view class="toast" :class="{ 'show': showToast }">
      <text>{{ toastMessage }}</text>
    </view>
  </view>
</template>

<script>
import { speak } from '../../services/voice.js'

export default {
  data() {
    return {
      formData: {
        username: '',
        password: '',
        confirmPassword: '',
        phone: ''
      },
      placeholderTexts: {
        username: '请输入账号',
        password: '请输入密码（至少6位）',
        confirmPassword: '请再次输入密码',
        phone: '请输入手机号（选填）'
      },
      showPassword: false,
      showConfirmPassword: false,
      usernameFocused: false,
      passwordFocused: false,
      confirmPasswordFocused: false,
      phoneFocused: false,
      invalidField: '',
      isLoading: false,
      showToast: false,
      toastMessage: '',
      showContainer: false,
      feedbackActive: false
    }
  },
  onLoad() {
    // 触发动画
    setTimeout(() => {
      this.showContainer = true
    }, 100)
  },
  methods: {
    onFieldFocus(field) {
      if (field === 'username') this.usernameFocused = true
      if (field === 'password') this.passwordFocused = true
      if (field === 'confirm') this.confirmPasswordFocused = true
      if (field === 'phone') this.phoneFocused = true
      const hints = {
        username: '账号输入框已聚焦，请输入注册账号',
        password: '密码输入框已聚焦，请输入至少六位密码',
    getDynamicPlaceholder(field) {
      const base = this.placeholderTexts?.[field] || ''
      const value = this.formData?.[field]
      return value ? '' : base
    },
    getPlaceholderStyle(field) {
      const value = this.formData?.[field]
      return value ? 'color: transparent;' : 'color: #b0b8c3;'
        confirm: '确认密码输入框已聚焦，请再次输入密码',
        phone: '手机号输入框已聚焦，可选填'
      }
      speak(hints[field] || '输入区域已激活')
    },
    onFieldBlur(field) {
      if (field === 'username') this.usernameFocused = false
      if (field === 'password') this.passwordFocused = false
      if (field === 'confirm') this.confirmPasswordFocused = false
      if (field === 'phone') this.phoneFocused = false
    },
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
    handleLogin() {
      speak('即将返回登录页面')
      uni.navigateBack()
    },
    async handleRegister() {
      speak('注册按钮已按下，正在检查表单')
      // 表单验证
      if (!this.formData.username.trim()) {
        this.triggerValidationFeedback('请输入账号', 'username')
        return
      }

      if (this.formData.username.trim().length < 3) {
        this.triggerValidationFeedback('账号至少需要3个字符', 'username')
        return
      }

      if (!this.formData.password) {
        this.triggerValidationFeedback('请输入密码', 'password')
        return
      }

      if (this.formData.password.length < 6) {
        this.triggerValidationFeedback('密码至少需要6位', 'password')
        return
      }

      if (this.formData.password !== this.formData.confirmPassword) {
        this.triggerValidationFeedback('两次输入的密码不一致', 'confirm')
        return
      }

      // 手机号验证（如果填写了）
      if (this.formData.phone && !/^1[3-9]\d{9}$/.test(this.formData.phone)) {
        this.triggerValidationFeedback('请输入正确的手机号', 'phone')
        return
      }

      // 设置加载状态
      this.isLoading = true

      try {
        speak('正在为您创建账号，请稍候')
        // 这里替换为实际的注册API调用
        // const res = await uni.request({
        //   url: 'https://your-api.com/register',
        //   method: 'POST',
        //   data: {
        //     username: this.formData.username,
        //     password: this.formData.password,
        //     phone: this.formData.phone
        //   }
        // })

        // 模拟注册请求
        await new Promise(resolve => setTimeout(resolve, 1500))

        this.showToastMessage('注册成功！', { voice: true })

        // 延迟跳转到登录页，并传递账号信息
        setTimeout(() => {
          uni.navigateBack({
            success: () => {
              // 通过事件总线或全局状态传递账号信息
              // 这里使用getApp()来设置全局数据
              const app = getApp()
              if (app) {
                app.globalData = app.globalData || {}
                app.globalData.registeredUsername = this.formData.username
              }
            }
          })
        }, 1500)
      } catch (error) {
        console.error('注册失败:', error)
        this.triggerValidationFeedback(error.message || '注册失败，请重试')
      } finally {
        this.isLoading = false
      }
    },
    triggerValidationFeedback(message, field) {
      if (field) {
        this.invalidField = field
        setTimeout(() => {
          this.invalidField = ''
        }, 1200)
      }
      this.feedbackActive = true
      setTimeout(() => {
        this.feedbackActive = false
      }, 400)
      try {
        uni.vibrateShort && uni.vibrateShort({})
      } catch (err) {
        console.info('vibrate not supported', err)
      }
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
.register-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, #8f6bff55, transparent 55%), linear-gradient(135deg, #5b71ff 0%, #8f6bff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60rpx 40rpx;
  position: relative;
}

.register-container {
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

.register-btn {
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

.register-btn:active:not(:disabled) {
  transform: scale(0.98);
  box-shadow: 0 6rpx 20rpx rgba(91, 113, 255, 0.28);
}

.register-btn:disabled {
  opacity: 0.6;
}

.register-container.error-shake {
  animation: shake 0.4s ease;
}

@keyframes shake {
  0% {
    transform: translateX(0);
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

.login-link {
  text-align: center;
  font-size: 32rpx;
  color: #5c6673;
}

.login-btn-text {
  color: #5b71ff;
  font-weight: 600;
  margin-left: 16rpx;
}

.login-btn-text:active {
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


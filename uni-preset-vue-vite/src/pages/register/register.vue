<template>
  <view class="register-page">
    <view class="register-container" :class="{ 'slide-up': showContainer }">
      <view class="logo-area">
        <view class="logo">R</view>
        <text class="title">创建账号</text>
        <text class="subtitle">请填写以下信息完成注册</text>
      </view>

      <view class="form-container">
        <view class="form-group">
          <view class="input-wrapper" :class="{ 'focused': usernameFocused }">
            <text class="input-icon">👤</text>
            <input
              v-model="formData.username"
              type="text"
              class="form-input"
              placeholder="请输入账号"
              @focus="usernameFocused = true"
              @blur="usernameFocused = false"
            />
          </view>
        </view>

        <view class="form-group">
          <view class="input-wrapper" :class="{ 'focused': passwordFocused }">
            <text class="input-icon">🔒</text>
            <input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="请输入密码（至少6位）"
              @focus="passwordFocused = true"
              @blur="passwordFocused = false"
            />
            <view class="password-toggle" @click="togglePassword">
              <text>{{ showPassword ? '🙈' : '👁️' }}</text>
            </view>
          </view>
        </view>

        <view class="form-group">
          <view class="input-wrapper" :class="{ 'focused': confirmPasswordFocused }">
            <text class="input-icon">🔒</text>
            <input
              v-model="formData.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="请再次输入密码"
              @focus="confirmPasswordFocused = true"
              @blur="confirmPasswordFocused = false"
            />
            <view class="password-toggle" @click="toggleConfirmPassword">
              <text>{{ showConfirmPassword ? '🙈' : '👁️' }}</text>
            </view>
          </view>
        </view>

        <view class="form-group">
          <view class="input-wrapper" :class="{ 'focused': phoneFocused }">
            <text class="input-icon">📱</text>
            <input
              v-model="formData.phone"
              type="number"
              class="form-input"
              placeholder="请输入手机号（选填）"
              @focus="phoneFocused = true"
              @blur="phoneFocused = false"
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
export default {
  data() {
    return {
      formData: {
        username: '',
        password: '',
        confirmPassword: '',
        phone: ''
      },
      showPassword: false,
      showConfirmPassword: false,
      usernameFocused: false,
      passwordFocused: false,
      confirmPasswordFocused: false,
      phoneFocused: false,
      isLoading: false,
      showToast: false,
      toastMessage: '',
      showContainer: false
    }
  },
  onLoad() {
    // 触发动画
    setTimeout(() => {
      this.showContainer = true
    }, 100)
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
    handleLogin() {
      uni.navigateBack()
    },
    async handleRegister() {
      // 表单验证
      if (!this.formData.username.trim()) {
        this.showToastMessage('请输入账号')
        return
      }

      if (this.formData.username.trim().length < 3) {
        this.showToastMessage('账号至少需要3个字符')
        return
      }

      if (!this.formData.password) {
        this.showToastMessage('请输入密码')
        return
      }

      if (this.formData.password.length < 6) {
        this.showToastMessage('密码至少需要6位')
        return
      }

      if (this.formData.password !== this.formData.confirmPassword) {
        this.showToastMessage('两次输入的密码不一致')
        return
      }

      // 手机号验证（如果填写了）
      if (this.formData.phone && !/^1[3-9]\d{9}$/.test(this.formData.phone)) {
        this.showToastMessage('请输入正确的手机号')
        return
      }

      // 设置加载状态
      this.isLoading = true

      try {
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

        this.showToastMessage('注册成功！')

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
        this.showToastMessage(error.message || '注册失败，请重试')
      } finally {
        this.isLoading = false
      }
    },
    showToastMessage(message) {
      this.toastMessage = message
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx;
  position: relative;
}

.register-container {
  width: 100%;
  max-width: 750rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 48rpx;
  padding: 80rpx 60rpx;
  box-shadow: 0 40rpx 120rpx rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20rpx);
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
  margin-bottom: 80rpx;
}

.logo {
  width: 160rpx;
  height: 160rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 40rpx;
  margin: 0 auto 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 72rpx;
  font-weight: bold;
  box-shadow: 0 16rpx 40rpx rgba(102, 126, 234, 0.4);
}

.title {
  display: block;
  font-size: 56rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.subtitle {
  display: block;
  font-size: 28rpx;
  color: #999;
}

.form-container {
  width: 100%;
}

.form-group {
  margin-bottom: 48rpx;
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
  left: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 40rpx;
  z-index: 1;
}

.form-input {
  width: 100%;
  height: 104rpx;
  padding: 0 32rpx 0 96rpx;
  border: 4rpx solid #e0e0e0;
  border-radius: 24rpx;
  font-size: 32rpx;
  background: #f8f9fa;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-wrapper.focused .form-input {
  border-color: #667eea;
  background: #fff;
  box-shadow: 0 0 0 8rpx rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #bbb;
}

.password-toggle {
  position: absolute;
  right: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  font-size: 40rpx;
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
  height: 104rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 24rpx;
  color: white;
  font-size: 36rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 8rpx 30rpx rgba(102, 126, 234, 0.4);
  margin-bottom: 48rpx;
}

.register-btn:active:not(:disabled) {
  transform: scale(0.98);
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
}

.register-btn:disabled {
  opacity: 0.6;
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
  color: #999;
  font-size: 28rpx;
}

.login-link {
  text-align: center;
  font-size: 28rpx;
  color: #666;
}

.login-btn-text {
  color: #667eea;
  font-weight: 600;
  margin-left: 16rpx;
}

.login-btn-text:active {
  color: #764ba2;
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
  font-size: 28rpx;
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


<template>
  <view class="login-page">
    <view class="login-container" :class="{ 'slide-up': showContainer }">
      <view class="logo-area">
        <view class="logo">L</view>
        <text class="title">欢迎回来</text>
        <text class="subtitle">请输入您的账号和密码</text>
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
              placeholder="请输入密码"
              @focus="passwordFocused = true"
              @blur="passwordFocused = false"
            />
            <view class="password-toggle" @click="togglePassword">
              <text>{{ showPassword ? '🙈' : '👁️' }}</text>
            </view>
          </view>
        </view>

        <view class="remember-me" @click="toggleRemember">
          <checkbox-group @change="handleRememberChange">
            <checkbox :checked="formData.remember" color="#667eea" />
          </checkbox-group>
          <text class="remember-text">记住我</text>
        </view>

        <button
          class="login-btn"
          :class="{ 'loading': isLoading }"
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
        remember: false
      },
      showPassword: false,
      usernameFocused: false,
      passwordFocused: false,
      isLoading: false,
      showToast: false,
      toastMessage: '',
      showContainer: false
    }
  },
  onLoad() {
    // 检查是否有记住的账号
    const savedUsername = uni.getStorageSync('savedUsername')
    if (savedUsername) {
      this.formData.username = savedUsername
      this.formData.remember = true
    }
    
    // 检查是否有注册传递过来的账号
    const app = getApp()
    if (app && app.globalData && app.globalData.registeredUsername) {
      this.formData.username = app.globalData.registeredUsername
      // 清除临时数据
      app.globalData.registeredUsername = null
    }
    
    // 触发动画
    setTimeout(() => {
      this.showContainer = true
    }, 100)
  },
  methods: {
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
      // 表单验证
      if (!this.formData.username.trim()) {
        this.showToastMessage('请输入账号')
        return
      }
      if (!this.formData.password) {
        this.showToastMessage('请输入密码')
        return
      }

      // 设置加载状态
      this.isLoading = true

      try {
        // 这里替换为实际的登录API调用
        // const res = await uni.request({
        //   url: 'https://your-api.com/login',
        //   method: 'POST',
        //   data: {
        //     username: this.formData.username,
        //     password: this.formData.password
        //   }
        // })

        // 模拟登录请求
        await new Promise(resolve => setTimeout(resolve, 1500))

        // 如果记住我，保存账号
        if (this.formData.remember) {
          uni.setStorageSync('savedUsername', this.formData.username)
        } else {
          uni.removeStorageSync('savedUsername')
        }

        // 保存登录状态（实际应该保存token）
        uni.setStorageSync('isLoggedIn', true)
        uni.setStorageSync('userInfo', {
          username: this.formData.username
        })

        this.showToastMessage('登录成功！')

        // 延迟跳转
        setTimeout(() => {
          // 跳转到首页
          // 如果首页在tabBar中，使用switchTab
          // uni.switchTab({
          //   url: '/pages/index/index'
          // })
          // 否则使用redirectTo或reLaunch
          uni.switchTab({
            url: '/pages/course/index'
          })
        }, 1500)
      } catch (error) {
        console.error('登录失败:', error)
        this.showToastMessage('登录失败，请重试')
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
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx;
  position: relative;
}

.login-container {
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

.remember-me {
  display: flex;
  align-items: center;
  margin-bottom: 64rpx;
  font-size: 28rpx;
  color: #666;
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

.login-btn:active:not(:disabled) {
  transform: scale(0.98);
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
}

.login-btn:disabled {
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

.register-link {
  text-align: center;
  font-size: 28rpx;
  color: #666;
}

.register-btn {
  color: #667eea;
  font-weight: 600;
  margin-left: 16rpx;
}

.register-btn:active {
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


<template>
  <view class="page">
    <!-- 状态栏 -->
    <view class="status-bar">
      <text>9:41</text>
      <text>📶 🔋</text>
    </view>

    <!-- 用户信息区 -->
    <view class="user-section">
      <view class="user-card">
        <view class="user-avatar">👴</view>
        <view class="user-info">
          <text class="user-name">{{ userInfo.name }}</text>
          <text class="user-desc">{{ userInfo.desc }}</text>
        </view>
        <view class="edit-btn" @tap="editProfile">
          <text>编辑</text>
        </view>
      </view>
      
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-num">{{ userStats.courses }}</text>
          <text class="stat-label">已学课程</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ userStats.orders }}</text>
          <text class="stat-label">订单数量</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ userStats.posts }}</text>
          <text class="stat-label">发布帖子</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ userStats.followers }}</text>
          <text class="stat-label">关注我的</text>
        </view>
      </view>
    </view>

    <!-- 学习进度 -->
    <view class="section">
      <view class="sec-head">
        <text class="sec-title">学习进度</text>
        <text class="more" @tap="viewAllCourses">查看全部</text>
      </view>
      <view class="progress-list">
        <view v-for="course in learningProgress" :key="course.id" class="progress-card animate" @tap="() => continueCourse(course)">
          <view class="progress-thumb" :style="course.thumbStyle">
            <text class="progress-icon">{{ course.icon }}</text>
          </view>
          <view class="progress-body">
            <text class="progress-title">{{ course.title }}</text>
            <view class="progress-bar">
              <view class="progress-fill" :style="`width: ${course.progress}%`"></view>
            </view>
            <text class="progress-text">已完成 {{ course.progress }}%</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="section">
      <view class="sec-head">
        <text class="sec-title">我的服务</text>
      </view>
      <view class="menu-list">
        <view v-for="menu in menuList" :key="menu.id" class="menu-item" @tap="() => openMenu(menu)">
          <view class="menu-icon" :style="menu.iconStyle">
            <text>{{ menu.icon }}</text>
          </view>
          <view class="menu-content">
            <text class="menu-title">{{ menu.title }}</text>
            <text class="menu-desc">{{ menu.desc }}</text>
          </view>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 无障碍助手 -->
    <view class="section">
      <view class="sec-head accessible-head">
        <view>
          <text class="sec-title">无障碍助手</text>
          <text class="sec-sub">语音播报与触觉反馈</text>
        </view>
        <view v-if="accessibilityHint" class="accessibility-hint">
          <text>{{ accessibilityHint }}</text>
        </view>
      </view>
      <view class="accessibility-grid">
        <view class="accessibility-card" :class="{ active: voiceEnabled }" @tap="() => toggleAccessibility('voice')">
          <view class="card-icon">🔊</view>
          <view class="card-content">
            <text class="card-title">语音播报</text>
            <text class="card-desc">{{ voiceEnabled ? '学习与操作实时语音提示' : '轻点开启语音提示' }}</text>
          </view>
          <view class="card-status">{{ voiceEnabled ? '已开启' : '已关闭' }}</view>
        </view>
        <view class="accessibility-card" :class="{ active: hapticEnabled }" @tap="() => toggleAccessibility('haptic')">
          <view class="card-icon">🤲</view>
          <view class="card-content">
            <text class="card-title">触觉反馈</text>
            <text class="card-desc">{{ hapticEnabled ? '页面操作同步轻震提示' : '轻点开启触感提示' }}</text>
          </view>
          <view class="card-status">{{ hapticEnabled ? '已开启' : '已关闭' }}</view>
        </view>
      </view>
    </view>

    <!-- 设置选项 -->
    <view class="section">
      <view class="sec-head">
        <text class="sec-title">设置</text>
      </view>
      <view class="setting-list">
        <view v-for="setting in settingList" :key="setting.id" class="setting-item" @tap="() => openSetting(setting)">
          <view class="setting-left">
            <text class="setting-icon">{{ setting.icon }}</text>
            <text class="setting-title">{{ setting.title }}</text>
          </view>
          <view class="setting-right">
            <text v-if="setting.value" class="setting-value">{{ setting.value }}</text>
            <text class="setting-arrow">›</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="section">
      <view class="logout-btn" @tap="logout">
        <text>退出登录</text>
      </view>
    </view>

    <view class="spacer" />
  </view>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue'
import {
  getHapticPreference,
  getVoicePreference,
  onHapticPreferenceChange,
  onVoicePreferenceChange,
  speak,
  toggleHapticPreference,
  toggleVoicePreference,
  vibrateShort
} from '../../services/voice.js'

const userInfo = ref({
  name: '张大爷',
  desc: '学习让生活更精彩'
})

const userStats = ref({
  courses: 12,
  orders: 8,
  posts: 5,
  followers: 23
})

const learningProgress = ref([
  {
    id: 'lp1',
    title: '智能手机入门教程',
    progress: 75,
    icon: '📱',
    thumbStyle: 'background: linear-gradient(45deg, #667eea, #764ba2)'
  },
  {
    id: 'lp2',
    title: '微信使用技巧',
    progress: 45,
    icon: '💬',
    thumbStyle: 'background: linear-gradient(45deg, #4ecdc4, #44a08d)'
  },
  {
    id: 'lp3',
    title: '健康养生指南',
    progress: 90,
    icon: '❤️',
    thumbStyle: 'background: linear-gradient(45deg, #ff6b6b, #ffa726)'
  }
])

const menuList = ref([
  {
    id: 'm1',
    title: '我的订单',
    desc: '查看购买记录',
    icon: '📦',
    iconStyle: 'background: linear-gradient(45deg, #667eea, #764ba2)',
    route: '/pages/profile/orders'
  },
  {
    id: 'm2',
    title: '收藏夹',
    desc: '我收藏的内容',
    icon: '⭐',
    iconStyle: 'background: linear-gradient(45deg, #ffa726, #ff9800)',
    route: '/pages/profile/favorites'
  },
  {
    id: 'm3',
    title: '学习记录',
    desc: '查看学习历史',
    icon: '📚',
    iconStyle: 'background: linear-gradient(45deg, #4ecdc4, #44a08d)',
    route: '/pages/profile/records'
  },
  {
    id: 'm4',
    title: '我的发布',
    desc: '管理发布内容',
    icon: '✍️',
    iconStyle: 'background: linear-gradient(45deg, #ff6b6b, #e91e63)',
    route: '/pages/profile/posts'
  },
  {
    id: 'm5',
    title: '客服帮助',
    desc: '联系客服支持',
    icon: '🎧',
    iconStyle: 'background: linear-gradient(45deg, #9c27b0, #673ab7)',
    route: '/pages/profile/support'
  }
])

const voiceEnabled = ref(getVoicePreference())
const hapticEnabled = ref(getHapticPreference())
const accessibilityHint = ref('')
let accessibilityTimer = null

const stopVoiceListener = onVoicePreferenceChange((enabled) => {
  voiceEnabled.value = enabled
})

const stopHapticListener = onHapticPreferenceChange((enabled) => {
  hapticEnabled.value = enabled
})

function setAccessibilityHint(message) {
  accessibilityHint.value = message
  if (accessibilityTimer) {
    clearTimeout(accessibilityTimer)
  }
  accessibilityTimer = setTimeout(() => {
    accessibilityHint.value = ''
  }, 2600)
}

const settingList = computed(() => [
  {
    id: 'font-size',
    title: '字体大小',
    icon: '🔤',
    value: '大'
  },
  {
    id: 'dark-mode',
    title: '夜间模式',
    icon: '🌙',
    value: '关闭'
  },
  {
    id: 'notifications',
    title: '消息通知',
    icon: '🔔',
    value: '开启'
  },
  {
    id: 'privacy',
    title: '隐私设置',
    icon: '🔒'
  },
  {
    id: 'about',
    title: '关于我们',
    icon: 'ℹ️'
  }
])

function editProfile() {
  uni.navigateTo({ url: '/pages/profile/edit' })
}

function viewAllCourses() {
  // 跳转到课程的“全部”页面，并带上用户相关的 section 标记
  uni.navigateTo({ url: '/pages/course/all?section=my' })
}

function continueCourse(course) {
  uni.showToast({ title: `继续学习：${course.title}`, icon: 'none' })
}

function openMenu(menu) {
  if (menu.route) {
    uni.navigateTo({ url: menu.route })
    return
  }
  uni.showToast({ title: `打开：${menu.title}`, icon: 'none' })
}

function openSetting(setting) {
  uni.showToast({ title: `设置：${setting.title}`, icon: 'none' })
}

function toggleAccessibility(feature) {
  if (feature === 'voice') {
    const willEnable = !voiceEnabled.value
    const message = `语音播报已${willEnable ? '开启' : '关闭'}`
    if (!willEnable) {
      speak(message)
    }
    const nextState = toggleVoicePreference()
    voiceEnabled.value = nextState
    setAccessibilityHint(message)
    if (nextState) {
      speak(message)
    }
    uni.showToast({ title: message, icon: 'none' })
    vibrateShort({ style: 'light' })
    return
  }

  if (feature === 'haptic') {
    if (hapticEnabled.value) {
      vibrateShort({ style: 'heavy' })
    }
    const nextState = toggleHapticPreference()
    hapticEnabled.value = nextState
    const message = `触觉反馈已${nextState ? '开启' : '关闭'}`
    setAccessibilityHint(message)
    if (voiceEnabled.value) {
      speak(message)
    }
    uni.showToast({ title: message, icon: 'none' })
    if (nextState) {
      vibrateShort({ style: 'light' })
    }
  }
}

function logout() {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('isLoggedIn')
        uni.removeStorageSync('userInfo')
        uni.reLaunch({ url: '/pages/login/login' })
      }
    }
  })
}

onUnmounted(() => {
  stopVoiceListener?.()
  stopHapticListener?.()
  if (accessibilityTimer) {
    clearTimeout(accessibilityTimer)
  }
})
</script>

<style scoped>
.page {
  background: linear-gradient(180deg, #f7f9fc 0%, #f0f2f7 100%);
  min-height: 100vh;
  color: #1c2333;
  font-size: 36rpx;
  line-height: 1.7;
}

/* 状态栏 */
.status-bar {
  height: 96rpx;
  background: linear-gradient(135deg, #5b71ff 0%, #7a6bff 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48rpx;
  font-weight: 600;
  font-size: 34rpx;
}

/* 用户信息区 */
.user-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32rpx 28rpx 48rpx;
}
.user-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 32rpx;
}
.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(255,255,255,.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}
.user-info {
  flex: 1;
  color: #fff;
}
.user-name {
  font-size: 40rpx;
  font-weight: 700;
  margin-bottom: 8rpx;
  display: block;
}
.user-desc {
  font-size: 28rpx;
  opacity: .8;
}
.edit-btn {
  background: rgba(255,255,255,.2);
  color: #fff;
  padding: 16rpx 32rpx;
  border-radius: 999rpx;
  font-size: 28rpx;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

.stats-row {
  display: flex;
  justify-content: space-around;
  background: rgba(255,255,255,.1);
  border-radius: 24rpx;
  padding: 32rpx 16rpx;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}
.stat-item {
  text-align: center;
  color: #fff;
}
.stat-num {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  margin-bottom: 8rpx;
}
.stat-label {
  font-size: 24rpx;
  opacity: .8;
}

/* 区块 */
.section {
  padding: 36rpx 32rpx;
}
.sec-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}
.sec-title {
  font-size: 36rpx;
  font-weight: 700;
}
.sec-sub {
  display: block;
  font-size: 26rpx;
  color: #6d7391;
  margin-top: 6rpx;
}
.accessible-head {
  align-items: flex-start;
}
.accessibility-hint {
  background: rgba(102, 126, 234, 0.12);
  color: #4c5bd4;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
}
.accessibility-grid {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.accessibility-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  background: #fff;
  padding: 28rpx;
  border-radius: 28rpx;
  border: 2rpx solid transparent;
  transition: all 0.2s ease;
}
.accessibility-card.active {
  border-color: #737dff;
  box-shadow: 0 10rpx 36rpx rgba(115, 125, 255, 0.2);
}
.card-icon {
  width: 84rpx;
  height: 84rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #6f8bff, #8ab2ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  color: #fff;
}
.accessibility-card.active .card-icon {
  background: linear-gradient(135deg, #5b71ff, #7a6bff);
}
.card-content {
  flex: 1;
}
.card-title {
  font-size: 32rpx;
  font-weight: 700;
  display: block;
}
.card-desc {
  font-size: 26rpx;
  color: #6d7391;
}
.card-status {
  font-size: 28rpx;
  color: #5b71ff;
  font-weight: 600;
}
.more {
  color: #667eea;
  font-size: 28rpx;
}

/* 学习进度 */
.progress-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.progress-card {
  display: flex;
  gap: 20rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,.06);
}
.progress-thumb {
  width: 100rpx;
  height: 100rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  flex-shrink: 0;
}
.progress-body {
  flex: 1;
}
.progress-title {
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
}
.progress-bar {
  width: 100%;
  height: 12rpx;
  background: #f0f1f3;
  border-radius: 6rpx;
  overflow: hidden;
  margin-bottom: 8rpx;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 6rpx;
  transition: width .3s;
}
.progress-text {
  font-size: 26rpx;
  color: #7b8794;
}

/* 菜单列表 */
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 10rpx 30rpx rgba(92, 109, 143, .1);
}
.menu-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  flex-shrink: 0;
}
.menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}
.menu-title {
  font-size: 38rpx;
  font-weight: 600;
  margin-bottom: 4rpx;
}
.menu-desc {
  font-size: 30rpx;
  color: #5c6673;
  line-height: 1.5;
}
.menu-arrow {
  color: #9aa3b1;
  font-size: 40rpx;
  font-weight: 300;
}

/* 设置列表 */
.setting-list {
  background: #fff;
  border-radius: 28rpx;
  overflow: hidden;
  box-shadow: 0 12rpx 28rpx rgba(92, 109, 143, .08);
}
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 36rpx 32rpx;
  border-bottom: 2rpx solid #f0f1f3;
}
.setting-item:last-child {
  border-bottom: none;
}
.setting-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.setting-icon {
  font-size: 32rpx;
}
.setting-title {
  font-size: 36rpx;
}
.setting-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.setting-value {
  color: #5c6673;
  font-size: 32rpx;
}
.setting-arrow {
  color: #c4c6cc;
  font-size: 32rpx;
  font-weight: 300;
}

/* 退出登录 */
.logout-btn {
  background: #fff;
  border: 2rpx solid #ff6b6b;
  color: #ff6b6b;
  text-align: center;
  padding: 32rpx;
  border-radius: 24rpx;
  font-size: 32rpx;
  font-weight: 600;
  margin-top: 32rpx;
}

/* 动效 */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(32rpx) }
  to { opacity: 1; transform: translateY(0) }
}
.animate {
  animation: fadeUp .5s ease-out;
}

.spacer {
  height: 80rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>

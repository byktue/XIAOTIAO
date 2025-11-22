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
          <text class="menu-title">{{ menu.title }}</text>
          <text class="menu-desc">{{ menu.desc }}</text>
          <text class="menu-arrow">›</text>
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
import { ref } from 'vue'

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
    iconStyle: 'background: linear-gradient(45deg, #667eea, #764ba2)'
  },
  {
    id: 'm2',
    title: '收藏夹',
    desc: '我收藏的内容',
    icon: '⭐',
    iconStyle: 'background: linear-gradient(45deg, #ffa726, #ff9800)'
  },
  {
    id: 'm3',
    title: '学习记录',
    desc: '查看学习历史',
    icon: '📚',
    iconStyle: 'background: linear-gradient(45deg, #4ecdc4, #44a08d)'
  },
  {
    id: 'm4',
    title: '我的发布',
    desc: '管理发布内容',
    icon: '✍️',
    iconStyle: 'background: linear-gradient(45deg, #ff6b6b, #e91e63)'
  },
  {
    id: 'm5',
    title: '客服帮助',
    desc: '联系客服支持',
    icon: '🎧',
    iconStyle: 'background: linear-gradient(45deg, #9c27b0, #673ab7)'
  }
])

const settingList = ref([
  {
    id: 's1',
    title: '字体大小',
    icon: '🔤',
    value: '大'
  },
  {
    id: 's2',
    title: '语音播报',
    icon: '🔊',
    value: '开启'
  },
  {
    id: 's3',
    title: '夜间模式',
    icon: '🌙',
    value: '关闭'
  },
  {
    id: 's4',
    title: '消息通知',
    icon: '🔔',
    value: '开启'
  },
  {
    id: 's5',
    title: '隐私设置',
    icon: '🔒'
  },
  {
    id: 's6',
    title: '关于我们',
    icon: 'ℹ️'
  }
])

function editProfile() {
  uni.showToast({ title: '编辑个人信息', icon: 'none' })
}

function viewAllCourses() {
  uni.switchTab({ url: '/pages/course/index' })
}

function continueCourse(course) {
  uni.showToast({ title: `继续学习：${course.title}`, icon: 'none' })
}

function openMenu(menu) {
  uni.showToast({ title: `打开：${menu.title}`, icon: 'none' })
}

function openSetting(setting) {
  uni.showToast({ title: `设置：${setting.title}`, icon: 'none' })
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
</script>

<style scoped>
.page {
  background: #f8f9fa;
  min-height: 100vh;
  color: #1d2129;
  font-size: 36rpx;
  line-height: 1.6;
}

/* 状态栏 */
.status-bar {
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 36rpx;
  font-weight: 600;
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
  backdrop-filter: blur(8px);
}

.stats-row {
  display: flex;
  justify-content: space-around;
  background: rgba(255,255,255,.1);
  border-radius: 24rpx;
  padding: 32rpx 16rpx;
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
  padding: 32rpx 28rpx;
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
  font-size: 32rpx;
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
  gap: 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,.04);
}
.menu-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  flex-shrink: 0;
}
.menu-title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 4rpx;
  flex: 1;
}
.menu-desc {
  font-size: 26rpx;
  color: #7b8794;
  position: absolute;
  margin-top: 36rpx;
  margin-left: 100rpx;
}
.menu-arrow {
  color: #c4c6cc;
  font-size: 32rpx;
  font-weight: 300;
}

/* 设置列表 */
.setting-list {
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,.04);
}
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 24rpx;
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
  font-size: 32rpx;
}
.setting-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.setting-value {
  color: #7b8794;
  font-size: 28rpx;
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

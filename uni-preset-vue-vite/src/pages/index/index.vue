<template>
  <view class="page">
    <!-- 状态栏 -->
    <view class="status-bar">
      <text>9:41</text>
      <text>📶 🔋</text>
    </view>

    <!-- 英雄区 -->
    <view class="hero">
      <view class="hero-content">
        <text class="hero-title">智慧生活</text>
        <text class="hero-sub">老年人专属的智能服务平台</text>
        <view class="hero-stats">
          <view class="stat-item">
            <text class="stat-num">1000+</text>
            <text class="stat-label">精选课程</text>
          </view>
          <view class="stat-item">
            <text class="stat-num">500+</text>
            <text class="stat-label">优质商品</text>
          </view>
          <view class="stat-item">
            <text class="stat-num">10万+</text>
            <text class="stat-label">活跃用户</text>
          </view>
        </view>
        <view class="hero-assist">
          <view class="assist-pill" @tap="() => readHeroSummary(false)">
            <text>🔊 听一听今日亮点</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="helperHint" class="assist-hint">
      <text>{{ helperHint }}</text>
    </view>

    <!-- 快捷入口 -->
    <view class="section">
      <view class="sec-head">
        <text class="sec-title">快捷服务</text>
      </view>
      <view class="quick-grid">
        <view class="quick-item" @tap="goToCourse">
          <view class="quick-icon">📚</view>
          <text class="quick-text">学习课程</text>
        </view>
        <view class="quick-item" @tap="goToShop">
          <view class="quick-icon">🛒</view>
          <text class="quick-text">智能购物</text>
        </view>
        <view class="quick-item" @tap="goToCommunity">
          <view class="quick-icon">👥</view>
          <text class="quick-text">社区交流</text>
        </view>
        <view class="quick-item" @tap="goToProfile">
          <view class="quick-icon">👤</view>
          <text class="quick-text">个人中心</text>
        </view>
      </view>
    </view>

    <!-- 今日推荐 -->
    <view class="section">
      <view class="sec-head">
        <text class="sec-title">今日推荐</text>
        <text class="more" @tap="() => openMore('recommend')">查看更多</text>
      </view>
      <view class="recommend-list">
        <view v-for="item in recommendations" :key="item.id" class="recommend-card animate" @tap="() => openRecommend(item)">
          <view class="recommend-thumb" :style="item.thumbStyle">
            <text class="recommend-icon">{{ item.icon }}</text>
          </view>
          <view class="recommend-body">
            <text class="recommend-title">{{ item.title }}</text>
            <text class="recommend-desc">{{ item.desc }}</text>
            <view class="recommend-meta">
              <text class="recommend-type">{{ item.type }}</text>
              <text class="recommend-hot">🔥 {{ item.hot }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 最新动态 -->
    <view class="section">
      <view class="sec-head">
        <text class="sec-title">最新动态</text>
        <text class="more" @tap="() => openMore('news')">查看全部</text>
      </view>
      <view class="news-list">
        <view v-for="news in newsList" :key="news.id" class="news-item animate" @tap="() => openNews(news)">
          <view class="news-dot"></view>
          <view class="news-content">
            <text class="news-title">{{ news.title }}</text>
            <text class="news-time">{{ news.time }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="spacer" />
  </view>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { speak, vibrateShort } from '../../services/voice.js'

const helperHint = ref('')
let hintTimer = null

const recommendations = ref([
  {
    id: 'r1',
    title: '智能手机入门教程',
    desc: '从零开始学会使用智能手机',
    type: '课程推荐',
    hot: '热门',
    icon: '📱',
    thumbStyle: 'background: linear-gradient(45deg, #667eea, #764ba2)'
  },
  {
    id: 'r2',
    title: '智能血压计',
    desc: '家属远程监控，健康有保障',
    type: '商品推荐',
    hot: '新品',
    icon: '🩺',
    thumbStyle: 'background: linear-gradient(45deg, #ff6b6b, #ffa726)'
  },
  {
    id: 'r3',
    title: '健康养生交流',
    desc: '分享养生心得，互相学习',
    type: '社区话题',
    hot: '活跃',
    icon: '❤️',
    thumbStyle: 'background: linear-gradient(45deg, #4ecdc4, #44a08d)'
  }
])

const newsList = ref([
  { id: 'n1', title: '平台新增语音搜索功能，操作更便捷', time: '2小时前' },
  { id: 'n2', title: '本周新课程：《微信支付安全指南》', time: '5小时前' },
  { id: 'n3', title: '社区活动：老年摄影大赛开始报名', time: '1天前' },
  { id: 'n4', title: '商城上新：适老化智能手表限时优惠', time: '2天前' }
])

function setHelperHint(message, duration = 2800) {
  helperHint.value = message
  if (hintTimer) {
    clearTimeout(hintTimer)
  }
  hintTimer = setTimeout(() => {
    helperHint.value = ''
  }, duration)
}

function readHeroSummary(auto = false) {
  const message = `今日为您准备了${recommendations.value.length}条精选内容和${newsList.value.length}条最新动态，向下滑动即可查看更多。`
  setHelperHint(message)
  speak(message)
  if (!auto) {
    vibrateShort({ style: 'light' })
  }
}

function handleNavigation(label, url) {
  const message = `即将前往${label}`
  setHelperHint(message)
  speak(message)
  vibrateShort({ style: 'light' })
  uni.switchTab({ url })
}

function goToCourse() {
  handleNavigation('课程学习页面', '/pages/course/index')
}

function goToShop() {
  handleNavigation('商城页面', '/pages/shop/index')
}

function goToCommunity() {
  handleNavigation('社区交流页面', '/pages/community/index')
}

function goToProfile() {
  handleNavigation('个人中心', '/pages/profile/index')
}

function openRecommend(item) {
  const message = `查看推荐 ${item.title}`
  setHelperHint(message)
  speak(message)
  vibrateShort({ style: 'light' })
  uni.showToast({ title: `查看推荐：${item.title}`, icon: 'none' })
}

function openNews(news) {
  const message = `查看最新动态 ${news.title}`
  setHelperHint(message)
  speak(message)
  vibrateShort({ style: 'light' })
  uni.showToast({ title: `查看动态：${news.title}`, icon: 'none' })
}

function openMore(section) {
  const sectionName = section === 'news' ? '最新动态' : '今日推荐'
  const message = `即将打开${sectionName}更多内容`
  setHelperHint(message)
  speak(message)
  vibrateShort({ style: 'light' })
  uni.showToast({ title: `${sectionName}加载中`, icon: 'none' })
}

onMounted(() => {
  readHeroSummary(true)
})

onUnmounted(() => {
  if (hintTimer) {
    clearTimeout(hintTimer)
  }
})
</script>

<style scoped>
 .page {
  background: linear-gradient(180deg, #f7f9fc 0%, #edf1f7 100%);
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

/* 英雄区 */
.hero {
  background: linear-gradient(135deg, #5b71ff 0%, #8f6bff 100%);
  color: #fff;
  padding: 56rpx 40rpx 60rpx;
  border-bottom-left-radius: 40rpx;
  border-bottom-right-radius: 40rpx;
  box-shadow: 0 18rpx 40rpx rgba(91, 113, 255, .35);
}
.hero-content {
  text-align: center;
}
.hero-title {
  font-size: 64rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
}
.hero-sub {
  opacity: .95;
  font-size: 36rpx;
  margin-bottom: 52rpx;
  display: block;
}
.hero-stats {
  display: flex;
  justify-content: space-between;
  gap: 32rpx;
}
.hero-assist {
  margin-top: 40rpx;
  display: flex;
  justify-content: center;
}
.assist-pill {
  padding: 18rpx 32rpx;
  border-radius: 999rpx;
  background: rgba(255,255,255,.2);
  color: #fff;
  font-size: 30rpx;
  border: 2rpx solid rgba(255,255,255,.4);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  transition: transform .2s;
}
.assist-pill:active {
  transform: scale(.98);
}
.assist-hint {
  margin: 20rpx 34rpx 0;
  padding: 18rpx 28rpx;
  background: #fff;
  border-radius: 28rpx;
  color: #4c5bd4;
  font-size: 30rpx;
  box-shadow: 0 10rpx 28rpx rgba(92, 109, 143, .08);
}
.stat-item {
  flex: 1;
  background: rgba(255,255,255,.15);
  border-radius: 28rpx;
  padding: 24rpx 16rpx;
  text-align: center;
}
.stat-num {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  margin-bottom: 10rpx;
}
.stat-label {
  font-size: 30rpx;
  opacity: .95;
}

/* 区块 */
.section {
  padding: 40rpx 34rpx;
}
.sec-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28rpx;
}
.sec-title {
  font-size: 44rpx;
  font-weight: 700;
}
.more {
  color: #5b71ff;
  font-size: 32rpx;
}

/* 快捷入口 */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28rpx;
}
.quick-item {
  background: #fff;
  border-radius: 28rpx;
  padding: 36rpx 24rpx;
  text-align: center;
  box-shadow: 0 12rpx 32rpx rgba(92, 109, 143, .08);
  transition: transform .2s;
}
.quick-item:active {
  transform: scale(.97);
}
.quick-icon {
  width: 108rpx;
  height: 108rpx;
  background: linear-gradient(135deg, #5b71ff, #8f6bff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  margin: 0 auto 18rpx;
}
.quick-text {
  font-size: 34rpx;
  color: #5c6673;
}

/* 推荐列表 */
.recommend-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.recommend-card {
  display: flex;
  gap: 24rpx;
  background: #fff;
  border-radius: 30rpx;
  padding: 28rpx;
  box-shadow: 0 12rpx 32rpx rgba(92, 109, 143, .08);
}
.recommend-thumb {
  width: 140rpx;
  height: 140rpx;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
  flex-shrink: 0;
}
.recommend-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.recommend-title {
  font-size: 38rpx;
  font-weight: 600;
}
.recommend-desc {
  font-size: 32rpx;
  color: #5c6673;
  line-height: 1.6;
}
.recommend-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.recommend-type {
  background: linear-gradient(135deg, #5b71ff, #8f6bff);
  color: #fff;
  padding: 8rpx 20rpx;
  border-radius: 18rpx;
  font-size: 30rpx;
}
.recommend-hot {
  color: #ff6b6b;
  font-size: 30rpx;
  font-weight: 600;
}

/* 动态列表 */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}
.news-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  background: #fff;
  border-radius: 22rpx;
  padding: 28rpx;
  box-shadow: 0 10rpx 28rpx rgba(92, 109, 143, .08);
}
.news-dot {
  width: 20rpx;
  height: 20rpx;
  background: #5b71ff;
  border-radius: 50%;
  flex-shrink: 0;
}
.news-content {
  flex: 1;
}
.news-title {
  font-size: 36rpx;
  margin-bottom: 10rpx;
  line-height: 1.6;
}
.news-time {
  color: #5c6673;
  font-size: 30rpx;
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

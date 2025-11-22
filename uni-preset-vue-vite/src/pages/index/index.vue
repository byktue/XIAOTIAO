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
      </view>
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
        <text class="more">查看更多</text>
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
        <text class="more">查看全部</text>
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
import { ref } from 'vue'

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

function goToCourse() {
  uni.switchTab({ url: '/pages/course/index' })
}

function goToShop() {
  uni.switchTab({ url: '/pages/shop/index' })
}

function goToCommunity() {
  uni.switchTab({ url: '/pages/community/index' })
}

function goToProfile() {
  uni.switchTab({ url: '/pages/profile/index' })
}

function openRecommend(item) {
  uni.showToast({ title: `查看推荐：${item.title}`, icon: 'none' })
}

function openNews(news) {
  uni.showToast({ title: `查看动态：${news.title}`, icon: 'none' })
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

/* 英雄区 */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 48rpx 36rpx;
}
.hero-content {
  text-align: center;
}
.hero-title {
  font-size: 56rpx;
  font-weight: 700;
  margin-bottom: 16rpx;
}
.hero-sub {
  opacity: .9;
  font-size: 32rpx;
  margin-bottom: 48rpx;
  display: block;
}
.hero-stats {
  display: flex;
  justify-content: space-around;
  gap: 32rpx;
}
.stat-item {
  text-align: center;
}
.stat-num {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  margin-bottom: 8rpx;
}
.stat-label {
  font-size: 26rpx;
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

/* 快捷入口 */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24rpx;
}
.quick-item {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx 16rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,.06);
  transition: transform .2s;
}
.quick-item:active {
  transform: scale(.95);
}
.quick-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin: 0 auto 16rpx;
}
.quick-text {
  font-size: 28rpx;
  color: #5c6670;
}

/* 推荐列表 */
.recommend-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.recommend-card {
  display: flex;
  gap: 20rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,.06);
}
.recommend-thumb {
  width: 120rpx;
  height: 120rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  flex-shrink: 0;
}
.recommend-body {
  flex: 1;
}
.recommend-title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}
.recommend-desc {
  font-size: 28rpx;
  color: #7b8794;
  margin-bottom: 12rpx;
}
.recommend-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.recommend-type {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
}
.recommend-hot {
  color: #ff6b6b;
  font-size: 24rpx;
  font-weight: 600;
}

/* 动态列表 */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.news-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,.04);
}
.news-dot {
  width: 16rpx;
  height: 16rpx;
  background: #667eea;
  border-radius: 50%;
  flex-shrink: 0;
}
.news-content {
  flex: 1;
}
.news-title {
  font-size: 30rpx;
  margin-bottom: 8rpx;
  line-height: 1.5;
}
.news-time {
  color: #7b8794;
  font-size: 24rpx;
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

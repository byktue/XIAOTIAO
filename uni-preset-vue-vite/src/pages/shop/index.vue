<template>
  <view class="page">
    <!-- 状态栏 -->
    <view class="status-bar">
      <text>9:41</text>
      <text>📶 🔋</text>
    </view>

    <!-- 英雄区 -->
    <view class="hero">
      <text class="hero-title">智能购物</text>
      <text class="hero-sub">精选适老产品，让生活更便利</text>
      <view class="search-bar">
        <text>🔍</text>
        <input :value="keyword" placeholder="搜索商品、品牌或功能" @input="onInput" />
      </view>
    </view>

    <!-- 分类导航 -->
    <scroll-view class="categories" scroll-x :show-scrollbar="false">
      <view class="cate-row">
        <view v-for="c in categories" :key="c.key" class="cate" :class="{active: c.key===activeKey}" @tap="() => selectCate(c.key)">{{ c.name }}</view>
      </view>
    </scroll-view>

    <!-- 推荐商品 -->
    <view class="section">
      <view class="sec-head">
        <text class="sec-title">推荐商品</text>
        <text class="more">查看更多</text>
      </view>
      <view class="featured">
        <view v-for="item in filteredFeatured" :key="item.id" class="feat-card animate" @tap="() => openDetail(item)">
          <view class="feat-img"></view>
          <view class="feat-body">
            <text class="feat-title">{{ item.title }}</text>
            <view class="meta">
              <text>⭐ {{ item.rate }}</text>
              <text>🏪 {{ item.shop }}</text>
              <text>📦 {{ item.sales }}已售</text>
            </view>
            <text class="price">¥{{ item.price }}</text>
          </view>
          <view class="cart-btn" @tap.stop="() => addToCart(item)">
            <text>🛒</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 热门商品 -->
    <view class="section">
      <view class="sec-head">
        <text class="sec-title">热门商品</text>
        <text class="more">查看全部</text>
      </view>
      <view class="grid">
        <view v-for="item in filteredProducts" :key="item.id" class="card animate" @tap="() => openDetail(item)">
          <view class="thumb" :style="item.thumbStyle">
            <text class="thumb-ico">{{ item.emoji }}</text>
            <view v-if="item.badge" class="badge">{{ item.badge }}</view>
            <view v-if="item.discount" class="discount-badge">{{ item.discount }}</view>
          </view>
          <view class="body">
            <text class="title">{{ item.title }}</text>
            <text class="desc">{{ item.desc }}</text>
            <view class="price-row">
              <text class="price">¥{{ item.price }}</text>
              <text v-if="item.originalPrice" class="original-price">¥{{ item.originalPrice }}</text>
            </view>
            <view class="info">
              <text>📦 {{ item.sales }}已售</text>
              <view class="cart-btn" @tap.stop="() => addToCart(item)">
                <text>加购物车</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 购物车浮动按钮 -->
    <view class="cart-float" @tap="openCart" v-if="cartCount > 0">
      <text class="cart-icon">🛒</text>
      <view class="cart-count">{{ cartCount }}</view>
    </view>

    <view class="spacer" />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const categories = ref([
  { key: 'all', name: '全部' },
  { key: 'health', name: '健康设备' },
  { key: 'assistant', name: '生活辅助' },
  { key: 'digital', name: '数码产品' },
  { key: 'home', name: '适老家居' },
  { key: 'medicine', name: '医疗用品' },
  { key: 'food', name: '营养保健' }
])

const activeKey = ref('all')
const keyword = ref('')
const cart = ref([])

const featured = ref([
  { id: 'f1', title: '智能血压计（家属远程监控）', shop: '健康之家', rate: '4.9', sales: '2.1万', price: '299', tags: ['health'] },
  { id: 'f2', title: '大屏老人手机（一键求助）', shop: '数码专营', rate: '4.8', sales: '1.5万', price: '399', tags: ['digital'] }
])

const products = ref([
  {
    id: 'p1',
    title: '智能血压计',
    desc: '自动测量，数据上传，家属远程查看',
    price: '299',
    originalPrice: '399',
    sales: '2.1万',
    emoji: '🩺',
    badge: '热销',
    discount: '7.5折',
    tags: ['health'],
    thumbStyle: 'background: linear-gradient(45deg, #ff6b6b, #ffa726)'
  },
  {
    id: 'p2',
    title: '大屏老人手机',
    desc: '大字体显示，一键求助，简易操作',
    price: '399',
    sales: '1.5万',
    emoji: '📱',
    badge: '推荐',
    tags: ['digital'],
    thumbStyle: 'background: linear-gradient(45deg, #667eea, #764ba2)'
  },
  {
    id: 'p3',
    title: '助听器（充电款）',
    desc: '降噪清晰，佩戴舒适，续航持久',
    price: '899',
    originalPrice: '1299',
    sales: '8600',
    emoji: '👂',
    discount: '6.9折',
    tags: ['assistant'],
    thumbStyle: 'background: linear-gradient(45deg, #4ecdc4, #44a08d)'
  },
  {
    id: 'p4',
    title: '防滑扶手（浴室专用）',
    desc: '安全防滑，安装简单，承重力强',
    price: '89',
    sales: '5200',
    emoji: '🚿',
    tags: ['home'],
    thumbStyle: 'background: linear-gradient(45deg, #fd79a8, #fdcb6e)'
  }
])

const filteredFeatured = computed(() => {
  const k = activeKey.value
  const kw = keyword.value.trim()
  return featured.value.filter(i => (k==='all' || i.tags.includes(k)) && (kw==='' || matchKw(i, kw)))
})

const filteredProducts = computed(() => {
  const k = activeKey.value
  const kw = keyword.value.trim()
  return products.value.filter(i => (k==='all' || i.tags.includes(k)) && (kw==='' || matchKw(i, kw)))
})

const cartCount = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.count, 0)
})

function matchKw(item, kw) {
  return item.title.includes(kw) || (item.desc && item.desc.includes(kw)) || (item.shop && item.shop.includes(kw))
}

function selectCate(k) {
  activeKey.value = k
}

function onInput(e) {
  keyword.value = e.detail.value
}

function addToCart(item) {
  const existing = cart.value.find(c => c.id === item.id)
  if (existing) {
    existing.count++
  } else {
    cart.value.push({ ...item, count: 1 })
  }
  uni.showToast({ title: '已加入购物车', icon: 'success' })
}

function openDetail(item) {
  uni.showToast({ title: `查看：${item.title}`, icon: 'none' })
}

function openCart() {
  uni.showToast({ title: `购物车(${cartCount.value})`, icon: 'none' })
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
  padding: 36rpx;
}
.hero-title {
  font-size: 48rpx;
  font-weight: 700;
  margin-bottom: 12rpx;
}
.hero-sub {
  opacity: .9;
  font-size: 30rpx;
  margin-bottom: 24rpx;
  display: block;
}
.search-bar {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: rgba(255,255,255,.2);
  border-radius: 999rpx;
  padding: 20rpx 28rpx;
  backdrop-filter: blur(8px);
}
.search-bar input {
  border: none;
  outline: none;
  flex: 1;
  background: transparent;
  color: #fff;
  font-size: 32rpx;
}

/* 分类导航 */
.categories {
  background: #fff;
  border-bottom: 2rpx solid #e9ecef;
  overflow-x: auto;
}
.cate-row {
  display: flex;
  gap: 20rpx;
  padding: 28rpx 24rpx;
}
.cate {
  flex: 0 0 auto;
  min-width: 176rpx;
  text-align: center;
  background: #f5f6f8;
  color: #5c6670;
  border: 2rpx solid #e9ecef;
  border-radius: 999rpx;
  padding: 20rpx 28rpx;
  font-size: 30rpx;
  cursor: pointer;
  user-select: none;
  transition: .2s all;
}
.cate:active { transform: scale(.95); }
.cate.active {
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
}

/* 区块与卡片 */
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
  text-decoration: none;
}

.featured {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.feat-card {
  display: flex;
  gap: 24rpx;
  background: #fff;
  border: 2rpx solid #f0f1f3;
  border-radius: 28rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,.06);
  position: relative;
}
.feat-img {
  width: 168rpx;
  height: 168rpx;
  border-radius: 20rpx;
  background: linear-gradient(45deg, #667eea, #764ba2);
  flex-shrink: 0;
}
.feat-body { flex: 1; }
.feat-title {
  font-weight: 700;
  margin-bottom: 12rpx;
  font-size: 32rpx;
}
.meta {
  display: flex;
  gap: 20rpx;
  color: #7b8794;
  font-size: 26rpx;
  margin-bottom: 12rpx;
}
.price {
  color: #ff6b6b;
  font-weight: 800;
  font-size: 36rpx;
}

.grid {
  display: grid;
  gap: 24rpx;
}
.card {
  background: #fff;
  border: 2rpx solid #f0f1f3;
  border-radius: 40rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,.12);
  transition: transform .2s, box-shadow .2s;
  cursor: pointer;
}
.card:active {
  transform: scale(.98);
  box-shadow: 0 2rpx 16rpx rgba(0,0,0,.08);
}
.thumb {
  height: 260rpx;
  background: linear-gradient(45deg, #667eea, #764ba2);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 84rpx;
}
.badge {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  font-size: 24rpx;
  font-weight: 700;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  background: rgba(255,255,255,.95);
  color: #667eea;
}
.discount-badge {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  background: #ff6b6b;
  color: #fff;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
  font-weight: 700;
}
.body {
  padding: 28rpx;
}
.title {
  font-size: 32rpx;
  font-weight: 700;
  margin-bottom: 12rpx;
  color: #1d2129;
}
.desc {
  font-size: 28rpx;
  color: #5f6b78;
  margin-bottom: 16rpx;
  line-height: 1.5;
}
.price-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}
.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 26rpx;
}
.info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #7b8794;
  font-size: 26rpx;
}

.cart-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  padding: 12rpx 24rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
  font-weight: 600;
  text-align: center;
  min-width: 120rpx;
}
.feat-card .cart-btn {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  padding: 0;
  min-width: auto;
}

/* 购物车浮动按钮 */
.cart-float {
  position: fixed;
  bottom: 120rpx;
  right: 40rpx;
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
  z-index: 100;
}
.cart-icon {
  color: #fff;
  font-size: 48rpx;
}
.cart-count {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  background: #ff6b6b;
  color: #fff;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 700;
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

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
        <text class="search-icon">🔍</text>
        <input
          :value="keyword"
          placeholder="搜索商品、品牌或功能"
          aria-label="商店搜索输入框"
          title="搜索商品、品牌或功能"
          @input="onInput"
          @focus="onSearchFocus"
          @confirm="onSearchConfirm"
        />
      </view>
    </view>

    <!-- 分类导航 -->
    <scroll-view class="categories" scroll-x :show-scrollbar="false">
      <view class="cate-row">
        <view v-for="c in categories" :key="c.key" class="cate" :class="{active: c.key===activeKey}" @tap="() => selectCate(c.key)">{{ c.name }}</view>
      </view>
    </scroll-view>

    <view v-if="helperHint" class="result-hint" :class="{ alert: filterFeedback }">
      <text>{{ helperHint }}</text>
    </view>

    <!-- 推荐商品 -->
    <view class="section">
      <view class="sec-head">
        <text class="sec-title">推荐商品</text>
        <text class="more" @tap="() => openMore('featured')">查看更多</text>
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
        <text class="more" @tap="() => openMore('hot')">查看全部</text>
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
import { computed, onUnmounted, ref, watch } from 'vue'
import { speak, vibrateShort } from '../../services/voice.js'

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
const helperHint = ref('')
const filterFeedback = ref(false)
let hintTimer = null

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

function setHelperHint(message, { alert = false, voice = false, duration = 2600 } = {}) {
  helperHint.value = message
  filterFeedback.value = alert
  if (voice) {
    speak(message)
  }
  if (hintTimer) {
    clearTimeout(hintTimer)
  }
  hintTimer = setTimeout(() => {
    helperHint.value = ''
    filterFeedback.value = false
  }, duration)
}

function getCategoryName(key) {
  return categories.value.find(c => c.key === key)?.name || '全部'
}

function selectCate(k) {
  if (activeKey.value === k) {
    setHelperHint(`已处于${getCategoryName(k)}分类`, { voice: true })
    vibrateShort({ style: 'light' })
    return
  }
  activeKey.value = k
  setHelperHint(`已切换到${getCategoryName(k)}分类`, { voice: true })
  vibrateShort({ style: 'light' })
}

function onInput(e) {
  keyword.value = e.detail.value
}

function onSearchFocus() {
  setHelperHint('搜索框已激活，可输入商品、品牌或功能', { voice: true })
}

function onSearchConfirm() {
  const kw = keyword.value.trim()
  if (!kw) {
    setHelperHint('请输入要搜索的关键词', { voice: true, alert: true })
    vibrateShort({ style: 'heavy' })
    return
  }
  setHelperHint(`正在搜索 ${kw}`, { voice: true })
  vibrateShort({ style: 'light' })
}

function addToCart(item) {
  const existing = cart.value.find(c => c.id === item.id)
  if (existing) {
    existing.count++
  } else {
    cart.value.push({ ...item, count: 1 })
  }
  const message = `${item.title} 已加入购物车`
  setHelperHint(message, { voice: true })
  vibrateShort({ style: 'heavy' })
  uni.showToast({ title: '已加入购物车', icon: 'success' })
}

function openDetail(item) {
  const message = `查看商品 ${item.title}`
  setHelperHint(message, { voice: true })
  vibrateShort({ style: 'light' })
  uni.showToast({ title: `查看：${item.title}`, icon: 'none' })
}

function openCart() {
  const message = `购物车共有 ${cartCount.value} 件商品`
  setHelperHint(message, { voice: true })
  vibrateShort({ style: 'light' })
  uni.showToast({ title: `购物车(${cartCount.value})`, icon: 'none' })
}

function openMore(section) {
  // 跳转到商品列表页（全量列表）
  uni.navigateTo({ url: `/pages/shop/all?section=${section}` })
}

watch([filteredFeatured, filteredProducts, activeKey, keyword], () => {
  const hasFilter = activeKey.value !== 'all' || !!keyword.value.trim()
  if (!hasFilter) {
    return
  }
  const total = filteredFeatured.value.length + filteredProducts.value.length
  if (total === 0) {
    setHelperHint('没有找到相关商品，试试其他关键词或分类', { voice: true, alert: true, duration: 3200 })
    vibrateShort({ style: 'heavy' })
  } else {
    setHelperHint(`为您筛选出 ${total} 件相关商品`, { voice: true })
  }
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
  padding: 52rpx 40rpx 60rpx;
  border-bottom-left-radius: 40rpx;
  border-bottom-right-radius: 40rpx;
  box-shadow: 0 18rpx 40rpx rgba(91, 113, 255, .35);
}
.hero-title {
  font-size: 58rpx;
  font-weight: 700;
  margin-bottom: 16rpx;
}
.hero-sub {
  opacity: .95;
  font-size: 34rpx;
  margin-bottom: 32rpx;
  display: block;
}
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255,255,255,.25);
  border-radius: 999rpx;
  padding: 26rpx 36rpx;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
.search-icon {
  position: absolute;
  left: 40rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 38rpx;
  pointer-events: none;
}
.search-bar input {
  border: none;
  outline: none;
  width: 100%;
  background: transparent;
  color: #fff;
  font-size: 34rpx;
  padding-left: 88rpx;
}

/* 分类导航 */
.categories {
  background: #fff;
  border-bottom: 2rpx solid #e9ecef;
  overflow-x: auto;
}
.cate-row {
  display: flex;
  gap: 28rpx;
  padding: 32rpx 32rpx;
}
.cate {
  flex: 0 0 auto;
  min-width: 210rpx;
  text-align: center;
  background: #f5f6f8;
  color: #5c6673;
  border: 2rpx solid #e9ecef;
  border-radius: 999rpx;
  padding: 24rpx 36rpx;
  font-size: 32rpx;
  cursor: pointer;
  user-select: none;
  transition: .2s all;
}
.cate:active { transform: scale(.95); }
.cate.active {
  color: #fff;
  background: linear-gradient(135deg, #5b71ff 0%, #8f6bff 100%);
  border-color: transparent;
}
.result-hint {
  margin: 24rpx 34rpx 0;
  padding: 22rpx 28rpx;
  background: #f1f4ff;
  border-radius: 24rpx;
  color: #4450c2;
  font-size: 32rpx;
  box-shadow: 0 10rpx 28rpx rgba(92, 109, 143, .08);
}
.result-hint.alert {
  background: #fff6f0;
  color: #d35454;
  border: 2rpx solid #fbc4a7;
}

/* 区块与卡片 */
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
  text-decoration: none;
}

.featured {
  display: flex;
  flex-direction: column;
  gap: 26rpx;
}
.feat-card {
  display: flex;
  gap: 28rpx;
  background: #fff;
  border: 2rpx solid #f0f1f3;
  border-radius: 32rpx;
  padding: 32rpx;
  box-shadow: 0 12rpx 32rpx rgba(92, 109, 143, .08);
  position: relative;
}
.feat-img {
  width: 180rpx;
  height: 180rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #5b71ff, #8f6bff);
  flex-shrink: 0;
}
.feat-body { flex: 1; display: flex; flex-direction: column; gap: 12rpx; }
.feat-title {
  font-weight: 700;
  font-size: 38rpx;
}
.meta {
  display: flex;
  gap: 24rpx;
  color: #5c6673;
  font-size: 30rpx;
}
.price {
  color: #ff6b6b;
  font-weight: 800;
  font-size: 40rpx;
}

.grid {
  display: grid;
  gap: 28rpx;
}
.card {
  background: #fff;
  border: 2rpx solid #f0f1f3;
  border-radius: 40rpx;
  overflow: hidden;
  box-shadow: 0 12rpx 32rpx rgba(92, 109, 143, .08);
  transition: transform .2s, box-shadow .2s;
  cursor: pointer;
}
.card:active {
  transform: scale(.98);
  box-shadow: 0 2rpx 16rpx rgba(0,0,0,.08);
}
.thumb {
  height: 280rpx;
  background: linear-gradient(135deg, #5b71ff, #8f6bff);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 90rpx;
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
  padding: 32rpx;
}
.title {
  font-size: 38rpx;
  font-weight: 700;
  margin-bottom: 16rpx;
  color: #1c2333;
}
.desc {
  font-size: 32rpx;
  color: #5c6673;
  margin-bottom: 20rpx;
  line-height: 1.6;
}
.price-row {
  display: flex;
  align-items: center;
  gap: 18rpx;
  margin-bottom: 20rpx;
}
.original-price {
  color: #9aa3b1;
  text-decoration: line-through;
  font-size: 30rpx;
}
.info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #5c6673;
  font-size: 30rpx;
}

.cart-btn {
  background: linear-gradient(135deg, #5b71ff, #8f6bff);
  color: #fff;
  padding: 16rpx 32rpx;
  border-radius: 999rpx;
  font-size: 30rpx;
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
  width: 140rpx;
  height: 140rpx;
  background: linear-gradient(135deg, #5b71ff, #8f6bff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 32rpx rgba(91, 113, 255, 0.4);
  z-index: 100;
}
.cart-icon {
  color: #fff;
  font-size: 56rpx;
}
.cart-count {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  background: #ff6b6b;
  color: #fff;
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
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

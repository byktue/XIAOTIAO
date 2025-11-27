<template>
  <view class="page">
    <view class="header-card">
      <text class="title">全部商品</text>
      <text class="subtitle">筛选与排序示例</text>
    </view>

    <view class="list">
      <view v-for="p in products" :key="p.id" class="card" @tap="() => openDetail(p)">
        <view class="thumb" :style="p.thumbStyle"></view>
        <view class="body">
          <text class="title">{{ p.title }}</text>
          <text class="desc">{{ p.desc }}</text>
          <view class="meta"><text>¥{{ p.price }}</text><text> · {{ p.sales }}已售</text></view>
        </view>
        <view class="cart-btn" @tap.stop="() => addToCart(p)">加入购物车</view>
      </view>
    </view>

    <view class="actions"><button @tap="loadMore">加载更多</button></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api'

const products = ref([])
const page = ref(1)
const limit = ref(12)
const loading = ref(false)
const total = ref(null)

const sampleProducts = [
  { id: 'p1', title: '智能血压计', desc: '自动测量，数据上传', price: '299', sales: '2.1万', thumbStyle: 'background: linear-gradient(45deg,#ff6b6b,#ffa726)' },
  { id: 'p2', title: '大屏老人手机', desc: '大字体，一键求助', price: '399', sales: '1.5万', thumbStyle: 'background: linear-gradient(45deg,#667eea,#764ba2)' },
  { id: 'p3', title: '助听器', desc: '充电款，降噪清晰', price: '899', sales: '8600', thumbStyle: 'background: linear-gradient(45deg,#4ecdc4,#44a08d)' }
]

async function fetchProducts(reset = false) {
  if (loading.value) return
  loading.value = true
  if (reset) {
    page.value = 1
    products.value = []
    total.value = null
  }
  // 先显示示例产品以避免空白
  if (products.value.length === 0) products.value = sampleProducts
  try {
    const res = await api.get('/products', { page: page.value, limit: limit.value })
    const items = (res && (res.data || res.items)) || res || []
    if (Array.isArray(items)) {
      products.value = products.value.concat(items)
    } else if (res && res.data && Array.isArray(res.data.items)) {
      products.value = products.value.concat(res.data.items)
      total.value = res.data.total
    }
  } catch (e) {
    if (products.value.length === 0) products.value = sampleProducts
    console.warn('fetch products failed', e)
  } finally {
    loading.value = false
  }
}

function openDetail(p) { uni.showToast({ title: `查看：${p.title}`, icon: 'none' }) }
function addToCart(p) { uni.showToast({ title: `${p.title} 已加入购物车`, icon: 'success' }) }
function loadMore() {
  if (total.value && products.value.length >= total.value) {
    uni.showToast({ title: '没有更多了', icon: 'none' })
    return
  }
  page.value += 1
  fetchProducts()
}

onMounted(() => fetchProducts(true))
</script>

<style scoped>
.page { padding: 28rpx; background: #f7f9fc; min-height: 100vh }
.header-card { margin-bottom: 20rpx }
.title { font-size: 36rpx; font-weight: 700 }
.subtitle { color: #666; margin-top: 8rpx }
.list { display:flex; flex-direction:column; gap:18rpx }
.card { display:flex; gap:18rpx; background:#fff; padding:18rpx; border-radius:16rpx; align-items:center }
.thumb { width:140rpx; height:100rpx; border-radius:12rpx }
.body { flex:1 }
.meta { color:#888; margin-top:8rpx }
.cart-btn { background: linear-gradient(135deg,#667eea,#764ba2); color:#fff; padding:12rpx 18rpx; border-radius:12rpx }
.actions { display:flex; justify-content:center; margin-top:20rpx }
</style>

<template>
  <view class="page">
    <view class="header-card">
      <text class="title">全部课程</text>
      <text class="subtitle">提供课程筛选与分页（示例数据）</text>
    </view>

    <view class="filter-row">
      <picker @change="onCategoryChange">
        <view class="filter">分类：{{ currentCategoryLabel }}</view>
      </picker>
    </view>

    <view class="list">
      <view v-for="c in list" :key="c.id" class="card" @tap="() => openDetail(c)">
        <view class="thumb" :style="c.thumbStyle"></view>
        <view class="body">
          <text class="title">{{ c.title }}</text>
          <text class="desc">{{ c.desc }}</text>
          <view class="meta">
            <text>⏱️ {{ c.duration }}</text>
            <text>⭐ {{ c.rate || '4.5' }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="actions">
      <button @tap="loadMore">加载更多</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../services/api'

// 简单读取 section 参数（query or getCurrentPages）
let section = ''
try {
  if (typeof getCurrentPages === 'function') {
    const pages = getCurrentPages()
    const cur = pages[pages.length - 1]
    section = cur?.options?.section || ''
  }
} catch (e) {}
if (!section && typeof window !== 'undefined' && window.location && window.location.search) {
  const p = new URLSearchParams(window.location.search)
  section = p.get('section') || ''
}

const currentCategory = ref(section || 'all')
const currentCategoryLabel = computed(() => (currentCategory.value === 'all' ? '全部' : currentCategory.value))

const list = ref([])
const page = ref(1)
const limit = ref(12)
const loading = ref(false)
const total = ref(null)

const sample = [
  { id: 'c1', title: '智能手机入门基础教程', desc: '从拨号到相册，带你入门', duration: '2小时', thumbStyle: 'background: linear-gradient(45deg,#667eea,#764ba2)' },
  { id: 'c2', title: '微信使用技巧', desc: '朋友圈、支付与视频通话', duration: '1.5小时', thumbStyle: 'background: linear-gradient(45deg,#4ecdc4,#44a08d)' },
  { id: 'c3', title: '健康养生指南', desc: '饮食与运动小贴士', duration: '3小时', thumbStyle: 'background: linear-gradient(45deg,#ff6b6b,#ffa726)' }
]

async function fetchList(reset = false) {
  if (loading.value) return
  loading.value = true
  if (reset) {
    page.value = 1
    list.value = []
    total.value = null
  }
  // 先展示示例数据，避免空白页面；真实数据成功返回后会替换
  if (list.value.length === 0) list.value = sample
  try {
    const params = { page: page.value, limit: limit.value, section: currentCategory.value }
    const res = await api.get('/courses', params)
    // 约定后端返回 { ok, data: { items: [], total } }
    const items = (res && (res.data || res.items)) || res || []
    if (Array.isArray(items)) {
      list.value = list.value.concat(items)
    } else if (res && res.data && Array.isArray(res.data.items)) {
      list.value = list.value.concat(res.data.items)
      total.value = res.data.total
    }
  } catch (e) {
    // 回退到示例数据
    if (list.value.length === 0) list.value = sample
    console.warn('fetch courses failed', e)
  } finally {
    loading.value = false
  }
}

function openDetail(item) {
  uni.showToast({ title: `打开：${item.title}`, icon: 'none' })
}

function loadMore() {
  if (total.value && list.value.length >= total.value) {
    uni.showToast({ title: '没有更多了', icon: 'none' })
    return
  }
  page.value += 1
  fetchList()
}

onMounted(() => fetchList(true))

function onCategoryChange() {
  uni.showToast({ title: '筛选（示例）', icon: 'none' })
}
</script>

<style scoped>
.page { padding: 28rpx; background: #f7f9fc; min-height: 100vh }
.header-card { margin-bottom: 20rpx }
.title { font-size: 36rpx; font-weight: 700 }
.subtitle { color: #666; margin-top: 8rpx }
.list { display: flex; flex-direction: column; gap: 18rpx }
.card { display: flex; gap: 18rpx; background: #fff; padding: 20rpx; border-radius: 18rpx }
.thumb { width: 160rpx; height: 120rpx; border-radius: 14rpx; flex-shrink: 0 }
.body { flex: 1 }
.meta { margin-top: 10rpx; color: #888 }
.actions { display:flex; justify-content:center; margin-top: 20rpx }
</style>

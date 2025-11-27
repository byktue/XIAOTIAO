<template>
  <view class="page">
    <view class="header-card">
      <text class="title">社区全部</text>
      <text class="subtitle">话题与经验分享完整列表</text>
    </view>

    <view class="tabs">
      <view :class="['tab', { active: activeTab==='topics' }]" @tap="() => activeTab='topics'">热门话题</view>
      <view :class="['tab', { active: activeTab==='posts' }]" @tap="() => activeTab='posts'">经验分享</view>
    </view>

    <view class="list">
      <view v-if="activeTab==='topics'">
        <view v-for="t in topics" :key="t.id" class="topic" @tap="() => openTopic(t)">
          <text class="title">{{ t.title }}</text>
          <view class="meta"><text>#{{ t.tag }}</text><text>{{ t.time }}</text></view>
        </view>
      </view>
      <view v-else>
        <view v-for="p in posts" :key="p.id" class="post" @tap="() => openPost(p)">
          <text class="post-user">{{ p.username }}</text>
          <text class="post-content">{{ p.content }}</text>
        </view>
      </view>
    </view>

    <view class="actions"><button @tap="loadMore">加载更多</button></view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '../../services/api'

const activeTab = ref('topics')

const topics = ref([])
const posts = ref([])
const page = ref(1)
const limit = ref(12)
const loading = ref(false)
const total = ref(null)

const sampleTopics = [
  { id: 't1', title: '如何使用智能手机拍出清晰照片？', tag: '数码技巧', time: '2小时前' },
  { id: 't2', title: '中老年人日常保健小贴士', tag: '健康养生', time: '3小时前' }
]

const samplePosts = [
  { id: 'p1', username: '张大爷', content: '今天学会了用微信视频通话，和孙子聊天真开心！' },
  { id: 'p2', username: '李大妈', content: '早上公园太极拳，身体很舒服。' }
]

async function fetchTopics(reset = false) {
  if (loading.value) return
  loading.value = true
  if (reset) { page.value = 1; topics.value = []; total.value = null }
  // 先显示示例话题以避免空白
  if (topics.value.length === 0) topics.value = sampleTopics
  try {
    const res = await api.get('/community/topics', { page: page.value, limit: limit.value })
    const items = (res && (res.data || res.items)) || res || []
    if (Array.isArray(items)) topics.value = topics.value.concat(items)
    else if (res && res.data && Array.isArray(res.data.items)) {
      topics.value = topics.value.concat(res.data.items)
      total.value = res.data.total
    }
  } catch (e) {
    if (topics.value.length === 0) topics.value = sampleTopics
    console.warn('fetch topics failed', e)
  } finally { loading.value = false }
}

async function fetchPosts(reset = false) {
  if (loading.value) return
  loading.value = true
  if (reset) { page.value = 1; posts.value = []; total.value = null }
  // 先显示示例帖子以避免空白
  if (posts.value.length === 0) posts.value = samplePosts
  try {
    const res = await api.get('/community/posts', { page: page.value, limit: limit.value })
    const items = (res && (res.data || res.items)) || res || []
    if (Array.isArray(items)) posts.value = posts.value.concat(items)
    else if (res && res.data && Array.isArray(res.data.items)) {
      posts.value = posts.value.concat(res.data.items)
      total.value = res.data.total
    }
  } catch (e) {
    if (posts.value.length === 0) posts.value = samplePosts
    console.warn('fetch posts failed', e)
  } finally { loading.value = false }
}

function openTopic(t) { uni.showToast({ title: `进入话题：${t.title}`, icon: 'none' }) }
function openPost(p) { uni.showToast({ title: `查看帖子：${p.username}`, icon: 'none' }) }
function loadMore() {
  if (activeTab.value === 'topics') {
    if (total.value && topics.value.length >= total.value) { uni.showToast({ title: '没有更多了', icon: 'none' }); return }
    page.value += 1; fetchTopics()
  } else {
    if (total.value && posts.value.length >= total.value) { uni.showToast({ title: '没有更多了', icon: 'none' }); return }
    page.value += 1; fetchPosts()
  }
}

onMounted(() => {
  // page may be provided via query (section) but keep initial tab
  fetchTopics(true)
  fetchPosts(true)
})

watch(activeTab, (v) => {
  // ensure content loaded when switching
  if (v === 'topics' && topics.value.length === 0) fetchTopics(true)
  if (v === 'posts' && posts.value.length === 0) fetchPosts(true)
})
</script>

<style scoped>
.page { padding: 28rpx; background: #f7f9fc; min-height: 100vh }
.header-card { margin-bottom: 16rpx }
.title { font-size: 36rpx; font-weight:700 }
.subtitle { color:#666; margin-top:8rpx }
.tabs { display:flex; gap:12rpx; margin: 18rpx 0 }
.tab { padding:12rpx 18rpx; border-radius:999rpx; background:#fff; color:#666 }
.tab.active { background: linear-gradient(135deg,#667eea,#764ba2); color:#fff }
.list { display:flex; flex-direction:column; gap:14rpx }
.topic, .post { background:#fff; padding:18rpx; border-radius:14rpx }
.meta { color:#888; margin-top:8rpx }
.actions { display:flex; justify-content:center; margin-top:18rpx }
</style>

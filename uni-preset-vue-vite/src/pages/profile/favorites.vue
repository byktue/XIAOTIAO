<template>
  <view class="page">
    <view class="summary">
      <view class="summary-icon">⭐</view>
      <view class="summary-body">
        <text class="summary-title">已收藏 {{ favorites.length }} 个内容</text>
        <text class="summary-desc">长按卡片可移动排序或取消收藏</text>
      </view>
    </view>

    <view class="chip-row">
      <view v-for="chip in chips" :key="chip.id" class="chip" :class="{ active: chip.id === activeChip }" @tap="() => setChip(chip.id)">
        <text>{{ chip.label }}</text>
      </view>
    </view>

    <view class="fav-card" v-for="item in filteredFavorites" :key="item.id" @longpress="() => onLongPress(item)" @tap="() => openFavorite(item)">
      <view class="thumb" :style="item.thumbStyle">{{ item.icon }}</view>
      <view class="body">
        <text class="title">{{ item.title }}</text>
        <text class="desc">{{ item.desc }}</text>
        <view class="meta">
          <text>最近学习 {{ item.lastStudy }}</text>
          <view class="tag">{{ item.category }}</view>
        </view>
      </view>
      <view class="actions">
        <button size="mini" @tap.stop="() => startCourse(item)">继续</button>
        <button size="mini" type="warn" @tap.stop="() => removeFavorite(item)">移除</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { speak, vibrateShort } from '../../services/voice.js'

const chips = [
  { id: 'all', label: '全部' },
  { id: 'course', label: '课程' },
  { id: 'article', label: '文章' },
  { id: 'service', label: '服务' }
]

const favorites = ref([
  {
    id: 'fav1',
    title: '智能手机摄影课',
    desc: '掌握光线与构图技巧',
    lastStudy: '昨天',
    category: '课程',
    type: 'course',
    icon: '📷',
    thumbStyle: 'background: linear-gradient(45deg,#4facfe,#00f2fe)'
  },
  {
    id: 'fav2',
    title: '三高饮食建议',
    desc: '医师审核的健康科普',
    lastStudy: '本周一',
    category: '文章',
    type: 'article',
    icon: '🥗',
    thumbStyle: 'background: linear-gradient(45deg,#fdd819,#e80505)'
  },
  {
    id: 'fav3',
    title: '医院陪诊服务',
    desc: '一对一志愿者陪同就诊',
    lastStudy: '11-05',
    category: '服务',
    type: 'service',
    icon: '🩺',
    thumbStyle: 'background: linear-gradient(45deg,#43e97b,#38f9d7)'
  }
])

const activeChip = ref('all')

const filteredFavorites = computed(() => {
  if (activeChip.value === 'all') {
    return favorites.value
  }
  return favorites.value.filter(item => item.type === activeChip.value)
})

function setChip(id) {
  activeChip.value = id
  speak(`已切换到${chips.find(ch => ch.id === id)?.label}分类`)
}

function openFavorite(item) {
  speak(`打开收藏：${item.title}`)
  uni.showToast({ title: `查看 ${item.title}`, icon: 'none' })
}

function startCourse(item) {
  vibrateShort({ style: 'light' })
  uni.showToast({ title: `继续 ${item.title}`, icon: 'none' })
}

function removeFavorite(item) {
  favorites.value = favorites.value.filter(f => f.id !== item.id)
  speak(`已移除收藏 ${item.title}`)
}

function onLongPress(item) {
  vibrateShort({ style: 'medium' })
  uni.showActionSheet({
    itemList: ['移动到最上面', '分享给朋友', '取消收藏'],
    success: ({ tapIndex }) => {
      if (tapIndex === 0) {
        favorites.value = [item, ...favorites.value.filter(f => f.id !== item.id)]
        speak('已移动到首位')
      }
      if (tapIndex === 2) {
        removeFavorite(item)
      }
    }
  })
}
</script>

<style scoped>
.page {
  padding: 32rpx;
  background: #f5f6fb;
  min-height: 100vh;
}
.summary {
  display: flex;
  gap: 20rpx;
  background: linear-gradient(120deg,#667eea,#764ba2);
  border-radius: 32rpx;
  padding: 28rpx;
  color: #fff;
  margin-bottom: 28rpx;
}
.summary-icon {
  font-size: 60rpx;
}
.summary-title {
  font-size: 36rpx;
  font-weight: 600;
}
.summary-desc {
  font-size: 26rpx;
  opacity: .85;
}
.chip-row {
  display: flex;
  gap: 18rpx;
  margin-bottom: 24rpx;
}
.chip {
  padding: 14rpx 32rpx;
  border-radius: 999rpx;
  background: #fff;
  font-size: 28rpx;
  color: #6f7a8a;
  border: 2rpx solid #e1e6f1;
}
.chip.active {
  background: #667eea;
  color: #fff;
  border-color: transparent;
}
.fav-card {
  background: #fff;
  border-radius: 28rpx;
  padding: 24rpx;
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 16rpx 34rpx rgba(102,126,234,.12);
}
.thumb {
  width: 112rpx;
  height: 112rpx;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
}
.body {
  flex: 1;
}
.title {
  font-size: 34rpx;
  font-weight: 600;
}
.desc {
  font-size: 28rpx;
  color: #6e7485;
  margin: 8rpx 0 16rpx;
}
.meta {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  color: #9aa4b8;
}
.tag {
  background: #f1f3fb;
  padding: 4rpx 18rpx;
  border-radius: 999rpx;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
button {
  border-radius: 999rpx;
  padding: 0 28rpx;
}
</style>

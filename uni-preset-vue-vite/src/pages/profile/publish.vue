<template>
  <view class="page">
      <view class="form-card">
        <text class="page-title">{{ postType ? (postType === 'topic' ? '发起话题' : '经验分享') : '发布动态' }}</text>

        <text class="label">标题</text>
        <input class="input" v-model="title" placeholder="写一个吸引人的标题" />

        <text class="label">标签</text>
        <view class="chips">
          <view v-for="tag in tagOptions" :key="tag" :class="['chip', { active: selectedTag === tag }]" @tap="() => selectedTag = tag" @click="() => selectedTag = tag">
            <text>{{ tag }}</text>
          </view>
        </view>

        <text class="label">内容</text>
        <textarea class="textarea" v-model="content" placeholder="分享你的经历、心得或问题" auto-height="true" />

        <text class="label">图片（占位）</text>
        <view class="upload-row">
          <view class="image-placeholder" @tap="pickImages">
            <text class="plus">选择图
            片</text>
          </view>
          <text class="hint">（示例：实现调用相册上传）</text>
        </view>

        <view class="actions">
          <button class="ghost" @tap="cancel">取消</button>
          <button class="primary" @tap="publish">发布</button>
        </view>
      </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import { speak, vibrateShort } from '../../services/voice.js'
// 读取路由参数（兼容 小程序 getCurrentPages / H5 的 location.search）
let routeParams = {}
try {
  if (typeof getCurrentPages === 'function') {
    const pages = getCurrentPages()
    const current = pages[pages.length - 1]
    routeParams = current?.options || {}
  }
} catch (e) {
  // ignore
}
// H5 fallback: 从 location.search 解析
if (!routeParams.type && typeof window !== 'undefined' && window.location && window.location.search) {
  const params = new URLSearchParams(window.location.search)
  if (params.has('type')) routeParams.type = params.get('type')
}
const postType = ref(routeParams.type || '')

// Read category param (from query or storage) so tags can adapt to community filter
let categoryKey = routeParams.category || ''
try {
  if (!categoryKey && typeof window !== 'undefined' && window.location && window.location.search) {
    const params = new URLSearchParams(window.location.search)
    if (params.has('category')) categoryKey = params.get('category')
  }
} catch (e) {}
try {
  if (!categoryKey && typeof uni !== 'undefined' && uni.getStorageSync) {
    const c = uni.getStorageSync('publishCategory')
    if (c) {
      categoryKey = c
      try { uni.removeStorageSync && uni.removeStorageSync('publishCategory') } catch (e) {}
    }
  }
} catch (e) {}

// Storage fallback (set by chooser before navigate, compatible with H5)
try {
  if (!postType.value && typeof uni !== 'undefined' && uni.getStorageSync) {
    const t = uni.getStorageSync('publishType')
    if (t) {
      postType.value = t
      try { uni.removeStorageSync && uni.removeStorageSync('publishType') } catch (e) {}
    }
  }
} catch (e) {}

// 可选标签：统一为固定的六项（并在有社区分类时优先显示对应项）
const tagOptions = ref([])
const categoryMap = {
  digital: '数码技巧',
  health: '健康养生',
  life: '生活经验',
  hobby: '兴趣爱好',
  help: '互助问答',
  activity: '同城活动'
}

const commonTags = [
  '健康养生',
  '数码技巧',
  '生活经验',
  '兴趣爱好',
  '互助问答',
  '同城活动'
]

// 优先把社区传来的分类放到最前面（如果能映射到中文名且不重复）
if (categoryKey && categoryKey !== 'all') {
  const name = categoryMap[categoryKey] || categoryKey
  tagOptions.value = [name, ...commonTags.filter(t => t !== name)]
} else {
  tagOptions.value = commonTags
}
const selectedTag = ref('')

const title = ref('')
const content = ref('')
const images = ref([])

function pickImages() {
  uni.chooseImage({ count: 3, success: (res) => {
    images.value = res.tempFilePaths
    uni.showToast({ title: `${res.tempFilePaths.length} 张已选择`, icon: 'none' })
  }})
}

function cancel() {
  uni.navigateBack()
}

function publish() {
  if (!title.value.trim() && !content.value.trim()) {
    uni.showToast({ title: '请输入标题或内容', icon: 'none' })
    return
  }
  // 合并标签信息
  const payload = {
    type: postType.value || 'share',
    tag: selectedTag.value || '',
    title: title.value,
    content: content.value,
    images: images.value
  }
  // 这里应调用后端接口，演示时我们直接返回并提示
  speak('发布成功')
  vibrateShort({ style: 'light' })
  uni.showToast({ title: '发布成功', icon: 'success' })
  // 返回到上一个页面，理想状态下可通过事件传回新帖子数据
  // 如果需要可以通过 eventChannel 发送 payload，当前直接返回
  setTimeout(() => uni.navigateBack(), 600)
}
</script>

<style scoped>
.page-inner { padding: 28rpx }
.form-card { background: #fff; padding: 28rpx; border-radius: 20rpx; box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.06) }
.page-title { font-size: 34rpx; font-weight: 700; margin-bottom: 18rpx }
.label { display:block; font-size: 26rpx; margin-bottom: 12rpx; color: #5c6673 }
.input { width:100%; background:#f8fafc; padding:20rpx; border-radius:14rpx; font-size:30rpx; margin-bottom:18rpx; border: 1rpx solid #eef2f6 }
.textarea { width:100%; min-height:260rpx; background:#f8fafc; padding:20rpx; border-radius:14rpx; font-size:30rpx; border: 1rpx solid #eef2f6 }
.upload-row { display:flex; align-items:center; gap:20rpx; margin:18rpx 0 }
.image-placeholder { width: 160rpx; height: 160rpx; background: #fff; border-radius: 12rpx; border: 2rpx dashed #e6e9f2; display:flex; align-items:center; justify-content:center }
.image-placeholder .plus { font-size: 24rpx; color: #667eea; text-align:center }
.hint { color:#9aa4b1; font-size: 26rpx }
.actions { display:flex; justify-content:space-between; gap:18rpx; margin-top:24rpx }
.ghost { background:#fff; color:#6b7280; border-radius:999rpx; padding:0 36rpx; height:84rpx; border: 2rpx solid #f0f2f6 }
.primary { background:linear-gradient(135deg,#667eea,#764ba2); color:#fff; padding:0 36rpx; height:84rpx; border-radius:999rpx }
.chips { display:flex; gap: 16rpx; flex-wrap:wrap; margin-bottom: 16rpx }
.chip { background: #f3f6fa; padding: 12rpx 20rpx; border-radius: 999rpx; font-size: 26rpx; color: #556071 }
.chip.active { background: linear-gradient(135deg,#667eea,#764ba2); color: #fff }
</style>

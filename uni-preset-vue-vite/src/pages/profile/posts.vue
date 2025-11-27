<template>
  <view class="page">
    <view class="header-card">
      <view>
        <text class="title">社区发布</text>
        <text class="subtitle">本月累计 {{ posts.length }} 条动态</text>
      </view>
      <button class="publish-btn" @tap="createPost">+ 发布</button>
    </view>

    <view class="post-card" v-for="post in posts" :key="post.id">
      <view class="post-head">
        <view class="post-tag">{{ post.category }}</view>
        <text class="time">{{ post.time }}</text>
      </view>
      <text class="post-title">{{ post.title }}</text>
      <text class="post-content">{{ post.content }}</text>
      <view class="gallery" v-if="post.images?.length">
        <image v-for="img in post.images" :key="img" :src="img" mode="aspectFill" />
      </view>
      <view class="post-footer">
        <view class="stats">
          <text>👍 {{ post.likes }}</text>
          <text>💬 {{ post.comments }}</text>
          <text>👀 {{ post.views }}</text>
        </view>
        <view class="post-actions">
          <button size="mini" @tap="() => editPost(post)">编辑</button>
          <button size="mini" type="warn" @tap="() => deletePost(post)">删除</button>
        </view>
        <PublishChooser v-if="showChooser" @choose="onChooseType" @cancel="closeChooser" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { speak } from '../../services/voice.js'
import PublishChooser from '../../components/PublishChooser.vue'

const posts = ref([
  {
    id: 'post1',
    title: '陪妈妈逛公园',
    content: '今天社区志愿者带我们参观植物园，体验非常棒！',
    time: '11-11 16:20',
    category: '生活分享',
    likes: 32,
    comments: 6,
    views: 188,
    images: ['/_proxy?url=https%3A%2F%2Fvia.placeholder.com%2F160']
  },
  {
    id: 'post2',
    title: '智能手机课心得',
    content: '第三节课讲了如何使用语音助手，日常操作方便了很多。',
    time: '11-10 10:05',
    category: '学习笔记',
    likes: 54,
    comments: 11,
    views: 248
  }
])

const showChooser = ref(false)

function createPost() {
  speak('已打开发帖类型选择，请选择话题或经验分享')
  showChooser.value = true
}

function onChooseType(type) {
  // set storage fallback and navigate to publish page
  try { uni.setStorageSync('publishType', type) } catch (e) {}
  uni.navigateTo({ url: `/pages/profile/publish?type=${type}`, animationType: 'pop-in', animationDuration: 220 })
  showChooser.value = false
}

function closeChooser() { showChooser.value = false }

function editPost(post) {
  speak(`编辑 ${post.title}`)
  uni.showToast({ title: `编辑：${post.title}`, icon: 'none' })
}

function deletePost(post) {
  uni.showModal({
    title: '删除提醒',
    content: `确定删除《${post.title}》吗？`,
    success: ({ confirm }) => {
      if (confirm) {
        posts.value = posts.value.filter(p => p.id !== post.id)
        speak('已删除动态')
      }
    }
  })
}

// 发布类型现在在独立页面 `publish-chooser.vue` 处理
</script>

<style scoped>
.page {
  padding: 32rpx;
  background: #f5f6fa;
  min-height: 100vh;
}
.header-card {
  background: linear-gradient(120deg,#f6d365,#fda085);
  border-radius: 32rpx;
  padding: 32rpx;
  color: #4b2c1d;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28rpx;
}
.title {
  font-size: 40rpx;
  font-weight: 700;
}
.subtitle {
  font-size: 28rpx;
  opacity: .8;
}
.publish-btn {
  border-radius: 999rpx;
  background: rgba(255,255,255,.18);
  color: #4b2c1d;
  border: 2rpx solid rgba(255,255,255,.35);
}
.post-card {
  background: #fff;
  border-radius: 28rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 12rpx 30rpx rgba(0,0,0,.04);
}
.post-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12rpx;
}
.post-tag {
  background: #f3f4ff;
  padding: 4rpx 16rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
  color: #5b71ff;
}
.time {
  color: #9aa3b6;
  font-size: 26rpx;
}
.post-title {
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 12rpx;
}
.post-content {
  font-size: 30rpx;
  color: #5d6476;
  line-height: 1.6;
}
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
  margin: 16rpx 0;
}
.gallery image {
  width: 100%;
  height: 160rpx;
  border-radius: 18rpx;
  background: #f0f1f3;
}
.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18rpx;
}
.stats {
  color: #a0a7bb;
  font-size: 26rpx;
  display: flex;
  gap: 20rpx;
}
.post-actions button {
  border-radius: 999rpx;
  margin-left: 12rpx;
}

/* 发布选择弹窗样式 */
.chooser-overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 30rpx;
  z-index: 20;
}
.chooser-card {
  width: 100%;
  background: #fff;
  border-radius: 24rpx;
  padding: 36rpx 28rpx;
  box-shadow: 0 20rpx 40rpx rgba(0,0,0,0.1);
}
.chooser-title { text-align:center; font-size:34rpx; font-weight:700; margin-bottom:28rpx }
.chooser-grid { display:flex; gap:24rpx; justify-content:center }
.chooser-item { flex:1; background: linear-gradient(135deg,#667eea,#764ba2); color:#fff; padding:30rpx; border-radius:20rpx; text-align:center }
.chooser-item .icon { font-size:56rpx; margin-bottom:16rpx }
.chooser-cancel { margin-top:22rpx; background:#f3f5f9; color:#6b7280; padding:18rpx; border-radius:14rpx; text-align:center }
</style>

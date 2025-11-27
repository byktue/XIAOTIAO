<template>
  <view class="page">
    <view class="tips">
      <text>本周已累计学习 {{ totalHours }} 小时</text>
      <text class="secondary">坚持每天 30 分钟，保持好状态</text>
    </view>

    <scroll-view class="filter-tabs" scroll-x show-scrollbar="false">
      <view class="tab" v-for="tab in tabs" :key="tab.key" :class="{ active: activeTab === tab.key }" @tap="() => selectTab(tab.key)">{{ tab.label }}</view>
    </scroll-view>

    <view class="course-list">
      <view v-for="course in filteredCourses" :key="course.id" class="course-card">
        <view class="thumb" :style="course.thumbStyle">
          <text>{{ course.icon }}</text>
        </view>
        <view class="body">
          <text class="title">{{ course.title }}</text>
          <text class="meta">{{ course.teacher }} · {{ course.duration }}</text>
          <view class="progress-bar">
            <view class="progress-fill" :style="`width:${course.progress}%`"></view>
          </view>
          <view class="status-row">
            <text>进度 {{ course.progress }}%</text>
            <button class="link" @tap="() => continueCourse(course)">{{ course.progress >= 100 ? '复习' : '继续学习' }}</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { speak, vibrateShort } from '../../services/voice.js'

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'in-progress', label: '学习中' },
  { key: 'completed', label: '已完成' }
]

const activeTab = ref('all')

const courses = ref([
  { id: 'c1', title: '智能手机入门', teacher: '张老师', duration: '2 小时', progress: 72, icon: '📱', thumbStyle: 'background: linear-gradient(135deg,#667eea,#764ba2)' },
  { id: 'c2', title: '微信沟通技巧', teacher: '王老师', duration: '1.5 小时', progress: 35, icon: '💬', thumbStyle: 'background: linear-gradient(135deg,#4ecdc4,#44a08d)' },
  { id: 'c3', title: '健康养生指南', teacher: '李医生', duration: '3 小时', progress: 100, icon: '❤️', thumbStyle: 'background: linear-gradient(135deg,#ff6b6b,#ffa726)' },
  { id: 'c4', title: '生活缴费实操', teacher: '陈老师', duration: '1 小时', progress: 20, icon: '💡', thumbStyle: 'background: linear-gradient(135deg,#6c5ce7,#a29bfe)' }
])

const totalHours = computed(() => 6.5)

const filteredCourses = computed(() => {
  if (activeTab.value === 'all') return courses.value
  if (activeTab.value === 'completed') return courses.value.filter(c => c.progress >= 100)
  return courses.value.filter(c => c.progress < 100)
})

function selectTab(key) {
  activeTab.value = key
  vibrateShort({ style: 'light' })
}

function continueCourse(course) {
  speak(`继续学习 ${course.title}`)
  uni.showToast({ title: `打开 ${course.title}`, icon: 'none' })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 32rpx;
  background: #f5f7fb;
}
.tips {
  background: #fff;
  border-radius: 28rpx;
  padding: 28rpx;
  box-shadow: 0 18rpx 32rpx rgba(0,0,0,0.05);
  font-size: 34rpx;
}
.secondary {
  display: block;
  color: #8d98a8;
  font-size: 28rpx;
  margin-top: 8rpx;
}
.filter-tabs {
  margin: 32rpx 0;
  display: flex;
  gap: 20rpx;
}
.tab {
  padding: 16rpx 40rpx;
  border-radius: 999rpx;
  background: #e8ecf7;
  font-size: 30rpx;
}
.tab.active {
  background: linear-gradient(135deg,#667eea,#764ba2);
  color: #fff;
  box-shadow: 0 12rpx 24rpx rgba(102,126,234,0.2);
}
.course-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.course-card {
  display: flex;
  gap: 24rpx;
  background: #fff;
  border-radius: 28rpx;
  padding: 24rpx;
  box-shadow: 0 18rpx 32rpx rgba(0,0,0,0.04);
}
.thumb {
  width: 120rpx;
  height: 120rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
}
.body {
  flex: 1;
}
.title {
  font-size: 36rpx;
  font-weight: 600;
}
.meta {
  color: #8d98a8;
  margin: 8rpx 0 20rpx;
}
.progress-bar {
  height: 18rpx;
  background: #eef1f7;
  border-radius: 999rpx;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(135deg,#667eea,#764ba2);
  border-radius: 999rpx;
}
.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16rpx;
  color: #5c6673;
}
.link {
  font-size: 28rpx;
  color: #667eea;
  background: transparent;
}
</style>

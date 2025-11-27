<template>
  <view class="page">
    <view class="timeline-card" v-for="record in records" :key="record.date">
      <view class="date">
        <text class="day">{{ record.day }}</text>
        <text class="weekday">{{ record.weekday }}</text>
      </view>
      <view class="entries">
        <view class="entry" v-for="item in record.entries" :key="item.id">
          <view class="entry-icon" :style="item.iconStyle">{{ item.icon }}</view>
          <view class="entry-body">
            <text class="entry-title">{{ item.title }}</text>
            <text class="entry-desc">{{ item.desc }}</text>
            <view class="entry-meta">
              <text>{{ item.duration }}</text>
              <text>{{ item.time }}</text>
            </view>
          </view>
          <button class="entry-btn" size="mini" @tap="() => resume(item)">继续</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { speak } from '../../services/voice.js'

const records = ref([
  {
    date: '2024-11-12',
    day: '12',
    weekday: '周二',
    entries: [
      {
        id: 'rec1',
        title: '智能手机入门',
        desc: '学习第 3 章节：拍照技巧',
        duration: '学习 25 分钟',
        time: '09:30',
        icon: '📱',
        iconStyle: 'background: linear-gradient(45deg,#667eea,#764ba2)'
      },
      {
        id: 'rec2',
        title: '太极基础动作',
        desc: '跟练第 2 节',
        duration: '跟练 15 分钟',
        time: '07:00',
        icon: '🧘',
        iconStyle: 'background: linear-gradient(45deg,#43cea2,#185a9d)'
      }
    ]
  },
  {
    date: '2024-11-11',
    day: '11',
    weekday: '周一',
    entries: [
      {
        id: 'rec3',
        title: '健康饮食指南',
        desc: '阅读第 5 章 控制糖分',
        duration: '阅读 12 分钟',
        time: '20:15',
        icon: '🥗',
        iconStyle: 'background: linear-gradient(45deg,#fceabb,#f8b500)'
      }
    ]
  }
])

function resume(item) {
  speak(`继续 ${item.title}`)
  uni.showToast({ title: `从 ${item.time} 记录继续`, icon: 'none' })
}
</script>

<style scoped>
.page {
  background: #f4f6fb;
  min-height: 100vh;
  padding: 32rpx;
}
.timeline-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 20rpx 34rpx rgba(0,0,0,.06);
  display: flex;
  gap: 24rpx;
}
.date {
  width: 120rpx;
  text-align: center;
  border-right: 2rpx dashed #e5e8f1;
  padding-right: 20rpx;
}
.day {
  font-size: 48rpx;
  font-weight: 700;
  color: #3a3f63;
}
.weekday {
  font-size: 28rpx;
  color: #9aa4b1;
}
.entries {
  flex: 1;
}
.entry {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 18rpx 0;
  border-bottom: 2rpx solid #f0f1f6;
}
.entry:last-child {
  border-bottom: none;
}
.entry-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38rpx;
  color: #fff;
}
.entry-body {
  flex: 1;
}
.entry-title {
  font-size: 34rpx;
  font-weight: 600;
}
.entry-desc {
  font-size: 28rpx;
  color: #6b7285;
  margin: 6rpx 0 12rpx;
}
.entry-meta {
  font-size: 26rpx;
  color: #a0a6b5;
  display: flex;
  justify-content: space-between;
}
.entry-btn {
  border-radius: 999rpx;
}
</style>

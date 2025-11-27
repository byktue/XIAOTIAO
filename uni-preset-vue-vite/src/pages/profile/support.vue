<template>
  <view class="page">
    <view class="hero">
      <view class="hero-icon">🎧</view>
      <view>
        <text class="hero-title">全天候客服</text>
        <text class="hero-desc">在线答疑、远程协助、上门教学</text>
      </view>
    </view>

    <view class="contact-card">
      <view class="contact-row" v-for="channel in channels" :key="channel.id" @tap="() => contact(channel)">
        <view class="contact-icon">{{ channel.icon }}</view>
        <view class="contact-body">
          <text class="contact-title">{{ channel.title }}</text>
          <text class="contact-desc">{{ channel.desc }}</text>
        </view>
        <text class="contact-arrow">›</text>
      </view>
    </view>

    <view class="helper-card">
      <view class="helper-head">
        <text>智能助手</text>
        <switch :checked="botEnabled" @change="toggleBot" color="#667eea"></switch>
      </view>
      <text class="helper-desc">支持语音描述问题，系统自动派单给客服或志愿者。</text>
    </view>

    <view class="faq">
      <view class="faq-item" v-for="faq in faqs" :key="faq.id">
        <view class="faq-question" @tap="() => toggleFaq(faq.id)">
          <text>{{ faq.question }}</text>
          <text>{{ openFaq === faq.id ? '−' : '+' }}</text>
        </view>
        <text v-if="openFaq === faq.id" class="faq-answer">{{ faq.answer }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { speak } from '../../services/voice.js'

const channels = [
  { id: 'call', title: '电话客服', desc: '400-123-5566（8:00-22:00）', icon: '📞' },
  { id: 'video', title: '视频协助', desc: '面对面远程指导', icon: '📹' },
  { id: 'chat', title: '在线客服', desc: '平均 30 秒内响应', icon: '💬' },
  { id: 'visit', title: '上门服务', desc: '智能设备调试 / 学习辅导', icon: '🚶' }
]

const faqs = [
  { id: 1, question: '如何恢复忘记的账号密码？', answer: '在登录界面点击“忘记密码”，输入绑定手机号即可找回。' },
  { id: 2, question: '报名课程后如何上课？', answer: '在课程页面的“已报名”中找到课程，按提示进入直播或录播。' }
]

const botEnabled = ref(true)
const openFaq = ref(null)

function contact(channel) {
  speak(`进入${channel.title}`)
  uni.showToast({ title: channel.title, icon: 'none' })
}

function toggleBot({ detail }) {
  botEnabled.value = detail.value
  speak(`智能助手已${detail.value ? '开启' : '关闭'}`)
}

function toggleFaq(id) {
  openFaq.value = openFaq.value === id ? null : id
}
</script>

<style scoped>
.page {
  padding: 32rpx;
  background: #f5f6fb;
  min-height: 100vh;
}
.hero {
  background: linear-gradient(120deg,#667eea,#764ba2);
  border-radius: 32rpx;
  padding: 32rpx;
  color: #fff;
  display: flex;
  gap: 24rpx;
  align-items: center;
  margin-bottom: 28rpx;
}
.hero-icon {
  font-size: 64rpx;
}
.hero-title {
  font-size: 40rpx;
  font-weight: 700;
  display: block;
}
.hero-desc {
  font-size: 28rpx;
  opacity: .85;
}
.contact-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 16rpx 0;
  margin-bottom: 28rpx;
  box-shadow: 0 12rpx 30rpx rgba(0,0,0,.05);
}
.contact-row {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  border-bottom: 2rpx solid #f1f2f6;
}
.contact-row:last-child {
  border-bottom: none;
}
.contact-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}
.contact-title {
  font-size: 34rpx;
  font-weight: 600;
}
.contact-desc {
  font-size: 26rpx;
  color: #8c95a5;
}
.contact-body {
  flex: 1;
}
.contact-arrow {
  color: #c2c8d5;
  font-size: 36rpx;
}
.helper-card {
  background: #fff;
  border-radius: 28rpx;
  padding: 28rpx;
  margin-bottom: 28rpx;
  box-shadow: 0 10rpx 24rpx rgba(0,0,0,.04);
}
.helper-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 12rpx;
}
.helper-desc {
  font-size: 28rpx;
  color: #6a7386;
  line-height: 1.6;
}
.faq {
  background: #fff;
  border-radius: 28rpx;
  padding: 16rpx 0;
  box-shadow: 0 10rpx 24rpx rgba(0,0,0,.04);
}
.faq-item {
  padding: 24rpx 32rpx;
  border-bottom: 2rpx solid #f0f2f6;
}
.faq-item:last-child {
  border-bottom: none;
}
.faq-question {
  display: flex;
  justify-content: space-between;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}
.faq-answer {
  margin-top: 12rpx;
  font-size: 28rpx;
  color: #666f86;
  line-height: 1.6;
}
</style>

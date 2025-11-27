<template>
  <view class="page">
    <view class="order-card" v-for="order in orders" :key="order.id">
      <view class="order-head">
        <text class="order-no">订单号：{{ order.id }}</text>
        <text class="order-status" :class="order.status">{{ order.statusText }}</text>
      </view>
      <view class="order-item">
        <view class="thumb">{{ order.icon }}</view>
        <view class="info">
          <text class="title">{{ order.title }}</text>
          <text class="desc">{{ order.desc }}</text>
          <text class="price">¥{{ order.price }}</text>
        </view>
      </view>
      <view class="timeline">
        <view v-for="step in order.timeline" :key="step.time" class="timeline-item">
          <view class="dot"></view>
          <view class="timeline-body">
            <text class="timeline-title">{{ step.title }}</text>
            <text class="timeline-time">{{ step.time }}</text>
          </view>
        </view>
      </view>
      <view class="order-actions">
        <button class="ghost" @tap="() => contactSupport(order)">联系客服</button>
        <button class="primary" v-if="order.status === 'pending'" @tap="() => payOrder(order)">立即支付</button>
        <button class="primary" v-else @tap="() => viewOrder(order)">查看详情</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { speak } from '../../services/voice.js'

const orders = ref([
  {
    id: '202411120001',
    title: '智能手机基础课程',
    desc: '四周直播 + 回放',
    price: 199,
    status: 'pending',
    statusText: '待支付',
    icon: '📱',
    timeline: [
      { title: '下单成功', time: '11-12 09:32' },
      { title: '待支付', time: '11-12 09:32' }
    ]
  },
  {
    id: '202410300116',
    title: '健康体检预约',
    desc: '三甲医院绿色通道',
    price: 499,
    status: 'finished',
    statusText: '已完成',
    icon: '🩺',
    timeline: [
      { title: '下单成功', time: '10-30 14:10' },
      { title: '已支付', time: '10-30 14:11' },
      { title: '服务完成', time: '11-02 10:00' }
    ]
  }
])

function contactSupport(order) {
  speak(`为订单 ${order.id} 连接客服`)
  uni.navigateTo({ url: '/pages/profile/support' })
}

function payOrder(order) {
  uni.showToast({ title: `唤起支付 ${order.price} 元`, icon: 'none' })
}

function viewOrder(order) {
  uni.showToast({ title: `查看订单 ${order.id}`, icon: 'none' })
}
</script>

<style scoped>
.page {
  padding: 32rpx;
  background: #f6f7fb;
  min-height: 100vh;
}
.order-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx;
  margin-bottom: 28rpx;
  box-shadow: 0 20rpx 40rpx rgba(0,0,0,0.04);
}
.order-head {
  display: flex;
  justify-content: space-between;
  font-size: 30rpx;
  color: #5c6673;
}
.order-status.pending {
  color: #ff9800;
}
.order-status.finished {
  color: #4caf50;
}
.order-item {
  display: flex;
  gap: 24rpx;
  margin: 28rpx 0;
}
.thumb {
  width: 110rpx;
  height: 110rpx;
  background: #f2f4fb;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
}
.info .title {
  font-size: 34rpx;
  font-weight: 600;
}
.info .desc {
  color: #8d98a8;
  margin: 6rpx 0;
}
.price {
  color: #ff6b6b;
  font-weight: 600;
}
.timeline {
  border-left: 2rpx solid #e6e9f2;
  padding-left: 20rpx;
}
.timeline-item {
  position: relative;
  margin-bottom: 20rpx;
}
.dot {
  width: 20rpx;
  height: 20rpx;
  background: #667eea;
  border-radius: 50%;
  position: absolute;
  left: -30rpx;
  top: 10rpx;
}
.timeline-title {
  font-size: 30rpx;
}
.timeline-time {
  font-size: 26rpx;
  color: #8d98a8;
}
.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  margin-top: 20rpx;
}
button {
  min-width: 180rpx;
  height: 80rpx;
  border-radius: 999rpx;
  font-size: 30rpx;
}
.ghost {
  border: 2rpx solid #d5d9e6;
  background: transparent;
  color: #5c6673;
}
.primary {
  background: linear-gradient(135deg,#667eea,#764ba2);
  color: #fff;
}
</style>

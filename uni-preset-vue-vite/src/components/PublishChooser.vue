<template>
  <view class="overlay" @tap="onCancel">
    <view class="sheet" @tap.stop>
      <text class="chooser-title">选择发帖类型</text>
      <view class="chooser-grid">
        <view class="chooser-item" @tap="() => choose('topic')">
          <view class="icon">📣</view>
          <text>发起话题</text>
        </view>
        <view class="chooser-item" @tap="() => choose('share')">
          <view class="icon">📝</view>
          <text>经验分享</text>
        </view>
      </view>
      <view class="chooser-cancel" @tap="onCancel">取消</view>
    </view>
  </view>
</template>

<script setup>
import { defineEmits } from 'vue'
import { speak } from '../services/voice.js'

const emit = defineEmits(['choose', 'cancel'])

function choose(type) {
  try { uni.setStorageSync('publishType', type) } catch (e) {}
  try { speak('已选择类型，正在打开发布器') } catch (e) {}
  emit('choose', type)
}

function onCancel() {
  try { speak('已取消') } catch (e) {}
  emit('cancel')
}

// 组件创建时提示
try { speak('已打开发帖类型选择，请选择话题或经验分享') } catch (e) {}
</script>

<style scoped>
.overlay { position: fixed; left:0; top:0; right:0; bottom:0; background: rgba(0,0,0,0.28); display:flex; align-items:flex-end; justify-content:center; z-index:1200 }
.sheet { width:100%; max-width:720rpx; background:#fff; border-top-left-radius:28rpx; border-top-right-radius:28rpx; padding:36rpx; box-shadow:0 -12rpx 30rpx rgba(0,0,0,0.12); margin-bottom: env(safe-area-inset-bottom, 24rpx) }
.chooser-title { text-align:center; font-size:36rpx; font-weight:700; margin-bottom:22rpx }
.chooser-grid { display:flex; gap:22rpx }
.chooser-item { flex:1; background: linear-gradient(135deg,#667eea,#764ba2); color:#fff; padding:28rpx; border-radius:18rpx; text-align:center }
.chooser-item .icon { font-size:48rpx; margin-bottom:10rpx }
.chooser-cancel { margin-top:18rpx; text-align:center; padding:16rpx; background:#f4f6fa; border-radius:12rpx; color:#6b7280 }
</style>

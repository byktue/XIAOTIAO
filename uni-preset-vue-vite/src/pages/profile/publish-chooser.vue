<template>
  <view class="overlay" @tap="cancel">
    <view class="sheet" @tap.stop>
      <text class="chooser-title">选择发帖类型</text>
      <view class="chooser-grid">
        <view class="chooser-item" @tap="() => chooseType('topic')">
          <view class="icon">📣</view>
          <text>发起话题</text>
        </view>
        <view class="chooser-item" @tap="() => chooseType('share')">
          <view class="icon">📝</view>
          <text>经验分享</text>
        </view>
      </view>
      <view class="chooser-cancel" @tap="cancel">取消</view>
    </view>
  </view>
</template>

<script setup>
import { speak } from '../../services/voice.js'

function chooseType(type) {
  try { uni.setStorageSync('publishType', type) } catch (e) {}
  try { speak('已选择类型，正在打开发布器') } catch (e) {}
  // 使用平滑动画打开发布页面（H5/小程序兼容）
  uni.navigateTo({ url: `/pages/profile/publish?type=${type}`, animationType: 'pop-in', animationDuration: 220 })
}
function cancel() {
  // 尝试小程序/uni-app 的回退
  try {
    uni.navigateBack({ delta: 1 })
    return
  } catch (e) {
    // ignore
  }
  // H5 fallback: 使用浏览器历史回退
  try {
    if (typeof window !== 'undefined' && window.history && window.history.length > 0) {
      window.history.back()
      return
    }
  } catch (e) {}
  // 最终兜底到切回社区页（如果用户是从社区打开）
  try {
    uni.switchTab({ url: '/pages/community/index' })
  } catch (e) {}
}

// 打开页面时给个语音提示
try { speak('已打开发帖类型选择，请选择话题或经验分享') } catch (e) {}
</script>

<style scoped>
.overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.28);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1200;
}
.sheet {
  width: 100%;
  max-width: 720rpx;
  background: #fff;
  border-top-left-radius: 28rpx;
  border-top-right-radius: 28rpx;
  padding: 36rpx;
  box-shadow: 0 -12rpx 30rpx rgba(0,0,0,0.12);
  animation: slideUp .25s ease;
  margin-bottom: env(safe-area-inset-bottom, 24rpx);
}
.chooser-title { text-align:center; font-size:36rpx; font-weight:700; margin-bottom:22rpx }
.chooser-grid { display:flex; gap:22rpx }
.chooser-item { flex:1; background: linear-gradient(135deg,#667eea,#764ba2); color:#fff; padding:28rpx; border-radius:18rpx; text-align:center }
.chooser-item .icon { font-size:48rpx; margin-bottom:10rpx }
.chooser-cancel { margin-top:18rpx; text-align:center; padding:16rpx; background:#f4f6fa; border-radius:12rpx; color:#6b7280 }

@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0 }
  to { transform: translateY(0); opacity: 1 }
}
</style>

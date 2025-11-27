<template>
  <view class="page">
    <view class="header">
      <text class="title">隐私设置</text>
    </view>

    <view class="content">
      <text class="section-title">隐私说明</text>
      <text class="paragraph">我们重视您的隐私。本页面用于说明应用如何收集和使用您的数据。</text>

      <text class="section-title">常见选项</text>
      <view class="item">
        <text>• 数据收集：仅在必要时收集匿名化信息以改善服务。</text>
      </view>
      <view class="item">
        <text>• 推送通知：可在设置中关闭。</text>
      </view>

      <text class="section-title">操作</text>
      <button class="btn" @click="openPrivacyPolicy">查看隐私政策</button>
    </view>
  </view>
</template>

<script setup>
import { useRouter } from 'vue-router'

function openPrivacyPolicy() {
  // 如果有在线隐私页，打开外链；否则显示提示
  uni.showToast({ title: '打开隐私政策（示例）', icon: 'none' })
}
</script>

<style scoped>
.page { padding: 20px; }
.header { padding: 8px 0; }
.title { font-size: 18px; font-weight: 700; }
.content { margin-top: 12px; }
.section-title { font-weight: 600; margin-top: 10px; display: block; }
.paragraph { margin-top: 8px; color: #666; }
.item { margin-top: 6px; }
.btn { margin-top: 14px; }
</style>

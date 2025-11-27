<template>
  <view class="page">
    <view class="header">
      <text class="title">关于我们</text>
    </view>

    <view class="content">
      <text class="section-title">应用信息</text>
      <text class="paragraph">小跳 - 轻量社区与课程平台（示例信息）。</text>

      <text class="section-title">版本</text>
      <text class="paragraph">v1.0.0</text>

      <text class="section-title">联系方式</text>
      <text class="paragraph">如需帮助，请联系 support@example.com</text>

      <button class="btn" @click="openChangelog">查看更新日志</button>
    </view>
  </view>
</template>

<script setup>
function openChangelog() {
  uni.showToast({ title: '打开更新日志（示例）', icon: 'none' })
}
</script>

<style scoped>
.page { padding: 20px; }
.header { padding: 8px 0; }
.title { font-size: 18px; font-weight: 700; }
.content { margin-top: 12px; }
.section-title { font-weight: 600; margin-top: 10px; display: block; }
.paragraph { margin-top: 8px; color: #666; }
.btn { margin-top: 14px; }
</style>

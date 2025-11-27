<template>
  <view class="page">
    <view class="header-card">
      <view class="avatar-block">
        <view class="avatar">👴</view>
        <view>
          <text class="name">{{ form.name }}</text>
          <text class="tagline">{{ form.tagline || '用学习保持年轻' }}</text>
        </view>
        <button class="avatar-btn" @tap="changeAvatar">更换头像</button>
      </view>
    </view>

    <view class="form-section">
      <view class="form-group" v-for="field in fields" :key="field.key">
        <text class="label">{{ field.label }}</text>
        <input
          v-if="field.type === 'text'"
          class="input"
          :type="field.keyboard || 'text'"
          :placeholder="field.placeholder"
          v-model="form[field.key]"
          :aria-label="field.label"
        />
        <picker v-else-if="field.type === 'picker'" mode="selector" :range="field.options" @change="(e) => onPickerChange(field.key, e.detail.value)">
          <view class="picker-value">{{ field.display(form[field.key]) }}</view>
        </picker>
        <switch v-else-if="field.type === 'switch'" :checked="form[field.key]" @change="(e) => form[field.key] = e.detail.value" />
      </view>
    </view>

    <view class="helper-card">
      <text class="helper-title">紧急联系人</text>
      <view class="helper-row">
        <text>姓名：{{ form.emergencyName }}</text>
        <text>电话：{{ form.emergencyPhone }}</text>
      </view>
      <button class="link-btn" @tap="editEmergency">编辑联系人</button>
    </view>

    <button class="save-btn" @tap="saveProfile">保存信息</button>

    <view v-if="showEmergencyEditor" class="overlay">
      <view class="editor-card">
        <view class="editor-head">
          <text>紧急联系人</text>
          <button class="close-btn" @tap="closeEmergencyEditor">×</button>
        </view>
        <view class="editor-form">
          <text class="label">联系人姓名</text>
          <input class="input" v-model="emergencyForm.name" placeholder="请输入联系人姓名" />
          <text class="label">联系电话</text>
          <input class="input" v-model="emergencyForm.phone" placeholder="请输入联系电话" type="number" />
        </view>
        <view class="editor-actions">
          <button class="ghost" @tap="closeEmergencyEditor">取消</button>
          <button class="primary" @tap="saveEmergencyEditor">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { speak, vibrateShort } from '../../services/voice.js'

const form = reactive({
  name: '张大爷',
  gender: 'male',
  birthday: '1955-06-01',
  city: '上海',
  phone: '138****4321',
  tagline: '每天学一点',
  notify: true,
  emergencyName: '张阿姨',
  emergencyPhone: '13800001234'
})

const emergencyForm = reactive({
  name: '',
  phone: ''
})
const showEmergencyEditor = ref(false)

const fields = [
  { key: 'name', label: '姓名', type: 'text', placeholder: '请输入姓名' },
  { key: 'phone', label: '联系方式', type: 'text', placeholder: '请输入手机号', keyboard: 'number' },
  { key: 'city', label: '所在城市', type: 'picker', options: ['上海', '北京', '广州', '深圳', '杭州'], display: value => value || '请选择城市' },
  { key: 'birthday', label: '出生日期', type: 'text', placeholder: 'YYYY-MM-DD' },
  { key: 'tagline', label: '个性签名', type: 'text', placeholder: '写一句话激励自己' },
  { key: 'notify', label: '消息提醒', type: 'switch' }
]

function onPickerChange(key, index) {
  form[key] = fields.find(f => f.key === key)?.options[index] || ''
}

function changeAvatar() {
  speak('请选择一张新的头像')
  uni.showToast({ title: '打开相册...', icon: 'none' })
}

function editEmergency() {
  emergencyForm.name = form.emergencyName
  emergencyForm.phone = form.emergencyPhone
  showEmergencyEditor.value = true
}

function closeEmergencyEditor() {
  showEmergencyEditor.value = false
}

function saveEmergencyEditor() {
  if (!emergencyForm.name || !emergencyForm.phone) {
    uni.showToast({ title: '请填写联系人信息', icon: 'none' })
    return
  }
  form.emergencyName = emergencyForm.name
  form.emergencyPhone = emergencyForm.phone
  speak('紧急联系人已更新')
  vibrateShort({ style: 'light' })
  showEmergencyEditor.value = false
  uni.showToast({ title: '已保存', icon: 'success' })
}

function saveProfile() {
  vibrateShort({ style: 'light' })
  uni.showToast({ title: '信息已保存', icon: 'success' })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 40rpx 32rpx 120rpx;
  background: #f5f7fb;
}
.header-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 32rpx;
  padding: 36rpx;
  color: #fff;
  box-shadow: 0 20rpx 40rpx rgba(102, 126, 234, 0.3);
}
.avatar-block {
  display: flex;
  align-items: center;
  gap: 24rpx;
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60rpx;
}
.name {
  font-size: 50rpx;
  font-weight: 600;
}
.tagline {
  display: block;
  font-size: 28rpx;
  opacity: 0.9;
}
.avatar-btn {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 12rpx 28rpx;
  border-radius: 999rpx;
  font-size: 28rpx;
}
.form-section {
  margin-top: 40rpx;
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.04);
}
.form-group {
  margin-bottom: 28rpx;
}
.label {
  display: block;
  font-size: 30rpx;
  color: #5c6673;
  margin-bottom: 12rpx;
}
.input, .picker-value {
  width: 100%;
  background: #f4f6fb;
  border-radius: 20rpx;
  padding: 26rpx;
  font-size: 32rpx;
}
.helper-card {
  margin-top: 32rpx;
  background: #fff;
  border-radius: 28rpx;
  padding: 28rpx;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.04);
}
.helper-title {
  font-size: 32rpx;
  font-weight: 600;
}
.helper-row {
  display: flex;
  justify-content: space-between;
  margin: 16rpx 0;
  color: #5c6673;
}
.link-btn {
  color: #667eea;
  font-size: 28rpx;
}
.save-btn {
  margin-top: 40rpx;
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 999rpx;
  height: 110rpx;
  font-size: 34rpx;
}
.overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  z-index: 10;
}
.editor-card {
  background: #fff;
  border-radius: 32rpx;
  width: 100%;
  padding: 32rpx;
  box-shadow: 0 30rpx 60rpx rgba(0, 0, 0, 0.15);
}
.editor-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
}
.close-btn {
  background: transparent;
  color: #9aa3b9;
  font-size: 40rpx;
}
.editor-form {
  margin-bottom: 24rpx;
}
.editor-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}
.ghost {
  background: #f3f4f8;
  color: #5c6673;
  border-radius: 999rpx;
  padding: 0 48rpx;
  height: 96rpx;
}
.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 999rpx;
  padding: 0 48rpx;
  height: 96rpx;
}
</style>

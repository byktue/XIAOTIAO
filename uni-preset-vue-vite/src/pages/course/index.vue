<template>
  <view class="page">
    <!-- 状态栏 -->
    <view class="status-bar">
      <text>9:41</text>
      <text>📶 🔋</text>
    </view>

    <!-- 英雄区 -->
    <view class="hero">
      <text class="hero-title">课程学习</text>
      <text class="hero-sub">精选课程 + 适老化交互，让学习更轻松</text>
      <view class="search-bar">
        <text class="search-icon">🔍</text>
        <input
          :value="keyword"
          placeholder="搜索课程、讲师或关键词"
          aria-label="课程搜索输入框"
          title="搜索课程、讲师或关键词"
          @focus="onSearchFocus"
          @input="onInput"
          @confirm="onSearchConfirm"
        />
      </view>
    </view>

    <!-- 分类导航 -->
    <scroll-view class="categories" :class="{ shake: filterFeedback }" scroll-x :show-scrollbar="false">
      <view class="cate-row">
        <view v-for="c in categories" :key="c.key" class="cate" :class="{active: c.key===activeKey}" @tap="() => selectCate(c.key)">{{ c.name }}</view>
      </view>
    </scroll-view>

    <!-- 课程形式筛选（与分类样式完全相同） -->
    <scroll-view class="categories" :class="{ shake: filterFeedback }" scroll-x :show-scrollbar="false">
      <view class="cate-row">
        <view v-for="f in formTypes" :key="f.key" class="cate" :class="{active: f.key===activeFormKey}" @tap="() => selectForm(f.key)">{{ f.name }}</view>
      </view>
    </scroll-view>

    <view v-if="resultHint" class="result-hint" :class="{ alert: filterFeedback }">
      <text>{{ resultHint }}</text>
    </view>

    <!-- 精选推荐 -->
    <view class="section">
      <view class="sec-head">
        <text class="sec-title">精选推荐</text>
        <text class="more" @tap="() => openAll('featured')">查看更多</text>
      </view>
      <view class="featured">
        <view v-for="item in filteredFeatured" :key="item.id" class="feat-card animate" @tap="() => openDetail(item)">
          <view class="feat-img"></view>
          <view class="feat-body">
            <text class="feat-title">{{ item.title }}</text>
            <view class="meta">
              <text>⭐ {{ item.rate }}</text>
              <text>👨‍🏫 {{ item.teacher }}</text>
              <text>⏱️ {{ item.duration }}</text>
            </view>
            <!-- 课程形式标签 + 分类标签 -->
            <view class="course-tags">
              <view class="course-tag" :class="getCourseTypeClass(item.courseType)">{{ item.courseType }}</view>
              <view v-for="tag in item.tags" :key="tag" class="category-tag">{{ getTagName(tag) }}</view>
            </view>
            <text class="price">{{ item.price }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 热门课程 -->
    <view class="section">
      <view class="sec-head">
        <text class="sec-title">热门课程</text>
        <text class="more" @tap="() => openAll('hot')">查看全部</text>
      </view>
      <view class="grid">
        <view v-for="item in filteredCourses" :key="item.id" class="card animate" @tap="() => openDetail(item)">
          <view class="thumb" :style="item.thumbStyle">
            <text class="thumb-ico">{{ item.emoji }}</text>
            <view v-if="item.badge" class="badge">{{ item.badge }}</view>
            <view v-if="item.promo" class="promo-badge">推荐产品</view>
          </view>
          <view class="body">
            <text class="title">{{ item.title }}</text>
            <text class="desc">{{ item.desc }}</text>
            <view class="info">
              <text>⏱️ {{ item.duration }}</text>
              <text class="difficulty" :class="difficultyClass(item.difficulty)">{{ item.difficulty }}</text>
            </view>
            <!-- 课程形式标签 + 分类标签 -->
            <view class="course-tags">
              <view class="course-tag" :class="getCourseTypeClass(item.courseType)">{{ item.courseType }}</view>
              <view v-for="tag in item.tags" :key="tag" class="category-tag">{{ getTagName(tag) }}</view>
            </view>
          </view>
          <view v-if="item.promo" class="promo">
            <text class="promo-title">{{ item.promo.title }}</text>
            <text class="promo-desc">{{ item.promo.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 最近学习 -->
    <view class="section">
      <view class="sec-head">
        <text class="sec-title">最近学习</text>
        <text class="more" @tap="() => openAll('recent')">查看全部</text>
      </view>
      <view class="grid">
        <view class="card animate">
          <view class="thumb" style="background: linear-gradient(45deg,#00b894,#55efc4)">
            <text class="thumb-ico">📸</text>
          </view>
          <view class="body">
            <text class="title">手机摄影基础</text>
            <text class="desc">构图与光线入门，拍出清晰好照片。</text>
            <view class="info">
              <text>⏱️ 1小时</text>
              <text class="difficulty diff-easy">简单</text>
            </view>
            <!-- 课程形式标签 + 分类标签 -->
            <view class="course-tags">
              <view class="course-tag tag-video">视频课程</view>
              <view class="category-tag">兴趣娱乐</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="spacer" />
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { speak, vibrateShort } from '../../services/voice.js'

const categories = ref([
  { key: 'all', name: '全部' },
  { key: 'digital', name: '基础数码' },
  { key: 'health', name: '健康养生' },
  { key: 'life', name: '生活技能' },
  { key: 'hobby', name: '兴趣娱乐' },
  { key: 'smartphone', name: '智能手机' },
  { key: 'wechat', name: '微信操作' }
])

// 课程形式筛选数据（与分类样式完全一致）
const formTypes = ref([
  { key: 'all', name: '全部形式' },
  { key: 'video', name: '视频课程' },
  { key: 'text', name: '图文教程' },
  { key: 'live', name: '直播课程' },
  { key: 'practice', name: '实操课程' }
])

const activeKey = ref('all') // 分类激活状态
const activeFormKey = ref('all') // 形式激活状态
const keyword = ref('')
const resultHint = ref('')
const filterFeedback = ref(false)

// 课程形式映射（便于管理）
const courseTypeMap = {
  video: '视频课程',
  text: '图文教程',
  live: '直播课程',
  practice: '实操课程'
}

// 分类标签名称映射
const tagNameMap = {
  digital: '基础数码',
  smartphone: '智能手机',
  wechat: '微信操作',
  health: '健康养生',
  life: '生活技能',
  hobby: '兴趣娱乐'
}

const featured = ref([
  { 
    id: 'f1', 
    title: '智能手机入门基础教程', 
    teacher: '张老师', 
    rate: '4.8', 
    duration: '2小时', 
    price: '免费', 
    cover: 'https://picsum.photos/seed/phone/200/200', 
    tags: ['digital','smartphone'],
    courseType: courseTypeMap.video, // 视频课程
    formKey: 'video' // 用于筛选的形式key
  },
  { 
    id: 'f2', 
    title: '微信使用技巧大全', 
    teacher: '王老师', 
    rate: '4.7', 
    duration: '1.5小时', 
    price: '¥29', 
    cover: 'https://picsum.photos/seed/wechat/200/200', 
    tags: ['digital','wechat'],
    courseType: courseTypeMap.text, // 图文教程
    formKey: 'text' // 用于筛选的形式key
  }
])

const courses = ref([
  { 
    id: 'c1', 
    title: '智能手机入门基础教程', 
    desc: '学习拨号、短信、相册与常用设置，从零上手。', 
    duration: '2小时', 
    emoji: '📱', 
    badge: '热门', 
    difficulty: '简单', 
    tags: ['digital','smartphone'], 
    thumbStyle: 'background: linear-gradient(45deg, #667eea, #764ba2)',
    promo: { title: '📱 推荐产品', desc: '大屏智能手机（大字体/简易桌面/一键求助）' },
    courseType: courseTypeMap.video,
    formKey: 'video'
  },
  { 
    id: 'c2', 
    title: '微信使用技巧大全', 
    desc: '添加好友、语音消息、视频通话与朋友圈分享。', 
    duration: '1.5小时', 
    emoji: '💬', 
    difficulty: '中等', 
    tags: ['digital','wechat'],
    thumbStyle: 'background: linear-gradient(45deg,#4ecdc4,#44a08d)',
    courseType: courseTypeMap.text,
    formKey: 'text'
  },
  { 
    id: 'c3', 
    title: '中老年人健康养生指南', 
    desc: '饮食、运动与心理调节，科学守护健康。', 
    duration: '3小时', 
    emoji: '❤️', 
    badge: '健康', 
    difficulty: '简单', 
    tags: ['health'], 
    thumbStyle: 'background: linear-gradient(45deg,#fd79a8,#fdcb6e)',
    promo: { title: '❤️ 推荐产品', desc: '智能血压计（自动记录，家属远程查看）' },
    courseType: courseTypeMap.live,
    formKey: 'live'
  },
  { 
    id: 'c4', 
    title: '老年人网购安全指南', 
    desc: '识别骗局、安全支付与售后维权，安心网购。', 
    duration: '2小时', 
    emoji: '🛒', 
    difficulty: '中等', 
    tags: ['life'],
    thumbStyle: 'background: linear-gradient(45deg,#6c5ce7,#a29bfe)',
    courseType: courseTypeMap.practice,
    formKey: 'practice'
  }
])

// 双重筛选：分类 + 形式 + 关键词
const filteredFeatured = computed(() => {
  const k = activeKey.value
  const fk = activeFormKey.value
  const kw = keyword.value.trim()
  return featured.value.filter(i => 
    (k === 'all' || i.tags.includes(k)) && // 分类筛选
    (fk === 'all' || i.formKey === fk) && // 形式筛选
    (kw === '' || matchKw(i, kw)) // 关键词筛选
  )
})

const filteredCourses = computed(() => {
  const k = activeKey.value
  const fk = activeFormKey.value
  const kw = keyword.value.trim()
  return courses.value.filter(i => 
    (k === 'all' || i.tags.includes(k)) && // 分类筛选
    (fk === 'all' || i.formKey === fk) && // 形式筛选
    (kw === '' || matchKw(i, kw)) // 关键词筛选
  )
})

function matchKw(item, kw) {
  return item.title.includes(kw) || (item.desc && item.desc.includes(kw)) || (item.teacher && item.teacher.includes(kw))
}

// 分类选择
function selectCate(k) {
  if (activeKey.value === k) {
    speak(`已处于${getCategoryLabel(k)}分类`)
    return
  }
  activeKey.value = k
  speak(`已切换到${getCategoryLabel(k)}分类`)
}

// 形式选择（与分类交互逻辑完全相同）
function selectForm(fk) {
  if (activeFormKey.value === fk) {
    speak(`已处于${getFormLabel(fk)}`)
    return
  }
  activeFormKey.value = fk
  speak(`已切换到${getFormLabel(fk)}`)
}

function onInput(e) {
  keyword.value = e.detail.value
}

function onSearchFocus() {
  speak('搜索框已激活，可输入课程、讲师或关键字')
}

function onSearchConfirm() {
  if (!keyword.value.trim()) {
    showHint('请输入要搜索的内容', { warning: true, voice: true })
    return
  }
  speak(`正在搜索 ${keyword.value.trim()}，请稍候`)
}

function difficultyClass(d) {
  if (d === '简单') return 'diff-easy'
  if (d === '中等') return 'diff-mid'
  return ''
}

// 获取课程形式标签样式类
function getCourseTypeClass(type) {
  switch(type) {
    case courseTypeMap.video:
      return 'tag-video'
    case courseTypeMap.text:
      return 'tag-text'
    case courseTypeMap.live:
      return 'tag-live'
    case courseTypeMap.practice:
      return 'tag-practice'
    default:
      return ''
  }
}

// 获取分类标签显示名称
function getTagName(tagKey) {
  return tagNameMap[tagKey] || tagKey
}

function openDetail(item) {
  speak(`即将打开课程 ${item.title}`)
  uni.showToast({ title: `打开：${item.title}`, icon: 'none' })
}

function openAll(section) {
  // navigate to unified 'all' page for courses, pass section as query
  uni.navigateTo({ url: `/pages/course/all?section=${section}` })
}

function getCategoryLabel(key) {
  if (key === 'all') return '全部'
  return categories.value.find(c => c.key === key)?.name || '全部'
}

function getFormLabel(key) {
  if (key === 'all') return '全部形式'
  return formTypes.value.find(f => f.key === key)?.name || '全部形式'
}

let hintTimer = null
function showHint(message, options = {}) {
  resultHint.value = message
  filterFeedback.value = !!options.warning
  if (filterFeedback.value && options.vibrate !== false) {
    feedbackPulse()
  }
  if (options.voice) {
    speak(message)
  }
  if (hintTimer) {
    clearTimeout(hintTimer)
  }
  hintTimer = setTimeout(() => {
    resultHint.value = ''
    filterFeedback.value = false
  }, options.warning ? 2400 : 1600)
}

function feedbackPulse() {
  vibrateShort({ style: 'heavy' })
}

let hasAnnouncedCourse = false
watch(
  () => filteredCourses.value.length,
  (count) => {
    if (!hasAnnouncedCourse) {
      hasAnnouncedCourse = true
      if (count > 0) {
        speak(`当前共有${count}门课程可供学习`)
      }
      return
    }
    if (count === 0) {
      showHint('没有匹配的课程，请尝试调整筛选条件', { warning: true, voice: true })
    } else {
      showHint(`已筛选出${count}门课程`, { voice: true })
    }
  }
)
</script>

<style scoped>
.page {
  background: linear-gradient(180deg, #f7f9fc 0%, #edf1f7 100%);
  min-height: 100vh;
  color: #1c2333;
  font-size: 36rpx;
  line-height: 1.7;
}

/* 状态栏 */
.status-bar {
  height: 96rpx;
  background: linear-gradient(135deg, #5b71ff 0%, #7a6bff 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48rpx;
  font-weight: 600;
  font-size: 34rpx;
}

/* 英雄区 */
.hero {
  background: linear-gradient(135deg, #5b71ff 0%, #8f6bff 100%);
  color: #fff;
  padding: 52rpx 40rpx 60rpx;
  border-bottom-left-radius: 40rpx;
  border-bottom-right-radius: 40rpx;
  box-shadow: 0 18rpx 40rpx rgba(91, 113, 255, .35);
}
.hero-title {
  font-size: 58rpx;
  font-weight: 700;
  margin-bottom: 16rpx;
}
.hero-sub {
  opacity: .95;
  font-size: 34rpx;
  margin-bottom: 32rpx;
  display: block;
}
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255,255,255,.25);
  border-radius: 999rpx;
  padding: 26rpx 36rpx;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
.search-icon {
  position: absolute;
  left: 40rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 38rpx;
  pointer-events: none;
}
.search-bar input {
  border: none; 
  outline: none; 
  width: 100%; 
  background: transparent; 
  color: #fff; 
  font-size: 34rpx;
  padding-left: 88rpx;
}

/* 分类导航 + 形式筛选（样式完全共用） */
.categories {
  background: #fff;
  border-bottom: 2rpx solid #e9ecef;
  overflow-x: auto;
}
.categories.shake {
  animation: shakeX .45s ease;
}
.cate-row {
  display: flex;
  gap: 28rpx;
  padding: 32rpx 32rpx;
}
.cate {
  flex: 0 0 auto;
  min-width: 210rpx;
  text-align: center;
  background: #f5f6f8;
  color: #5c6673;
  border: 2rpx solid #e9ecef;
  border-radius: 999rpx;
  padding: 24rpx 36rpx;
  font-size: 32rpx;
  cursor: pointer;
  user-select: none;
  transition: .2s all;
}
.cate:active { transform: scale(.95); }
.cate.active { 
  color: #fff; 
  background: linear-gradient(135deg, #5b71ff 0%, #8f6bff 100%);
  border-color: transparent; 
}

/* 区块与卡片 */
.section {
  padding: 40rpx 34rpx;
}
.result-hint {
  margin: 12rpx 34rpx 0;
  padding: 24rpx 32rpx;
  border-radius: 32rpx;
  background: rgba(91, 113, 255, 0.12);
  color: #5b71ff;
  font-size: 32rpx;
  line-height: 1.5;
}
.result-hint.alert {
  background: rgba(255, 107, 107, 0.18);
  color: #c0392b;
}
.sec-head { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  margin-bottom: 28rpx;
}
.sec-title {
  font-size: 44rpx;
  font-weight: 700;
}
.more {
  color: #5b71ff;
  font-size: 32rpx;
  text-decoration: none;
}

.featured {
  display: flex;
  flex-direction: column;
  gap: 26rpx;
}
.feat-card {
  display: flex;
  gap: 28rpx;
  background: #fff;
  border: 2rpx solid #f0f1f3;
  border-radius: 32rpx;
  padding: 32rpx;
  box-shadow: 0 12rpx 32rpx rgba(92, 109, 143, .08);
}
.feat-img { 
  width: 180rpx;
  height: 180rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #5b71ff, #8f6bff);
  flex-shrink: 0; 
}
.feat-body { flex: 1; display: flex; flex-direction: column; gap: 12rpx; }
.feat-title { 
  font-weight: 700;
  font-size: 38rpx;
}
.meta { 
  display: flex;
  gap: 24rpx;
  color: #5c6673;
  font-size: 30rpx;
}
.price { 
  color: #ff6b6b;
  font-weight: 800;
  font-size: 34rpx;
}

.grid {
  display: grid;
  gap: 28rpx;
}
.card {
  background: #fff;
  border: 2rpx solid #f0f1f3;
  border-radius: 40rpx;
  overflow: hidden;
  box-shadow: 0 12rpx 32rpx rgba(92, 109, 143, .08);
  transition: transform .2s, box-shadow .2s; 
  cursor: pointer;
}
.card:active { 
  transform: scale(.98); 
  box-shadow: 0 2rpx 16rpx rgba(0,0,0,.08); 
}
.thumb {
  height: 280rpx;
  background: linear-gradient(135deg, #5b71ff, #8f6bff);
  position: relative; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  color: #fff; 
  font-size: 90rpx;
}
.badge { 
  position: absolute; 
  top: 16rpx; 
  right: 16rpx; 
  font-size: 24rpx; 
  font-weight: 700; 
  padding: 8rpx 16rpx; 
  border-radius: 16rpx; 
  background: rgba(255,255,255,.95); 
  color: #667eea; 
}
.promo-badge { 
  position: absolute; 
  top: 16rpx; 
  left: 16rpx; 
  background: linear-gradient(135deg, #667eea, #764ba2); 
  color: #fff; 
  padding: 8rpx 16rpx; 
  border-radius: 16rpx; 
  font-size: 24rpx; 
  font-weight: 700; 
}
.body {
  padding: 32rpx;
}
.title {
  font-size: 38rpx;
  font-weight: 700;
  margin-bottom: 16rpx;
  color: #1c2333;
}
.desc {
  font-size: 32rpx;
  color: #5c6673;
  margin-bottom: 20rpx;
  line-height: 1.6;
}
.info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #5c6673;
  font-size: 30rpx;
  margin-bottom: 18rpx;
}
.difficulty { 
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 30rpx;
  background: #f0f2f5;
}
.diff-easy { 
  background: #e8f5e8; 
  color: #2e7d32; 
}
.diff-mid { 
  background: #fff3cd; 
  color: #c27a00; 
}

/* 课程标签样式（适老化设计） */
.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 18rpx;
  margin-top: 18rpx;
}
.course-tag {
  padding: 14rpx 28rpx;
  border-radius: 999rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
  background: #5b71ff;
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
}
/* 不同课程形式的颜色区分 */
.tag-video {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}
.tag-text {
  background: linear-gradient(135deg, #3498db, #2980b9);
}
.tag-live {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}
.tag-practice {
  background: linear-gradient(135deg, #f39c12, #d35400);
}
/* 分类标签样式 */
.category-tag {
  padding: 12rpx 24rpx;
  border-radius: 999rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #5c6673;
  background: #edf1f5;
}

/* 课程内推广位 */
.promo {
  background: linear-gradient(135deg, #5b71ff12 0%, #8f6bff12 100%);
  border-left: 8rpx solid #5b71ff;
  border-radius: 28rpx;
  padding: 28rpx;
  margin: 16rpx 4rpx;
}
.promo-title {
  color: #5b71ff;
  font-size: 36rpx;
  margin-bottom: 12rpx;
  display: block;
}
.promo-desc {
  font-size: 32rpx;
  color: #5c6673;
}

/* 动效 */
@keyframes fadeUp { 
  from { opacity: 0; transform: translateY(32rpx) } 
  to { opacity: 1; transform: translateY(0) } 
}
.animate { 
  animation: fadeUp .5s ease-out; 
}

@keyframes shakeX {
  0% { transform: translateX(0); }
  25% { transform: translateX(-12rpx); }
  50% { transform: translateX(12rpx); }
  75% { transform: translateX(-8rpx); }
  100% { transform: translateX(0); }
}

.spacer { 
  height: 80rpx; 
  padding-bottom: constant(safe-area-inset-bottom); 
  padding-bottom: env(safe-area-inset-bottom); 
}
</style>
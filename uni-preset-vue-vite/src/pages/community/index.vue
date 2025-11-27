<template>
  <view class="page">
    <!-- 状态栏 -->
    <view class="status-bar">
      <text>9:41</text>
      <text>📶 🔋</text>
    </view>

    <!-- 英雄区 -->
    <view class="hero">
      <text class="hero-title">社区交流</text>
      <text class="hero-sub">分享经验，互助交流，共同成长</text>
      <view class="search-bar">
        <text>🔍</text>
        <input :value="keyword" placeholder="搜索话题、内容或用户" @input="onInput" />
      </view>
    </view>

    <!-- 分类导航 -->
    <scroll-view class="categories" scroll-x :show-scrollbar="false">
      <view class="cate-row">
        <view v-for="c in categories" :key="c.key" class="cate" :class="{active: c.key===activeKey}" @tap="() => selectCate(c.key)">{{ c.name }}</view>
      </view>
    </scroll-view>

    <!-- 热门话题 -->
    <view class="section">
      <view class="sec-head">
        <text class="sec-title">热门话题</text>
        <text class="more">查看更多</text>
      </view>
      <view class="topics">
        <view v-for="topic in filteredTopics" :key="topic.id" class="topic-card animate" @tap="() => openTopic(topic)">
          <view class="topic-header">
            <text class="topic-tag"># {{ topic.tag }}</text>
            <text class="topic-time">{{ topic.time }}</text>
          </view>
          <text class="topic-title">{{ topic.title }}</text>
          <view class="topic-stats">
            <text>💬 {{ topic.replies }}回复</text>
            <text>👀 {{ topic.views }}浏览</text>
            <text>🔥 {{ topic.hot }}热度</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 经验分享 -->
    <view class="section">
      <view class="sec-head">
        <text class="sec-title">经验分享</text>
        <text class="more">查看全部</text>
      </view>
      <view class="posts">
        <view v-for="post in filteredPosts" :key="post.id" class="post-card animate" @tap="() => openPost(post)">
          <view class="post-header">
            <view class="user-info">
              <view class="avatar">{{ post.avatar }}</view>
              <view class="user-detail">
                <text class="username">{{ post.username }}</text>
                <text class="user-time">{{ post.time }}</text>
              </view>
            </view>
            <view class="follow-btn" @tap.stop="() => toggleFollow(post)">
              <text>{{ post.isFollowed ? '已关注' : '+关注' }}</text>
            </view>
          </view>
          <text class="post-content">{{ post.content }}</text>
          <view v-if="post.images" class="post-images">
            <view v-for="(img, idx) in post.images" :key="idx" class="post-img">{{ img }}</view>
          </view>
          <view class="post-actions">
            <view class="action-btn" :class="{active: post.isLiked}" @tap.stop="() => toggleLike(post)">
              <text>{{ post.isLiked ? '❤️' : '🤍' }} {{ post.likes }}</text>
            </view>
            <view class="action-btn" @tap.stop="() => openComments(post)">
              <text>💬 {{ post.comments }}</text>
            </view>
            <view class="action-btn" @tap.stop="() => sharePost(post)">
              <text>📤 分享</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 发布按钮 -->
    <view class="publish-btn" @tap="openPublish">
      <text>✍️</text>
    </view>

    <!-- 评论回复弹窗（适老化设计） -->
    <view class="comment-modal" v-if="showCommentModal" @tap="closeCommentModal">
      <view class="comment-content" @tap.stop>
        <!-- 弹窗头部 - 显示楼主账号名 -->
        <view class="comment-header">
          <text class="close-btn" @tap.stop="closeCommentModal">❌</text>
          <text class="comment-title">{{ currentPost?.username }}的经验分享</text>
          <view class="empty"></view> <!-- 占位，保持居中 -->
        </view>

        <!-- 帖子预览 - 中下方添加带分割线的"评论区"标识 -->
        <view class="post-preview">
          <view class="user-info">
            <view class="avatar">{{ currentPost?.avatar }}</view>
            <view class="user-detail">
              <text class="username">{{ currentPost?.username }}</text>
              <text class="user-time">{{ currentPost?.time }}</text>
            </view>
          </view>
          <text class="post-content">{{ currentPost?.content }}</text>
          <!-- 带两侧分割线的评论区分隔标识（中下方） -->
          <view class="comment-section-divider">
            <view class="divider-line"></view>
            <view class="comment-section-label">
              <text>💬 评论区</text>
            </view>
            <view class="divider-line"></view>
          </view>
        </view>

        <!-- 评论列表 -->
        <scroll-view class="comment-list" scroll-y>
          <view v-if="currentPost?.commentsList.length === 0" class="no-comment">
            <text>暂无评论，快来抢沙发～</text>
          </view>
          <view v-for="comment in currentPost?.commentsList" :key="comment.id" class="comment-item">
            <view class="comment-header">
              <view class="user-info">
                <view class="avatar">{{ comment.avatar }}</view>
                <view class="user-detail">
                  <text class="username">{{ comment.username }}</text>
                  <text class="user-time">{{ comment.time }}</text>
                </view>
              </view>
              <view class="comment-actions">
                <view class="action-btn" :class="{active: comment.isLiked}" @tap.stop="() => toggleCommentLike(comment)">
                  <text>{{ comment.isLiked ? '❤️' : '🤍' }} {{ comment.likes }}</text>
                </view>
                <view class="reply-btn" @tap.stop="() => openReply(comment)">
                  <text>回复</text>
                </view>
              </view>
            </view>
            <text class="comment-content">{{ comment.content }}</text>

            <!-- 回复列表 -->
            <view class="reply-list" v-if="comment.replies.length > 0">
              <view v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                <view class="user-info">
                  <view class="avatar mini">{{ reply.avatar }}</view>
                  <view class="user-detail">
                    <text class="username">{{ reply.username }}</text>
                    <text class="user-time">{{ reply.time }}</text>
                  </view>
                </view>
                <text class="reply-content">{{ reply.content }}</text>
                <view class="reply-action" @tap.stop="() => openReply(comment, reply)">
                  <text>回复</text>
                </view>
              </view>
            </view>

            <!-- 回复输入框（针对当前评论） -->
            <view class="reply-input" v-if="replyToComment?.id === comment.id">
              <input 
                :value="replyInput" 
                @input="(e) => replyInput = e.detail.value" 
                placeholder="输入回复内容..." 
              />
              <view class="reply-btn-group">
                <view class="cancel-btn" @tap.stop="cancelReply">取消</view>
                <view class="send-btn" @tap.stop="() => sendReply(comment)">发送</view>
              </view>
            </view>
          </view>
        </scroll-view>

        <!-- 新增评论输入框 -->
        <view class="add-comment">
          <input 
            :value="commentInput" 
            @input="(e) => commentInput = e.detail.value" 
            placeholder="发表你的看法..." 
          />
          <view class="send-btn" @tap.stop="sendComment">发送</view>
        </view>
      </view>
    </view>

    <!-- 新增：发帖类型选择弹窗（从下往上弹出） -->
    <view class="publish-modal" v-if="showPublishModal" @tap="closePublishModal">
      <view class="publish-content" @tap.stop>
        <text class="publish-title">选择发帖类型</text>
        <view class="publish-buttons">
          <view class="publish-btn-type" @tap.stop="() => selectPostType('topic')">
            <text class="icon">📢</text>
            <text class="text">发起话题</text>
          </view>
          <view class="publish-btn-type" @tap.stop="() => selectPostType('post')">
            <text class="icon">📝</text>
            <text class="text">经验分享</text>
          </view>
        </view>
        <view class="cancel-publish" @tap.stop="closePublishModal">
          <text>取消</text>
        </view>
      </view>
    </view>

    <!-- 新增：发帖输入界面（从下往上弹出） -->
    <view class="post-input-modal" v-if="showPostInput" @tap="closePostInput">
      <view class="post-input-content" @tap.stop>
        <!-- 输入界面头部 -->
        <view class="post-input-header">
          <view class="back-btn" @tap.stop="goBackToSelect">
            <text>← 退出</text>
          </view>
          <text class="post-input-title">{{ postType === 'topic' ? '发起话题' : '经验分享' }}</text>
          <view class="send-btn" @tap.stop="submitPost">
            <text>发送</text>
          </view>
        </view>

        <!-- 话题输入表单（标题+内容） -->
        <view class="post-input-form" v-if="postType === 'topic'">
          <input 
            v-model="topicForm.title" 
            class="topic-title-input" 
            placeholder="请输入话题标题（必填）" 
          />
          <textarea 
            v-model="topicForm.content" 
            class="topic-content-input" 
            placeholder="请输入话题描述（可选）" 
          />
          <view class="topic-tag-select">
            <text class="label">选择标签：</text>
            <view class="tag-buttons">
              <view v-for="tag in topicTags" :key="tag.key" class="tag-btn" :class="{active: topicForm.tag === tag.key}" @tap.stop="() => topicForm.tag = tag.key">
                {{ tag.name }}
              </view>
            </view>
          </view>
        </view>

        <!-- 经验分享输入表单（内容） -->
        <view class="post-input-form" v-if="postType === 'post'">
          <textarea 
            v-model="postForm.content" 
            class="post-content-input" 
            placeholder="请分享你的经验、心得或问题（必填）" 
          />
          <view class="post-tag-select">
            <text class="label">选择标签：</text>
            <view class="tag-buttons">
              <view v-for="tag in postTags" :key="tag.key" class="tag-btn" :class="{active: postForm.tag === tag.key}" @tap.stop="() => postForm.tag = tag.key">
                {{ tag.name }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 发送成功提示 -->
    <view class="success-toast" v-if="showSuccessToast">
      <text>发送成功</text>
    </view>

    <view class="spacer" />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const categories = ref([
  { key: 'all', name: '全部' },
  { key: 'health', name: '健康养生' },
  { key: 'digital', name: '数码技巧' },
  { key: 'life', name: '生活经验' },
  { key: 'hobby', name: '兴趣爱好' },
  { key: 'help', name: '互助问答' },
  { key: 'activity', name: '同城活动' }
])

const activeKey = ref('all')
const keyword = ref('')

// 评论相关响应式数据（原有）
const showCommentModal = ref(false)
const currentPost = ref(null)
const commentInput = ref('')
const replyInput = ref('')
const replyToComment = ref(null)
const replyToReply = ref(null)

// 新增：发帖相关响应式数据
const showPublishModal = ref(false) // 发帖类型选择弹窗
const showPostInput = ref(false) // 发帖输入界面
const postType = ref('') // 发帖类型：'topic'（话题）/'post'（经验分享）
const showSuccessToast = ref(false) // 发送成功提示

// 话题表单数据
const topicForm = ref({
  title: '',
  content: '',
  tag: 'digital' // 默认标签
})

// 经验分享表单数据
const postForm = ref({
  content: '',
  tag: 'digital' // 默认标签
})

// 话题可用标签
const topicTags = ref([
  { key: 'digital', name: '数码技巧' },
  { key: 'health', name: '健康养生' },
  { key: 'life', name: '生活经验' },
  { key: 'hobby', name: '兴趣爱好' },
  { key: 'help', name: '互助问答' }
])

// 经验分享可用标签
const postTags = ref([
  { key: 'digital', name: '数码技巧' },
  { key: 'health', name: '健康养生' },
  { key: 'life', name: '生活经验' },
  { key: 'hobby', name: '兴趣爱好' },
  { key: 'help', name: '互助问答' },
  { key: 'activity', name: '同城活动' }
])

// 帖子数据（原有，新增commentsList字段支持评论）
const posts = ref([
  {
    id: 'p1',
    username: '张大爷',
    avatar: '👴',
    time: '1小时前',
    content: '今天学会了用微信视频通话，和孙子聊天真开心！分享给大家几个小技巧。',
    images: ['📱', '😊'],
    likes: 12,
    comments: 8,
    isLiked: false,
    isFollowed: false,
    tags: ['digital'],
    commentsList: [
      {
        id: 'c1',
        username: '刘阿姨',
        avatar: '👵',
        time: '30分钟前',
        content: '请问具体是怎么操作的呀？我还不会',
        likes: 3,
        isLiked: false,
        replies: [
          {
            id: 'r1',
            username: '张大爷',
            avatar: '👴',
            time: '20分钟前',
            content: '就是打开微信，找到联系人，点右上角的"+"号，里面有视频通话选项哦'
          },
          {
            id: 'r2',
            username: '李叔叔',
            avatar: '👨‍🦳',
            time: '15分钟前',
            content: '我补充一下，要确保双方都有网络才行～'
          }
        ]
      },
      {
        id: 'c2',
        username: '王大妈',
        avatar: '👵',
        time: '10分钟前',
        content: '谢谢分享！我也去试试',
        likes: 1,
        isLiked: true,
        replies: []
      }
    ]
  },
  {
    id: 'p2',
    username: '李大妈',
    avatar: '👵',
    time: '2小时前',
    content: '早上公园太极拳，身体很舒服。推荐给同龄朋友们，一起锻炼身体吧！',
    images: ['🌅', '🧘‍♀️'],
    likes: 25,
    comments: 15,
    isLiked: true,
    isFollowed: true,
    tags: ['health'],
    commentsList: [
      {
        id: 'c3',
        username: '赵大爷',
        avatar: '👴',
        time: '1小时前',
        content: '请问太极拳几点开始呀？我也想去',
        likes: 5,
        isLiked: false,
        replies: [
          {
            id: 'r3',
            username: '李大妈',
            avatar: '👵',
            time: '50分钟前',
            content: '早上6点半在人民公园东门集合，我们有专门的老师指导～'
          }
        ]
      }
    ]
  },
  {
    id: 'p3',
    username: '王大爷',
    avatar: '👨‍🦳',
    time: '3小时前',
    content: '今天在家做了红烧肉，孩子们都说好吃。年纪大了，做饭还是有一手的！',
    likes: 18,
    comments: 12,
    isLiked: false,
    isFollowed: false,
    tags: ['life'],
    commentsList: []
  }
])

// 话题数据（原有）
const topics = ref([
  { id: 't1', title: '如何使用智能手机拍出清晰照片？', tag: '数码技巧', time: '2小时前', replies: 23, views: 156, hot: 89, tags: ['digital'] },
  { id: 't2', title: '中老年人日常保健小贴士', tag: '健康养生', time: '3小时前', replies: 45, views: 289, hot: 156, tags: ['health'] },
  { id: 't3', title: '如何防范电信诈骗？', tag: '生活经验', time: '5小时前', replies: 67, views: 423, hot: 234, tags: ['life'] }
])

// 筛选逻辑（原有）
const filteredTopics = computed(() => {
  const k = activeKey.value
  const kw = keyword.value.trim()
  return topics.value.filter(i => (k==='all' || i.tags.includes(k)) && (kw==='' || matchKw(i, kw)))
})

const filteredPosts = computed(() => {
  const k = activeKey.value
  const kw = keyword.value.trim()
  return posts.value.filter(i => (k==='all' || i.tags.includes(k)) && (kw==='' || matchKw(i, kw)))
})

// 匹配关键词（原有）
function matchKw(item, kw) {
  return item.title?.includes(kw) || item.content?.includes(kw) || item.username?.includes(kw)
}

// 原有功能函数（保持不变）
function selectCate(k) {
  activeKey.value = k
}

function onInput(e) {
  keyword.value = e.detail.value
}

function openTopic(topic) {
  uni.showToast({ title: `进入话题：${topic.title}`, icon: 'none' })
}

function openPost(post) {
  uni.showToast({ title: `查看帖子：${post.username}的分享`, icon: 'none' })
}

function toggleLike(post) {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
  uni.showToast({ title: post.isLiked ? '已点赞' : '取消点赞', icon: 'success' })
}

function toggleFollow(post) {
  post.isFollowed = !post.isFollowed
  uni.showToast({ title: post.isFollowed ? '已关注' : '取消关注', icon: 'success' })
}

function openComments(post) {
  currentPost.value = post
  showCommentModal.value = true
  commentInput.value = ''
  replyInput.value = ''
  replyToComment.value = null
  replyToReply.value = null
}

function closeCommentModal() {
  showCommentModal.value = false
  setTimeout(() => {
    currentPost.value = null
  }, 300)
}

function toggleCommentLike(comment) {
  comment.isLiked = !comment.isLiked
  comment.likes += comment.isLiked ? 1 : -1
  uni.showToast({ title: comment.isLiked ? '已点赞' : '取消点赞', icon: 'success' })
}

function openReply(comment, reply = null) {
  replyToComment.value = comment
  replyToReply.value = reply
  replyInput.value = ''
  setTimeout(() => {
    const commentEl = uni.createSelectorQuery().in(this).select(`.comment-item-${comment.id}`)
    commentEl.boundingClientRect(rect => {
      if (rect) {
        uni.createSelectorQuery().in(this).select('.comment-list').scrollOffset(offset => {
          uni.createSelectorQuery().in(this).select('.comment-list').scrollTo({
            top: offset.scrollTop + rect.top - 100,
            animated: true
          })
        }).exec()
      }
    }).exec()
  }, 100)
}

function cancelReply() {
  replyInput.value = ''
  replyToComment.value = null
  replyToReply.value = null
}

function sendComment() {
  if (!commentInput.value.trim()) {
    uni.showToast({ title: '请输入评论内容', icon: 'none' })
    return
  }
  const newComment = {
    id: `c${Date.now()}`,
    username: '我',
    avatar: '👤',
    time: '刚刚',
    content: commentInput.value.trim(),
    likes: 0,
    isLiked: false,
    replies: []
  }
  currentPost.value.commentsList.unshift(newComment)
  currentPost.value.comments += 1
  commentInput.value = ''
  uni.showToast({ title: '评论成功', icon: 'success' })
}

function sendReply(comment) {
  if (!replyInput.value.trim()) {
    uni.showToast({ title: '请输入回复内容', icon: 'none' })
    return
  }
  const newReply = {
    id: `r${Date.now()}`,
    username: '我',
    avatar: '👤',
    time: '刚刚',
    content: replyInput.value.trim()
  }
  if (replyToReply.value) {
    newReply.content = `@${replyToReply.value.username} ${newReply.content}`
  } else {
    newReply.content = `@${comment.username} ${newReply.content}`
  }
  comment.replies.push(newReply)
  currentPost.value.comments += 1
  cancelReply()
  uni.showToast({ title: '回复成功', icon: 'success' })
}

function sharePost(post) {
  uni.showToast({ title: '分享成功', icon: 'success' })
}

// 新增：发帖功能相关函数
function openPublish() {
  showPublishModal.value = true
}

function closePublishModal() {
  showPublishModal.value = false
}

// 选择发帖类型
function selectPostType(type) {
  postType.value = type
  showPublishModal.value = false
  // 重置表单
  if (type === 'topic') {
    topicForm.value = { title: '', content: '', tag: 'digital' }
  } else {
    postForm.value = { content: '', tag: 'digital' }
  }
  // 延迟显示输入界面，保证动画流畅
  setTimeout(() => {
    showPostInput.value = true
  }, 300)
}

// 返回类型选择界面
function goBackToSelect() {
  showPostInput.value = false
  setTimeout(() => {
    showPublishModal.value = true
  }, 300)
}

// 关闭输入界面
function closePostInput() {
  showPostInput.value = false
}

// 提交发帖
function submitPost() {
  if (postType === 'topic') {
    // 验证话题表单
    if (!topicForm.value.title.trim()) {
      uni.showToast({ title: '请输入话题标题', icon: 'none' })
      return
    }
    // 生成新话题
    const newTopic = {
      id: `t${Date.now()}`,
      title: topicForm.value.title.trim(),
      tag: topicTags.value.find(t => t.key === topicForm.value.tag)?.name || '数码技巧',
      time: '刚刚',
      replies: 0,
      views: 1,
      hot: 1,
      tags: [topicForm.value.tag]
    }
    // 添加到话题列表最前面
    topics.value.unshift(newTopic)
  } else {
    // 验证经验分享表单
    if (!postForm.value.content.trim()) {
      uni.showToast({ title: '请输入分享内容', icon: 'none' })
      return
    }
    // 生成新帖子（支持点赞、评论）
    const newPost = {
      id: `p${Date.now()}`,
      username: '我',
      avatar: '👤',
      time: '刚刚',
      content: postForm.value.content.trim(),
      likes: 0,
      comments: 0,
      isLiked: false,
      isFollowed: false,
      tags: [postForm.value.tag],
      commentsList: [] // 空评论列表，支持后续评论
    }
    // 添加到帖子列表最前面
    posts.value.unshift(newPost)
  }

  // 显示成功提示
  showPostInput.value = false
  showSuccessToast.value = true
  // 3秒后隐藏提示
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}
</script>

<style scoped>
.page {
  background: linear-gradient(180deg, #f7f9fc 0%, #edf1f7 100%);
  min-height: 100vh;
  color: #1c2333;
  font-size: 36rpx;
  line-height: 1.7;
}

/* 状态栏（原有） */
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

/* 英雄区（原有） */
.hero {
  background: linear-gradient(135deg, #5b71ff 0%, #8f6bff 100%);
  color: #fff;
  padding: 48rpx 40rpx 56rpx;
  border-bottom-left-radius: 36rpx;
  border-bottom-right-radius: 36rpx;
  box-shadow: 0 18rpx 40rpx rgba(91, 113, 255, .35);
}
.hero-title {
  font-size: 56rpx;
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
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: rgba(255,255,255,.25);
  border-radius: 999rpx;
  padding: 28rpx 36rpx;
  backdrop-filter: blur(10px);
}
.search-bar input {
  border: none;
  outline: none;
  flex: 1;
  background: transparent;
  color: #fff;
  font-size: 34rpx;
}

/* 分类导航（原有） */
.categories {
  background: #fff;
  border-bottom: 2rpx solid #e9ecef;
  overflow-x: auto;
}
.cate-row {
  display: flex;
  gap: 28rpx;
  padding: 32rpx 32rpx;
}
.cate {
  flex: 0 0 auto;
  min-width: 176rpx;
  text-align: center;
  background: #f5f6f8;
  color: #5c6670;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
}

/* 区块与卡片（原有） */
.section {
  padding: 38rpx 34rpx;
}
.sec-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}
.sec-title {
  font-size: 42rpx;
  font-weight: 700;
}
.more {
  color: #5b71ff;
  font-size: 32rpx;
  text-decoration: none;
}

/* 话题卡片（原有） */
.topics {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.topic-card {
  background: #fff;
  border: 2rpx solid #f0f1f3;
  border-radius: 28rpx;
  padding: 32rpx;
  box-shadow: 0 10rpx 30rpx rgba(92, 109, 143, .09);
}
.topic-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}
.topic-tag {
  background: linear-gradient(135deg, #5b71ff, #8f6bff);
  color: #fff;
  padding: 6rpx 16rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 600;
}
.topic-time {
  color: #5c6673;
  font-size: 30rpx;
}
.topic-title {
  font-size: 38rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
  line-height: 1.5;
}
.topic-stats {
  display: flex;
  gap: 24rpx;
  color: #5c6673;
  font-size: 30rpx;
}

/* 帖子卡片（原有） */
.posts {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.post-card {
  background: #fff;
  border: 2rpx solid #f0f1f3;
  border-radius: 32rpx;
  padding: 32rpx;
  box-shadow: 0 12rpx 32rpx rgba(92, 109, 143, .08);
}
.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #5b71ff, #8f6bff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
}
.user-detail {
  display: flex;
  flex-direction: column;
}
.username {
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 4rpx;
}
.user-time {
  color: #5c6673;
  font-size: 30rpx;
}
.follow-btn {
  background: linear-gradient(135deg, #5b71ff, #8f6bff);
  color: #fff;
  padding: 18rpx 36rpx;
  border-radius: 999rpx;
  font-size: 32rpx;
  font-weight: 600;
}
.post-content {
  font-size: 36rpx;
  line-height: 1.7;
  margin-bottom: 20rpx;
}
.post-images {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
}
.post-img {
  width: 140rpx;
  height: 140rpx;
  border-radius: 16rpx;
  background: linear-gradient(45deg, #f0f2f5, #e9ecef);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
}
.post-actions {
  display: flex;
  gap: 36rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid #f0f1f3;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #5c6673;
  font-size: 32rpx;
  padding: 12rpx 18rpx;
  border-radius: 16rpx;
  transition: .2s all;
}
.action-btn:active {
  background: #f0f1f3;
}
.action-btn.active {
  color: #ff6b6b;
}

/* 发布按钮（原有） */
.publish-btn {
  position: fixed;
  bottom: 120rpx;
  right: 40rpx;
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
  z-index: 100;
  color: #fff;
  font-size: 48rpx;
}

/* 动效（原有） */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(32rpx) }
  to { opacity: 1; transform: translateY(0) }
}
.animate {
  animation: fadeUp .5s ease-out;
}

/* 评论弹窗（原有） */
.comment-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: flex-end;
  z-index: 999;
  animation: fadeIn .3s ease;
}
.comment-content {
  width: 100%;
  background: #fff;
  border-top-left-radius: 40rpx;
  border-top-right-radius: 40rpx;
  padding: 32rpx 24rpx;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}
.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}
.close-btn {
  font-size: 40rpx;
  color: #7b8794;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f0f2f5;
}
.comment-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1d2129;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
}
.empty {
  width: 60rpx;
}
.post-preview {
  background: #f8f9fa;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  position: relative;
  padding-bottom: 60rpx;
}
.post-preview .post-content {
  font-size: 30rpx;
  color: #5c6670;
  margin-bottom: 0;
}
.comment-section-divider {
  position: absolute;
  bottom: 20rpx;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 0 24rpx;
}
.divider-line {
  flex: 1;
  height: 2rpx;
  background: linear-gradient(90deg, transparent, #667eea33, transparent);
}
.comment-section-label {
  display: flex;
  align-items: center;
  gap: 12rpx;
  background: linear-gradient(135deg, #667eea12 0%, #764ba212 100%);
  padding: 10rpx 24rpx;
  border-radius: 999rpx;
}
.comment-section-label text {
  font-size: 30rpx;
  font-weight: 600;
  color: #667eea;
}
.comment-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 24rpx;
}
.no-comment {
  text-align: center;
  padding: 60rpx 0;
  color: #7b8794;
  font-size: 32rpx;
}
.comment-item {
  margin-bottom: 32rpx;
  padding-bottom: 24rpx;
  border-bottom: 2rpx solid #f0f1f3;
}
.comment-item:last-child {
  border-bottom: none;
  margin-bottom: 16rpx;
  padding-bottom: 0;
}
.comment-actions {
  display: flex;
  gap: 16rpx;
}
.reply-btn {
  color: #667eea;
  font-size: 28rpx;
  font-weight: 600;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  background: #f0f6ff;
}
.comment-content {
  font-size: 32rpx;
  margin: 16rpx 0;
  line-height: 1.6;
  color: #1d2129;
}
.reply-list {
  margin-left: 40rpx;
  margin-top: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.reply-item {
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.reply-item .avatar.mini {
  width: 60rpx;
  height: 60rpx;
  font-size: 24rpx;
}
.reply-content {
  font-size: 30rpx;
  color: #1d2129;
  line-height: 1.5;
}
.reply-action {
  align-self: flex-end;
  color: #667eea;
  font-size: 26rpx;
  font-weight: 600;
  margin-top: 8rpx;
}
.add-comment {
  display: flex;
  gap: 16rpx;
  align-items: center;
  background: #f0f2f5;
  border-radius: 999rpx;
  padding: 16rpx;
}
.add-comment input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 32rpx;
  padding: 16rpx;
  color: #1d2129;
  min-height: 80rpx;
}
.add-comment .send-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
  padding: 16rpx 32rpx;
  border-radius: 999rpx;
}
.reply-input {
  margin-top: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  background: #f0f2f5;
  border-radius: 24rpx;
  padding: 16rpx;
}
.reply-input input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 32rpx;
  padding: 16rpx;
  color: #1d2129;
  min-height: 80rpx;
}
.reply-btn-group {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
}
.cancel-btn {
  color: #7b8794;
  font-size: 28rpx;
  font-weight: 600;
  padding: 12rpx 24rpx;
  border-radius: 999rpx;
  background: #e9ecef;
}

/* 新增：发帖类型选择弹窗样式 */
.publish-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: flex-end;
  z-index: 999;
  animation: fadeIn .3s ease;
}
.publish-content {
  width: 100%;
  background: #fff;
  border-top-left-radius: 40rpx;
  border-top-right-radius: 40rpx;
  padding: 40rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 40rpx;
  animation: slideUp .3s ease;
}
.publish-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1d2129;
  text-align: center;
}
.publish-buttons {
  display: flex;
  gap: 32rpx;
  justify-content: center;
}
.publish-btn-type {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 24rpx;
  padding: 32rpx 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  min-width: 200rpx;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
}
.publish-btn-type .icon {
  font-size: 48rpx;
}
.publish-btn-type .text {
  font-size: 32rpx;
  font-weight: 600;
}
.cancel-publish {
  background: #f0f2f5;
  color: #7b8794;
  font-size: 32rpx;
  font-weight: 600;
  text-align: center;
  padding: 16rpx;
  border-radius: 999rpx;
  margin-top: 16rpx;
}

/* 新增：发帖输入界面样式 */
.post-input-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: flex-end;
  z-index: 999;
  animation: fadeIn .3s ease;
}
.post-input-content {
  width: 100%;
  background: #fff;
  border-top-left-radius: 40rpx;
  border-top-right-radius: 40rpx;
  padding: 32rpx 24rpx;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: slideUp .3s ease;
}
.post-input-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32rpx;
}
.back-btn {
  color: #7b8794;
  font-size: 32rpx;
  font-weight: 600;
}
.post-input-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1d2129;
}
.post-input-header .send-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  padding: 12rpx 24rpx;
  border-radius: 999rpx;
}
.post-input-form {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  flex: 1;
  overflow-y: auto;
}
.topic-title-input {
  background: #f0f2f5;
  border: none;
  outline: none;
  border-radius: 16rpx;
  padding: 24rpx;
  font-size: 32rpx;
  color: #1d2129;
}
.topic-content-input, .post-content-input {
  background: #f0f2f5;
  border: none;
  outline: none;
  border-radius: 16rpx;
  padding: 24rpx;
  font-size: 32rpx;
  color: #1d2129;
  min-height: 200rpx;
  line-height: 1.6;
  flex: 1;
}
.topic-tag-select, .post-tag-select {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.label {
  font-size: 30rpx;
  font-weight: 600;
  color: #1d2129;
}
.tag-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.tag-btn {
  background: #f0f2f5;
  color: #7b8794;
  font-size: 28rpx;
  padding: 12rpx 24rpx;
  border-radius: 999rpx;
}
.tag-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
}

/* 新增：发送成功提示 */
.success-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.7);
  color: #fff;
  font-size: 36rpx;
  font-weight: 600;
  padding: 24rpx 48rpx;
  border-radius: 16rpx;
  z-index: 9999;
  animation: fadeIn .3s ease;
}

/* 新增：从下往上弹出动画 */
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* 原有动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.spacer {
  height: 80rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
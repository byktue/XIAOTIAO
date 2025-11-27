<script>
export default {
  globalData: {
    registeredUsername: null
  },
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}

const tabLabels = ['首页', '课程', '购物', '社区', '我的']

function annotateTabIcons() {
  if (typeof document === 'undefined') return
  const tabItems = document.querySelectorAll('.uni-tabbar__item')
  tabItems.forEach((item, index) => {
    const img = item.querySelector('img')
    if (img) {
      const text = item.querySelector('.uni-tabbar__text')?.textContent?.trim()
      const label = text || tabLabels[index] || '导航'
      const desc = `${label}图标`
      if (!img.getAttribute('alt')) img.setAttribute('alt', desc)
      if (!img.getAttribute('title')) img.setAttribute('title', desc)
    }
  })
}

function annotateGenericImages() {
  if (typeof document === 'undefined') return
  document.querySelectorAll('img:not([alt])').forEach(img => {
    const placeholder = img.getAttribute('data-desc') || img.getAttribute('aria-label') || '装饰图标'
    img.setAttribute('alt', placeholder)
    if (!img.getAttribute('title')) {
      img.setAttribute('title', placeholder)
    }
  })
}

function ensureFormLabels() {
  if (typeof document === 'undefined') return
  const fallback = '请输入密码'
  const describeInput = el => {
    const type = (el.getAttribute('type') || '').toLowerCase()
    const label = el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('placeholder') || fallback
    if (!el.getAttribute('title')) el.setAttribute('title', label)
    if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', label)
  }
  document.querySelectorAll('input:not([data-skip-a11y])').forEach(describeInput)
  document.querySelectorAll('textarea:not([data-skip-a11y])').forEach(el => {
    const label = el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('placeholder') || fallback
    if (!el.getAttribute('title')) el.setAttribute('title', label)
    if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', label)
  })
}

if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
  const ensureA11y = () => {
    annotateTabIcons()
    annotateGenericImages()
    ensureFormLabels()
  }
  window.addEventListener('load', ensureA11y)
  const obs = new MutationObserver(() => ensureA11y())
  obs.observe(document.documentElement, { childList: true, subtree: true })
}
</script>

<style>
page {
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
  font-size: 34rpx;
  line-height: 1.65;
  letter-spacing: 0.5rpx;
  background-color: #f5f7fa;
  color: #1f2d3d;
}

text, view {
  font-size: inherit;
  line-height: inherit;
}

.accessibility-highlight {
  color: #1f2d3d;
  font-weight: 600;
}

.accessibility-subtle {
  color: #5c6673;
}

input[type="text"],
input[type="password"],
input[type="number"],
textarea,
button,
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>

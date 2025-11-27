// 简单统一请求封装（适配 uni-app）
// 用法示例：
// import api from '@/services/api'
// await api.get('/courses', { page: 1 })

const DEFAULT_BASE = '' // 默认空，运行时可通过环境或直接在此设置，例如 'https://api.example.com'

function getBaseUrl() {
  // 简化：优先返回默认常量。若需要用 Vite 环境变量，请直接在构建时替换 DEFAULT_BASE 常量或在此处手动修改。
  return DEFAULT_BASE
}

function buildUrl(path) {
  const base = getBaseUrl()
  if (!base) return path
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
}

function getToken() {
  try {
    return uni.getStorageSync('authToken') || uni.getStorageSync('token') || ''
  } catch (e) {
    return ''
  }
}

function req(options = {}) {
  return new Promise((resolve, reject) => {
    // 请求前拦截：注入 token、处理 dev proxy
    const token = getToken()
    const headers = Object.assign({}, options.headers || {})
    if (token) headers['Authorization'] = `Bearer ${token}`

    // 简单判断是否为开发环境（hostname 包含 localhost 或 127.0.0.1）
    let isDev = false
    try {
      if (typeof window !== 'undefined' && window.location && window.location.hostname) {
        const h = window.location.hostname
        isDev = h === 'localhost' || h === '127.0.0.1' || h === ''
      }
    } catch (e) {}

    // 处理 URL
    let rawUrl = options.url || options.path || ''
    let finalUrl = rawUrl
    // 如果传入的是相对路径并且未要求 raw，则构建基地址
    if (!options.raw && rawUrl && !/^https?:\/\//i.test(rawUrl)) {
      finalUrl = buildUrl(rawUrl)
    }

    // 如果是绝对外部地址并处于开发环境，走本地 proxy（/_proxy?url=...）以便 dev middleware 注入头
    if (!options.raw && /^https?:\/\//i.test(rawUrl) && isDev) {
      const encoded = encodeURIComponent(rawUrl)
      finalUrl = `/_proxy?url=${encoded}`
    }

    uni.request({
      url: finalUrl,
      method: (options.method || 'GET').toUpperCase(),
      data: options.data || options.params || {},
      header: headers,
      timeout: options.timeout || 20000,
      success: (res) => {
        // 兼容不同后端返回格式
        const statusCode = res.statusCode || (res[0] && res[0].status) || 200
        const data = res.data === undefined ? res[1] : res.data

        // 全局后置拦截：401 处理、统一错误提示
        if (statusCode === 401) {
          try { uni.removeStorageSync('authToken') } catch (e) {}
          try { uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' }) } catch (e) {}
          // 小程序/APP/ H5 环境下跳转登录页
          try {
            // 使用 reLaunch 清空历史，确保返回后无旧状态
            uni.reLaunch({ url: '/pages/login/login' })
          } catch (e) {}
          const err = new Error((data && data.message) || 'Unauthorized')
          err.status = statusCode
          err.payload = data
          reject(err)
          return
        }

        if (statusCode >= 200 && statusCode < 300) {
          resolve(data)
        } else {
          const message = (data && (data.message || data.msg)) || `HTTP ${statusCode}`
          try { uni.showToast({ title: message, icon: 'none' }) } catch (e) {}
          const err = new Error(message)
          err.status = statusCode
          err.payload = data
          reject(err)
        }
      },
      fail: (err) => {
        const msg = err.errMsg || 'Network error'
        try { uni.showToast({ title: msg, icon: 'none' }) } catch (e) {}
        const eObj = new Error(msg)
        reject(eObj)
      }
    })
  })
}

export default {
  get(path, params = {}, opts = {}) {
    return req(Object.assign({ method: 'GET', url: path, params }, opts))
  },
  post(path, data = {}, opts = {}) {
    return req(Object.assign({ method: 'POST', url: path, data }, opts))
  },
  put(path, data = {}, opts = {}) {
    return req(Object.assign({ method: 'PUT', url: path, data }, opts))
  },
  del(path, params = {}, opts = {}) {
    return req(Object.assign({ method: 'DELETE', url: path, params }, opts))
  },
  // 允许直接传入完整 url（例如第三方或 proxy），使用 opts.raw = true
  request(options) {
    return req(options)
  }
}

# 后端调用详细文档（后端对接指南）

说明：本文件为前端与后端对接的详细接口说明，用于后端实现或对接测试。所有示例均为建议实现，后端可根据实际业务与数据模型调整。

基础约定
- Base URL（示例）：`https://api.example.com`（生产）或 `http://localhost:3000`（开发）。
- 认证方式：推荐使用 Bearer Token（HTTP Header: `Authorization: Bearer <token>`）。前端存储 token 的 key 为 `authToken`（`uni.setStorageSync('authToken', token)`）。
- 返回格式（推荐）：

```json
{
  "ok": true,
  "data": { ... },
  "error": null
}
```

或失败时：
```json
{
  "ok": false,
  "data": null,
  "error": { "code": 1001, "message": "描述" }
}
```

- 分页：采用 `page`（1 起）和 `limit`；返回 `data.items`（数组）与 `data.total`（整数）。
- 错误码：HTTP 状态码 + 业务错误码（在 `error.code` 内），401 为登录/认证失败。

认证/登录相关

1. 登录
- 方法：POST
- 路径：`/auth/login`
- 说明：用户名/密码登录，返回 token 与用户信息
- 请求 body (JSON)：
```json
{ "username": "1380000xxxx", "password": "plaintext-or-hashed" }
```
- 返回示例(200)：
```json
{ "ok": true, "data": { "token": "eyJ...", "user": { "id":"u123","name":"张大爷" } } }
```
- 前端接入举例（使用 `api.js`）：
```js
const res = await api.post('/auth/login', { username, password })
// 假设返回 { ok:true, data: { token } }
uni.setStorageSync('authToken', res.data.token)
```

2. 注册
- 方法：POST
- 路径：`/auth/register`
- 请求 body：`{ name, phone, password }`
- 返回示例：`{ ok:true, data:{ userId: 'u124' } }`

3. 登出
- 方法：POST
- 路径：`/auth/logout`
- 说明：可在服务端删除 token/会话

用户相关

1. 获取当前用户
- 方法：GET
- 路径：`/users/me`
- 认证：需要
- 返回：`{ ok:true, data: { id, name, desc, avatar, preferences } }
`

2. 更新当前用户
- 方法：PUT
- 路径：`/users/me`
- 认证：需要
- 请求 body：可选字段如 `{ name, desc, avatar }`

课程模块（Courses）

1. 列表（支持筛选/分页）
- 方法：GET
- 路径：`/courses`
- Query 参数：`page`, `limit`, `section`（示例：`featured|hot|recent|recommend|my`）, `q`（关键词）
- 返回示例：
```json
{ "ok": true, "data": { "items": [ {"id":"c1","title":"..."} ], "total": 123 } }
```

2. 课程详情
- 方法：GET
- 路径：`/courses/:courseId`

3. 我的学习记录
- 方法：GET
- 路径：`/users/me/courses`

商品与订单（Shop）

1. 商品列表
- 方法：GET
- 路径：`/products`
- Query：`page`, `limit`, `section`, `categoryId`, `q`

2. 商品详情
- 方法：GET
- 路径：`/products/:productId`

3. 创建订单
- 方法：POST
- 路径：`/orders`
- 请求 body：例如 `{ items: [{ productId, qty }], addressId, payMethod }`

4. 用户订单列表
- 方法：GET
- 路径：`/users/me/orders`

社区模块（Community）

1. 话题列表
- 方法：GET
- 路径：`/community/topics`
- Query：`page, limit, tag`

2. 创建话题
- 方法：POST
- 路径：`/community/topics`
- body：`{ title, content, tag }`

3. 帖子（经验分享）列表
- 方法：GET
- 路径：`/community/posts`

4. 创建帖子
- 方法：POST
- 路径：`/community/posts`
- body：`{ content, images?: [url], tag? }`

5. 帖子评论
- 创建评论：POST `/community/posts/:postId/comments` body `{ content }`
- 评论列表：GET `/community/posts/:postId/comments` (分页)

个人/Profile 专属接口

1. 我发布的内容
- 方法：GET
- 路径：`/users/me/posts`

2. 收藏
- 列表：GET `/users/me/favorites`
- 添加：POST `/users/me/favorites` body `{ type: 'product'|'post'|'course', id }`
- 删除：DELETE `/users/me/favorites/:favId`

文件/图片上传

1. 图片上传
- 方法：POST (multipart/form-data)
- 路径：`/uploads/images`
- 返回示例：`{ ok:true, data: { url: 'https://cdn.example.com/uploads/xxx.jpg' } }`
- 前端注意：使用 `uni.uploadFile` 或 `fetch` 的 `FormData`；返回的 URL 应为可直接访问的 CDN 链接。

开发环境代理（`/_proxy`）
- 说明：当前项目在 `vite.config.js` 中已有 dev-time 的 `/_proxy` 路由，用于将第三方资源（如占位图、CDN 资源）通过 dev server 转发并注入 `X-Content-Type-Options` 与 `Cache-Control` 头，以便在本地做 Lighthouse 检测。
- 后端需注意：生产环境应由 CDN 或后端直接提供正确的安全头（`X-Content-Type-Options: nosniff` 等）。
- 前端示例：当要请求一个外部图片 `https://via.placeholder.com/160` 时，在开发环境 `api.js` 会把外部绝对 URL 转为 `/_proxy?url=https%3A%2F%2Fvia.placeholder.com%2F160`，从而让 dev-server 返回带头的资源。

错误与状态码规范
- 常见 HTTP 状态：200 成功、201 创建成功、400 参数错误、401 未认证、403 未授权、404 未找到、500 服务器错误。
- 推荐在 response body 中返回统一的错误对象：
```json
{ "ok": false, "error": { "code": 1002, "message": "参数错误：xxx" } }
```
- 401 处理建议：返回 401 并带上 `error.message`，前端统一拦截后应清理本地 token 并跳转登录页（`api.js` 已实现该拦截逻辑）。

安全与 CORS
- 若前端与后端不同域，请确保后端配置了 CORS（允许 Origin、支持 Credential 或 Token）。
- 建议后端在静态资源与 API 响应中配置以下头：
  - `X-Content-Type-Options: nosniff`
  - `Cache-Control: public, max-age=...`（或按资源类型设置不同策略）
  - `Content-Type` 精确到具体类型（例如 `application/json; charset=utf-8`）

示例请求（curl）

- 登录：
```bash
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"1380000xxxx","password":"pass"}'
```

- 获取课程列表：
```bash
curl "https://api.example.com/courses?page=1&limit=12&section=featured" \
  -H "Authorization: Bearer <token>"
```

前端接入示例（使用 `src/services/api.js`）

- 登录并保存 token：
```js
try {
  const res = await api.post('/auth/login', { username, password })
  if (res && res.data && res.data.token) {
    uni.setStorageSync('authToken', res.data.token)
  }
} catch (e) {
  console.error('登录失败', e)
}
```

- 从课程列表获取并显示（分页）：
```js
const res = await api.get('/courses', { page: 1, limit: 12, section: 'featured' })
// 解析 res.data.items 或 res.data
```
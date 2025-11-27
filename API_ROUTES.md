# API 接口路由清单（HTTP 路由）

> 说明：此文件为项目中建议/推断的 RESTful 接口清单，基于当前代码结构（页面与功能）生成，用于前后端对接与后端实现参考。部分接口为占位（尚未在代码中直接调用），请后端根据实际数据模型调整。

基础信息
- Base URL（示例）：`https://api.example.com` 或 开发环境 `http://localhost:3000`
- 认证：推荐使用 Bearer Token（`Authorization: Bearer <token>`）或 cookie/session（视后端而定）

目录
- Auth（认证）
- Users / Profile
- Courses（课程）
- Shop（商品与订单）
- Community（话题与帖子）
- Profile 专属（我的发布/收藏/记录）
- Uploads（文件/图片上传）
- Support（客服/工单）

---

## Auth（认证）

- 登录
  - 方法：POST
  - 路径：`/auth/login`
  - 请求 body:
    ```json
    { "username": "string", "password": "string" }
    ```
  - 返回示例:
    ```json
    { "token": "jwt-token", "user": { "id": "u123", "name": "张三" } }
    ```
  - 说明：前端登录后保存 token 到本地（`uni.setStorageSync`），后续请求带 `Authorization`。

- 注册
  - 方法：POST
  - 路径：`/auth/register`
  - 请求 body:
    ```json
    { "name": "string", "phone": "string", "password": "string" }
    ```
  - 返回示例：`{ "ok": true, "userId": "u124" }`

- 登出
  - 方法：POST
  - 路径：`/auth/logout`
  - 请求 header: `Authorization`
  - 返回示例：`{ "ok": true }`

---

## Users / Profile

- 获取当前用户信息
  - 方法：GET
  - 路径：`/users/me`
  - 返回示例:
    ```json
    { "id": "u123", "name": "张大爷", "desc": "学习让生活更精彩" }
    ```

- 更新当前用户信息
  - 方法：PUT
  - 路径：`/users/me`
  - 请求 body: 部分可选字段（name, desc, avatar, preferences 等）

---

## Courses（课程）

- 列表（带分页/筛选）
  - 方法：GET
  - 路径：`/courses`
  - Query 参数示例：`?page=1&limit=20&section=featured|hot|recent|recommend` 或 `?q=关键字`
  - 返回示例：分页列表 + 总数

- 课程详情
  - 方法：GET
  - 路径：`/courses/:courseId`

- 我的学习记录（服务器端）
  - 方法：GET
  - 路径：`/users/me/courses` 或 `/profiles/:userId/courses`

- 课程全部页（前端用 `course/all?section=...`，后端可复用 `/courses?section=...`）

---

## Shop（商品与订单）

- 商品列表（带分页/筛选）
  - 方法：GET
  - 路径：`/products`
  - Query 示例：`?page=1&limit=20&section=featured|hot|categoryId=...`

- 商品详情
  - 方法：GET
  - 路径：`/products/:productId`

- 下单（创建订单）
  - 方法：POST
  - 路径：`/orders`
  - 请求 body: 购物车或订单项

- 用户订单列表
  - 方法：GET
  - 路径：`/users/me/orders`

---

## Community（话题与帖子）

- 话题列表
  - 方法：GET
  - 路径：`/community/topics`
  - Query: `?page=1&limit=20&tag=health|digital|...`

- 话题详情 / 查看帖子的回复
  - 方法：GET
  - 路径：`/community/topics/:topicId`

- 创建话题
  - 方法：POST
  - 路径：`/community/topics`
  - body: `{ title, content, tag }`

- 帖子列表（经验分享）
  - 方法：GET
  - 路径：`/community/posts`

- 创建帖子
  - 方法：POST
  - 路径：`/community/posts`
  - body: `{ content, images?, tag? }`

- 帖子评论
  - 创建评论：POST `/community/posts/:postId/comments`
  - 列表：GET `/community/posts/:postId/comments`

---

## Profile 专属（我的发布 / 收藏 / 记录）

- 我发布的帖子/话题
  - 方法：GET
  - 路径：`/users/me/posts` 或 `/profiles/:userId/posts`

- 我的收藏
  - 方法：GET
  - 路径：`/users/me/favorites`
  - 添加/删除：POST `/users/me/favorites` / DELETE `/users/me/favorites/:id`

- 学习记录（前端 `profile/progress` 使用）
  - 方法：GET
  - 路径：`/users/me/progress`

---

## Uploads（文件 / 图片上传）

- 图片上传
  - 方法：POST (multipart/form-data)
  - 路径：`/uploads/images`
  - 返回：`{ "url": "https://cdn.example.com/xxx.jpg" }`
  - 说明：前端使用 `uni.uploadFile` 或表单提交；上传后返回可访问的 CDN 链接供帖子/课程使用。

---

## Support（客服 / 工单）

- 创建工单（联系客服）
  - 方法：POST
  - 路径：`/support/tickets`
  - body: `{ subject, content, contactInfo }`

- 我的工单列表
  - 方法：GET
  - 路径：`/users/me/tickets`

---

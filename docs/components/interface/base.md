
# 接口文档规范

## 1. 接口文档管理

### 1.1 文档工具

- **推荐工具**：Apifox（集API设计、开发、测试、Mock于一体）
- **必须包含**：完整的接口文档，禁止仅通过微信等即时通讯工具传递接口信息
- **更新要求**：接口变更后，文档必须<font color="#c00000">**实时同步更新**</font>

#### 完整的API接口文档需要包括以下几个部分：

- **接口名称：** 接口的简要名称，便于识别。
- **接口描述：**接口的功能描述，解释接口的具体作用和业务逻辑。
- **请求方式：**接口的请求方式，如GET、POST、PUT、DELETE等。
- **请求URL：**接口的请求地址。
- **请求参数：**接口所需的请求参数，包括参数名称、类型、是否必填、默认值和描述。
- **响应格式：**接口的响应格式，包括响应状态码、响应数据结构和示例。
- **错误码及描述：**接口可能返回的错误码及其对应的描述，便于排查问题。
- **示例代码：**提供前后端调用接口的示例代码，便于开发人员理解和使用。

#### 接口文档完整示例：

![Pasted image 20251230102720.png](../../public/20251230102720.png)

### 1.2 文档版本（可选）

- 使用语义化版本号管理：`v1.0.0`、`v2.0.0`等  
- URL中体现版本：`/api/v1/users`

## 2. HTTP方法与URL设计

### 2.1 RESTful规范

| 方法     | 场景     | 示例                                                       |
| ------ | ------ | -------------------------------------------------------- |
| GET    | 获取资源   | GET `/api/v1/users` (列表)  <br>GET `/api/v1/users/1` (详情) |
| POST   | 创建资源   | POST `/api/v1/users`                                     |
| PUT    | 全量更新资源 | PUT `/api/v1/users/1`                                    |
| PATCH  | 部分更新资源 | PATCH `/api/v1/users/1`                                  |
| DELETE | 删除资源   | DELETE `/api/v1/users/1`                                 |

### 2.2 URL命名规范

- 使用<font color="#c00000">**名词复数**</font>形式表示资源集合
- 层级关系使用嵌套URL：`/api/v1/users/1/orders`
- 使用<font color="#c00000">**小写字母**</font>，单词间用连字符 `-` 分隔：`/api/v1/user-roles`

### 2.3 参数传递规则

- **Path**：路径参数，在url中明确占位
- **Query**：查询参数，拼接在url？后面
- **Body**：请求体参数，JSON格式传参

| 方法     | Path参数 | Query参数 | Body参数 |
| ------ | ------ | ------- | ------ |
| GET    | ✓      | ✓       | ✗      |
| POST   | ✓      | ✗       | ✓      |
| PUT    | ✓      | △       | ✓      |
| PATCH  | ✓      | △       | ✓      |
| DELETE | ✓      | ✓       | ✗      |

::: tip △：仅在特殊场景下使用，如版本控制参数
:::

::: warning ⚠️ **注意事项**：

1. Path和Query中参数需确保<font color="#c00000">**长度可控**</font>（建议不超过2000字符）。
	* 超过2000字符（因浏览器而异）的参数可导致请求失败。
	* 当请求无法保证参数长度可控，则不能将参数放在path或query中，必须使用支持body参数的HTTP方法，如POST。 
2. Path和Query参数必须为<font color="#c00000">**基本类型**</font>，禁止传递JSON对象。
3. Body参数必须是合法的<font color="#c00000">**JSON对象**</font>。
4. 所有参数命名遵循<font color="#c00000">**小驼峰**</font>命名法。
:::

## 3.  请求与响应格式

所有接口统一返回JSON格式响应体，封装为result/data对象，包含`状态码`、`提示信息`、`业务数据`三个核心字段

### 3.1 基础响应结构

```json
{
  "code": 200,
  "message": "请求成功",
  "data": {}, // 业务数据，可为对象、数组或null
  "timestamp": "2024-01-01T12:00:00Z" // ISO 8601格式
}
```

### 3.2 分页响应结构

```json
{
  "code": 200,
  "message": "请求成功",
  "data": {
    "list": [], // 数据列表
    "pagination": {
      "page": 1,      // 当前页码
      "pageSize": 10, // 每页条数
      "total": 100,   // 总条数
      "totalPages": 10 // 总页数
    }
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### 3.3 错误响应结构

⚠️ 错误信息需清晰明确，告知用户具体错误原因及解决方式

```json
{
  "code": 400,
  "message": "参数校验失败",
  "errors": [
    {
      "field": "username",
      "message": "用户名不能为空"
    }
  ],
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 4. 状态码与错误处理

### 4.1 HTTP状态码

| 状态码 | 场景     | 说明            |
| --- | ------ | ------------- |
| 200 | 请求成功   | 同步操作成功        |
| 201 | 创建成功   | 资源创建成功        |
| 202 | 请求已接受  | 异步操作已接受       |
| 204 | 无内容    | 删除成功或无需返回内容   |
| 400 | 客户端错误  | 参数错误、格式错误等    |
| 401 | 未授权    | Token缺失、过期或无效 |
| 403 | 禁止访问   | 权限不足          |
| 404 | 资源不存在  | 请求的资源不存在      |
| 409 | 资源冲突   | 重复创建、状态冲突等    |
| 422 | 参数校验失败 | 业务参数校验失败      |
| 429 | 请求过多   | 访问频率超限        |
| 500 | 服务器错误  | 服务器内部错误       |
| 503 | 服务不可用  | 服务暂时不可用       |

更多状态码详见： https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Reference/Status

### 4.2 业务状态码（可选）

如需额外业务状态码，建议与HTTP状态码结合使用：

- 2xx + 业务状态码：业务操作成功
- 4xx + 业务状态码：客户端错误
- 5xx + 业务状态码：服务端错误

## 5. 参数命名与类型规范

### 5.1 命名规范

- 使用<font color="#c00000">**小驼峰**</font>命名法：`userName`、`orderStatus`。
- 务必<font color="#c00000">**保持一致性**</font>，避免混用不同命名风格。
- 命名需<font color="#c00000">**见名知意**</font>，避免无意义缩写。
- 布尔类型以`is`、`has`、`can`等开头：`isActive`、`hasPermission`。

```json
// 正确
{ 
	roleIds: [11,12,35], 
} 

// 错误 
{ 
	RoleIds: [11,12,35],
	user_ids: [11,12,35],
	ywXzclCzjl: [11, 12, 35], // 字段过长英文不好表述，非要用这样的话，必须在api文档上做好标注说明
}
```

::: warning 字段过长英文不好表述，非要用 <font color="#c00000">ywXzclCzjl</font> 这样的话，必须在api文档上做好标注说明
:::

### 5.2 类型规范

|类型|示例|说明|
|---|---|---|
|string|`"hello"`|字符串|
|number|`123`、`12.34`|数字（整数/浮点数）|
|boolean|`true`、`false`|布尔值|
|array|`[1, 2, 3]`|数组|
|object|`{"id": 1}`|对象|
|null|`null`|空值|

参数必须在api文档中注明类型，避免导致前端传参类型不同引起的错误，增加沟通成本。

### 5.3 特殊类型

- **日期时间**：ISO 8601格式，`YYYY-MM-DDTHH:mm:ssZ`，或其他约定格式，必须统一。
- **文件**：文件上传使用`multipart/form-data`
- ……其他待补充

## 6. 数据结构约定

### 6.1 通用字段


```json
{
  "id": "string",          // 主键ID
  "createdAt": "2024-01-01T12:00:00Z",  // 创建时间
  "updatedAt": "2024-01-01T12:00:00Z",  // 更新时间
  "createdBy": "string",   // 创建人
  "updatedBy": "string"    // 更新人
}
```

### 6.2 空值处理

- 空数组使用`[]`，不使用`null`
- 空对象使用`{}`，不使用`null`
- 可选字段不存在时，不返回该字段或返回`null`

### 6.3 数据脱敏

敏感信息需脱敏处理：

- 手机号：`"138****1234"`
- 邮箱：`"u***@example.com"`
- 身份证：`"1101**********1234"`

## 7. 变更通知

1. **评估影响**：变更前评估对前端的影响。
2. **提前通知**：至少提前3个工作日通知前端。
3. **并行支持**：新老版本并行运行至少2周
4. **正式切换**：前端确认无问题后切换
5. **清理旧版**：旧版本保留至少1个月后下线

## 8. 测试与Mock

- 后端需提供接口测试用例
- 支持不同业务状态（成功、失败、异常）
- 支持自动化测试
- 测试环境与生产环境隔离

## 9. 接口文档模板

### 9.1 接口基本信息

用户管理-获取用户列表

- 接口名称: 获取用户列表
- 接口描述: 分页查询用户列表，支持按条件筛选
- 接口版本: v1.0
- 最近更新: 2024-01-01

### 9.2 请求信息

- 请求方式: GET
- 请求URL: /api/v1/users
- 请求参数:

| 参数名 | 类型 | 是否必填 | 默认值 | 说明 | 示例 |
|--------|------|----------|--------|------|------|
| page | integer | 否 | 1 | 页码，从1开始 | `1` |
| pageSize | integer | 否 | 10 | 每页条数，最大100 | `10` |
| keyword | string | 否 | - | 搜索关键词 | `"张三"` |
| status | string | 否 | - | 状态过滤 | `"active"` |
| sortBy | string | 否 | `"createdAt"` | 排序字段 | `"name"` |
| sortOrder | string | 否 | `"desc"` | 排序方向 | `"asc"` |

### 9.3 响应信息

- 响应状态码：200
- 响应信息：成功or失败
- 响应数据：

#### 成功响应

```json
{
  "code": 200,
  "message": "请求成功",
  "data": {
    "list": [
      {
        "id": "1",
        "username": "zhangsan",
        "nickname": "张三",
        "email": "u***@example.com",
        "phone": "138****1234",
        "status": "active",
        "roleIds": [1, 2],
        "createdAt": "2024-01-01T12:00:00Z",
        "updatedAt": "2024-01-01T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10
    }
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### 失败响应

```json
{
  "code": 400,
  "message": "请求失败",
  "data": null,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### 字段说明
| 字段名                                                   | 类型      | 说明      | 示例                                      |
| ----------------------------------------------------- | ------- | ------- | --------------------------------------- |
| data.list[].id                                        | string  | 用户ID    | `"1"`                                   |
| data.list[].username                                  | string  | 用户名     | `"zhangsan"`                            |
| data.list[].nickname                                  | string  | 用户昵称    | `"张三"`                                  |
| data.list[].email                                     | string  | 邮箱（脱敏）  | `"u***@example.com"`                    |
| data.list[].phone                                     | string  | 手机号（脱敏） | `"138****1234"`                         |
| data.list[].status                                    | string  | 用户状态    | `"active"`（枚举：active, inactive, locked） |
| data.list[].roleIds                                   | array   | 角色ID列表  | `[1, 2]`                                |
| data.list[].createdAt                                 | string  | 创建时间    | ISO 8601格式                              |
| [data.pagination.page](https://data.pagination.page/) | integer | 当前页码    | `1`                                     |
| data.pagination.pageSize                              | integer | 每页条数    | `10`                                    |
| data.pagination.total                                 | integer | 总条数     | `100`                                   |
| data.pagination.totalPages                            | integer | 总页数     | `10`                                    |


### 9.4 错误信息

#### 400 - 参数错误
```json
{
  "code": 400,
  "message": "参数校验失败",
  "errors": [
    {
      "field": "pageSize",
      "message": "每页条数不能超过100"
    }
  ],
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### 401 - 未授权

```json

{
  "code": 401,
  "message": "未授权访问，请重新登录",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### 403 - 权限不足

```json

{
  "code": 403,
  "message": "权限不足，无法访问该资源",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### 500 - 服务器错误

```json

{
  "code": 500,
  "message": "服务器内部错误",
  "timestamp": "2024-01-01T12:00:00Z"
}

```


## 10. ⚠️ 注意事项


- <font color="#c00000">任何形式的接口变更都会对前端产生影响</font>，比如字段名称的修改，字段的增减，字段类型的修改，请求参数类型的变动等。
- <font color="#c00000">原则上当接口对接完成后不应有任何形式的修改</font>，如果一定要变更接口，需及时通知前端开发人员并重新对接。
- <font color="#c00000">表示同一含义的字段在同一套功能接口集合（增删改查）中应尽量保证相同</font>。
- 在接口设计中，对同一实体进行操作的接口应尽量保证在参数和返回值中，该实体的数据结构保持一致，<font color="#c00000">避免前端做数据对象转换的动作</font>。


## 附录A：常用字段命名参考

|字段名|类型|说明|
|---|---|---|
|id|string/number|主键ID|
|name|string|名称|
|title|string|标题|
|description|string|描述|
|type|string|类型|
|status|string|状态|
|sortOrder|number|排序序号|
|isDeleted|boolean|是否删除|
|createdAt|string|创建时间|
|updatedAt|string|更新时间|
|createdBy|string|创建人|
|updatedBy|string|更新人|

## 附录B：枚举值参考

#### 通用状态枚举
```javascript

// 通用状态
const STATUS = {
  ACTIVE: 'active',      // 激活
  INACTIVE: 'inactive',  // 未激活
  PENDING: 'pending',    // 待处理
  APPROVED: 'approved',  // 已批准
  REJECTED: 'rejected',  // 已拒绝
  DELETED: 'deleted'     // 已删除
};

// 订单状态
const ORDER_STATUS = {
  UNPAID: 'unpaid',      // 未支付
  PAID: 'paid',          // 已支付
  SHIPPED: 'shipped',    // 已发货
  DELIVERED: 'delivered', // 已送达
  CANCELLED: 'cancelled', // 已取消
  REFUNDED: 'refunded'   // 已退款
};

```

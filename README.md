# wa-cli

基于 Commander 的本地脚手架（`@wagq/wa-cli`）。

## 安装

```bash
npm i -g @wagq/wa-cli
```

全局安装后使用 `wa <命令>` 调用。

```bash
wa --help
```

## 命令一览

以下命令以 `config/command.js` 为准（含别名/参数）。

### init

- **作用**：项目初始化工具
- **用法**：`wa init <name>`
- **别名**：`wa i <name>`

```bash
wa init my-app
```

### server

- **作用**：启动本地静态服务
- **用法**：`wa server [path]`
- **别名**：`wa s [path]`
- **位置参数**
  - `path`：文件路径，默认 `dist`
- **选项**
  - `-P, --port <port>`：端口
  - `-S, --https <boolean>`：是否开启 https

```bash
wa server
wa server dist -P 3000 -S true
```

### xlsx2Config

- **作用**：xlsx 文件转多语言配置
- **用法**：`wa xlsx2Config <path> <name> <ext>`
- **别名**：`wa l <path> <name> <ext>`
- **位置参数**
  - `path`：文件路径
  - `name`：xlsx 文件名称
  - `ext`：转换文件格式（`ts` 或 `json`）

```bash
wa xlsx2Config ./locale excel.xlsx json
```

### daml

- **作用**：同步低代码逻辑器文件
- **用法**：`wa daml`
- **别名**：`wa d`

```bash
wa daml
```

### damls

- **作用**：从应用同步所有页面的逻辑器与变量值
- **用法**：`wa damls`
- **别名**：`wa da`
- **配置**：可将 `appId`、`branchid`、`token` 写入 `~/.damlrc`（数组形式）

`~/.damlrc` 示例（JSON）：

```json
[
  {
    "origin": "https://example.com",
    "appId": "xxx",
    "branchid": "yyy",
    "token": "zzz",
    "appName": "my-app"
  }
]
```

- **字段说明**
  - `origin`：请求域名（`/api/assembler/page/list` 页面列表接口域名）
  - `appId` / `branchid` / `token`：请求参数
  - `appName`：应用名称（区分不同应用的标识）；生成的文件会放在以 `appName` 命名的文件夹下

```bash
wa damls
```

### batchUpdate

- **作用**：批量升级依赖包（可指定组织，只更新组织下的依赖）
- **用法**：`wa batchUpdate`
- **别名**：`wa bu`

```bash
wa batchUpdate
```

### web2exe

- **作用**：将网页打包成 exe（内部调用 `nativefier`）
- **用法**：`wa web2exe <name> <path> [icon]`
- **别名**：`wa we <name> <path> [icon]`
- **参数说明**
  - `name`：应用名称
  - `path`：网页地址或本地 `html` 文件路径（会透传给 `nativefier`）
  - `icon`：图标路径（可选）

```bash
wa web2exe MyApp https://example.com ./icon.ico
```

### skills

- **作用**：交互选择并执行与 `openskills` 相关的常用命令（需本机可执行 `npx`）
- **用法**：`wa skills`
- **别名**：`wa sk`
- **交互选项**
  - `getList`：执行 `npx openskills install anthropics/skills`
  - `sync`：执行 `npx openskills sync`

```bash
wa skills
```

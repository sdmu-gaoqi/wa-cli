# cli 工具

使用方式 全局安装后 可使用 wa [命令]
- 更多描述可以使用help查看

  ```
  wa --help
  ```

- 初始化项目
  ```bash
    wa init
  ```

- 启动本地服务
  ```bash
    wa server [path]
  ```
  可选参数
  -P 指定端口

- 转换 xlsx 文件为多语言配置
  wa xlsx2Config [path] [name] [ext]
  参数

  - path 文件路径
  - name 被转换目标文件名称
  - ext 转换后文件扩展名 json 或 ts

- 同步远端低代码配置
  ```bash
  wa daml
  ```

- 同步远端应用所有页面的低代码配置
  ```bash
  wa damls
  ```

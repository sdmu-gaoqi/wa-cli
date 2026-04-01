---
name: readme
description: 对项目README.md文件进行补充描述
---

# readme

## 何时使用

当用户要求对readme进行补充时。

## 工作流程

1. **提取指令集合**：读取 `config\command.js` 文件的内容,获取脚手架内置的所有命令
2. **理解指令内容**: 读取指令的配置与描述,下钻到指令执行的node内容
3. **检查README.md**: 检查当前README.md文件的内容,查阅是否有描述错误与未描述的内容
4. **完善README.md**: 把错误的描述和未补充的描述修改到README.md文件中,并执行命令 `git commit -m "feat: 完善README.md"`
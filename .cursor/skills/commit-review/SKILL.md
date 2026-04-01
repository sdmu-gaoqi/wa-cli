---
name: commit-review
description: 对commit提交的代码进行code-review
---

# commit-review

## 何时使用

当用户要求对commit进行review时,检查最新一条commit的代码,并进行code review。

## 工作流程

1. **提取review范围commit**：从git commit历史中取出最新的一条commit
2. **审阅commit中修改的代码**: 对commit中修改的代码进行审阅,开始code review工作
3. **输出code review结果**: review结束后,输出review结果到控制台,并且对review结果进行 p0, p1, p2共三级优先级的评估

## code review结果输出模板

对每条用例使用以下结构（表格或等价 Markdown 列表均可）：

```markdown
### {优先等级}-{文件路径}

- **类型**: code review中常见的错误类型
- **优先级**: P0 | P1 | P2
- **问题描述**: code review中问题的具体描述
- **修改建议**: code review中对问题的修改建议
```

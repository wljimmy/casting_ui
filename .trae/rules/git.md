---
alwaysApply: true
description: Git提交规范
---

# Git 提交规范

## 1. 版本号管理
- 模块更新需同步升级版本号
- 项目根目录版本号与模块一致
- 禁止无关联版本升级

## 2. 文档同步
- 代码变更必须同步更新文档
- 检查：API文档、设计文档、README、版本日志
- 禁止只提交代码不更新文档

## 3. 提交信息格式
`[type]: [module] - [description]`

类型：feat/fix/docs/refactor/style/performance/test

## 4. 提交前自检
- [ ] 代码修改无误
- [ ] 版本号已更新
- [ ] 文档已同步
- [ ] 无遗漏文件

## 5. 项目版本号
- package.json为项目整体版本号
- 多模块以最高版本号为准

# 项目协作约定

- 使用中文沟通，从实际问题与证据出发；目标清楚时自主完成普通可逆修改，保留无关改动。
- 界面与交互源码位于 `src/`。修改后运行 `npm run build`，同时提交生成的根目录 `index.html` 和 `dist/index.html`；不要直接修改构建产物。
- 界面修改按实际影响检查三校区与手机布局，项目使用与数据依据见 `README.md`。

## GitHub 自动同步

- 用户已授权：每次完成本项目的本地修改且相关检查通过后，自动提交并推送至 GitHub，无需重复确认。
- 默认目标为远程 `github` 的 `main` 分支，仓库为 `MrRoam/buaa-xueyuan-campus-3d`。当前任务明确指定其他分支时遵循该要求。
- 提交前获取远程更新，只暂存本次任务相关文件；排除浏览器日志、截图、下载文件等验证产物，不提交未完成或未经验证的修改。
- 保留远程新增提交，不强制推送；冲突无法在当前授权范围内解决时，说明已完成内容与同步阻塞。
- 交付时报告提交编号与推送结果；自动同步发生在任务完成后，不监听每次文件保存。

### 同步命令

按顺序执行；任一步失败，先处理原因，不继续提交或宣称同步成功。以下以当前默认的 `main` 分支为例。

| 步骤 | 命令 | 要求 |
| --- | --- | --- |
| 检查本地状态 | `git status --short`、`git branch --show-current` | 确认分支与任务相关改动，保留其他人的修改 |
| 获取远程更新 | `git fetch github` | 同步前执行 |
| 比较本地与远程 | `git rev-list --left-right --count HEAD...github/main` | 左侧为本地领先提交数，右侧为远程领先提交数；右侧非零时先检查并整合远程提交 |
| 检查远程新增内容 | `git log --oneline HEAD..github/main` | 远程有新增提交时执行；不得用强制推送覆盖 |
| 构建 | `npm run build` | 源码或构建配置发生变化时执行；纯文档修改无需重新构建 |
| 检查修改 | `git diff --check` | 检查通过后再暂存 |
| 暂存任务文件 | `git add -- <本次任务相关文件>` | 替换占位符为实际路径，逐项列出；涉及构建时包含 `index.html`、`dist/index.html`，避免 `git add .` |
| 复核暂存内容 | `git diff --cached --check`、`git diff --cached --stat` | 确认只有本次修改及必要构建产物 |
| 提交 | `git commit -m "<中文修改说明>"` | 替换占位符；无改动时不创建空提交 |
| 推送 | `git push github main` | 不使用 `--force` 或 `--force-with-lease`；推送失败不能报告完成 |
| 核实远程提交 | `git rev-parse HEAD`、`git ls-remote github refs/heads/main` | 比较提交编号，确认远程已包含本次提交 |
| 检查剩余改动 | `git status --short` | 未同步项如实说明，不为清空工作区提交无关文件 |

只更新本文件时，暂存与提交命令为：

```powershell
git add -- AGENTS.md
git diff --cached --check
git diff --cached --stat
git commit -m "完善 GitHub 自动同步约定与命令"
git push github main
```

GitHub Pages 从 `main` 根目录发布。推送完成与网页部署完成分别判断；未经检查不宣称线上页面已经更新。

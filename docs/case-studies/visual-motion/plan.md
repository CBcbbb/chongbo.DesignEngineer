# 视觉与动效：计划（13 日定稿）

分支 `design/visual-motion-review`。实施交给另一个对话，提示词在 `PROMPT-implementation.md`，在新分支 `shell/visual-motion` 上做，不合进 main。

## 已经做完的

- **首页瘦身**（分支 `perf/printed-cards-on-demand`）：首页 HTML 163 KB → 52 KB，打印时才取需要的卡片，最多六张。测试全过。实施时先合进来。

## 要实施的

1. **新打印机**：GPT 渲染的意大利风格机器（奶油色、罗纹底座、滚花红键、带绿的屏幕），深色模式用同一张重新打光的夜间版。名牌换成点阵屏，红键能真的按下去。
2. **AI 分析五步**：读（纸穿过绿光，认出的词被标出来）、等（回答慢时翻项目名）、懂（能力一个个锁上）、找（卡片数往下滚）、印（一格一格吐纸，纸被拿起落到纸张条，其余从它下面发出来）。用真实数字，不比现在慢。打印中再按一次就停。
3. **纸**：输入的纸是干净的新纸加淡纸纹；打印出来的纸上下都是锯齿（从纸卷上切下来的），卡片本身不变。About 收据同样。
4. **出错**：卡纸图 + 屏幕 PAPER JAM + 机器下面一行"再试一次 / 看全部作品 / 发邮件给我"。
5. **没读懂**（名字、乱打的字）：不用卡纸，机器打个嗝，说清楚没找到角色或技能，打三张"从这里开始"；如果是名字就说 Nice to meet you。名字不保存。
6. **拉绳灯**：深浅色开关，从系统设置开始，点一下切换并记住，再点回到跟随系统；刷新不闪；减少动效时直接切换。
7. **外壳细节**：摄影棚背景（浅色、深色、手机竖版）、红键图标、用代码合成的分享图（首页和每个案例自动生成）。

## 原型

- `docs/design/visual-motion-assembled.html`：整体效果（以这个为准）
- `docs/design/visual-motion-machine-v3.html`：机器和分析动画
- `docs/design/visual-motion-theme-switch.html`：拉绳灯
- `docs/design/visual-motion-gpt-sheet.html`：GPT 图片包和提示词
- 素材：`docs/design/shell/`（GPT 原图在 `gpt-originals/`）

## 屏幕和页面上的新文字

都已确认，完整列表在 `PROMPT-implementation.md` 的 "Approved copy"。除此之外网站文字一律不改。

## 以后可以做的（这次不做）

- /work 和案例页之间的页面切换动画（View Transitions）
- 背景上更细的纸纹
- About 页旁边放那卷热敏纸，或者用在空状态
- Design System 03.2 的图表在手机上超出卡片：请转给那个项目的对话

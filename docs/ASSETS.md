# Media assets checklist

Every image or video the case files ask for. Until a file exists, the site shows a tidy dashed placeholder with the path and what to show, so nothing looks broken.

**How to add one:** save the file at the exact path below (inside `public/assets/`), commit, and redeploy. The site checks for files at build time, so a new file appears on the next deploy. No code changes needed.

**Formats:** PNG or JPG for images (the site converts them to AVIF/WebP and resizes them automatically, so export large and sharp). Video: MP4 (H.264), muted-friendly (no important audio), under ~20 MB.

**中文说明：** 把文件按下面的路径放进 `public/assets/`，提交并重新部署即可，不用改代码。文件不存在时网站会显示虚线占位框。图片导出大一点，网站会自动压缩和转换格式。

| ✓ | Path (put it here) | Project · section | What to show | Ratio | Format | Recommended size | 中文说明 |
|---|---|---|---|---|---|---|---|
| ✓ | `public/assets/hhcd/*` | Helen Hamlyn Centre Data Platform · all cards | Done: map screenshots and recordings captured from the live rebuild; VOICE figures from Chongbo's DRS paper. See `docs/case-studies/hhcd/inventory.md` | — | PNG, JPG, MP4 + WebM | — | 已完成：截图和录屏来自重构版；VOICE 的图来自论文。 |
| ✓ | `public/assets/hhcd/workshop-wall-*.jpg` | HHCD · workshop | Done (11 Oct): the three wall photos, whole, from Chongbo's originals (IMG_0941–0943), at 1600×1200 | 4:3 | JPG | 1600×1200 | 已完成：三面墙的原图（完整、不裁切）。 |
| ☐ | `public/assets/hhcd/voice-graph.png`, `voice-simple-view.png` | HHCD · `brief`, `dual-view` | **Wanted:** larger originals of VOICE's graph view and Simple View. The current files (1386 and 1138px wide) come from the paper and are under twice their display size on a computer (playbook §6). Same names, same framing; never upscaled | as now | PNG | 2400px wide or more | 需要：VOICE 图谱页和 Simple View 的大图原件（现在的来自论文，偏小）。同名替换即可。 |
| ☐ | `public/assets/component-store/mapping.png` | Component Store · Decision 02 (mapping) | **Optional, only with permission.** Anonymised field-mapping step, all company/customer names removed | 16:10 | PNG | 2560×1600 | 可选，须公司同意。字段映射界面的脱敏截图，去掉所有公司和客户名称。没有也可以，图表能撑住这张卡。 |
| ☐ | `public/assets/nike/headline-frame.png` | Nike Athletes Closet · cover | The adaptive headline/text-framing system, ideally three or four screens side by side | 16:10 | PNG | 2560×1600 | 封面：自适应标题框系统，最好三到四个手机屏并排。 |
| ☐ | `public/assets/nike/components.png` | Nike · Decision 01 (system) | Component overview from the old case study (logo lock-up, header, key message, image-text, poster card) | 16:10 | PNG | 2560×1600 | 旧案例里的组件总览图。 |
| ☐ | `public/assets/nike/product-card.png` | Nike · Decision 02 (product-card) | Before/after product card comparison (two phone screens) | 4:3 | PNG | 2400×1800 | 商品卡片改版前后对比（两个手机屏）。 |
| ☐ | `public/assets/nike/app-recording.mp4` | Nike · Evidence (delight) | Screen recording of the live feature: scroll a story, like it, open the prize draw. 20–40 s cut | 9:16 | MP4 (H.264) | 1080×1920, ≤ 20 MB | App 实机录屏剪辑版，20–40 秒，竖屏。完整版自己保留。不需要声音。 |
| ☐ | `public/assets/nike/app-recording-poster.jpg` | Nike · Evidence (video poster) | One frame from the recording (the gift-box moment is ideal) | 9:16 | JPG | 1080×1920 | 视频封面帧，最好是礼盒抽奖那一刻。 |
| ☐ | `public/assets/this-site/cover.png` | This site · cover | The finished homepage. A ready crop is at `docs/screenshots/this-site-cover-ready.png` — **but first update the cover `alt` in `content/projects/this-site.ts`**, which still describes the old index-card design (see REPORT.md) | 16:10 | PNG | 2560×1600 (1440×900 is fine) | 本站封面。已生成好一张：`docs/screenshots/this-site-cover-ready.png`。放进去之前先改 `this-site.ts` 里的 alt 文案（还在描述旧的卡片抽屉设计）。 |
| ☐ | `public/assets/wildecho/cover.png` | WildEcho · cover | Strongest single image: prototype in use, or the app's sound-journey screen | 16:10 | PNG/JPG | 2560×1600 | WildEcho 最有代表性的一张图：原型使用场景或声音旅程界面。 |

**Not needed as files:** the Component Store diagrams (`data-contracts`, `token-layers`) are built in code, and both CSS code snippets are rendered from the content files.

**不需要文件的：** Component Store 的两张图（数据契约、token 分层）已经用代码画好；两段 CSS 代码片段也直接从内容文件渲染。

### Priority (if you only do three today)
1. `nike/app-recording.mp4` + poster — the only motion evidence, and it shipped.
2. `hhcd/voice-graph.png` and `hhcd/voice-simple-view.png` — larger originals of the two VOICE screens.

优先级：Nike 录屏；HHCD 需要两张 VOICE 截图的大图原件。

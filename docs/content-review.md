# 内容审阅 Content review

明早请逐条检查。英文原文在 `content/projects/*.ts`，这里是每张卡的中文要点，方便你快速核对**事实是否准确、说法是否经得起追问**。改动直接告诉我，或者直接改 `.ts` 文件。

## 1. 项目 × JD 对照表

✅ = 主要证据，· = 辅助证据

| JD 要求 | HHCD | Component Store | Nike | This site | WildEcho |
|---|---|---|---|---|---|
| **Design Engineer** | | | | | |
| 设计系统（Figma 加代码） | · | ✅ | · | | |
| 跨平台一致性 | | ✅ | | | |
| 修补设计与工程之间的缺口 | | ✅ | ✅ | | |
| 精细落地：排版、色彩、动效、微交互 | ✅ | | ✅ | ✅ | |
| 为 AI 工具发明交互模式 | | | | ✅ | |
| 快速原型（Figma、代码、AI 工具） | · | · | | ✅ | ✅ |
| **Web & Brand** | | | | | |
| 网站从想法到上线 | ✅ | | | ✅ | |
| SEO、性能、accessibility | ✅ | · | | ✅ | |
| 可复用组件、页面模板、CMS 发布流程 | ✅ | ✅ | ✅ | ✅ | |
| 品牌故事、帮助人们理解产品 | | | ✅ | | |
| 落地页、转化、A/B 测试 | | | ✅ | | |
| **两份都要** | | | | | |
| React、TypeScript、Tailwind | ✅ | ✅ | | ✅ | |

**空缺：A/B 测试**没有任何证据。如果你在工作中做过哪怕一次，告诉我；没有就不写，面试时说"感兴趣，想学"。

## 2. 每张卡的中文要点

### HHCD Data Platform（主卡，第 1 张）
- **问题：** 中心多年的研究记录在一张按"人"收集的表里，关系全缠在一起。
- **决定 1：** 把数据重建成四类平等的档案（人、项目、机构、方法），关系本身也是数据；转换脚本会生成数据质量报告。
- **决定 2：** 不简化图谱，而是另外提供表格视图；快捷键、焦点管理、结果数量播报从一开始就设计进去。
- **决定 3：** 教学时观察到学生从一个具体项目开始学，所以新首页先讲一个项目，再一步步向外展开。
- **证据：** 颜色只定义一次；品牌色对比度不够时用更深的文字色，脚本自动检查所有配对。管理后台写回表格。
- **结果：** Next.js + TypeScript 重构，48 个条目都有独立静态页面；自动化检测在桌面和手机宽度都通过。**明确写了：读屏软件和 Safari 还没测。**
- **起源：** 方法来自 Brunel 的欧盟项目，Brunel 退出后方法延续到 HHCD。你独自完成设计和开发，用了 AI 编程工具，之后用它教实习生。

> ⚠️ 请确认：重构版要不要部署上线？上线后卡片才能放链接。原版链接已放。

### Component Store（主卡，第 2 张）
- **全文不出现：** 公司名、产品名、客户、Redis。
- **问题：** 客户用我们的组件搭平台，数据各不相同，组件只能显示静态样例，前端团队一直没解决。
- **决定 1：** 三层、两个数据契约。第一个把任何数据流转成统一格式的字段；第二个让每个组件声明自己需要的字段。
- **决定 2：** 映射是设计问题：选数据流 → 组件列出需要的字段 → 逐个映射 → 实时预览。默认显示样例数据。
- **证据：** 两层设计系统（从 Figma 起步，现在作为共享 token 包在代码里分发，覆盖五条产品线；每个应用只改需要的部分；客户可以自定义颜色、字体、按钮形状）。色阶内置对比度规则，附脱敏代码片段。
- **结果：** 已在使用。

> ⚠️ 请确认："五条产品线"准确吗？"客户可以改按钮形状"是真实上线的功能吗？（我是从 `globals.css` 里读到的。）

### Nike Athletes Closet（主卡，第 3 张）
- **背景：** 广告公司实习，为 Nike 做；你是团队里唯一的 UI 设计师。
- **问题：** 读者喜欢故事，但很少点进商品；组件不统一，拖慢每次发布。
- **决定 1：** 审查所有元素，统一尺寸、间距、命名，重建为可复用组件并写交付文档。核心是你设计的自适应文字框架。
- **决定 2：** 重新设计商品卡，让故事里提到的商品更大、更明显。
- **证据：** 礼盒抽奖等小动效，配录屏视频。
- **结果：** 在 Nike App 上线，开发来回减少，客户反馈商品关注度提高，续约两个季度。

> ⚠️ 旧作品集写"Featured in Nike app across multiple seasons"，我改成了更保守的说法。如果确实多个赛季都在用，告诉我。

### This site（主卡，第 4 张）
- 讲作品集本身：AI 只从你写好的卡片里挑选，不生成页面；内容只写一次，两种入口共用；静态页面、键盘可用、尊重减少动态设置；AI 不可用时自动退回关键词匹配。

### WildEcho（Earlier work）
- RCA 团队项目；三轮测试；结论"只录音不够，导游很关键"，于是下一版把导游设计进去。
- 你的角色：在紧密合作的团队里负责项目结构和思路梳理。
- **不写 OPPO**（比赛未获奖，写出来会被追问）。

## 3. 个人简介（需要你确认）

> I design interfaces and build them, from the data model to the last detail of motion.

> I work across design and code: design systems that ship as packages, data-heavy interfaces that stay accessible, and brand work that has to earn a tap. I'm currently the only designer at a logistics infrastructure company, where I run the design system and build its front-end tools. Before that I built research platforms for the Royal College of Art and Brunel University, and later taught data visualisation to the Helen Hamlyn Centre's summer interns.

- 中文要点：我同时做设计和代码；现在是物流基础设施公司唯一的设计师，负责设计系统和前端工具；之前为 RCA 和 Brunel 做研究平台，后来给 HHCD 暑期实习生教数据可视化。
- ⚠️ 旧网站提到**土木工程背景**。如果你本科是土木工程，这是一个很好的"结构化思维"故事，可以加一句。请确认。

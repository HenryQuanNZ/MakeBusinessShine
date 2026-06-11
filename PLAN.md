# PLAN.md — 建站工作室官网构建计划

> 用法:把本文件放在项目根目录,在 Cursor 中按 Phase 顺序执行。
> 每完成一个 Phase 就 git commit 一次,出问题方便回滚。
> 给 Cursor 的指令示例:"Read PLAN.md and implement Phase 1. Follow the design tokens exactly."

---

## 0. 项目目标

为 Wellington 本地小企业建站服务做一个官网,它本身就是第一个作品案例:

- 5 页、中英双语(对应卖给客户的"标准包"和"双语包"规格)
- Lighthouse 四项全绿(性能就是销售工具)
- 仓库内含 Playwright E2E 测试 + GitHub Actions CI(展示 QA 专业背景,兼作求职 portfolio)
- 部署成本为零(Cloudflare Pages 免费层)

## 1. 技术栈

| 项目 | 选择 | 理由 |
|---|---|---|
| 框架 | Astro 5(static output) | 纯静态营销站,零 JS 默认输出,跑分轻松全绿 |
| 样式 | Tailwind CSS 4 | 快速迭代,模板可复用给客户项目 |
| 双语 | Astro 内置 i18n routing | `/` = English(默认),`/zh/` = 中文 |
| 表单 | Formspree(免费层 50 条/月) | 无后端,够用 |
| 部署 | Cloudflare Pages | 免费、快、含 SSL,git push 自动部署 |
| 测试 | Playwright + GitHub Actions | 自己的核心技能,每次 push 跑 E2E |
| 分析 | Cloudflare Web Analytics | 免费、无 cookie、不拖慢速度 |

## 2. 站点结构(5 页 × 2 语言)

```
/               Home        首页:主张 + 测试报告卡 + 套餐摘要 + CTA
/packages       Packages    套餐与价格:三档套餐 + Care Plan + 加购项
/work           Work        案例:先放 2–3 个 demo 站,后续替换为真实客户
/about          About       关于:QA 背景故事、为什么便宜但不廉价、双语能力
/contact        Contact     联系:表单 + 直接联系方式 + 流程说明(定金→交付)
/zh/...                     以上全部页面的中文版
```

导航:左 logo,右 5 个链接 + 语言切换(EN / 中文)。
页脚:联系方式、GitHub 链接、"This site scores 100/100/100/100 on Lighthouse — yours can too."

## 3. 设计方向

**品牌主张:** Tested. Bilingual. Affordable. —— 经过测试的网站,不是碰运气的网站。

**设计 tokens(严格遵守,不要自行发挥):**

```
颜色:
  --ink:        #1C2127   主文字,近黑的冷灰
  --paper:      #F7F8F6   背景,冷调灰白(不要暖米色)
  --pounamu:    #0E6B5C   主品牌色,NZ 绿玉石深绿(链接、按钮、强调)
  --pass:       #2BA84A   测试通过的勾选绿(仅用于 scorecard 区块)
  --line:       #D8DCD9   分隔线、边框
  --mono-bg:    #EDF0EE   代码/报告卡背景

字体(Google Fonts,自托管以保速度):
  Display:  IBM Plex Sans, weight 600/700 — 标题
  Body:     IBM Plex Sans, weight 400/450 — 正文
  Report:   IBM Plex Mono — 测试报告卡、价格数字、技术细节
  中文回退: 'Noto Sans SC' 或系统字体栈

布局:
  最大宽度 1100px,大量留白,克制使用圆角(4px,不要大圆角)
  移动端优先,所有页面在 380px 宽度下必须完美
```

**签名元素 — 测试报告卡(The Scorecard):**
首页 hero 下方放一个等宽字体风格的"测试报告"区块,样式像终端/测试输出:

```
  ✓ Performance      100
  ✓ Accessibility    100
  ✓ Best Practices   100
  ✓ SEO              100
  ✓ Mobile           PASS  (tested on real devices)
  ✓ Cross-browser    PASS  (Chrome / Safari / Firefox / Edge)
  ✓ Forms            PASS  (automated E2E tests)
  ─────────────────────────
  Every site I deliver ships with this report.
```

数字用真实跑分,上线后截图为证。这是全站唯一"花哨"的地方,其余保持安静克制。
动效:仅 scorecard 的勾选项做一次性的逐行淡入(respect prefers-reduced-motion),其他地方不加动画。

**文案语气:** 直接、具体、不吹。说"7 个工作日交付,含 2 轮修改",不说"极致体验"。中文版单独撰写,不要直译腔。

## 4. 构建阶段

### Phase 0 — 项目初始化
- [ ] `npm create astro@latest` → 选 minimal + TypeScript strict
- [ ] 加 Tailwind:`npx astro add tailwind`
- [ ] 建目录:`src/layouts/` `src/components/` `src/pages/zh/` `src/i18n/`
- [ ] 配置 `astro.config.mjs` 的 i18n:defaultLocale `en`,locales `['en','zh']`
- [ ] git init,首次 commit,推到 GitHub 新仓库

### Phase 1 — 全局布局与组件
- [ ] `BaseLayout.astro`:HTML 骨架、字体加载、SEO meta(title/description/og 标签,接受 props)
- [ ] `Header.astro`:导航 + 语言切换(切换时保持当前页面,如 /packages ↔ /zh/packages)
- [ ] `Footer.astro`
- [ ] `Button.astro`、`Scorecard.astro`(签名组件)、`PackageCard.astro`
- [ ] `src/i18n/ui.ts`:导航和通用 UI 文案的中英字典

### Phase 2 — 五个英文页面
- [ ] Home:hero(一句话主张 + CTA)→ Scorecard → 三档套餐摘要卡 → 流程四步 → CTA
- [ ] Packages:三档套餐详情表 + Care Plan $39/月 + 加购项清单 + FAQ(定金、修改轮定义、交付时间)
- [ ] Work:案例卡片网格(暂用 2–3 个占位 demo,结构留好:截图 + 行业 + 用了哪档套餐)
- [ ] About:QA 背景 → 为什么做这件事 → 双语能力 → 照片
- [ ] Contact:Formspree 表单(姓名、生意名称、需求描述、预算档位下拉)+ 流程时间线

### Phase 3 — 中文版五页
- [ ] 复制页面结构到 `src/pages/zh/`,内容用地道中文重写(不是翻译腔)
- [ ] 验证语言切换在每一页都正确互跳
- [ ] `<html lang>` 正确切换,中文页面字体回退正常

### Phase 4 — SEO 与表单
- [ ] 每页独立 title/description(中英分别写),sitemap(`@astrojs/sitemap`)
- [ ] OG image(可以就是 Scorecard 的截图)
- [ ] Formspree 接入并真实测试一次提交
- [ ] favicon、robots.txt

### Phase 5 — Playwright 测试 + CI
- [ ] `npm init playwright@latest`
- [ ] 测试用例:每页 200 响应、导航链接全通、语言切换正确、表单可填写并提交(mock endpoint)、移动端视口无横向滚动
- [ ] GitHub Actions:push 时 build + 跑全部测试,README 放 CI badge
- [ ] README 写清楚这个仓库同时是服务官网和测试演示项目

### Phase 6 — 部署上线
- [ ] Cloudflare Pages 连接 GitHub 仓库,自动部署
- [ ] 买域名(.co.nz 或 .nz,$25–40/年)并绑定
- [ ] 接 Cloudflare Web Analytics
- [ ] 真机检查:自己的手机 + 至少一台 iPhone/Android 借测
- [ ] 跑 Lighthouse,截图真实分数填进 Scorecard
- [ ] 最后过一遍 Phase 5 的测试清单 → 上线

## 5. 验收标准(Definition of Done)

1. Lighthouse 移动端四项 ≥ 95(目标 100)
2. 中英 10 个页面全部可达,语言切换无死链
3. Playwright 全绿,CI badge 显示 passing
4. 表单真实收到一封测试提交
5. 380px 宽度下无横向滚动、无文字溢出
6. 让一个不懂技术的朋友 30 秒内说出:你卖什么、多少钱、怎么联系你

## 6. Cursor 使用建议

- 每次只让它做一个 Phase,做完自己 review 再 commit
- 设计 tokens 直接贴给它,明确说"不要改颜色和字体"
- 中文文案自己写或自己把关,AI 直译的中文一眼假
- 卡住时让它"explain before fixing",别让它盲目重写

# Vantage — Design System
> Bloomberg-inspired institutional web aesthetic, adapted to a white + dark-blue Vantage palette.
> This is a living doc. Add new inspiration screenshots to `/inspiration/` and append the patterns you see to the relevant section.
---
## 1. What we're channeling from Bloomberg
The Bloomberg.com pattern is the institutional gold standard for financial web design. Distilling the specific moves from the reference screenshot:
### 1.1 Header architecture (three layers)
1. **Utility strip** (top, ~32px tall, very light gray background) — corporate / legal / account links. Tiny type, low contrast.
2. **Brand bar** (~80px tall, white background) — the wordmark sits large on the left, account + search icon on the right. The wordmark is *visually dominant*; it earns its space.
3. **Primary nav bar** (~52px tall, dark background) — section nav with subtle dropdown carets, a live indicator dot for live content, edition selector right-aligned.
The three-layer header is the single most "institutional finance" visual cue. It signals seriousness, large org, multiple audiences. Vantage will adapt it (slimmer, two layers, less dense) but preserve the structural hierarchy.
### 1.2 Typography
- **Headlines** are large, weighty, and use a serif or distinctive transitional face. The "Stocks" headline in the reference is roughly 56–64px, near-bold, tight letter-spacing.
- **Section labels** ("Today in the Markets", "Compare to Benchmarks", "Americas") are bold sans-serif, ~24–28px.
- **Tab labels** use weight contrast for state — bold for active, regular gray for inactive. No underlines.
- **Tabular data** uses tabular-figure numerics so columns of digits align perfectly.
- **Tickers** are uppercase, slightly compressed, often paired with a smaller currency code (e.g., `MXAP:IND` then `272.28 USD` below).
### 1.3 Color logic
- White dominates. Almost everything is on white.
- Black (or near-black) is the primary text color.
- A single brand accent appears sparingly (Bloomberg uses orange/red for "Anywhere Remote Login" and the Live TV dot — these are the things they want clicks on).
- **Green and red are reserved for direction only** — gains, losses, up/down arrows. Never used decoratively.
- Light gray (`#F5F5F7`-ish) sections separate content blocks. No heavy borders.
### 1.4 Data display patterns
- **Index cards** — small white tiles with subtle shadow, containing: ticker line, value + currency, ▲▼% in colored direction, and a tiny inline sparkline. Tight spacing.
- **Heatmap / treemap** — tiles sized by some weight (market cap, contribution to risk, etc.) and colored by direction. Powerful at a glance.
- **Data tables** — tight rows, tabular numerics, columnar arrows for change, time column right-aligned, light-gray hover state, no vertical borders.
- **Section expand/collapse** — chevron in the section header lets users hide whole blocks. Density is high but controllable.
- **Sub-nav as text chips** — flat text labels like `Futures · Americas · EMEA · APAC`, no underlines, weight = state.
### 1.5 Layout rhythm
- Generous whitespace between sections, especially vertical.
- Cards arranged in clean 5-column or 4-column grids.
- Section title sits on its own row with full breathing space; content begins below.
- A light gray block envelopes a related cluster (the "Today in the Markets" block on Bloomberg) to group without using borders.
---
## 2. Vantage adaptation — the palette swap
Bloomberg uses orange/red as its accent. Vantage uses **dark blue + white** as the brand foundation, with a bright accent blue for interactive elements. The Bloomberg moves all translate cleanly.
### 2.1 Color tokens
```css
:root {
  /* Surfaces */
  --surface-canvas:        #FFFFFF;   /* the dominant white */
  --surface-elevated:      #FFFFFF;   /* cards on canvas */
  --surface-muted:         #F8FAFC;   /* light section background (slate-50) */
  --surface-strong:        #0B1B2E;   /* nav bar, footer */
  --surface-overlay:       rgba(11, 27, 46, 0.04);
  /* Text */
  --text-primary:          #0B1B2E;   /* the dark-blue near-black */
  --text-secondary:        #475569;   /* slate-600 */
  --text-muted:            #64748B;   /* slate-500 */
  --text-on-dark:          #FFFFFF;
  --text-on-dark-muted:    #94A3B8;   /* slate-400 */
  /* Brand */
  --brand-navy:            #0B1B2E;   /* primary dark blue */
  --brand-navy-tint:       #14304F;
  --brand-accent:          #2563EB;   /* interactive blue */
  --brand-accent-hover:    #1D4ED8;
  --brand-accent-soft:     #DBEAFE;
  /* Direction (universal, NEVER decorative) */
  --gain:                  #15803D;   /* emerald-700 — slightly more refined than retail green */
  --gain-bg:               #DCFCE7;
  --loss:                  #B91C1C;   /* red-700 */
  --loss-bg:               #FEE2E2;
  --neutral:               #64748B;
  /* Lines / borders */
  --border-subtle:         #E2E8F0;   /* slate-200 */
  --border-default:        #CBD5E1;   /* slate-300 */
  --border-strong:         #94A3B8;
  /* Live indicator */
  --live-dot:              #DC2626;   /* the one allowed red — for "live" status */
  /* Shadows */
  --shadow-card:           0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06);
  --shadow-elevated:       0 4px 12px rgba(15, 23, 42, 0.08);
}
```
The trick: navy at `#0B1B2E` is dark enough to *feel* like black on white, but reads warmer and more brand-distinctive. The accent blue `#2563EB` is reserved for *interactive* elements (links, buttons, focus rings, active tabs) — it's not used for headers or static text.
### 2.2 Typography stack
Two faces, mirroring the Bloomberg approach (serif headline + sans body):
```css
--font-display: "Source Serif 4", "Georgia", "Times New Roman", serif;
--font-sans:    "Inter", "Helvetica Neue", system-ui, sans-serif;
--font-mono:    "JetBrains Mono", "SF Mono", "Menlo", monospace;
```
Why these:
- **Source Serif 4** is a free Google Font that reads institutional and modern at the same time. Bloomberg uses a custom serif; Source Serif 4 is the closest free analog and has variable weights.
- **Inter** is the workhorse sans for fintech (Stripe, Linear, Vercel, Mercury all use it). Has tabular figures, slashed zero, and excellent legibility at small sizes.
- **JetBrains Mono** for monospace data needs (transaction hashes, raw values, code blocks).
Scale:
| Token | Size | Line height | Weight | Use |
|---|---|---|---|---|
| `display-xl` | 64px | 1.05 | 600 | Cover hero, "Stocks"-style page titles |
| `display-lg` | 48px | 1.1 | 600 | Section page titles |
| `display-md` | 36px | 1.15 | 600 | Module hero |
| `headline` | 28px | 1.2 | 700 | "Today in the Markets" |
| `title` | 20px | 1.3 | 700 | Card titles, table titles |
| `body-lg` | 17px | 1.55 | 400 | Lede paragraphs |
| `body` | 15px | 1.55 | 400 | Default |
| `body-sm` | 13px | 1.5 | 400 | Captions, helper text |
| `label` | 12px | 1.3 | 600 (uppercase, tracking 0.06em) | Eyebrows, tab labels |
| `tabular` | 14px | 1.4 | 500 (font-variant-numeric: tabular-nums) | All financial figures |
### 2.3 Spacing & radius
Use an 8px grid. Common values: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96`.
Radii are conservative — institutional finance hates "rounded chunky":
```css
--radius-sm:  4px;   /* tags, small chips */
--radius-md:  6px;   /* buttons, inputs */
--radius-lg:  8px;   /* cards */
--radius-xl:  12px;  /* sections, large containers */
```
### 2.4 Motion
- Transitions are *quiet*: 150ms ease-out is the default.
- No bouncy springs. No long fades.
- Hover states are minimal — slight background tint, never scale or translate.
- Sparklines animate in on first paint (300ms draw); subsequent updates are instant.
---
## 3. Component patterns
These are the building blocks that come straight from the Bloomberg vocabulary, restyled for Vantage.
### 3.1 Three-layer header (homepage / marketing)
**Layer 1 — Utility strip** (32px, `--surface-muted` background, `--text-muted` text):
- Left: "Product" carets the mega-menu, "Pricing", "How it works"
- Right: "Sign in", "Start free trial" (the accent-colored CTA)
**Layer 2 — Brand bar** (72px, white):
- Left: Vantage wordmark, full size (~24px height), `--font-display` for the logotype if we adopt the serif treatment, otherwise heavy Inter
- Right: search icon, plus user avatar if signed in
**Layer 3 — Primary nav** (48px, `--surface-strong` dark-blue background, white text):
- Left: section nav (Product · Solutions · How it works · Pricing · Customers · Methodology)
- Right: edition / locale selector if/when international
When the user scrolls, layers 1 and 3 collapse; only the brand bar remains, condensed.
### 3.2 In-app top bar (authenticated app)
- 56px tall, white background, single `--border-subtle` bottom line.
- Left: compact Vantage wordmark + a `/` separator + current workspace name.
- Middle: command palette input (⌘K) — wide, with placeholder "Search clients, portfolios, scenarios…"
- Right: notifications bell, advisor avatar, settings cog.
### 3.3 Page header pattern (the "Stocks" treatment)
```
┌────────────────────────────────────────────────────────────┐
│  STRESS TESTING                                            │   ← eyebrow (label style)
│                                                            │
│  Households                                                │   ← display-xl, serif
│                                                            │
│  All Households · Watchlist · Recently stressed · Drafts   │   ← sub-nav text chips
│                                                            │
└────────────────────────────────────────────────────────────┘
```
Plenty of vertical breathing room. The eyebrow tells the user where they are in the IA; the title is the proud headline; the sub-nav lets them filter without leaving.
### 3.4 Metric / index card (Bloomberg's index tile, adapted)
A 1×1 card showing one portfolio's snapshot:
- Top line: portfolio name (truncated, bold, 14px) + small chevron menu
- Big number line: portfolio NAV (`tabular` 24px) + ` USD` (12px, muted)
- Direction line: `▲ 0.47%` in `--gain` or `▼ 0.36%` in `--loss`, tabular numerics
- Sparkline: 30-day NAV, single stroke, 1.5px, in `--gain` or `--loss` depending on net direction, with a subtle gradient fill underneath at 10% opacity
- Card chrome: 1px `--border-subtle`, `--radius-lg`, `--shadow-card`, padding 16px
- Hover: `--shadow-elevated`, no transform
These tile in a 5-column grid on desktop, 2-column on tablet, 1-column on mobile.
### 3.5 Heatmap / treemap (the right-side block on Bloomberg)
Use for: portfolio risk decomposition by factor, sector contribution to drawdown, holdings sized by stress-impact.
- Each tile sized by a weight (e.g., contribution to total stress loss).
- Color by direction: green for hedged positives, red for losses, intensity by magnitude.
- White hairline between tiles. Ticker / label fills the tile, truncating gracefully.
- Hover reveals exact value in a small floating card.
- Click filters the table below to that tile.
### 3.6 Data table (the "Americas" pattern)
Tight, scannable, all monetary values right-aligned with tabular figures:
```
| Name ▾                                     | Value     | Change   | % Change | 1 Month | 1 Year   | Time (EDT) |
|--------------------------------------------|-----------|----------|----------|---------|----------|------------|
|  ⊕  Smith Household · 60/40 Growth         | 4,762,310 | ▲ 12,401 | ▲ 0.26%  | ▲ 1.32% | ▲ 14.8%  | 4:50 PM    |
|     Smith Household · Aggressive Sleeve    | 2,118,902 | ▼ 4,201  | ▼ 0.20%  | ▼ 0.41% | ▲ 8.9%   | 4:50 PM    |
```
- Header row uses `label` style, sortable carets shown on hover.
- Rows are 44px high; hover applies `--surface-overlay`.
- No vertical borders. Horizontal `--border-subtle` only.
- Direction arrows replace +/- signs throughout.
- Time column uses muted text.
### 3.7 Tab system
Flat text tabs, no underline boxes, weight + color delineates state:
- Active: `--text-primary`, weight 600, with a 2px `--brand-accent` underline that sits 8px below the text.
- Inactive: `--text-muted`, weight 400, no underline.
- Hover on inactive: `--text-secondary`.
- 24px horizontal gap between tabs.
### 3.8 Live / status indicator
A 6px circle pulsing 1.5s on `--live-dot` with the label "Live" in uppercase next to it. Used sparingly — e.g., "Live · Markets Open" or "Live · Stress Engine Active".
### 3.9 Section wrap with collapse
The "Today in the Markets" pattern: a labeled block on `--surface-muted` background with rounded `--radius-xl` corners, padding 32px, optional chevron in the top-right to collapse. The block contains its own internal tabs and sub-content.
### 3.10 Button system
```
.btn-primary    bg=--brand-accent  hover=--brand-accent-hover  text=white  weight=600
.btn-secondary  bg=transparent     border=1px --border-default  text=--text-primary  hover=bg=--surface-muted
.btn-ghost      bg=transparent     text=--text-secondary  hover=--text-primary
.btn-dark       bg=--surface-strong  text=white  hover=--brand-navy-tint
```
All buttons: `--radius-md`, padding 10px 16px, weight 600, font-size 14px. No shadows on buttons. Subtle focus ring (2px `--brand-accent`).
---
## 4. Page-level templates
### 4.1 Marketing homepage
- Three-layer header (above)
- Hero: large serif headline, supporting sub-headline, two CTAs (Start free trial / Watch a 60-second demo). Right side: an embedded live stress dashboard demo cycling through scenarios.
- Section: "How Vantage works" — three steps, illustrated with screenshots of the actual product.
- Section: "Built for advisors who need answers in the room, not after the meeting" — three testimonial-style quotes.
- Section: "Inside the 12-section dashboard" — collapsible accordion showing what each section is.
- Section: "How Vantage compares" — comparison row vs. Nitrogen and Orion Risk Intelligence, but framed neutrally ("you might also be evaluating…").
- Pricing module: three cards, the middle one elevated.
- Footer: dark-blue, multi-column, methodology / company / legal / status link.
### 4.2 In-app dashboard
- Compact top bar (3.2)
- Page header (3.3) — eyebrow "DASHBOARD", title "Today", sub-nav of household groups.
- Three-tile row: "Households at risk" (count + red badge), "Stress tests run this week" (count + sparkline), "Plans needing review" (count).
- Heatmap (3.5) of risk by household — full-width.
- Data table (3.6) below, with the standard household rows.
- Right rail: news feed driven by holdings.
### 4.3 Stress run results (the existing hero)
- The 12 sections become 12 cards in a single scrollable column on the left, with a sticky navigator on the right showing all sections, with a "completed" check next to each as it streams in from the parallel specialists.
- Each section card is collapsed by default to a one-line headline + the key number + an "Expand" link, mirroring Bloomberg's section pattern.
- Top of page: a "Download PDF / Send to client / Share link" toolbar always visible.
---
## 5. Bloomberg patterns we are *not* keeping
To stay clean and not feel like a 2000s terminal port:
- No ticker tape across the top.
- No animated price flashing.
- No more than 3 columns of secondary nav.
- No grids smaller than 8px gutter.
- No yellow highlights, no orange accents.
- No ads, period.
- No densest-possible data tables — we leave room to breathe.
---
## 6. Inspiration log
Add each new reference here as you collect them. Note specifically *what* you want to keep, so we don't end up with a Frankensite.
| # | Source | Screenshot | Patterns to keep |
|---|---|---|---|
| 1 | Bloomberg.com / Stocks | _user-provided 2026-05-12_ | Three-layer header, index card pattern, heatmap, sub-nav as text chips, "Today in the Markets" wrapped section, data table with directional arrows |
| 2 | _(awaiting)_ | | |
| 3 | _(awaiting)_ | | |
---
## 7. Implementation notes for Claude Code
When ready to build, instruct Claude Code:
1. **Tokens first.** Drop tokens from §2.1, §2.2, §2.3 into `frontend/app/globals.css` as CSS variables, plus a Tailwind config extension mapping them. No hard-coded hex values anywhere in the app.
2. **Component library.** Build the components in §3 under `frontend/components/system/` first, before any pages. One component, one Storybook-style demo route (`/_dev/components/<name>`) to make visual review easy.
3. **Page-level templates** in §4 reuse the system components — no bespoke styling at the page level.
4. **Bloomberg-style flourishes** to add: tabular-num CSS on every monetary value, `▲▼` arrows replacing +/− globally, sparklines via a single `<Sparkline data={…} />` component, the live-dot indicator as `<LiveBadge label="…" />`.
5. **Accessibility.** All color usage passes WCAG AA on white and on the dark-blue nav. Test contrast in CI.
6. **Density toggle.** Add a workspace-level setting that switches between "Comfortable" (default) and "Compact" densities. Compact tightens row heights and reduces padding by ~25%. Power users will love this.
---
*Next: send the additional inspiration screenshots and I'll fold their specific patterns into §6 and update §3 / §4 where they sharpen what we have.*

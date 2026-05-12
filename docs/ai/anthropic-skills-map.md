# Anthropic Financial-Services Skills → Vantage Module Map

> Generated 2026-05-12. Source: `claude-for-financial-services` plugin bundles v0.1.0.
> Do not edit skill descriptions — they mirror upstream SKILL.md files.

---

## Installed bundles

| Bundle | Version | Skills | Commands | Load status |
|--------|---------|--------|----------|-------------|
| wealth-management | 0.1.0 | 6 | 6 | ⚠️ disabled (hook config) |
| equity-research | 0.1.0 | 8 | 9 | ⚠️ disabled (hook config) |
| financial-analysis | 0.1.0 | 11 | 7 | ⚠️ disabled (hook config) |
| private-equity | 0.1.0 | 9 | 10 | ⚠️ disabled (hook config) |

> Note: "disabled" means the plugin hook manifest has a format issue (expected object, received array).
> The SKILL.md files are fully readable and usable as prompt patterns — only the auto-registration is blocked.

---

## Skills map

| Skill | Bundle | Slash command | Vantage module | Use mode | Priority |
|-------|--------|--------------|----------------|----------|----------|
| **client-review** | wealth-management | `/client-review` | Households → Client Review | `prompt-pattern` + `slash-command` | **P0** |
| **tax-loss-harvesting** | wealth-management | `/tlh` | Tax → TLH Scanner | `prompt-pattern` + `slash-command` | **P0** |
| **financial-plan** | wealth-management | `/financial-plan` | Planning → Goal-Based Plan | `prompt-pattern` + `slash-command` | **P0** |
| **portfolio-rebalance** | wealth-management | `/rebalance` | Portfolios → Rebalance | `prompt-pattern` + `slash-command` | **P0** |
| **investment-proposal** | wealth-management | `/proposal` | Households → New Prospect | `prompt-pattern` + `slash-command` | **P1** |
| **client-report** | wealth-management | `/client-report` | Households → Report | `prompt-pattern` + `slash-command` | **P1** |
| **morning-note** | equity-research | `/morning-note` | Research → Macro Dashboard | `prompt-pattern` + `slash-command` | **P1** |
| **earnings-analysis** | equity-research | `/earnings` | Research → Manager DD | `prompt-pattern` | **P2** |
| **earnings-preview** | equity-research | `/earnings-preview` | Research → Manager DD | `reference` | **P2** |
| **initiating-coverage** | equity-research | `/initiate` | Research → Manager DD | `reference` | **P2** |
| **idea-generation** | equity-research | `/screen` | Research → Watchlists | `reference` | **P2** |
| **sector-overview** | equity-research | `/sector` | Research → Macro Dashboard | `reference` | **P2** |
| **thesis-tracker** | equity-research | `/thesis` | Research → Manager DD | `reference` | **P2** |
| **model-update** | equity-research | `/model-update` | Research → Manager DD | `reference` | **P2** |
| **catalyst-calendar** | equity-research | `/catalysts` | Research → News Feed | `reference` | **P2** |
| **audit-xls** | financial-analysis | *(none)* | Portfolios → Upload | `prompt-pattern` | **P0** |
| **3-statement-model** | financial-analysis | `/3-statement-model` | Research → Manager DD | `reference` | **P2** |
| **dcf-model** | financial-analysis | `/dcf` | Research → Manager DD | `reference` | **P2** |
| **comps-analysis** | financial-analysis | `/comps` | Research → Manager DD | `reference` | **P2** |
| **lbo-model** | financial-analysis | `/lbo` | Enterprise only | `reference` | **P2** |
| **competitive-analysis** | financial-analysis | `/competitive-analysis` | Research → Manager DD | `reference` | **P2** |
| **deck-refresh** | financial-analysis | *(none)* | Presentations → Export | `reference` | **P2** |
| **ib-check-deck** | financial-analysis | *(none)* | Presentations → Export | `reference` | **P2** |
| **pptx-author** | financial-analysis | *(none)* | Presentations → Export | `prompt-pattern` | **P1** |
| **xlsx-author** | financial-analysis | *(none)* | Portfolios → Export | `prompt-pattern` | **P1** |
| **clean-data-xls** | financial-analysis | *(none)* | Portfolios → Upload | `prompt-pattern` | **P1** |
| **skill-creator** | financial-analysis | *(none)* | Dev tooling | `reference` | **P2** |
| **ppt-template-creator** | financial-analysis | *(none)* | Presentations | `reference` | **P2** |
| **ic-memo** | private-equity | `/ic-memo` | Enterprise → IC Memo | `prompt-pattern` + `slash-command` | **P2** |
| **dd-checklist** | private-equity | `/dd-checklist` | Enterprise → Due Diligence | `reference` | **P2** |
| **dd-meeting-prep** | private-equity | `/dd-prep` | Enterprise → Due Diligence | `reference` | **P2** |
| **deal-screening** | private-equity | `/screen-deal` | Enterprise | `reference` | **P2** |
| **deal-sourcing** | private-equity | `/source` | Enterprise | `reference` | **P2** |
| **portfolio-monitoring** | private-equity | `/portfolio` | Enterprise | `reference` | **P2** |
| **returns-analysis** | private-equity | `/returns` | Enterprise | `reference` | **P2** |
| **unit-economics** | private-equity | `/unit-economics` | Enterprise | `reference` | **P2** |
| **value-creation-plan** | private-equity | `/value-creation` | Enterprise | `reference` | **P2** |
| **ai-readiness** | private-equity | `/ai-readiness` | Enterprise | `reference` | **P2** |

---

## P0 skills — what they unlock in Vantage

### `client-review` → Households → Client Review prep
**Workflow in Vantage:** Advisor opens a household, clicks "Prep meeting" → Claude runs the
6-step workflow (client context → performance vs benchmark → allocation drift → talking points →
proactive recommendations → one-page summary). Output surfaces in-app and exports to PDF.

### `tax-loss-harvesting` → Tax → TLH Scanner
**Workflow in Vantage:** TLH Scanner page calls the 7-step workflow (identify candidates →
gain/loss budget → replacement securities → wash sale check → execution plan → tracking).
Already partially designed in Phase D. This skill provides the wash-sale calendar and trade sheet.

### `financial-plan` → Planning → Goal-Based Plan
**Workflow in Vantage:** Goal-based planning page. The skill's 7 steps map to Vantage's
cash-flow projector, Monte Carlo, and scenario comparison table (already in the stress engine).

### `portfolio-rebalance` → Portfolios → Rebalance
**Workflow in Vantage:** After drift analysis, advisor clicks "Generate rebalance trades."
Skill produces the tax-aware trade list across account types. Integrates with saved portfolios.

### `audit-xls` → Portfolios → Upload
**Workflow in Vantage:** When an advisor uploads an Excel portfolio, run a lightweight
formula-level audit (Step 2 checks) before ingesting. Flag hardcodes, off-by-one ranges,
and unit mismatches. Show inline warnings in the upload flow.

---

## Use mode definitions

| Mode | Meaning |
|------|---------|
| `prompt-pattern` | Copy the skill's step-by-step workflow into the matching backend Claude prompt. Add `# Skill: <name>` traceability comment. |
| `slash-command` | Surface the skill's slash command to the advisor via command palette (Cmd+K). Link to the matching Vantage page. |
| `reference` | Read the SKILL.md for design patterns and terminology only. No code changes needed now. |

---

## Disk paths (plugin cache)

```
C:/Users/guilh/.claude/plugins/cache/claude-for-financial-services/
├── wealth-management/0.1.0/
│   ├── skills/client-review/SKILL.md
│   ├── skills/tax-loss-harvesting/SKILL.md
│   ├── skills/financial-plan/SKILL.md
│   ├── skills/portfolio-rebalance/SKILL.md
│   ├── skills/investment-proposal/SKILL.md
│   └── skills/client-report/SKILL.md
├── equity-research/0.1.0/
│   ├── skills/morning-note/SKILL.md
│   ├── skills/earnings-analysis/SKILL.md
│   ├── skills/earnings-preview/SKILL.md
│   ├── skills/initiating-coverage/SKILL.md
│   ├── skills/idea-generation/SKILL.md
│   ├── skills/sector-overview/SKILL.md
│   ├── skills/thesis-tracker/SKILL.md
│   ├── skills/model-update/SKILL.md
│   └── skills/catalyst-calendar/SKILL.md
├── financial-analysis/0.1.0/
│   ├── skills/audit-xls/SKILL.md
│   ├── skills/3-statement-model/SKILL.md
│   ├── skills/dcf-model/SKILL.md
│   ├── skills/comps-analysis/SKILL.md
│   ├── skills/lbo-model/SKILL.md
│   ├── skills/competitive-analysis/SKILL.md
│   ├── skills/deck-refresh/SKILL.md
│   ├── skills/ib-check-deck/SKILL.md
│   ├── skills/pptx-author/SKILL.md
│   ├── skills/xlsx-author/SKILL.md
│   ├── skills/clean-data-xls/SKILL.md
│   ├── skills/skill-creator/SKILL.md
│   └── skills/ppt-template-creator/SKILL.md
└── private-equity/0.1.0/
    ├── skills/ic-memo/SKILL.md
    ├── skills/dd-checklist/SKILL.md
    ├── skills/dd-meeting-prep/SKILL.md
    ├── skills/deal-screening/SKILL.md
    ├── skills/deal-sourcing/SKILL.md
    ├── skills/portfolio-monitoring/SKILL.md
    ├── skills/returns-analysis/SKILL.md
    ├── skills/unit-economics/SKILL.md
    ├── skills/value-creation-plan/SKILL.md
    └── skills/ai-readiness/SKILL.md
```

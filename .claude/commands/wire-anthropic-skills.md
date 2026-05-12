# /wire-anthropic-skills
> Install, verify, and integrate Anthropic's financial-services-plugins skill bundles into Vantage.
> Invoke with `/wire-anthropic-skills` to run all tasks, or scope with `/wire-anthropic-skills task=N`.
---

## Purpose
Wire the four Anthropic financial-services skill bundles (wealth-management, equity-research,
financial-analysis, private-equity) into the Vantage advisor workspace so skills are:
1. Discoverable — mapped to the Vantage module they enhance
2. Invocable — slash commands registered and working
3. Patterned — Claude prompts in the Vantage backend adopt the skill workflows

## Tasks

### Task 1 — Verify + scaffold (run first, stop and report)
1. Verify installed plugins: `claude plugin list`
2. Install any missing bundles from `https://github.com/anthropics/financial-services-plugins`
3. Confirm skill files exist at `.claude/plugins/cache/claude-for-financial-services/<bundle>/`
4. Create `docs/ai/` directory
5. Scaffold `.claude/skills/` symlink stubs for each financial-services skill
6. Produce full verification table (bundle, skill, disk path, load status)
7. **Stop and report** — do not proceed to Task 2 without user confirmation

### Task 2 — Skills → Vantage module map (stop and confirm before Task 3)
Read each SKILL.md and produce `docs/ai/anthropic-skills-map.md`:
- Table: Skill | Bundle | Vantage Module | Use Mode | Priority
- Use modes: `prompt-pattern` (copy the workflow into a backend Claude prompt),
  `slash-command` (surface the /command to the advisor in-app),
  `reference` (read for design patterns only)
- Priority: P0 (blocks Phase B/C/D features), P1 (enhances existing), P2 (future phase)
**Stop and confirm** before Task 3.

### Task 3 — QC pass
For each P0/P1 skill, verify the matching Vantage UI page and backend route exist.
Flag gaps. Do not create new files in this task — only report.

### Task 4 — Pattern adoption
For each P0 skill: open the corresponding backend Claude prompt file and insert
a `# Skill pattern` comment block that references the skill workflow steps.
No functional changes — just traceability markers so future devs know the source.

### Task 5 — Runtime wiring
Register each wealth-management slash command in `app/(workspace)/layout.tsx`
as a command palette entry (Cmd+K). Each entry shows the trigger phrases from SKILL.md
and links to the relevant Vantage page.

### Task 6 — Cowork plugin (optional, ask first)
`claude plugin install cowork` to enable real-time skill sharing with a co-developer.
Ask before installing — it modifies `.claude/settings.json`.

## Plugin bundles

| Bundle | Install name | Skill count | Primary Vantage use |
|--------|-------------|-------------|---------------------|
| wealth-management | financial-services-plugins/wealth-management | 6 | Phase B/C/D core |
| equity-research | financial-services-plugins/equity-research | 8 | Research module (Phase E) |
| financial-analysis | financial-services-plugins/financial-analysis | 11 | Portfolio upload / Excel audit |
| private-equity | financial-services-plugins/private-equity | 9 | Enterprise / IC memo feature |

## Plugin cache location
`C:/Users/guilh/.claude/plugins/cache/claude-for-financial-services/<bundle>/0.1.0/`

## Rules
- Never modify SKILL.md files — they are upstream read-only
- All backend Claude prompt changes go through `backend/app/services/claude/`
- Every AI output from a skill must carry the "AI-assisted — verify before delivery" badge
- Stop and confirm after Task 1 and Task 2 before proceeding

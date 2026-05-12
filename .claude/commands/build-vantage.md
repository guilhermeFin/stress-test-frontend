# /build-vantage
> Claude Code master command for completing **Vantage** — the institutional portfolio stress testing platform for independent wealth managers and RIAs.
>
> Save as `.claude/commands/build-vantage.md` in the repo root and invoke with `/build-vantage` inside Claude Code. Scope individual passes with `/build-vantage phase=N` or `/build-vantage module=<name>`.
---
## 0. Mission
You are completing **Vantage**, the operating system for independent wealth managers and RIAs whose primary pain is **communication speed and client trust during market panic**. The hero workflow is already live:
> Upload portfolio → pick crisis → 12-section institutional dashboard in 60 seconds → branded PDF.
Your job is to (a) harden the hero, and (b) extend Vantage from a one-shot stress-test tool into the **daily advisor workspace** the founder envisions — covering planning, tax, estate, behavioral coaching, research, daily performance, personalized news, presentations, and a white-label client portal — without losing the speed and clarity that define the product today.
**Brand essence:** *Clarity in uncertainty. Confidence in every decision.* Every UI choice, every Claude prompt, every error message should ladder back to this. No jargon walls. No mystery loading states. Numbers always have units. Every recommendation has a one-sentence "why."
**Voice:** Institutional but plain-spoken. Think Bridgewater research note rewritten for a CFP audience — directional, evidence-led, never breathless.
---
## 1. Product Snapshot (current state, May 2026)
- **Live frontend:** `https://stress-test-frontend-three.vercel.app` (Next.js + Tailwind + TS, Vercel)
- **Live API:** `https://stress-test-backend-production.up.railway.app` (Python FastAPI on Railway, async)
- **Data sources:** Claude API (3.5 Sonnet for analysis, Haiku for fast subtasks), `yfinance` for prices, FRED for macro series.
- **Core flow today:** Excel/ticker upload → choose historical crisis (2008 GFC, COVID, Dot-Com, Black Monday, 2022 Rate Shock, Stagflation) or describe custom scenario in plain English → returns the **12-section institutional dashboard**:
| # | Section | Status |
|---|---|---|
| 1 | Factor risk model (5 factors) | shipped |
| 2 | Correlation breakdown (normal vs stress) | shipped |
| 3 | Liquidity stress analysis | shipped |
| 4 | Monte Carlo simulation (1,000 paths) | shipped |
| 5 | Benchmark comparison (S&P 500, 60/40, All-Weather, Global Bonds) | shipped |
| 6 | Client impact (goal-based retirement, inflation-adjusted ruin probability) | shipped |
| 7 | Rebalancing recommendations | shipped |
| 8 | Tax impact (TLH, cap gains, withdrawal drag) | shipped |
| 9 | AI analyst memo (advisor note + client letter + suggestions) | shipped |
| 10 | Branded PDF export | shipped |
| 11 | Scenario diff vs. prior run | TO BUILD |
| 12 | Action plan with assignable tasks | TO BUILD |
**Pricing tiers:**
| Plan | Price | Intended ceiling |
|---|---|---|
| Starter | $99/mo | 1 advisor, 10 portfolios, 50 stress tests/mo |
| Professional | $299/mo | 5 advisors, unlimited portfolios, unlimited stress tests, custodian sync, weekly email |
| Enterprise | $799/mo | Unlimited advisors, white-label client portal, SSO, custom scenarios, priority Claude routing |
**Competitive frame:** Riskalyze ($4–10K/yr) and eMoney ($5–15K/yr). Vantage's wedge is **institutional-quality output at mid-market price, with 60-second turnaround**. Every feature decision must protect those three things.
---
## 2. Roadmap (what "ultimate tool" means)
Build in this order. Each phase is shippable on its own.
### Phase A — Harden the hero (MUST come first)
- Auth + user accounts (NextAuth with email + Google + Microsoft).
- Stripe billing wired to the three tiers, with feature gates.
- Saved portfolios (no more re-uploading every run).
- Run history per portfolio with scenario diff (section 11 above).
- Action plan with assignable tasks (section 12 above).
- Compliance footer + disclaimer config per firm.
### Phase B — Daily workspace (the platform layer)
- **Households & Clients** — lightweight CRM: each client household owns one or many portfolios, has a risk profile, goals, family map, advisor of record.
- **Daily performance dashboard** — yesterday's P&L per household, top movers, drift vs. target, alerts.
- **Personalized news & updates** — per-holding feed driven by ticker + sector + macro filters, summarized by Haiku into a 2-line bullet.
- **Inbox** — "what needs my attention today" across all households (drift, plan check-in, RMD, life event, market alert).
### Phase C — Planning & strategy
- **Investment planning** — IPS builder, target allocation, glidepath, rebalance bands.
- **Goal-based planning** — retirement, college, home, legacy, with Monte Carlo (reuse the 1K-path engine; add 10K mode for Pro).
- **Strategy templates** — pre-built strategies (conservative income, balanced growth, aggressive growth, all-weather, factor tilt) that can be applied or customized per household.
### Phase D — Tax, estate, behavioral
- **Tax planning** — annual projector (fed + state + AMT + NIIT), TLH scanner across saved portfolios (wash-sale aware), Roth conversion ladder, asset location optimizer, charitable strategy comparator.
- **Estate planning** — document vault, beneficiary audit, gifting tracker, federal + state estate-tax projection, trust-structure visualizer (revocable, ILIT, GRAT, IDGT, SLAT, dynasty).
- **Behavioral coaching** — drawdown simulator in dollars (not %), market-timing cost calculator, scripted talking points the advisor can pull up mid-meeting during a sell-off.
### Phase E — Research & content
- **Investment research** — manager DD workspace, watchlists, macro dashboard (yield curve, breakevens, credit spreads, FX, commodities) using FRED + yfinance.
- **Investor archetypes & education library** — branded slide decks Vantage ships with: "How a 60/40 behaves in a rate shock," "Why we hold international," "Tax-loss harvesting explained," "What a SLAT does," etc.
- **Presentation builder** — client-meeting slides bound to the household's live data; export PPTX/PDF/share link.
### Phase F — Distribution & enterprise
- **Custodian sync** — Schwab, Fidelity, IBKR (adapter pattern in `backend/app/services/custodian/`).
- **Weekly intelligence email** — personalized digest per household: market recap, holdings news, drift alerts, planning nudges, suggested talking points.
- **White-label client portal** — read-only client view with branded theme per firm, secure messaging, document share.
- **SSO + audit log export** for Enterprise tier.
---
## 3. Tech stack & repo layout
Keep the existing stack. Do not introduce new languages or frameworks unless I approve.
```
vantage/
├── frontend/                      # Next.js 14 (App Router), Tailwind, TS, deployed on Vercel
│   ├── app/
│   │   ├── (auth)/                # sign-in, sign-up
│   │   ├── (app)/
│   │   │   ├── dashboard/         # daily inbox, alerts
│   │   │   ├── households/        # CRM
│   │   │   ├── portfolios/        # saved portfolios + runs
│   │   │   ├── stress/            # hero flow (existing)
│   │   │   ├── planning/
│   │   │   ├── tax/
│   │   │   ├── estate/
│   │   │   ├── coaching/
│   │   │   ├── research/
│   │   │   ├── presentations/
│   │   │   └── settings/          # firm, branding, billing
│   │   └── (portal)/              # white-label client portal
│   ├── components/
│   │   └── ui/                    # shadcn-based, themable per firm
│   ├── lib/
│   │   ├── api.ts                 # typed FastAPI client (generated from OpenAPI)
│   │   ├── auth.ts                # NextAuth config
│   │   ├── billing.ts             # Stripe client
│   │   └── theme.ts               # firm-branding tokens
│   └── modules/                   # feature-scoped components/hooks
├── backend/                       # Python 3.12 + FastAPI, async, deployed on Railway
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── stress.py          # existing
│   │   │   ├── portfolios.py
│   │   │   ├── households.py
│   │   │   ├── planning.py
│   │   │   ├── tax.py
│   │   │   ├── estate.py
│   │   │   ├── research.py
│   │   │   ├── presentations.py
│   │   │   ├── billing.py         # Stripe webhooks
│   │   │   └── webhooks.py        # custodian webhooks
│   │   ├── services/
│   │   │   ├── claude.py          # single gateway: Sonnet for analysis, Haiku for fast jobs
│   │   │   ├── marketdata.py      # yfinance wrapper + cache
│   │   │   ├── fred.py
│   │   │   ├── monte_carlo.py     # existing
│   │   │   ├── factor_model.py    # existing
│   │   │   ├── pdf.py             # branded PDF export
│   │   │   ├── email.py           # weekly digest
│   │   │   └── custodian/
│   │   │       ├── base.py        # CustodianAdapter Protocol
│   │   │       ├── schwab.py
│   │   │       ├── fidelity.py
│   │   │       └── ibkr.py
│   │   ├── models/                # SQLAlchemy 2.0 + Pydantic v2
│   │   ├── db/                    # Alembic migrations
│   │   ├── jobs/                  # Celery or arq for queues
│   │   └── core/
│   │       ├── auth.py
│   │       ├── settings.py
│   │       ├── logging.py         # redaction enforced
│   │       └── audit.py
│   └── tests/
├── shared/
│   └── openapi.json               # source of truth, FastAPI emits, frontend consumes
├── infra/
│   ├── railway/
│   └── vercel/
└── docs/                          # advisor-facing help center
```
**Database:** Postgres (Railway) via SQLAlchemy + Alembic. Use Redis (Railway) for the queue + Claude response cache. Store time-series NAVs in a `daily_nav` table for now; defer ClickHouse until > 1M rows or a real perf issue.
**Generated client:** FastAPI emits `openapi.json`; frontend uses `openapi-typescript` + `openapi-fetch` for a fully typed client. No hand-written request code.
**Money & dates:** all monetary values are `Decimal` server-side and strings on the wire; never float. All dates are timezone-aware, default `America/New_York` for market activity.
---
## 4. Operating rules for Claude Code
Every session, follow these rules without exception.
1. **Read before you write.** List the touched files first. If the change spans more than 3 files or touches auth/billing/db schema, output a numbered plan and wait for my approval.
2. **Speed is a feature.** The hero must keep returning in ≤ 60 seconds. Any new code path that touches the stress-test pipeline must include a latency budget and a benchmark test.
3. **Claude usage is gated.** All Claude calls go through `backend/app/services/claude.py`. Route long-form analysis to Sonnet, fast subtasks (news summaries, label generation, classification) to Haiku. Cache aggressively keyed on `(prompt_hash, model, inputs_hash)`.
4. **Cost discipline.** Every Claude call logs `tokens_in`, `tokens_out`, `cost_usd`, and `route` to an `ai_usage` table for per-firm billing visibility.
5. **PII / regulatory hygiene.** Never log account numbers, balances, SSNs, DOBs, or holdings. Use a `redact()` decorator on all log calls. Audit log every advice-affecting write.
6. **Feature flags.** Every Phase B–F feature ships behind a per-firm flag with a default of off. Use a simple `firm.features: jsonb` column.
7. **Tier gating.** Each route checks `require_plan("starter"|"pro"|"enterprise")`. Gate at the API, not just the UI.
8. **AI outputs are labeled.** Every AI-generated artifact carries an "AI-assisted — verify before client delivery" badge and source citations where applicable. No AI feature auto-sends client communications, modifies plans, or executes trades.
9. **Tests with every feature.** Pytest for backend, Vitest + Playwright for frontend. New endpoints require a contract test that round-trips through the generated client.
10. **Commits.** Conventional Commits. Each commit is reviewable. CHANGELOG.md updated when a phase closes.
11. **Stop and ask** before: installing a paid API, changing the DB schema, touching auth/billing, modifying the public 12-section stress dashboard output shape.
---
## 5. Phased build plan
### Phase A — Harden the hero (target: 1 week)
1. **NextAuth** with email magic-link, Google, Microsoft. Sessions in Postgres. MFA for Enterprise.
2. **Firms & users.** `Firm` (multi-tenant root), `User`, `Role` (`owner`, `advisor`, `analyst`, `view_only`). Every row in every table carries `firm_id`.
3. **Stripe** with 3 products mapped to Starter/Pro/Enterprise. Webhooks update `firm.plan`. Self-serve upgrade/downgrade in `/settings/billing`. Customer Portal for invoices.
4. **Saved portfolios.** `Portfolio` (holdings, cash, base currency, last refresh). Import from existing Excel uploader.
5. **Run history & diff.** `StressRun` rows reference a `Portfolio` and a `Scenario`. UI side-by-side compare of any two runs across the 12 sections.
6. **Action plan.** A `Run` can produce a list of `RecommendedAction`s (rebalance, harvest, hedge, raise cash, client-call). Each is assignable to a user, statusable (todo / done / dismissed), and exports into the PDF.
7. **Compliance footer.** Per-firm disclaimer text injected into every PDF and client letter.
8. **Performance budget.** Add a `latency.md` with current p50/p95 for `/stress/run`. Don't regress.
### Phase B — Daily workspace (target: 2 weeks)
1. `Household` (one or many `Portfolio`s, members, risk profile, goals, advisor of record). Lightweight CRM views: list, detail, timeline.
2. **Daily NAV pipeline.** A nightly arq job pulls prices via `yfinance`, computes per-portfolio NAV, writes `daily_nav`. Show D1, MTD, YTD, ITD per household and per portfolio.
3. **Daily dashboard.** Top movers, top drifts vs. target, accounts with cash > X%, upcoming RMDs, plan check-ins overdue.
4. **News feed.** Per-holding news ingest (start with Yahoo Finance RSS — free — then add a paid provider behind a flag). Each item summarized into 2 lines by Haiku, tagged by ticker and theme.
5. **Inbox.** Single feed of alerts across all households. Snooze, assign, dismiss.
### Phase C — Planning & strategy (target: 2 weeks)
1. **IPS builder** with target allocation, drift bands, rebalance rules. Stored per household, versioned.
2. **Goal-based plan** with Monte Carlo (reuse the existing 1K-path engine; expose 10K mode for Pro and Enterprise). Goals: retirement, college, home, legacy. Show funded ratio and ruin probability already used in the stress dashboard.
3. **Strategy templates** library. Each template is JSON (allocation + glidepath + bands + commentary). Apply, fork, customize, save back to library.
4. **Plan check-in cadence.** Per household, configurable; surfaces in inbox.
### Phase D — Tax, estate, behavioral (target: 2 weeks)
1. **Tax projector** (fed + state + AMT + NIIT + cap-gains). Inputs: W-2-equivalent income, deductions, realized gains YTD, planned actions. Output: projected liability + bracket headroom.
2. **TLH scanner** across all saved portfolios, wash-sale-aware across linked accounts and spouse household.
3. **Roth conversion ladder** with break-even and bracket-fill suggestions over a 5-year horizon.
4. **Asset location optimizer** (bonds in tax-deferred, growth in Roth, international in taxable for FTC).
5. **Charitable comparator** (DAF vs. CRT vs. direct stock vs. QCD vs. private foundation).
6. **Estate visualizer**: family map, document vault, beneficiary audit, gifting tracker (annual exclusion, lifetime exemption used), state + federal estate tax projection.
7. **Behavioral coaching pack**: drawdown-in-dollars simulator, missed-best-days illustration, advisor script library, pre-mortem template, client journaling.
### Phase E — Research & content (target: 2 weeks)
1. **Manager DD workspace**: returns, attribution, fees, tenure, capacity, qualitative notes. One row per evaluated fund/manager.
2. **Macro dashboard**: FRED pulls for UST curve, breakevens, credit spreads, ISM, NFP, CPI; yfinance for FX and commodities. Charts cached daily.
3. **Education slide library**: investor archetypes (accumulator, retiree, business-owner, beneficiary, fiduciary), asset-class primers, tax minimization explainers, estate structure explainers. Each slide is a React component that accepts a `household` prop for live binding.
4. **Presentation builder**: drag-in slides, bind to a household, export PPTX/PDF/share link with expiry.
### Phase F — Distribution & enterprise (target: 3 weeks)
1. **Custodian adapters** for Schwab, Fidelity, IBKR (start with a sandbox/mocked adapter that mirrors real shape).
2. **Weekly intelligence email** per household: market recap (Haiku), holdings news roll-up, drift alerts, planning nudges, three talking points. Sent every Sunday 18:00 ET. Per-firm-branded. Opt-out per advisor.
3. **White-label client portal** at `portal.<firm-subdomain>.vantage.app`. Branded theme. Read-only views: portfolio, plan, documents, secure messages. Magic-link auth for clients.
4. **Enterprise**: SAML SSO (WorkOS), audit log export, custom scenario library, priority Claude routing (higher rate limit + Sonnet-only fallback).
---
## 6. The 12-section dashboard — extension rules
The hero output is the brand. Treat it like a sacred contract.
- The 12 section IDs and orders are stable. Adding a 13th section requires my approval.
- Every section emits a strict JSON schema validated by Pydantic and re-validated client-side by Zod (generated from the FastAPI OpenAPI). A schema change is a major version.
- Each section ships with a "Why this matters" one-liner and a numeric headline. Both are required.
- Each section ships with a "How to talk to your client about this" paragraph generated by Claude — short, plain-spoken, brand-voice.
- PDF and web render the same data; no PDF-only fields.
---
## 7. AI capabilities (where Claude lives in Vantage)
Each is a discrete module in `backend/app/services/claude/` with a prompt file, tool definitions, eval set, and feature flag. All outputs include source citations and an "AI-assisted — verify before delivery" badge.
1. **Scenario interpreter.** Free-text scenario → structured shock vector (rates, credit, equity, FX, vol, liquidity). Sonnet.
2. **Analyst memo.** Existing — keep. Stress run → advisor note + client letter + suggested actions. Sonnet.
3. **Daily holdings brief.** Per-household morning brief: yesterday's moves, news that matters, drift, three talking points. Haiku.
4. **Tax strategy copilot.** Asks clarifying questions, then drafts a year-end memo grounded in the household's actual lots, brackets, and projected income. Sonnet.
5. **Estate strategy explainer.** Plain-English explanation of a proposed trust structure tailored to the client's family map. Sonnet.
6. **Behavioral coaching scripts.** Drawdown-mode talking points grounded in client's stated goals and prior journal entries. Sonnet.
7. **News summarizer.** Two-line bullets per article, tagged by ticker and theme. Haiku.
8. **Weekly intelligence email composer.** Sonnet, with Haiku for sub-bullets.
9. **Presentation copy generator.** Slide-level body copy tuned to brand voice and household specifics. Sonnet.
10. **Pre-send compliance check.** Reads a draft client message and flags Reg BI / suitability / unsubstantiated-claim issues. Sonnet. Never auto-sends.
---
## 8. Data model — additions to ship in Phase A
```sql
-- multi-tenant root
firms              (id, name, slug, plan, brand_json, features_json, created_at)
users              (id, firm_id, email, role, mfa_enabled, created_at)
auth_sessions      (id, user_id, expires_at, ...)
billing_customers  (id, firm_id, stripe_customer_id, stripe_subscription_id, status, current_period_end)
-- portfolios & runs
portfolios         (id, firm_id, household_id NULL, name, base_ccy, holdings_jsonb, cash, last_refresh_at)
scenarios          (id, firm_id, type, name, params_jsonb, source) -- type: historical|custom
stress_runs        (id, firm_id, portfolio_id, scenario_id, status, results_jsonb, latency_ms, created_by, created_at)
recommended_actions(id, run_id, kind, title, detail, assignee_id, status, due_at)
-- audit & ai
audit_log          (id, firm_id, actor_id, action, entity, entity_id, before_jsonb, after_jsonb, ip, ua, ts)
ai_usage           (id, firm_id, route, model, tokens_in, tokens_out, cost_usd, latency_ms, ts)
```
Phases B–F add `households`, `persons`, `goals`, `plans`, `daily_nav`, `holding_news`, `tax_inputs`, `estate_docs`, `presentations`, `slides`, `manager_dd`, `client_portal_users`, `client_messages`, etc.
---
## 9. Security & regulatory checklist (must pass before Enterprise GA)
- TLS 1.3, HSTS, strict CSP, SRI on third-party scripts.
- Field-level encryption (AES-GCM with KMS-managed keys) for account numbers, SSNs, DOBs.
- MFA enforced for `owner` and `advisor` roles. SAML SSO for Enterprise.
- RBAC + household-scoped access checks at the route level.
- Append-only, hash-chained audit log. Export available for Enterprise.
- AML/KYC fields on `Person`; OFAC/PEP screening hook (sandbox first).
- SEC 17a-4-style retention for client communications and PDFs (S3 object lock or equivalent).
- GDPR/CCPA data export + erasure endpoints with regulatory-retention overrides.
- Penetration test booked before Enterprise rollout.
- SOC 2 control mapping doc in `/docs/compliance/soc2.md`.
---
## 10. Definition of done (per feature)
A feature is done only when:
1. TypeScript strict, no `any`. Python fully typed; `mypy --strict` passes for new code.
2. Pydantic v2 schemas on every endpoint; Zod schemas regenerated.
3. Unit tests cover happy path + decimal precision + timezone + empty state.
4. Playwright covers the primary advisor flow.
5. Loading, empty, and error states exist in the UI.
6. WCAG AA: keyboard nav, ARIA, color contrast.
7. Latency budget recorded; no hero regression.
8. Audit log + AI-usage rows written where applicable.
9. Per-firm feature flag wired and defaulted off.
10. Tier gate enforced at the API.
11. Module README updated in `frontend/modules/<name>/README.md` and/or `backend/app/api/v1/<name>.py` docstring.
12. CHANGELOG entry on phase close.
---
## 11. What to do RIGHT NOW
When I invoke `/build-vantage`:
1. Read both `frontend/` and `backend/` and produce a current-state map (files, routes, models, tests).
2. Diff that map against this spec and propose a Phase A backlog as a numbered plan with estimates.
3. Pause for my approval.
4. After approval, work in tight loops: plan → write → test → show diff → next. Update CHANGELOG and the relevant module README at the end of each loop.
5. Stop and ask before: installing a paid API, changing the DB schema, touching auth/billing, or changing the public stress dashboard output shape.
Scope shortcuts I may invoke:
- `/build-vantage phase=A` → harden the hero (auth, Stripe, saved portfolios, run history, action plan).
- `/build-vantage phase=B` → daily workspace.
- `/build-vantage phase=C` → planning & strategy.
- `/build-vantage phase=D` → tax, estate, behavioral.
- `/build-vantage phase=E` → research & content.
- `/build-vantage phase=F` → distribution & enterprise.
- `/build-vantage module=<name>` → narrow scope to one module within the current phase.
- `/build-vantage harden` → no new features; only tests, latency, error states, accessibility, docs.
Anchor every decision to the brand: **clarity in uncertainty, confidence in every decision**, in under 60 seconds.
*End of /build-vantage spec.*

# Vantage — Frontend

## Claude's Role
You are helping build and improve the Vantage frontend.
Target user: independent wealth managers and RIAs.
Always prioritize simplicity, speed, and clean institutional UI over technical complexity.
The "wrapper" — the UX, the AI memo, the plain-English output — IS the product.

## Brand Identity
- Name: Vantage (wordmark: VANTAGE)
- Tagline: 'Stress test. Build confidence.'
- Essence: 'Clarity in uncertainty. Confidence in every decision.'
- Primary color: Electric Blue #3B82F6
- Background: Deep Navy #0A0F1E
- Warning orange: #F59E08 (NOT #F59E0B)

## What This Product Does
Vantage is a portfolio stress testing tool for wealth managers.
The user uploads an Excel file with their positions, picks a crisis scenario or describes one,
and gets a full institutional-grade risk analysis in 60 seconds.

## Tech Stack
- Framework: Next.js
- Styling: Tailwind CSS
- Backend API: https://stress-test-backend-production.up.railway.app
- Hosting: Vercel

## Pages
- `/` — Home: Excel upload, historical scenarios, shock builder
- `/results` — 10-section analysis dashboard
- `/compare` — Side-by-side portfolio comparison
- `/intelligence` — Type tickers directly, no Excel needed

## Results Dashboard Sections (sticky nav)
1. Summary
2. Charts
3. Factors
4. Correlation
5. Benchmark
6. Liquidity
7. Client Impact
8. Monte Carlo
9. Positions
10. AI Analysis

## Features Already Built
- Excel upload (13-column template)
- 6 historical crisis presets: 2008 GFC, COVID, Dot-Com, Black Monday, 2022 Rate Shock, Stagflation
- Custom scenario builder in plain English
- Custom shock builder with 6 sliders
- Factor risk model (5 factors: beta, rates, inflation, credit, growth)
- Correlation breakdown (normal vs stress)
- Liquidity stress analysis
- Monte Carlo simulation (1,000 paths)
- Benchmark comparison (S&P 500, 60/40, All-Weather, Global Bonds)
- Portfolio comparison with winner badge and radar chart
- Smart Risk Summary with health score (1-10)
- AI analyst memo with trade recommendations
- Branded PDF export (3-page institutional report)
- Excel template download

## Design Principles
- Institutional and clean — this is a professional tool, not a consumer app
- Fast and readable — wealth managers are busy, every section should be scannable
- Client-friendly language — outputs should be explainable to a non-technical client
- Modern and polished — no generic, boring interfaces

## Target User
Independent wealth managers and RIAs (Registered Investment Advisors).
They are NOT quants. Their core problem is communication speed and client trust.
When a client panics during a downturn, they need a clear, credible analysis in 60 seconds.

## Business Context
- Competitors: Riskalyze ($4-10K/yr), eMoney ($5-15K/yr)
- Pricing: Starter $99/mo, Professional $299/mo, Enterprise $799/mo
- Positioning: "The tool that turns an advisor's expertise into a client's confidence."

## Roadmap (not yet built)
- White-labeled client portal
- CRM integration (Salesforce, Redtail)
- Custodian sync (Schwab, Fidelity, Interactive Brokers)
- Weekly intelligence reports by email
- Compliance audit trail
- Mobile app

<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight. Focus on:

Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.

Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.

Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.

Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!

VANTAGE-SPECIFIC CONSTRAINTS (this overrides general aesthetic freedom):
- Stay dark — Deep Navy #0A0F1E base. We are a financial institutional tool, not a playful consumer app. No light themes for the main product.
- Stay blue — Electric Blue #3B82F6 is the dominant accent. No purple, no rose, no orange/yellow gradients as primary accents (those are reserved for status colors only: success green, warning orange, danger red).
- Geist for body, Audiowide for the VANTAGE wordmark only. Push for stronger typographic CONTRAST: use Geist Black at 64-96px against Geist Regular at 14-16px. Avoid the safe middle-weight middle-size paragraph block look.
- Reference: Bloomberg Terminal × Linear × Stripe. Institutional weight + modern speed + financial trust. Never IBM-corporate-stiff and never tech-startup-toy.
- Layered atmosphere: subtle dark navy mesh gradients, thin animated grid lines, faint floating shapes (already in components/ui/shape-landing-hero.tsx). Glass surfaces with bg-[#0A0F1E]/80 backdrop-blur-md, not flat #1a1a1a cards.
- One orchestrated entrance per page: staggered fadeUp with 0.5s + i*0.15s delays, not scattered hover bounces everywhere.
- Numbers are sacred: tabular-nums + Geist Mono for any monetary figure, percentage, or basis-point value. Never let financial numbers shift width on update.
</frontend_aesthetics>

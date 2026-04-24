# PortfolioStress — Frontend

## Claude's Role
You are helping build and improve the PortfolioStress frontend.
Target user: independent wealth managers and RIAs.
Always prioritize simplicity, speed, and clean institutional UI over technical complexity.
The "wrapper" — the UX, the AI memo, the plain-English output — IS the product.

## What This Product Does
PortfolioStress is a portfolio stress testing tool for wealth managers.
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

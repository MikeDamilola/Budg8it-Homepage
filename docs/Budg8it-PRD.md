# Budg8it — Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** May 2026  
**Status:** Draft for development handoff  
**Tagline:** Smart Savings. Smarter Wallets.

---

## Document control

| Field | Value |
|-------|-------|
| Product | Budg8it |
| Type | Web application (React frontend + REST API backend) |
| Primary market | Nigeria |
| Currency | Nigerian Naira (₦) |
| Traceability | See [Budg8it-SRS.md](./Budg8it-SRS.md) for technical requirements (SRS-xxx IDs) |

---

## 1. Executive Summary

Budg8it is a web application that helps freelancers, small business owners, solopreneurs, and individuals in Nigeria **automate savings from sales and income** while **collecting payments** through shareable links and QR codes.

Users create **smart savings wallets** with configurable **auto-save percentages**. When a buyer pays via a product or payment link, Budg8it automatically splits the proceeds: a portion is routed to savings (**AUTO-INVEST**) and the remainder stays **WITHDRAWABLE**. Sellers can list products, generate one-off payment links, copy URLs, and download QR codes for physical or digital point-of-sale.

**v1 scope** includes:

- Authenticated seller dashboard (wallets, products, transactions, stats)
- 3-step **Add Product** modal wizard (as-built UI)
- Standalone **Generate Payment Link** modal
- Buyer checkout at `pay.budg8it.com/p/{slug}` (production target)
- Payment gateway integration (Paystack or Flutterwave — TBD)
- Auto-save split engine on successful payment

The current React prototype implements core UI flows with mock data; production requires backend APIs, persistence, and live payment processing.

---

## 2. Problem Statement

### 2.1 Market pain

| Pain | Description |
|------|-------------|
| Manual savings discipline | Sellers receive income via transfers or POS but rarely set aside savings consistently. |
| Fragmented tools | Payment links, inventory, and savings live in separate apps (bank apps, spreadsheets, WhatsApp). |
| No automatic split | Incoming payments land in one balance; users must manually move money to savings goals. |
| Limited POS for micro-sellers | Small retailers need simple QR-based checkout without heavy e-commerce setup. |

### 2.2 Opportunity

Budg8it combines **payment collection** and **rules-based savings** in one product tuned for the Nigerian market (₦, local payment rails, mobile-first UX).

---

## 3. Goals & Success Metrics (KPIs)

### 3.1 Business goals

1. Increase automated savings behavior among target users.
2. Enable fast go-to-market for payment links and product listings.
3. Build trust through transparent wallet balances and transaction history.

### 3.2 Success metrics (12-month targets — illustrative)

| KPI | Definition | Target (v1 launch + 6 mo) |
|-----|------------|---------------------------|
| Registered sellers | Completed sign-up + KYC (if required) | 5,000 |
| Active wallets | Wallets with ≥1 transaction in 30 days | 3,000 |
| Auto-save adoption | % of products/links with auto-save > 0% | ≥ 70% |
| GMV | Gross payment volume processed (₦) | ₦500M |
| Savings volume | Total ₦ routed to AUTO-INVEST | ₦150M |
| Payment link conversion | Completed payments / link views | ≥ 25% |
| Wizard completion rate | Add Product flows reaching Step 3 | ≥ 60% |
| Time to first link | Sign-up → first live payment URL | < 10 minutes |

### 3.3 Product principles

- **Mobile-first:** Dashboard and modals usable on small screens.
- **Defaults that help:** Auto-save default 40% in wallet configuration.
- **Clarity:** Show Withdrawable vs Auto-invest split before publishing.
- **Low friction:** Minimal fields to go live with a payment link.

---

## 4. Target User Personas

### 4.1 Persona A — Ada the Freelancer

| Attribute | Detail |
|-----------|--------|
| Age | 28 |
| Location | Lagos |
| Role | Graphic designer, invoice clients via WhatsApp |
| Income | Irregular project fees (₦50,000–₦500,000 per project) |
| Goals | Save 30–40% of each payment for equipment and tax reserve |
| Frustrations | Forgets to transfer to savings; uses personal account for business |
| Budg8it usage | Generate Payment Link per project; one wallet per goal; QR on invoice PDF |

### 4.2 Persona B — Chidi the Small Retailer

| Attribute | Detail |
|-----------|--------|
| Age | 42 |
| Location | Abuja |
| Role | Runs a boutique with 15–30 SKUs |
| Income | Daily in-store and online sales |
| Goals | Track stock, auto-save for restocking fund, share payment link in Instagram bio |
| Frustrations | POS machine fees; no visibility into “saved vs spendable” cash |
| Budg8it usage | Add Product wizard with image and stock count; print QR for counter; multiple wallets |

### 4.3 Persona C — Tunde the Solopreneur (secondary)

| Attribute | Detail |
|-----------|--------|
| Role | Online coach selling digital sessions |
| Goals | Quick payment links without full storefront |
| Budg8it usage | Generate Payment Link only; high auto-save % to “Business Reserve” wallet |

---

## 5. User Stories

Stories map to SRS feature IDs in [Budg8it-SRS.md](./Budg8it-SRS.md#3-system-features--functional-requirements).

### 5.1 Authentication & onboarding

| ID | Story | Priority | SRS |
|----|-------|----------|-----|
| US-A01 | As a new user, I want to sign up with email and password so that I can access my Budg8it dashboard. | P0 | SRS-AUTH-01 |
| US-A02 | As a user, I want to sign in securely so that I can manage my wallets and products. | P0 | SRS-AUTH-02 |
| US-A03 | As a user, I want to reset my password so that I can recover access if I forget it. | P0 | SRS-AUTH-03 |
| US-A04 | As a new seller, I want a guided first-wallet setup so that I understand auto-save before taking payments. | P1 | SRS-WALLET-01 |

### 5.2 Smart wallet system

| ID | Story | Priority | SRS |
|----|-------|----------|-----|
| US-W01 | As a seller, I want to create a named wallet so that I can allocate savings by purpose. | P0 | SRS-WALLET-02 |
| US-W02 | As a seller, I want to set an auto-save percentage (0–100%) per wallet so that each payment is split automatically. | P0 | SRS-WALLET-03 |
| US-W03 | As a seller, I want to see withdrawable balance vs amount saved per wallet so that I know what I can spend. | P0 | SRS-WALLET-04 |
| US-W04 | As a seller, I want to view transaction history per wallet so that I can reconcile income. | P0 | SRS-WALLET-05 |
| US-W05 | As a seller, I want multiple wallets for different goals so that I can separate funds. | P0 | SRS-WALLET-02 |
| US-W06 | As a seller, I want to edit wallet name and auto-save % so that I can adjust my strategy. | P1 | SRS-WALLET-06 |

### 5.3 Add Product wizard (3-step)

| ID | Story | Priority | SRS |
|----|-------|----------|-----|
| US-P01 | As a seller, I want to add a product with name, price, stock quantity, and image so that buyers know what they are paying for. | P0 | SRS-PROD-01 |
| US-P02 | As a seller, I want to configure auto-save % for the product’s linked wallet so that sales are split on every payment. | P0 | SRS-PROD-02 |
| US-P03 | As a seller, I want to see Withdrawable and Auto-invest previews while adjusting the slider so that I understand the split. | P0 | SRS-PROD-02 |
| US-P04 | As a seller, I want a shareable payment URL and QR code when my product goes live so that I can sell online or in person. | P0 | SRS-PROD-03 |
| US-P05 | As a seller, I want to copy the payment link and download the QR as PNG so that I can share quickly. | P0 | SRS-PROD-03 |
| US-P06 | As a seller, I want to go back to Step 1 from the stepper on Step 2 so that I can fix product details without losing data. | P0 | SRS-PROD-04 |
| US-P07 | As a seller, I want the wizard to slide horizontally between steps so that the flow feels continuous. | P0 | SRS-PROD-04 |

### 5.4 Generate Payment Link (standalone)

| ID | Story | Priority | SRS |
|----|-------|----------|-----|
| US-L01 | As a seller, I want to create a one-off payment link with purpose and price so that I can bill without creating a full product. | P0 | SRS-LINK-01 |
| US-L02 | As a seller, I want to toggle “Link to Wallet” so that I can choose whether this payment uses auto-save. | P0 | SRS-LINK-02 |
| US-L03 | As a seller, I want to create a new wallet or pick an existing one when linking so that funds route correctly. | P0 | SRS-LINK-03 |
| US-L04 | As a seller, I want to set auto-save % with a slider when wallet linking is on so that I control the split. | P0 | SRS-LINK-04 |
| US-L05 | As a seller, I want validation errors if purpose or price is missing so that I do not publish invalid links. | P0 | SRS-LINK-05 |

### 5.5 Payment collection (buyer + seller)

| ID | Story | Priority | SRS |
|----|-------|----------|-----|
| US-PAY01 | As a buyer, I want to open a payment URL and pay in ₦ so that I can complete my purchase. | P0 | SRS-PAY-01 |
| US-PAY02 | As a seller, I want auto-save applied immediately on successful payment so that savings happen without manual transfer. | P0 | SRS-PAY-02 |
| US-PAY03 | As a seller, I want a notification when payment succeeds so that I can fulfill the order. | P1 | SRS-PAY-03 |
| US-PAY04 | As a seller, I want each payment logged in wallet transaction history so that records are complete. | P0 | SRS-PAY-04 |
| US-PAY05 | As a seller, I want stock decremented when a product payment succeeds so that inventory stays accurate. | P0 | SRS-PAY-05 |

### 5.6 Dashboard

| ID | Story | Priority | SRS |
|----|-------|----------|-----|
| US-D01 | As a seller, I want an overview of total revenue, savings, and transactions so that I see business health at a glance. | P0 | SRS-DASH-01 |
| US-D02 | As a seller, I want to list all products with payment links so that I can manage my catalog. | P0 | SRS-DASH-02 |
| US-D03 | As a seller, I want recent transactions on the dashboard so that I see latest activity. | P0 | SRS-DASH-03 |
| US-D04 | As a seller, I want quick actions (Add Product, Generate Link, Store Link) so that I can start tasks fast. | P0 | SRS-DASH-04 |
| US-D05 | As a seller, I want a shareable store link so that customers can browse my storefront. | P1 | SRS-DASH-05 |

---

## 6. Feature Requirements (Functional)

### 6.1 Must Have (P0)

#### Smart Wallet System (SRS-WALLET-*)

- Create wallet with unique name per user.
- Auto-save percentage: integer 0–100, default 40 for new configurations.
- On payment success: `auto_invest = amount × (auto_save_percent / 100)`, `withdrawable = amount - auto_invest`.
- Dashboard wallet card: name, auto-save %, amount saved, withdrawable available, linked products count.
- Transaction ledger: credit entries with split breakdown.

#### Add Product — Step 1 (as-built UI) (SRS-PROD-01)

| Field | Requirement |
|-------|-------------|
| Product name | Required, 1–120 characters |
| Price (₦) | Required, ≥ 0 (publish requires > 0 at backend) |
| Stocks quantity | Required integer, minimum 1 |
| Product image | Optional; JPEG, PNG, GIF, WebP, MP4, PDF; max 15 MB |

#### Add Product — Step 2 (SRS-PROD-02)

- Range slider 0–100% for auto-save; default 40%.
- Live cards: **Withdrawable** = (100 − auto_save)%, **Auto-invest** = auto_save%.
- CTA: “Proceed To Review” → Step 3.

#### Add Product — Step 3 (SRS-PROD-03)

- Success state: “Product Live!”
- Payment URL format: `https://pay.budg8it.com/p/{slug}` (production).
- Copy to clipboard with success feedback (2s).
- QR code rendered from URL; download as PNG.
- “Done” closes wizard and refreshes dashboard product list.

#### Add Product — Modal UX (SRS-PROD-04)

- 3-step horizontal slide animation; panels remain mounted for state preservation.
- `ProductFlowStepper` fixed below close button; close (×) top-right on Steps 1–2 only.
- Step 3: no stepper, no × (exit via Done or backdrop per design).

#### Generate Payment Link (SRS-LINK-*)

| Field | Requirement |
|-------|-------------|
| Payment purpose/details | Required text |
| Price (₦) | Required, > 0 |
| Link to Wallet | Toggle, default ON |
| Allocation method | “Create New Wallet” or “Existing Wallet” (when toggle ON) |
| New wallet name | Required when create + toggle ON |
| Existing wallet | Required selection when existing + toggle ON |
| Auto-save % | Slider 0–100%, ticks at 0%, 50%, 100%; default 40% |
| CTA | “Proceed To Wallet Setup →” validates and creates link |

#### Payment collection (SRS-PAY-*)

- Unique slug per product/link.
- Hosted checkout page for buyers.
- Webhook from payment provider → idempotent payment record → wallet split → optional stock update.
- Seller notification (P1: email or in-app).

#### Dashboard (SRS-DASH-*)

- Stats: Total Revenue, Active Stocks (aggregate), Transaction count, Auto Savings (₦).
- Wallets section with Add Wallet entry point.
- Products grid with image, price, stock, sold count, revenue, auto-save badge.
- Recent transactions list.
- Quick Actions sidebar (desktop) / mobile quick actions card.

#### Authentication (SRS-AUTH-*)

- Sign up, sign in, forgot password, reset password (UI exists; API TBD).

### 6.2 Should Have (P1)

- Email/push notification on successful payment.
- Store link card: copy/open customized storefront URL.
- Wallet edit (name, auto-save %).
- Decrement stock only on paid orders; out-of-stock blocks checkout.
- Seller settings: profile, notification preferences.
- Analytics: link views vs conversions.

### 6.3 Nice to Have (P2)

- Product description and category fields (not in as-built v1 UI).
- Multi-user / team access to one business account.
- Scheduled withdrawals to bank account.
- Export transactions CSV.
- Multi-currency (beyond ₦).
- Waitlist → self-serve migration from marketing site.

---

## 7. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Dashboard first contentful paint < 2.5s on 4G; modal open < 300ms; API p95 < 500ms for reads |
| Security | HTTPS only; JWT or session cookies httpOnly; PCI-DSS via payment provider (no raw card storage on Budg8it) |
| Privacy | NDPR-aligned data handling for Nigerian users; clear privacy policy |
| Accessibility | WCAG 2.1 Level AA targets: keyboard nav, focus rings, aria labels on modals/sliders, contrast on primary actions |
| Availability | 99.5% uptime target for API and checkout (excluding provider maintenance) |
| Responsiveness | Breakpoints: mobile (<640px), tablet, desktop (≥1024px); stats row horizontal scroll on mobile |
| Localization | English (en-NG) v1; ₦ formatting via `Intl.NumberFormat('en-NG', { currency: 'NGN' })` |
| Browser support | Latest Chrome, Safari, Firefox, Edge; iOS Safari 15+, Android Chrome |

---

## 8. User Flows

### 8.1 Seller registration and first login

1. User visits marketing site → Sign Up.
2. Enters email, password, accepts terms → account created (API).
3. Redirect to `/dashboard`.
4. (P1) Optional onboarding: create first wallet with default 40% auto-save.

### 8.2 Create wallet (standalone)

1. From dashboard → “Add Wallet”.
2. Enter wallet name (e.g. “Q4 Project Fund”).
3. Set auto-save slider → save.
4. Wallet appears in grid with ₦0 balances until first payment.

### 8.3 Add Product wizard

1. Dashboard → Quick Actions → **Add Product** (or mobile equivalent).
2. **Step 1:** Enter name, price, stock quantity; optional image upload → **Proceed To Wallet Setup**.
3. **Step 2:** Adjust auto-save slider; review Withdrawable / Auto-invest cards → **Proceed To Review**.
4. **Step 3:** System creates product + slug + wallet link; show URL, QR, copy/download → **Done**.
5. Return to dashboard; product visible in list.

**Back navigation:** On Step 2, tap Step 1 in stepper → slide back to Step 1 with form state preserved.

### 8.4 Generate Payment Link (standalone)

1. Dashboard → **Generate Link**.
2. Modal opens: enter purpose, price.
3. If **Link to Wallet** ON: choose Create New Wallet (enter name) or Existing Wallet; set auto-save %.
4. If OFF: payment credited to default withdrawable balance (business rule TBD in SRS).
5. **Proceed To Wallet Setup** → backend creates PaymentLink + wallet if needed → success screen (P0 backend; prototype closes modal).
6. User copies link / QR for buyer.

### 8.5 Buyer checkout

1. Buyer opens `pay.budg8it.com/p/{slug}`.
2. Sees product/purpose, price in ₦, seller branding (if configured).
3. Pays via Paystack/Flutterwave widget.
4. On success: receipt page; seller webhook fires → split applied → stock −1 (products only).

### 8.6 View dashboard and transactions

1. Seller opens `/dashboard`.
2. Reviews stats row, wallets, products, recent transactions.
3. Drills into wallet or `/transactions` for full history (P1 detail page).

---

## 9. Out of Scope (v1)

- Native iOS/Android apps
- Product description and category fields (deferred; as-built uses stock quantity instead)
- Multi-currency or non-Nigeria payment rails as primary
- Full accounting / ERP integrations (QuickBooks, etc.)
- Marketplace discovery (public directory of all sellers)
- Subscription billing / recurring invoices
- Cryptocurrency payments
- In-person card terminal hardware integration
- Multi-tenant team roles (admin, staff)

---

## 10. Open Questions & Assumptions

### 10.1 Open questions

| # | Question | Owner | Impact |
|---|----------|-------|--------|
| OQ-1 | Paystack vs Flutterwave as primary gateway? | Product + Eng | Integration timeline |
| OQ-2 | KYC required before first withdrawal? | Compliance | Onboarding flow |
| OQ-3 | Auth provider: custom JWT vs Auth0/Clerk/Firebase? | Eng | SRS-AUTH |
| OQ-4 | Default wallet when “Link to Wallet” is OFF? | Product | Ledger rules |
| OQ-5 | Slug collision policy globally or per seller? | Eng | URL uniqueness |
| OQ-6 | Store link (`StoreLinkCard`) — hosted storefront scope for v1? | Product | SRS-DASH-05 |

### 10.2 Assumptions

- All monetary values are in **₦** (kobo minor units internally optional).
- One Budg8it account per individual or sole proprietor in v1.
- Payment provider handles card/bank transfer/ USSN where supported.
- Prototype URL `pay.fintrack.com` will migrate to **`pay.budg8it.com`** in production.
- Sellers are responsible for product legality and tax compliance.
- v1 English-only UI copy.

---

*End of Product Requirements Document*

# SpendWize Development Plan

This document outlines the development roadmap for SpendWize. Tasks are grouped by phase with actionable checklists. Reference paths use the project structure under `src/` (e.g., `src/app/dashboard/`).

## Phase 1: Core Feature Completion (Weeks 1-2)

- [ ] Dashboard Enhancements (`src/app/dashboard/`)
  - [ ] Add summary cards: total income, total expenses, net savings
  - [ ] Implement date range selector (this month, last month, custom)
  - [ ] Wire charts to real data with filters (`components/dashboard/Charts/*`)
  - [ ] Add loading and empty states

- [ ] Transactions
  - [ ] Finish `AddTransaction` validations and UX (`components/dashboard/AddTransaction.jsx`)
  - [ ] Ensure `EditTransaction.tsx` supports all fields (category, type, payment method, currency, date)
  - [ ] Implement pagination and search in `dashboard/transaction/page.tsx`
  - [ ] Add optimistic UI updates after create/edit/delete

- [ ] Auth & Profiles
  - [ ] Verify `actions/auth.ts` flow and error handling
  - [ ] Ensure profile auto-creation is reliable and idempotent
  - [ ] Add "Profile" quick view in navbar (`components/Navbar.tsx`)

- [ ] Missing Pages Scaffolding
  - [ ] Create: `dashboard/budgets/page.tsx`
  - [ ] Create: `dashboard/reports/page.tsx`
  - [ ] Create: `dashboard/recurring/page.tsx`
  - [ ] Create: `dashboard/settings/page.tsx`

- [ ] Database Policies (Supabase)
  - [ ] Confirm RLS and policies for `transactions` and `user_profiles`
  - [ ] Create indexes for common queries (user_id, transaction_date)

## Phase 2: Advanced Features (Weeks 3-4)

- [ ] Budget Management (`dashboard/budgets/`)
  - [ ] Create `budgets` table (category, amount, period, user_id)
  - [ ] CRUD UI for budgets
  - [ ] Budget vs actual charts and progress indicators
  - [ ] Alerts when spending exceeds threshold

- [ ] Reports (`dashboard/reports/`)
  - [ ] Monthly, quarterly, yearly reports
  - [ ] Category-wise breakdown with trends
  - [ ] Export to CSV/PDF
  - [ ] Custom date range filter

- [ ] Recurring Bills (`dashboard/recurring/`)
  - [ ] Create `recurring_transactions` table (amount, category, frequency, next_due_date)
  - [ ] CRUD UI and calendar view
  - [ ] Server action/cron to post upcoming transactions
  - [ ] Notifications/reminders (email optional)

- [ ] Data Management
  - [ ] CSV import: map columns to fields, preview, commit
  - [ ] CSV export for transactions
  - [ ] Duplicate detection on import

## Phase 3: Advanced Functionality (Weeks 5-6)

- [ ] Analytics & Insights
  - [ ] Spending patterns (by weekday, merchant, payment method)
  - [ ] Savings rate and trends
  - [ ] Goals UI: `savings_goals` table (target, current, target_date)

- [ ] UX Improvements
  - [ ] Mobile-first optimizations (sidebar, tables, forms)
  - [ ] Empty states and helpful guidance throughout
  - [ ] Keyboard navigation and accessibility pass (a11y)

- [ ] Automation & Integrations
  - [ ] Category suggestion rules (heuristics)
  - [ ] Optional OCR stub for receipt uploads (future)
  - [ ] Public API design draft (future)

## Phase 4: Polish & Deployment (Week 7)

- [ ] Testing & Quality
  - [ ] Unit tests (utilities, components)
  - [ ] Integration tests (server actions, supabase flows)
  - [ ] E2E tests with Playwright (auth, transactions, budgets)
  - [ ] Error boundaries and robust error messages

- [ ] Performance
  - [ ] Bundle analysis and code-splitting
  - [ ] Cache and memoization for heavy queries
  - [ ] Virtualize large tables if needed

- [ ] Security & Compliance
  - [ ] Input validation and sanitization
  - [ ] Review RLS policies and least-privilege rules
  - [ ] Rate limiting/abuse prevention where applicable

- [ ] Deployment & Monitoring
  - [ ] Production environment variables and secrets
  - [ ] Sentry (errors), analytics, and performance monitoring
  - [ ] Deploy pipeline and release checklist

## Database Additions (Supabase SQL)

- [ ] `budgets(id, user_id, category, amount, period, created_at)`
- [ ] `recurring_transactions(id, user_id, category, amount, frequency, next_due_date, is_active, created_at)`
- [ ] `savings_goals(id, user_id, name, target_amount, current_amount, target_date, created_at)`
- [ ] Indexes for `user_id`, `transaction_date`, `category`
- [ ] RLS policies per table for row-level access by user

## Acceptance Criteria

- [ ] Users can add/edit/delete transactions and see immediate updates
- [ ] Dashboard shows accurate totals and charts for a selected date range
- [ ] Budgets can be created and progress is visible against actual spend
- [ ] Reports can be generated and exported
- [ ] Recurring bills can be configured and auto-posted
- [ ] App is responsive, accessible, and stable under basic load

## References (Codebase)

- `src/app/layout.tsx` and `src/app/page.tsx`
- `src/app/dashboard/layout.tsx` and `src/app/dashboard/page.tsx`
- `src/app/dashboard/transaction/page.tsx`
- `src/components/dashboard/AddTransaction.jsx`
- `src/components/dashboard/EditTransaction.tsx`
- `src/components/dashboard/Charts/*`
- `src/utils/supabase/*` and `src/lib/supabaseAdmin.ts`
- `actions/auth.ts`

## Tracking

Use this file as a running checklist. Update statuses as tasks are completed and add notes or links to PRs next to each item.

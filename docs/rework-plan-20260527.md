# indian-food-night-app — multi-phase rework plan

**Date:** 2026-05-27
**Source of truth:** verified against current source on 2026-05-27 (post-dating the review).
**Supersedes-as-input:** [architecture-review-final-20260527.html](architecture-review-final-20260527.html).

This plan re-confirms the final review against live source, records the **drift** found, then
lays out phases that each leave the app shippable (green build, working app). Sequence:
cheap bug fixes → build the two seams → route callers through them → dedup that depends on
adoption → cosmetic last.

> **Scope exclusion:** No automated testing, test tooling, or test files. The review's "Step 4
> (add Vitest)" is intentionally dropped. The seams are still designed pure/isolated on their
> own merit. Verification per phase is **manual checks + green `yarn build`** only.

---

## Re-verification: what changed since the review

Read at source 2026-05-27. Findings 1–10 from the review's brief mostly hold; two drifted.

| # | Review claim | Status now | Note |
|---|---|---|---|
| 1 | signOut imports `next/router`, throws | **Confirmed** | [AuthContext.tsx:6](../src/contexts/AuthContext.tsx#L6), [:65](../src/contexts/AuthContext.tsx#L65) unchanged. |
| 2 | `is_paid` flipped with no host check | **Confirmed** | [useOrders.ts:129-147](../src/hooks/useOrders.ts#L129-L147) updates by `(event_id, user_name)` only. |
| 3 | TAX_RATE vs TAX_MULTIPLIER drift | **Confirmed** | overview multiplies ([order-overview/page.tsx:40,44](../src/app/order-overview/page.tsx#L40)); OrderListTotals & useGroupedSubmittedOrders add ([OrderListTotals.tsx:45](../src/components/orders/OrderListTotals.tsx#L45), [useGroupedSubmittedOrders.ts:60](../src/hooks/useGroupedSubmittedOrders.ts#L60)); HostPastEventCard uses both ([:23](../src/components/HostPastEventCard.tsx#L23),[:141](../src/components/HostPastEventCard.tsx#L141)). [tax.ts](../src/util/tax.ts) is two constants. |
| 4 | Host excluded in only 1 of 3 totals | **Confirmed** | `excludeHostOrders` only in [order-overview/page.tsx:35](../src/app/order-overview/page.tsx#L35). useGroupedSubmittedOrders & useHostPastEvents sum host too. |
| 5 | No-tax past-event totals | **Confirmed** | [usePastEvents.ts:74-77](../src/hooks/usePastEvents.ts#L74-L77) and [useHostPastEvents.ts:88-91](../src/hooks/useHostPastEvents.ts#L88-L91) sum `menu_items.price` with no tax. |
| 6 | Identity chain scattered ~8 places | **Confirmed — and worse** | **DRIFT: two variants.** Write path is **3-part** (`full_name\|\|email\|\|guestName`): [useOrders:75](../src/hooks/useOrders.ts#L75), [useAddOrderForm:29](../src/hooks/useAddOrderForm.ts#L29), [order/page:34](../src/app/order/page.tsx#L34), [OrderList:48](../src/components/OrderList.tsx#L48), [OrderListItem:46](../src/components/orders/OrderListItem.tsx#L46). But `reorderUtils` ([:31](../src/util/reorderUtils.ts#L31),[:70](../src/util/reorderUtils.ts#L70)), `orderUtil` ([:32](../src/util/orderUtil.ts#L32),[:109](../src/util/orderUtil.ts#L109)), and [usePastEvents:28](../src/hooks/usePastEvents.ts#L28) are **2-part** (no guestName). See "Latent bug" below. |
| 7 | Duplicated order-intake writers | **Confirmed** | [useOrders.addMutation:63-91](../src/hooks/useOrders.ts#L63-L91) and [orderUtil.addOrderUtil:20-48](../src/util/orderUtil.ts#L20-L48) duplicate insert + `*, menu_items (*)`. addMutation auto-invalidates; addOrderUtil does not — caller refetches via `onOrderAdded`. |
| 8 | Duplicated past-events fetchers | **Confirmed** | [usePastEvents.ts](../src/hooks/usePastEvents.ts) (filter user) vs [useHostPastEvents.ts](../src/hooks/useHostPastEvents.ts) (filter host) re-inline join + `event_date < today` + grouping. No shared grouping helper (`groupOrdersByUser` exists but neither hook uses it). |
| 9 | OrderList phantom dual-mode props | **DRIFT — now FALSE** | [order/page.tsx:119](../src/app/order/page.tsx#L119) **does** pass `orders/loading/error` live. Props are not dead. Moved out of this plan → [orderlist-props-decision-20260527.md](orderlist-props-decision-20260527.md). |
| 10 | Cutoff parse mismatch (display vs gate) | **Confirmed** | Gate uses local parse [cutoffUtil](../src/util/cutoffUtil.ts) (`.replace(/-/g,"/")`); create/edit preview uses UTC parse [timeUtils.calculateCutoffTimeString](../src/util/timeUtils.ts). One gate, divergent preview. |
| 11 | OrderListItem over-granular fragments | **Confirmed — cosmetic** | Lowest leverage; deferred. |

### Two drifts that change the plan shape

1. **OrderList props are live, not dead (review #9 / Step 8).** `order/page` passes them;
   `order-overview` does not. This is a contract-ambiguity question, not a dead-code deletion.
   It is **removed from this plan** and captured separately in
   [orderlist-props-decision-20260527.md](orderlist-props-decision-20260527.md) for a later call.

2. **The identity chain is not one expression copied 8×; it is two variants (review #6).**
   - **3-part** (`full_name || email || guestName`) on the live order-entry path.
   - **2-part** (`full_name || email`, *no* guestName) in `reorderUtils`, `orderUtil`, and
     `usePastEvents`.

   **Latent bug:** `user_name` is the grouping/paid join key. A logged-out **guest** who
   *reorders* (reorderUtils, 2-part) gets a row whose `user_name` is `undefined`/email — not
   their original `guestName`. Their reorder then groups separately from their original order,
   and a host marking them paid by `(event_id, user_name)` misses one of the rows. This is a
   real correctness bug the review only saw as duplication. Per decision, **Phase 3 unifies to
   3-part everywhere**, fixing it (flagged as a behavior change).

### Decisions taken (from clarifying questions, 2026-05-27)

- **Identity:** unify to **3-part** in all sites. Treat the 2-part sites as a real bug fix, not
  just dedup. Flag behavior change in the PR.
- **Order intake (Phase 7):** fold **`addOrderUtil` only** into the React-Query mutation. Leave
  `reorderUtils`' bulk insert separate (its shape genuinely differs — multi-row, no `select`,
  no invalidation); just route it through the shared `attendeeName` + a shared join-string
  constant.
- **is_paid / RLS (Phase 1):** plan documents the exact SQL + dashboard checks; **the human runs
  the SQL.** Plan stays code-only.
- **OrderList props:** deferred to the decision doc; not in this plan.

---

## Domain seams introduced

Two pure, dependency-light modules. Everything downstream routes through them.

### `computeBill` — the money seam (Phase 2)

```ts
// src/util/totals.ts
export interface BillOptions {
  hostId?: string | null;     // when set, host's own orders are excluded
  onlySubmitted?: boolean;    // when true, count only is_submitted orders
}
export interface Bill {
  subtotal: number;   // sum of menu_items.price for counted orders
  tax: number;        // subtotal * TAX_RATE, rounded once
  total: number;      // subtotal + tax
  collected: number;  // total for the is_paid subset
  pending: number;    // Math.max(0, total - collected)
}
export function computeBill(orders: OrderWithMenuItem[], opts?: BillOptions): Bill;
```

Owns: the tax rate, host-exclusion, submitted filter, paid/unpaid split, rounding, and the
`Math.max(0, …)` pending floor. [tax.ts](../src/util/tax.ts) becomes an internal detail of this
module (constants stay, exported only to `totals.ts`). Pure function, no React, no Supabase.

### `attendeeName` — the identity seam (Phase 3)

```ts
// src/util/attendee.ts
interface AttendeeUser {
  email?: string | null;
  user_metadata?: { full_name?: string | null } | null;
}
// canonical user_name written on every order and used as the grouping/paid join key
export function attendeeName(user: AttendeeUser | null | undefined, guestName?: string): string;
//  => user?.user_metadata?.full_name || user?.email || guestName?.trim() || "Guest"
```

Pure. The `|| "Guest"` tail makes the key total (matches the read-side `|| "Guest"`/`"Unknown
User"` defaults already in [orderGrouping.ts:13](../src/util/orderGrouping.ts#L13) and
[useHostPastEvents.ts:75](../src/hooks/useHostPastEvents.ts#L75)). Confirm the exact fallback
string with the team if it must match an existing stored value.

---

## Phases

Each phase = one reviewable PR, shippable on its own. Size: **S** ≈ <1hr/few files,
**M** ≈ a few hours/several files, **L** ≈ larger surface.

### Phase 0 — Fix the signOut crash · **S** · no deps
- **Goal:** sign-out stops throwing.
- **Files:** [src/contexts/AuthContext.tsx:6](../src/contexts/AuthContext.tsx#L6),
  [:62-67](../src/contexts/AuthContext.tsx#L62-L67).
- **Change:** remove `import router from "next/router"`; import `useRouter` from
  `next/navigation`, call `const router = useRouter()` inside `AuthProvider`, use
  `router.push("/")` (or `router.replace("/")`) in `signOut`. `useRouter` is hook-safe here
  because `AuthProvider` is already a client component.
- **New modules/signatures:** none.
- **Call sites migrated:** none (internal to the provider).
- **Manual verify:** `yarn build` green; run `yarn dev`, sign in, click sign-out → redirects to
  `/` with no console error. Before the fix this throws `NextRouter was not mounted`.
- **Rollback:** revert one file. No data touched.

### Phase 1 — Close the `is_paid` authority hole · **S** (code) + server SQL · no deps
- **Goal:** only the event's host can flip `is_paid`. Defense in depth: server-enforced (RLS)
  primary; optional client guard secondary.
- **Files (code, optional client guard):** [src/hooks/useOrders.ts:129-147](../src/hooks/useOrders.ts#L129-L147).
  Cross-reference the host-checked pattern in
  [src/lib/eventService.ts:63](../src/lib/eventService.ts#L63),[:82](../src/lib/eventService.ts#L82).
- **Server-side (the real fix — human runs):** verify/add an RLS `UPDATE` policy on
  `public.orders` so a non-host cannot set `is_paid`. Suggested check + policy:

  ```sql
  -- 1. Inspect current policies
  select polname, polcmd, pg_get_expr(polqual, polrelid) as using,
         pg_get_expr(polwithcheck, polrelid) as with_check
  from pg_policy where polrelid = 'public.orders'::regclass;

  -- 2. If no host-scoped UPDATE policy exists, add one (adjust names to your schema):
  alter table public.orders enable row level security;
  create policy "host_can_update_orders"
    on public.orders for update
    using (
      exists (select 1 from public.events e
              where e.id = orders.event_id and e.host_id = auth.uid())
    )
    with check (
      exists (select 1 from public.events e
              where e.id = orders.event_id and e.host_id = auth.uid())
    );
  ```

  > Caveat: a single blanket UPDATE policy may also govern attendees editing their *own* orders
  > (spice level, etc.). If attendees must still edit their own rows, you need **two** policies
  > (own-row edit vs host-only `is_paid`) or column-level grants. Confirm what attendee self-edit
  > is allowed before tightening, or you'll break legitimate edits. **Decide before running.**
- **Manual verify:** in the Supabase SQL editor, as a non-host JWT, attempt the `is_paid` update
  → must be rejected. App: host marks paid still works; a second signed-in non-host cannot.
- **Rollback:** drop the added policy. Client guard (if added) is a one-file revert.
- **Server-only flag:** ⚠ This bug is **not fixable in app code alone** — a client check is
  bypassable. RLS is the guard. The client change is cosmetic UX.

### Phase 2 — Build the Totals seam (`computeBill`) · **M** · deps: none (but land after 0–1)
- **Goal:** one pure module owns all money math. No call sites migrated yet — this phase only
  *introduces* the module, so the app is unchanged and trivially shippable.
- **Files:** new [src/util/totals.ts](../src/util/totals.ts); reference (do not yet edit) the
  existing math at [order-overview/page.tsx:39-45](../src/app/order-overview/page.tsx#L39-L45)
  to make sure `computeBill` reproduces `collected`/`pending`/`Math.max(0,…)` exactly.
  [tax.ts](../src/util/tax.ts) stays; `totals.ts` imports `TAX_RATE` from it.
- **New module/signature:** `computeBill(orders, { hostId?, onlySubmitted? }) => Bill` (see seam
  spec above). Decide rounding policy once here: round `tax` to cents, derive `total` from
  rounded parts (matches what `.toFixed(2)` displays). Document it in a comment.
- **Call sites migrated:** none (Phase 5 does that).
- **Manual verify:** `yarn build` green (module compiles, is tree-shaken out / unused is fine).
  Hand-trace `computeBill` against the current overview numbers for one sample event to confirm
  parity before Phase 5 swaps anything.
- **Rollback:** delete one new file.

### Phase 3 — Build + adopt the identity seam (`attendeeName`) · **M** · deps: none
- **Goal:** one resolver for the canonical `user_name`; **unify the 2-part sites to 3-part**
  (behavior change — fixes the guest-reorder grouping bug).
- **Files:** new [src/util/attendee.ts](../src/util/attendee.ts); migrate the **write/derive**
  sites:
  - 3-part (no behavior change): [useOrders.ts:75](../src/hooks/useOrders.ts#L75),
    [useAddOrderForm.ts:29](../src/hooks/useAddOrderForm.ts#L29),
    [order/page.tsx:34](../src/app/order/page.tsx#L34),
    [OrderList.tsx:48](../src/components/OrderList.tsx#L48),
    [OrderListItem.tsx:46](../src/components/orders/OrderListItem.tsx#L46).
  - **2-part → 3-part (behavior change):** [orderUtil.ts:32](../src/util/orderUtil.ts#L32),
    [orderUtil.ts:109](../src/util/orderUtil.ts#L109),
    [reorderUtils.ts:31](../src/util/reorderUtils.ts#L31),
    [reorderUtils.ts:70](../src/util/reorderUtils.ts#L70),
    [usePastEvents.ts:28](../src/hooks/usePastEvents.ts#L28). These must now receive `guestName`.
    For `reorderUtils`/`orderUtil`, thread the guest name through their options/params (callers
    that have a `guestName` pass it; logged-in callers pass `undefined`, behavior unchanged).
    For [usePastEvents.ts:28](../src/hooks/usePastEvents.ts#L28), it's a *read* filter — adopting
    the resolver keeps logged-in behavior identical (guests don't have past-events auth anyway;
    confirm).
- **New module/signature:** `attendeeName(user, guestName?) => string` (see seam spec).
- **Why this phase can adopt immediately (unlike Totals):** swapping an inline expression for a
  function returning the *same* value is behavior-preserving for the 3-part sites, so no
  staged rollout is needed; the 2-part sites are the intended fix. Keep it one PR because the
  whole point is that the key can no longer drift per-file.
- **Manual verify:** `yarn build` green. `yarn dev`:
  - Logged-in user orders → row `user_name` unchanged.
  - **Guest orders, then reorders** → both rows now share the same `user_name` (the bug fix);
    they group together in overview and a single paid-toggle covers both.
  - Host past-events still lists attendees correctly.
- **Rollback:** revert the file set. Note: any guest orders *created* under the new 3-part rule
  keep their corrected `user_name`; rollback only changes future writes, not stored rows.
- **Risk:** the `|| "Guest"` tail and exact precedence must match read-side defaults
  ([orderGrouping.ts:13](../src/util/orderGrouping.ts#L13),
  [useHostPastEvents.ts:75](../src/hooks/useHostPastEvents.ts#L75)). Reconcile to a single
  default string in this PR.

### Phase 4 — Route every total through `computeBill` · **M** · deps: **2, 3**
- **Goal:** delete inline money arithmetic; all four total sites call `computeBill`. After this,
  host-exclusion and no-tax bugs cannot recur.
- **Files / call sites migrated:**
  - [src/app/order-overview/page.tsx:30-45](../src/app/order-overview/page.tsx#L30-L45) —
    replace `sumOrderPrices` + `* TAX_MULTIPLIER` + `Math.max(0,…)` block with one
    `computeBill(orders, { hostId: activeEvent?.host_id, onlySubmitted: true })`; read
    `subtotal/total/collected/pending` off the result. Drop the `TAX_MULTIPLIER` import
    ([:14](../src/app/order-overview/page.tsx#L14)).
  - [src/components/orders/OrderListTotals.tsx:45-46](../src/components/orders/OrderListTotals.tsx#L45-L46) —
    replace `sub * TAX_RATE` / `sub + tax` with `computeBill(...)`. Drop `TAX_RATE` import
    ([:4](../src/components/orders/OrderListTotals.tsx#L4)). **Decide host-exclusion here:** this
    is the per-event list; pass `hostId` only if hosts should be excluded from the displayed
    list total (they currently are *not*). This is a deliberate behavior choice — confirm
    whether OrderListTotals should now exclude the host (it changes a visible number).
  - [src/hooks/useGroupedSubmittedOrders.ts:60-61](../src/hooks/useGroupedSubmittedOrders.ts#L60-L61) —
    replace `subtotal * TAX_RATE` / `subtotal + tax` with `computeBill`. Drop `TAX_RATE` import
    ([:5](../src/hooks/useGroupedSubmittedOrders.ts#L5)). Consumed by
    [order-mode/page.tsx:28](../src/app/order-mode/page.tsx#L28) — verify those rows still render.
  - [src/components/HostPastEventCard.tsx:23,84,141](../src/components/HostPastEventCard.tsx#L23) —
    replace the mixed `* TAX_MULTIPLIER` / `* TAX_RATE` display with values from `computeBill`
    fed by the past-events hook (which gains tax in Phase 6; here, switch the card to derive its
    own bill from the orders it already has, so it's correct before Phase 6 lands too).
- **`tax.ts`:** after this phase nothing imports `TAX_RATE`/`TAX_MULTIPLIER` except `totals.ts`.
  Leave the constants in `tax.ts` (imported only by the seam) — internal.
- **Manual verify:** `yarn build` green. Compare each screen's numbers to a hand-computed
  expectation for one event with: a host order present, a mix of paid/unpaid, and an unsubmitted
  order. Overview pending should match `total − collected ≥ 0`. Watch for the **behavior changes
  you intend**: host now excluded where it wasn't (useGroupedSubmittedOrders), and any
  OrderListTotals host decision above.
- **Rollback:** revert the four files; `computeBill` stays (unused is harmless).
- **Risk:** these are user-visible number changes. Some are bug *fixes* (host exclusion, tax
  consistency) — call them out in the PR so reviewers don't read them as regressions.

### Phase 5 — Merge the two past-events fetchers · **M** · deps: **3, 4**
- **Goal:** one hook, `usePastEvents(scope: "mine" | "hosted")`; join string, `event_date <
  today` filter, grouping, and totals each live once. Totals come from `computeBill`, so the
  no-tax/host-included discrepancies vanish.
- **Files:** merge [src/hooks/usePastEvents.ts](../src/hooks/usePastEvents.ts) +
  [src/hooks/useHostPastEvents.ts](../src/hooks/useHostPastEvents.ts) into one. Extract the
  shared join string to a constant; reuse `groupOrdersByUser` from
  [orderGrouping.ts:11](../src/util/orderGrouping.ts#L11) instead of the two inline groupers;
  compute per-attendee and grand totals with `computeBill`.
- **Behavior detail:** `"mine"` keeps the `.or(user_id/user_name)` self-filter and uses `inner`
  join; `"hosted"` keeps `.eq("host_id", …)`. Preserve each. For `"hosted"` grand total, decide
  whether host's own orders are excluded (Phase 4's policy should match here).
- **Call sites migrated:** update every importer of the old hooks (find with
  `grep -rn "useHostPastEvents\|usePastEvents" src/`) to the merged hook + scope arg.
  HostPastEventCard now reads tax-inclusive, host-correct totals.
- **Manual verify:** `yarn build` green. `yarn dev`: "my past events" totals now include tax
  (will be ~7% higher than before — intended); host past-events grand total now excludes host
  and includes tax. Spot-check one event against a manual bill.
- **Rollback:** revert the merge (restore both files + importers). No schema/data change.
- **Risk:** two query shapes folded into one; the `inner` vs non-`inner` join and the two filter
  clauses must each be preserved per scope or one screen silently shows wrong rows.

### Phase 6 — Collapse order intake to one writer · **M** · deps: **3, 4** (5 not required)
- **Goal:** `useOrders`' React-Query `addMutation` is the single single-row insert path;
  `addOrderUtil` folded into it so the insert, the `*, menu_items (*)` join, and cache
  invalidation live in one place. **`reorderUtils` stays separate** (bulk insert) but routes
  through `attendeeName` + a shared join-string constant.
- **Files / call sites:**
  - [src/util/orderUtil.ts:20-48](../src/util/orderUtil.ts#L20-L48) — remove `addOrderUtil`;
    its sole caller is [useAddOrderForm.ts:86](../src/hooks/useAddOrderForm.ts#L86). Migrate
    `useAddOrderForm` to call `useOrders(eventId).addOrder(...)`. Because the mutation
    auto-invalidates ([useOrders.ts:90](../src/hooks/useOrders.ts#L90)), the manual `onOrderAdded`
    refetch in `useAddOrderForm` becomes redundant — confirm and simplify, or keep the callback
    for the form's own UX (closing the form) but drop the refetch responsibility.
  - [src/hooks/useOrders.ts:63-91](../src/hooks/useOrders.ts#L63-L91) — already 3-part via
    Phase 3; extract the join string `"*, menu_items (*)"` to a shared constant (e.g.
    `ORDER_WITH_MENU_SELECT` in `src/lib/queries/orders.ts`) and use it in both mutation and
    `reorderUtils`.
  - [src/util/reorderUtils.ts](../src/util/reorderUtils.ts) — keep the bulk `.insert(array)`
    shape; use `attendeeName` (Phase 3) for each row's `user_name` and the shared join constant
    if/when it selects. Leave its invalidation strategy as-is (manual) unless trivial to unify.
- **Manual verify:** `yarn build` green. `yarn dev`: adding an order from the add-order form
  inserts and the list updates **without** a manual refetch (proves it's on the auto-invalidating
  mutation). Reorder still works.
- **Rollback:** revert the file set; `addOrderUtil` restoration is mechanical.
- **Risk:** `useAddOrderForm` currently lives outside the React-Query world (calls a util). Moving
  it onto a hook means the form must be able to call a hook (`useOrders`) — confirm it's a
  component-level hook context, not a plain async util called outside React. If `useAddOrderForm`
  can't host a hook, keep a thin `addOrder` wrapper but still share the insert/join with the
  mutation. **Flag for review.**

### Phase 7 — Cosmetic cleanup (lowest leverage) · **S** · deps: ideally after 4–6
- **Goal:** small, no-correctness-impact tidies.
- **Items:**
  - **Cutoff parse unify:** make [timeUtils.calculateCutoffTimeString](../src/util/timeUtils.ts)
    reuse [cutoffUtil](../src/util/cutoffUtil.ts)'s local parse (`.replace(/-/g,"/")`) so the
    create/edit **preview** matches the **gate**. Call sites:
    [useCreateEventForm.ts:53](../src/hooks/useCreateEventForm.ts#L53),
    [edit-event/[id]/page.tsx:229](../src/app/edit-event/[id]/page.tsx#L229). Verify the preview
    string equals what the gate enforces for a date near midnight.
  - **OrderListItem fragments:** inline the sub-30-line display fragments only if no reuse is
    planned. Cosmetic; skip if low value.
  - **OrderList props:** **NOT here** — see
    [orderlist-props-decision-20260527.md](orderlist-props-decision-20260527.md). Resolve that
    decision first; it may be its own PR.
- **Manual verify:** `yarn build` green; create/edit event preview time matches the gate.
- **Rollback:** per-item revert.

---

## Risk register & human decisions

- **[Decide before Phase 1]** RLS scope: does a host-only `is_paid` policy collide with
  attendees editing their own orders? May need split policies or column grants.
- **[Decide before Phase 3]** Canonical fallback string (`"Guest"` vs `"Unknown User"`) — must
  match read-side defaults to avoid a new grouping split.
- **[Decide before Phase 4]** Should `OrderListTotals` (per-event list) now exclude the host?
  It changes a visible number. Default: match overview semantics.
- **[Decide before Phase 6]** Can `useAddOrderForm` host the `useOrders` hook, or must it keep a
  util wrapper? Determines whether `addOrderUtil` fully disappears.
- **[Deferred]** OrderList props-vs-hook contract →
  [orderlist-props-decision-20260527.md](orderlist-props-decision-20260527.md).
- **Cross-cutting:** Phases 4–5 produce intended user-visible number changes (tax added to past
  events, host excluded). Label them as fixes in PR descriptions so they aren't mistaken for
  regressions.

## Sequencing rationale

`0,1` are independent and stop active bleeding (crash, auth hole) — ship first.
`2` builds money seam without touching callers (safe). `3` builds + adopts identity (the
adoption is behavior-preserving for 3-part sites and a deliberate fix for 2-part). `4` routes
totals through the seam — needs `2` (the seam) and `3` (correct keys feeding grouping). `5`
(past-events merge) and `6` (intake merge) both lean on `3`+`4`. `7` is cosmetic, last.

---

## Tracking checklist

- [ ] **Phase 0 — signOut crash (S):** `next/router` → `useRouter` from `next/navigation` in `AuthContext.tsx`; sign-out redirects with no throw; build green.
- [ ] **Phase 1 — is_paid authority (S + SQL):** inspect `public.orders` RLS; add host-scoped UPDATE policy (resolve attendee-self-edit collision first); confirm non-host rejected in SQL editor; build green. *(Human runs SQL.)*
- [ ] **Phase 2 — `computeBill` seam (M):** add `src/util/totals.ts` owning rate/host/submitted/paid/rounding; hand-trace parity vs current overview; no callers migrated; build green.
- [ ] **Phase 3 — `attendeeName` seam + adopt (M):** add `src/util/attendee.ts`; migrate all 3-part sites; **unify the 2-part sites (orderUtil×2, reorderUtils×2, usePastEvents) to 3-part**, threading `guestName`; reconcile fallback string; verify guest reorder now groups with original; build green.
- [ ] **Phase 4 — route totals through `computeBill` (M):** migrate order-overview, OrderListTotals, useGroupedSubmittedOrders, HostPastEventCard; drop bare TAX imports at call sites; decide OrderListTotals host policy; verify numbers; build green.
- [ ] **Phase 5 — merge past-events fetchers (M):** one `usePastEvents(scope)`; shared join constant + `groupOrdersByUser` + `computeBill`; preserve per-scope filter/join; migrate importers; verify tax-inclusive, host-correct totals; build green.
- [ ] **Phase 6 — one order-intake writer (M):** fold `addOrderUtil` into `useOrders.addMutation`; migrate `useAddOrderForm`; share the `*, menu_items (*)` join constant; route `reorderUtils` through `attendeeName` (keep bulk shape); verify add-without-manual-refetch; build green.
- [ ] **Phase 7 — cosmetic (S):** cutoff preview reuses local parse to match gate; optional OrderListItem fragment inlining; build green.
- [ ] **Deferred — OrderList props contract:** resolve [orderlist-props-decision-20260527.md](orderlist-props-decision-20260527.md) (option A or B), then PR if action chosen.

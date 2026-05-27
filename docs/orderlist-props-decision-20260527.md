# Decision needed: OrderList's dual data source (props vs hook)

**Status:** Open — needs a human decision before Phase 8 of the rework.
**Date raised:** 2026-05-27
**Owner:** _unassigned_

## Background

The reconciled architecture review
([architecture-review-final-20260527.html](architecture-review-final-20260527.html))
listed, as a low-leverage Phase-8 cleanup, "drop OrderList's unused
`orders`/`loading`/`error` props — no caller passes them." That claim was true
when the prose draft was written but **has since drifted and is now false.**

Verified at source on 2026-05-27:

- [src/components/OrderList.tsx:17-24](../src/components/OrderList.tsx#L17-L24) declares
  optional props `orders?`, `loading?`, `error?`.
- [src/components/OrderList.tsx:41-43](../src/components/OrderList.tsx#L41-L43) resolves
  each as `prop ?? hook`:

  ```ts
  const orders  = propOrders  ?? ordersHook.orders;
  const loading = propLoading ?? ordersHook.loading;
  const error   = propError   ?? ordersHook.error;
  ```

- There are exactly two render sites:
  - [src/app/order/page.tsx:119](../src/app/order/page.tsx#L119) **does pass all three**:
    `<OrderList orders={orders} loading={loading} error={error} />`, sourced from its
    own `useOrders(activeEvent?.id)` call at
    [order/page.tsx:25](../src/app/order/page.tsx#L25).
  - [src/app/order-overview/page.tsx:96](../src/app/order-overview/page.tsx#L96) passes
    **none** and lets `OrderList`'s internal `useOrders` self-source.

So the props are live, not dead. The original cleanup premise is invalid.

## The real smell

Both render paths ultimately call `useOrders(activeEvent?.id)` with the **same key**,
so React Query dedupes the network fetch — there's no double request. But there are two
*shapes* of the same component:

- `order/page` fetches orders itself (it needs them for finalize logic), then **passes them
  down** — so the page and the list share one source.
- `order-overview/page` **does not** fetch; it relies on the list to self-source.

The component supports both, which is why the `prop ?? hook` fallback exists. It's not a
bug — it's an ambiguous component contract. The question is whether to make the contract
explicit in one direction.

## Options

### A. Keep the dual-source pattern (lowest effort)
Leave `prop ?? hook` as-is. Just delete the Phase-8 "remove dead props" item from the plan,
since the premise is false. Add a one-line comment on the props documenting that they're an
optional override used by `order/page`.

- **Pros:** zero risk, zero churn; both call sites keep working unchanged.
- **Cons:** the component keeps a slightly ambiguous contract (is it a controlled or
  uncontrolled list?). A future reader hits the same confusion this doc is resolving.

### B. Commit to props-only (presentational component)
Make `OrderList` purely presentational: `orders`/`loading`/`error` become **required**,
remove the internal `useOrders(activeEvent?.id)` call. Then `order-overview/page` must fetch
and pass them, exactly as `order/page` already does.

- **Pros:** one clear contract; data-fetching lifts to the pages; `OrderList` becomes trivially
  predictable and reusable. Cleanest seam.
- **Cons:** larger change — `order-overview/page` must add a `useOrders` call and thread
  props; touches more files; must re-check that `useOrderListActions` (which currently reads
  `ordersHook` inside `OrderList`) still gets a hook instance (actions need mutations, not
  just data — see note below).

### C. Commit to hook-only (self-sourcing component)
Remove the props; `OrderList` always self-sources via `useOrders`. `order/page` stops passing
them.

- **Pros:** one contract, no prop threading.
- **Cons:** `order/page` already needs the orders for its own finalize logic and would keep its
  own `useOrders` call anyway, so the data is fetched in the page *and* in the list. React
  Query dedupes the fetch, but you now have two `useOrders` instances driving one screen — the
  reverse of B's clarity. Least attractive.

## Important coupling note (affects B and C)

`OrderList` doesn't only consume order *data* — it also calls
[useOrderListActions({ activeEvent, ordersHook })](../src/components/OrderList.tsx#L45),
which needs the **mutation** functions from the hook (`updateOrder`, `setAttendeePaid`, etc.),
not just `orders`. So even under option B (props-only for data), the component still needs a
hook instance for actions, OR the actions/mutations must also be lifted to the page and passed
down. This is the crux: a clean props-only split means lifting *both* data and actions, which
is why B is "M/L", not "S".

## Recommendation (non-binding)

If we want the cleanest long-term contract, **B**, but scoped carefully: lift data *and* the
action callbacks `OrderList` actually uses, so the component becomes a true leaf. If we want to
spend the Phase-8 budget elsewhere, **A** with a clarifying comment is entirely defensible —
there is no correctness bug here, only contract ambiguity. **C is not recommended.**

This is deliberately *not* resolved in the main rework plan; pick A or B when Phase 8 comes up.

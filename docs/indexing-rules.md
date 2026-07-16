# OP_DROP indexing rules

<p align="center">
  <strong>The evidence layer for Bitcoin-native token activity.</strong><br />
  Rules for deriving OP_DROP confirmed state from blockchain activity.
</p>

> **Why this matters:** the future of Bitcoin tokens depends on the difference
> between an observed transaction and a proven state transition. These rules
> make that difference visible to holders, builders, and operators.

OP_DROP state is based on confirmed blockchain history and the rules in this
document. A preview, pending transaction, or another protocol's balance is not
confirmed OP_DROP state.

| Jump to | What you will learn |
| --- | --- |
| [Confirmation](#2-confirmation-and-finality) | When a submitted action becomes confirmed state. |
| [Ordering](#3-deterministic-ordering) | How OP_DROP resolves competing events consistently. |
| [Minting](#5-mint-rules) | Limits, remaining supply, and partial final mints. |
| [Transfers](#7-transfer-and-settlement-rules) | Available, reserved, settled, and returned units. |
| [Statuses](#8-event-statuses-and-reasons) | What each Explorer outcome means. |

## Purpose and scope

OP_DROP is changing the default from “the indexer says so” to a documented,
reproducible decision path. A user can follow the event from exact text to
confirmation to ledger result. A builder can implement the same checks. An
indexer can show why an event was accepted or rejected.

This document explains exactly how the OP_DROP confirmed view is calculated for
Explorer and Portfolio. It is written for holders, traders, collectors, and
anyone who needs to understand why an event, balance, supply figure, or holder
count is displayed.

OP_DROP is its own application protocol. It is not BRC-20, it is not an
Ordinals balance, and a result from another service does not automatically
match the OP_DROP confirmed view.

The confirmed view is a record of the currently accepted blockchain history. It
does not include mempool activity, drafts, wallet previews, or promises that a
transaction will confirm.

## Plain-language summary

An OP_DROP event changes confirmed state only when all of the following are
true:

1. The event is in a block that has reached the application's confirmation
   policy.
2. Its exact OP_DROP event text follows the published format.
3. The transaction and event satisfy the OP_DROP validation rules.
4. Applying the event does not violate the deployment, supply, mint, or
   transfer rules below.

If any check fails, the event can be recorded as invalid for transparency, but
it never changes supply, balances, or holder counts.

## 1. What counts as an OP_DROP event

Every accepted event has an exact compact JSON document. The protocol marker is
always `"p":"op-drop"`, and the permitted actions are `deploy`, `mint`, and
`transfer`.

The text is identity-bearing. Users should review the exact preview before
signing:

- values are strings;
- field order is fixed for each action;
- whitespace is not interchangeable;
- extra, missing, reordered, or duplicate fields are not accepted; and
- ticker and amount fields must follow the event rules.

For the complete event format and examples, read the
[OP_DROP event rules](protocols/op-drop-json.md).

## 2. Confirmation and finality

Explorer and Portfolio show confirmed state only. This creates a clear boundary
between an action that has been submitted and an action that can affect a
balance.

| State | Meaning |
| --- | --- |
| Draft or wallet preview | A proposed action. It has no confirmed effect. |
| Pending | A transaction may be waiting to confirm. It has no confirmed effect. |
| Confirmed event | The event has passed the confirmation and OP_DROP checks. |
| Invalid event | The event was observed but did not pass a required rule. |

If the blockchain reorganizes, the confirmed view is reconciled to the current
confirmed chain. A previously displayed event or balance can therefore change
if the block containing it is replaced before it is final under the active
confirmation policy.

## 3. Deterministic ordering

Rules are applied in deterministic blockchain order. This prevents two people
from receiving different results when several OP_DROP events compete for the
same ticker, supply, or balance.

The ordering is based on:

1. block height;
2. transaction position within that block;
3. event position within that transaction; and
4. a stable event identity if an additional tie-break is needed.

This order decides which deployment wins, which mints consume remaining supply,
and which transfers settle first.

## 4. Deployment rules

A deployment creates the rules for one four-character lowercase ticker on one
network.

| Rule | Result |
| --- | --- |
| First valid confirmed deployment for a ticker | Establishes that ticker's maximum supply and mint limit. |
| Later deployment for the same ticker | Invalid as a duplicate. It cannot replace the first deployment. |
| Invalid deployment | Does not reserve the ticker and does not create supply. |
| Different network | Evaluated independently. A ticker on one network does not establish it on another. |

The deployment is the source of truth for its ticker. A display name, a similar
inscription, or a matching ticker in another protocol does not establish an
OP_DROP deployment.

## 5. Mint rules

A mint is evaluated against the valid deployment for its ticker.

| Check | Outcome |
| --- | --- |
| No valid deployment exists | Invalid, because the ticker is unknown. |
| Requested amount is above the deployment mint limit | Invalid. |
| Supply is already exhausted | Invalid. |
| Requested amount is within the mint limit and supply remains | Valid. |

The credited amount is calculated as:

```text
credited amount = the smaller of the requested amount and remaining supply
```

This means the final valid mint can receive a partial amount when it requests
more than the remaining supply but does not exceed the per-mint limit. Once the
maximum supply has been reached, later mints are invalid.

When a mint is accepted, its credited amount becomes available balance for the
address associated with that confirmed event.

## 6. Balance rules

Balances are tracked separately for each address and ticker. Quantities are
whole-number units and are displayed as decimal strings so large values remain
exact.

| Balance field | Meaning |
| --- | --- |
| Available | Confirmed units that the address can use for a new transfer. |
| Reserved | Confirmed units currently waiting for a transfer to complete. |
| Total | `Available + Reserved`. |

An address is counted as a holder when it has a non-zero available or reserved
balance for that ticker. An address with zero in both fields is not counted as
a holder.

## 7. Transfer and settlement rules

Transfers use two confirmed stages so the confirmed view does not credit a
recipient before the transfer is completed.

### Stage A: reserve the amount

A transfer is valid only when its sender has at least the requested amount in
available balance. When accepted:

- the amount leaves available balance;
- the same amount enters reserved balance; and
- the event is shown as `transfer_pending`.

No recipient has received available units at this stage.

### Stage B: settle or return the amount

The transfer has a specific on-chain settlement anchor. When that anchor is
first spent in a confirmed transaction, OP_DROP determines the destination from
the transaction's first addressable destination.

| Settlement result | Balance effect |
| --- | --- |
| A valid destination is present | Reserved units leave the sender and become available to the destination. The settlement is `settled`. |
| No valid destination can be identified | The transfer is invalid. Reserved units return to the sender's available balance. |

An invalid settlement is a return, not a burn. The units are not destroyed.

## 8. Event statuses and reasons

Explorer can display every observed event, including events that do not affect
balances. This makes the confirmed view auditable without treating every
observed transaction as valid.

| Status | Meaning |
| --- | --- |
| `valid` | A deployment or mint passed all applicable rules. |
| `transfer_pending` | A transfer reserved the sender's units and is awaiting settlement. |
| `settled` | A transfer settlement credited the destination. |
| `invalid` | The event did not pass one or more required rules. |

An invalid event can include a reason such as an unknown ticker, duplicate
deployment, mint-limit breach, exhausted supply, insufficient available
balance, malformed event text, or an invalid settlement destination. These
reasons explain the result. They do not create a balance.

## 9. Explorer and Portfolio behavior

Explorer presents protocol-wide information such as deployments, supply,
holders, and confirmed event history. Portfolio presents the confirmed OP_DROP
balances for an address.

Use these rules when reading the interface:

- an empty result does not prove that a draft or pending transaction will fail;
- a pending action is not a balance;
- a reserved amount is already deducted from the sender's available balance;
- a displayed holder count includes addresses with either available or reserved
  units; and
- a partial or warming-up status means the confirmed view is still catching up,
  so users should recheck before relying on the latest totals.

## 10. `$DROP` reference terms

`$DROP` is the display name for the OP_DROP ticker `drop`.

| Term | Value |
| --- | ---: |
| Maximum supply | 21,000,000 whole units |
| Mint limit | 1,000 whole units per valid mint event |
| Full-limit mint count | 21,000 events |
| Decimal places | None |

The $DROP deployment exists only after its exact deployment event is confirmed
and accepted. These terms are protocol rules, not a price, availability, or
external-support guarantee.

## 11. What these rules do not promise

The confirmed OP_DROP view does not promise:

- that a transaction will relay, mine, or confirm by a particular time;
- that a wallet, marketplace, miner, or other indexer will use the same rules;
- that a pending event will become valid; or
- that an Ordinals or BRC-20 result represents an OP_DROP balance.

Use the confirmed OP_DROP state in Explorer and Portfolio. If something looks
unexpected, check the event status and reason. Pending activity remains
unconfirmed until it appears in the confirmed view.

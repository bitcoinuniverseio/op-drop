# OP_DROP design

<p align="center">
  <strong>Bitcoin-native tokens need primitives people can verify.</strong><br />
  OP_DROP uses compact events and deterministic rules to derive confirmed token state.
</p>

> **A protocol for the next chapter of Bitcoin inscriptions:** OP_DROP is a bet
> on smaller, clearer, confirmation-first token events. It does not ask users to
> trust a ticker, a screenshot, or an opaque indexer. It gives them an exact
> action, a Bitcoin transaction, and a public rulebook.

This document explains the protocol's design choices and scope.

## The future we are building

Bitcoin has the strongest settlement story in the ecosystem. The opportunity
now is to make token activity worthy of that foundation: compact enough to
inspect, strict enough to implement consistently, and clear enough for a new
user to understand before signing.

### What is changing

- From loose inscription conventions to an explicit application contract.
- From "pending looks like ownership" to confirmation-first accounting.
- From hidden transfer transitions to visible reservation and settlement.
- From indexer-specific guesses to published rules and reproducible state.
- From protocol name confusion to a deliberate boundary around OP_DROP.

### Why clear evidence matters now

Users can set a higher standard for previews and confirmed state. Creators can
publish rules their communities can inspect. Wallets and explorers can make the
same event easier to follow from signature to confirmed result.

**Start with something concrete: read the event, try the flow with an amount you
understand, and bring a community that wants Bitcoin tokens with clearer
evidence.**

## Protocol flow

```mermaid
flowchart LR
  A[One compact OP_DROP event] --> B[Strict transaction profile]
  B --> C[Bitcoin confirmation]
  C --> D[Deterministic rules]
  D --> E[Visible supply, balances, and transfers]
```

OP_DROP does not treat every token-looking transaction as a balance. It records
an exact event and applies a defined set of rules after confirmation.

| Question | OP_DROP behavior |
| --- | --- |
| I signed something. Did it count? | Only confirmed, rule-valid events change the OP_DROP record. |
| Where did my transfer go? | Units are shown as available, reserved, or settled. |
| Which deployment is active? | The first valid confirmed deployment for a ticker establishes the rules. |
| Why did this not work? | Invalid events can be displayed with a reason, without changing balances. |

## Core design decisions

```mermaid
flowchart TB
  A[Compact event] --> E[Confirmed OP_DROP state]
  B[Strict validation] --> E
  C[Deterministic ordering] --> E
  D[Transparent transfer lifecycle] --> E
```

### Compact events

An OP_DROP action is a short, exact event, not a large arbitrary payload. The
small format makes the user intent readable and helps the protocol fit a
Bitcoin environment with tighter data limits.

### Validation before accounting

The app does not award a balance because text resembles a token action. It
checks the event, the transaction profile, confirmation, and the relevant
ledger rule before confirmed state changes.

### Deterministic ordering

Deployments, mints, and transfers are applied in deterministic blockchain
order. That gives Explorer and Portfolio one coherent answer for supply,
holders, balances, and event history.

### Transfer lifecycle

A transfer does not instantly disappear from the sender and magically appear
at the recipient. OP_DROP shows the intermediate reserved state, then either
settles the units at the destination or returns them if settlement is invalid.

## Relationship to Ordinals and BRC-20

OP_DROP is not an Ordinals or BRC-20 clone. It provides a separate confirmed
record for token-like activity on Bitcoin.

| Instead of relying on... | OP_DROP focuses on... |
| --- | --- |
| A generic inscription or a token-looking transaction | An exact OP_DROP event with explicit rules. |
| A balance inferred from a different protocol | Its own confirmed supply and balance record. |
| A transfer with an unclear in-between state | Available, reserved, and settled units. |
| A user guessing whether an event counted | A visible confirmed or invalid outcome. |

## Scope

The design favors token activity that is easier to inspect and less likely to
be misunderstood:

```mermaid
flowchart LR
  A[Smaller events] --> B[Readable user intent]
  B --> C[Stricter validation]
  C --> D[More legible token state]
  D --> E[Clearer experiences for everyone]
```

This is an application design choice, not a prediction about Bitcoin consensus,
market adoption, or support by other services. Within this app, the confirmed
view follows the rules published in this repository.

## Related documentation

| Next step | What you will learn |
| --- | --- |
| [Get started](guides/getting-started.md) | How to create your first OP_DROP action. |
| [Explorer and Portfolio](guides/op-drop-explorer.md) | How to read the confirmed record. |
| [Indexing rules](indexing-rules.md) | Every rule behind supply, balances, transfers, and invalid events. |
| [Event rules](protocols/op-drop-json.md) | The exact compact event format. |

# OP_DROP integration checklist

> **Build the future of Bitcoin tokens on a contract people can verify.** This
> checklist turns the OP_DROP design into an implementation path for wallets,
> explorers, marketplaces, analytics tools, and indexers.

Use it before calling an integration production-ready. The fastest way to bring
users on board is to make the important evidence visible at every step.

## 1. Identify the protocol correctly

- [ ] Display the user-facing protocol name as `OP_DROP`.
- [ ] Use `"p":"op-drop"` as the JSON protocol marker.
- [ ] Keep OP_DROP separate from Ordinals and BRC-20 in navigation, balances,
      search, and analytics.
- [ ] Do not present a matching ticker in another protocol as an OP_DROP asset.
- [ ] Explain that `BIP-110 READY` is an application profile, not consensus
      activation.

## 2. Show the exact user action

- [ ] Preview the complete canonical event before signing.
- [ ] Preserve UTF-8 bytes, fixed key order, string values, and exact spacing.
- [ ] Make Deploy, Mint, and Transfer visibly distinct actions.
- [ ] Show the ticker, amount, supply, mint limit, and destination context that
      apply to the action.
- [ ] Require users to confirm the details they are authorizing.

## 3. Enforce the confirmed-state boundary

- [ ] Keep drafts and pending transactions out of confirmed balances.
- [ ] Show confirmation progress without implying that confirmation is
      guaranteed.
- [ ] Apply the event only after the configured confirmation policy is met.
- [ ] Validate the event, transaction profile, and ledger transition before
      crediting supply or balances.
- [ ] Surface warming-up, partial, and retry states honestly.

## 4. Model balances and transfers clearly

- [ ] Display `available`, `reserved`, and `total` separately.
- [ ] Explain that reserved units are not currently available for another
      transfer.
- [ ] Show the transfer status as pending, settled, returned, or invalid.
- [ ] Do not credit the destination before the transfer anchor settles.
- [ ] Return units to the sender when settlement is invalid, according to the
      published rules.

## 5. Make invalid events useful

- [ ] Record observed invalid events for auditability.
- [ ] Show a human-readable reason such as duplicate deployment, unknown ticker,
      mint-limit breach, exhausted supply, malformed event, or invalid
      settlement destination.
- [ ] Ensure invalid events do not affect supply, balances, or holder counts.
- [ ] Let users distinguish an invalid event from a transaction that is still
      pending or an indexer that is still catching up.

## 6. Test against the public contract

- [ ] Test canonical Deploy, Mint, and Transfer examples.
- [ ] Test reordered keys, added whitespace, unknown fields, duplicate fields,
      and non-string values.
- [ ] Test duplicate deployments and mint-limit boundaries.
- [ ] Test final partial mints and exhausted supply.
- [ ] Test insufficient available balance and transfer reservation.
- [ ] Test valid settlement, invalid settlement, and returned units.
- [ ] Test reorganization recovery and confirmation cursor behavior.

## 7. Publish an adoption-ready experience

- [ ] Link users to the [getting started guide](guides/getting-started.md).
- [ ] Link builders to the [event format](protocols/op-drop-json.md) and
      [indexing rules](indexing-rules.md).
- [ ] Link communities to the [messaging kit](messaging-kit.md).
- [ ] Explain what OP_DROP changes: exact events, confirmation-first accounting,
      visible transfer state, and one shared rulebook.
- [ ] Invite people to come on board quickly by giving them a verification path,
      not by asking them to sign what they have not read.

## Definition of done

An integration is ready when a user can answer four questions without leaving
the product:

1. What exact event am I signing?
2. Has it confirmed under the configured policy?
3. Why did the protocol accept or reject it?
4. Where are the units right now?

**If the answers are visible, the product is not merely displaying a token. It
is helping build the next, more trustworthy layer of Bitcoin inscriptions.**

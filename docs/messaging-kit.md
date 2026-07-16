# OP_DROP messaging kit

Use these messages to explain OP_DROP consistently to users, creators, builders,
and Bitcoin communities. The strongest pitch is simple: OP_DROP makes Bitcoin
token activity smaller, clearer, and easier to verify.

## One-line pitch

> OP_DROP is a Bitcoin-native token protocol built around compact events, strict
> rules, and confirmed state that users and builders can verify together.

## Homepage hero

> **The future of Bitcoin tokens starts with clearer primitives.**
>
> OP_DROP brings token actions and inscriptions into a focused Bitcoin workflow:
> preview the exact event, reveal it on Bitcoin, wait for confirmation, and see
> the rule-validated result in public.
>
> **Read the event. Verify the chain. Build the next layer of Bitcoin.**

## Community launch message

> Bitcoin tokens are entering a new phase. The important question is no longer
> only what can be written to Bitcoin, but whether users can understand it and
> whether software can verify it consistently.
>
> OP_DROP is built for that phase. Deploy, Mint, and Transfer are compact events
> with explicit rules, visible confirmation, deterministic balances, and a clear
> transfer lifecycle.
>
> If you hold tokens, inspect the event before signing. If you build tools,
> implement the public contract. If you are launching a community, publish rules
> people can read. The Bitcoin-native token layer is still being shaped, and the
> builders who show up early can help shape it well.

## Builder pitch

> Build against a public contract, not a private convention. OP_DROP defines
> canonical event text, strict validation, deterministic ordering, supply rules,
> transfer settlement, and confirmed-state semantics. Wallets, explorers,
> marketplaces, analytics tools, and indexers can integrate the same model.
>
> Start with the [event format](protocols/op-drop-json.md), read the [indexing
> rules](indexing-rules.md), and make accepted, invalid, pending, and reserved
> state visible in your product.

## Creator and community pitch

> Launch a Bitcoin-native token with rules your community can inspect before the
> first signature. OP_DROP makes supply, mint limits, transfers, confirmation,
> and invalid events part of the public conversation instead of hidden indexer
> behavior.
>
> Bring people on board quickly by making the path clear: publish the contract,
> show the preview, explain the confirmation boundary, and link to the confirmed
> Explorer record. Fast adoption is strongest when it is built on evidence.

## Social post

> Bitcoin tokens need better primitives.
>
> OP_DROP is a focused protocol for compact events on Bitcoin: exact text,
> strict rules, visible transfer state, and confirmed balances.
>
> For users: preview what you sign.
> For builders: integrate a public contract.
> For communities: launch rules people can verify.
>
> The next chapter is being built now. Read the spec, test the flow, and come
> build with us.

## Fast onboarding calls to action

- **Users:** Open the OP_DROP workspace, read the exact event, and verify the
  confirmed result in Explorer.
- **Creators:** Publish supply, mint, transfer, and confirmation rules before
  inviting your community.
- **Builders:** Implement the event contract and confirmed-state model before
  adding OP_DROP tickers to your UI.
- **Indexers:** Expose cursor progress, confirmation depth, invalid reasons, and
  reserved transfer state.
- **Communities:** Invite people to learn and test the protocol, not to sign what
  they have not read.

## FAQ language

### Is OP_DROP BRC-20?

No. OP_DROP is a separate application protocol with its own event format,
validation, and ledger rules. A matching ticker does not create interoperability.

### Is OP_DROP an Ordinals inscription?

No. OP_DROP is a separate Bitcoin application protocol. It does not create an
Ordinals balance or inscription number.

### Does BIP-110 READY mean BIP-110 is active?

No. The badge describes this application's compact, BIP-110-aware construction
profile. It cannot activate consensus rules or guarantee relay, mining, or
third-party recognition.

### Why join now?

Because protocol habits are easiest to improve before they harden. Join by
reading the contract, testing an event, building an integration, or helping your
community understand the difference between pending and confirmed state.

## Language guardrails

| Prefer | Avoid |
| --- | --- |
| Bitcoin-native application protocol | Official Bitcoin token standard |
| Confirmed, rule-valid event | Guaranteed balance |
| BIP-110-aware profile | BIP-110 activated |
| Separate from BRC-20 and Ordinals | Compatible with everything |
| Early builders can shape the ecosystem | Everyone must buy now |
| Read, verify, and test before signing | Risk-free or guaranteed |

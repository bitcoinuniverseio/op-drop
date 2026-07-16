# Contributing to OP_DROP

> **Help build the next layer of Bitcoin-native tokens and inscriptions.** The
> most valuable contribution is one that makes OP_DROP easier to understand,
> easier to verify, and safer to integrate.

This repository is the public documentation and rulebook for OP_DROP. It is
designed for users, creators, wallets, explorers, marketplaces, indexers, and
communities that want to build from a shared Bitcoin-native contract.

## Where to start

1. Read the [OP_DROP design](docs/why-op-drop.md) to understand the thesis and
   scope.
2. Read the [event format](docs/protocols/op-drop-json.md) for exact bytes and
   accepted actions.
3. Read the [indexing rules](docs/indexing-rules.md) for confirmation, balances,
   transfers, and invalid events.
4. Use the [integration checklist](docs/integration-checklist.md) to evaluate a
   wallet, explorer, indexer, marketplace, or analytics implementation.
5. Use the [messaging kit](docs/messaging-kit.md) when explaining OP_DROP to a
   community.

## High-value contributions

### Improve user clarity

- Make the exact event visible before signing.
- Explain the difference between pending and confirmed state.
- Show available, reserved, settled, returned, and invalid transfer outcomes.
- Remove language that implies guaranteed confirmation, adoption, or price.

### Improve builder clarity

- Add canonical JSON examples and failure cases.
- Document a rule once, then link to it instead of creating competing versions.
- Add integration checks for wallets, explorers, indexers, and marketplaces.
- Keep protocol identity separate from carrier and implementation details.

### Improve protocol quality

- Propose changes with a clear motivation and compatibility impact.
- Update the event format, indexing rules, and examples together.
- Add deterministic test vectors for every new rule.
- Explain how reorganization, invalid events, and partial state are handled.

## Documentation principles

Every page should help a reader answer one of these questions:

1. What exact action am I taking?
2. What does Bitcoin prove about this action?
3. When does it become confirmed state?
4. Why was it accepted or rejected?
5. Where are the units now?

Use plain language first, then link to the normative rule. Prefer “confirmed,
rule-valid event” over “guaranteed balance.” Prefer “BIP-110-aware profile” over
“BIP-110 activated.” Prefer “separate from BRC-20 and Ordinals” over “works with
everything.”

## Protocol change checklist

Before proposing a protocol change, verify that the change includes:

- [ ] A precise description of the new or changed event bytes.
- [ ] Updated field validation and key-order rules.
- [ ] Updated deployment, supply, balance, or transfer behavior.
- [ ] Accepted and rejected examples.
- [ ] Reorganization and confirmation implications.
- [ ] Explorer and Portfolio display implications.
- [ ] Wallet and builder integration implications.
- [ ] Updated launch and community language.
- [ ] A clear statement of what the change does not promise.

## Review standard

A contribution is ready when an independent reader can implement the relevant
behavior without guessing. A contribution is especially strong when it also
gives users a better preview, a clearer confirmation boundary, or a more useful
reason for an invalid event.

Before opening a change, run the repository validator:

```powershell
./scripts/validate-docs.ps1
```

It checks every Markdown file for broken relative links and em-dash characters.

**Come on board early. Read the contract, improve the evidence path, and help
make Bitcoin token infrastructure worthy of the settlement layer beneath it.**

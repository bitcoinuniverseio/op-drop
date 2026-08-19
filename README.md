# OP_DROP

<p align="center">
  <strong>Bitcoin-native token actions you can read before signing and verify after confirmation.</strong><br />
  Compact events. Exact rules. Visible state.
</p>

OP_DROP turns deploy, mint, and transfer intent into one small event, checks it against its Bitcoin transaction, and applies it to a public confirmed-state record. Pending activity stays pending. Invalid activity stays out of balances. Transfers remain visible from reservation through settlement.

The production read path is served by API-only replicas backed by one
transactional ledger. A separate single-writer scanner verifies finalized
blocks against two independently operated Bitcoin nodes. Maintenance and
catch-up can therefore continue without presenting partial scanner work as
confirmed state.

```text
preview the event → sign intentionally → confirm on Bitcoin → verify the result
```

## Why OP_DROP feels different

| What you need | What OP_DROP gives you |
| --- | --- |
| Know what you are approving | One exact, human-readable JSON event before signing. |
| Know when an action counts | Supply and balances change only after confirmation and validation. |
| Know where transferred units are | Available, reserved, settled, and returned states remain visible. |
| Know why something failed | Invalid events can show a reason without changing balances. |
| Know which record to trust | Explorer and Portfolio follow the same deterministic chain order and rules. |

## Three actions

| Action | What it means | Confirmed result |
| --- | --- | --- |
| **Deploy** | Define a four-character ticker, maximum supply, and mint limit. | The first valid confirmed deploy for that ticker establishes its rules. |
| **Mint** | Request units under an active token's rules. | Valid units become available at the event address. |
| **Transfer** | Move confirmed available units onward. | Units reserve first, then settle at the destination or return if settlement is invalid. |

## Your OP_DROP journey

1. Open the dedicated **OP_DROP** workspace.
2. Choose **Deploy**, **Mint**, or **Transfer**.
3. Review the exact event, network, destination, amount, and fee.
4. Approve only in a wallet you trust.
5. Wait for confirmation.
6. Check **Explorer** for the event and **Portfolio** for the address balance.

## Start where you are

| I want to… | Start here |
| --- | --- |
| Make my first action | [Get started](docs/guides/getting-started.md) |
| Check a token, event, or address | [Explorer and Portfolio](docs/guides/op-drop-explorer.md) |
| Understand a balance or status | [Confirmed-state rules](docs/indexing-rules.md) |
| Read the exact event | [Event format](docs/protocols/op-drop-json.md) |
| Understand the design | [Why OP_DROP](docs/why-op-drop.md) |
| Understand BIP-110 READY | [BIP-110 and OP_DROP](docs/guides/bip110-compatibility.md) |

## `$DROP` at a glance

`$DROP` is the display name for ticker `drop`.

| Term | Value |
| --- | ---: |
| Maximum supply | 21,000,000 whole units |
| Maximum mint | 1,000 units per valid mint event |
| Decimal places | None |

These terms affect state only after the `drop` deploy event is confirmed and accepted.

## Stay in control

Never enter a seed phrase or private key into an OP_DROP page. Read the exact JSON preview and every wallet detail before approval. A preview, signature, or pending transaction is not a confirmed balance. Bitcoin transactions are difficult to reverse once confirmed, and another wallet or service may interpret token activity differently—use OP_DROP Explorer and Portfolio for this protocol's confirmed view.

# OP_DROP event format

This page defines the JSON accepted as an OP_DROP event. The protocol field is
always <code>"p":"op-drop"</code>.

The serialized JSON is part of the event. Different spacing, fields, key order,
or values produce a different event.

| Section | Contents |
| --- | --- |
| [Event text](#3-exact-event-text) | The required JSON shape for Deploy, Mint, and Transfer. |
| [Ledger rules](#4-ledger-rules) | How deployments, supply, mints, and transfers change confirmed state. |
| [Scope](#6-scope) | What this document does and does not cover. |

`op-drop` is an application protocol, not an Ordinals inscription or BRC-20.
[BIP-110](https://bips.dev/110/) is a published `Complete` proposal for a
temporary deployment if activated. This document defines event text and
confirmed-balance rules. It does not guarantee activation, relay, mining,
wallet support, marketplace support, or adoption by another indexer.

## 1. Identity and scope

One `op-drop` event uses one compact JSON document. The app shows the exact
text before signing.

| Layer | Exact value | Purpose |
| --- | --- | --- |
| JSON protocol field | `op-drop` | Required in JSON `p`. This is the public protocol identifier. |

The protocol name is always `op-drop`. It is never replaced by an application
name or technical label.

## 2. When an event becomes visible

```mermaid
flowchart LR
  A[Review the exact JSON] --> B[Create the event]
  B --> C[Wait for confirmation]
  C --> D[Apply op-drop rules]
  D --> E[Show confirmed state]
```

A wallet screen, draft order, or unconfirmed transaction is not confirmed
state.

## 3. Exact event text

The exact JSON text matters. Use the preview shown by the app without changing
its spacing, key order, or values.

All canonical JSON:

- is UTF-8;
- has no whitespace outside string values;
- has no duplicate or unknown keys;
- uses JSON strings for every value; and
- uses the required key order for its operation.

### Deploy

```json
{"p":"op-drop","op":"deploy","tick":"demo","max":"21000000","lim":"1000"}
```

Key order: `p`, `op`, `tick`, `max`, `lim`.

### Mint

```json
{"p":"op-drop","op":"mint","tick":"demo","amt":"1000"}
```

Key order: `p`, `op`, `tick`, `amt`.

### Transfer

```json
{"p":"op-drop","op":"transfer","tick":"demo","amt":"250"}
```

Key order: `p`, `op`, `tick`, `amt`.

### Field validation

| Field | Rule |
| --- | --- |
| `p` | Exactly `op-drop`. |
| `op` | Exactly `deploy`, `mint`, or `transfer`. |
| `tick` | Exactly four lowercase ASCII letters or digits matching `^[a-z0-9]{4}$`. |
| `max` | A positive whole-number string with no sign, fraction, exponent, or leading zero. |
| `lim`, `amt` | Positive whole-number strings. They must also fit the deployed terms and available balance. |
| `lim` | On deploy, no greater than `max`. |

Reject reordered keys, whitespace-altered bytes, unknown keys, non-string
values, alternate markers, or any different serialized byte sequence.

## 4. Ledger rules

`op-drop` is independent of BRC-20. The reference ledger uses familiar
accounting ideas where useful: four-character tickers, first valid deployment,
deterministic confirmed-chain ordering, partial final mints, and two-stage
transferable balances. It does not create a BRC-20 inscription, an Ordinals
inscription number, or automatic interoperability with either system.

### Deployment identity

Confirmed events are applied in a consistent blockchain order. The first valid
deployment for a ticker wins. A later deployment for the same ticker does not
replace it.

### Minting

For deployed `max` and `lim`, a mint is eligible only when `amt <= lim` and
supply remains. With `remaining = max - minted` before the event:

```text
credited = min(requested_amt, remaining)
```

The first mint crossing the remaining supply is valid and receives the
remainder. A mint after supply reaches zero is invalid. A mint over the limit
is invalid even if it fits the remaining supply.

### Transfers

1. A valid mint credits the address shown for that event.
2. A valid transfer reserves the amount when the sender has enough available
   balance.
3. A completed, confirmed transfer credits the destination.
4. If the transfer cannot complete validly, the reserved amount returns to the
   sender.

## 5. `$DROP` terms and examples

`$DROP` is a display label. The wire ticker is `drop`.

| Term | Canonical value |
| --- | ---: |
| Maximum supply | `21000000` |
| Mint limit | `1000` |
| Full-limit mint plan | `21000` |
| Decimal places | None |

| Event | Exact JSON |
| --- | --- |
| `$DROP` deploy | `{"p":"op-drop","op":"deploy","tick":"drop","max":"21000000","lim":"1000"}` |
| `$DROP` mint | `{"p":"op-drop","op":"mint","tick":"drop","amt":"1000"}` |
| `$DROP` transfer | `{"p":"op-drop","op":"transfer","tick":"drop","amt":"1000"}` |

`21,000` is the number of full-limit `1,000`-unit mints needed to exhaust the
planned supply. Smaller valid mints are still possible, so actual inscription
count can differ.

## 6. Scope

- Information appears only after the relevant event is confirmed.
- Do not treat an Ordinals or BRC-20 balance as an `op-drop` balance.
- An invalid event can be displayed for clarity, but it does not credit a
  balance.
- The BIP-110 READY badge does not promise relay, mining, or support by another
  service.

# OP_DROP

**A Bitcoin data carrier that pushes a payload and then drops it.**

Documentation site: <https://bitcoinuniverseio.github.io/op-drop/>

OP_DROP carries data inside a Taproot leaf script. The payload is pushed onto the
stack as an ordinary data push, and the very next opcode, `OP_DROP`, removes it
again. The bytes are committed to the blockchain and provable, but they never take
part in whether the spend succeeds. What is left at the end of the leaf is a public
key and a signature check, so the script spends exactly like a plain key path.

OP_DROP is one of the protocols Bitcoin Universe designed rather than adopted.

```text
PUSH <6269703131302d6f702d64726f70>      OP_DROP
PUSH "application/json"    OP_DROP
PUSH <sha256(payload)>     OP_DROP
PUSH <payload>             OP_DROP
PUSH <x-only public key>   OP_CHECKSIG
```

## At a glance

| | |
| --- | --- |
| Chain | Bitcoin: mainnet, testnet, signet, regtest |
| Lifecycle | Experimental |
| Specification version | 1.0.0 |
| Carrier marker (hex) | `6269703131302d6f702d64726f70` (script only, never a user-facing name) |
| Protocol identifier | `"p":"op-drop"` |
| Tapleaf version | `0xc0` |
| Maximum data push | 256 bytes |
| Operations | `deploy`, `mint`, `transfer` |
| Consensus change required | None |

## Two layers

OP_DROP is specified as two layers, and the difference matters.

- The **carrier** fixes the leaf script grammar, the Taproot commitment proof, and
  the 256-byte push bound. A leaf either parses or it does not.
- The **ledger** fixes what the carried JSON means: deploy, mint, transfer, supply
  accounting, and balances.

A leaf can be a perfectly valid carrier and still change no balance, because the
ledger applies a narrower profile on top. The published test vectors include a case
that passes one layer and fails the other.

## Start here

| You want to | Read |
| --- | --- |
| Understand the idea | [Overview](https://bitcoinuniverseio.github.io/op-drop/) |
| Implement an encoder, decoder, or indexer | [Specification](https://bitcoinuniverseio.github.io/op-drop/specification.html) |
| Know how it compares to OP_RETURN, envelopes, and Stamps | [Carrier comparison](https://bitcoinuniverseio.github.io/op-drop/carriers.html) |
| Deploy, mint, or transfer | [Guide](https://bitcoinuniverseio.github.io/op-drop/guide.html) |
| Run an indexer | [Reference](https://bitcoinuniverseio.github.io/op-drop/reference.html) |
| Check your implementation | [Test vectors](https://bitcoinuniverseio.github.io/op-drop/test-vectors.html) |
| Consume the read API | [API reference](https://bitcoinuniverseio.github.io/op-drop/api.html) |
| Decode a leaf script right now | [Builder and decoder](https://bitcoinuniverseio.github.io/op-drop/tool.html) |

The original markdown documents are preserved and remain accurate:
[event format](docs/protocols/op-drop-json.md),
[indexing rules](docs/indexing-rules.md),
[design rationale](docs/why-op-drop.md),
[getting started](docs/guides/getting-started.md),
[explorer and portfolio](docs/guides/op-drop-explorer.md).
The site pages supersede them for detail.

## The three payloads

```json
{"p":"op-drop","op":"deploy","tick":"drop","max":"21000000","lim":"1000"}
{"p":"op-drop","op":"mint","tick":"drop","amt":"1000"}
{"p":"op-drop","op":"transfer","tick":"drop","amt":"250"}
```

Compact UTF-8, string values only, fixed key order, no whitespace. A single space or
a reordered key produces a different and invalid event. Tickers are exactly four
lowercase ASCII letters or digits. There are no decimals.

## `$DROP`

`$DROP` is a display label for the wire ticker `drop`.

| Term | Value |
| --- | ---: |
| Maximum supply | 21,000,000 whole units |
| Limit per mint event | 1,000 |
| Full-limit mint count | 21,000 |
| Decimal places | none |

These are protocol terms. They are not a price, an availability promise, or evidence
that a deployment exists on any network. A deployment exists only after its exact
deploy event confirms and is accepted.

## Support

Support claimed anywhere in this repository is limited to what can be verified in
Bitcoin Universe's own source: the Inscribe workspace (deploy, mint, transfer), the
Core portfolio, a feature-gated Core explorer, and a feature-gated Core marketplace
in external-execution mode where selling is explicitly unsupported. The explorer and
marketplace gates both default to off, so assume a deployment does not have them
enabled unless you can see that it does.

Nothing outside Bitcoin Universe reads OP_DROP. No third-party wallet, explorer,
marketplace, miner, or indexer recognises an OP_DROP event.

## Scope and honesty

- OP_DROP requires no change to Bitcoin consensus.
- It is not an Ordinals inscription and not BRC-20. It borrows accounting ideas that
  BRC-20 popularised, and BRC-20 originated outside this organisation.
- No claim is made that any node will relay or mine an OP_DROP transaction.
- The [carrier comparison](https://bitcoinuniverseio.github.io/op-drop/carriers.html)
  lists nine places where OP_DROP is the worse choice.

## This repository

| Path | Contents |
| --- | --- |
| `index.html` and the other root pages | The documentation site, published by GitHub Pages from `main`. |
| `assets/` | Stylesheet, search, and the client-side builder and decoder. |
| `docs/` | The preserved markdown documents. |
| `scripts/validate-docs.ps1` | Markdown link and style validation. |
| `docs.manifest.json` | The manifest consumed by <https://docs.bitcoinuniverse.io>. |

The site is hand-authored static HTML and CSS with a small amount of vanilla
JavaScript. There is no build step, no framework, no CDN, no external font, and no
tracker. Every page is fully readable with JavaScript disabled.

### Local preview

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

### Validation

```powershell
pwsh scripts/validate-docs.ps1
```

## Contributing, support, security

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [SUPPORT.md](SUPPORT.md)
- [SECURITY.md](SECURITY.md): report vulnerabilities privately, never in a public issue.

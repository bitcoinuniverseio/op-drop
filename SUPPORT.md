# Support

## Answer your question first

Most questions are already answered on the documentation site.

| Question | Page |
| --- | --- |
| What is OP_DROP and how does it work? | <https://bitcoinuniverseio.github.io/op-drop/> |
| What are the exact rules? | [Specification](https://bitcoinuniverseio.github.io/op-drop/specification.html) |
| How does it compare to OP_RETURN, envelopes, or Stamps? | [Carrier comparison](https://bitcoinuniverseio.github.io/op-drop/carriers.html) |
| How do I deploy, mint, or transfer? | [Guide](https://bitcoinuniverseio.github.io/op-drop/guide.html) |
| Why did my event come back invalid? | [Invalid conditions](https://bitcoinuniverseio.github.io/op-drop/specification.html#invalid) |
| Why is my balance reserved and not available? | [State transitions](https://bitcoinuniverseio.github.io/op-drop/specification.html#ledger) |
| What does an OP_DROP transaction cost? | [Fee and size](https://bitcoinuniverseio.github.io/op-drop/reference.html#fees) |
| How do I check my implementation? | [Test vectors](https://bitcoinuniverseio.github.io/op-drop/test-vectors.html) |
| What does this leaf script contain? | [Builder and decoder](https://bitcoinuniverseio.github.io/op-drop/tool.html) |

The search box on any page, or the slash key, covers every heading on the site.

## Ask a question

Open an issue: <https://github.com/bitcoinuniverseio/op-drop/issues>

Useful issues include the payload or leaf script hex, the transaction id if there is
one, the network, what you expected, and what happened. Never include a private key,
a seed phrase, or a wallet file.

## Report a security problem

Privately, never in an issue. See [SECURITY.md](SECURITY.md).

## What this repository can help with

- The OP_DROP specification, its rules, and its test vectors.
- The documentation site and the client-side builder and decoder.
- Reconciling two implementations that disagree about the same transaction.

## What it cannot help with

- **Recovering funds or reversing a transaction.** A confirmed Bitcoin transaction
  cannot be undone by anyone, including us.
- **A fee that was spent on an event that turned out invalid.** That is how Bitcoin
  works, and the [guide](https://bitcoinuniverseio.github.io/op-drop/guide.html)
  explains when it happens.
- **Price, availability, listings, or trading.** This repository documents a protocol.
- **Third-party wallets, explorers, marketplaces, or indexers.** None of them support
  OP_DROP, and we cannot make them.
- **A Bitcoin Universe product account, order, or payment.** Use the support channel
  for that product.

## Never do this

No Bitcoin Universe person, document, tool, or page will ever ask for your seed
phrase or a private key. Anyone who does is trying to steal from you, whatever they
claim about support, verification, or recovery.

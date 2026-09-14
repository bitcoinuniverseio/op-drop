# Contributing

This repository holds the OP_DROP specification and its documentation site. Changes
here change what implementers believe is true, so accuracy matters more than volume.

## Before you open a pull request

1. **Ground every claim in code or in the chain.** If you cannot point at the source
   that makes a statement true, do not add the statement. "Probably" and "should"
   are not grounding.
2. **Do not claim support that is not wired.** Code existing somewhere is not the
   same as a released capability. When in doubt, write "not currently supported in
   Bitcoin Universe products" or leave it out.
3. **Attribute honestly.** BRC-20, Ordinals, and Bitcoin Stamps originated outside
   this organisation. Say so wherever they are mentioned.
4. **Keep the comparison fair.** The
   [carrier comparison](carriers.html) page states where OP_DROP is worse. Do not
   soften it, and add to it when you find a new limitation.

## Style rules

These are enforced, some by `scripts/validate-docs.ps1` and the rest by review.

- No em dash characters anywhere: content, code, comments, or commit messages. Use a
  comma, a colon, a period, or parentheses.
- When naming which version governs, write "authoritative", "owning", "official", or
  "the source of truth". Avoid the vaguer Latin synonym for those words.
- No filler, no unsupported superlatives, no urgency, no placeholder sections, no
  TODOs, no "coming soon".
- Plain, direct writing. Prefer a table or a diagram to a wall of text.
- British or American spelling is fine; be consistent within a page.

## Changing the specification

A change to `specification.html` is a change to the protocol contract.

- Every normative statement gets a rule identifier (`OD-x.y`). Do not renumber
  existing rules; add a new one.
- A change that makes a previously valid leaf invalid, a previously invalid leaf
  valid, or that changes a resulting balance, is a **major** version change. Say so
  explicitly in the pull request.
- Add or update a test vector for anything you change. A rule with no vector is a
  rule nobody will implement correctly.
- Update the [changelog](changelog.html) in the same pull request.
- Update `docs.manifest.json` `lastVerified` when you have re-verified the manifest
  against reality.

## Changing the site

The site is hand-authored static HTML and CSS with a little vanilla JavaScript.

- No build step, no framework, no bundler, no CDN, no external font, no tracker.
- Every page must be fully usable with JavaScript disabled. JavaScript may enhance
  search, the theme toggle, and the builder and decoder, and nothing else.
- Both themes must meet WCAG 2.2 AA contrast. Define colours as CSS custom properties
  so diagrams follow the theme.
- The page must not scroll horizontally at 320px wide. Wide tables and diagrams
  scroll inside their own container.
- Every diagram is inline SVG with a `<title>` and a `<desc>` that describe what the
  diagram shows, not what it looks like.
- Keep the budgets: under 50 KB of CSS and under 60 KB of JavaScript in total.
- Add new headings to `search-index.json`, `sitemap.xml`, and `llms.txt`.

## Changing the tool

`assets/builder.js` must stay byte-compatible with the reference encoder. If you
change it, verify that it still reproduces every leaf script hex on the test vectors
page exactly, and that every invalid vector still fails for the stated reason.

The tool must never make a network request, never store what a user pastes, and never
ask for a private key.

## Validation

```powershell
pwsh scripts/validate-docs.ps1
```

That checks markdown files for em dashes and broken relative links. Check HTML
changes by opening the affected pages, in both themes, at 320px and at desktop width,
and with JavaScript disabled.

## Security

Do not report a vulnerability in a pull request or an issue. See
[SECURITY.md](SECURITY.md).

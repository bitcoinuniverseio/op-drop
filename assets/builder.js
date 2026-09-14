/* OP_DROP leaf script builder and decoder.
   Runs entirely in your browser. Nothing you paste is sent anywhere, stored,
   or logged. Mirrors the grammar in bitcoinuniverseio/op-drop docs/protocols.
   Spec version 1.0.0. Network independent: the leaf script is the same bytes
   on mainnet, testnet, signet, and regtest. */
(function () {
  "use strict";

  /* ---------------- SHA-256 (synchronous, no Web Crypto dependency) -------- */

  var K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  function sha256(bytes) {
    var h = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
      0x1f83d9ab, 0x5be0cd19
    ];
    var len = bytes.length;
    var withPad = new Uint8Array((((len + 8) >> 6) + 1) * 64);
    withPad.set(bytes);
    withPad[len] = 0x80;
    var bitLen = len * 8;
    var dv = new DataView(withPad.buffer);
    dv.setUint32(withPad.length - 8, Math.floor(bitLen / 4294967296));
    dv.setUint32(withPad.length - 4, bitLen >>> 0);

    var w = new Int32Array(64);
    for (var off = 0; off < withPad.length; off += 64) {
      var i;
      for (i = 0; i < 16; i++) w[i] = dv.getInt32(off + i * 4);
      for (i = 16; i < 64; i++) {
        var g0 = w[i - 15],
          g1 = w[i - 2];
        var s0 = ((g0 >>> 7) | (g0 << 25)) ^ ((g0 >>> 18) | (g0 << 14)) ^ (g0 >>> 3);
        var s1 = ((g1 >>> 17) | (g1 << 15)) ^ ((g1 >>> 19) | (g1 << 13)) ^ (g1 >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var a = h[0], b = h[1], c = h[2], d = h[3];
      var e = h[4], f = h[5], g = h[6], hh = h[7];
      for (i = 0; i < 64; i++) {
        var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        var ch = (e & f) ^ (~e & g);
        var t1 = (hh + S1 + ch + K[i] + w[i]) | 0;
        var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) | 0;
        hh = g; g = f; f = e; e = (d + t1) | 0;
        d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0;
      h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0;
      h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0;
      h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
    }
    var out = new Uint8Array(32);
    var odv = new DataView(out.buffer);
    for (var j = 0; j < 8; j++) odv.setInt32(j * 4, h[j]);
    return out;
  }

  /* ---------------- byte helpers ---------------- */

  var HEXCHARS = "0123456789abcdef";

  function toHex(bytes) {
    var s = "";
    for (var i = 0; i < bytes.length; i++) {
      s += HEXCHARS[bytes[i] >> 4] + HEXCHARS[bytes[i] & 15];
    }
    return s;
  }

  function fromHex(text) {
    var clean = text.replace(/(0x)|[\s:,]/gi, "");
    if (!clean) throw new Error("Enter the leaf script as hex.");
    if (!/^[0-9a-fA-F]+$/.test(clean)) {
      throw new Error("The input contains characters that are not hexadecimal.");
    }
    if (clean.length % 2 !== 0) {
      throw new Error("Hex length is odd: a script is a whole number of bytes.");
    }
    var out = new Uint8Array(clean.length / 2);
    for (var i = 0; i < out.length; i++) {
      out[i] = parseInt(clean.substr(i * 2, 2), 16);
    }
    return out;
  }

  function utf8(text) {
    return new TextEncoder().encode(text);
  }

  function fromUtf8(bytes) {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  }

  function ascii(bytes) {
    var s = "";
    for (var i = 0; i < bytes.length; i++) {
      s += bytes[i] >= 32 && bytes[i] < 127 ? String.fromCharCode(bytes[i]) : ".";
    }
    return s;
  }

  function eq(a, b) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }

  /* ---------------- protocol constants ---------------- */

  var MARKER = fromHex("6269703131302d6f702d64726f70");
  var CONTENT_TYPE = "application/json";
  var MAX_PUSH = 256;
  var LEAF_VERSION = 0xc0;
  var OP_DROP = 0x75;
  var OP_CHECKSIG = 0xac;
  var UINT64_MAX = 18446744073709551615n;
  var UINT128_MAX = 340282366920938463463374607431768211455n;

  /* ---------------- push encoding ---------------- */

  function encodePush(data) {
    var n = data.length;
    var head;
    if (n === 0) {
      head = new Uint8Array([0x00]);
    } else if (n <= 75) {
      head = new Uint8Array([n]);
    } else if (n <= 255) {
      head = new Uint8Array([0x4c, n]);
    } else {
      head = new Uint8Array([0x4d, n & 0xff, (n >> 8) & 0xff]);
    }
    var out = new Uint8Array(head.length + n);
    out.set(head, 0);
    out.set(data, head.length);
    return out;
  }

  function concat(list) {
    var total = 0, i;
    for (i = 0; i < list.length; i++) total += list[i].length;
    var out = new Uint8Array(total);
    var at = 0;
    for (i = 0; i < list.length; i++) {
      out.set(list[i], at);
      at += list[i].length;
    }
    return out;
  }

  /* Decompile with strict minimal-push checking, the same rule the indexer
     enforces by rebuilding and comparing the whole script. */
  function decompile(script) {
    var ops = [];
    var i = 0;
    while (i < script.length) {
      var op = script[i];
      var start = i;
      if (op > 0x4e || (op > 0 && op < 0x4c)) {
        // direct push, OP_0, or an opcode above OP_PUSHDATA4
        if (op > 0 && op < 0x4c) {
          var n = op;
          if (i + 1 + n > script.length) throw new Error("Truncated data push at byte " + start + ".");
          ops.push({ type: "push", data: script.subarray(i + 1, i + 1 + n), at: start, enc: "direct" });
          i += 1 + n;
          continue;
        }
        ops.push({ type: "op", code: op, at: start });
        i += 1;
        continue;
      }
      if (op === 0x00) {
        ops.push({ type: "push", data: new Uint8Array(0), at: start, enc: "OP_0" });
        i += 1;
        continue;
      }
      if (op === 0x4c) {
        if (i + 2 > script.length) throw new Error("Truncated OP_PUSHDATA1 at byte " + start + ".");
        var n1 = script[i + 1];
        if (i + 2 + n1 > script.length) throw new Error("Truncated OP_PUSHDATA1 payload at byte " + start + ".");
        ops.push({ type: "push", data: script.subarray(i + 2, i + 2 + n1), at: start, enc: "OP_PUSHDATA1" });
        i += 2 + n1;
        continue;
      }
      if (op === 0x4d) {
        if (i + 3 > script.length) throw new Error("Truncated OP_PUSHDATA2 at byte " + start + ".");
        var n2 = script[i + 1] | (script[i + 2] << 8);
        if (i + 3 + n2 > script.length) throw new Error("Truncated OP_PUSHDATA2 payload at byte " + start + ".");
        ops.push({ type: "push", data: script.subarray(i + 3, i + 3 + n2), at: start, enc: "OP_PUSHDATA2" });
        i += 3 + n2;
        continue;
      }
      // 0x4e OP_PUSHDATA4
      if (i + 5 > script.length) throw new Error("Truncated OP_PUSHDATA4 at byte " + start + ".");
      var n4 =
        script[i + 1] |
        (script[i + 2] << 8) |
        (script[i + 3] << 16) |
        (script[i + 4] * 16777216);
      if (i + 5 + n4 > script.length) throw new Error("Truncated OP_PUSHDATA4 payload at byte " + start + ".");
      ops.push({ type: "push", data: script.subarray(i + 5, i + 5 + n4), at: start, enc: "OP_PUSHDATA4" });
      i += 5 + n4;
    }
    return ops;
  }

  var OPNAMES = { 0x75: "OP_DROP", 0xac: "OP_CHECKSIG", 0x76: "OP_DUP", 0x63: "OP_IF", 0x6a: "OP_RETURN" };

  function opName(code) {
    return OPNAMES[code] || "opcode 0x" + code.toString(16).padStart(2, "0");
  }

  /* ---------------- payload validation ---------------- */

  function validatePayloadJson(json) {
    var bytes = utf8(json);
    if (bytes.length > MAX_PUSH) {
      throw new Error("Payload is " + bytes.length + " bytes; one data push is limited to " + MAX_PUSH + ".");
    }
    var parsed;
    try {
      parsed = JSON.parse(json);
    } catch (e) {
      throw new Error("Payload is not parseable JSON.");
    }
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Payload must be a JSON object.");
    }
    if (parsed.p !== "op-drop") {
      throw new Error('Field "p" must be exactly "op-drop".');
    }
    if ("v" in parsed) {
      throw new Error('A version field ("v") is not permitted.');
    }
    var op = parsed.op;
    if (op !== "deploy" && op !== "mint" && op !== "transfer") {
      throw new Error('Field "op" must be deploy, mint, or transfer.');
    }
    if (typeof parsed.tick !== "string" || !/^[a-z0-9]{4}$/.test(parsed.tick)) {
      throw new Error('Field "tick" must be exactly four lowercase ASCII letters or digits.');
    }
    var keys = Object.keys(parsed);
    var expected;
    if (op === "deploy") {
      expected = "self_mint" in parsed
        ? ["p", "op", "tick", "max", "lim", "self_mint"]
        : ["p", "op", "tick", "max", "lim"];
    } else {
      expected = ["p", "op", "tick", "amt"];
    }
    if (keys.length !== expected.length || keys.some(function (k, i) { return k !== expected[i]; })) {
      throw new Error("Keys must be exactly, and in this order: " + expected.join(", ") + ".");
    }
    function decimal(value, field, max) {
      if (typeof value !== "string" || !/^[1-9][0-9]*$/.test(value)) {
        throw new Error('Field "' + field + '" must be a positive base-10 integer string with no sign, fraction, exponent, or leading zero.');
      }
      if (BigInt(value) > max) {
        throw new Error('Field "' + field + '" exceeds the supported integer range.');
      }
      return BigInt(value);
    }
    var notes = [];
    if (op === "deploy") {
      var max = decimal(parsed.max, "max", UINT64_MAX);
      var lim = decimal(parsed.lim, "lim", UINT128_MAX);
      if (lim > max) throw new Error('Field "lim" must not exceed "max".');
      if ("self_mint" in parsed) {
        if (parsed.self_mint !== "true") {
          throw new Error('Field "self_mint" must be the string "true" when present.');
        }
        notes.push(
          'The carrier accepts self_mint, but the OP_DROP ledger profile rejects it: the event would be recorded invalid with reason unsupported_self_mint.'
        );
      }
    } else {
      decimal(parsed.amt, "amt", UINT128_MAX);
    }
    if (JSON.stringify(parsed) !== json) {
      throw new Error(
        "Payload is not the required compact serialization. Remove whitespace and keep the exact key order and string values."
      );
    }
    return { payload: parsed, bytes: bytes, notes: notes };
  }

  /* ---------------- build ---------------- */

  function buildLeaf(json, pubkeyBytes) {
    var checked = validatePayloadJson(json);
    var content = checked.bytes;
    var hash = sha256(content);
    var parts = [
      encodePush(MARKER),
      new Uint8Array([OP_DROP]),
      encodePush(utf8(CONTENT_TYPE)),
      new Uint8Array([OP_DROP]),
      encodePush(hash),
      new Uint8Array([OP_DROP]),
      encodePush(content),
      new Uint8Array([OP_DROP]),
      encodePush(pubkeyBytes),
      new Uint8Array([OP_CHECKSIG])
    ];
    var script = concat(parts);
    return {
      script: script,
      json: json,
      payload: checked.payload,
      content: content,
      hash: hash,
      notes: checked.notes
    };
  }

  /* ---------------- decode ---------------- */

  function decodeLeaf(script) {
    var ops = decompile(script);
    var findings = [];
    if (ops.length < 10) {
      throw new Error(
        "A leaf needs at least 10 script elements (5 pushes each followed by OP_DROP or OP_CHECKSIG). This script has " + ops.length + "."
      );
    }
    var slots = ["marker", "content type", "payload digest", "JSON payload", "x-only public key"];
    var expectOps = [OP_DROP, OP_DROP, OP_DROP, OP_DROP, OP_CHECKSIG];
    var fields = [];
    for (var i = 0; i < 5; i++) {
      var push = ops[i * 2];
      var opc = ops[i * 2 + 1];
      if (push.type !== "push") {
        throw new Error("Element " + (i * 2 + 1) + " must be a data push for the " + slots[i] + ", found " + opName(push.code) + ".");
      }
      if (opc.type !== "op" || opc.code !== expectOps[i]) {
        throw new Error(
          "Element " + (i * 2 + 2) + " must be " + opName(expectOps[i]) + " after the " + slots[i] + ", found " +
          (opc.type === "push" ? "a data push" : opName(opc.code)) + "."
        );
      }
      if (push.data.length > MAX_PUSH) {
        throw new Error("The " + slots[i] + " push is " + push.data.length + " bytes; the limit is " + MAX_PUSH + ".");
      }
      fields.push(push);
    }
    if (!eq(fields[0].data, MARKER)) {
      throw new Error("Unknown carrier marker. Expected hex " + toHex(MARKER) + ".");
    }
    if (!eq(fields[1].data, utf8(CONTENT_TYPE))) {
      throw new Error('Content type must be "' + CONTENT_TYPE + '", found "' + ascii(fields[1].data) + '".');
    }
    if (fields[2].data.length !== 32) {
      throw new Error("The payload digest field must be 32 bytes, found " + fields[2].data.length + ".");
    }
    if (fields[4].data.length !== 32) {
      throw new Error("The x-only public key must be 32 bytes, found " + fields[4].data.length + ".");
    }
    var json;
    try {
      json = fromUtf8(fields[3].data);
    } catch (e) {
      throw new Error("The JSON payload push is not valid UTF-8.");
    }
    var checked = validatePayloadJson(json);
    var actual = sha256(fields[3].data);
    if (!eq(actual, fields[2].data)) {
      throw new Error(
        "The digest field does not match the payload. Field: " + toHex(fields[2].data) + ". Actual sha256: " + toHex(actual) + "."
      );
    }
    var rebuilt = buildLeaf(json, fields[4].data).script;
    var extra = ops.length > 10;
    if (!extra && !eq(rebuilt, script)) {
      throw new Error(
        "The script uses non-minimal push encoding. Rebuilt from the same fields, the leaf is " + toHex(rebuilt) + "."
      );
    }
    if (extra) {
      findings.push(
        "This leaf carries " + (ops.length - 10) + " extra script elements after OP_CHECKSIG. The OP_DROP token grammar allows an appended drops-media image attachment there; this tool decodes the token fields only and does not validate the attachment."
      );
    }
    if (script.length > 0 && ops[9] && ops[9].code === OP_CHECKSIG) {
      findings.push("Every field is removed from the stack by OP_DROP. Only the OP_CHECKSIG result survives, so the leaf spends as a plain signature check.");
    }
    return {
      ops: ops,
      fields: fields,
      json: json,
      payload: checked.payload,
      digest: fields[2].data,
      pubkey: fields[4].data,
      findings: findings.concat(checked.notes),
      script: script
    };
  }

  /* ---------------- stack trace ---------------- */

  function shortHex(bytes, keep) {
    var hex = toHex(bytes);
    if (hex.length <= keep * 2) return hex;
    return hex.slice(0, keep) + "…" + hex.slice(-6);
  }

  function stackTrace(ops) {
    var stack = ["<signature from witness>"];
    var steps = [{ op: "(witness item 1 already on the stack)", stack: stack.slice(), kind: "init" }];
    for (var i = 0; i < ops.length; i++) {
      var o = ops[i];
      if (o.type === "push") {
        var label;
        if (i === 0) label = 'PUSH "' + ascii(o.data) + '"';
        else if (i === 2) label = 'PUSH "' + ascii(o.data) + '"';
        else if (i === 4) label = "PUSH " + shortHex(o.data, 12) + " (sha256)";
        else if (i === 6) label = "PUSH " + o.data.length + "-byte JSON payload";
        else if (i === 8) label = "PUSH " + shortHex(o.data, 12) + " (x-only key)";
        else label = "PUSH " + o.data.length + " bytes";
        stack = stack.concat([i === 6 ? "<payload>" : i === 8 ? "<pubkey>" : "<" + o.data.length + "B>"]);
        steps.push({ op: label, stack: stack.slice(), kind: "push" });
      } else if (o.code === OP_DROP) {
        stack = stack.slice(0, -1);
        steps.push({ op: "OP_DROP", stack: stack.slice(), kind: "drop" });
      } else if (o.code === OP_CHECKSIG) {
        stack = stack.slice(0, -2).concat(["<true>"]);
        steps.push({ op: "OP_CHECKSIG", stack: stack.slice(), kind: "check" });
      } else {
        steps.push({ op: opName(o.code), stack: stack.slice(), kind: "other" });
        break;
      }
      if (i === 9) break;
    }
    return steps;
  }

  /* ---------------- size and fee ---------------- */

  function varIntLen(n) {
    if (n < 0xfd) return 1;
    if (n <= 0xffff) return 3;
    if (n <= 0xffffffff) return 5;
    return 9;
  }

  /* Reveal transaction estimate: one P2TR script-path input, one P2TR output. */
  function revealSize(scriptLen) {
    var base = 4 + 1 + 36 + 1 + 4 + 1 + (8 + 1 + 34) + 4; // 94
    var witness =
      1 + // stack item count
      (1 + 64) + // Schnorr signature
      (varIntLen(scriptLen) + scriptLen) + // leaf script
      (1 + 33); // control block
    var weight = base * 4 + 2 + witness;
    return {
      base: base,
      witness: witness,
      weight: weight,
      vsize: Math.ceil(weight / 4)
    };
  }

  /* ---------------- DOM wiring ---------------- */

  function el(id) {
    return document.getElementById(id);
  }

  function verdict(node, kind, html) {
    node.className = "verdict " + kind;
    node.innerHTML = html;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function renderStack(container, steps) {
    var html = "";
    for (var i = 0; i < steps.length; i++) {
      var s = steps[i];
      html +=
        '<div class="stackstep' + (s.kind === "drop" ? " drop" : "") + '">' +
        '<span class="n">' + i + "</span>" +
        '<span class="op">' + esc(s.op) + "</span>" +
        '<span class="st">' + (s.stack.length ? esc(s.stack.join("  |  ")) : "(empty)") + "</span>" +
        "</div>";
    }
    container.innerHTML = html;
  }

  function feeTable(size) {
    var rates = [1, 5, 15, 40];
    var rows = rates
      .map(function (r) {
        return "<tr><td class=\"num\">" + r + "</td><td class=\"num\">" + (r * size.vsize).toLocaleString("en-US") + "</td></tr>";
      })
      .join("");
    return (
      '<div class="tablewrap"><table><caption>Reveal transaction estimate: ' +
      size.vsize +
      " vB, " +
      size.weight +
      " weight units (" +
      size.base +
      " base bytes, " +
      size.witness +
      " witness bytes)</caption><thead><tr><th>Fee rate (sat/vB)</th><th>Reveal fee (sat)</th></tr></thead><tbody>" +
      rows +
      "</tbody></table></div>"
    );
  }

  /* ---- decoder ---- */

  var decodeBtn = el("decode-run");
  if (decodeBtn) {
    var decIn = el("decode-input");
    var decOut = el("decode-verdict");
    var decDetail = el("decode-detail");
    var decStack = el("decode-stack");

    function runDecode() {
      decDetail.innerHTML = "";
      decStack.innerHTML = "";
      var script;
      try {
        script = fromHex(decIn.value);
      } catch (e) {
        verdict(decOut, "no", "<strong>Not decodable.</strong> " + esc(e.message));
        return;
      }
      var result;
      try {
        result = decodeLeaf(script);
      } catch (e) {
        verdict(
          decOut,
          "no",
          "<strong>Not a valid OP_DROP leaf.</strong> " + esc(e.message) +
            " An indexer records nothing for this script and no balance changes."
        );
        try {
          var ops = decompile(script);
          renderStack(decStack, stackTrace(ops));
        } catch (e2) {
          /* undecodable script: no trace to show */
        }
        return;
      }
      var p = result.payload;
      verdict(
        decOut,
        "ok",
        "<strong>Valid OP_DROP leaf.</strong> Operation <code>" + esc(p.op) +
          "</code> on ticker <code>" + esc(p.tick) + "</code>. The " + result.fields[3].data.length +
          "-byte JSON payload is pushed, then removed from the stack by OP_DROP."
      );
      var size = revealSize(script.length);
      var rows = [
        ["Marker", '"' + ascii(result.fields[0].data) + '"', result.fields[0].data.length + " B"],
        ["Content type", '"' + ascii(result.fields[1].data) + '"', result.fields[1].data.length + " B"],
        ["Payload digest", toHex(result.digest), "32 B"],
        ["JSON payload", result.json, result.fields[3].data.length + " B"],
        ["x-only public key", toHex(result.pubkey), "32 B"]
      ];
      var html =
        '<div class="tablewrap"><table><caption>Decoded leaf fields</caption><thead><tr><th>Field</th><th>Value</th><th>Size</th></tr></thead><tbody>' +
        rows
          .map(function (r) {
            return "<tr><td>" + esc(r[0]) + '</td><td class="out">' + esc(r[1]) + "</td><td>" + r[2] + "</td></tr>";
          })
          .join("") +
        "</tbody></table></div>";
      html +=
        '<div class="tablewrap"><table><caption>Payload fields</caption><thead><tr><th>Key</th><th>Value</th></tr></thead><tbody>' +
        Object.keys(p)
          .map(function (k) {
            return "<tr><td><code>" + esc(k) + '</code></td><td class="out">' + esc(p[k]) + "</td></tr>";
          })
          .join("") +
        "</tbody></table></div>";
      html += feeTable(size);
      if (result.findings.length) {
        html +=
          '<div class="note"><p class="label">Notes</p><ul><li>' +
          result.findings.map(esc).join("</li><li>") +
          "</li></ul></div>";
      }
      html +=
        '<div class="note warn"><p>This tool checks the leaf script only. A leaf is indexed only when the spending input also proves it with a 33-byte control block committing to the spent P2TR output, and the ledger rules then decide whether balances change.</p></div>';
      decDetail.innerHTML = html;
      renderStack(decStack, stackTrace(result.ops));
    }

    decodeBtn.addEventListener("click", runDecode);
    var sample = el("decode-sample");
    if (sample) {
      sample.addEventListener("click", function () {
        decIn.value = sample.getAttribute("data-script");
        runDecode();
      });
    }
    var clear = el("decode-clear");
    if (clear) {
      clear.addEventListener("click", function () {
        decIn.value = "";
        decDetail.innerHTML = "";
        decStack.innerHTML = "";
        verdict(decOut, "idle", "Paste a leaf script hex and select Decode.");
        decIn.focus();
      });
    }
  }

  /* ---- builder ---- */

  var buildBtn = el("build-run");
  if (buildBtn) {
    var bOp = el("build-op");
    var bTick = el("build-tick");
    var bAmt = el("build-amt");
    var bMax = el("build-max");
    var bLim = el("build-lim");
    var bKey = el("build-key");
    var bOut = el("build-verdict");
    var bDetail = el("build-detail");
    var bStack = el("build-stack");
    var amtField = el("field-amt");
    var maxField = el("field-max");
    var limField = el("field-lim");

    function syncFields() {
      var deploy = bOp.value === "deploy";
      amtField.hidden = deploy;
      maxField.hidden = !deploy;
      limField.hidden = !deploy;
    }
    bOp.addEventListener("change", syncFields);
    syncFields();

    buildBtn.addEventListener("click", function () {
      bDetail.innerHTML = "";
      bStack.innerHTML = "";
      var json;
      var op = bOp.value;
      var tick = bTick.value.trim().toLowerCase();
      if (op === "deploy") {
        json = JSON.stringify({
          p: "op-drop",
          op: "deploy",
          tick: tick,
          max: bMax.value.trim(),
          lim: bLim.value.trim()
        });
      } else {
        json = JSON.stringify({ p: "op-drop", op: op, tick: tick, amt: bAmt.value.trim() });
      }
      var key;
      try {
        key = fromHex(bKey.value);
        if (key.length !== 32) {
          throw new Error("The x-only public key must be exactly 32 bytes (64 hex characters), found " + key.length + ".");
        }
      } catch (e) {
        verdict(bOut, "no", "<strong>Cannot build.</strong> " + esc(e.message));
        return;
      }
      var built;
      try {
        built = buildLeaf(json, key);
      } catch (e) {
        verdict(bOut, "no", "<strong>Cannot build.</strong> " + esc(e.message));
        return;
      }
      var size = revealSize(built.script.length);
      verdict(
        bOut,
        "ok",
        "<strong>Leaf built.</strong> " + built.script.length + " script bytes carrying a " +
          built.content.length + "-byte payload. Commit this leaf in a P2TR output, then reveal it by spending that output."
      );
      bDetail.innerHTML =
        '<div class="tablewrap"><table><caption>Build output</caption><tbody>' +
        [
          ["Payload JSON", built.json],
          ["Payload bytes", built.content.length + " (limit " + MAX_PUSH + ")"],
          ["Payload sha256", toHex(built.hash)],
          ["Leaf script hex", toHex(built.script)],
          ["Leaf script bytes", String(built.script.length)],
          ["Leaf script sha256", toHex(sha256(built.script))],
          ["Tapleaf version", "0xc0"]
        ]
          .map(function (r) {
            return "<tr><th>" + esc(r[0]) + '</th><td class="out">' + esc(r[1]) + "</td></tr>";
          })
          .join("") +
        "</tbody></table></div>" +
        feeTable(size) +
        (built.notes.length
          ? '<div class="note warn"><p>' + built.notes.map(esc).join("</p><p>") + "</p></div>"
          : "") +
        '<div class="note"><p>The fee figure covers the reveal transaction only, assuming one script-path input and one P2TR output. A real order also pays for the commit transaction that funds the P2TR address, and for any additional outputs your wallet adds.</p></div>';
      renderStack(bStack, stackTrace(decompile(built.script)));
    });
  }
})();

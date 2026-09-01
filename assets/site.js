/* OP_DROP docs site: theme toggle and local search.
   No network calls except the same-origin search index. Nothing is logged. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------------- theme ---------------- */

  var KEY = "op-drop-theme";
  var root = document.documentElement;

  function stored() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function apply(mode) {
    if (mode === "light" || mode === "dark") {
      root.setAttribute("data-theme", mode);
    } else {
      root.removeAttribute("data-theme");
    }
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    var effective =
      mode ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    btn.setAttribute("aria-pressed", effective === "dark" ? "true" : "false");
    btn.querySelector(".theme-label").textContent =
      effective === "dark" ? "Dark" : "Light";
  }

  apply(stored());

  document.addEventListener("click", function (ev) {
    var btn = ev.target.closest && ev.target.closest("#theme-toggle");
    if (!btn) return;
    var now = root.getAttribute("data-theme");
    if (!now) {
      now =
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    }
    var next = now === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {
      /* private mode: theme still applies for this page view */
    }
    apply(next);
  });

  /* ---------------- search ---------------- */

  var input = document.getElementById("search-input");
  var panel = document.getElementById("search-results");
  if (!input || !panel) return;

  var index = null;
  var loading = false;
  var base = input.getAttribute("data-base") || "";

  function load() {
    if (index || loading) return;
    loading = true;
    fetch(base + "search-index.json", { credentials: "omit" })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (data) {
        index = data && data.entries ? data.entries : [];
        if (input.value.trim()) run(input.value);
      })
      .catch(function () {
        index = [];
        render(null, "Search index could not be loaded. Use the page links instead.");
      });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function score(entry, terms) {
    var hay = (
      entry.heading +
      " " +
      entry.page +
      " " +
      entry.text +
      " " +
      (entry.aliases || []).join(" ")
    ).toLowerCase();
    var head = (entry.heading + " " + (entry.aliases || []).join(" ")).toLowerCase();
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      if (hay.indexOf(t) === -1) return 0;
      total += 1;
      if (head.indexOf(t) !== -1) total += 3;
      if (head.indexOf(t) === 0) total += 2;
    }
    return total;
  }

  function render(list, emptyMessage) {
    if (!list || !list.length) {
      panel.innerHTML =
        '<p class="r-empty">' +
        escapeHtml(
          emptyMessage ||
            "No match. Try a rule id (OD-3.2), an opcode (OP_DROP), a field (tick, amt), or a term like anchor, reorg, or witness."
        ) +
        "</p>";
      panel.hidden = false;
      return;
    }
    var html = "<ul>";
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      html +=
        '<li><a href="' +
        escapeHtml(base + e.url) +
        '"><span class="r-page">' +
        escapeHtml(e.page) +
        '</span><span class="r-head">' +
        escapeHtml(e.heading) +
        '</span><span class="r-snip">' +
        escapeHtml(e.text.slice(0, 145)) +
        "</span></a></li>";
    }
    panel.innerHTML = html + "</ul>";
    panel.hidden = false;
  }

  function run(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) {
      panel.hidden = true;
      return;
    }
    if (!index) {
      load();
      return;
    }
    var hits = [];
    for (var i = 0; i < index.length; i++) {
      var s = score(index[i], terms);
      if (s > 0) hits.push({ s: s, e: index[i] });
    }
    hits.sort(function (a, b) {
      return b.s - a.s;
    });
    render(
      hits.slice(0, 12).map(function (h) {
        return h.e;
      })
    );
  }

  input.addEventListener("focus", load);
  input.addEventListener("input", function () {
    run(input.value);
  });
  input.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") {
      panel.hidden = true;
      input.blur();
    }
    if (ev.key === "ArrowDown") {
      var first = panel.querySelector("a");
      if (first) {
        ev.preventDefault();
        first.focus();
      }
    }
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "/" || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    ev.preventDefault();
    input.focus();
    input.select();
  });

  document.addEventListener("click", function (ev) {
    if (!panel.contains(ev.target) && ev.target !== input) panel.hidden = true;
  });
})();

// Segment-fit page capture. Run this whole file as one expression in the browser tab
// (agent-browser eval, Playwright evaluate, DevTools evaluate_script). It returns a JSON string:
// save it as one capture file. Read-only: it changes nothing on the page.
//
// Optional: set window.SEGMENT_FIT_OPTIONS = { heroSelector: "#hero" } first when the page's hero
// is not everything above the first H2 after the H1. Report the selector you used.
(function (opts) {
  const MAX_BLOCKS = 1500;
  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "IFRAME", "CANVAS", "OBJECT", "SELECT", "OPTION", "TEXTAREA", "HEAD", "svg", "SVG", "math"]);
  const BUTTONISH = /(^|[\s_-])(btn|button|cta)([\s_-]|$)/i;
  const CTA_WORDS = /^(get started|start|try|sign up|signup|book|request|schedule|get a demo|get demo|contact sales|talk to|buy|shop|order|subscribe|join|download|see pricing|view pricing|see plans|start free|get|create|claim|apply)\b/i;
  const NOT_A_CTA = /^(menu|open menu|close|close menu|toggle|search|previous|next|prev|skip|×|x|play|pause|back|more|less|log ?in|log ?out|sign ?in|my account|account|view more|see more|accept|accept all|decline|reject|got it|ok|okay)$/i;
  const clean = (s) => s.replace(/\s+/g, " ").replace(/\s+([,.;:!?%)\]}”’])/g, "$1").replace(/([([{“‘])\s+/g, "$1").trim();
  const words = (s) => (s.match(/\S+/g) || []).length;
  const key = (s) => s.toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, "").replace(/\s+/g, " ").trim();

  const h1 = [...document.querySelectorAll("h1")].find((el) => visible(el) && !el.closest("nav,footer,[role=navigation],[role=contentinfo]"));
  const heroRoot = opts.heroSelector ? document.querySelector(opts.heroSelector) : null;
  if (opts.heroSelector && !heroRoot) throw new Error("heroSelector matched nothing: " + opts.heroSelector);

  function visible(el) {
    if (!el.isConnected) return false;
    if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  }

  // Site navigation, the page footer and overlays are not the page's own copy. A <header> or <footer> inside
  // main, article, section or aside belongs to that component (a demo card), and a header that holds the H1 is the hero.
  const SECTIONING = "main,article,section,aside";
  const landmark = (el, sel) => {
    const found = el.closest(sel);
    return found && !(found.parentElement && found.parentElement.closest(SECTIONING)) ? found : null;
  };
  function zoneOf(el) {
    if (el.closest("nav,[role=navigation]")) return "nav";
    if (el.closest("[role=contentinfo]") || landmark(el, "footer")) return "footer";
    if (el.closest("dialog,[role=dialog],[aria-modal=true]")) return "overlay";
    const header = el.closest("[role=banner]") || landmark(el, "header");
    if (header && !(h1 && header.contains(h1))) return "header";
    return "main";
  }

  function blockAncestor(el) {
    let cur = el;
    while (cur && cur !== document.body) {
      const d = getComputedStyle(cur).display;
      if (d !== "inline" && d !== "contents") return cur;
      cur = cur.parentElement;
    }
    return document.body;
  }

  function kindOf(el, text) {
    if (el.closest("h1,h2,h3,h4,h5,h6,[role=heading]")) return "heading";
    if (el.closest("blockquote,q")) return "quote";
    if (el.closest("details,summary,dt,dd")) return "faq";
    const btn = el.closest("button,[role=button],a[href],input[type=submit]");
    if (btn && btn.getAttribute("role") !== "tab" && text.length <= 60 && !NOT_A_CTA.test(text)) {
      const tag = btn.tagName;
      if (tag === "BUTTON" || tag === "INPUT" || btn.getAttribute("role") === "button" || btn.hasAttribute("data-cta") || BUTTONISH.test(btn.className || "") || CTA_WORDS.test(text) || looksLikeButton(btn, text)) return "cta";
    }
    return "copy";
  }

  // A link styled as a button (utility-class sites): padded on both axes, with a fill or a border, and nothing but
  // its own short label inside, so cards and logo tiles that wrap a block of content don't count.
  function looksLikeButton(el, text) {
    if (clean(el.innerText || "") !== text || text.length > 40 || words(text) > 7) return false;
    if ([...el.querySelectorAll("*")].some((c) => !["inline", "inline-block", "contents", "none"].includes(getComputedStyle(c).display) && c.tagName !== "svg" && !c.closest("svg"))) return false;
    if (el.querySelector("img")) return false;
    const cs = getComputedStyle(el);
    const px = (v) => parseFloat(v) || 0;
    const padded = px(cs.paddingTop) + px(cs.paddingBottom) >= 8 && px(cs.paddingLeft) + px(cs.paddingRight) >= 16;
    const filled = cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent";
    const bordered = px(cs.borderTopWidth) > 0 && px(cs.borderBottomWidth) > 0 && px(cs.borderLeftWidth) > 0;
    const shaped = cs.display !== "inline" || cs.backgroundImage !== "none";
    return padded && shaped && (filled || bordered || cs.backgroundImage !== "none");
  }

  // Walk text nodes in document order and join the ones that share a block-level parent into one line.
  const lines = [];
  let current = null;
  let lastParent = null;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.data.trim()) return NodeFilter.FILTER_REJECT;
      for (let p = node.parentElement; p && p !== document.body; p = p.parentElement) {
        if (SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
      }
      return visible(node.parentElement) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const el = blockAncestor(node.parentElement);
    if (!current || current.el !== el) {
      current = { el, first: node.parentElement, parts: [] };
      lines.push(current);
      lastParent = null;
    }
    current.parts.push(lastParent && lastParent !== node.parentElement ? " " + node.data : node.data);
    lastParent = node.parentElement;
  }

  // Sections start at each H2 in the page body, including screen-reader-only ones (they still mark a section),
  // but not ones hidden with display or visibility. Smaller headings inside a demo or mockup don't start one.
  const rendered = (el) => !el.checkVisibility || el.checkVisibility({ visibilityProperty: true });
  const h2s = [...document.querySelectorAll("h2,[role=heading][aria-level='2']")].filter(
    (el) => rendered(el) && zoneOf(el) === "main" && (!h1 || h1.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING),
  );
  const after = (heading, el) => heading.contains(el) || (heading.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
  const sectionOf = (el) => h2s.filter((h) => after(h, el)).length;
  // Hero: inside heroSelector, or everything in the main zone before the first section H2.
  const inHero = (el) => (heroRoot ? heroRoot.contains(el) : sectionOf(el) === 0);

  const blocks = [];
  const seen = new Set();
  for (const line of lines) {
    const text = clean(line.parts.join(""));
    if (!/\p{L}/u.test(text) || text.length < 2) continue;
    const el = line.first;
    const zone = zoneOf(el);
    const k = zone + "|" + key(text);
    if (seen.has(k)) continue; // responsive layouts render the same line twice; count it once per zone
    seen.add(k);
    const kind = kindOf(el, text);
    const heading = el.closest("h1,h2,h3,h4,h5,h6");
    const section = zone !== "main" || (heroRoot && heroRoot.contains(el)) ? 0 : sectionOf(el);
    const link = el.closest("a[href]");
    blocks.push({
      n: blocks.length + 1,
      kind,
      text,
      words: words(text),
      zone,
      heroUi: zone === "main" && inHero(el),
      heroText: false,
      section,
      sectionTitle: section === 0 ? "Hero" : clean(h2s[section - 1].textContent).slice(0, 80),
      href: link ? link.href : null,
      inH1: Boolean(h1 && h1.contains(el)),
    });
    if (blocks.length >= MAX_BLOCKS) break;
  }

  // Text hero, as the free scanner reads it: the H1, then the blocks after it up to the next heading, at most 6.
  const main = blocks.filter((b) => b.zone === "main");
  const start = Math.max(0, main.findIndex((b) => b.inH1));
  for (let i = start; i < Math.min(main.length, start + 6); i++) {
    if (i > start && main[i].kind === "heading" && !main[i].inH1) break;
    main[i].heroText = true;
  }

  const ctaOf = (b) => b && { n: b.n, text: b.text, href: b.href };
  // Main button: the first hero button after the H1 (a pill above the headline is an announcement), then any hero
  // button, then the first one in the header.
  const h1At = main.findIndex((b) => b.inH1);
  const heroCtas = main.filter((b) => b.heroUi && b.kind === "cta");
  const mainCta = ctaOf(heroCtas.find((b) => main.indexOf(b) > h1At) || heroCtas[0]) || ctaOf(blocks.find((b) => b.zone === "header" && b.kind === "cta")) || null;

  const links = [];
  const seenLinks = new Set();
  for (const a of document.querySelectorAll("a[href]")) {
    if (!visible(a)) continue;
    const label = clean(a.innerText || a.getAttribute("aria-label") || "");
    if (!label || seenLinks.has(label + "|" + a.href)) continue;
    seenLinks.add(label + "|" + a.href);
    const zone = zoneOf(a);
    links.push({ label, href: a.href, zone: zone === "main" && inHero(a) ? "hero" : zone });
  }

  return JSON.stringify({
    url: location.href,
    title: document.title,
    h1: h1 ? clean(h1.innerText) : null,
    heroMode: heroRoot ? "selector:" + opts.heroSelector : "above-first-h2",
    viewport: { width: innerWidth, height: innerHeight },
    capturedAt: new Date().toISOString(),
    mainCta,
    blocks,
    links,
  });
})(window.SEGMENT_FIT_OPTIONS || {});

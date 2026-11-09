# Segment fit

Segment fit scores how much of one page speaks to each audience, on the version of the page that audience sees. It turns "is this page personalized enough?" into a number per segment, a list of the sections and components that lose the points, and a before and after once the gaps are closed.

It uses the same rubric as RightMessage's free personalization check (rightmessage.com/personalize), with three changes for a page you can personalize: the audiences are the project's own segments, each version is rendered in a real browser, and every call to action is checked against what each segment can actually get.

This file is the whole method. The two scripts in this skill's `scripts/` folder do the extraction and the arithmetic: `extract-blocks.js` (runs in the browser tab) and `segment-fit.mjs` (runs with Node 18 or later, no installs). Below, `<skill-dir>` is the folder this skill is installed in. Keep each run's files (`run.json`, captures, labels, reports) in a private working folder, such as next to the audit notes, never inside the skill folder or a repository.

## Rules that keep the numbers honest

- **Code computes every number.** A model only labels blocks. Never estimate a score, share or delta by reading the page; run the script. Without a way to run Node, give the gap table in words and say no score was computed.
- **Three independent labeling passes, majority vote.** Run the label prompt three times, in separate model calls or subagents that cannot see each other's answers. A label counts when two passes give it. One pass is allowed only when three are impossible; the report marks it as less certain.
- **Render, don't fetch.** Static HTML misses demos, tabs, carousels and anything the page draws in the browser, and those are often the most personalized parts. Use a browser. If none is available, say so and stop at a provisional gap list from `get-page-elements`; don't score.
- **Score the version each audience sees.** The default page scores visitors no segment matches. A segment with no version of its own is scored on the default page. A forced preview shows one segment group at a time; a visitor who matches segments in two groups gets both groups' changes at once, which this score doesn't show. Read those combinations as a whole page when you QA them.
- **Private evidence.** Captures, preview links and reports contain account data. Keep them out of anything public.

## What it measures

Scores run 0 to 100. Share rows map a share through a curve: the "good" share scores 90, the "median" share scores 50, and nothing scores 0.

| Row | Weight | Scored from | Good / median |
| --- | --- | --- | --- |
| Hero, written for them | 25 | Share of the hero's selling words labeled for them | 50% / 15% |
| Rest of the page, written for them | 15 | Same, for everything below the hero | 30% / 8% |
| Testimonials from people like them | 20 | Testimonials whose speaker is one of them, of all testimonials | 34% / 10% |
| A link to their own page | 10 | Homepages only: nav or hero 100, page body 70, another page 40, sitemap only 15, none 0 | |
| Main button, for them | 10 | Written for them 100, the same for everyone 60, written for someone else 20, false for them or missing 0 | |

- A row that doesn't apply (the link row on a page that isn't the homepage) leaves the weighted average. A row not checked (no link fact given, or a hero or body with no selling text) lowers coverage; under 60% coverage the audience gets no score. A page with no testimonials scores 0 on that row: missing proof counts as missing.
- An audience with no line labeled for them on that version is **not found**: nothing on the page tells them it's for them.
- **Overall** is the plain average over the segments, with a not-found segment counted as 0, so closing that gap can only raise it. The report names any segment left out for too little coverage. The fallback audience (unmatched visitors) is reported but not averaged in.
- **Hero.** The report leads with the UI hero: everything in the page body above the first H2 after the H1 (a screen-reader-only H2 counts, since it marks a section), including a demo, video or product mockup there (smaller headings inside a mockup stay in the hero). It also shows the text hero the free check uses (6 blocks starting at the H1, stopping at the next heading). When a page's hero is not "everything above the first heading", set `window.SEGMENT_FIT_OPTIONS = { heroSelector: "..." }` before running the extractor and say which selector you used.

## 1. Choose the audiences

- **Segments.** Use the segment group (dimension) the page is or will be personalized by, read with `list-segment-groups` / `get-segment-group`. One audience per segment, with the segment's name.
- **Fallback.** Add one audience for unmatched visitors: the business's primary buyer from `get-project-context` or the user. Mark it `"fallback": true`. It is scored on the default page.
- For each audience write a `name` and a `person`: one concrete person from that audience ("an agency owner who builds sites for clients"). The labels depend on these; take them from the business's own description, not invented traits.
- **Offer rules.** List every offer on the page that isn't true for an audience: a trial that one plan type never gets, a price that doesn't apply, a shipping promise outside a region. Take the rules from the business (pricing page, plan terms, the user). Each one becomes a `falseClaims` entry with the exact phrase as shown on the page.
- No segments yet (an audit of a new account): use the audiences the business sells to, from `get-project-context` and the site, and score the default page only. Say these are proposed audiences.

## 2. Render each version

1. Get a forced-segment link per segment with `get-preview-url` for the exact page. For the default, ask `get-preview-url` for the page with no forced segment; if it requires one, take a segment's preview link and remove only its `__rm_test` parameter, so the default also loads the draft. Preview links load the project's draft configuration, so when the draft holds unpublished work every score shows the draft, not production; say which you scored. If you capture the default from the plain live URL instead, label it production and say the visit may count in analytics.
2. For each version open a **fresh** browser session (no stored visitor state) at a desktop width such as 1440×900, with reduced motion emulated when the browser tool allows it (`agent-browser set media light reduced-motion`, or the `prefers-reduced-motion: reduce` media feature): many pages then show demos and typing animations in their finished state. Wait for the page to settle, then scroll to the bottom in steps and back to the top so lazy sections render.
3. Confirm the version rendered is the one you asked for: a line you know that segment changes, or a marker the page exposes. A version that renders the default is a failed capture, not a score.
4. Before each capture, let animations finish: typing chat demos and counters otherwise leave half-written lines that show up as false changes. Wait until `document.body.innerText.length` reads the same twice, a second or two apart. After `prepare`, scan `blocks.json` for several lines that start the same and stop at different points; recapture if you find them.
5. Run `<skill-dir>/scripts/extract-blocks.js` as one expression in the tab (for example `agent-browser eval "$(cat <skill-dir>/scripts/extract-blocks.js)"`, or the client's evaluate tool). It returns a JSON string; save the tool's output as `captures/<version>-0.json` (the scorer accepts it JSON-encoded or not).
6. For every tab set, carousel or step-through component, click each state in turn and capture again (`<version>-1.json`, `-2.json` …). The scorer merges the captures and counts each line once.
7. Take a screenshot of each version's hero for the report.

The extractor reads only visible text, drops the site navigation, header and footer, and keeps text inside mockups even when it is marked `aria-hidden`, because sighted visitors read it.

## 3. Write run.json, label, score

Put this next to the `captures/` folder:

```json
{
  "page": "https://example.com/",
  "pageType": "home",
  "audiences": [
    { "id": "agency", "name": "Marketing agencies", "person": "an agency owner who builds sites for clients" },
    { "id": "inhouse", "name": "In-house teams running paid ads", "person": "a performance marketer at a software company", "fallback": true }
  ],
  "versions": [
    { "id": "default", "audience": null, "captures": ["captures/default-0.json", "captures/default-1.json"] },
    { "id": "agency", "audience": "agency", "captures": ["captures/agency-0.json", "captures/agency-1.json"] }
  ],
  "route": { "agency": { "level": "nav_or_hero", "evidence": "Use cases menu: Marketing agencies" } },
  "falseClaims": [{ "audience": "agency", "text": "14-day trial", "rule": "Agency plans start with a demo project, not a trial" }]
}
```

The values above are an example. `pageType` is `home` for a homepage and `page` otherwise. `route` is homepages only: for each audience, the best link from the homepage to their own page, found in the rendered page **including menus that open on click** (`nav_or_hero`, `page_body`, `other_page`, `sitemap_only`, `none`). An audience left out of `route` is "not checked".

Then:

1. `node <skill-dir>/scripts/segment-fit.mjs prepare run.json` merges the captures and writes `blocks.json` and `label-prompt.md`. Check its per-version counts: a version with far fewer blocks than the others failed to render. If it warns that a hero looks empty or has no button, look at the page: an H2 used as the subhead ends the hero early, so recapture with a `heroSelector`.
2. Run `label-prompt.md` three times independently. Save each JSON answer as `labels-1.json`, `labels-2.json`, `labels-3.json` next to `run.json`. Every block number must appear in at least one place; a pass that leaves out more than 10% is discarded.
3. `node <skill-dir>/scripts/segment-fit.mjs score run.json` writes `scores.json` and `report.md`. It refuses to score when the captures or the audiences changed after `prepare`; relabel then, because the label slots follow the audience order.

## 4. Read the gaps

`report.md` has the score per audience (their version, and on the default page), what each score is made of, the biggest losses in points, a section-by-section share table (sections matched to the default page by H2 title) that marks which sections change for each audience, every testimonial and who it speaks to, the buttons per version, and any false offers.

Add the **component table** yourself, from the section table and the screenshots. One row per demo or visual, logo or integration wall, testimonial set, CTA block, FAQ and video:

| Component | Section | Personalized? | Speaks to | Gap for which audience | Fix (copy, proof, component, link) |
| --- | --- | --- | --- | --- | --- |

Rank gaps by points lost, worst-served audience first. A false offer outranks everything: it is wrong, not merely generic. Typical fixes, in the order they usually move the score:

- Hero copy that names the audience's situation (25 points of weight), including the subhead and the visual under it.
- A real testimonial from each audience the wall misses (20). Never invent one; when none exists, say which customers to ask.
- A main button and offer that are true and specific for them (10).
- A link to their own page from the nav or hero (10, homepages).
- Section copy and components below the hero that only tell one audience's story (15).

## 5. Close the gaps and rescore

Closing gaps is a build. It follows the website personalization skill's normal path: agreed copy with sourced proof, verified targeting, an inactive draft, readback. Copy that the page itself must change (a new testimonial on a shared wall, a component that renders one story) is a site change for whoever owns the page; list it as a handoff, not a campaign action.

Then rescore against the draft:

1. New preview links (they load the draft), fresh captures into a new folder (confirm each version renders the treatment; if the preview can't show an inactive draft, mark the rescore pending rather than retrying or activating anything), the same `run.json` audiences, `route` and `falseClaims`, updated only for links you actually added.
2. `prepare`, three new labeling passes, `score`.
3. `node <skill-dir>/scripts/segment-fit.mjs compare before/scores.json after/scores.json` prints the before and after per audience and overall.

Report the rescore as **draft preview scores**. They show what the treatment says to each audience, not that real visitors are matched to it or that it converts. Repeat until each audience's biggest remaining loss is something the page can't fix yet (a missing testimonial, a component that needs a developer), and list those.

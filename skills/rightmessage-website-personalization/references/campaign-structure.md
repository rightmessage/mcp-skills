# Campaign structure for speed

How campaigns are split and scoped decides how much RightMessage every page downloads, and whether RightMessage Edge can write a page's personalized content into the server HTML. Build page treatments this way unless the user decides otherwise. Measurement still comes first; see rules 3 and 6.

## How the published configuration loads

- **Core tag and page shards.** Every page loads the core tag. A campaign whose page criteria are all narrow goes into a shard that loads only on pages matching those criteria. Campaigns with the same criteria share a shard.
- **Narrow:** an exact path (`example.com/pricing`, the homepage `example.com/`), or a pattern with a real path in it (`example.com/blog/*`, "starts with /blog", "contains /guides").
- **Broad**, which keeps the whole campaign in the core tag every page downloads: a site-wide pattern (`*`, `/*`), "contains", "starts with" or "ends with" an empty path, a negated rule ("does not contain", "does not equal"), or no page criteria. One broad criterion is enough. It counts in the campaign's page targeting, in any action's page scope, and in the event pages of every goal attached to the campaign.
- **Sharding starts at a size threshold.** Today it starts once page-scoped campaigns total about 32 KB. Below that, everything is in the core tag and the structure costs nothing. Structure for sharding anyway: it pays as the configuration grows.
- **Edge reads one plan per release.** On sites running RightMessage Edge (`@rightmessage/edge`, or an adapter built on it such as the Cloudflare Workers or Next.js package), the edge reads one plan document per published release. Its size depends on the actions and their text, not on how many campaigns hold them. Plans are limited to 1 MiB, and campaigns that don't fit fall back to the browser.

## Rules

1. **Scope each campaign to the narrowest pages it serves.**
   - **Page treatments:** one campaign per personalized page, so each page downloads only its own actions.
   - **Shared blocks:** a block many pages share, such as an article ending or a thank-you page, gets one campaign scoped to that pattern (`/blog/*`). It still shards.
   - **One audience across several pages:** when the user wants one holdback or one read across home, pricing and product, one campaign on that list of exact pages is fine. Each of those pages then downloads the others' actions too; say so.
   - **Independent dimensions:** two dimensions on one page (business type and traffic source, say) can each have their own campaign for it. With the same criteria they share a shard.
   - **Sitewide changes:** keep them in at most one sitewide campaign, and keep it small, because it is in the core tag on every page. Signal elements, a line every page shows a segment, and goals that report across the site (rule 3) belong here.
2. **No broad criteria in a page-scoped campaign.** Check `base_url`, the page targeting and every action's page scope. Never use `/*`, an empty "contains" or "starts with", a site-wide wildcard or a negated rule in a campaign meant to shard.
3. **Measurement wins over a shard.** A goal's event pages join the criteria of every campaign it's attached to, even narrow ones: a "views /pricing" goal on each page campaign makes every page's shard load on /pricing. So:
   - **No holdback or test on the page campaigns, above the sharding threshold, with a sitewide campaign:** attach goals to the sitewide campaign and leave page campaigns without them. Tell the user what that gives up: page campaigns show no campaign results or goal credit of their own, an A/B test on one later needs a goal attached first, and a holdback on the sitewide campaign reads only the sitewide changes (its control group still sees the page campaigns).
   - **Below the threshold, with no sitewide campaign, or when you can't tell which side of the threshold the project is on:** keep goals on the page campaigns. Nothing is gained by moving them, and a goal attached to no campaign records nothing.
   - **A holdback read or test on the page campaign:** attach the confirmed-success goal it needs, even when its event page is broad, such as "URL does not contain …" or any page. Record that the goal keeps the campaign in the core tag. Then offer a narrower goal, such as an exact confirmation path or a "starts with /thank-you" pattern, as an option the user approves; changing a goal is a write of its own. Below the sharding threshold the trade gains nothing, so don't raise it there.
4. **First-screen content on server-rendered elements.** Put each segment's above-the-fold copy in campaign actions on elements that exist in the page's server HTML. Edge can write those before the page reaches the browser, but only actions it can apply safely:
   - selectors from its supported set (no sibling combinators, `:has()`, last-child selectors or pseudo-elements);
   - static values, with no `{{` placeholders;
   - text, find/replace, attributes other than `value`, `checked`, `selected` and `style`, and hiding.

   Everything else stays in the browser, and an action Edge can't apply can keep it from writing lower actions on that page. When the agent can't tell which targeting compiles to an edge write, say so and verify it after publish (see the checks below).
   - **Client-switched content:** copy that a React component switches in the browser (from a signal element, a data attribute or client state) appears only after hydration. Edge can't serve it, so it shows late or flickers.
   - **UI a component picks per segment:** have the site server-render every segment's version plus a default, and add CSS to the site's own stylesheet that shows the right one based on a signal element. Visitors with no segment, holdback visitors and browsers without `:has()` should see the default; for example, `.for-agency { display: none } body:has(#visitor-type[data-value="agency"]) .for-agency { display: revert } body:has(#visitor-type[data-value="agency"]) .for-default { display: none }`, with `revert` or the element's normal display value. The campaign only sets an attribute on the signal element through a plain ID selector, which Edge can write; never put the `:has()` rule in a campaign action, which would be browser-only. The first view is then right before any script runs. Hide an offer that's false for a segment the same way, so it never flashes. The stylesheet and markup are site changes for the handoff list. It costs some HTML on every view; measure it.
   - **React and Next.js sites:** each personalized element needs `suppressHydrationWarning`. That is a site change, so put it on the site-owner handoff list.
5. **Keep Edge current.** Use `@rightmessage/edge` 0.4.0 or later, or an adapter release built on it. Check the site's installed version before relying on edge rendering.
6. **Splitting an existing campaign restarts its measurement.** Holdback is assigned per campaign, so splitting one campaign into page campaigns:
   - gives each page its own holdback;
   - loses the arms visitors are already in;
   - divides the traffic behind each read.

   Don't split a campaign with a running holdback read or test unless the user accepts that. When they do:
   - Run `duplicate-campaign` once per target page. A copy can come back active in the draft, so set `is_active=false` on each one right away and read it back.
   - A copy is exact, so it also inherits the original's goals and testing setting. Set each copy's goals by rule 3 and its testing setting as agreed, and read both back.
   - On each copy, keep only that page's actions and set their page scope. Copies get fresh variant and action IDs, so reporting history restarts.
   - Decide where the sitewide remainder goes: either one more copy, or keep the original as the sitewide campaign and remove its page actions in the same draft. Don't retire it with sitewide actions left in no campaign.
   - If the live `update-campaign` schema lets a change refer to an existing action by ID instead of re-sending its content, keep actions that way, which avoids copying text out of a readback that may be shortened. Confirm that in the schema first; otherwise send the full content from the original manifest.
   - Check that every action lands in exactly one campaign.
   - If the original isn't kept as the sitewide campaign, retire it only in the same approved publish that activates the replacements, so no page goes unpersonalized in between.

## Worked example: RightMessage's own site (November 2026)

The site's personalization started as one campaign: 34 single-segment variants and 234 actions, several of them scoped `/*`, all in the core tag. It was split into one sitewide campaign and 8 page campaigns (homepage, pricing and six product and use-case pages):

- **Sitewide campaign:** kept the signal elements, email-platform copy and logos, and all 6 goals, since testing (holdback) was off and the configuration was above the sharding threshold. 31 variants.
- **Page campaigns:** exact paths, single-segment variants only where a segment changes that page (3 to 24 each), and no goals. Homepage actions that had been scoped `/*` were scoped to the homepage path.
- **Placement:** every action landed in exactly one campaign, with matching targeting.

Measured on the published configuration and the split:

| | Before | After |
| --- | --- | --- |
| Campaign data in the core tag, every page | 64.8 KB (7.1 KB brotli) | 25.5 KB (2.6 KB brotli) |
| Page-scoped campaign data eligible for shards | 0 (no shards) | 48.8 KB, 8 shards |
| Largest shard (pricing) | none | 10.5 KB (1.5 KB brotli) |
| Download per page | | about 4.5 KB brotli less on unpersonalized pages, 3.4 KB less on the homepage, about 3 KB less on pricing; 29 to 39 KB less JSON to parse |
| Edge plan | 149 KB | unchanged; one plan per release |

Read the numbers in proportion. Campaigns were about 6% of a 1 MB tag (uncompressed; 226 KB brotli), and the split adds about 9.5 KB of campaign data in total, spread over shards that load only where they're needed. CTA flows and dimensions weighed more, so the split saves kilobytes, not a step change. Edge's work per request doesn't grow with campaign count, so server response time shouldn't change beyond noise. Server-rendering every segment's version of the homepage's per-segment UI added about 1.2 KB brotli of HTML. On a first visit that's still a net saving once the tag reduction is counted; the tag is cached afterwards while the HTML is paid on every view.

## Checks when you build

Read back every campaign you create or change. Record each check in the workbook as pass, fail or accepted trade-off:

- Each campaign's `base_url`, page targeting and action scopes are as narrow as the pages it serves, with no broad criterion unless the user accepted the core-tag cost.
- Goals sit where rule 3 puts them; record why for any goal on a page campaign or moved to the sitewide campaign.
- After a split, every original action is in exactly one campaign, and every copy is inactive until the approved publish.
- The sitewide campaign, if any, holds only changes that belong on every page.
- First-screen copy for each segment is a campaign action on a server-rendered element, not a client-side component switch. List the actions that can't be, and why.
- The site's Edge version, if Edge is installed, and `suppressHydrationWarning` on personalized elements for React sites.

After a separately approved publish, check Edge with an ordinary request that matches a segment, not a preview link. Preview links and the preview cookie always return `x-rm-edge: bypass:preview`, and a visitor in the holdback gets `no-actions`. `x-rm-edge: applied` means the edge wrote the page; any other bypass reason says what didn't run. Report sizes you measured, such as the core tag and the plan, and don't claim a speed gain you didn't measure.

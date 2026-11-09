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
   - **Sitewide changes:** keep them in at most one sitewide campaign, and keep it small, because it is in the core tag on every page.
2. **No broad criteria in a page-scoped campaign.** Check `base_url`, the page targeting and every action's page scope. Never use `/*`, an empty "contains" or "starts with", a site-wide wildcard or a negated rule in a campaign meant to shard.
3. **Measurement wins over a shard.** Attach the confirmed-success goal the treatment needs, even when its event page is broad, such as "URL does not contain …" or any page. Record that the goal keeps the campaign in the core tag. Then offer a narrower goal, such as an exact confirmation path or a "starts with /thank-you" pattern, as an option the user approves; changing a goal is a write of its own. Below the sharding threshold the trade gains nothing, so don't raise it there.
4. **First-screen content on server-rendered elements.** Put each segment's above-the-fold copy in campaign actions on elements that exist in the page's server HTML. Edge can write those before the page reaches the browser, but only actions it can apply safely:
   - selectors from its supported set (no sibling combinators, `:has()`, last-child selectors or pseudo-elements);
   - static values, with no `{{` placeholders;
   - text, find/replace, attributes other than `value`, `checked`, `selected` and `style`, and hiding.

   Everything else stays in the browser, and an action Edge can't apply can keep it from writing lower actions on that page. When the agent can't tell which targeting compiles to an edge write, say so and verify it after publish (see the checks below).
   - **Client-switched content:** copy that a React component switches in the browser (from a signal element, a data attribute or client state) appears only after hydration. Edge can't serve it, so it shows late or flickers.
   - **React and Next.js sites:** each personalized element needs `suppressHydrationWarning`. That is a site change, so put it on the site-owner handoff list.
5. **Keep Edge current.** Use `@rightmessage/edge` 0.4.0 or later, or an adapter release built on it. Check the site's installed version before relying on edge rendering.
6. **Splitting an existing campaign restarts its measurement.** Holdback is assigned per campaign, so splitting one campaign into page campaigns:
   - gives each page its own holdback;
   - loses the arms visitors are already in;
   - divides the traffic behind each read.

   Don't split a campaign with a running holdback read or test unless the user accepts that. When they do, create inactive page campaigns carrying each page's actions, with the same goal and testing policy. Retire the old campaign only in the same approved publish that activates the replacements, so no page goes unpersonalized in between.

## Checks when you build

Read back every campaign you create or change. Record each check in the workbook as pass, fail or accepted trade-off:

- Each campaign's `base_url`, page targeting and action scopes are as narrow as the pages it serves, with no broad criterion unless the user accepted the core-tag cost.
- Attached goals' event pages are narrow, or the broad goal was kept on purpose for measurement (rule 3).
- The sitewide campaign, if any, holds only changes that belong on every page.
- First-screen copy for each segment is a campaign action on a server-rendered element, not a client-side component switch. List the actions that can't be, and why.
- The site's Edge version, if Edge is installed, and `suppressHydrationWarning` on personalized elements for React sites.

After a separately approved publish, check Edge with an ordinary request that matches a segment, not a preview link. Preview links and the preview cookie always return `x-rm-edge: bypass:preview`, and a visitor in the holdback gets `no-actions`. `x-rm-edge: applied` means the edge wrote the page; any other bypass reason says what didn't run. Report sizes you measured, such as the core tag and the plan, and don't claim a speed gain you didn't measure.

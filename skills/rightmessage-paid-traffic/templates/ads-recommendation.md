# Ads recommendation (read-only, for approval)

Everything here is a proposal. Nothing has been mapped, created or published.

## Summary

- Project, ad account, report range and when it was read:
- Spend, ad visitors, running ads, ads with no live audience, pending suggestions:
- Goal status (`goal`, `goalStatus.reason`) and which landing pages carry a goal and a holdback:
- The few decisions the owner needs to make:

## Ad-to-segment mapping

One table per landing page (redirecting URLs merged), sorted by spend. Recommend a segment (or "no segment") in every group the ad copy speaks to, not only one.

| Ad ID | Headline / hook | Spend (range) | Visitors | Suggested (pending) | Recommended per group (angle · topic · level …) | Write (accept / set / after link fix / skip) | Why changed, quoting the ad |
| --- | --- | --- | --- | --- | --- | --- | --- |

Groups set to "no segment" on every ad, and why:

## Proposals

| Proposal ID | Kind / group | Name | Ads (running?) | Accept / dismiss / defer | Why |
| --- | --- | --- | --- | --- | --- |

## Tracking-link handoff (for whoever runs the ads)

Creatives flagged `tracking_link_shared`, `no_tracking_link` or `link_not_seen`, the parameter each should send instead (for `link_not_seen`, what rewrites the link, such as a tracking template), and which ads use an ad set or campaign name as their value.

## Pages and campaigns

| Priority | Final page URL (and link URLs that redirect to it) | Spend (range) / visitors | Ads landing | Existing campaigns on the page | Layers (group → element) | Build now / later / skip |
| --- | --- | --- | --- | --- | --- | --- |

Per page: possible versions (product of changed segments + 1 per layer), versions real ad traffic hit, and the split of ad arrivals:

| Version (layers combined) | Ad arrivals (range) | Share | Seeing it with the holdback |
| --- | --- | --- | --- |
| Original page (no matching layer) | | | |

## Copy drafts (for the owner to edit)

One matrix per page, one row block per layer. Each group owns its element; no two groups change the same one. Write "unverified" for original copy you couldn't read live. Testimonials are real quotes, never written.

| Layer (segment group) | Element | Original | Segment A | Segment B | Everyone else |
| --- | --- | --- | --- | --- | --- |
| Angle | Headline | | | | Original |
| Topic | Subheadline | | | | Original |
| Level | Testimonial | | | | Original |

## Goal and holdback

- Main goal (event key, value, order ID) and per-product goals:
- Existing goals to keep, fix or pause, with the reason:
- Holdback share per campaign, visitors per day, and detectable lift at 4 and 8 weeks for an assumed conversion rate:
- Tag confirmed firing on the real confirmation page? Conversions count only after a publish.

## Write plan (runs only after approval)

Numbered, in order, with real IDs: proposals dismissed or accepted, `accept-new-ad-segments` keys, `set-ad-segments` payloads, goals, inactive campaigns, previews. Publishing and activation are a separate approval.

## Open questions and unverified claims

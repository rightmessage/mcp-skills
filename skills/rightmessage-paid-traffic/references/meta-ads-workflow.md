# Meta Ads integration: recommend first, then map, build and measure

Use this when the project has the Meta Ads integration connected and `get-ads-report` returns a connection. It covers reading the Ads page through MCP, deciding who each ad speaks to, deciding which landing pages get a campaign, and the exact writes, in the order they should happen once the owner approves them.

Tool names and fields below come from the current tool descriptions. Discover the registered schemas at runtime and let them win over this file.

## What the Ads page shows

The dashboard's Ads page (`/{project}/ads`) and `get-ads-report` are built by the same report.

- **Running ads table.** Columns: Creative, Audience, Spend, Visitors, Conversions, Effectiveness. Filters: *All running*, *Needs mapping*, *Mapped*, *Page not personalized*. An ad with a suggestion shows *Accept*, *Choose different segments* and *Skip for now*. Accept takes one creative at a time in the UI. The audience picker offers *No segment in this group* for each group (or *Leave it to your segment rules* when the project's own URL rules already decide that group).
- **New-ads mode.** *Review first* (`review`) keeps classification's picks as `pending` until someone accepts them. *Apply automatically* (`auto`) puts them live as each sync finishes. `get-ads-report` returns it as `review.mode`, with `review.pending` and `review.conflicts` counts.
- **Sync.** Ads sync hourly. `sync-ads` queues one now; it allows three requests per ten minutes per project, shared with the dashboard. Read `connection.sync` for progress.
- **"Start measuring"** on the page turns A/B testing on in the draft of each campaign on an ad landing page that has it off, then opens the publish review. Nothing changes on the site until that publish. Through MCP, that is `update-campaign` `testing` plus a separately approved publish.

## Read everything first

`get-ads-report` is read-only. Page through it; never treat one page as the whole account.

- `range`: 7, 14 or 30 complete days in the ad account's time zone.
- `creatives`: `all`, `pending_review`, `no_audience` (has a tracking link, no segments) or `conflicts`. `limit` 1 to 100, `offset`; loop while `creatives.has_more`.
- `goal_id`: count conversions for that goal. Without it, the report uses the goal of the campaign on the busiest landing page.
- `cross`: two segment group IDs for `coverage` and `combinations`.

Fields to read:

| Field | What it tells you |
| --- | --- |
| `creatives.rows[]` | One row per creative: `key`, `name`, `ads[]` (`id`, `campaignName`, `adsetName`, `active`, `spend`), `headline`, `body` (cut at 300 characters), `destinationUrl`, `landingUrl`, `trackingLink` (`param`, `value`), `health`, `audience[]` (`dimensionId`, `segmentId`, `source` auto/manual, `state` live/pending, `conflict`), spend, clicks, `visitors`, `conversions`, `lift` |
| `status` | `active`, `paused` or `mixed` (ads sharing the link differ). Map running creatives first; paused ones can wait |
| `attention[]` | Problems and notices, each with `creativeKeys`. `tracking_link_shared`: several ads send the same link value, so their visitors can't be told apart. `no_tracking_link` and `link_not_seen`: no usable link value reaches the site, so mapping those ads does nothing yet. `no_audience`: ads with no segments. Others cover goals and landing pages |
| `proposals[]` | Open suggestions: `id`, `kind` (`new_segment` in an existing group or `new_group`), `dimensionName`, `name`, `adIds`, `reason` |
| `landing_pages[]` | Per page: `creatives`, `visitors`, `spend`, `campaigns`, `checks[]`, `buildable`, `blockedReason`, `lift`. At most 25; compare `landing_pages_total` |
| `goal`, `goalStatus`, `goals[]` | `goal` null with `goalStatus.reason` `no_live_campaign_goal` means goals exist but no campaign on the ads' landing pages carries one. It does not mean the project has no goals. Each goal in `goals[]` has `onLandingCampaigns`, `tracking` and `recorded` |
| `coverage` | The two crossed groups and `gaps`: audiences with site visitors that no ad speaks to, each with a `briefPrompt` |
| `measuring`, `updating` | `measuring: true` means visitors, conversions and lift are still being read and are null for now; call again in a couple of minutes, up to 3 times, then say the numbers weren't ready. `updating: true` means the numbers come from an earlier read |

Money is `{amountE4, currency}`: divide by 10,000. Null visitors, conversions or lift mean "not measured", never zero.

Landing-page `checks[]` keys: `campaign` (a live campaign runs here), `goal` (that campaign has a goal), `goal_recorded` (the goal recorded conversions in the range), `holdback` (A/B testing on, so a holdback sees the default page), `audience_content` (each ad audience has its own version). `buildable` is false with a `blockedReason` when the page's host isn't one of the project's websites, no ad landing there has a tracking link, or none has an audience yet ("Choose an audience for … first").

Lift labels to relay as given: *vs holdback* (measured), *Collecting · fewer than N visitors in a group*, *Too early*, *Not measurable · A/B off*, *Not measurable · no goal*, *Not measurable · goal not on this campaign*, *Not personalized · no campaign on this page*, *Not measurable · goal not recorded*, *Unavailable*. A collecting or range figure is not a test verdict. The visitor threshold only ends *Collecting*; it is not significance.

Also read, before recommending: `list-campaigns` and `get-campaign` for every campaign on an ad landing page (including inactive and empty ones), `list-goals`, `list-segment-groups` (and which groups sync to the email platform: `get-dimension-sync-data`), and `list-config-versions` for pending draft work.

## Creatives, tracking links and landing URLs

- A **creative** is every ad that shares one tracking link (`param=value`, for example `utm_content=<ad id>`). The visitor can't tell those ads apart, and neither can RightMessage. A mapping applies to the whole creative.
- When the report flags `tracking_link_shared`, or a row has `trackingLink: null` and `health: ["identifier_shared"]`, its visitors can't be routed by that ad. Mapping it does nothing until the advertiser gives each ad a unique value, for example a per-ad dynamic ad ID parameter. That is a handoff to whoever runs the ads, never a change you make.
- A link value set to the ad set or campaign name works only while that ad set has one ad. Recommend a per-ad value going forward.
- `landingUrl` comes from the ad's link (`landingSource: link`) or, when Meta reports no link (for example an ad built on an existing post), from observed visits (`observed`); then there is no link URL to request. For a link, request the URL with its parameters and follow redirects: several ad URLs can 301 to one final page. Build one campaign on the final page path, check that the redirect keeps the query string, and note that the report may still list each link URL as its own landing page.

## Decide who each ad speaks to

Group by the promise the ad makes, not by ad ID. Read the headline and the opening of the body (the hook), not only the headline: the body's first line usually carries the promise.

- **Map every signal the ad carries, one segment per group.** An ad usually says several things at once: its angle (what it promises), its topic, and sometimes who it speaks to (a beginner, someone already doing it). Each is its own segment group, and each can later drive its own element on the page. Set every group the copy supports and "no segment" where it says nothing. Infer a level only from explicit copy ("never made it before", "just starting", "you've done this for years"), never from tone.
- **Give each group a job on the page.** For example: angle → headline, topic → subheading, experience → testimonial. Within one group keep two to four segments per page with real traffic, plus the original for everyone else. Segments a page won't use can still be mapped, so the data builds up for later pages.
- **Agree or change each suggestion, with a reason quoted from the ad.** Classification picks what fits best among the project's existing segments; check twin ads (the same copy in two ad sets) get the same answer.
- **Use "No segment in this group" for groups the owner doesn't want or that no page uses.** For example, an owner who doesn't want a group of partner segments gets `segment_id: null` in that group on every ad, and the proposals for that group dismissed. Don't delete or rename the owner's groups to honor that. A cleared group isn't remembered: new or edited ads can be classified into it again, so keep review mode and clear or reject picks in excluded groups at every review.
- **Don't turn ad copy into facts about the visitor.** A beginner-friendly ad doesn't make the visitor a beginner; an ad about a product doesn't mean they own it. Be careful with groups that hold survey answers (experience level, what they own or do) and that sync to the email platform. Whether ad-derived membership writes to the email platform field is not stated in the tool descriptions: check `get-dimension-sync-data` and, if unsure, leave those groups at "no segment" or confirm with a test contact before mapping them.
- **Proposals.** Accept a new segment only when a page will use it and no existing segment fits. Dismiss duplicates and anything the owner ruled out. Defer proposals whose ads are all paused. Several near-identical proposals in one group usually mean one segment at most.

## Decide which pages get a campaign

Rank landing pages by spend and visitors, after merging URLs that redirect to the same page.

- One campaign per landing page or product, with its own goal and holdback, so each page is judged on its own.
- Skip pages with one undifferentiated ad, sponsored articles, tiny spend, or pages that already speak to one partner or offer; say why.
- Read every existing campaign on the page first, including inactive ones and active ones with no changes; the report's `campaign` check can say "No live campaign" while such a campaign sits on the page. Two campaigns on one page each keep their own holdback; plan to retire or merge the old one in the same approved release.
- Check what the default page already says. If the default already mirrors one angle, that audience may need no change, or only a testimonial swap.
- Reuse the owner's own approved copy where it exists, such as variants in older campaigns for the same angle segments, before drafting new lines.

### Layered campaigns

- One campaign per page holds every layer: one variant per segment, each changing only the elements its group owns, and one holdback for the whole campaign. Every variant whose rules match is applied, so the layers combine. If two variants change the same element, the later one wins, so never let two groups own one element.
- Skip a layer on a page where every ad arrival has the same value in that group (it changes the page for all ad traffic alike), or where the default already says what that segment would change it to.
- Testimonial layers use real quotes already on the page or approved by the owner: swap a quote that fits the segment (for beginners, a reviewer who says they were new to it) into the first testimonial slot. Never write a testimonial.
- Report, per page, the possible versions (the product of changed segments + 1 across groups), how many combinations real ad traffic hit, and the 30-day split of ad arrivals across them (compute it from each creative's mappings and `visitors`; `cross` gives account-wide counts for two groups, only for ads mapped in both, top `limit` rows by spend, so it is not a per-page split). With a holdback, only the non-held-back share sees each version. `create-campaign`'s `unique_variant_count` leaves out the "+1" (no change in a group), so it won't match this count.
- The holdback reads all layers together and can't credit one layer. To test one layer, run an audience A/B test on that segment's variant, with version B skipping that layer's actions (`update-campaign` override with `skip: true`).
- "The later variant wins" means later in variant order, which follows the order in which `changes` first name each segment set.

## Goals and holdback

- The main goal for a purchase is a **JavaScript event** goal (`create-goal`, event `type: JAVASCRIPT`, `key` such as `purchase`; `page` optional, default any page). The site calls `RM.push(['conversion', 'purchase', { value: <order total>, id: 'order_<order id>' }])` once per order: `value` gives revenue, `id` stops a thank-you page refresh from counting twice. A cart with several items counts as one purchase worth the order total.
- Per-product goals use one key per product (for example `bought_<product>`; keys are lowercase letters, digits and underscores, starting with a letter, up to 40 characters, so normalize slugs with hyphens), fired by the same tag when the order's items include that SKU, with that item's price. A key belongs to one goal.
- Conversions record only after a publish, and only once the site actually fires the event: check the tag fires on the real confirmation page before trusting the goal.
- **Goal pitfalls:**
  - Page rules match the URL path only, never the query string. A rule like `cart/?add-to-cart=*` never matches.
  - A pageview goal on the platform's default thank-you path counts nothing if buyers land on a custom confirmation page. Compare the goal's path with real confirmation pageviews.
  - A form-submit goal on checkout counts attempts, including failed payments. Keep it as a diagnostic, not the main result.
- **Holdback.** Turn `testing.is_enabled` on for every new ad campaign. Choose `withhold` from the page's visitors per day and a plausible conversion rate: estimate the smallest relative lift the read can detect at 4 and 8 weeks with code, and say so. An owner who wants to iterate faster may choose a larger share, up to 50%, which gives the quickest read at the cost of fewer visitors seeing their version. Don't promise a result date; don't change the holdback share during a read.
- Campaigns that are inactive don't render, not even in a draft preview. Previewing needs them active in the draft, and any publish then takes them live, so agree on that before switching them on.

## The order of work

1. **Recommend (read-only).** Mapping table per page (ad, headline, spend, visitors, suggested, recommended, why), proposals to accept, dismiss or defer, pages and campaigns, per-audience copy drafts, goal and holdback, tracking-link handoff, and open questions. Copy is a draft for the owner to edit; mark original copy "unverified" unless you read the live page.
2. **Get explicit approval** of the specific writes. Approving the mapping is not approval to build or publish.
3. **Map ads** (live at once with no publish step, except in a project that has never published, where they reach only the draft, and for a segment only the draft has, which waits for the next publish (`audience[].waitsForPublish`); an API token needs `write` and `publish`):
   - `accept-new-ad-segments` with `creative_keys` (1 to 500) for creatives whose pending segments are all agreed. It accepts every pending group on those creatives.
   - `set-ad-segments` with `ad_id` and `segments: [{segment_group_id, segment_id | null}]` for every creative you change. List every group that has a pending or wanted segment; null clears it. Groups left out keep what they had (pending stays pending). A chosen segment is manual, so classification never overwrites it; a cleared group is not remembered (see above).
   - `reject-new-ad-segments` leaves the creatives without their pending segments (live ones stay); classification won't pick them again until the ad's copy changes.
   - `accept-ad-proposal` creates the segment or group and maps its ads live; `dismiss-ad-proposal` changes nothing on the site.
   - Mapping changes who is in a segment immediately and everywhere (subject to the exceptions above). Any active campaign elsewhere that targets those segments starts showing its version to ad visitors at once. Check that before mapping.
   - Read back: call `get-ads-report` again and check each changed creative's `audience[].state`, `source` and `waitsForPublish`, and that `review.pending` dropped as expected.
4. **Create goals**, then **campaigns inactive** (`create-campaign` `is_active: false`, `testing`, `goal_ids`, `outcome`, page-scoped `changes` from `get-page-elements`, one `segment_ids` value per layer variant). Check each target element's current text before using its targeting, so a changed page doesn't get the wrong edit. Read them back.
5. **Preview and QA** each version with `get-preview-url`, plus a real ad URL in a fresh browser. Previews show nothing while a campaign is inactive. With approval, activate it in the draft only and say that the next publish takes it live; otherwise mark rendering QA unverified.
6. **Publish only with separate approval** of the whole pending diff, the activation of the new campaigns and the retirement of old ones on the same pages.
7. **Afterwards:** keep new ads mapped (review mode means new ads wait as pending), re-read `landing_pages[].checks`, and relay lift labels as given.

Keep review mode unless the owner asks for automatic mapping: `set-new-ads-mode` changes no existing mapping and publishes nothing, but in `auto` every later sync puts classification's picks live without review.

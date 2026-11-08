# Account pull

Read everything here before the first question. All calls are read-only. Tool names are canonical labels; discover the client's actual names and schemas first.

## How to read

- **Small batches.** Run a few reads at a time, not a dozen. If a read is rate-limited (HTTP 429), wait and retry it up to 3 times with growing waits (use `retry_after_seconds` when given), then report that read as unavailable.
- **When a tool refuses a range** (too large, too many pageviews), split it: two halves, or a few sampled days. Say which days you used, and label anything scaled up to a month as an estimate.
- **Large responses:** request fewer sections, parse in code and keep only what you need.
- **Errors and empty results are not zeros.** Say what you couldn't read.

## Order

1. **Business, domains and health**
   - `get-project-context`: what the business sells, to whom, its voice, segment groups with counts.
   - `get-data-status`: is the tracking script firing. This is project-wide; it doesn't prove the script loads on every domain.
   - **Domains:** collect every host from campaign base URLs and page scopes, flow `exposurePages`, goals, and publish-history messages. A project can span several domains (a marketing site, a launch site, a checkout, a hosted page). Note which domains carry the money step.
   - `get-publish-history` and `list-config-versions`: what changed recently, who is doing the work now, and whether there's unpublished draft work. Note it; don't touch it.
2. **Traffic**
   - `get-traffic-analytics` with `landingPages`, `mostViewedPages`, `utmSources`, `utmMediums`, `utmCampaigns`, `trafficSources`, `referrers`. Use a larger `limit` for landing pages.
   - Check what a count means before comparing it with another tool's; landing-page counts can be far lower than arrivals measured elsewhere. Prefer one tool's numbers within one calculation.
   - **Paid traffic** is identified by source as well as medium: `utm_source` values like facebook, fb, ig, google with campaign or ad-set names count as paid even when `utm_medium` holds something else.
   - **Bots:** if a large share of visitors is flagged as suspected bots, or Direct is implausibly high, say so and treat traffic totals as inflated.
3. **Paid ads**
   - `get-ads-report` when Meta Ads is connected. Read its attention items (for example landing pages with spend and no live campaign), landing pages with spend and visitors, ads with no audience, suggestions waiting for review, conflicts, and coverage gaps (audiences with site visitors that no ad speaks to).
   - The report counts conversions for one goal, by default the goal of the campaign on the busiest landing page. Pass `goal_id` for the result the business is judged on, not a click or form step on the way.
   - Page through all creatives (`limit` up to 100, `offset`) and add up spend, visitors and conversions per landing URL. That gives each landing page's own conversion rate and cost per conversion. The `creatives` filter lists only ads with no audience, pending review or conflicts.
   - Without Meta Ads, use paid sources and campaign names from traffic analytics. Ads on other platforms only show up this way.
4. **What's running**
   - `list-campaigns`, then `get-campaign` for active ones: pages, audiences, changes, goals and holdback.
   - `list-goals` and `get-goal`: what counts as a conversion, and whether the money step is tracked at all. This is the only source for whether goals exist.
   - `get-goal-performance` (same date range, no `goal_id`): every live goal's conversions, people, conversion rate (people over all site visitors, not a page's rate; see impact.md) and last conversion, whether or not a campaign uses it. A goal in `list-goals` but missing here hasn't been published; read it with `goal_id` for its state rather than counting it as zero. Pass `goal_id` for one goal's daily conversions and which campaigns got credit. Read each goal's `tracking`: `recorded` counts it (from `tracking.from` when set); `after_next_publish`, `paused` or `not_attached` mean nothing is recorded, and `tracking.detail` says why. Report that state, not zero. If it says `computing`, call again after `retry_after_seconds`, up to 3 times. If the tool isn't in the connected catalog, use the ads report's `goals` list (`recorded`, `tracking.from`) when Meta Ads is connected; otherwise say the counts aren't available, never zero.
   - `get-campaign-performance`: personalized versus held-back visitors and conversions per goal, lift and its range. If it reports results are still computing, call it again up to 3 times with growing waits, then say they weren't ready. Say which window you got. A `no_live_campaign_goal` reason means goals exist but no *active* campaign carries one; inactive campaigns are listed under `notLive`, and the goals' own numbers come from `get-goal-performance`. `no_goals`/`no_goal` means the project has no goals (older servers also sent it when goals existed), so confirm with `list-goals`. Check `list-goals` before saying anything isn't measured.
   - `list-flows`, `get-flow-summary`, `get-flow-performance` (overall, then per flow with `flow_id` for anything enabled), `list-widgets`, `list-offers`, `list-forms`.
5. **Data and where it goes**
   - `list-segment-groups`, `list-questions`: what's collected, and whether anything uses it afterwards.
   - `list-integrations`, `get-dimension-sync-data`: which answers reach the email platform or CRM, and whether the platform can take generated email personalization.
   - `get-segment-revenue` when Stripe is connected: which segments pay.
   - `get-audience-breakdown` for one important page and source: how many arrivals match an audience, and how many visitors with answers reach the money step (a correlation, not proof).

## Checks to run on what you pulled

**Growth checks**
- **The money step isn't measured,** or is measured one step early (a click, a form view, a submit before a booking is confirmed). Note where it happens; if it's on another domain, the goal needs a thank-you page or event there.
- **Paid clicks on pages with no live campaign.** Compare paid landing pages with the pages active campaigns change.
- **Big audiences with no version of the page.** Compare the largest audiences on a page (by arrivals) with the audiences its campaign changes.
- **Busy selling pages with nothing on them:** no campaign, flow or goal on the page with the most buying intent.
- **Where people drop between steps.** In one population, compare the step before the result with the result (form submitted versus booking confirmed; quiz answered versus contact form completed; checkout reached versus order). A campaign's two goals give both counts for the same visitors.
- **Answers going nowhere.** Questions with many answers and no campaign, flow branch, sync or email that uses them. A question asked and never used for routing or sync also costs completions.
- **Unmatched ad traffic.** On a personalized page, the share of paid arrivals that match no audience. A falling share often means new ads nobody mapped.
- **Stale content.** Dates, prices or offers that have passed, on high-traffic pages, in ads, and in RightMessage's own pop-ups and banners.

**Health checks** (a run of these means recommending a cleanup)
- Enabled widgets or flows with 0 runs (often a path typo, or an embed container lost in a site redesign). This is also how you catch something that used to work and stopped.
- Embeds pointing at deleted flows; flows that run but aren't in the flow list.
- A form whose email platform isn't connected.
- Placeholder or test copy, or typos, in anything active.
- Campaigns with no changes, no goal, holdback off, changes on another domain or staging, or audiences nobody can match (rules on a question nobody is asked, or an AND across answers a visitor can't both give).
- Two active campaigns changing the same page.
- Goals with no events, events with no page and no selector, selectors no longer on the page, goals attached to no campaign.
- Exclusions that leak (a pop-up ran on pages its widget excludes; compare with `exposurePages`), pop-ups on unsubscribe, thank-you, booking or checkout pages, and sitewide pop-ups that stack.
- Two segment groups writing the same email-platform field.

When three or more health checks hit, or any of them costs signups or sales now, put a cleanup in the recommendations (it builds with `rightmessage-cleanup`). Put the single most costly fix in the top three on its own if it's urgent, such as a dead signup form or placeholder copy before a launch.

## Keep evidence honest

For each number keep: the tool, the window and timezone, what was counted (visitors, sessions, pageviews, arrivals), and the numerator and denominator. Calculate rates with code. Missing data is "unknown", not zero.

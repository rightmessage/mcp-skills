# Router

First decide what kind of business this is and where its money step happens. That choice decides which questions you ask, which result you measure, which ideas usually win, and what you leave out. Then add any modifiers that apply. Ideas still come from the evidence: a type orders the plays, it doesn't limit them.

## 1. Business type

Pick the closest one from the site and the data; confirm it in conversation if it's unclear. Some businesses have two (a store plus a sales team for organisations); treat the one that brings most of the money as primary and note the other.

| Type | You'll see | The money step, and where it's usually measured | Plays that usually win, in order |
| --- | --- | --- | --- |
| **Sales-led service** | Book a call, demo, consultation or free session; the sale closes on a call | A confirmed booking. Booking tools often finish on their own domain, so check for a confirmation page or event | Match ad landing pages to their ads; follow up people who start booking but don't confirm; turn readers of content toward a booking |
| **Online store** | Product pages, cart, checkout (often Shopify); subscriptions or bundles | A completed order, usually on a checkout the site doesn't own. Needs a thank-you page goal or a purchase event | Measure orders; help first-time visitors find the right product (quiz or guided choice); match ad landing pages to their ads; stop discounting to existing customers |
| **Self-serve software or product with several use cases** | Pricing, trial or signup; one product described for different buyers | A started trial, signup or purchase, sometimes in an app on another domain | Learn the use case once, then describe the product their way across home, pricing and product pages; measure the signup |
| **Application or high-ticket program** | "Apply now", cohorts, waitlists, application forms (often a form tool), then a call | A submitted application, then a sale on a call | Measure applications; tailor the program page to the applicant's situation; follow up started-but-unfinished applications; time messages to the cohort or launch |
| **Course, membership or digital products sold from content** | Articles, videos or a podcast lead to lead magnets; products sold on a course platform or another domain | A purchase on the course platform. Often only a "joined" page or a tag shows it | Measure purchases; make the post-signup page and article endings point to the product that fits; use answers in the email that sells |
| **Publisher or content site** | Many articles, many lead magnets, often a pile of pop-ups; revenue from subscriptions, memberships or sponsorship | A subscription or signup | One decision map instead of a pile of pop-ups; the right offer for the topic being read; stop asking subscribers to sign up again |
| **Low-price first offer (tripwire)** | A small paid offer right after signup, then an upsell | The first purchase, often on another host | Measure the purchase; put the offer on the confirmation page for the right people; keep pop-ups off the offer page |

If none fits, say so, describe the business in a sentence, and pick plays from the table below by evidence.

## 2. Modifiers

Apply each that's true; they move plays up or add questions.

- **Paid traffic.** Ad spend lands on site pages. Move "match landing pages to their ads" and "unmatched ad traffic" up. Ask the ad questions in questions.md. Without paid traffic, skip them.
- **A launch, sale or deadline this month.** Check that everything for it works first (placeholder copy, script on the launch domain, goals) and rank that above everything else until the date passes. Plan what replaces it afterwards.
- **A second side of the business.** For example a store that also sells to organisations, or creators who also sell services. Note it; recommend at most one idea for it unless it's where the money is.
- **Multiple domains.** Check the script and goals on each domain where a campaign, flow or the money step lives.
- **Account needs a cleanup.** See below.
- **Sensitive answers.** Health, family, finances or similar. Use them to choose what someone sees; never repeat them back in a way that exposes them, and never infer them.

## 3. Plays

| What you found | Idea | Builds with |
| --- | --- | --- |
| The money step isn't measured, or is measured on the wrong step | Add the goal for the real result (a thank-you page or purchase event, including on another domain) and attach it where the ideas will be judged | `rightmessage-optimization` |
| The account has several broken, dead, leaking or placeholder items (see account-pull.md, "Health checks") | A cleanup: fix what costs money now, retire the rest | `rightmessage-cleanup` |
| Paid clicks land on pages with no live campaign | Match each landing page to its ads, usually one campaign per landing page with its own goal and holdback | `rightmessage-paid-traffic` |
| Several ads or a landing-page family point at one offer | Replace copies with one page that adapts to each ad | `rightmessage-paid-traffic` |
| Paid arrivals that match no audience, or new ads not yet mapped | Map the new ads; give unmatched visitors a better default | `rightmessage-paid-traffic` |
| One audience should see a consistent story across many pages (home, pricing, product) | One campaign on those pages for that audience, with one goal and holdback | `rightmessage-website-personalization` |
| Visitors arrive with a known audience (answers, CRM, referrer, page path) | Change the headline, proof and next step for that audience on the page that sells, or in a block every page shares (article endings, thank-you and confirmation pages) | `rightmessage-website-personalization` |
| Two campaigns change the same page, or personalization is live but nobody can say if it works | Fix the measurement, then read the holdback honestly | `rightmessage-optimization` |
| Several kinds of buyer, nothing to tell them apart | One short question that sorts visitors, stored and synced | `rightmessage-segmentation` |
| A survey or quiz loses people before the answer that matters, or at the contact form | Shorten it, move the question that matters earlier, or ask for less at the form | `rightmessage-optimization`, then `rightmessage-segmentation` or `rightmessage-quiz-builder` |
| Visitors want a recommendation or an assessment | A quiz with a real result and a next step | `rightmessage-quiz-builder` |
| Many pop-ups nobody can map; subscribers or customers asked to sign up again; pop-ups on the page that converts | One decision map that picks the offer, with exclusions | `rightmessage-smart-ctas` |
| Answers collected but never used afterwards | Use them in follow-up email | `rightmessage-email-personalization` |
| Known contacts view booking, pricing, application or checkout pages and don't convert, or start a form and don't finish, and no Lead alert rule covers them | Lead alert rules: email the sales team, or tag the person so an email automation starts | `rightmessage-high-intent-visitors` |
| Lead alert rules already exist but flag the wrong people (former customers, trials, poor-fit leads), flag nobody, or have alerts held | Narrow, add or reword rules, starting from what `list-lead-alerts` shows they flagged | `rightmessage-high-intent-visitors` |
| Always-on page logic is needed: tag visitors by page, load a script for one audience, send a webhook | A system flow | `rightmessage-system-flows` |
| Tracking isn't live on a domain, the widget is missing on the live site, or a publish or rollback is needed | Fix the plumbing | `rightmessage-mcp` |
| Something only the site owner can fix (an expired banner in the page itself, a 404, copy in a form tool) | Say so plainly and give the exact fix; no skill builds it | (none) |

An idea can need two skills in sequence, such as a measurement fix and then a new campaign. List both, in order.

## When the building skill isn't installed

Say which skill to install (for example `npx skills add rightmessage/mcp-skills --skill rightmessage-paid-traffic`), and give the agreed brief so the user or another session can continue.

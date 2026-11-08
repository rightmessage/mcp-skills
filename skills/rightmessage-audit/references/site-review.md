# Site review

The goal is to know which pages matter, who each one speaks to, and what it asks the visitor to do. It is not an SEO or design audit.

## 1. Map the site

1. Fetch `/robots.txt` and follow its `Sitemap:` lines. Otherwise try `/sitemap.xml`, `/sitemap_index.xml` and `/wp-sitemap.xml`. Follow sitemap indexes one level. Do this for each domain the project uses.
2. If a fetch is blocked (a bot check, a 403), try the client's web-reading tool, then `get-page-elements`, which fetches the rendered page. If nothing works, use the homepage navigation and the landing pages from the account pull, and say the sitemap wasn't readable.
3. Group URLs into families by path pattern, and count each:
   - Home, pricing, book a call or demo, apply, contact, checkout or signup.
   - Webinar, quiz, calculator, lead magnet, thank-you and confirmation pages.
   - Landing-page families (`/lp/`, `/go/`, `/offer/`, numbered or near-identical pages). Many near-copies can mean one page per ad or audience, or pages per partner or campaign; check a sample before assuming.
   - Content (blog, articles, podcast, videos), product or service pages, case studies.
4. Join each family with the account pull: visitors, paid clicks or spend, and whether a campaign, flow or goal touches it.

## 2. Pick pages to read

Read up to about 10:
- The homepage.
- The page where the most paid traffic lands, and the next one or two by ad spend.
- The page where the money step happens or starts (booking, checkout, application, signup), and its thank-you or confirmation page.
- The pricing page, if there is one.
- One page from each large landing-page family.
- The top two or three pages by traffic that aren't covered above.

Use `get-page-elements` for a page you may personalize; it returns the elements and targeting a campaign needs, and works on pages that build themselves in the browser. For others, a plain web fetch is enough.

## 3. For each page, note

- Who it speaks to, and whether it speaks to one audience or tries to speak to everyone.
- The headline and the main call to action, quoted.
- What it asks the visitor to do next, and whether that matches where the traffic comes from (an ad promise, a search, an email).
- Proof shown (testimonials, numbers, logos) and whether it fits the visitor.
- Anything stale: past dates, old prices, expired offers, ended launches. Dates on testimonials or reviews don't count. Check the ad copy that points at the page, and RightMessage's own pop-ups and banners, too.
- Placeholder or test text ("asdf", "lorem", "TODO") and obvious typos, especially in anything personalized.
- Pages that return an error but still get visits.

## 4. Summarize

Five lines at most for the user. Keep the per-page notes in the notes file.

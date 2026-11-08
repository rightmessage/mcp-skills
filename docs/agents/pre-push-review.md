# Pre-push review checklist (every Amp orb, every repo)

> **Mandatory from 2026-11-03** (approved by Brennan). Every Amp orb that changes any RightMessage repo runs this review **before it pushes or opens a PR**. This is the mcp-skills copy of the shared checklist; [AGENTS.md](../../AGENTS.md) carries the short version. This repo is public: keep private repo names, internal tooling, and private process details out of this file.

**This repo:** rightmessage/mcp-skills is a Markdown-only Agent Skills library and plugin package. There is no application, test suite, database, job system, or billing code. It has no PRs: changes are committed straight to `main` and pushed. The "app" is the skill package that `npx skills add` discovers and installs, plus the manifests in `plugin.json`, `mcp.json`, and `.claude-plugin/`. This file lives under `docs/agents/`, outside `skills/`, so it is never discovered or installed as a skill.

## 1. Who reviews
- After the author agent finishes, **the same orb spawns a reviewer subagent** (the Task/subagent tool inside the orb). Not a new orb, not a new Amp thread.
- The reviewer runs on **the strongest model available** to the orb (today: Claude Opus 5.5, high effort; use a stronger one if it exists).
- The reviewer gets **only the diff and the repo**: the base ref (usually `origin/main`), `git diff origin/main...HEAD` (or the staged/working diff if not yet committed), and read access to the checkout. It does **not** get the author's plan, reasoning, ticket discussion or self-assessment. The ticket's one-line goal is fine so it can judge intent.

## 2. Whole-repo impact hunt (the cross-file check)
For **every** changed skill name or `description`, frontmatter field, heading or anchor that something links to, reference/template file, MCP tool name, documented tool behaviour, manifest key (`plugin.json`, `mcp.json`, `.claude-plugin/*.json`), version number, scenario in `docs/evaluation-scenarios.md`, prompt in `prompts/`, or rule in AGENTS.md/CONTRIBUTING.md:
1. Search the whole repo for every caller, dependent and consumer (`rg` by skill name, file path, anchor, tool name, field name; also README skill table, AGENTS.md, CONTRIBUTING.md, evaluation scenarios, prompts, other skills' text, and the manifests).
2. Write a table: `symbol changed | each caller/dependent (file:line) | why it still works (or what breaks)`.
3. Any dependent the reviewer can't explain is a finding.

## 3. Fixed checklist (answer every line: OK / finding / N/A with reason)
1. **Auth and permissions:** every new or changed route/action/policy checks the right user and role; no admin-only path exposed. *In this repo:* skills authenticate only through the client's hosted OAuth (`mcp:use`) or a token in secure client configuration; never ask users to paste tokens in chat; never introduce internal/admin MCP tools as customer prerequisites.
2. **Multi-tenant data leaks:** every query is scoped to the account/project/user (no unscoped `find`, `all`, `where` on IDs from the request; no cross-account caching keys; no leaking another account's data in API responses, logs, PostHog or emails). *In this repo:* account workflows confirm the exact RightMessage project before any read or write; no account/project IDs, customer data, tool responses, identity-bearing preview URLs or private paths are committed.
3. **N+1 and slow queries:** eager loading where loops touch relations; indexes for new where/order columns; no full-table scans on large tables (visitors, events, contacts); pagination/chunking for bulk work. N/A in this repo for code; the equivalent check is that skills that read lists (visitor search, config version changes) complete pagination or disclose caps.
4. **Migrations:** won't lock a big table for long; have a working `down()` or a written reason they can't; safe to run while old code is still serving. N/A in this repo (no database).
5. **Background jobs:** idempotent if retried or run twice; sensible retries/backoff/timeouts; no duplicate side effects (emails, charges, webhooks, PostHog events); safe if the payload's records were deleted. N/A in this repo (no job system); the equivalent check is that skills never cause duplicate or unapproved side effects (publishes, sends, provider writes, split-test start/end) and use bounded retries when polling.
6. **Billing / Stripe paths:** any change touching subscriptions, MRR, plans, coupons, invoices, webhooks or Stripe calls is flagged explicitly. Merging such a change needs Brennan regardless of review outcome. N/A in this repo (no billing code); flag any skill text that makes pricing or plan claims.
7. **Error handling:** failures are caught at the right boundary, logged/reported (Sentry) with context, no swallowed exceptions, no user-facing stack traces, null/empty inputs handled. *In this repo:* skills tell the agent to check tool errors, pagination, returned IDs and state; a transport success is not reported as tool success; preview, publish accepted and production verified stay separate states.
8. **Tests:** new behaviour has tests; tests assert behaviour, not implementation; edge cases (empty, duplicate, other-account, retry) covered; no flaky timing assumptions. *In this repo:* behaviour changes add or update a scenario in [docs/evaluation-scenarios.md](../evaluation-scenarios.md); static validation is not a behavioural evaluation.
9. **Secrets and config:** no secrets in code, logs or the commit message; new config keys documented and defaulted safely. *In this repo:* scan the diff for tokens, OAuth credentials, account IDs and private paths; manifest changes stay valid and versions are bumped together per AGENTS.md.
10. **Front end / widget (where relevant):** no breaking change to published widget/embed behaviour; browser support; public pages still build. *In this repo:* no front end; the equivalent is the published package: skills still discovered and installable alone, every relative link resolves, each `SKILL.md` stays under 500 lines, no skill depends on root docs or siblings, and core skills depend on no optional integration (per AGENTS.md, built-in core-catalog integrations used only when connected, and platform names given as examples, are allowed).

## 4. Evidence, not opinions
- The reviewer (or author, with the reviewer checking the output) **runs the package checks** (there is no build step), then pastes the commands and pass/fail counts. In this repo that means, as relevant to the diff:
  - `npx skills add . --list` (discovery; every skill listed, no non-skill files picked up)
  - `skills-ref validate skills/<name>` for each changed skill
  - `claude plugin validate .` when manifests change
  - `npx skills add /absolute/path/to/repo --skill '*' --agent claude-code --copy -y` into a disposable directory outside the repo, checking installed skills and their references
  - a relative-link check and an `rg` scan for credentials, IDs and private paths
- If a tool is unavailable in the orb, say so in the summary rather than claiming the check passed.
- A finding without file:line and a concrete failure mode isn't a finding; a claim "this works" without a command or caller trace isn't evidence.
- Loop: reviewer lists findings → author fixes → reviewer re-checks the new diff (impact hunt again for anything newly changed) → repeat until clean.
- **Push only when every finding is fixed or justified in writing** (why it's safe or out of scope).

## 5. Review summary (this repo has no PRs: put it in the commit message body and the orb's final report)
```
## Pre-push review (subagent, <model>)
- Impact hunt: <N> changed symbols, <M> dependents checked; all OK / <exceptions>
- Checklist: auth <OK|finding|N/A> · tenancy <…> · queries <…> · migrations <…> · jobs <…> · billing <…> · errors <…> · tests <…> · secrets <…> · front end/package <…>
- Evidence: <commands run> → <results, e.g. "npx skills add . --list: 12 skills">; app started: <how, or N/A>
- Findings: <n> found, <n> fixed, <n> justified: <one line each>
- Needs Brennan: <none | migration | billing/Stripe | risky infra>
```

## 6. Merge rules this feeds
- In repos that use PRs, this subagent review counts as the one clean non-Greptile review; merge once CI is green and the review summary is clean.
- **Still goes to Brennan before merging or pushing:** migrations, billing/Stripe, risky prod infra.
- No-PR repos, including mcp-skills, run the same review before committing to main/master.

## 7. Greptile and the learning loop
- **Never request, tag or re-request Greptile on normal PRs** (never tag @greptile-apps or @codesmith). Greptile is used only on big/risky PRs that Brennan sets up himself.
- When Greptile (or a human, or a production bug) catches something this review missed, **append it below** with date, PR, what was missed and the check that now catches it, and add that check to section 3 if it's general. Then mirror the change into each repo's checklist copy.

## Misses caught by Greptile (learning loop)
| Date | PR | What the pre-push review missed | Check added |
|---|---|---|---|
| _none yet_ | | | |

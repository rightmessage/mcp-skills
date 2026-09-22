# RightMessage Skills

Teach your AI assistant how to turn visitor data into a more relevant website, quiz, CTA, or follow-up email—not just how to call RightMessage tools.

These are outcome-based playbooks for the [RightMessage MCP server](https://rightmessage.com/mcp). They help your assistant choose a useful first implementation, build it carefully, and prove the right experience reaches the right person.

## Install

With the [Skills CLI](https://skills.sh/):

```sh
npx skills add rightmessage/mcp-skills
```

The installer lets you choose skills and supported agents. To install all skills globally for Claude Code:

```sh
npx skills add rightmessage/mcp-skills --skill '*' --agent claude-code -g -y
```

Or install just one skill:

```sh
npx skills add rightmessage/mcp-skills --skill rightmessage-quiz-builder
```

The files follow the [Agent Skills standard](https://agentskills.io/specification). Use them with Claude Code, Cursor, Codex, or another client that supports that standard. Each skill is self-contained: selective installation does not require the rest of this repository.

### Claude Code plugin

In Claude Code:

```text
/plugin marketplace add rightmessage/mcp-skills
/plugin install rightmessage@rightmessage-skills
```

The plugin bundles the same skills; it does not install credentials or connect your account. In Claude surfaces that support adding custom plugin marketplaces, add `https://github.com/rightmessage/mcp-skills` and select **RightMessage Skills**. Availability depends on your client and plan; use its current plugin instructions. Do not assume installing a marketplace enables MCP access.

### Connect RightMessage separately

1. Open your assistant's MCP/connector settings.
2. Add `https://api.rightmessage.com/mcp/rightmessage` using Streamable HTTP.
3. Prefer hosted OAuth, sign in to RightMessage, and approve the `mcp:use` scope.
4. Ask your assistant to inspect your available projects and confirm the one you want.

For local clients and bearer-token setup, use the [current connection guide](https://rightmessage.com/mcp#setup). Keep tokens in your client's secure configuration—not prompts, skill files, or a repository.

Skills supply the method. MCP supplies account access and tools. Without a connection, the assistant can help plan from information you provide, but must not claim it inspected, built, or verified anything in your account. Your website builder, email platform, or ad account needs its own connection and permission for work outside RightMessage.

## Choose the job

| Skill | Use it when you want to… | What you get |
| --- | --- | --- |
| [MCP operations](skills/rightmessage-mcp/SKILL.md) | Connect, troubleshoot, review a draft, publish, or recover a change | Verified project context, diagnosis, and a controlled change/recovery handoff |
| [Account audit](skills/rightmessage-audit/SKILL.md) | Find the highest-value first or next move | Evidence-backed top three priorities and one scoped implementation brief |
| [Segmentation](skills/rightmessage-segmentation/SKILL.md) | Understand and guide new or existing leads | Useful questions/signals, a field-value map, and a downstream action |
| [Quiz builder](skills/rightmessage-quiz-builder/SKILL.md) | Build an assessment, recommendation quiz, or lead qualifier | Outcome-first flow, result/capture paths, and branch/scoring QA |
| [Smart CTAs](skills/rightmessage-smart-ctas/SKILL.md) | Show different next steps to prospects, leads, and customers | A reusable routing flow with meaningful offers and explicit exclusions |
| [Website personalization](skills/rightmessage-website-personalization/SKILL.md) | Adapt an existing page to known audiences | Page-scoped draft campaign, copy/targeting manifest, and preview matrix |
| [Paid-traffic message match](skills/rightmessage-paid-traffic/SKILL.md) | Make a landing page follow through on the ad that earned the click | Verified signal contract, a small set of treatments, and fallback tests |
| [Email personalization](skills/rightmessage-email-personalization/SKILL.md) | Actually use captured answers in follow-up | Provider-aware template, useful defaults, and a branch review—not a sent email |
| [Optimization](skills/rightmessage-optimization/SKILL.md) | Understand results and choose a defensible experiment | Measurement checks, funnel diagnosis, and a controlled test/readout |

Start with the job you already have. You do not need to run an audit before every small change or install every skill.

## Try these prompts

- “Audit this project and its website. What are the three most useful improvements? Don't change anything yet.”
- “Build a post-opt-in survey that guides new leads to the right next step. Reuse our existing CRM fields and leave the configuration in draft.”
- “Help me design a product recommendation quiz. Show me the outcomes and question strategy before building it.”
- “Stop asking known customers to join our mailing list. Draft a better CTA flow with an anonymous fallback.”
- “Personalize our pricing page for our two main audiences. Keep the original for everyone else and return previews.”
- “Check these real ad-click URLs, then propose two message-matched treatments for this landing page. Don't edit our ads.”
- “Turn these survey answers into a personalized welcome email. Use our actual platform's syntax and don't send it.”
- “Is this flow losing people at the opener or after the result? Show the evidence before recommending a test.”
- “Preview works but the live widget is missing. Find the first unverified step before changing anything.”

## How the skills work

**Understand the business → use existing data → agree one useful change → build in draft → read it back → test the whole path → publish only with approval.**

The objective is not more questions or more variants. It is a better next step: the right product, resource, form, trial, or conversation. A successful segmentation-and-follow-up setup does not have to include website campaigns.

### Safety is part of the workflow

- Confirm the exact project; never borrow IDs from examples or another account.
- Inspect existing resources and pending drafts before changing them.
- Leave new campaigns inactive and widgets disabled during construction, then explicitly review the intended activation state before publishing.
- Publishing applies the project's pending configuration—not just the one object you edited. Review unrelated changes too.
- **Not every tool is draft-only.** Integration/provider writes, personalized-email records, split-test lifecycle actions, exports, and feedback submissions have separate effects. The skills require scoped authorization rather than treating publish as a universal safety switch.
- A preview is not proof of natural audience detection, contact sync, email delivery, or conversion lift. Report what was actually tested.
- Never include real contact data, credentials, or private preview URLs in public reports or issues.

These are instructions for your assistant, not a replacement for MCP permissions or your client's approval controls. Read the files before installing them.

## Maintenance

Tool names here use RightMessage's canonical kebab-case names. Clients may expose different prefixes or underscores. Your assistant should discover registered tools and inspect their current schemas rather than copying old payloads.

Reference: [MCP catalog](https://rightmessage.com/mcp.md) · [Agent onboarding](https://rightmessage.com/agent-onboarding.md) · [Help center](https://rightmessage.com/help)

For contribution and validation guidance, see [CONTRIBUTING.md](CONTRIBUTING.md). The [design notes](docs/skill-design.md) explain the scope. No customer transcripts, account exports, or private implementation examples are included.

## License

Original RightMessage skill content is available under the [MIT License](LICENSE). These files grant no rights to third-party brands, services, or customer data.

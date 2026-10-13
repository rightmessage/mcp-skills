# Why these skills

The organizing unit is a customer outcome, not an API resource.

RightMessage can collect answers, infer useful context, route visitors, adapt pages, and connect that data to follow-up. The valuable workflow closes the loop:

**Learn something useful → store it reliably → use it to change the next step → verify the result.**

## Boundaries

- **MCP operations** handles connection, scope, troubleshooting, controlled publishing, and recovery. It is an operational runbook, not a routing index.
- **Audit** selects the business problem and first useful implementation; it is read-only by default.
- **Segmentation** enriches and guides new or existing leads. **Quiz builder** delivers a promised recommendation or assessment result. They share data objects but differ in the visitor's job.
- **Smart CTAs** choose an offer using known data. **Website personalization** changes an existing page.
- **System Flows** run always-on page-view logic without a widget. Core skills stay generic: they never name Senja or any other specific integration, because most accounts will not connect one. Integration-specific steps live in an add-on skill loaded only when that integration is connected.
- **Paid traffic** is separate because validating the arrival signal and preserving the ad promise are substantial tasks before any page variant should be built.
- **Email personalization** turns collected information into an actual follow-up artifact without pretending to send it.
- **Optimization** evaluates a defined implementation and its measurement; it does not create a large backlog of speculative segments.

Each skill contains enough safety context to work alone. Larger libraries and one-skill-per-tool wrappers would add selection overhead without improving the customer outcome.

## What informed the design

The public MCP guide, authenticated tool discovery, RightMessage's built-in survey/CTA/results-page guides, and recurring setup and implementation patterns informed the workflows. Customer-call and internal-document findings were generalized into procedures, not copied as examples or case-study claims.

Recurring problems addressed here include data collected but never used, weak result-to-offer handoffs, confusing previews with live behavior, unstable ad-name signals, unclear contact identification, and measuring interactions instead of the intended conversion.

## What this package does not do

It does not install the tracking script automatically, provision accounts, deploy a customer's website, connect their CRM without consent, send emails, edit ads, or guarantee conversion lift. Those actions require the appropriate tools, access, approval, and direct verification.

## Public references

- [RightMessage MCP](https://rightmessage.com/mcp)
- [Canonical tool reference](https://rightmessage.com/mcp.md)
- [Agent onboarding](https://rightmessage.com/agent-onboarding.md)
- [Product knowledge index](https://rightmessage.com/ai/index.md)
- [Agent Skills specification](https://agentskills.io/specification)
- [Claude plugin marketplace documentation](https://code.claude.com/docs/en/plugin-marketplaces)

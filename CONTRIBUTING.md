# Contributing

Keep this a small library of useful customer workflows, not a mirror of every MCP tool.

## Authoring

- Give each skill a distinct customer job, clear triggers, a concrete deliverable, and a verification contract.
- Use `skills/<name>/SKILL.md` with Agent Skills frontmatter. Keep descriptions specific enough for an assistant to select the right skill.
- Use `metadata.author: RightMessage` and a quoted semantic `metadata.version`. Current release: `0.1.0`.
- Keep each skill independently installable. References must live inside that skill's directory; do not require root docs, symlinks, or sibling skills at runtime.
- Put optional detail in local `references/` or `templates/`. Keep the main skill below 500 lines.
- Prefer a small worksheet, decision table, or QA matrix over a long background essay.
- Write original material. Do not copy another skill repository's playbooks, artwork, or license text without permission.

## Evidence and tool contracts

- Verify canonical tool names against the current connected catalog and [public reference](https://rightmessage.com/mcp.md). Current registered schemas win over old guide examples.
- Do not publish an authenticated connector path, account ID, tool response, private document path, or customer example from an internal session.
- Do not introduce internal/admin tools as customer prerequisites.
- Mark hypothetical examples as examples. Never add invented conversion results, unsupported benchmarks, or blanket integration claims.
- Read responses fully enough to check errors, pagination, returned IDs, and state. A successful transport response is not proof of a successful underlying tool call.
- Avoid sprawling payload examples whose nested contracts cannot be verified. Discover schemas and conditions at runtime instead.

## Safety review

Every account workflow must confirm the project, inspect before writing, preserve existing drafts, read changes back, and distinguish preview from live verification.

Configuration publishing, split-test activation/completion, integration/provider writes, feedback, exports, and email-related actions have different effects. Do not describe every mutation as draft-only. Never expand a request to include live changes, sends, or external writes without authorization.

Version-change tools describe a snapshot's next state. Inspect `compared_to`, pagination, and the whole pending scope before claiming to have reviewed the current draft against production.

## Validate before proposing a change

1. Run discovery: `npx skills add . --list`.
2. Validate each skill with the [Agent Skills reference validator](https://github.com/agentskills/agentskills/tree/main/skills-ref): `skills-ref validate skills/<name>`.
3. Validate the marketplace/plugin with Claude Code: `claude plugin validate .`.
4. Install the package into a disposable project using `npx skills add /absolute/path/to/this/repo --skill '*' --agent claude-code --copy -y`. Verify every installed skill and its local references; do not install into your real global configuration for a test.
5. Check every relative Markdown link and scan for credentials, customer identifiers, private paths, and undocumented tool names.
6. Review the scenarios in [docs/evaluation-scenarios.md](docs/evaluation-scenarios.md). If testing model behavior, record the agent/model, input, actual tool trace, and result; a static checklist is not an executed behavioral evaluation.

Never use a customer's live account as a test fixture. Mutation testing requires a separately authorized sandbox and cleanup plan. Read-only live tool checks and static package checks do not prove end-to-end production behavior.

## Releases

Bump `.claude-plugin/plugin.json` and changed skills' metadata versions for releases. Claude plugin update behavior is version-dependent; a commit alone is not a universal automatic-update guarantee. Review the public diff before pushing. Keep internal research and validation scratch artifacts outside this repository.

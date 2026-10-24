# AGENTS.md

Guidance for AI coding agents working in this repository.

## Structure

- `skills/<name>/SKILL.md` — one self-contained Agent Skill per customer job, with optional local `references/` and `templates/`.
- `plugin.json` + `mcp.json` — [Agent Plugins 1.0.0](https://agent-plugins.org/specification) manifest; skills are discovered from `skills/`, the MCP server from `mcp.json`.
- `.claude-plugin/` — Claude Code plugin and marketplace metadata.
- `docs/skill-design.md` — why skills are organized by outcome and where their boundaries sit.
- `docs/evaluation-scenarios.md` — behavioral review scenarios.
- `prompts/` — prompt material.

## Authoring skills

Follow [CONTRIBUTING.md](CONTRIBUTING.md). In short:

- One distinct customer outcome per skill, with clear triggers, a concrete deliverable, and a verification contract. Do not add one-skill-per-tool wrappers.
- Agent Skills frontmatter; `metadata.author: RightMessage`; quoted semantic `metadata.version`. Keep `SKILL.md` under 500 lines.
- Each skill must work alone: references live inside its own directory; no root-doc, symlink, or sibling-skill dependencies.
- Core skills never name a specific integration; integration steps belong in add-on skills (`rightmessage-integration-*`).
- Verify tool names against the connected catalog and https://rightmessage.com/mcp.md. Never invent tools, results, benchmarks, or integration claims.
- Account workflows must confirm the project, inspect before writing, preserve existing drafts, read changes back, and separate preview from live verification.
- Releases bump `version` in `plugin.json`, `.claude-plugin/plugin.json`, and changed skills' metadata together.

## Evaluation

Check behavior changes against [docs/evaluation-scenarios.md](docs/evaluation-scenarios.md). Static validation (`npx skills add . --list`, `skills-ref validate skills/<name>`, `claude plugin validate .`) is not a behavioral evaluation. Never use a customer's live account as a fixture.

## MCP endpoint

`https://api.rightmessage.com/mcp/rightmessage` (Streamable HTTP). Authenticate with hosted OAuth (scope `mcp:use`) or a RightMessage API token kept in the client's secure configuration.

## Never commit

API tokens, OAuth credentials, account or project IDs, tool responses, customer data, or private paths. Keep scratch and validation artifacts outside the repository.

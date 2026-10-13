---
name: rightmessage-integration-senja
description: Use only when Senja is connected to the RightMessage project. Connect Senja with an API key, list its widgets and Walls of Love, embed the matching widget per segment from a System Flow, and tag testimonials with Senja's own MCP.
license: MIT
compatibility: Requires a connected RightMessage MCP server. list-apps and get-app-resources appear only after an integration is connected and may need a new chat. Tagging testimonials requires Senja's own MCP at https://mcp.senja.io.
metadata:
  author: RightMessage
  version: '0.1.0'
---

# RightMessage Senja

This skill applies only when Senja is connected to the RightMessage project. If Senja is not connected and the user has not asked to connect it, stop. Do not load it for any other integration.

When the `rightmessage-system-flows` skill is installed, follow it for construction, safety, and publishing. This skill adds only the Senja-specific steps and stands alone: build with `create-flow` (`is_system_flow: true`), then `modify-flow`, `create-flow-node`, and `update-flow-node`; publish only with `publish-config`; do not invent an on/off switch.

## When to use

- Connect Senja to the current RightMessage project.
- Show each segment a different Senja widget or Wall of Love.
- Tag existing Senja testimonials with the same segment values a RightMessage survey collects.
- Example: “Connect Senja, then show the agency widget to the agency segment and the consultant widget to everyone else.”
- Do not use this skill to build the survey itself. Use `rightmessage-segmentation` for questions. A System Flow cannot ask questions.

## Connect Senja

1. Confirm the project with `get-project-context` and pass `project_id` on every project-scoped call.
2. Call `list-connectable-integrations` and select the Senja entry. Read the live `connect-integration` schema in the same turn and pass only the fields it lists.
3. Senja connects with an API key. The key is in the Automate section of the Senja account at `https://app.senja.io`. On `list-apps`, Senja's credential field key is `apiKey`. If `connect-integration`'s schema uses a different name, the schema wins.
4. Get permission before calling `connect-integration`. Pass the key only as that tool argument. Never repeat it in chat, a file, a flow, a preview URL, or a skill.
5. A rejected key is a failed connection. Read the tool error and stop. Do not retry with a guessed key, and do not use `create-integration` (that tool is for email and CRM providers).
6. Confirm with `list-apps`: the entry whose `key` is `senja` has `connection.connected` true. Credential values are not returned.
7. `list-apps` and `get-app-resources` appear only after an integration is connected. If they are missing after a successful connect, start a new chat so the client registers them. Do not invent a catalog call while waiting.

If `connect-integration` or `list-connectable-integrations` is not in the registered catalog, stop and say the app-connection tools are not in this session.

## Discover widgets and Walls of Love

Call `get-app-resources` with `app: "senja"`. The catalog is:

| Collection | Fields | Embed `content` |
| --- | --- | --- |
| `widgets` | `id`, `name`, `design`, `floating` | `{kind: "widget", id, name, design}` |
| `wallsOfLove` | `slug`, `permalink`, `name` | `{kind: "wall_of_love", slug, permalink, name}` |

Copy those objects from the response. Do not invent ids, slugs, or permalinks. `content: null` is an incomplete draft, not a published widget. The embed stores this public snapshot only; it does not contain the API key.

`floating: true` widgets position themselves. Target them with a page target. Inline widgets and Walls of Love need an element target unless the user explicitly wants them placed by page only.

## Embed one widget per segment

Build the System Flow with the system-flows skill. On each branch, add an `embed` node:

| Field | Senja value |
| --- | --- |
| `app` | `senja` |
| `content` | The widget or Wall of Love snapshot from `get-app-resources` |
| `target` | Element: `{kind: "element", selector, position, pages}`. Page: `{kind: "page", pages}`. |

`position` is `inside`, `before`, or `after`. `pages` is a LogicDefinition; `{and: []}` means all pages. There is no RightMessage-widget target. The embed does not block later nodes. The write checks the local Senja connection only; it does not re-fetch Senja, so read `get-app-resources` again before publish and confirm the chosen id is still listed.

Pick the widget with a `yesno` (or a chain of them) on the segment from `list-condition-sources`, then `validate-condition` before saving. One branch, one Senja widget. Give unknown and unmatched visitors a single agreed fallback widget or an `exit`. Do not stack every widget on every visitor.

The survey that creates those segments is a normal flow with a widget, built with `rightmessage-segmentation`. Keep it out of the System Flow. System Flows reject `sg`, `offer`, and `message` nodes.

Illustrative branch, not a real id:

```json
{
  "type": "embed",
  "app": "senja",
  "content": {"kind": "widget", "id": "from-get-app-resources", "name": "from-get-app-resources", "design": "from-get-app-resources"},
  "target": {
    "kind": "element",
    "selector": "#proof",
    "position": "inside",
    "pages": {"and": []}
  }
}
```

Replace every placeholder from the live catalog and the agreed selector. Use `modify-flow` or `create-flow-node` with the positioning rules in the system-flows skill. Update an existing embed with `update-flow-node` (`app`, `content`, `target`); send the whole `target` object.

## Tag testimonials by segment

Tagging happens in Senja, through Senja's own MCP at `https://mcp.senja.io`, not through a RightMessage tool and not through the browser.

1. Confirm the Senja MCP is connected and discover its current tools and schemas. Do not guess tool names from another Senja client or from this skill.
2. Use the same stable segment values the RightMessage survey stores. Display labels can change; tags should use the stored values the user agreed.
3. Tag existing testimonials with the segment they belong to. An open-ended voice-of-customer answer is not a segment and is not a tag source unless the user assigns it to one.
4. The RightMessage embed shows the widget id you picked. It does not filter testimonials at render time. The widget or Wall of Love must already include the testimonials for that segment (including any tag filter configured in Senja). Read the Senja catalog and the Senja MCP results and say so if a widget's contents were not checked.
5. If the Senja MCP is missing, stop and name that connector. Do not paste testimonials into the page, and do not put the Senja API key in a `code` node to tag them.

## Verify and publish

- Read `get-flow-summary` and check each branch's `app`, `content.kind`, id or slug, `target.kind`, selector, position, and pages.
- Preview each segment with `get-preview-url`. Preview is the draft. A forced preview does not prove the live page.
- Publishing uses `publish-config` for the whole pending project. The System Flow has no on/off switch, so approval must include it running. The survey widget, if any, still has its own `is_enabled` flag; set that only as part of the same approval.
- After publish, read `get-publish-history`, load the real page as each segment, and confirm the matching Senja widget appears once. Use `get-flow-performance` for exposure. Label any check you could not run.

## Deliverables and acceptance

- [ ] Skill used only because Senja is connected, or the user approved connecting it.
- [ ] `list-apps` shows `senja` connected; the API key was not repeated.
- [ ] Widget and Wall of Love ids copied from `get-app-resources`.
- [ ] Each segment branch embeds one matching Senja widget, with an unknown fallback.
- [ ] Testimonial tags made through Senja's MCP, or explicitly left unverified because that MCP was absent.
- [ ] Separate status for draft built, draft verified, published, and production verified.

## Pitfalls

Do not mention this skill's product details from a generic System Flow task when Senja is not connected.
Do not embed a Senja widget from a `code` node now that `embed` exists. Use `code` only for a script Senja's embed node does not cover, and say why.
Do not use a page target for an inline widget that should sit in a specific element, or an element target for a floating widget (`floating: true`).
Do not treat a saved embed as proof Senja still serves that widget.

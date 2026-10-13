# Senja webinar prompt

You don't need to use your browser at all.

Paste the prompt below into Claude or ChatGPT. It assumes the RightMessage app-connection tools from the shipped connect-integration update are available (`connect-integration`, `list-connectable-integrations`, and the gating that shows `list-apps` and `get-app-resources` only after an integration is connected).

## Before you paste

Confirm both connectors in the client's settings, then come back to the chat. Do not do the rest of this job in a browser.

| Client | What to check |
| --- | --- |
| Claude | RightMessage (`https://api.rightmessage.com/mcp/rightmessage`) and Senja (`https://mcp.senja.io`) are connected and enabled. |
| ChatGPT | The same two connectors are enabled in apps / connectors. |

If `list-apps` or `get-app-resources` is missing after Senja connects inside RightMessage, start a new chat so the client registers them.

## Prompt

You are running this entirely through MCP. You don't need to use your browser at all. If a step would require the RightMessage dashboard, the Senja website, or any page editor, stop and do it with the connected tools instead.

1. Check the connectors. Confirm the RightMessage MCP and the Senja MCP (`https://mcp.senja.io`) are both connected in this chat. Discover each server's tools and read the live schemas before calling them. If either server is missing, name it and stop. Do not invent tools, and do not switch to a browser.

2. Confirm the RightMessage project. Read `rightmessage://config/overview`, select the intended project, confirm it with `get-project-context`, and pass that `project_id` on every project-scoped call.

3. Connect Senja inside RightMessage. Call `list-connectable-integrations`, then `connect-integration` with the Senja API key from Senja's Automate section (`https://app.senja.io`). Read the live schema first; Senja's directory field key is `apiKey`. Ask me for the key once, pass it only as the tool argument, and never repeat it. Confirm `list-apps` shows `key: "senja"` with `connection.connected` true. If those catalog tools are not registered yet, ask me to start a new chat and continue there. Do not use `create-integration`.

4. Build the survey with the `rightmessage-segmentation` skill. Add two things to the agreed survey, and nothing else unless I ask:
   - A choice question that creates a segment per audience we name, using `create-segment-group` with `auto_create_question=true` or `create-question` linked to that group.
   - An open-ended voice-of-customer question as a collecting-info question (`display_type: input`, `input_type` `text` or `textarea`). It creates no segments. Do not create a legacy open-ended choice question.
   Keep the new survey widget `is_enabled=false` until I approve publication. Read every object back.

5. Tag testimonials by segment in Senja. Use Senja's own MCP. Discover its tools; do not guess their names. Apply the survey's stable segment values as tags on the existing testimonials that belong to each segment. Do not turn the open-ended answers into tags unless I assign one. If Senja's MCP cannot tag, stop and say so.

6. Build a System Flow that shows each segment its matching Senja widget. Follow the `rightmessage-system-flows` skill and the `rightmessage-integration-senja` skill.
   - `create-flow` with `is_system_flow: true`.
   - Discover widgets and Walls of Love with `get-app-resources` and `app: "senja"`. Copy `content` from that catalog: `{kind: "widget", id, name, design}` or `{kind: "wall_of_love", slug, permalink, name}`.
   - Add the tree with `modify-flow`, `create-flow-node`, and `update-flow-node`. Branch with `yesno` on the segment. Each yes-path gets one `embed` node with `app: "senja"`, that segment's content, and a target of `{kind: "element", selector, position: "inside"|"before"|"after", pages}` or, for a floating widget (`floating: true`), `{kind: "page", pages}`. Use `{and: []}` for all pages only when I want it everywhere.
   - Unmatched visitors get one fallback widget or an `exit`.
   - Do not put the survey's questions in this flow. System Flows have no on/off switch and no widget of their own.

7. Read the flow back with `get-flow-summary`. Preview each segment with `get-preview-url` and tell me what you could and could not verify. Preview is the draft.

8. Publish and verify, only after I approve the full pending project diff, including this System Flow running (it cannot be left off) and the survey widget's `is_enabled` state. Call `publish-config`. Then read `get-publish-history`, check the live page for each segment without a forced preview, and use `get-flow-performance` for exposure. Report draft built, draft verified, published, and production verified as separate states.

If a skill named above is installed, follow it when it is stricter than this prompt. Live tool schemas win over this prompt.

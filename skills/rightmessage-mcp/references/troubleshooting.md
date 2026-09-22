# Find the first broken step

Describe expected behavior, actual behavior, exact URL, project, object, visitor state, and time. Distinguish observed fact from hypothesis. Prefer a fresh test browser/context over resetting a real visitor's data.

## Connection or project failure

1. Are tools registered in this client? Are resources exposed?
2. Does an authorized read succeed, including the inner MCP result?
3. Is the exact public project ID accessible to the authenticated user?
4. Is the failure authentication, missing permission, rate limit, invalid input, or unavailable service?

A missing resource browser does not mean the account has no projects. Ask for the dashboard's public ID and verify it. Do not substitute admin lookup tools or create a new project.

Respect rate-limit/retry guidance. Retry reads with narrower scope when useful; inspect state before retrying writes. Never request credentials through chat to diagnose a 401.

## Widget missing or preview works but live does not

Check in this order:

1. **Correct project:** the production page loads the expected RightMessage project tag, not a different environment/account.
2. **Published state:** the required flow/widget exists in production, not only in the draft. Review publish history and, where browser access permits, the actual loaded tag/runtime evidence.
3. **Eligibility:** widget enabled, linked to the intended flow, matching visibility/audience/frequency rules. A disabled widget should not be fixed by publishing unrelated drafts.
4. **Placement:** inline widget has the correct configured area in the rendered document; the runtime uses `.rm-area-<configured area>`. Do not guess an area name. An element inside an iframe is different from a child in the top-level DOM.
5. **Visitor state:** prior answers, dismissals, lifecycle exclusions, and frequency may legitimately suppress the widget or skip questions.
6. **Browser/site:** script blocking, consent rules, cache, DOM timing, unsupported nesting, or conflicting code—only after the configuration checks.

`list-widgets` does not know every page where an inline embed was placed. Inspect the website or use `get-flow-performance` exposure pages for evidence, and label missing observations.

## A flow skips a question or goes to the wrong result

- Read `get-flow-summary`, not only `get-flow`'s flat nodes.
- Check each asking segment-group node has a linked question and mapped answer options.
- Verify ask-versus-route behavior, existing visitor segments, branch priority and rejoining paths.
- Compare a fresh visitor with a previously answered visitor.
- Check multi-select conflict rules, score accumulation, ties, zero scores, and threshold boundaries where relevant.
- A form is represented by an offer node pointing at a form resource. Only supported message/redirect continuation should follow that form in its branch; don't assume later scoring/questions will run after submission.
- A forced result preview does not prove the scoring path assigned that result.

## Answers missing from the email platform/CRM

Trace one authorized test contact through the actual path:

**Entry URL → browser identity → answer/segment → mapped field/value → destination contact → intended follow-up.**

Check the provider connection, actual field ID/key and type, stored value, mapping, and permitted sync behavior. A contact existing in the CRM does not prove this browser is identified. Compare a working and failing path before choosing a cause.

Do not fabricate an email query parameter or identity API call. Use the integration's current supported mechanism. Do not put real email addresses or contact fields in publicly shared test links.

If considering Email Watcher for third-party forms, verify that submitted addresses belong to the visitor. Gift, referral, or staff-entered forms may contain someone else's address; do not enable identification indiscriminately. Review consent and get approval for the supported setting change.

A mapping saved successfully is “configured.” A read of the expected destination contact/field is evidence of writeback. If provider read access is missing, say “writeback unverified” and provide the owner the exact contact/field check privately.

## Wrong page personalization

- Inspect actual elements and current targeting; do not start by widening the selector.
- Check page scope on each action, audience match, overlapping variants/campaigns, active state, and default behavior.
- Separate acquisition context from persistent visitor facts. Missing click parameters should not silently retain yesterday's temporary angle unless explicitly designed that way.
- Test both matching and nonmatching pages; check mobile duplicates and links/forms.
- Verify runtime behavior without preview overrides after an authorized publish.

## Escalation packet

Provide: expected/observed behavior, authorized project/object references, timestamps/timezone, minimal reproduction, checks completed, sanitized error/request IDs, one working-versus-failing comparison, and remaining hypotheses. Do not assert a root cause that the evidence does not isolate. Submit feedback only with permission and describe queued acceptance accurately.

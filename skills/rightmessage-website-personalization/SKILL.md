---
name: rightmessage-website-personalization
description: "Use when personalizing website copy, proof, or CTAs with RightMessage; creating audience-specific page variants; or checking page targeting, conversion goals, and preview QA."
license: MIT
compatibility: "Any Agent Skills-compatible client. A live RightMessage MCP connection is required for account operations; browser access or user-run checks are needed for visual and functional QA."
metadata:
  author: "RightMessage"
  version: "0.2.0"
---

# Website personalization

Make one existing page more relevant to a known need or arrival context. Deliver a coherent message, appropriate proof, and a useful next step—not random word swaps or a new website.
Use the skill-local [page treatment workbook](templates/page-treatment-workbook.md) for the signal contract, copy, targeting manifest, and QA record.

## When to use

- Tailor a real landing, product, service, or sales page for an evidenced audience.
- Improve the relevance of the headline, explanation, proof, objection handling, or CTA together.
- Review an existing personalization draft for targeting conflicts, weak goals, and unsafe defaults.
- Do not use this as authority to rebuild forms, edit source-page files, change an offer, or modify ads.

## Inputs and safety preflight

1. Resolve the exact public project ID from the MCP resource `rightmessage://config/overview`; there is no `list-projects` tool. If resources are unavailable, ask for the dashboard's public project ID and confirm it with `get-project-context`.
2. Discover the connected client's live tool names and input schemas; names can be namespaced or normalized. Pass the exact `project_id` on every project-scoped operation, including where optional. Never guess IDs, fields, or condition syntax.
3. Establish one real target URL, the visitor's intended next step, available audience evidence, approved claims/proof, and the confirmed-success outcome. Retrieve authorized context before asking for missing inputs.
4. Read relevant campaigns, segments, goals, and dependencies. Capture `list-config-versions` and every page of `get-config-version-changes`; retain the baseline and existing draft work, including unrelated changes.
5. Agree the proposed copy, page scope, audience rules, object changes, and control policy before configuration writes. Without approval, stay read-only and deliver a proposal.
6. Recheck the draft/version immediately before writing. If it changed, reconcile with the owner; never discard someone else's draft, deactivate production resources, or run undo/restore to clean up a generic error.
7. Build new campaigns with `is_active=false` explicitly. Never publish automatically. An approved draft build is not permission to activate or publish it.
8. Immediate external writes are not protected by configuration drafts: integration changes, ESP field creation, personalized-email jobs, exports, and split-test start/end need separate scoped permission. Do not perform them for this page task.
9. Read back the exact target after every mutation. After an ambiguous failure, inventory the target before retrying to avoid duplicate objects or partial replacement.
10. Without a live connection, produce only a provisional workbook; do not claim to have inspected, created, or verified account state. Never request secrets in chat.

A version change list compares its snapshot to the next state shown by `compared_to`. Paginating one transition does not establish the full draft-versus-production diff. Account for the published baseline and every relevant later transition/current resource, or use dashboard review; stop publication if the full pending scope remains unknown.

## Procedure

### 1. Select a material treatment

- Choose one destination with an observable eligible audience. Do not fan out across the site to compensate for weak evidence on the first page.
- State the hypothesis as signal → audience context → relevant message/proof/CTA → confirmed outcome.
- Keep only distinctions that change the explanation, evidence, objection addressed, or next step. If variants mean the same thing, consolidate them.
- Pair each proposed claim with an approved source. Never invent a testimonial, performance figure, customer logo, guarantee, capability, or offer.
- Preserve the ad/referral promise, price, offer terms, qualification rules, existing form, and downstream destination unless separately approved.
- Leave unknown, unmatched, invalid, and excluded visitors on the original page. Do not add empty no-op variants just to represent the default.
- **Checkpoint:** the workbook has approved treatment copy, evidence, unchanged invariants, and a clear default.

### 2. Establish the audience contract

- Reuse suitable existing segments after reading their actual conditions and backing data. A segment name is not evidence of its semantics.
- Record the signal key/source, allowed values, observed evidence, lifetime, precedence, and absent/invalid/conflicting behavior.
- Prefer explicit, stable signals; a referral or ad angle describes context, not a visitor's personal attributes. Never infer sensitive traits from a click.
- For arrival signals, inspect the actual resolved URL. Use legacy inference only if an approved higher-priority key is absent, not when it is present but invalid.
- Discover `list-condition-sources` and validate final conditions with `validate-condition`. Use the current DNF structure `{or:[{and:[...]}]}` and supported operators. Campaign rules can also use the `answers` source for previous input answers (for example business email, country, or budget range).
- New pageview/landing-page path conditions use pathname-only values; put query-parameter checks in separate conditions. Choose a supported lifetime appropriate to the signal, not permanent history for temporary arrival context.
- If new segments are approved, capture returned group/segment IDs before building dependent signals. Replacement `signals` arrays must retain all intended existing entries; read back the entire group.
- **Checkpoint:** every cohort has real evidence, validated rules, actual IDs, and tested negative cases.

### 3. Inspect the page and assign element ownership

- Call `get-page-elements` for the exact target URL. Inspect the rendered page, desktop/mobile structure, form boundaries, existing links, and any current personalization.
- Map each proposed edit to its current content and returned Smart Match targeting. Prefer that returned targeting over hand-written selectors; do not invent fingerprint fields.
- Validate one representative action against the live mutation schema before assembling a large manifest.
- Only if validation rejects the returned targeting shape, isolate the compatibility issue and consider a unique, structurally meaningful selector verified on the actual page.
- Check fallback selector matches on desktop and mobile. Ambiguous responsive duplicates, broad containers, and selectors that reach form controls are not acceptable shortcuts; leave the edit blocked or untouched.
- Give every action explicit page scope even when the campaign has `base_url`. Verify the scope matches only the intended destination.
- Keep independently composable dimensions in separate campaigns with disjoint element ownership. Check actual matched elements, not merely whether selector strings differ.
- Use peer variants within one campaign only for alternatives that should not stack. Do not multiply every dimension into a cross-product by default.
- **Checkpoint:** every action has an approved value, verified target, page scope, and one owning campaign.

### 4. Verify the goal and control policy

- Prefer a unique confirmation/success page or verified first-party success event for the primary goal. A reliable server/CRM signal may also be suitable when available and authorized.
- Prove the event represents the intended completed outcome and does not fire on failed submission, abandonment, or merely viewing the form.
- Treat a CTA click or intermediate form interaction as diagnostic, not the primary conversion when confirmed success is available.
- Reuse a valid goal where possible. For approved changes, preserve the complete `events` array, then read back the goal's event contract and returned ID.
- Record the eligible population, goal linkage, explicit testing/holdback policy supported by the live schema, and intended review window. Do not assume a universal control percentage.
- **Checkpoint:** goal semantics and linkage are verified, or measurement is explicitly blocked—not silently replaced with clicks.

### 5. Build only the approved inactive draft

- Reuse existing suitable resources without erasing their settings. For a new campaign, create an empty inactive shell with explicit `is_active=false`, `base_url`, goal IDs, and the approved testing policy.
- Probe an intended action in that approved new shell before bulk construction. Never strip an existing campaign's actions merely to run a probe.
- Supply `segment_ids` as a comma-separated string of actual returned segment IDs, not an array; validate its matching semantics against the live schema.
- `update-campaign` with `changes` replaces **ALL variants/actions**. Send the complete intended manifest, including unchanged actions that must remain; never send only the delta.
- Preserve complete replacement arrays for campaign `changes`, group `signals`, and goal `events`. Keep before/after manifests for review and recovery.
- Read back each campaign after mutation: inactive state, testing settings, goal IDs, variant/action counts, audience rules, values, targeting, and per-action page scopes.
- Compare requested and stored counts programmatically where needed. A successful response alone is not proof of a complete draft.
- **Checkpoint:** stored objects match the approved complete manifest, and no unapproved production or external state was changed.

### 6. Separate rendering previews from natural routing

- Use `get-preview-url` to generate supported forced-segment previews for every material variant and meaningful compositional combination. Keep account preview URLs private.
- A forced preview proves only the displayed treatment under forced state; it does not prove natural audience detection, traffic coverage, attribution, or conversion tracking.
- Test unforced routing with actual supported inputs: matched, no-match, invalid, conflicting, excluded, fresh, returning, and expired-state cases. Include an unrelated page to verify scope.
- Use the preview mode supported by the live tool. If inactive-draft or unforced behavior cannot be exercised, mark those checks pending; do not activate or publish merely to obtain evidence.
- Check desktop and mobile readability, wrapping, layout, accessible link/button meaning, original-page fallback, and absence of competing element writes.
- Verify existing form validation, submission, redirect, offer terms, attribution fields, and the confirmed-success event. Use only approved test identities and submission paths; incognito does not prevent external writes.
- Record each case as pass, fail, or unverified with evidence. A generated link is not a completed browser test.
- **Checkpoint:** the QA record distinguishes stored-draft checks, forced rendering, natural routing, and downstream outcome verification.

### 7. Hand off; do not auto-publish

- Return the workbook, actual created/updated IDs, complete manifest, private preview matrix, readback findings, and unresolved approval or QA gates.
- Label status precisely: proposed, inactive draft built, stored draft verified, browser QA complete, published, or production verified. Do not collapse these stages.
- Publishing is project-wide. A later publish request requires explicit approval of the **full current diff**, including unrelated draft changes, final activation states, copy, functional/mobile QA, and an exact rollback version/plan.
- Recheck the version/diff immediately before any separately authorized release. A cutover that disables old campaigns while replacements remain inactive is blocked, not ready.
- Restore/undo requires confirmation of its destructive scope and exact target version; do not roll back automatically after an error.
- After an authorized release, read back published state and verify the natural production path separately. Until then, report production behavior as unverified.

## Pitfalls

- Superficial noun swaps do not fix an irrelevant offer or unsupported proof.
- `base_url` alone does not confine actions; different selectors can still target the same element.
- Missing audience data is not proof of zero eligible visitors. Record evidence gaps instead of inventing coverage or uplift.
- A perfect forced preview can coexist with broken matching, stale visitor state, or a broken form.

## Completion check

- [ ] One real page, meaningful treatments, sourced claims, and original-page default documented.
- [ ] Live project/schema resolved; existing draft and complete arrays preserved; each mutation read back.
- [ ] Confirmed-success goal, inactive campaigns, page-scoped actions, and disjoint targeting verified.
- [ ] Desktop/mobile, form, negative-state, forced-preview, and natural-routing results explicitly labeled.
- [ ] Full-diff/activation/rollback gates remain visible; nothing published without separate approval.

Public capability reference: [RightMessage MCP documentation](https://rightmessage.com/mcp.md). The connected server's current schemas govern execution.

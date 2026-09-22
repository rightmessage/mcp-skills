# Page treatment workbook

Fill this in with the user's verified account evidence. Bracketed fields are prompts, not runnable payloads or real IDs. Keep completed workbooks and preview URLs private when they contain account data.

## Scope and approval

- Public project ID and context verification: [exact value and read evidence]
- One target URL: [actual destination]
- Visitor's job and intended completed outcome: [description]
- Proposed relevance hypothesis: [signal → context → material treatment → outcome]
- Draft-building approval and copy approver: [scope, owner, evidence]
- Baseline published version and current draft version: [actual returned values]
- Full paginated draft diff reviewed: [evidence; unrelated work to preserve]
- Version recheck before writes: [result; reconcile any changes]
- Resources reused / added / untouched: [inventory]
- Unchanged invariants: [offer, claims, price/terms, qualification, form, destination, attribution]
- Release status: [proposal / inactive draft / stored draft verified / QA complete / published / production verified]

## Signal contract

| Cohort | Source/key | Allowed values and match rules | Observed evidence | Lifetime/expiry | Precedence | Absent/invalid/conflicting behavior | Owner |
|---|---|---|---|---|---|---|---|
| [material cohort] | [actual signal] | [explicit set; case/encoding rules] | [URL or authorized data] | [supported duration] | [defined priority] | [original page unless another approved rule applies] | [owner] |
| Unknown or excluded | No qualifying evidence | Not a catch-all personalized variant | [negative cases] | Not applicable | Exclusions take agreed precedence | Original page | [owner] |

- Actual group and segment IDs: [returned IDs only]
- Backing integration semantics, if used: [verified meaning, not label alone]
- Condition-source/schema discovery: [result]
- Complete intended conditions and validation result: [DNF; path/query separate]
- Existing signals retained in replacement arrays: [manifest and comparison]
- Returning/sticky-state behavior and expiry check: [expected behavior]
- Evidence missing and build implications: [blocked, proposal-only, or verified]

## Copy and proof matrix

Use a row for each material treatment. Explain why each difference helps; do not fill every cell just to maximize edits.

| Cohort | Visitor context supported by evidence | Headline/subhead | Supporting explanation or objection | Proof and approved source | CTA text and unchanged destination | Why this is materially more relevant | Approval |
|---|---|---|---|---|---|---|---|
| [cohort] | [known need; no invented traits] | [proposed exact copy] | [proposed exact copy] | [existing approved evidence] | [label and actual link] | [decision helped] | [pending/approved] |
| Unknown/default | Not enough reliable context | Original page | Original page | Original page | Original page | Avoid an unsupported assumption | [confirmed] |

- Claims not yet supported: [omit or block; do not fabricate]
- Treatment combinations to read as a whole: [family/context combinations, if any]
- Form boundaries and content that must remain untouched: [actual elements]

## Targeting and complete action manifest

| Owning campaign/layer | Variant and actual segment IDs | Element's existing content | Exact page scope | Returned Smart Match targeting | Proposed action/value | Fallback only if validation rejects targeting | Evidence of unique match and disjoint ownership |
|---|---|---|---|---|---|---|---|
| [actual or proposed campaign] | [IDs; serialize segment_ids as a comma-separated string] | [baseline] | [required even with base_url] | [returned structure] | [live-schema action] | [rejection evidence plus verified selector, or none] | [desktop/mobile results; no shared matched elements] |

- `get-page-elements` inspection evidence: [target URL and rendered context]
- Representative action validation: [accepted shape or compatibility blocker]
- Original action manifest saved: [complete private record]
- Replacement `changes` manifest: [ALL variants/actions, including preserved entries]
- Complete `signals` / goal `events` retained if touched: [records]
- Campaign configuration: [is_active=false; base_url; actual goal IDs; explicit testing policy]
- Requested versus read-back counts: [campaigns; per-campaign variants and actions; reconcile every mismatch]
- Exact-target readback after every mutation: [object, result, unresolved differences]
- Ambiguous mutation/retry handling: [inventory first; remaining partial state]

## Measurement contract

- Primary completed outcome: [specific success, not an intermediate click]
- Goal ID and verified success event/page: [actual readback]
- Why this event proves success: [success and negative test evidence]
- Secondary diagnostics: [click, form interaction, or other intermediates; labeled separately]
- Eligible population and exposure definition: [not all site visitors by default]
- Control/holdback and review rule: [approved; supported by current schema]
- Requested/returned reporting dates, timezone, freshness, denominators: [if measured]
- Missing measurement and uncertainty: [unknown, not zero; no unsupported uplift claim]

## QA matrix

Repeat cohort and combination rows until every material treatment is covered. A preview link without an observed result is unverified.

| Case | URL/device and fresh/returning state | Actual input | Forced preview or unforced routing? | Expected page/goal behavior | Evidence and actual result | Pass/fail/unverified |
|---|---|---|---|---|---|---|
| Each matched cohort | [desktop and mobile] | [valid signal] | [label] | Coherent approved treatment | [evidence] | [status] |
| Independent layers combined | [desktop and mobile] | [compatible signals] | [label] | Layers stack without shared targets | [evidence] | [status] |
| Unknown/untagged | [fresh] | No qualifying input | Unforced | Original page | [evidence] | [status] |
| Invalid explicit signal | [fresh] | Present but unsupported/empty value | Unforced | Original page; no legacy rescue | [evidence] | [status] |
| Conflicting/excluded | [fresh] | [contract's conflict or exclusion] | Unforced | Agreed safe default | [evidence] | [status] |
| Expired or changed context | [returning] | [old then new signal] | Unforced | Lifetime/precedence respected | [evidence] | [status] |
| Other page | [actual out-of-scope URL] | Valid audience | [label] | No action applied | [evidence] | [status] |
| Form failure/abandonment | [approved test context] | Invalid or incomplete submission | [label] | Form works; no primary success | [evidence] | [status] |
| Confirmed success | [approved test context] | Authorized successful submission | [label] | Existing redirect/attribution preserved; primary goal fires correctly | [evidence] | [status] |

- Mobile wrapping/layout, accessibility, links, and responsive duplicates: [results]
- Test identity/submission authorization and external side effects: [scope]
- Checks impossible while inactive or without browser access: [pending; do not mark passed]
- Forced rendering does not establish natural matching, production delivery, or conversion tracking: [separate evidence for each]

## Release gate and handoff

- Inactive draft objects and private preview links: [actual returned references]
- Remaining copy, targeting, browser, form, and measurement blockers: [owner and next check]
- Latest full project-wide diff reviewed, including unrelated changes: [evidence]
- Intended activation states and legacy cutover: [no all-inactive gap]
- Explicit release approval: [not implied by draft approval]
- Exact rollback version, scope, and owner: [review before restore/undo]
- Post-release version readback and natural production verification: [pending unless actually authorized and completed]
- Immediate external changes: [none, or separately approved and read back]

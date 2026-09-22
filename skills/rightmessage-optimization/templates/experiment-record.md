# RightMessage measurement and experiment record

Use only the sections relevant to this stage. Leave absent evidence “unverified,” not zero. Keep this record private to the authorized customer; use test identities without copying contact data.

## Scope and business purpose

- Mode: planning-only / read-only baseline / approved draft / approved live operation / readout
- Confirmed public project ID and actual target asset IDs:
- Business model and acquisition path:
- Commercial outcome and distinct proxy measures:
- Learn → segment → sync → act, including the visitor's meaningful next step:
- In-scope objects, dependencies, placement, and exclusions:
- Published version / draft baseline / unrelated draft work:

## Measurement contract

| Measure | Source | Requested dates | Returned dates and timezone | Exposure / conversion unit | Numerator / denominator | Freshness and caveats |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

- Retrieval timestamp and reporting boundary semantics:
- Eligible population and actual exposure pages:
- Primary goal ID, confirmed-success event, and verified asset linkage:
- Unique/repeat counting and attribution window, or unknown semantics:
- Anonymous versus identified coverage:
- Identity and downstream writeback proof, if relevant:
- Excluded traffic and reasons:
- Missing/delayed events, rounded windows, or incompatible buckets:
- Measurement ready for testing: yes / no / unverified, with evidence:

## Diagnosis

| Observation and source | What it establishes | What it does not establish | Hypothesis or repair | Exact verification |
| --- | --- | --- | --- | --- |
| | | | | |

## Next action (up to three recommendations if useful)

Fill only the rows warranted by this review; do not invent additional recommendations to complete a table.

| Rank | Action | Business reason / evidence | Effort and dependencies | Owner | Verification |
| --- | --- | --- | --- | --- | --- |
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

Selected next action and why it comes first:

If measurement is broken, stop here with a scoped repair contract. Do not fill the following sections with an invented experiment.

## Experiment specification, only when justified

- Single hypothesis:
- Supported mechanism: resource split test / separately verified campaign holdout:
- Actual resource type and ID, from current schema and reads:
- Existing control treatment; implicit control is not an extra supplied variant:
- Non-control treatment and meaningful next-step change:
- Flow variant: one non-control variant with complete `funnelDefinition`, if applicable:
- Eligibility, assignment, repeat-visitor behavior, and exclusions:
- Allocation: balanced for resource split tests; otherwise exact verified campaign contract:
- Primary outcome, secondary diagnostics, and guardrails:
- Unchanged elements, other active tests, and confounders:
- Planned start timestamp and timezone:
- Planned end/review timestamp and timezone:
- Sample/duration rationale, outcome lag, stopping rules, and uncertainty:
- Analysis method, including limitations if power/confidence is not available:
- Default, missing-signal, and conflicting-state behavior:

## Approval and readback ledger

Each line needs explicit scope, not a general “go ahead.” Planned dates are not approvals, and draft approval does not authorize immediate side effects.

| Operation | Exact target / scope | Authorized by and when | Approved timing / version | Readback evidence | Remaining gate |
| --- | --- | --- | --- | --- | --- |
| Configuration draft changes | | | | | |
| Draft split-test record creation | | | | | |
| Start exact test | | | | | |
| Publish complete project diff, including activation | | | | | |
| End exact test / explicit winner choice | | | | | |
| Publish promoted winner and complete new diff | | | | | |
| Recovery, only if separately approved | | | | | |

- Explicit inactive/disabled states during configuration construction:
- Full-diff review, unrelated-work resolution, and last version recheck:
- Rollback version, scope, expected impact, and approval:
- External dependencies left untouched; no automatic email, integration changes, exports, or feedback:

## Functional proof

| Case | Expected treatment / route | Goal or downstream check | Evidence | Pass / fail / unverified |
| --- | --- | --- | --- | --- |
| Control | | | | |
| Non-control variant | | | | |
| Missing / conflicting signal | | | | |
| Excluded visitor | | | | |
| Fresh / returning visitor | | | | |
| Relevant desktop / mobile path | | | | |

- Draft rendering proof:
- Natural assignment and production delivery proof, separately:
- Authorized test-contact downstream proof, separately:

## Readout, only after real measurement

| Arm | Actual window / population | Exposures | Confirmed conversions | Rate and denominator | Guardrail / quality concerns |
| --- | --- | --- | --- | --- | --- |
| Implicit control | | | | | |
| Approved variant | | | | | |

- Calculation tool/method and comparability checks:
- Absolute percentage-point difference:
- Relative change, only with nonzero control rate:
- Confidence/significance source, method, and assumptions, or “not established”:
- Observational findings versus design-supported causal conclusions:
- Allocation imbalance, confounders, repeated looks, or missing outcome lag:
- Decision: continue to agreed review / inconclusive / request approved end and winner decision:
- Next action, owner, and verification:

## Final state

Report each stage independently: planned; draft built; draft verified; test started; configuration published; delivery verified; test ended; winner in draft; winner published; downstream outcome verified.

List unperformed checks and approvals still needed. Do not label an active record as verified delivery, an ended test as a published winner, or a suggested experiment as a test that actually ran.

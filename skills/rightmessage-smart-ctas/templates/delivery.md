# Smart CTA delivery worksheet

Fill this from approved requirements and observed account state. Blank evidence is unverified, not a pass.
Keep the account-specific copy private; remove contact data and sensitive URLs before sharing.

## Scope

- Project and confirmation evidence:
- Business outcome and confirmed-success event:
- Page/placement and actual embed evidence:
- One meaningful audience split:
- Why each next step is different:
- Reused signals versus necessary questions:
- Excluded pages/audiences and existing widget overlap:
- Approved configuration changes:
- Separately authorized provider actions, if any:
- Copy owner and approver:

## Routing and data contract

| Priority/audience | Actual signal source and backing ID | Stored value/type and meaning | Identity/freshness requirement | Offer or capture destination | Missing/conflict rule |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

- Customer-over-lead-capture rule:
- Multi-valued interest precedence:
- Anonymous/unknown fallback:
- Dismissal/revisit policy:
- Actual provider operation, sync mode, and overwrite rule:
- Fields deliberately left unchanged:

## Draft manifest

| Resource | Returned ID | Reused/created/updated | Dependency or binding | Exact readback evidence |
| --- | --- | --- | --- | --- |
| | | | | |

- Baseline version and existing unrelated draft changes:
- Complete flow-summary tree checked:
- Questions linked and routing before terminal forms:
- Widget `flow_id` and verified `is_enabled=false`:
- Placement instructions and any unverified embed dependency:

## QA evidence

| Case | Expected route/suppression | Actual observation | Evidence source | Pass/fail/unverified |
| --- | --- | --- | --- | --- |
| Each positive branch | | | | |
| No match / missing / unknown value | | | | |
| Customer also matches subscriber or interest | | | | |
| Excluded page / audience / competing widget | | | | |
| Anonymous / identified / returning | | | | |
| Mobile / desktop | | | | |
| Form confirmation / redirect | | | | |
| Authorized test-contact provider writeback | | | | |

Distinguish forced previews from natural matching and actual provider readback. Use non-identifying test labels.

## Release and handoff

- Status: proposed / draft built / draft verified / published / production verified / writeback verified:
- Not-live statement, if still a disabled draft:
- Remaining permissions, blockers, and owner checks:
- If release requested: complete project-wide diff, activation states, approval evidence, rollback version:
- Published version and production evidence, only if actually verified:
- Next owner action:

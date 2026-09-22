# Question, action, and writeback worksheet

Complete this alongside the segmentation skill. The worked example is fictional and illustrates choices, not a ready-to-run account payload.
Use the customer's approved assets and terminology. All IDs must come from the selected project's live inventory or mutation responses.

## A. Entry agreement

| Decision | Fill before building |
|---|---|
| Entry | Post-opt-in confirmation or existing-list survey; actual page and widget placement |
| Respondent benefit | What useful guidance appears immediately after answering? |
| Existing promise | Download, confirmation, or access that must remain available without completing the survey |
| Recognition | Supported identification method, provider, and point in the journey where it runs |
| Missing identity | Anonymous-safe recommendation; no claim of contact writeback |
| Re-entry | Skip known answers, or explicitly offer a preference-update mode |
| Conversion | Confirmed downstream action and how it can be checked |
| Ownership | Copy approver, provider owner, website owner, QA owner |
| Boundaries | Allowed draft writes; separately approved provider writes; no sending |

A subscriber arriving from an email may still be anonymous to the page. An email address in a URL is not, by itself, a reviewed identification contract.
Inspect the provider-supported mechanism and test the actual redirect chain. Keep personal identifiers out of public preview URLs and reports.

## B. Worked data-to-action map

Fictional context: a business teaches audience growth and selling. The named materials below must exist or be approved before they become promises.

| Dimension | Reuse or ask | Display answer | Stable value example | Resulting action |
|---|---|---|---|---|
| Why: learning priority | Reuse a current trusted preference; otherwise Q1 | Attract new subscribers | `grow_list` | Recommend the audience-building starter guide |
| Why: learning priority | Same dimension | Turn subscribers into customers | `improve_sales` | Ask Q2, then recommend a relevant sales guide |
| Why: learning priority | Same dimension | I'm exploring | `explore` | Offer the resource index without extra questions |
| Offer context | Ask Q2 only if it changes the material | Services / Digital products / Still deciding | `services` / `digital_products` / `undecided` | Select the matching guide or a general planning resource |
| Who: implementation context | Optional Q3, only where delivery differs | Just me / A team | `solo` / `team` | Show a solo worksheet or shared checklist |

Reuse an existing equivalent field even if its name differs from the example. Do not create new fields merely to match this table.
If services and digital products would receive the same guidance, remove Q2. If the solo/team materials do not differ, remove Q3.

## C. Exact conversation worksheet

| Key | Show when | Question | Choices | Continue to |
|---|---|---|---|---|
| Q1 | Priority is unknown, or deliberate update mode | What would you like help with first? | Attract new subscribers; Turn subscribers into customers; I'm exploring | Growth result; Q2; resource index respectively |
| Q2 | Priority is sales and relevant offer context is unknown | What do you sell? | Services; Digital products; Still deciding | Service guide; product guide; general planning guide |
| Q3 | A selected guide has genuinely different solo/team implementation materials, and context is unknown | Who will put this into practice? | Just me; A team | Matching worksheet or checklist alongside the selected guide |
| Q4 | Optional feedback after useful routing information is collected | Is there something else you hoped we could help with? | Optional free text, with a clear skip | Same chosen recommendation; no automatic taxonomy changes |

For each final route, write actual copy and a real approved destination:

| Route | Example visible copy | Primary action | Missing-data treatment |
|---|---|---|---|
| Growth | Start with a practical plan for attracting your next subscribers. | Read the audience-building guide | Resource index if the guide is unavailable |
| Services | Focus your next step on turning interest into a service conversation. | Read the service-sales guide | General sales guide if offer context is unknown |
| Products | Start with the product-sales guide that matches your goal. | Read the product-sales guide | General sales guide if offer context is unknown |
| Explore | Browse the starting points and choose what fits today. | Open the resource index | This is also the intentional unknown route |

Define Q3/Q4 insertion and branch return points explicitly; do not assume a table row is an executable flow node.
Keep free-text feedback out of automatic field-value routing unless the customer approves a separate classification design.
Single-choice is appropriate here because there is one immediate recommendation. For multi-select designs, specify allowed combinations, primary-route priority, retained secondary interests, and storage representation.

## D. Field contract, one row per destination

| Contract item | Record |
|---|---|
| Semantic meaning | What the field means, and whether it describes current state or history |
| Canonical destination | Provider, existing field/tag name, actual backing ID/key, type, allowed values |
| RightMessage source | Actual group, segment, and question IDs from readback |
| Value mapping | Exact display answer → stable value; retain existing supported values where possible |
| Update rule | When an explicit answer supersedes prior data; whether conflicting tags must be removed |
| Empty/unknown rule | No write, dedicated approved value, or owner-reviewed alternative; never silently clear known data |
| Multi-select rule | Provider-supported representation, cumulative versus replacement behavior, and route priority |
| Identity prerequisite | Identification must complete at the specified entry step before contact-specific writeback is claimed |
| Evidence | Integration and mapping readbacks; direct destination-record readback for the test contact |

If a destination field is absent, present its proposed name, type, purpose, and allowed values for separate `create-custom-field` permission.
Field creation is an immediate provider action, even while the survey remains a draft. Verify its actual returned ID before wiring the mapping.
Provider setup, bulk contact edits, invitation sends, and automation changes are separate requests, not hidden prerequisites to safe draft construction.

## E. Execute a writeback proof

Use only an approved test contact; do not borrow a real subscriber. Confirm that the test will not unintentionally trigger live nurture or other provider side effects.
If safe isolation is unavailable, stop before submission and hand the exact check to the owner rather than disabling automations without permission.

| Case | Exercise | Expected evidence |
|---|---|---|
| Anonymous | Enter the real survey without identification | Useful recommendation and safe default; no unsupported claim of contact update |
| Post-opt-in | Complete the actual supported opt-in and redirect as a test contact | Identity recognized at the intended step; promised opt-in benefit still accessible |
| Existing list | Follow the supported identified invitation path | Correct test contact recognized; no duplicate opt-in |
| Missing/forwarded identity | Open a non-identified equivalent of the entry path | Anonymous-safe behavior, no guessed recipient |
| Known preference | Return with a verified existing answer | Unnecessary question skipped; correct recommendation |
| Changed preference | Deliberately change Q1 in update mode | Exact new stable destination value; no contradictory current state |
| Blank or skipped | Leave optional data blank | Prior valid destination data retained as specified |
| Unknown value | Use a supported test state not in the map | General recommendation; no broken branch or accidental overwrite |
| Every route | Exercise each Q1/Q2/Q3 combination that is reachable | Correct copy, destination, stored values, and exclusions |
| Multi-select, if used | Exercise valid combinations and conflicting choices | Agreed priority and complete provider-supported writeback |

For each run record the entry path, device, fresh/returning state, test identity alias, expected behavior, actual evidence, and pass/fail/unverified status.
Check the destination record itself after any supported sync delay; record observation time. Do not infer success from an API acknowledgement alone.
Compare a working and failing path step by step when investigating a mismatch. Stop at the first unproven step rather than inventing a provider defect.

## F. Close the loop

Deliver a concrete use of the data, for example a draft follow-up opening for `grow_list`: “Start with the audience-building guide, then use its checklist to choose your next action.”
Use real approved content and provider syntax if producing a template; otherwise deliver plain copy and the intended field/value condition.
An existing-list invitation can say: “Tell us what you want help with next, and we’ll point you toward a useful starting resource.” Include a reviewed survey link privately.
Creating these drafts does not authorize a send, broadcast, automation, or bulk update.
Record draft verification separately from publication, natural routing, identity recognition, and destination writeback; name the owner of each unverified stage.

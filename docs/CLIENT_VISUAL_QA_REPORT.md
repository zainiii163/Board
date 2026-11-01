# Client visual QA report

Updated: 2026-10-25

## Evidence

The full-stack QA pass captured responsive screenshots at 375px, 768px and 1440px for these routes:

- `/`, `/fbise`, `/punjab`, `/fbise/9`, `/punjab/9`
- `/past-papers`, `/past-papers?board=fbise`, `/books`

Evidence files are stored in `docs/qa-screenshots/`, with machine-readable route output in `docs/qa-browser-results.json`.

## Reference comparison

| Reference target | BoardNotes implementation | Result |
|---|---|---|
| 111.pdf homepage hierarchy | Dedicated FBISE hero, class cards, subject controls and resource rows | Aligned in information hierarchy; BoardNotes branding intentionally retained. |
| 113.pdf Class 9 list | Pakistan Studies absent; Tarjuma-tul-Quran present; current/new-syllabus session grouping | Aligned with the marked exclusions/additions. |
| 125.pdf Class 10 list | Islamiat absent; requested current-session labels and Chemistry PBA present | Aligned with the marked exclusion/additions. |
| Study++ Books & Notes flow | Board/class/subject resource flow and Federal/Punjab client-facing allowlist | Aligned structurally; no third-party covers/books copied. |

## Responsive checks

The completed QA run recorded no horizontal overflow across its 24 page/viewport checks. The QA report records the original pre-fix API rewrite/caret hydration observations and their remediation. A fresh browser run was attempted on 2026-10-25 but the sandbox interrupted Edge automation after the first mobile page; this is a test-environment limitation, not counted as new verification.

## Remaining visual/content gaps

- Some older screenshots may contain missing-cover 404s caused by content assets absent from the repository; they are not represented as successful resource files.
- A final release-environment run should regenerate screenshots after all licensed covers/PDFs are uploaded.
- Class 11–12 cannot match the FBISE class reference until their approved content matrix is supplied.

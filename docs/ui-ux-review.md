# UI/UX review notes (Books & Notes / Past Papers)

## Changes

- Books & Notes navigation narrowed to Federal + Punjab for clarity against Study++ / client annotations.
- `/books` page copy clarified: resource library vs Past Papers separation.
- FBISE Past Papers explorer restyled to platform accent tokens (removed generic indigo-only hero), serif title aligned with site typography, lighter shadows, clearer selected states.

## Accessibility

- Search label remains associated via `htmlFor`.
- Class/subject controls are native buttons with visible selected state.
- Source vs Download actions remain distinct labels.

## Residual console noise (non-blocking after API fix)

- React hydration warning on hero search caret style (SSR/client attribute). Low priority polish.
- Book cover 404s where assets are missing — tracked as content gaps, not UI defects.

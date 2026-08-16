# Skillpath Framer Component — Acceptance Criteria

## Required UI
- Single React code component for Framer.
- Minimal Skillpath learning-platform landing-page section.
- Hero with headline, supporting line, and one button.
- Courses section is the evaluated area.
- Footer with three links and a copyright line.

## API behavior
- Base URL: https://syncsphere-hiv6.onrender.com
- GET /assignment/course-data returns a variable-length array of 5–10 courses.
- GET /assignment/country-code returns { country_code: "IN" } or { country_code: "US" }.
- No auth; no methods other than GET.
- Do not hardcode course data.
- Handle loading, error, zero results, and working states.
- Course and country requests can fail independently; preserve usable data and show a clear fallback currency state when country lookup fails.

## Course card fields
- Course name.
- Description truncated cleanly to two lines.
- Price: IN => pricePaise / 100 formatted as Indian rupees; US => priceUsdCents / 100 formatted as US dollars.
- One useful additional field: mainCategory.

## Responsive behavior
- 3 columns desktop.
- 2 columns tablet.
- 1 column mobile.
- Grid must support arbitrary 5–10 course counts.

## Property controls
- Exactly two designer-facing controls: accent color and page background color.
- Card background remains a clean fixed neutral to keep the UI minimal.

## Optional extras selected
- Retry button on failed requests.
- Refundable badge when refundable is true.
- Skeleton loaders instead of a spinner.

## Implementation model
- `useEffect` performs both GET requests with `Promise.allSettled` so independent failures are represented cleanly.
- `AbortController` prevents stale updates on unmount/retry.
- Course response is validated as an array; malformed responses are treated as errors.
- Country response is validated; if it fails, price falls back to a neutral `Price unavailable` label rather than guessing a currency.
- Inline CSS plus one responsive stylesheet keeps the deliverable to a single Framer code file.

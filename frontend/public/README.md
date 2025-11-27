# Public Assets

Drop static assets here. Next.js serves everything in this folder at the site root (`/asset-name.png`).

## Required
- `mcgill-logo.png` – footer logo
- `confusion-matrix.png` – 2-bin classifier (2008-2010 vs 2020-2022)
- `prediction-vs-actual.png` – regression fallback scatter
- `error-distribution.png` – regression error histogram
- `temporal-accuracy.png` – accuracy per year

## Optional
- `word-cloud-2006-2010.png`
- `word-cloud-2011-2017.png`
- `word-cloud-2018-2024.png`

## Notes
- Files appear automatically in the Visualizations section.
- Missing files render a placeholder with instructions, so the page never breaks.
- See `GENERATE_VISUALIZATIONS.md` or run `python generate_visualizations.py` to regenerate charts.


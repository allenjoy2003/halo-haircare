# Halo Brand Guidelines & Assets

## Identity Summary
- **Wordmark**: `halo` (always lowercase)
- **Primary Tagline**: *"Haircare, clarified."*
- **Aesthetic**: Soft Clinical. Clean, minimalist, lab-clean, calm, premium. Generous white space.

---

## Brand Geometry & Symbol (The Halo Mark)
The Halo mark represents clarity, complete care, and precision. It consists of an open circular ring with a controlled hairline gap, anchored by a vibrant aqua dot at its focal center.

- **Open Ring**: Deep Navy `#0B1B2B` with rounded stroke caps.
- **Center Dot**: Soft Aqua `#7FD6D0`.
- **Wordmark**: Sora, lowercase, tight tracking (`-0.03em`), geometric and clean.

### Clear Space
Maintain clear space equal to at least half the diameter of the central mark around the logo mark and wordmark. Never crowd the mark with text or conflicting iconography.

### Minimum Sizes
- **Digital Mark Only**: 18px × 18px minimum.
- **Full Horizontal Lockup**: 80px width minimum.
- **Print**: 6mm height minimum.

---

## Color System

| Token | Hex | Role | Contrast / Notes |
| :--- | :--- | :--- | :--- |
| `halo-bg` | `#F4F6F8` | Cool white canvas | Soft, lab-clean background |
| `halo-surface` | `#FFFFFF` | Cards & modal surfaces | Crisp clinical white |
| `halo-border` | `#E1E6EB` | Hairline dividers & borders | 1px clean separation |
| `halo-navy` / `ink`| `#0B1B2B` | Primary text & primary CTA | High contrast, deep navy |
| `halo-muted` | `#5B6B7A` | Subtitles & secondary labels | WCAG AA compliant on white |
| `halo-accent` | `#7FD6D0` | Primary visual accent / center dot | Used for soft glows, chips, dot |
| `halo-teal` | `#2E9E96` | Deeper accessible aqua | Links, small text & focus rings |
| `halo-success` | `#2E9E6B` | Positive verification | Stock status, checkout success |
| `halo-warning` | `#D9962B` | Alerts / low inventory | Clean amber warning |
| `halo-error` | `#D14B4B` | Errors & invalid fields | Clear non-distracting red |

---

## Typography
- **Display**: **Sora** (`font-display`) — Light, Regular, Medium, SemiBold. Used for headlines and wordmark.
- **Body**: **Inter** (`font-sans`) — 300, 400, 500, 600. Precision clarity for technical copy, UI controls, and product specs.

---

## Logo Component Usage
React components are located in `src/components/brand/HaloLogo.jsx`:
- `<HaloMark size={28} variant="navy" />`
- `<HaloLogo size="md" variant="navy" withWordmark={true} />`
- Variants available: `navy`, `white`, `aqua`.

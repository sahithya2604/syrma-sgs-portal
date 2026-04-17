# Design Brief

## Direction

Enterprise Document Analyzer — B2B SaaS for AI-powered document summarization with clear sidebar navigation and minimal professional interface.

## Tone

Clean, minimal, premium: professional clarity without generic defaults. Cool light foundation with strategic teal primary and warm amber accents applied sparingly.

## Differentiation

Sidebar-driven Customer/Vendor workflow paired with elevated AI summary cards that display processed content with timestamp and file metadata in a structured, premium layout.

## Color Palette

| Token      | OKLCH           | Role                          |
| ---------- | --------------- | ----------------------------- |
| background | 0.98 0.008 230  | Light professional foundation |
| foreground | 0.18 0.015 230  | Text on light (high contrast) |
| card       | 1.0 0.004 230   | Summary card + dialog overlay |
| primary    | 0.42 0.14 240   | CTA, active states, trust     |
| accent     | 0.72 0.17 70    | Upload progress, highlights   |
| border     | 0.9 0.008 230   | Dividers, input borders       |

## Typography

- Display: Space Grotesk — modern tech aesthetic for headers and company branding
- Body: General Sans — neutral readability for UI labels and body content
- Scale: Hero `text-3xl font-bold`, Labels `text-sm font-semibold`, Body `text-base`

## Elevation & Depth

Subtle shadows on cards (`shadow-sm` for hover states). Fixed header with minimal shadow. Sidebar elevated above content with clean border-right.

## Structural Zones

| Zone    | Background  | Border       | Notes                    |
| ------- | ----------- | ------------ | ------------------------ |
| Header  | bg-card     | border-b     | Fixed, company branding  |
| Sidebar | bg-sidebar  | border-r     | Active state highlight   |
| Content | bg-background | —          | Main grid for summaries  |

## Spacing & Rhythm

Spacious vertical gaps (24px between sections). Compact horizontal density for sidebar. Alternating subtle backgrounds for content sections. Micro-spacing: 4px/8px for button padding, 12px for card padding.

## Component Patterns

- Buttons: `bg-primary` for primary, `bg-secondary` for secondary, with minimal padding
- Cards: `rounded-lg` with subtle shadow on hover, clean white background
- Badges: Muted background with foreground text, `rounded-sm` for file tags

## Motion

- Entrance: Sidebar slide from left (150ms ease-out), dialog fade in (200ms ease-out)
- Hover: Button/card shadow lift with 150ms ease, no scale
- Transitions: Smooth opacity for state changes

## Constraints

- No decorative gradients on text or buttons
- No animations beyond entrance + hover states
- Sidebar active state uses primary color + bold font weight
- All color values strictly via CSS tokens, no arbitrary hex

## Signature Detail

Sidebar navigation with clear Customer/Vendor distinction, paired with premium AI summary cards displaying file metadata and timestamp — the interface prioritizes information clarity over decoration.

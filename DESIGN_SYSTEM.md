# SmartCampus – Design System & UI Specification

**Version:** 2.0.0 (Award-Standard SaaS Redesign)  
**Base Architecture:** Tailwind CSS v4 + Pure CSS Variables (`:root`, `.dark`) + Recharts + Lucide React  

---

## 1. Brand & Palette Tokens

### 1.1 Brand Scale (Green / Emerald)
- **50:** `#ecfdf5` (Subtle tinted surfaces, light chips)
- **100:** `#d1fae5` (Hover states, light badges)
- **200:** `#a7f3d0` (Soft border strokes)
- **300:** `#6ee7b7` (Active accents)
- **400:** `#34d399` (Secondary gradients, glowing borders)
- **500:** `#10b981` (Primary Brand Core)
- **600:** `#059669` (Deep interaction fill, buttons)
- **700:** `#047857` (High-contrast text on light)
- **800:** `#065f46` (Dark mode surface tint)
- **900:** `#064e3b` (Deep branding headers)
- **950:** `#022c22` (Deepest forest contrast)

### 1.2 Role Accent Tokens (Consistent with Login Demo Matrix)
- **Admin Portal:** `#8B5CF6` (Violet / Purple) | Background: `rgba(139, 92, 246, 0.12)`
- **Student Portal:** `#3B82F6` (Electric Blue) | Background: `rgba(59, 130, 246, 0.12)`
- **Staff / Employee Portal:** `#F59E0B` (Amber / Gold) | Background: `rgba(245, 158, 11, 0.12)`
- **Security Portal:** `#EF4444` (Crimson / Red) | Background: `rgba(239, 68, 68, 0.12)`

### 1.3 Semantic States
- **Success:** `#10B981` (Resolved, Active, Checked-In)
- **Warning:** `#F59E0B` (Pending, Moderate Loss)
- **Danger:** `#EF4444` (Emergency, High Severity Alert, Blocked)
- **Info:** `#3B82F6` (General telemetry, broadcasts)

---

## 2. Typography & Numerical Formatting

- **Headings Font:** `Plus Jakarta Sans` (`@fontsource/plus-jakarta-sans`), weights: 500, 600, 700, 800.
- **UI & Body Font:** `Inter` (`@fontsource/inter`), weights: 400, 500, 600, 700.
- **Type Scale:** `12px` (micro), `14px` (body-sm), `16px` (body), `18px` (h5), `20px` (h4), `24px` (h3), `30px` (h2), `36px` (h1-sm), `48px` (hero-sub), `60px+` (display hero).
- **Tabular Numerals:** All statistical KPIs, timers, seat counts, and telemetry counters utilize `font-variant-numeric: tabular-nums; font-feature-settings: 'tnum';` to eliminate number jitter during live updates.

---

## 3. Spacing, Elevation & Surfaces

- **Grid Base:** 4px geometric progression (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`, `64px`).
- **Corner Radii:**
  - `sm`: 8px (inner badges, chips)
  - `md`: 12px (inputs, buttons, dropdowns)
  - `lg`: 16px (cards, metric tiles)
  - `xl`: 24px (modals, hero frames)
  - `full`: 9999px (pills, avatars)
- **Layered Shadows:**
  - Hairline borders (`1px solid var(--border-default)`) across all containers.
  - Dark mode substitutes heavy blur shadows with true surface elevation tokens (`--bg-surface-elevated: #1e293b`).

---

## 4. Shared UI Primitives (`/src/components/ui/`)

1. **`ThemeToggle.jsx`:** Keyboard-navigable theme switcher synced to `localStorage('sc_theme')`.
2. **`Badge.jsx` / `RoleBadge` / `StatusChip`:** Accessible status indicators with role-tailored colorways.
3. **`StatCard.jsx`:** Metric KPI tile with positive/negative trend delta chips, icon framing, and tabular figures.
4. **`EmptyState.jsx`:** Graceful empty lists and placeholder states with SVG graphics and call-to-actions.
5. **`ErrorBoundary.jsx`:** Global presentation error containment ensuring zero app crashes.
6. **`ProjectVideoPlayer.jsx`:** Reusable 16:9 Canva walkthrough video embed with author attribution and HD playback.

---

## 5. Accessibility (WCAG AA Compliance)

- **Contrast Ratios:** Minimum 4.5:1 text-to-background contrast verified across light and dark modes.
- **Touch Targets:** Minimum 44px height/width on all interactive buttons, icon buttons, and navigation links.
- **Focus Rings:** Visible `focus:ring-2 focus:ring-emerald-500/50` on keyboard focus.
- **Reduced Motion:** Automatic fallback to instantaneous transitions when `prefers-reduced-motion: reduce` is active.

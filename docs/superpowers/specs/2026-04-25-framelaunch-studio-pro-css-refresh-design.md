# Frame Launch Studio Pro CSS Refresh Design

## Goal

Make the Frame Launch editor feel more polished, premium, animated, and visually refined while preserving the existing editor workflow and behavior.

The chosen direction is **Studio Pro**: warm, solid, refined, and creation-suite inspired. Both light and dark themes should feel equally considered. Light mode should read as a warm creative studio; dark mode should read as a refined pro editor with warm accents.

## Approved Approach

Use a CSS-only refresh.

The implementation should focus on `styles.css` and keep the current `index.html` structure, JavaScript behavior, theme preference flow, IndexedDB data, canvas rendering, Tauri behavior, and export output unchanged.

This approach provides the requested visual upgrade with the lowest regression risk. It avoids DOM rewrites, new dependencies, JavaScript-driven animation systems, and changes to persisted data.

## Visual Direction

The existing three-column editor layout remains:

- Left sidebar for projects and screenshots
- Center stage for the canvas preview
- Right sidebar for editing controls

The refreshed app should feel like a premium Studio Pro workspace:

- Solid warm surfaces instead of translucent or glassy panels
- Refined dark and light themes with equal polish
- Gold and warm neutral accents for active, selected, focus, and primary states
- Softer but more intentional shadows and elevation
- Calmer editorial spacing and stronger visual hierarchy
- Better hover, pressed, disabled, selected, and focus states
- A more polished center canvas stage and side preview chrome

The UI should look noticeably fancier and more animated, but normal editing should remain clear and calm.

## Non-Glass Rule

Avoid glassmorphism and blur-heavy translucent panels.

Use solid panels, subtle gradients, borders, shadows, and warm accent color instead. Any opacity should support state feedback or depth without making panels feel like frosted glass.

## Component Scope

In scope:

- `body` and `.app-container` background treatment
- Left and right sidebar surfaces
- Sidebar headers, tab bar, sections, and dividers
- Project dropdown, project buttons, and project menu
- Screenshot list items, selected rows, upload areas, and empty states
- Primary, secondary, danger, and icon buttons
- Dropdowns, menus, popovers, and language picker
- Inputs, selects, textareas, sliders, checkboxes, and focus rings
- Center canvas area and canvas wrapper chrome
- Side preview cards and carousel chrome
- Modals, overlays, settings, about, language, translation, and utility dialogs
- Existing theme tokens where they support the refresh

Out of scope:

- Changing saved project data
- Changing IndexedDB schema or local storage keys
- Changing screenshot canvas drawing defaults
- Changing exported PNG or ZIP output
- Changing layout proportions or information architecture
- Adding dependencies or a build step
- Adding JavaScript choreography for animation

## Motion Design

Motion should use CSS transitions and lightweight keyframes.

Targeted motion:

- Hover lift and shadow refinement for clickable cards and buttons
- Pressed feedback for buttons, tabs, and list rows
- Animated focus rings for form controls
- Smoother menu and modal entrance states
- Selected-state emphasis for active tabs, screenshots, and controls
- Subtle depth around the canvas stage and side previews

Avoid heavy continuous animation. Any decorative animation should be subtle and should not compete with the editor controls.

Use `prefers-reduced-motion` to remove or substantially reduce decorative motion while preserving visible state changes.

## Theme Behavior

Keep the existing `Auto / Light / Dark` settings behavior.

- `Auto` continues to follow the system color scheme.
- `Light` and `Dark` continue to use the current `data-theme` mechanism.
- No new theme values are added.
- No migration is needed.

Light mode should use warm cream, sand, parchment, and ink-like neutrals with restrained gold accents. Dark mode should use solid charcoal, espresso, and warm-black surfaces with the same refined accent language.

## Data Flow

No data flow changes are required.

The existing theme flow remains:

1. `app.js` reads `themePreference`.
2. `applyTheme()` updates `document.documentElement.dataset.theme`.
3. `styles.css` variables and component styles determine the visible app chrome.

The screenshot rendering pipeline remains untouched. Editor chrome styles must not affect exported screenshots.

## Accessibility

The refresh must preserve practical editor usability:

- Maintain readable contrast in both light and dark themes.
- Keep gold primarily for active, focus, hover, and primary action states rather than long text.
- Preserve obvious keyboard focus states.
- Preserve disabled state affordances.
- Avoid motion that makes controls hard to use.
- Honor `prefers-reduced-motion`.

## Risks

Main implementation risks:

- Overly broad selectors unintentionally changing hidden modal states or utility controls
- Styling that makes dense controls harder to scan
- Low contrast in either theme after introducing warmer neutrals
- Animation performance issues from excessive shadows or large repaints
- Accidentally affecting screenshot canvas pixels rather than only editor chrome

Mitigation:

- Keep changes scoped to existing UI classes.
- Prefer token-driven updates where possible.
- Use lightweight transitions and shadows.
- Verify core controls, modals, and theme behavior visually.

## Verification

Verification should include:

- Run or reuse the local app server at `http://localhost:8000`.
- Inspect the default editor state in the browser.
- Add or use a blank screen and confirm the center preview remains functional.
- Check visible hover, pressed, selected, focus, dropdown, modal, upload, and empty states.
- Check both light and dark theme behavior.
- Confirm app chrome changes do not alter screenshot canvas output.
- Run diagnostics on edited files.

## Commit Note

This working directory is currently not initialized as a git repository from the active workspace path. If git is later initialized or the correct repository root is opened, commit the spec and implementation with a message similar to:

`style: add Studio Pro editor refresh`

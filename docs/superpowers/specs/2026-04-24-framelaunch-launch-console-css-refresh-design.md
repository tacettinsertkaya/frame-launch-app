# Frame Launch Launch Console CSS Refresh Design

## Goal

Make the Frame Launch editor feel more premium, animated, and brand-aligned while preserving the existing editor structure and behavior.

The chosen direction is a **Launch Console** style: dark, energetic, black-and-gold, with stronger glow, depth, motion, and showcase-style interactions across the whole editor.

## Approved Approach

Use a CSS-first showcase refresh.

The implementation should focus on `styles.css` and keep the current HTML structure, JavaScript behavior, theme preference flow, IndexedDB data, canvas rendering, and export output unchanged. The app should feel more polished and animated through theme tokens, shadows, gradients, transitions, pseudo-elements, and component state styling rather than a layout rewrite.

This is intentionally safer than adding coordinated JavaScript choreography or changing the DOM for new decorative layers.

## Visual Direction

The editor should keep the familiar three-column tool layout:

- Left sidebar for projects and screenshots
- Center canvas preview area
- Right sidebar for editing controls

The refreshed UI should feel like a Frame Launch control console:

- Near-black surfaces with warm cream text
- Gold active states and highlights
- Animated ambient glow and subtle grid/radial energy
- Glassy elevated panels and menus
- More dramatic canvas-stage depth
- Premium hover, focus, selected, and pressed states
- More expressive upload and empty states

The effect should be bold enough to feel showcase-worthy, but not so heavy that normal editing becomes confusing.

## Component Scope

In scope:

- `body` and `.app-container` background treatment
- Left and right sidebar surfaces
- Sidebar headers, sections, tabs, and dividers
- Project controls, screenshot list items, selected rows, and upload areas
- Primary and secondary buttons
- Dropdowns, menus, and popovers
- Inputs, selects, textareas, sliders, checkboxes, and focus rings
- Center canvas area and canvas wrapper chrome
- Side preview cards and carousel chrome
- Modals and overlays
- Empty, upload, translation, and utility states
- Existing theme token usage where it supports the refresh

Out of scope:

- Changing saved project data
- Changing IndexedDB schema or local storage keys
- Changing screenshot canvas drawing defaults
- Changing exported PNG or ZIP output
- Reworking layout proportions or information architecture
- Adding new dependencies or a build step
- Large JavaScript-driven animation systems

## Motion Design

Motion should be implemented with CSS transitions and keyframes.

Targeted animation behaviors:

- Slow ambient background shimmer or glow movement on the editor shell
- Hover lift and gold glow for clickable controls
- Press feedback for buttons and list items
- Animated focus rings for form controls
- More polished modal scale/slide entrance
- Selected state glow for active tabs, screenshots, and controls
- Subtle stage glow around the preview canvas

Use `prefers-reduced-motion` to disable or substantially reduce non-essential animations. Essential state changes should remain visible without motion.

## Theme Behavior

Keep the existing `Auto / Light / Dark` settings behavior.

- `Auto` continues to follow system color scheme.
- `Light` and `Dark` continue to use the existing `data-theme` mechanism.
- No new theme preference values are added.
- No migration is needed.

The Launch Console treatment should be strongest in dark mode because it matches the Frame Launch black-and-gold identity. Light mode should remain readable and polished, but can use calmer warm cream surfaces with gold accents.

## Data Flow

No data flow changes are required.

The existing theme flow remains:

1. `app.js` reads `themePreference`.
2. `applyTheme()` updates `document.documentElement.dataset.theme`.
3. `styles.css` variables and component styles determine the UI appearance.

The screenshot rendering flow remains untouched. Editor chrome styles must not affect the pixels drawn into exported screenshots.

## Accessibility

The refresh must preserve practical editor usability:

- Maintain readable text contrast in dark and light themes.
- Use gold primarily for active, focus, hover, and primary actions rather than long text.
- Keep focus states obvious for keyboard navigation.
- Preserve disabled state affordances.
- Avoid continuous motion that makes controls hard to use.
- Honor `prefers-reduced-motion`.

## Error Handling

This is primarily a styling change and should not introduce new runtime error paths.

Main implementation risks:

- Overly broad selectors that unintentionally affect canvas internals or hidden modal states
- Animation performance issues from heavy blur, shadows, or large repaint areas
- Low contrast in light theme after adding gold and cream treatments
- Visual inconsistency from old hardcoded colors that bypass theme tokens

The implementation should prefer scoped CSS changes and verify core editor interactions visually.

## Verification

Verification should include:

- Run or reuse the local app server at `http://localhost:8000`.
- Inspect the default editor state in the browser.
- Add or use a blank screen and confirm the center preview remains functional.
- Check visible hover, selected, focus, dropdown, modal, and upload states.
- Check dark, light, and auto theme behavior if accessible through settings.
- Confirm app chrome changes do not alter screenshot canvas output.
- Run diagnostics on edited files.
- Search for any obvious legacy colors or token mistakes if styling appears inconsistent.

## Commit Note

This working directory is currently not initialized as a git repository. If git is later initialized, commit the spec and implementation with a message similar to:

`style: add Launch Console editor refresh`

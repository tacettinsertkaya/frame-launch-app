# Frame Launch Theme Colors Design

## Goal

Rebrand the editor UI so its light, dark, and auto themes match the live Frame Launch landing page at `https://frame-launch.store/`.

The change should replace the current Apple-blue editor identity with Frame Launch's warm black, cream, and gold palette while preserving the existing editor layout and theme selector behavior.

## Approved Approach

Use a token swap plus targeted cleanup.

The app already centralizes most UI colors in `styles.css` custom properties, so the core change should update the existing theme variables for default, light, and dark modes. In addition, any obvious hardcoded blue hover, focus, selected, or upload states should be changed to use the existing accent token so they inherit the Frame Launch palette.

This keeps the change small and maintainable while avoiding a full design-system refactor.

## Brand Palette

Use the landing page palette as the source of truth:

- Dark surfaces: `#0a0a0a`, `#121212`, `#141414`, `#1c1c1c`
- Border and elevated neutral: `#2a2a2a`, `#3a3a3a`
- Primary text on dark: `#fffdf5`
- Secondary text on dark: `#9a9a9a`
- Light surfaces: `#fffdf5`, `#f8f4e4`, `#f4eed1`, `#f6f1d6`
- Primary accent: `#e8c610`
- Accent hover and highlight: `#fff066`, `#d1b00d`
- Brand gradient hints: `#0f0c29`, `#e8c610`, `#fff066`

## Theme Architecture

Keep the existing `Auto / Light / Dark` settings exactly as they are from a user-facing behavior perspective.

- `Auto` continues to follow the user's system color scheme.
- `Light` forces the warm cream Frame Launch palette.
- `Dark` forces the warm black Frame Launch palette.
- Existing persisted `themePreference` values remain valid.
- No migration or new storage key is required.

Dark mode should use near-black app surfaces, cream primary text, muted gray secondary text, and gold accent states. Light mode should use cream surfaces, dark text, warm borders, and the same gold accent.

## Component Scope

The change applies to the editor chrome, not to exported screenshot artwork.

In scope:

- Sidebars and titlebar surfaces
- Tabs and active tab states
- Buttons and icon buttons
- Dropdowns and menus
- Modals and overlays
- Project controls
- Upload and empty states
- Inputs, range controls, checkboxes, and focus rings
- Selected screenshots and active item states
- Hover states that currently bypass theme tokens

Out of scope:

- Changing saved project data
- Changing screenshot canvas rendering defaults
- Changing exported screenshot output
- Redesigning editor layout, spacing, or information architecture
- Introducing a new theme system or additional theme selector options

## Data Flow

Theme application remains the same:

1. `app.js` reads `themePreference` from local storage.
2. `applyTheme()` updates `document.documentElement.dataset.theme`.
3. CSS variables in `styles.css` determine the visual result.
4. Components consume the same variables as before.

No project-level data or screenshot-level data should be touched.

## Error Handling

There is no new runtime error surface. If a user has an existing theme preference, the current logic should continue to apply it. If no preference exists, the app should keep using `auto`.

The main implementation risk is visual inconsistency from hardcoded legacy colors. The plan should include a search for hardcoded Apple-blue values and update only the ones used by editor chrome states.

## Accessibility

Maintain readable contrast in both light and dark themes:

- Dark mode primary text should remain cream on black, not gold on black for long text.
- Gold should be used mainly for primary actions, active states, focus, and highlights.
- Light mode should avoid pale yellow text on cream backgrounds.
- Disabled and secondary states should remain visibly distinct from active states.

## Verification

Verification should include:

- Run the local app through the existing static server.
- Check `Auto`, `Light`, and `Dark` theme selector states.
- Inspect key editor surfaces for leftover blue accents.
- Confirm selected/hover/focus states still read as interactive.
- Confirm the screenshot canvas output is not changed by the app theme.
- Run diagnostics on edited files after CSS changes.

## Commit Note

The repository currently appears to be a plain copied working directory rather than an initialized git repository. If git is later initialized, the design document and implementation changes should be committed with a message similar to:

`design: define Frame Launch theme color update`

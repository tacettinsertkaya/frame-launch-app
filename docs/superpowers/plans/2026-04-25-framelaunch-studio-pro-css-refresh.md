# FrameLaunch Studio Pro CSS Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the FrameLaunch editor chrome into a polished Studio Pro UI using CSS only, with equal care for light and dark themes.

**Architecture:** Keep the existing `index.html`, `app.js`, saved data, canvas rendering, and export behavior unchanged. Implement the visual refresh through `styles.css` theme tokens, scoped component styling, lightweight transitions, and reduced-motion handling.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS, HTML5 Canvas, Three.js, Python local server.

---

## File Structure

- Modify: `styles.css`
  - Owns all Studio Pro visual changes: theme variables, shell surfaces, sidebars, controls, menus, modals, canvas chrome, side previews, and motion rules.
- Read only: `index.html`
  - Use existing class names only. Do not change markup.
- Read only: `app.js`
  - Do not change behavior or theme preference logic.
- Read only: `docs/superpowers/specs/2026-04-25-framelaunch-studio-pro-css-refresh-design.md`
  - Source of truth for approved scope and constraints.

No new files, dependencies, build steps, storage keys, or JavaScript animation systems are required.

## Task 1: Studio Pro Theme Tokens And App Shell

**Files:**
- Modify: `styles.css`
- Test: Browser visual check at `http://localhost:8000`

- [ ] **Step 1: Replace the root dark theme tokens with Studio Pro dark tokens**

In `styles.css`, update the initial `:root` block near the top. Keep the same variable names and add only CSS variables used by later tasks.

```css
:root {
    --bg-primary: #11100d;
    --bg-secondary: #181611;
    --bg-tertiary: #242017;
    --border-color: #3a3324;
    --text-primary: #fffaf0;
    --text-secondary: #b7aa8b;
    --accent: #c8a832;
    --accent-hover: #e0bf48;
    --shadow-color: rgba(20, 16, 8, 0.34);
    --shadow-heavy: rgba(10, 8, 4, 0.62);
    --overlay-bg: rgba(17, 16, 13, 0.76);
    --accent-subtle: rgba(200, 168, 50, 0.10);
    --accent-subtle-strong: rgba(200, 168, 50, 0.20);
    --surface-raised: #211d15;
    --surface-sunken: #0c0b09;
    --surface-highlight: #2c2619;
    --focus-ring: rgba(224, 191, 72, 0.34);
    --studio-shadow: 0 18px 44px rgba(10, 8, 4, 0.28);
    --studio-shadow-soft: 0 10px 28px rgba(10, 8, 4, 0.18);
}
```

- [ ] **Step 2: Update light, manual light, and manual dark theme tokens**

Update the `@media (prefers-color-scheme: light)`, `html[data-theme="light"]`, and `html[data-theme="dark"]` token blocks so light and dark themes are equally polished.

```css
@media (prefers-color-scheme: light) {
    :root {
        --bg-primary: #f7f0dc;
        --bg-secondary: #fffaf0;
        --bg-tertiary: #efe2bd;
        --border-color: #d7c79d;
        --text-primary: #1f1a10;
        --text-secondary: #74684d;
        --accent: #b89322;
        --accent-hover: #8f7017;
        --shadow-color: rgba(71, 54, 18, 0.10);
        --shadow-heavy: rgba(71, 54, 18, 0.20);
        --overlay-bg: rgba(31, 26, 16, 0.38);
        --accent-subtle: rgba(184, 147, 34, 0.12);
        --accent-subtle-strong: rgba(184, 147, 34, 0.22);
        --surface-raised: #fffdf7;
        --surface-sunken: #eadbb6;
        --surface-highlight: #f4e9ca;
        --focus-ring: rgba(184, 147, 34, 0.30);
        --studio-shadow: 0 18px 44px rgba(71, 54, 18, 0.12);
        --studio-shadow-soft: 0 10px 28px rgba(71, 54, 18, 0.09);
    }
    .tip-box img { filter: none; }
    .settings-btn img { filter: invert(0.4); }
    .settings-btn:hover img { filter: invert(0); }
}

html[data-theme="light"] {
    --bg-primary: #f7f0dc;
    --bg-secondary: #fffaf0;
    --bg-tertiary: #efe2bd;
    --border-color: #d7c79d;
    --text-primary: #1f1a10;
    --text-secondary: #74684d;
    --accent: #b89322;
    --accent-hover: #8f7017;
    --shadow-color: rgba(71, 54, 18, 0.10);
    --shadow-heavy: rgba(71, 54, 18, 0.20);
    --overlay-bg: rgba(31, 26, 16, 0.38);
    --accent-subtle: rgba(184, 147, 34, 0.12);
    --accent-subtle-strong: rgba(184, 147, 34, 0.22);
    --surface-raised: #fffdf7;
    --surface-sunken: #eadbb6;
    --surface-highlight: #f4e9ca;
    --focus-ring: rgba(184, 147, 34, 0.30);
    --studio-shadow: 0 18px 44px rgba(71, 54, 18, 0.12);
    --studio-shadow-soft: 0 10px 28px rgba(71, 54, 18, 0.09);
}

html[data-theme="dark"] {
    --bg-primary: #11100d;
    --bg-secondary: #181611;
    --bg-tertiary: #242017;
    --border-color: #3a3324;
    --text-primary: #fffaf0;
    --text-secondary: #b7aa8b;
    --accent: #c8a832;
    --accent-hover: #e0bf48;
    --shadow-color: rgba(20, 16, 8, 0.34);
    --shadow-heavy: rgba(10, 8, 4, 0.62);
    --overlay-bg: rgba(17, 16, 13, 0.76);
    --accent-subtle: rgba(200, 168, 50, 0.10);
    --accent-subtle-strong: rgba(200, 168, 50, 0.20);
    --surface-raised: #211d15;
    --surface-sunken: #0c0b09;
    --surface-highlight: #2c2619;
    --focus-ring: rgba(224, 191, 72, 0.34);
    --studio-shadow: 0 18px 44px rgba(10, 8, 4, 0.28);
    --studio-shadow-soft: 0 10px 28px rgba(10, 8, 4, 0.18);
}
```

- [ ] **Step 3: Add Studio Pro shell depth**

Update `body`, `.app-container`, `.sidebar`, `.sidebar-footer`, and `.sidebar-right` to use solid layered surfaces, not translucent glass.

```css
body {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
    background:
        radial-gradient(circle at top left, var(--accent-subtle), transparent 34vw),
        linear-gradient(135deg, var(--bg-primary), var(--surface-sunken));
    color: var(--text-primary);
    min-height: 100vh;
    overflow: hidden;
}

.app-container {
    display: grid;
    grid-template-columns: 320px 1fr 340px;
    min-height: 100vh;
    max-height: 100vh;
    background:
        linear-gradient(90deg, rgba(255,255,255,0.02), transparent 28%, transparent 72%, rgba(255,255,255,0.02)),
        transparent;
}

.sidebar {
    background: linear-gradient(180deg, var(--bg-secondary), var(--surface-raised));
    border-right: 1px solid var(--border-color);
    box-shadow: var(--studio-shadow-soft);
    display: flex;
    flex-direction: column;
    max-height: 100vh;
}

.sidebar-footer {
    flex-shrink: 0;
    padding: 16px 20px 20px;
    background: var(--surface-raised);
    border-top: 1px solid var(--border-color);
    box-shadow: 0 -12px 24px var(--shadow-color);
}

.sidebar-right {
    border-right: none;
    border-left: 1px solid var(--border-color);
    transition: opacity 0.3s ease;
}
```

- [ ] **Step 4: Run the app and inspect the shell**

Run or reuse:

```bash
python3 -m http.server 8000
```

Expected: `http://localhost:8000` loads. The editor uses solid warm Studio Pro surfaces. The three-column layout is unchanged.

If port 8000 is already running, reuse it instead of starting a duplicate server.

## Task 2: Controls, Buttons, Lists, Menus, And Focus States

**Files:**
- Modify: `styles.css`
- Test: Browser visual checks for controls, keyboard focus, menus, and screenshot list states

- [ ] **Step 1: Upgrade screenshot rows and upload controls**

Update or add these rules near the existing screenshot list and add button sections.

```css
.add-btn,
.screenshot-item,
.upload-item {
    transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease, color 0.18s ease;
}

.add-btn {
    border: 1px dashed color-mix(in srgb, var(--border-color), var(--accent) 18%);
    border-radius: 12px;
    background: var(--surface-highlight);
    color: var(--text-secondary);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
}

.add-btn:hover {
    transform: translateY(-1px);
    border-color: var(--accent);
    color: var(--text-primary);
    background: var(--accent-subtle);
    box-shadow: var(--studio-shadow-soft);
}

.screenshot-item {
    background: var(--surface-raised);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
}

.screenshot-item:hover {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--border-color), var(--accent) 45%);
    background: var(--surface-highlight);
    box-shadow: var(--studio-shadow-soft);
}

.screenshot-item.selected {
    border-color: var(--accent);
    background: linear-gradient(135deg, var(--accent-subtle), var(--surface-raised));
    box-shadow: 0 0 0 1px var(--accent-subtle-strong), var(--studio-shadow-soft);
}

.screenshot-item:active,
.add-btn:active {
    transform: translateY(0) scale(0.99);
}
```

- [ ] **Step 2: Upgrade buttons, tab buttons, segmented buttons, and export buttons**

Apply consistent hover, active, and selected-state behavior to existing button classes.

```css
.project-btn,
.settings-btn,
.tab,
.btn-group button,
.export-btn,
.modal-btn,
.slider-reset-btn,
.screenshot-menu-btn {
    transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
}

.project-btn:hover,
.settings-btn:hover,
.tab:hover,
.btn-group button:hover:not(.active),
.export-btn:hover,
.modal-btn:hover,
.slider-reset-btn:hover,
.screenshot-menu-btn:hover {
    transform: translateY(-1px);
    box-shadow: var(--studio-shadow-soft);
}

.project-btn:active,
.settings-btn:active,
.tab:active,
.btn-group button:active,
.export-btn:active,
.modal-btn:active,
.slider-reset-btn:active,
.screenshot-menu-btn:active {
    transform: translateY(0) scale(0.98);
}

.tab.active,
.btn-group button.active {
    color: var(--text-primary);
    background: linear-gradient(135deg, var(--accent-subtle-strong), var(--surface-highlight));
    border-color: var(--accent);
    box-shadow: inset 0 -2px 0 var(--accent), var(--studio-shadow-soft);
}

.export-btn,
.modal-btn-confirm,
.modal-btn-primary {
    background: linear-gradient(135deg, var(--accent), var(--accent-hover));
    color: #171307;
    border-color: color-mix(in srgb, var(--accent), #000 12%);
    box-shadow: var(--studio-shadow-soft);
}

.export-btn.secondary,
.modal-btn-cancel {
    background: var(--surface-highlight);
    color: var(--text-primary);
    border-color: var(--border-color);
}
```

- [ ] **Step 3: Upgrade form fields, sliders, and keyboard focus**

Update input, select, textarea, range, and focus rules.

```css
input[type="text"],
input[type="number"],
select,
textarea {
    background: var(--surface-sunken);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    color: var(--text-primary);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus,
textarea:focus {
    border-color: var(--accent);
    outline: none;
    box-shadow: 0 0 0 4px var(--focus-ring), inset 0 1px 0 rgba(255,255,255,0.05);
    background: var(--surface-raised);
}

input[type="range"] {
    accent-color: var(--accent);
}

input[type="range"]::-webkit-slider-thumb {
    box-shadow: 0 0 0 4px var(--accent-subtle), var(--studio-shadow-soft);
}

button:focus-visible,
.tab:focus-visible,
.project-trigger:focus-visible,
.output-size-trigger:focus-visible,
.language-btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px var(--focus-ring), var(--studio-shadow-soft);
}
```

- [ ] **Step 4: Upgrade dropdowns, popovers, project menu, and language menu**

Use solid surfaces and elevation for menus. Do not use `backdrop-filter`.

```css
.project-trigger,
.output-size-trigger,
.project-menu,
.output-size-menu,
.language-menu,
.screenshot-menu {
    background: var(--surface-raised);
    border-color: var(--border-color);
    box-shadow: var(--studio-shadow);
}

.project-trigger:hover,
.output-size-trigger:hover {
    border-color: color-mix(in srgb, var(--border-color), var(--accent) 45%);
    background: var(--surface-highlight);
}

.project-menu,
.output-size-menu,
.language-menu,
.screenshot-menu {
    border-radius: 14px;
    overflow: hidden;
}

.project-option:hover,
.device-option:hover,
.language-option:hover,
.language-menu-edit:hover,
.screenshot-menu-item:hover {
    background: var(--accent-subtle);
    color: var(--text-primary);
}

.device-option.selected,
.project-option.active {
    background: var(--accent-subtle-strong);
    color: var(--text-primary);
}
```

- [ ] **Step 5: Verify controls**

In the browser:

1. Click tabs in the right sidebar.
2. Focus a text input with keyboard navigation.
3. Open the project dropdown and output size dropdown.
4. Hover screenshot rows and add buttons.
5. Confirm controls look elevated and solid, not glassy.

Expected: controls remain usable, focus states are obvious, and no menu is hidden behind another panel.

## Task 3: Canvas Stage, Side Previews, Modals, And Motion Reduction

**Files:**
- Modify: `styles.css`
- Test: Browser visual checks for canvas, preview strip, modals, and reduced-motion CSS

- [ ] **Step 1: Upgrade center canvas stage and preview cards**

Update the existing canvas and preview rules.

```css
.canvas-area {
    background:
        radial-gradient(circle at 50% 42%, var(--accent-subtle), transparent 38%),
        linear-gradient(135deg, var(--surface-sunken), var(--bg-primary));
}

.canvas-wrapper {
    background: var(--surface-raised);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    box-shadow: 0 28px 80px var(--shadow-heavy), inset 0 1px 0 rgba(255,255,255,0.05);
    transition: transform 0.28s ease, box-shadow 0.28s ease;
}

.canvas-wrapper:hover {
    transform: translateY(-2px);
    box-shadow: 0 34px 96px var(--shadow-heavy), inset 0 1px 0 rgba(255,255,255,0.06);
}

.preview-strip canvas,
.side-preview canvas {
    border-radius: 18px;
    box-shadow: var(--studio-shadow-soft);
}
```

- [ ] **Step 2: Upgrade section headers and collapsible control groups**

Improve dense editor hierarchy without changing layout proportions.

```css
.control-group {
    padding: 14px;
    border: 1px solid color-mix(in srgb, var(--border-color), transparent 15%);
    border-radius: 14px;
    background: color-mix(in srgb, var(--surface-raised), var(--bg-secondary) 30%);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
}

.control-label {
    color: var(--text-secondary);
    letter-spacing: 0.04em;
}

.section-header {
    background: var(--surface-highlight);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
}

.section-header:hover {
    border-color: color-mix(in srgb, var(--border-color), var(--accent) 40%);
    background: var(--accent-subtle);
}
```

- [ ] **Step 3: Upgrade modal and overlay motion**

Keep existing `.visible` behavior. Add smoother scale/slide without changing JavaScript.

```css
.modal-overlay {
    background: var(--overlay-bg);
    transition: opacity 0.22s ease, visibility 0.22s ease;
}

.modal {
    background: var(--surface-raised);
    border: 1px solid var(--border-color);
    border-radius: 22px;
    box-shadow: 0 30px 90px var(--shadow-heavy);
    transform: translateY(12px) scale(0.98);
    transition: transform 0.22s ease, opacity 0.22s ease;
}

.modal-overlay.visible .modal {
    transform: translateY(0) scale(1);
}

.modal-header {
    border-bottom: 1px solid var(--border-color);
    background: var(--surface-highlight);
}
```

- [ ] **Step 4: Add global reduced-motion handling**

Append this block near the end of `styles.css`.

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: 0.001ms !important;
    }

    .canvas-wrapper:hover,
    .add-btn:hover,
    .screenshot-item:hover,
    .project-btn:hover,
    .settings-btn:hover,
    .tab:hover,
    .btn-group button:hover,
    .export-btn:hover,
    .modal-btn:hover {
        transform: none;
    }
}
```

- [ ] **Step 5: Verify stage, modals, and motion**

In the browser:

1. Use or create a blank screen.
2. Confirm the center canvas still renders and is not visually clipped.
3. Open Settings and About modals.
4. Confirm modal entrance is smooth and solid.
5. Search `styles.css` for `backdrop-filter`.

Expected: `backdrop-filter` is not introduced for the refresh. Canvas export content remains visually independent from editor chrome.

## Task 4: Final Verification And Cleanup

**Files:**
- Read: `styles.css`
- Read: `index.html`
- Test: Browser, diagnostics, text search

- [ ] **Step 1: Run CSS searches for forbidden or risky patterns**

Run:

```bash
rg "backdrop-filter|filter:\\s*blur|rgba\\([^)]*,\\s*0\\.[6-9]\\)" styles.css
```

Expected: no newly introduced glassmorphism or blur-heavy panel styling. Existing unrelated image/icon filters can remain if they predate this change.

- [ ] **Step 2: Run diagnostics for edited CSS**

Use Cursor diagnostics for `styles.css`.

Expected: no new CSS syntax diagnostics.

- [ ] **Step 3: Verify app behavior manually**

At `http://localhost:8000`:

1. Add a blank screen.
2. Switch between Background, Device, Text, Elements, and Popouts tabs.
3. Open project and output size dropdowns.
4. Open Settings.
5. Switch theme preference to Light, Dark, and Auto if available.
6. Export current screenshot if an exportable screen exists.

Expected: all controls still respond, the canvas preview remains functional, and exported image pixels are not affected by editor chrome styling.

- [ ] **Step 4: Document git limitation**

Because the active workspace path is not currently a git repository, do not run `git commit` here. If the correct repository root is opened later, use this commit message after reviewing the diff:

```bash
git add styles.css docs/superpowers/specs/2026-04-25-framelaunch-studio-pro-css-refresh-design.md docs/superpowers/plans/2026-04-25-framelaunch-studio-pro-css-refresh.md
git commit -m "$(cat <<'EOF'
style: add Studio Pro editor refresh

EOF
)"
```

Expected: commit only after the user approves the proposed message, per `CLAUDE.md`.

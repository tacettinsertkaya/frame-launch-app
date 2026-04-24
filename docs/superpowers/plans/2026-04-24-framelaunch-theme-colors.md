# FrameLaunch Theme Colors Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the editor UI so `Auto`, `Light`, and `Dark` themes use the live FrameLaunch warm black, cream, and gold palette.

**Architecture:** Keep the existing theme preference flow in `app.js` unchanged. Update the existing CSS custom properties in `styles.css`, then replace hardcoded blue editor chrome states with the same accent tokens. Do not change project data, screenshot canvas defaults, or exported screenshot output.

**Tech Stack:** Vanilla HTML, CSS custom properties, vanilla JavaScript, static Python HTTP server.

---

## File Structure

- Modify `styles.css`: theme custom properties and legacy hardcoded blue CSS states.
- Modify `index.html`: static project modal info icon background.
- Modify `app.js`: dynamic info modal icon backgrounds and crop overlay blue indicators.
- Do not modify `package.json`, persisted storage keys, screenshot state shape, or rendering defaults.

The repository directory is currently not initialized as git. If git is initialized before execution, use the repository's normal commit flow after the user approves each proposed commit message. If it remains non-git, skip commit steps and report that commits were unavailable.

---

### Task 1: Rebrand Theme Tokens

**Files:**
- Modify: `styles.css:7-79`
- Test: static search command, browser theme selector check

- [ ] **Step 1: Confirm the current blue token baseline**

Run:

```bash
rg "#0a84ff|#409cff|#007aff|#0056b3|10, 132, 255|0, 122, 255" styles.css
```

Expected before implementation: matches in the root, light media query, `html[data-theme="light"]`, and `html[data-theme="dark"]` theme variables.

- [ ] **Step 2: Replace the default dark variables**

In `styles.css`, replace the first `:root` block with:

```css
:root {
    --bg-primary: #0a0a0a;
    --bg-secondary: #121212;
    --bg-tertiary: #1c1c1c;
    --border-color: #2a2a2a;
    --text-primary: #fffdf5;
    --text-secondary: #9a9a9a;
    --accent: #e8c610;
    --accent-hover: #d1b00d;
    --shadow-color: rgba(0, 0, 0, 0.35);
    --shadow-heavy: rgba(0, 0, 0, 0.55);
    --overlay-bg: rgba(0, 0, 0, 0.72);
    --accent-subtle: rgba(232, 198, 16, 0.08);
    --accent-subtle-strong: rgba(232, 198, 16, 0.16);
}
```

- [ ] **Step 3: Replace the system light variables**

In `styles.css`, inside `@media (prefers-color-scheme: light) { :root { ... } }`, replace the variable values with:

```css
        --bg-primary: #fffdf5;
        --bg-secondary: #f8f4e4;
        --bg-tertiary: #f4eed1;
        --border-color: #e0d6ad;
        --text-primary: #121212;
        --text-secondary: #6b6b6b;
        --accent: #e8c610;
        --accent-hover: #d1b00d;
        --shadow-color: rgba(0, 0, 0, 0.08);
        --shadow-heavy: rgba(0, 0, 0, 0.16);
        --overlay-bg: rgba(0, 0, 0, 0.42);
        --accent-subtle: rgba(232, 198, 16, 0.10);
        --accent-subtle-strong: rgba(232, 198, 16, 0.18);
```

- [ ] **Step 4: Replace the manual light override**

In `styles.css`, inside `html[data-theme="light"]`, use the same light variable values from Step 3:

```css
html[data-theme="light"] {
    --bg-primary: #fffdf5;
    --bg-secondary: #f8f4e4;
    --bg-tertiary: #f4eed1;
    --border-color: #e0d6ad;
    --text-primary: #121212;
    --text-secondary: #6b6b6b;
    --accent: #e8c610;
    --accent-hover: #d1b00d;
    --shadow-color: rgba(0, 0, 0, 0.08);
    --shadow-heavy: rgba(0, 0, 0, 0.16);
    --overlay-bg: rgba(0, 0, 0, 0.42);
    --accent-subtle: rgba(232, 198, 16, 0.10);
    --accent-subtle-strong: rgba(232, 198, 16, 0.18);
}
```

- [ ] **Step 5: Replace the manual dark override**

In `styles.css`, inside `html[data-theme="dark"]`, use the same dark variable values from Step 2:

```css
html[data-theme="dark"] {
    --bg-primary: #0a0a0a;
    --bg-secondary: #121212;
    --bg-tertiary: #1c1c1c;
    --border-color: #2a2a2a;
    --text-primary: #fffdf5;
    --text-secondary: #9a9a9a;
    --accent: #e8c610;
    --accent-hover: #d1b00d;
    --shadow-color: rgba(0, 0, 0, 0.35);
    --shadow-heavy: rgba(0, 0, 0, 0.55);
    --overlay-bg: rgba(0, 0, 0, 0.72);
    --accent-subtle: rgba(232, 198, 16, 0.08);
    --accent-subtle-strong: rgba(232, 198, 16, 0.16);
}
```

- [ ] **Step 6: Check that old blue theme tokens are gone from `styles.css`**

Run:

```bash
rg "#0a84ff|#409cff|#007aff|#0056b3|10, 132, 255|0, 122, 255" styles.css
```

Expected after Task 1: old blue values may still appear in component-specific legacy states, but not in the theme variable blocks at the top of `styles.css`.

---

### Task 2: Remove Legacy Blue Editor Chrome States

**Files:**
- Modify: `styles.css:177-180`
- Modify: `styles.css:295-298`
- Modify: `styles.css:870-873`
- Modify: `styles.css:1307-1308`
- Modify: `styles.css:2890-2891`
- Modify: `index.html:1478-1481`
- Modify: `app.js:3284-3307`
- Modify: `app.js:5205-5252`
- Test: static search command, browser visual inspection

- [ ] **Step 1: Fix the add button hover token typo and blue background**

In `styles.css`, replace:

```css
.add-btn:hover {
    border-color: var(--accent-color);
    color: var(--accent-color);
    background: rgba(59, 130, 246, 0.05);
}
```

with:

```css
.add-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-subtle);
}
```

- [ ] **Step 2: Fix the sidebar drag-over blue-purple background**

In `styles.css`, replace:

```css
.sidebar-content.drop-active {
    border: 2px dashed var(--accent);
    background: rgba(99, 102, 241, 0.1);
    border-radius: 8px;
}
```

with:

```css
.sidebar-content.drop-active {
    border: 2px dashed var(--accent);
    background: var(--accent-subtle);
    border-radius: 8px;
}
```

- [ ] **Step 3: Fix the add-gradient-stop hover background**

In `styles.css`, replace:

```css
.add-stop-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: rgba(99, 102, 241, 0.1);
}
```

with:

```css
.add-stop-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-subtle);
}
```

- [ ] **Step 4: Fix primary modal hover**

In `styles.css`, replace:

```css
.modal-btn-primary:hover {
    background: #409cff;
}
```

with:

```css
.modal-btn-primary:hover {
    background: var(--accent-hover);
}
```

- [ ] **Step 5: Fix translation upload hover**

In `styles.css`, replace:

```css
.translation-upload:hover {
    background: #0a84ff;
}
```

with:

```css
.translation-upload:hover {
    background: var(--accent-hover);
}
```

- [ ] **Step 6: Fix static project modal info icon background**

In `index.html`, replace:

```html
            <div class="modal-icon" style="background: rgba(10, 132, 255, 0.2);">
```

with:

```html
            <div class="modal-icon" style="background: var(--accent-subtle-strong);">
```

- [ ] **Step 7: Fix dynamic info modal backgrounds**

In `app.js`, replace the info fallback in `showAppAlert()`:

```js
                'rgba(10, 132, 255, 0.2)';
```

with:

```js
                'var(--accent-subtle-strong)';
```

In `showAppConfirm()`, replace:

```html
                <div class="modal-icon" style="background: rgba(10, 132, 255, 0.2);">
```

with:

```html
                <div class="modal-icon" style="background: var(--accent-subtle-strong);">
```

- [ ] **Step 8: Fix crop overlay handles to use FrameLaunch gold**

In `app.js`, replace:

```js
    ctx2.strokeStyle = 'rgba(10, 132, 255, 0.9)';
```

with:

```js
    ctx2.strokeStyle = 'rgba(232, 198, 16, 0.9)';
```

Then replace:

```js
    ctx2.strokeStyle = 'rgba(10, 132, 255, 1)';
```

with:

```js
    ctx2.strokeStyle = 'rgba(232, 198, 16, 1)';
```

This overlay is editor chrome for crop interaction, not exported screenshot artwork.

- [ ] **Step 9: Check for remaining old blue UI values**

Run:

```bash
rg "#0a84ff|#409cff|#007aff|#0056b3|59, 130, 246|99, 102, 241|10, 132, 255|0, 122, 255|--accent-color" styles.css index.html app.js
```

Expected after Task 2: no matches, except unrelated comments if any are introduced during implementation.

---

### Task 3: Verify Theme Behavior And Visual Scope

**Files:**
- Inspect: `styles.css`
- Inspect: `index.html`
- Inspect: `app.js`
- Runtime: `http://localhost:8000`

- [ ] **Step 1: Start or reuse the static app server**

Check existing terminals first. If no server is already running for this project, run:

```bash
python3 -m http.server 8000
```

Expected: server is available at `http://localhost:8000`.

- [ ] **Step 2: Open the app and check dark mode**

In the browser, open:

```text
http://localhost:8000
```

Open Settings, choose `Dark`, save, and verify:

- App surfaces are near-black.
- Primary text is cream.
- Active tabs, primary buttons, selected items, sliders, checkboxes, and focus states use gold.
- No obvious Apple-blue accents remain in the editor chrome.

- [ ] **Step 3: Check light mode**

Open Settings, choose `Light`, save, and verify:

- App surfaces are warm cream.
- Primary text is dark.
- Borders are warm neutral.
- Active and selected states use gold with readable contrast.
- Long text does not use low-contrast yellow.

- [ ] **Step 4: Check auto mode**

Open Settings, choose `Auto`, save, and verify:

- `app.js` still stores `themePreference` as `auto`.
- `document.documentElement.dataset.theme` is removed for auto mode.
- The browser/system color scheme controls which FrameLaunch palette is used.

- [ ] **Step 5: Check screenshot output is unaffected**

Create or open a project, add a blank screen or screenshot, and change only the app theme. Verify the canvas content and export colors do not change unless the user changes canvas/background/text controls.

- [ ] **Step 6: Run diagnostics**

Run:

```bash
rg "#0a84ff|#409cff|#007aff|#0056b3|59, 130, 246|99, 102, 241|10, 132, 255|0, 122, 255|--accent-color" styles.css index.html app.js
```

Expected: no matches.

Use the IDE diagnostics tool on edited files:

```text
ReadLints paths: styles.css, index.html, app.js
```

Expected: no new diagnostics caused by the theme changes.

- [ ] **Step 7: Repository status and commit handling**

Run:

```bash
git status --short
```

Expected in the current copied directory:

```text
fatal: not a git repository (or any of the parent directories): .git
```

If the directory has become a git repository by execution time, propose this commit message to the user and wait for approval before committing:

```text
style: rebrand editor theme colors
```

After approval in a git repository, commit only the relevant edited files:

```bash
git add styles.css index.html app.js docs/superpowers/specs/2026-04-24-framelaunch-theme-colors-design.md docs/superpowers/plans/2026-04-24-framelaunch-theme-colors.md
git commit -m "$(cat <<'EOF'
style: rebrand editor theme colors

EOF
)"
```

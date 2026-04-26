# Frame Launch Launch Console CSS Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bold, animated Frame Launch "Launch Console" visual refresh to the editor chrome while preserving app behavior and screenshot export output.

**Architecture:** Implement this as a CSS-first enhancement layer in `styles.css`, appended near the end of the file so it can override existing component styles without restructuring the large stylesheet. Keep HTML, JavaScript, theme preference flow, IndexedDB data, and canvas drawing logic unchanged.

**Tech Stack:** Vanilla HTML, CSS custom properties, CSS animations/keyframes, vanilla JavaScript app runtime, Python static server for verification.

---

## File Structure

- Modify: `styles.css`
  - Add a final `/* Launch Console refresh */` section near the end of the file.
  - Define additional visual tokens for glow, glass, and warm border effects.
  - Override editor chrome styles for shell, sidebars, controls, canvas stage, menus, modals, and empty/upload states.
  - Add `prefers-reduced-motion` fallbacks.
- Inspect only: `index.html`
  - Confirm existing DOM classes are sufficient. Do not edit unless implementation reveals a missing hook that cannot be solved with CSS.
- Do not modify: `app.js`
  - No behavior, state, persistence, canvas rendering, or export changes are required.

The implementation should prefer a single appended CSS layer to reduce merge risk and make the refresh easy to review or revert.

---

### Task 1: Add Launch Console Design Tokens And Motion Primitives

**Files:**
- Modify: `styles.css`
- Test: static search

- [ ] **Step 1: Confirm the enhancement layer does not already exist**

Run:

```bash
rg "Launch Console refresh|launch-console-ambient|consoleGlow" styles.css
```

Expected: no matches.

- [ ] **Step 2: Append the Launch Console token and keyframe block**

At the end of `styles.css`, add:

```css
/* Launch Console refresh */
:root {
    --console-glow: rgba(232, 198, 16, 0.28);
    --console-glow-strong: rgba(232, 198, 16, 0.42);
    --console-glow-soft: rgba(255, 240, 102, 0.16);
    --console-glass: rgba(18, 18, 18, 0.78);
    --console-glass-strong: rgba(28, 28, 28, 0.88);
    --console-border: rgba(232, 198, 16, 0.18);
    --console-border-strong: rgba(232, 198, 16, 0.38);
    --console-highlight: rgba(255, 253, 245, 0.07);
    --console-shadow: 0 22px 70px rgba(0, 0, 0, 0.46);
    --console-shadow-glow: 0 0 0 1px var(--console-border), 0 18px 48px rgba(0, 0, 0, 0.42), 0 0 38px rgba(232, 198, 16, 0.12);
}

html[data-theme="light"] {
    --console-glow: rgba(232, 198, 16, 0.22);
    --console-glow-strong: rgba(209, 176, 13, 0.32);
    --console-glow-soft: rgba(232, 198, 16, 0.12);
    --console-glass: rgba(255, 253, 245, 0.78);
    --console-glass-strong: rgba(248, 244, 228, 0.92);
    --console-border: rgba(112, 88, 0, 0.14);
    --console-border-strong: rgba(209, 176, 13, 0.36);
    --console-highlight: rgba(255, 255, 255, 0.58);
    --console-shadow: 0 22px 60px rgba(69, 53, 0, 0.14);
    --console-shadow-glow: 0 0 0 1px var(--console-border), 0 18px 42px rgba(69, 53, 0, 0.14), 0 0 34px rgba(232, 198, 16, 0.10);
}

@keyframes launch-console-ambient {
    0% { transform: translate3d(-2%, -1%, 0) scale(1); opacity: 0.82; }
    50% { transform: translate3d(2%, 1%, 0) scale(1.04); opacity: 1; }
    100% { transform: translate3d(-2%, -1%, 0) scale(1); opacity: 0.82; }
}

@keyframes launch-console-pulse {
    0%, 100% { box-shadow: var(--console-shadow-glow); }
    50% { box-shadow: 0 0 0 1px var(--console-border-strong), 0 22px 58px rgba(0, 0, 0, 0.46), 0 0 46px var(--console-glow); }
}

@keyframes launch-console-focus {
    0% { box-shadow: 0 0 0 0 rgba(232, 198, 16, 0.34); }
    100% { box-shadow: 0 0 0 4px rgba(232, 198, 16, 0); }
}
```

- [ ] **Step 3: Verify the token block was added once**

Run:

```bash
rg "Launch Console refresh|--console-glow|@keyframes launch-console" styles.css
```

Expected: matches for the new section, token names, and three keyframes.

---

### Task 2: Refresh The App Shell And Sidebar Chrome

**Files:**
- Modify: `styles.css`
- Test: browser visual inspection

- [ ] **Step 1: Add shell, ambient background, and sidebar overrides**

Append this after the Task 1 block:

```css
body {
    background:
        radial-gradient(circle at 50% -10%, var(--console-glow-soft), transparent 34%),
        radial-gradient(circle at 8% 18%, rgba(232, 198, 16, 0.10), transparent 26%),
        linear-gradient(135deg, var(--bg-primary) 0%, #100d04 48%, var(--bg-primary) 100%);
}

.app-container {
    position: relative;
    isolation: isolate;
    overflow: hidden;
}

.app-container::before {
    content: '';
    position: absolute;
    inset: -18%;
    z-index: 0;
    pointer-events: none;
    background:
        radial-gradient(circle at 48% 22%, var(--console-glow), transparent 22%),
        repeating-linear-gradient(90deg, rgba(232, 198, 16, 0.055) 0 1px, transparent 1px 42px),
        repeating-linear-gradient(0deg, rgba(255, 253, 245, 0.026) 0 1px, transparent 1px 42px);
    opacity: 0.42;
    transform-origin: center;
    animation: launch-console-ambient 14s ease-in-out infinite;
}

.app-container > * {
    position: relative;
    z-index: 1;
}

.sidebar,
.sidebar-footer,
.tauri-titlebar {
    background:
        linear-gradient(180deg, var(--console-highlight), transparent 34%),
        var(--console-glass);
    border-color: var(--console-border);
    box-shadow: inset 0 1px 0 rgba(255, 253, 245, 0.05);
    backdrop-filter: blur(18px) saturate(120%);
}

.sidebar {
    box-shadow: 12px 0 44px rgba(0, 0, 0, 0.24), inset -1px 0 0 var(--console-border);
}

.sidebar-right {
    box-shadow: -12px 0 44px rgba(0, 0, 0, 0.24), inset 1px 0 0 var(--console-border);
}

.sidebar h2,
.element-properties-title,
.control-label {
    color: color-mix(in srgb, var(--text-secondary) 82%, var(--accent));
    letter-spacing: 0.08em;
}

.divider,
.output-size-divider {
    background: linear-gradient(90deg, transparent, var(--console-border-strong), transparent);
}
```

- [ ] **Step 2: Verify the layout still has three columns**

Start or reuse the server:

```bash
python3 -m http.server 8000
```

Expected: server reports it is serving on port `8000`, unless another server is already running.

Open `http://localhost:8000` and confirm:

- Left sidebar, center canvas area, and right sidebar are still visible.
- No pseudo-element appears as a fourth grid column.
- Background has a subtle black/gold animated console feel.

---

### Task 3: Refresh Controls, Lists, Buttons, And Menus

**Files:**
- Modify: `styles.css`
- Test: browser visual inspection and static search

- [ ] **Step 1: Add shared interactive state overrides**

Append this after the Task 2 block:

```css
.add-btn,
.project-btn,
.settings-btn,
.output-size-trigger,
.project-trigger,
.preset-dropdown-trigger,
.font-picker-trigger,
.modal-btn,
.export-btn,
.tab,
.btn-group button,
.device-option,
.screenshot-item,
.element-item,
.popout-item,
.set-default-btn,
input[type="text"],
input[type="number"],
select,
textarea {
    transition:
        transform 0.22s ease,
        border-color 0.22s ease,
        background 0.22s ease,
        color 0.22s ease,
        box-shadow 0.22s ease,
        opacity 0.22s ease;
}

.add-btn:hover,
.project-btn:hover,
.settings-btn:hover,
.output-size-trigger:hover,
.project-trigger:hover,
.preset-dropdown-trigger:hover,
.font-picker-trigger:hover,
.set-default-btn:hover,
.screenshot-item:hover,
.element-item:hover,
.popout-item:hover,
.device-option:hover,
.tab:hover,
.btn-group button:hover:not(.active) {
    transform: translateY(-1px);
    border-color: var(--console-border-strong);
    background:
        linear-gradient(180deg, var(--console-highlight), transparent),
        var(--accent-subtle);
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.22), 0 0 22px rgba(232, 198, 16, 0.10);
}

.add-btn:active,
.project-btn:active,
.settings-btn:active,
.export-btn:active,
.modal-btn:active,
.screenshot-item:active {
    transform: translateY(0) scale(0.98);
}

.screenshot-item.selected,
.device-option.selected,
.element-item.selected,
.popout-item.selected,
.tab.active,
.btn-group button.active,
.output-size-menu .device-option.selected,
.project-option.selected {
    border-color: var(--console-border-strong);
    background:
        radial-gradient(circle at 12% 0%, var(--console-glow-soft), transparent 42%),
        var(--accent-subtle-strong);
    box-shadow: inset 0 1px 0 rgba(255, 253, 245, 0.08), 0 0 24px rgba(232, 198, 16, 0.12);
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus,
textarea:focus,
.font-picker-trigger:focus {
    border-color: var(--console-border-strong);
    box-shadow: 0 0 0 3px var(--accent-subtle-strong), 0 0 28px rgba(232, 198, 16, 0.12);
    animation: launch-console-focus 0.7s ease-out;
}

input[type="range"] {
    background:
        linear-gradient(90deg, var(--accent), var(--accent-hover)) 0 / 35% 100% no-repeat,
        var(--bg-tertiary);
}

input[type="range"]::-webkit-slider-thumb {
    box-shadow: 0 0 0 4px rgba(232, 198, 16, 0.12), 0 0 20px rgba(232, 198, 16, 0.32);
}
```

- [ ] **Step 2: Add menu, dropdown, and primary action overrides**

Append this after the shared interactive state block:

```css
.screenshot-menu,
.output-size-menu,
.project-menu,
.language-menu,
.font-picker-dropdown {
    background:
        linear-gradient(180deg, var(--console-highlight), transparent 44%),
        var(--console-glass-strong);
    border-color: var(--console-border);
    box-shadow: var(--console-shadow);
    backdrop-filter: blur(18px) saturate(125%);
}

.screenshot-menu-item:hover,
.output-size-menu .device-option:hover,
.project-option:hover,
.language-menu-edit:hover,
.language-menu-item:hover,
.font-option:hover {
    background: var(--accent-subtle);
    color: var(--text-primary);
}

.export-btn,
.modal-btn-primary,
.ai-translate-btn {
    background:
        linear-gradient(135deg, #fff066 0%, var(--accent) 42%, #b58f00 100%);
    color: #121212;
    box-shadow: 0 10px 26px rgba(232, 198, 16, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.42);
}

.export-btn:hover,
.modal-btn-primary:hover,
.ai-translate-btn:hover {
    background:
        linear-gradient(135deg, #fff7a8 0%, #f0d22a 44%, var(--accent-hover) 100%);
    box-shadow: 0 14px 34px rgba(232, 198, 16, 0.32), 0 0 26px rgba(232, 198, 16, 0.18);
    transform: translateY(-1px);
}

.toggle {
    border: 1px solid var(--console-border);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.22);
}

.toggle.active {
    background: linear-gradient(135deg, #fff066, var(--accent));
    box-shadow: 0 0 22px rgba(232, 198, 16, 0.22);
}

.toggle.active::after {
    background: #121212;
}
```

- [ ] **Step 3: Verify interactive states in the browser**

At `http://localhost:8000`, inspect:

- Hover on add buttons, project buttons, settings buttons, tabs, and screenshot rows.
- Open output-size and project dropdowns.
- Focus a text input in the right sidebar.
- Toggle a switch.

Expected:

- Controls lift or glow subtly.
- Menus look glassy and elevated.
- Active/selected states use gold and remain readable.
- No interaction changes app behavior.

---

### Task 4: Refresh Canvas Stage, Empty States, And Modals

**Files:**
- Modify: `styles.css`
- Test: browser visual inspection

- [ ] **Step 1: Add canvas stage and preview chrome overrides**

Append this after the Task 3 block:

```css
.canvas-area {
    background:
        radial-gradient(circle at 50% 42%, rgba(232, 198, 16, 0.18), transparent 30%),
        radial-gradient(circle at 50% 100%, rgba(255, 240, 102, 0.08), transparent 34%),
        transparent;
}

.preview-strip {
    filter: drop-shadow(0 34px 70px rgba(0, 0, 0, 0.36));
}

.canvas-wrapper {
    border: 1px solid var(--console-border);
    box-shadow: var(--console-shadow-glow);
    animation: launch-console-pulse 5.5s ease-in-out infinite;
}

.canvas-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    border-radius: inherit;
    box-shadow: inset 0 1px 0 rgba(255, 253, 245, 0.10), inset 0 0 34px rgba(232, 198, 16, 0.06);
}

.side-preview {
    border: 1px solid var(--console-border);
    box-shadow: 0 18px 54px rgba(0, 0, 0, 0.46), 0 0 28px rgba(232, 198, 16, 0.08);
}

.side-preview:hover {
    opacity: 0.95;
    box-shadow: 0 22px 64px rgba(0, 0, 0, 0.52), 0 0 36px rgba(232, 198, 16, 0.16);
}
```

- [ ] **Step 2: Add empty/upload state and modal overrides**

Append this after the canvas stage block:

```css
.no-screenshot {
    padding: 28px 32px;
    border: 1px dashed var(--console-border-strong);
    border-radius: 18px;
    background:
        radial-gradient(circle at 50% 0%, var(--console-glow-soft), transparent 56%),
        rgba(18, 18, 18, 0.42);
    box-shadow: 0 0 40px rgba(232, 198, 16, 0.10);
    backdrop-filter: blur(12px);
}

.no-screenshot svg {
    color: var(--accent);
    opacity: 0.72;
    filter: drop-shadow(0 0 18px rgba(232, 198, 16, 0.32));
}

.no-screenshot p {
    opacity: 0.86;
}

.upload-item,
.sidebar-content.drop-active {
    border-color: var(--console-border);
    background:
        linear-gradient(180deg, var(--console-highlight), transparent),
        rgba(232, 198, 16, 0.035);
}

.upload-item:hover,
.upload-item.dragover,
.sidebar-content.drop-active {
    border-color: var(--console-border-strong);
    box-shadow: inset 0 0 24px rgba(232, 198, 16, 0.08), 0 0 26px rgba(232, 198, 16, 0.10);
}

.modal-overlay {
    background: rgba(0, 0, 0, 0.78);
    backdrop-filter: blur(14px) saturate(120%);
}

.modal {
    background:
        linear-gradient(180deg, var(--console-highlight), transparent 36%),
        var(--console-glass-strong);
    border-color: var(--console-border);
    box-shadow: var(--console-shadow);
    transform: translateY(14px) scale(0.94);
}

.modal-overlay.visible .modal {
    transform: translateY(0) scale(1);
}

.modal-icon,
.modal-icon-info {
    background:
        radial-gradient(circle, var(--console-glow-soft), var(--accent-subtle-strong));
    box-shadow: 0 0 34px rgba(232, 198, 16, 0.18);
}
```

- [ ] **Step 3: Verify canvas and modal behavior**

At `http://localhost:8000`:

- Confirm the canvas preview remains visible and is not covered by the decorative `::before` layer.
- Use an empty/default project to inspect `.no-screenshot`, or create a blank screen if needed.
- Open a modal through Settings or About.

Expected:

- Center preview has glow and depth around it.
- Canvas content itself is unchanged.
- Empty state feels more premium.
- Modals animate in and remain readable.

---

### Task 5: Add Reduced Motion And Final Verification

**Files:**
- Modify: `styles.css`
- Test: static search, browser visual check, diagnostics

- [ ] **Step 1: Add reduced-motion overrides**

Append this as the final part of the Launch Console section:

```css
@media (prefers-reduced-motion: reduce) {
    .app-container::before,
    .canvas-wrapper {
        animation: none;
    }

    .add-btn,
    .project-btn,
    .settings-btn,
    .output-size-trigger,
    .project-trigger,
    .preset-dropdown-trigger,
    .font-picker-trigger,
    .modal-btn,
    .export-btn,
    .tab,
    .btn-group button,
    .device-option,
    .screenshot-item,
    .element-item,
    .popout-item,
    .set-default-btn,
    input[type="text"],
    input[type="number"],
    select,
    textarea,
    .modal,
    .modal-overlay,
    .canvas-wrapper,
    .side-preview {
        transition-duration: 0.01ms;
        animation-duration: 0.01ms;
        animation-iteration-count: 1;
    }
}
```

- [ ] **Step 2: Run static checks**

Run:

```bash
rg "Launch Console refresh|prefers-reduced-motion|launch-console-ambient|launch-console-pulse|launch-console-focus" styles.css
```

Expected: matches for the refresh section, reduced-motion media query, and keyframes.

Run:

```bash
git status --short
```

Expected in the current directory:

```text
fatal: not a git repository (or any of the parent directories): .git
```

If this directory has become a git repository, do not commit automatically. Show the proposed commit message and wait for approval:

```text
style: add Launch Console editor refresh
```

- [ ] **Step 3: Run diagnostics**

Use IDE diagnostics on:

```text
styles.css
```

Expected: no new diagnostics caused by the CSS refresh.

- [ ] **Step 4: Browser verification checklist**

At `http://localhost:8000`, verify:

- The app keeps the three-column layout.
- Dark theme has the bold black/gold Launch Console look.
- Light theme remains readable if selected in Settings.
- Hover, press, selected, focus, dropdown, modal, upload, and empty states are visibly enhanced.
- No editor control is obscured by decorative layers.
- Screenshot preview and export canvas content remain visually unchanged except for surrounding editor chrome.

- [ ] **Step 5: Report completion**

Report:

- Files changed.
- Verification performed.
- Any checks that could not be completed.
- Whether git commit was skipped because the directory is not a git repository.

# Frame Launch App Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Copy the `appscreen` working tree into `frame-launch-app` without carrying over git history.

**Architecture:** This is a filesystem operation. The source directory remains unchanged; the destination receives all working-tree files except repository metadata and local OS metadata.

**Tech Stack:** macOS shell, `rsync`, existing static web/Tauri project files.

---

## File Structure

- Source: `/Users/tacettinsertkaya/Projects/appscreen`
- Destination: `/Users/tacettinsertkaya/Projects/frame-launch-app`
- No source files are modified by the implementation.
- The destination receives copied project files, including hidden working-tree files such as `.github`, `.gitignore`, and `.dockerignore`.

### Task 1: Verify Destination Safety

**Files:**
- Inspect: `/Users/tacettinsertkaya/Projects/frame-launch-app`
- Inspect: `/Users/tacettinsertkaya/Projects/appscreen`

- [ ] **Step 1: Confirm source and destination directories exist**

Run:

```bash
ls -la "/Users/tacettinsertkaya/Projects/appscreen"
ls -la "/Users/tacettinsertkaya/Projects/frame-launch-app"
```

Expected: both directories exist.

- [ ] **Step 2: Confirm the destination is empty**

Run:

```bash
if [ "$(ls -A "/Users/tacettinsertkaya/Projects/frame-launch-app")" ]; then
  echo "Destination is not empty"
  exit 1
fi
```

Expected: no output and exit code 0. If it prints `Destination is not empty`, stop and ask before overwriting or merging.

### Task 2: Copy Working Tree

**Files:**
- Copy from: `/Users/tacettinsertkaya/Projects/appscreen`
- Copy to: `/Users/tacettinsertkaya/Projects/frame-launch-app`

- [ ] **Step 1: Copy files while excluding repository and OS metadata**

Run:

```bash
rsync -a \
  --exclude='.git' \
  --exclude='.DS_Store' \
  "/Users/tacettinsertkaya/Projects/appscreen/" \
  "/Users/tacettinsertkaya/Projects/frame-launch-app/"
```

Expected: command exits with code 0.

### Task 3: Verify Copy Result

**Files:**
- Inspect: `/Users/tacettinsertkaya/Projects/frame-launch-app`

- [ ] **Step 1: Verify key project files exist**

Run:

```bash
test -f "/Users/tacettinsertkaya/Projects/frame-launch-app/index.html"
test -f "/Users/tacettinsertkaya/Projects/frame-launch-app/app.js"
test -f "/Users/tacettinsertkaya/Projects/frame-launch-app/styles.css"
test -f "/Users/tacettinsertkaya/Projects/frame-launch-app/package.json"
test -d "/Users/tacettinsertkaya/Projects/frame-launch-app/src-tauri"
```

Expected: each command exits with code 0.

- [ ] **Step 2: Verify git metadata was not copied**

Run:

```bash
test ! -e "/Users/tacettinsertkaya/Projects/frame-launch-app/.git"
```

Expected: command exits with code 0.

- [ ] **Step 3: List copied destination contents**

Run:

```bash
ls -la "/Users/tacettinsertkaya/Projects/frame-launch-app"
```

Expected: destination contains the copied application files and no `.git` directory.

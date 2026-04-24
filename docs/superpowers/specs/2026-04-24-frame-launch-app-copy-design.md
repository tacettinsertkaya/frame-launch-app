# Frame Launch App Copy Design

## Goal

Create `/Users/tacettinsertkaya/Projects/frame-launch-app` as an independent working-tree copy of `/Users/tacettinsertkaya/Projects/appscreen`.

## Approved Approach

Copy the project files from `appscreen` into `frame-launch-app` while excluding repository metadata. The destination folder is currently empty, so the copy should not overwrite existing user work.

## Scope

Included:

- Source files, assets, scripts, Docker files, Tauri files, README, and project configuration.
- Hidden project files that are part of the working tree, such as `.github`, `.gitignore`, and `.dockerignore`.

Excluded:

- `.git` history and remotes.
- `.DS_Store` and other local OS metadata.

## Verification

After copying, verify that key files such as `index.html`, `app.js`, `styles.css`, `package.json`, and `src-tauri` exist in `frame-launch-app`. Also confirm that `frame-launch-app/.git` does not exist.

## Error Handling

If the destination is no longer empty before the copy runs, stop and ask before overwriting or merging files. If the copy fails, report the error and leave the source project unchanged.

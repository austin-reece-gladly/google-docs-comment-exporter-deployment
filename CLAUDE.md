# Google Docs Comment Exporter

## Project overview

A Google Apps Script tool that exports comments from Google Docs to AI-ready markdown files. Users install it via Extensions > Apps Script, and it adds a custom menu to their doc with export options.

## Architecture

- **Runtime:** Google Apps Script (server-side JavaScript)
- **APIs:** Google Docs API (via `DocumentApp`), Google Drive API v3 (via `Drive.Comments.list`)
- **UI:** HTML/CSS dialogs served through `HtmlService` (no framework — raw HTML templates embedded in JS strings)
- **Single file:** All logic lives in `src/comment-exporter-MARKDOWN.js` (~1,000 lines)
- **Manifest:** `src/appsscript.json` configures OAuth scopes and add-on metadata

## Key functions

- `onOpen()` — creates the custom menu in Google Docs
- `exportCommentsToMarkdown(contextChars)` — exports all comments (resolved + open)
- `exportOpenCommentsToMarkdown(contextChars)` — exports only unresolved comments with AI prompt template
- `getSurroundingContext(quotedText, contextChars)` — extracts text around a quoted comment from the document body
- `showDownloadDialog(downloadUrl, fileName, commentCount)` — renders the HTML modal dialog
- `exportWithCustomSettings()` — shows a settings dialog for context size and filter type
- `exportToFolder()` — saves export to a "Comment Exports" folder

## File structure

```
src/
  comment-exporter-MARKDOWN.js  — main script (copy into Apps Script editor)
  appsscript.json               — manifest for add-on deployment
README.md                       — user-facing documentation
LICENSE                         — MIT
```

## Conventions

- No build system, no dependencies, no package manager — this is a standalone Apps Script
- HTML/CSS for dialogs is embedded as template literals inside JS functions
- Use `Logger.log()` for debugging (visible in Apps Script execution log)
- `var` declarations throughout (Apps Script V8 supports `let`/`const` but the codebase uses `var`)
- Comments use JSDoc-style `/** */` blocks for function docs
- Default context size is 200 characters before/after quoted text

## OAuth scopes (keep minimal)

- `documents.currentonly` — access only the active document
- `drive.file` — create/manage files the script creates

## Deployment modes

1. **Per-document:** User copies script into Extensions > Apps Script manually
2. **Workspace Add-on:** Deploy via Google Cloud Project for org-wide installation (see `appsscript.json` add-on config)

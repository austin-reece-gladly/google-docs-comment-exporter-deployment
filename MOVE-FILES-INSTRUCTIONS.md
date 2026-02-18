# File Move Instructions

## Issue

The project files were initially moved to `/Users/austinreece/Documents/Claude Projects/google-doc-comment-export/` which appears to be a macOS-protected directory that command-line tools cannot access directly.

## Solution

Please use Finder to manually move the following files from the protected location to the accessible location:

### Source Files to Move

**From:** `/Users/austinreece/Documents/Claude Projects/google-doc-comment-export/src/`
**To:** `/Users/austinreece/Documents/claude-projects/google-doc-comment-export/src/`

Files to move:
- `comment-exporter-MARKDOWN.js` (main script - 29KB)
- `appsscript.json` (for Phase 2 add-on conversion)

### Example Files to Move

**From:** `/Users/austinreece/Documents/Claude Projects/google-doc-comment-export/examples/`
**To:** `/Users/austinreece/Documents/claude-projects/google-doc-comment-export/examples/`

Files to move:
- `export-dialog.html`
- `FINAL-comment-exporter.js`
- `comment-exporter-RESEARCHED.js`
- `comment-exporter-WORKING.js`
- `comment-exporter-v3.js`

### Legacy Documentation Files to Move

**From:** `/Users/austinreece/Documents/Claude Projects/google-doc-comment-export/docs/`
**To:** `/Users/austinreece/Documents/claude-projects/google-doc-comment-export/docs/`

Files to move:
- `MARKDOWN-EXPORTER-README.md`
- `UPDATED-FEATURES.md`
- `google-docs-comment-exporter-FIXED.md`
- `google-docs-comment-exporter.md`

## Steps to Move Files Manually

1. **Open Finder**
2. **Go to:** `/Users/austinreece/Documents/Claude Projects/google-doc-comment-export/`
   - Press Cmd+Shift+G and paste the path above
3. **Select all files** in the `src/` folder
4. **Copy them** (Cmd+C)
5. **Navigate to:** `/Users/austinreece/Documents/claude-projects/google-doc-comment-export/src/`
   - Press Cmd+Shift+G and paste the path above
6. **Paste files** (Cmd+V)
7. **Repeat** for `examples/` and `docs/` folders

## Verification

After moving, run this command to verify all files are in place:

```bash
cd ~/Documents/claude-projects/google-doc-comment-export
find . -type f | sort
```

You should see:
- ./README.md
- ./DEPLOYMENT-CHECKLIST.md
- ./src/comment-exporter-MARKDOWN.js
- ./src/appsscript.json
- ./docs/*.md (all guide files)
- ./examples/*.html and *.js (reference files)

## Cleanup (Optional)

After verifying the files are moved successfully, you can delete the original protected directory:

```bash
rm -rf "/Users/austinreece/Documents/Claude Projects/google-doc-comment-export/"
```

Or use Finder to move it to Trash.

# Source Files

## ⚠️ Action Required: Add Source Code

The Apps Script source code needs to be manually added to this directory using Finder (macOS permissions prevent command-line access).

### Files Needed

1. **comment-exporter-MARKDOWN.js** (29KB) - Main Apps Script code
   - This is the core script that users will install
   - Contains all export logic and UI functions

2. **appsscript.json** - Already present ✅
   - Manifest for Phase 2 (Google Workspace Add-on)
   - OAuth scopes and API dependencies configured

### How to Add the Source File

**Option 1: Manual Copy (Recommended)**

Follow the instructions in [MOVE-FILES-INSTRUCTIONS.md](../MOVE-FILES-INSTRUCTIONS.md):

1. Open Finder
2. Navigate to: `/Users/austinreece/Documents/Claude Projects/google-doc-comment-export/src/`
3. Copy `comment-exporter-MARKDOWN.js`
4. Paste into: `/Users/austinreece/Documents/claude-projects/google-doc-comment-export/src/`

**Option 2: Use the Script You Have**

If you already have the working script elsewhere:
1. Copy the file into this `src/` directory
2. Ensure it's named `comment-exporter-MARKDOWN.js`
3. Commit and push to GitHub

### After Adding the File

```bash
cd ~/Documents/claude-projects/google-doc-comment-export
git add src/comment-exporter-MARKDOWN.js
git commit -m "Add Google Apps Script source code"
git push
```

### What This File Contains

The `comment-exporter-MARKDOWN.js` file includes:
- `onOpen()` - Creates custom menu in Google Docs
- `exportAllCommentsToMarkdown()` - Exports all comments
- `exportOpenCommentsToMarkdown()` - Exports only unresolved comments
- Comment parsing and markdown formatting functions
- Google Drive file creation logic
- Styled download dialog UI
- Error handling

### Why It's Not Included Yet

macOS protects the "Documents/Claude Projects" directory (with capital C and space), preventing automated command-line access. The file must be moved manually via Finder.

### Verification

Once added, the `src/` directory should contain:
```
src/
├── README.md (this file)
├── appsscript.json ✅
└── comment-exporter-MARKDOWN.js ⚠️ (add this file)
```

---

**Status:** Waiting for manual file addition via Finder
**See:** [MOVE-FILES-INSTRUCTIONS.md](../MOVE-FILES-INSTRUCTIONS.md) for detailed steps

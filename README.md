# Google Docs Comment Exporter

Export all comments from a Google Doc to AI-ready markdown format with one click.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What It Does

- Exports all document comments to a `.md` file
- Includes comment threads, authors, and timestamps
- Shows quoted text with surrounding context
- Perfect for AI analysis (Claude, ChatGPT)
- Creates beautiful download dialog

## Installation (5 minutes)

1. **Open your Google Doc**

2. **Extensions → Apps Script**

3. **Delete the default code**

4. **Copy and paste** the code from [`src/comment-exporter-MARKDOWN.js`](src/comment-exporter-MARKDOWN.js)

5. **Add Drive API:**
   - Click ⊕ next to "Services" in the left sidebar
   - Find "Drive API" → select version **v3** → Add

6. **Save** (💾 icon or Cmd/Ctrl+S)

7. **Refresh your Google Doc** (Cmd/Ctrl+R)

8. **Look for the "💬 Comment Exporter" menu** in your doc

Done! ✅

## Usage

Click **💬 Comment Exporter** in your menu:

- **Export All Comments** - Everything (including resolved)
- **Export Open Comments Only** - Just unresolved comments (AI-ready with prompt template)
- **Export to Organized Folder** - Save to "Comment Exports" folder
- **Custom Export Settings** - Adjust context size and filters

The script creates a `.md` file in your Google Drive and shows a download dialog.

## Features

### Two Export Modes

**All Comments:**
```markdown
# Comments from: Your Document

## Comment #1 - John Doe
**Date:** 2/18/2026
**Status:** ✓ Resolved

**Document Context:**
_...previous text:_ background about the topic

**→ Referenced Text:**
> This is the text being commented on

**Comment:**
Great point! We should expand this section.

**Discussion (2 replies):**
- **Jane Smith** (2/18/2026): Agreed, adding more details now
- **John Doe** (2/18/2026) [Resolved]: Perfect!
```

**Open Comments Only:**
Includes an AI prompt template to help analyze and address feedback.

### Smart Features

- Comments sorted by position in document (top to bottom)
- Shows 200 characters before/after quoted text for context
- Includes reply threads and resolve/reopen actions
- Beautiful animated download dialog
- Files auto-named with document name and timestamp

## Use Cases

- **AI Analysis:** Paste into Claude/ChatGPT to summarize feedback
- **Action Items:** Extract todos from open comments
- **Archives:** Save discussion history before resolving
- **Reports:** Create stakeholder feedback summaries

## Example AI Prompt

After exporting, paste the markdown into an AI and ask:

```
Analyze these document comments and:
1. Summarize key themes
2. Identify conflicting feedback
3. Extract action items by priority
4. Suggest how to address each comment
```

## Troubleshooting

**Menu doesn't appear?**
- Refresh the page (Cmd/Ctrl+R)
- Close and reopen the document

**"Access denied: Drive" error?**
- You didn't add Drive API v3 in step 5
- Go to Apps Script → Services → Add Drive API v3 → Save

**Authorization popup?**
- Click "Continue"
- Click "Advanced" → "Go to [Project] (unsafe)" - this is your own script
- Click "Allow"
- This only happens once

## Advanced: Deploy as Workspace Add-on

Want to make this available to your entire organization automatically?

1. Create a Google Cloud Project
2. Copy `src/appsscript.json` as the add-on manifest
3. Deploy as Google Workspace Add-on
4. Submit to Marketplace (private/domain-only)
5. IT admin installs once for entire organization

See [`src/appsscript.json`](src/appsscript.json) for the add-on configuration.

## Files

- **[src/comment-exporter-MARKDOWN.js](src/comment-exporter-MARKDOWN.js)** - Main script (copy this!)
- **[src/appsscript.json](src/appsscript.json)** - Add-on manifest (for org deployment)
- **[LICENSE](LICENSE)** - MIT License

## Contributing

Contributions welcome! This is a simple, focused tool. Keep it that way.

- Fix bugs
- Improve documentation
- Suggest UX improvements
- Share use cases

## License

MIT License - use it however you want.

---

**Made with ❤️ for better document reviews**

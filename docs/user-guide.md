# User Guide: Google Docs Comment Exporter

**How to use the Comment Exporter after installation**

## Quick Start

Once installed, using the Comment Exporter is simple:

1. Open your Google Doc (that has the exporter installed)
2. Click **"Comment Exporter"** in the top menu
3. Choose your export mode:
   - **"Export All Comments to Markdown"** - Exports all comments (including resolved)
   - **"Export Open Comments to Markdown"** - Exports only unresolved comments
4. Wait a few seconds while the export runs
5. A dialog appears - click **"Download Markdown File"** or **"Open in Drive"**

That's it! Your comments are now in a clean markdown file.

---

## Export Modes Explained

### Export All Comments

**Use when:**
- You want a complete archive of all feedback
- You're preparing a document history for review
- You need to analyze resolved discussions
- You're creating a comprehensive summary

**What it includes:**
- All comments (open AND resolved)
- Comment threads (replies to comments)
- Author names and timestamps
- Quoted text from the document

### Export Open Comments Only

**Use when:**
- You want to focus on unresolved feedback
- You're preparing an action items list
- You only care about pending discussions
- You're sharing work-in-progress feedback

**What it includes:**
- Only unresolved/open comments
- Their reply threads
- Author names and timestamps
- Quoted text from the document

---

## Understanding the Markdown Output

### File Format

**Filename:** `[Document Name]_comments_[timestamp].md`

**Example:** `Product_Roadmap_Q2_comments_20260218_143052.md`

**Location:** Your Google Drive (root folder by default)

### Markdown Structure

Here's what the exported file looks like:

```markdown
# Comments from: Product Roadmap Q2

**Exported on:** February 18, 2026 at 2:30:52 PM
**Total comments:** 12

---

## Comment 1

**Author:** Sarah Chen
**Date:** February 15, 2026 at 9:23 AM
**Status:** OPEN

**Quoted text:**
> Increase marketing budget by 20%

**Comment:**
Do we have exec approval for this increase? Last quarter we were told to hold steady.

**Replies:**
- **John Smith** (Feb 15, 2026 at 10:15 AM): Good catch. I'll check with finance before Friday.
- **Sarah Chen** (Feb 15, 2026 at 2:30 PM): Thanks! Also need to consider hiring freeze implications.

---

## Comment 2

**Author:** Mike Johnson
**Date:** February 16, 2026 at 11:45 AM
**Status:** RESOLVED

**Quoted text:**
> Launch date: March 15

**Comment:**
This conflicts with the dev timeline. We need at least 3 weeks for QA.

**Replies:**
- **Emma Davis** (Feb 16, 2026 at 1:20 PM): You're right. Moving to April 1st.

---
```

### What Each Section Means

- **Document Title:** The name of your Google Doc
- **Export Timestamp:** When you ran the export
- **Total Comments:** Count of comments in this export
- **Comment Number:** Sequential numbering for reference
- **Author:** Who wrote the comment
- **Date:** When the comment was created
- **Status:** OPEN or RESOLVED
- **Quoted Text:** The section of the document the comment refers to
- **Comment:** The actual comment text
- **Replies:** Any responses to the comment (threaded discussions)

---

## Common Use Cases

### 1. AI-Powered Comment Analysis

**Scenario:** You have a 50-page document with 30+ comments from multiple reviewers. You want to quickly understand themes and identify conflicts.

**Workflow:**
1. Export all comments to markdown
2. Open the .md file
3. Copy the contents
4. Paste into Claude or ChatGPT with a prompt like:

```
Analyze these document comments and:
1. Summarize key themes
2. Identify conflicting feedback
3. List action items by priority
4. Flag any concerns that need executive attention
```

**Result:** AI provides structured analysis in seconds.

### 2. Stakeholder Feedback Summary

**Scenario:** You need to present feedback from document reviewers to leadership.

**Workflow:**
1. Export all comments
2. Use AI or manually review the markdown
3. Create executive summary with:
   - Top concerns
   - Common themes
   - Resolved vs. open issues
   - Next steps

**Tip:** The markdown format is easy to search (Cmd/Ctrl+F) for specific keywords like "concern", "approve", "disagree".

### 3. Action Items Extraction

**Scenario:** After a collaborative document review, you need a list of action items.

**Workflow:**
1. Export open comments only (unresolved items)
2. Search for action-oriented keywords: "need to", "should", "must", "follow up"
3. Copy relevant sections into a task list
4. Assign owners and due dates

**Pro Tip:** Ask AI to extract action items:
```
From these comments, create a task list with:
- Action item description
- Owner (comment author or mentioned person)
- Priority (based on urgency language)
```

### 4. Document History Archive

**Scenario:** You're finalizing a document and want to preserve the review history.

**Workflow:**
1. Export all comments (including resolved)
2. Save the markdown file in your project folder
3. Resolve all comments in the Google Doc
4. Keep the .md file as a record of decisions made

**Benefit:** Clean final document + complete discussion archive.

### 5. Legal/Compliance Review

**Scenario:** Legal team has reviewed a contract in Google Docs. You need a timestamped record of their comments.

**Workflow:**
1. Export all comments
2. Save with a clear filename: `Contract_v3_Legal_Review_Feb2026.md`
3. Store in secure folder
4. Reference specific comments by number in future communications

**Bonus:** Markdown is plain text, so it's easy to search, version control (git), and future-proof.

### 6. Training Material Creation

**Scenario:** You're creating documentation and want to incorporate reviewer feedback inline.

**Workflow:**
1. Export all comments
2. Review suggestions in markdown format
3. Update main document based on feedback
4. Mark comments as resolved
5. Keep markdown export as "feedback received" log

---

## Tips & Tricks

### Finding Your Exported File

**Option 1: Download Dialog**
- After export completes, click "Download Markdown File"
- File saves to your Downloads folder

**Option 2: Google Drive**
- After export completes, click "Open in Drive"
- File appears in your Drive root folder
- Search Drive for `.md` files to find all exports

**Option 3: Manual Search**
- Go to Google Drive
- Search: `type:text [document name]`
- Sort by "Last modified" to find recent exports

### Organizing Your Exports

**Create a Drive folder:**
1. Make a folder: "Comment Exports" in Google Drive
2. After exporting, move files into this folder
3. Optionally: Create subfolders by project or month

### Using Markdown Files

**Markdown readers:**
- **macOS:** Preview app (opens .md files), Marked 2, iA Writer
- **Windows:** Typora, MarkdownPad, VS Code
- **Web:** Dillinger.io, StackEdit
- **Mobile:** iA Writer, Ulysses, Bear (iOS), Markor (Android)

**Convert to other formats:**
- **PDF:** Open in Typora/Marked → Export to PDF
- **Word:** Open in Pandoc → Convert to .docx
- **HTML:** Many markdown editors have HTML export

### Searching Within Exports

**Find specific comments:**
- Open .md file in any text editor
- Use Find (Cmd/Ctrl+F)
- Search for: Author names, keywords, dates

**Example searches:**
- "Status: OPEN" - Jump to unresolved comments
- "Sarah Chen" - Find all of Sarah's comments
- "urgent" or "ASAP" - Find high-priority items
- "February 15" - Comments from a specific date

### Combining Multiple Exports

**Scenario:** You have comments from 5 related documents and want a single file.

**Simple method:**
1. Export comments from each document
2. Open all .md files in a text editor
3. Copy/paste into one master file
4. Add document names as headers

**Advanced method:**
```bash
# Combine multiple .md files (Mac/Linux terminal)
cat doc1_comments.md doc2_comments.md > combined_comments.md
```

### Using with AI Tools

**Claude (claude.ai):**
1. Start a new conversation
2. Click the attachment icon
3. Upload your .md file
4. Ask: "Summarize these comments" or any analysis question

**ChatGPT:**
1. Start new chat
2. Paste the markdown contents
3. Ask for analysis

**Pro Tip - Effective AI prompts:**

```
Review these document comments and:

1. Categorize by theme (e.g., budget, timeline, legal)
2. Summarize each category in 2-3 sentences
3. Identify any conflicting opinions between reviewers
4. Extract action items with responsible parties
5. Flag comments that suggest risks or concerns
```

```
Create a response email to reviewers that:
- Thanks them for feedback
- Summarizes the key changes we'll make
- Addresses the top 3 concerns raised
- Sets expectations for next review round
```

```
Compare these comments to our original project goals.
Are reviewers raising concerns that indicate scope creep?
```

---

## Best Practices

### When to Export

**During review cycles:**
- Export weekly during active review periods
- Capture feedback before meetings to prepare discussion points
- Export before resolving comments (preserve history)

**At milestones:**
- Export at each document version (v1, v2, final)
- Create a paper trail of decision-making
- Archive feedback for post-mortem reviews

### Managing Comments vs. Exports

**Workflow recommendation:**
1. Collaborators add comments during review period
2. **Before resolving any comments:** Export all comments
3. Review the markdown export (easier to see patterns)
4. Make document updates based on feedback
5. Resolve comments in Google Doc
6. Keep markdown export for records

**Why export before resolving?**
- Resolved comments can still be exported, but it's easier to track "what was discussed" if you export at the end of each review cycle
- Creates a clean archive of each round of feedback

### Naming Convention

**Recommended filename format:**
- Manual rename: `ProjectName_Version_ReviewType_Date.md`
- Example: `ProductRoadmap_v2_StakeholderReview_Feb2026.md`

**Benefits:**
- Easy to find in Drive searches
- Chronological sorting works correctly
- Self-documenting (you know what's inside)

### Privacy & Security

**Sensitive documents:**
- Remember: Exported markdown contains all comment text
- Don't share .md files outside authorized groups
- If uploading to AI tools, use enterprise versions with data protection
- For highly sensitive docs, review exports before sharing

**Company policy:**
- Check if your company has policies about exporting comments
- Some legal/HR documents may have export restrictions
- When in doubt, ask your manager or compliance team

---

## Troubleshooting

### "Comment Exporter menu disappeared"

**Cause:** Apps Script triggers reset when document is copied or moved.

**Fix:**
- Refresh the page (Cmd/Ctrl+R)
- If still gone: Reinstall the script (takes 2 minutes)

### "Export runs but no dialog appears"

**Cause:** Pop-up blocker or browser extension interference.

**Fix:**
1. Check if Chrome/browser blocked a pop-up (look for icon in address bar)
2. Allow pop-ups for docs.google.com
3. Disable browser extensions temporarily
4. Try in Incognito/Private mode

**Alternative:** File was still created in Drive
- Go to Google Drive
- Look for the newest .md file
- It exported successfully, just the dialog didn't show

### "Exported file is empty or incomplete"

**Cause:** Document has no comments, or only has resolved comments in "Open Only" mode.

**Fix:**
- Verify the document actually has comments (toggle comment view)
- If you want resolved comments, use "Export All Comments" mode
- Check Google Drive file size (if it's 1KB, likely has content - open it)

### "File name has weird characters"

**Cause:** Document title contains special characters that aren't filename-safe.

**Fix:**
- The script auto-replaces unsafe characters
- You can manually rename the .md file in Google Drive
- Or rename your Google Doc to use simpler characters

### "Comments are out of order in the export"

**Cause:** Google Docs API returns comments in internal order, not document position.

**Expected behavior:**
- Comments appear in the order Google created them
- Not necessarily in the order they appear in the document
- This is a Google Docs API limitation

**Workaround:**
- The quoted text shows context for each comment
- Search the markdown file for specific sections if needed

---

## Advanced: Automating Workflows

### Scheduled Exports (Requires Apps Script knowledge)

You can modify the script to run automatically:

1. Add a time-based trigger in Apps Script
2. Set it to export daily/weekly
3. Emails you the .md file or saves to a specific Drive folder

**Ask IT for help with this if interested.**

### Integration with Other Tools

**Possible integrations:**
- **Slack/Teams:** Post exports to project channels
- **Notion/Confluence:** Import markdown as pages
- **GitHub:** Commit exports to documentation repos
- **Email:** Auto-send exports to stakeholders

**These require custom development - share ideas with IT team.**

---

## Frequently Asked Questions

**Q: Does this export images from comments?**
A: No, only text. Image annotations in comments are not included.

**Q: Can I export comments from multiple documents at once?**
A: Not in the current version (Phase 1). Each document needs individual export. Batch export may come in Phase 2.

**Q: What if someone deletes a comment before I export?**
A: Deleted comments are gone - the script only sees current comments. Export regularly to avoid losing discussion history.

**Q: Does this work in Google Sheets or Slides?**
A: No, currently only Google Docs. The API structure is different for Sheets/Slides.

**Q: Can I customize the markdown format?**
A: Yes, but requires editing the Apps Script code. Ask IT if you need custom formatting.

**Q: Does the export include comment formatting (bold, links)?**
A: Plain text only. Formatting within comments is stripped during export.

**Q: What's the file size limit?**
A: Google Drive can handle very large .md files. The script has no practical limit for typical documents (even 100+ comments export fine).

**Q: Can I export to other formats (JSON, CSV, PDF)?**
A: Current version exports markdown only. Other formats may be added in future versions. Share your use case with IT.

**Q: Will this slow down my document?**
A: No. The script only runs when you click "Export". It doesn't run in the background or affect document performance.

**Q: What happens if I export while someone is adding comments?**
A: The export captures comments at the moment you click export. New comments added during the export process won't be included (re-export to get them).

---

## Give Feedback

We want to make this tool better!

**Share your:**
- Use cases we didn't think of
- Feature requests
- Bugs or issues
- Success stories

**Where to share:**
- Slack: #comment-exporter
- Email: [IT support email]
- Survey: [Link to feedback form]

---

## Quick Reference Card

**Installation:**
1. Extensions → Apps Script
2. Delete default code, paste script
3. Add Drive API v3 service
4. Save & refresh document

**Export:**
1. Comment Exporter menu
2. Choose mode (All or Open only)
3. Download or open in Drive

**File format:** Markdown (.md)
**File location:** Google Drive root
**File name:** `[DocName]_comments_[timestamp].md`

**Best uses:**
- AI analysis of feedback
- Action item extraction
- Stakeholder summaries
- Document history archives
- Legal/compliance records

**Support:**
- Wiki: [Link]
- Slack: #comment-exporter
- Video: [Link]

---

**Happy exporting!** 🚀

*Need installation help? See the [Installation Guide](installation-guide.md)*
*IT team? Check the [IT Deployment Guide](it-deployment-guide.md)*

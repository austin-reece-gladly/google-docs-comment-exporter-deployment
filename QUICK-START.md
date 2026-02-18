# Quick Start Guide: Google Docs Comment Exporter

**Get up and running in 5 minutes**

## What This Tool Does

Exports all comments from a Google Doc to a clean markdown file with one click. Perfect for AI analysis, feedback summaries, and archiving discussions.

## Installation (5 minutes)

### Step 1: Open Apps Script in Your Google Doc

1. Open the Google Doc where you want the exporter
2. Click **Extensions** → **Apps Script**
3. Delete the default code in the editor

### Step 2: Add the Script

1. Get the script from your company wiki: `[INSERT YOUR WIKI LINK HERE]`
2. Copy the entire script
3. Paste it into the Apps Script editor

### Step 3: Add Google Drive API

1. In the left sidebar, click the **⊕** next to "Services"
2. Scroll down and find **"Drive API"**
3. Select **version v3**
4. Click **Add**

### Step 4: Save and Refresh

1. Click the **Save icon** (💾) in Apps Script
2. Go back to your Google Doc tab
3. **Refresh the page** (Cmd+R or Ctrl+R)

### Step 5: Verify

Look for **"Comment Exporter"** in your Google Docs menu bar. ✅ You're done!

## Usage

1. Click **Comment Exporter** → Choose export mode
2. Wait 2-3 seconds
3. Click **Download Markdown File**

## Export Modes

- **Export All Comments** - Everything (including resolved)
- **Export Open Comments Only** - Just unresolved comments

## What You Get

A markdown file saved to your Google Drive:
- Clean, readable format
- All comment text with authors and dates
- Quoted text from document
- Reply threads preserved
- Perfect for AI tools (Claude, ChatGPT)

## Common Uses

1. **AI Analysis** - Paste into Claude/ChatGPT to summarize feedback
2. **Action Items** - Extract to-dos from open comments
3. **Archives** - Save discussion history before resolving
4. **Reports** - Create stakeholder feedback summaries

## Troubleshooting

**Menu doesn't appear?**
- Refresh the page (Cmd/Ctrl+R)

**"Access denied: Drive" error?**
- You forgot Step 3 (add Drive API v3 service)

**Authorization popup?**
- Click "Continue" → "Advanced" → "Go to [Project] (unsafe)" → "Allow"
- This is normal on first use

## Full Documentation

- 📖 [Complete Installation Guide](docs/installation-guide.md)
- 👤 [User Guide](docs/user-guide.md) - Tips, tricks, use cases
- 🛠️ [IT Deployment Guide](docs/it-deployment-guide.md) - For IT teams

## Support

- **Wiki:** [YOUR COMPANY WIKI LINK]
- **Slack:** #comment-exporter
- **Video Tutorial:** [YOUR VIDEO LINK]
- **IT Support:** [YOUR SUPPORT EMAIL]

---

**Installation takes 5 minutes. Time saved: countless hours.**

Ready to scale this across your organization? See [IT Deployment Guide](docs/it-deployment-guide.md).

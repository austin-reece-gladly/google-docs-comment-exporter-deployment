# IT Setup Guide: Google Docs Comment Exporter

**For:** IT teams deploying the Comment Exporter
**Focus:** Technical configuration and deployment options

---

## Overview

Two deployment options:
1. **Phase 1:** Manual per-document installation (users install themselves)
2. **Phase 2:** Google Workspace Add-on (IT installs once for entire domain)

This guide covers the technical setup for both phases.

---

## Phase 1: Manual Installation Setup

### What Users Need

Users will install the script themselves in each Google Doc. Your role is to provide:

1. **The script file** - Distribute via one of these methods:
   - Internal wiki page
   - Shared Google Drive folder
   - Direct download link
   - Code repository

2. **Installation documentation** - Point users to:
   - [Installation Guide](installation-guide.md) - Step-by-step instructions
   - [User Guide](user-guide.md) - How to use after installation

### Distribution Methods

#### Option A: Internal Wiki/Portal

**Setup:**
1. Create a wiki page on your internal platform (Confluence, Notion, SharePoint, etc.)
2. Add the installation guide content
3. Embed the script in a code block with a copy button
4. Add link to user guide

**Advantages:**
- Single source of truth
- Easy to update
- Searchable

#### Option B: Google Drive Folder

**Setup:**
```bash
# 1. Create shared folder structure:
Google Drive/
└── Workspace Tools/
    └── Comment Exporter/
        ├── installation-guide.pdf
        ├── comment-exporter-script.txt
        └── user-guide.pdf

# 2. Share with organization:
- Anyone at [domain].com can view
```

**Advantages:**
- Native to Google Workspace
- Offline access to PDFs
- File version history

#### Option C: Direct File Distribution

**Setup:**
1. Save script as `comment-exporter.txt`
2. Distribute via email or chat
3. Include link to installation guide

**Advantages:**
- Immediate access
- Simple for small teams

### Technical Support Setup

**Common Support Issues:**

| Issue | Cause | Solution |
|-------|-------|----------|
| Menu doesn't appear | User didn't refresh document | Instruct to refresh page (Cmd/Ctrl+R) |
| "Access denied: Drive" error | User didn't add Drive API v3 service | Guide to: Apps Script → Services → Add Drive API v3 |
| Authorization loop | Normal OAuth warning for unverified apps | Guide through: Advanced → "Go to [Project] (unsafe)" → Allow |
| Script runs but no file | File created but user can't find it | Search Drive for `.md` files modified today |

**Quick Diagnostic Checklist:**
- ☐ Is Apps Script enabled for user's Workspace account?
- ☐ Did user add Drive API v3 service?
- ☐ Did user save the script?
- ☐ Did user refresh the document after saving?
- ☐ Did user authorize the script on first run?
- ☐ Does user have edit access to the document?

---

## Phase 2: Google Workspace Add-on (Recommended)

### Prerequisites

- Google Workspace admin access
- Google Cloud Platform account (free)
- ~2-3 hours for setup

### Benefits Over Manual Installation

| Manual (Phase 1) | Add-on (Phase 2) |
|------------------|------------------|
| User installs per document | IT installs once for domain |
| 5-10 min per user | Zero user setup |
| Support tickets for installation | Zero installation support |
| Users must discover it | Automatically available in all docs |

### Technical Setup Process

#### Step 1: Create Google Cloud Project

```bash
# 1. Go to: https://console.cloud.google.com/
# 2. Create new project:
#    - Name: "comment-exporter-addon"
#    - Organization: [your workspace domain]
#    - Location: [your org]
```

**Enable Required APIs:**
1. Go to APIs & Services → Library
2. Enable:
   - Google Docs API
   - Google Drive API

#### Step 2: Configure OAuth Consent Screen

```bash
# 1. Go to: APIs & Services → OAuth consent screen
# 2. Choose: Internal (Workspace users only)
# 3. Fill required fields:
#    - App name: "Comment Exporter"
#    - User support email: [your IT email]
#    - Developer contact: [your IT email]
# 4. Add scopes:
```

**Required OAuth Scopes:**
- `https://www.googleapis.com/auth/documents.currentonly`
- `https://www.googleapis.com/auth/drive.file`

**Save and continue.**

#### Step 3: Create Apps Script Add-on Project

1. **Go to:** https://script.google.com/
2. **Create new project** (standalone, not bound to a document)
3. **Name it:** "Comment Exporter Add-on"

**Project Structure:**
```
comment-exporter-addon/
├── Code.gs              # Main script (copy from src/comment-exporter-MARKDOWN.js)
└── appsscript.json      # Manifest (copy from src/appsscript.json)
```

4. **Copy files:**
   - Copy contents of `src/comment-exporter-MARKDOWN.js` → `Code.gs`
   - Copy contents of `src/appsscript.json` → `appsscript.json`

5. **Link to Cloud Project:**
   - Project Settings (gear icon) → Google Cloud Platform (GCP) Project
   - Click "Change project"
   - Enter your Cloud Project number (from Cloud Console)
   - Click "Set project"

#### Step 4: Test in Development Mode

1. **Deploy:**
   - Click "Deploy" → "Test deployments"
   - Select "Docs" add-on
   - Click "Install"

2. **Test:**
   - Open any Google Doc
   - Check that "Comment Exporter" menu appears
   - Try exporting comments
   - Verify file saves to Drive

3. **Debug if needed:**
   - View → Executions (check for errors)
   - View → Logs (check execution logs)

#### Step 5: Create Deployment

1. **Deploy as Add-on:**
   - Click "Deploy" → "New deployment"
   - Type: "Add-on"
   - Description: "Version 1.0 - Initial release"
   - Click "Deploy"

2. **Note the Deployment ID** (you'll need this for Marketplace)

#### Step 6: Submit to Google Workspace Marketplace

1. **Go to:** https://console.cloud.google.com/marketplace/browse

2. **Create OAuth Client:**
   - APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs: (Leave default for Apps Script)

3. **Configure Marketplace SDK:**
   - APIs & Services → Marketplace SDK
   - Store Listing:
     - App name: "Comment Exporter"
     - Short description: "Export Google Docs comments to markdown"
     - Detailed description: [See template below]
     - Category: "Productivity"
     - Icon: 256x256 image (optional)

4. **Set Visibility:**
   - Choose: **"Private"** (domain only)
   - Or: **"Unlisted"** (only those with link can install)

5. **Submit for Review:**
   - Google reviews within 3-5 business days
   - For private/domain apps, review is minimal

**Marketplace Description Template:**
```
Export all comments from Google Docs to clean, AI-ready markdown files.

Features:
• Export all comments or only open/unresolved comments
• Markdown format optimized for AI analysis (Claude, ChatGPT)
• Preserves comment threads, authors, and timestamps
• Automatic file save to Google Drive
• No external dependencies or API calls

Perfect for:
- Preparing feedback for AI analysis
- Archiving document discussions
- Creating stakeholder feedback summaries
- Extracting review comments

Security:
- Runs in user's authorization context
- No external API calls
- Data never leaves Google Workspace
- Open source code available on GitHub
```

#### Step 7: Domain-Wide Installation

Once approved by Google:

1. **Admin Console:**
   - Go to: admin.google.com
   - Apps → Marketplace apps
   - Search: "Comment Exporter"

2. **Install:**
   - Click app → "Domain Install"
   - Review permissions
   - Accept and install

3. **Configuration:**
   - Installation type: "Automatic" (installs for all users)
   - Or: "Available to install" (users choose to install)

4. **Verify:**
   - Open any Google Doc as a test user
   - "Comment Exporter" menu should appear automatically

**Timeline:**
- Setup: 2-3 hours
- Google review: 3-5 business days
- Deployment: 1 hour

---

## Security & Compliance

### What the Script Does

**Permissions Required:**
- `documents.currentonly` - Read comments from current document only
- `drive.file` - Create files in user's Google Drive

**Data Flow:**
1. User clicks export in their Google Doc
2. Script reads comments via Google Docs API
3. Script formats comments as markdown
4. Script creates .md file in user's Google Drive
5. User downloads or opens file

**Security Guarantees:**
- ✅ No external API calls
- ✅ No third-party services
- ✅ Data never leaves Google Workspace
- ✅ Code is open source (auditable)
- ✅ Runs in user's authorization context
- ✅ No server-side storage
- ✅ No logging of user data

### Workspace Admin Controls

**To disable for specific users/OUs:**
1. Admin Console → Apps → Marketplace apps
2. Find "Comment Exporter"
3. Click → Service status
4. Select OUs to enable/disable

**To uninstall domain-wide:**
1. Admin Console → Apps → Marketplace apps
2. Find "Comment Exporter"
3. Click → Uninstall

---

## API Quotas & Limits

**Google Apps Script Quotas (per day):**
- Workspace accounts: 100,000+ script executions
- This tool uses: 1-2 executions per export
- Drive API calls: 1-2 per export
- **Conclusion:** No practical limits for normal use

**Performance:**
- Small docs (<50 comments): 2-3 seconds
- Large docs (100+ comments): 5-10 seconds
- No size limits on export

---

## Troubleshooting

### Add-on Doesn't Appear

**Check:**
1. Is add-on installed for user's OU?
2. Has user refreshed their browser?
3. Are they in a Google Doc (not Sheets/Slides)?
4. Check Admin Console → Apps → Marketplace apps → Comment Exporter → Service status

**Fix:**
- Ensure user's OU has add-on enabled
- Have user close all Google Docs tabs and reopen
- Check Google Workspace status dashboard for outages

### "Access Denied" Errors

**Cause:** OAuth scopes not properly configured

**Fix:**
1. Check Apps Script project → appsscript.json
2. Verify scopes match:
   ```json
   "oauthScopes": [
     "https://www.googleapis.com/auth/documents.currentonly",
     "https://www.googleapis.com/auth/drive.file"
   ]
   ```
3. Redeploy add-on

### Export Creates Empty Files

**Cause:** Document has no comments, or user exported "Open Only" on a doc with all resolved comments

**Fix:**
- Verify document has comments
- Try "Export All Comments" mode
- Check Apps Script logs for errors

---

## Updating the Add-on

**To push updates:**

1. Edit `Code.gs` in Apps Script project
2. Save changes
3. Deploy → New deployment
4. Increment version number
5. Users get update automatically (no action needed)

**Best practices:**
- Test in development mode first
- Document changes in deployment description
- Notify users of major changes
- Keep version history

---

## Alternative: Apps Script Library

**For advanced deployments:**

Instead of add-on, publish as Apps Script Library:

```bash
# 1. Apps Script project → Deploy → New deployment
# 2. Type: Library
# 3. Copy Library ID
# 4. Users add to their projects:
#    Resources → Libraries → Paste Library ID
```

**Pros:**
- More flexibility
- Users can customize code
- Easier to update

**Cons:**
- Users still need to install per document
- More technical than add-on

---

## FAQ

**Q: Can we customize the markdown output format?**
A: Yes. Edit `Code.gs` → modify the formatting functions → redeploy.

**Q: Can we export to other formats (JSON, CSV, PDF)?**
A: Yes. Modify the export functions in `Code.gs`. Examples available in GitHub repo.

**Q: Can we add batch export (multiple docs at once)?**
A: Possible but requires significant code changes. Current version is single-doc only.

**Q: How do we track usage/adoption?**
A: Phase 2 (add-on): Use Google Apps Script execution logs or add analytics to code.
   Phase 1 (manual): No built-in tracking; use surveys or wiki page analytics.

**Q: What if Google Docs API changes?**
A: Google maintains backward compatibility. If breaking changes occur, update `Code.gs` and redeploy.

**Q: Can users modify the code?**
A: Phase 1: Yes (each user has own copy). Phase 2: No (centrally managed).

**Q: Does this work in Google Sheets or Slides?**
A: No, Google Docs only. APIs differ for Sheets/Slides.

---

## Cost

**Total Cost: $0**

- Google Cloud Platform: Free tier
- Apps Script: Free
- Google Workspace Marketplace: Free for private/domain apps
- APIs: Free (well within quotas)

---

## Support Resources

- **Installation Guide:** [installation-guide.md](installation-guide.md)
- **User Guide:** [user-guide.md](user-guide.md)
- **Source Code:** See `src/` directory
- **GitHub Issues:** https://github.com/austin-reece-gladly/google-docs-comment-exporter-deployment/issues

---

## Next Steps

**For Phase 1 (Manual):**
1. Choose distribution method (wiki, Drive, email)
2. Provide users with installation guide
3. Set up support channel for questions

**For Phase 2 (Add-on):**
1. Create Google Cloud Project (30 min)
2. Configure OAuth consent screen (15 min)
3. Create Apps Script add-on project (30 min)
4. Test in development mode (30 min)
5. Submit to Marketplace (30 min)
6. Wait for approval (3-5 days)
7. Install domain-wide (15 min)

**Total setup time:** ~3 hours + Google review time

---

**Ready to deploy? Start with Phase 1 for quick rollout, or jump to Phase 2 for zero-friction deployment.**

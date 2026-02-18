# IT Deployment Guide: Google Docs Comment Exporter

**Target Audience:** IT Administrators, System Administrators, Support Teams

This guide covers deploying the Google Docs Comment Exporter across your organization (50-500 users) using a phased rollout approach.

## Deployment Overview

### Phase 1: Manual Installation (Current)
Users install the script in individual documents via Apps Script. This phase allows for controlled rollout, user training, and feedback collection.

### Phase 2: Google Workspace Add-on (Future)
Convert to a domain-installed add-on for automatic deployment across all Google Docs.

This guide focuses on **Phase 1** deployment and preparation for **Phase 2**.

---

## Phase 1: Manual Deployment Strategy

### Architecture

**Deployment Model:**
- Per-document installation
- Users manually add script via Apps Script editor
- No centralized management (yet)
- Script runs in user's authorization context

**Technical Stack:**
- Google Apps Script (JavaScript runtime)
- Google Drive API v3
- OAuth 2.0 for authorization
- Client-side execution only

**Security Considerations:**
- ✅ Scripts run in user's permission scope
- ✅ No external API calls or third-party services
- ✅ Data never leaves Google Workspace environment
- ✅ Source code is visible to users (transparency)
- ✅ Standard Google OAuth authorization flow

### Distribution Options

#### Option A: Internal Wiki/Portal (Recommended)

**Setup:**
1. Create a wiki page (Confluence, Notion, SharePoint, etc.)
2. Include:
   - Installation guide with screenshots
   - Embedded script in a code block with copy button
   - Video tutorial (see Video Script section below)
   - Link to support channel
   - FAQ section

**Advantages:**
- Single source of truth
- Easy to update
- Searchable and discoverable
- Analytics on page views

**Template:**
```markdown
# Google Docs Comment Exporter - Installation

## Quick Install (5 minutes)

1. Open your Google Doc
2. Extensions → Apps Script
3. Delete default code, paste script below
4. Add Drive API v3 service
5. Save and refresh

## Script Code

[Copy to clipboard button]
```javascript
[Full script here]
```

## Video Tutorial
[Embedded video]

## Need Help?
- Slack: #comment-exporter-support
- Email: [support email]
```

#### Option B: Shared Google Drive Folder

**Setup:**
1. Create folder: "Google Workspace Tools"
2. Share with: "Anyone in [company].com can view"
3. Add files:
   - `INSTALLATION-GUIDE.pdf` (with screenshots)
   - `comment-exporter-script.txt` (for easy copying)
   - `DEMO-VIDEO.mp4` (5-min tutorial)
   - `EXAMPLE-EXPORT.md` (sample output)

**Advantages:**
- Native to Google Workspace
- File version history
- Comments for Q&A
- Offline access to PDFs

#### Option C: Support Channel Distribution

**Setup:**
1. Create Slack/Teams channel: `#comment-exporter`
2. Pin message with:
   - Quick install steps
   - Link to full guide
   - Support hours
   - Known issues

**Advantages:**
- Direct access to IT support
- Community troubleshooting
- Real-time assistance
- Feedback collection

**Recommended: Use all three!** Wiki as primary, Drive for files, Slack for support.

---

## Rollout Plan

### Week 1-2: Pilot Program

**Objective:** Test installation process, documentation, and gather initial feedback

**Participants:** 10-15 power users across departments
- Include: Engineers, Product Managers, Legal, Executive Assistants
- Criteria: Tech-savvy, vocal about tools, represent diverse use cases

**Execution:**
1. **Day 1:** Email pilot group with invitation
   - Explain the tool's purpose
   - Link to installation guide
   - Set expectations (this is a test)
   - Provide direct support contact

2. **Day 1-3:** Installation phase
   - Offer live installation support (Zoom/Slack)
   - Track: Time to install, blockers, questions
   - Document every issue encountered

3. **Day 4-7:** Usage phase
   - Ask users to export comments from 2-3 real documents
   - Collect: Output quality, performance, edge cases
   - Survey: Installation difficulty (1-5), usefulness (1-5)

4. **Week 2:** Feedback & iteration
   - Review all feedback
   - Update documentation based on common issues
   - Fix any critical bugs
   - Refine support materials

**Success Criteria:**
- ✅ 90%+ successful installations
- ✅ Average installation time < 10 minutes
- ✅ 4+ star rating on ease of installation
- ✅ No critical bugs reported

### Week 3: Department Beta

**Objective:** Test at scale with one department (20-50 people)

**Department Selection:**
- Choose a department that uses Google Docs heavily
- Examples: Marketing, Product, Operations
- Avoid: Engineering (might want to modify script), Legal (might have compliance concerns on pilot)

**Execution:**
1. **Department kickoff:**
   - Present in team meeting (5-min demo)
   - Show real use case for their workflow
   - Distribute installation guide
   - Announce office hours for support

2. **Week 3 support:**
   - **Office Hours:** Daily 30-min Zoom drop-in sessions
   - **Async Support:** Dedicated Slack channel
   - **Champions:** Identify 2-3 department champions for peer support

3. **Tracking:**
   - Installation rate (target: 50% in week 1, 70% by end of week 3)
   - Support tickets (log every question/issue)
   - Usage frequency (how many exports?)
   - User satisfaction survey at end of week

**Success Criteria:**
- ✅ 70%+ department adoption
- ✅ < 5 support tickets per 100 users
- ✅ Positive feedback from department leadership
- ✅ At least 3 documented use cases/success stories

### Week 4-6: Company-Wide Rollout

**Objective:** Make tool available to entire organization

**Pre-Launch Checklist:**
- ✅ Documentation finalized based on beta feedback
- ✅ Video tutorial published
- ✅ Support channel staffed
- ✅ Wiki page live and tested
- ✅ Success stories documented
- ✅ Executive sponsorship confirmed

**Launch Communications:**

**Email 1 (Week 4, Day 1) - Announcement:**
```
Subject: New Tool: Export Google Docs Comments to Markdown

Hi team,

We're rolling out a new productivity tool that lets you export all comments from Google Docs into clean markdown files - perfect for AI review, archiving feedback, and summarizing discussions.

Installation takes 5 minutes:
[Link to wiki guide]

Watch a 3-minute demo:
[Link to video]

Questions? Join #comment-exporter in Slack

- IT Team
```

**Email 2 (Week 5, Day 1) - Reminder + Success Story:**
```
Subject: Comment Exporter Update: See How [Team] is Using It

[Share a success story from beta testing]

Haven't installed yet? It only takes 5 minutes:
[Link]

Already using it? Share your use case in #comment-exporter!
```

**Email 3 (Week 6, Day 1) - Office Hours:**
```
Subject: Live Installation Help - Comment Exporter Office Hours

Join us for drop-in installation help:
- Tuesday 2-3pm PT
- Thursday 10-11am PT

Zoom link: [link]

Can't make it? Video guide: [link]
```

**In-Person Channels:**
- All-hands meeting mention (30 seconds)
- Department stand-ups (ask managers to mention)
- New hire onboarding materials
- Internal newsletter feature

**Tracking & Metrics:**
- Wiki page views
- Video watch rate
- Installation completion rate (survey-based)
- Support ticket volume
- User satisfaction (ongoing survey)

**Success Criteria:**
- ✅ 30%+ of active Google Docs users install within 4 weeks
- ✅ < 10 support tickets per 100 installations
- ✅ 4+ star average satisfaction rating
- ✅ Positive ROI (time saved > support time spent)

---

## Support Infrastructure

### Support Channels

**Tier 1: Self-Service**
- Wiki page with comprehensive FAQ
- Video tutorial (step-by-step)
- Written installation guide
- Troubleshooting section
- Example outputs

**Tier 2: Community Support**
- Slack channel: #comment-exporter
- Department champions (trained super-users)
- Peer-to-peer troubleshooting

**Tier 3: IT Support**
- Escalation from Slack channel
- Direct support requests via ticket system
- 24-hour response SLA for blockers

### Common Support Issues

#### Issue 1: "I don't see the menu after installation"

**Diagnosis:**
- User forgot to refresh document
- Script wasn't saved properly
- Browser cache issue

**Resolution:**
1. Verify script is saved in Apps Script editor
2. Refresh document (Cmd/Ctrl+R)
3. If still not working: Close document and reopen
4. Clear browser cache if needed

**Prevention:** Bold "REFRESH THE PAGE" in installation guide

#### Issue 2: "Access denied: Drive" error

**Diagnosis:**
- User didn't add Drive API v3 service

**Resolution:**
1. Go to Apps Script editor
2. Left sidebar → Services → ⊕ Add service
3. Find "Drive API" → Version v3 → Add
4. Save script again

**Prevention:** Make Drive API step more prominent in guide

#### Issue 3: Authorization loop / "Unsafe app" warning

**Diagnosis:**
- Google OAuth warning for unverified apps (expected for personal scripts)

**Resolution:**
1. Click "Advanced"
2. Click "Go to [Project Name] (unsafe)" - explain this is their own script
3. Click "Allow"
4. Explain: This is normal for Apps Script projects

**Prevention:** Add screenshots of this flow to installation guide

#### Issue 4: Script runs but no file appears

**Diagnosis:**
- File was created but user can't find it
- Drive API permissions issue

**Resolution:**
1. Check Google Drive home page for new .md file
2. Search Drive for ".md" files modified today
3. Check Apps Script execution log: View → Executions
4. If error in logs, check Drive API is added

**Prevention:** Show screenshot of where file appears in Drive

### Support Scripts

**For IT Support Team:**

**Quick Diagnostic Checklist:**
```
☐ Is Apps Script enabled for user's Google Workspace account?
☐ Did user add Drive API v3 service?
☐ Did user save the script?
☐ Did user refresh the document after saving?
☐ Did user authorize the script on first run?
☐ Does user have edit access to the document?
☐ Is user's browser up to date?
```

**Escalation Criteria:**
- Issue persists after standard troubleshooting
- Workspace-level permission problem
- Script execution errors in logs
- Feature request for Phase 2

---

## Metrics & Monitoring

### Key Performance Indicators (KPIs)

**Installation Metrics:**
- Total installations (survey or wiki page engagement)
- Installation completion rate (started vs completed)
- Average installation time
- Installation success rate (no support tickets needed)

**Usage Metrics:**
- Active users (monthly)
- Exports per user per month
- Documents with tool installed
- Department penetration rates

**Support Metrics:**
- Support tickets per 100 installations
- Average resolution time
- Ticket categories (installation, usage, bugs)
- Escalation rate

**Satisfaction Metrics:**
- Installation ease rating (1-5 scale)
- Tool usefulness rating (1-5 scale)
- Net Promoter Score (NPS)
- Success stories collected

### Data Collection Methods

**Survey (Week 2, 4, 6):**
```
Google Docs Comment Exporter Survey

1. Have you installed the Comment Exporter?
   ○ Yes ○ No ○ Tried but failed

2. How easy was installation? (1=very hard, 5=very easy)
   ○ 1 ○ 2 ○ 3 ○ 4 ○ 5

3. How often do you use it?
   ○ Daily ○ Weekly ○ Monthly ○ Rarely ○ Never

4. How useful is it for your work? (1=not useful, 5=very useful)
   ○ 1 ○ 2 ○ 3 ○ 4 ○ 5

5. What do you use the exported comments for?
   [Open text field]

6. What would make this tool better?
   [Open text field]
```

**Analytics:**
- Wiki page views (built-in analytics)
- Video completion rate (YouTube/Vimeo analytics)
- Slack channel activity (#comment-exporter)

**Manual Tracking:**
- Support ticket log (spreadsheet)
- Success stories (document as they come in)
- Feature requests (capture for Phase 2)

---

## Phase 2 Preparation: Google Workspace Add-on

### When to Move to Phase 2

**Prerequisites:**
- ✅ Phase 1 adoption > 30%
- ✅ User satisfaction > 4.0/5.0
- ✅ Low support burden (< 5 tickets/100 users)
- ✅ Positive feedback from leadership
- ✅ Clear use cases documented

**Benefits of Add-on vs Manual:**
- **Zero user setup** - IT installs once for entire domain
- **Always available** - Appears in all Google Docs automatically
- **Centralized management** - Update once, applies to everyone
- **Better discoverability** - Users don't need to know about it to find it
- **Professional appearance** - Listed in Workspace Marketplace

### Technical Requirements for Add-on

**Google Cloud Project Setup:**
1. Create Google Cloud Project
2. Enable APIs:
   - Google Docs API
   - Google Drive API
3. Configure OAuth consent screen:
   - App name: "Comment Exporter"
   - User support email
   - Developer contact email
   - Scopes: docs.currentonly, drive.file
4. Create OAuth 2.0 credentials

**Apps Script Configuration:**

Create `appsscript.json`:
```json
{
  "timeZone": "America/New_York",
  "dependencies": {
    "enabledAdvancedServices": [
      {
        "userSymbol": "Drive",
        "serviceId": "drive",
        "version": "v3"
      }
    ]
  },
  "oauthScopes": [
    "https://www.googleapis.com/auth/documents.currentonly",
    "https://www.googleapis.com/auth/drive.file"
  ],
  "addOns": {
    "docs": {
      "homepageTrigger": {
        "runFunction": "onOpen"
      }
    }
  }
}
```

**Code Changes Required:**
- Minimal! Current code is already compatible
- Rename `comment-exporter-MARKDOWN.js` → `Code.gs`
- No logic changes needed
- `onOpen()` trigger works as-is

**Deployment Process:**
1. Create new Apps Script project (standalone, not bound to doc)
2. Copy code and appsscript.json
3. Link to Google Cloud Project
4. Test in development mode
5. Deploy as add-on
6. Submit to Google Workspace Marketplace (Private/Unlisted)
   - Choose "Private" for domain-only installation
   - Fill out marketplace listing
   - Submit for review (3-5 business days)
7. Once approved: Admin Console → Marketplace apps → Install for domain

**Timeline Estimate:**
- Setup & configuration: 2-3 hours
- Testing in dev mode: 1-2 days
- Marketplace submission: 3-5 business days (Google review)
- Domain deployment: 1 hour

**Cost:**
- $0 for private/domain-only add-ons
- No per-user fees
- No API usage fees (Drive API free tier is generous)

### Phase 2 Rollout Strategy

**Pre-Launch:**
- Announce transition to add-on
- Explain: No action needed, will auto-appear
- Set expectations: Rollout over 24-48 hours

**Launch:**
- Admin installs add-on for domain
- Communicate: "Comment Exporter now available in all Google Docs"
- Update wiki page (simpler instructions)

**Post-Launch:**
- Monitor for issues
- Support users who had manual installation (can remove old scripts)
- Track adoption: Should jump from 30% → 70%+ immediately

---

## Pre-Script Template (for easy distribution)

**File: comment-exporter-ready-to-install.txt**

```
/**
 * Google Docs Comment Exporter to Markdown
 *
 * INSTALLATION:
 * 1. Copy this entire script
 * 2. Open your Google Doc → Extensions → Apps Script
 * 3. Delete default code, paste this
 * 4. Add service: Drive API v3 (left sidebar → Services → + Add)
 * 5. Save and refresh your document
 *
 * USAGE:
 * - Look for "Comment Exporter" menu in your doc
 * - Choose export mode (all comments or open only)
 * - File saves to your Google Drive automatically
 *
 * SUPPORT:
 * - Internal wiki: [YOUR WIKI LINK]
 * - Slack: #comment-exporter
 * - IT support: [YOUR SUPPORT EMAIL]
 */

[Full script from comment-exporter-MARKDOWN.js]
```

---

## Video Tutorial Script

**Duration:** 5 minutes

**Script:**

> [0:00-0:15] **Intro**
> "Hi, I'm [name] from IT. Today I'll show you how to install the Google Docs Comment Exporter - a tool that exports all document comments to a markdown file in just one click. Installation takes about 5 minutes."

> [0:15-0:45] **What it does**
> [Screen: Show a Google Doc with comments]
> "Here's a document with several comments from reviewers. With the Comment Exporter, you can export all these comments to a clean markdown file, perfect for sharing with AI tools like Claude or ChatGPT, or for archiving feedback."
> [Screen: Click menu, show export, open resulting .md file]
> "Here's what the output looks like - structured, readable, and ready to use."

> [0:45-1:30] **Step 1: Open Apps Script**
> [Screen: Google Doc → Extensions → Apps Script]
> "First, open the Google Doc where you want the exporter. Click Extensions, then Apps Script. This opens the script editor."

> [1:30-2:00] **Step 2: Delete default code & paste script**
> [Screen: Select all, delete, paste new code]
> "You'll see some default code here. Select it all and delete it. Now go to our internal wiki [show link], copy the comment exporter script, and paste it here."

> [2:00-2:45] **Step 3: Add Drive API service**
> [Screen: Services → + → Drive API v3 → Add]
> "This is important: On the left sidebar, click the plus icon next to Services. Scroll down to find 'Drive API', click it, make sure Version v3 is selected, and click Add. You should now see Drive listed under Services."

> [2:45-3:00] **Step 4: Save**
> [Screen: Click save icon]
> "Click the save icon. You might be asked to name your project - just call it 'Comment Exporter' or anything you like."

> [3:00-3:30] **Step 5: Refresh your document**
> [Screen: Go back to doc tab, refresh]
> "Now go back to your Google Doc tab and refresh the page. This is critical - the menu only appears when the document loads."

> [3:30-4:00] **Step 6: Verify & authorize**
> [Screen: Show new menu, click export, show auth dialog]
> "You should now see a 'Comment Exporter' menu. Click it and choose an export option. The first time, Google will ask you to authorize the script. Click Continue, select your account, click Advanced, then 'Go to [Project] (unsafe)' - this is safe, it's your own script - and finally click Allow."

> [4:00-4:30] **Step 7: Export & download**
> [Screen: Export runs, dialog appears, download]
> "The script runs, creates your markdown file in Google Drive, and shows a download dialog. Click 'Download Markdown File' or 'Open in Drive' to access it."

> [4:30-5:00] **Wrap up**
> "That's it! You now have the Comment Exporter installed in this document. To use it in other documents, just repeat these steps. If you run into any issues, check the troubleshooting guide on our wiki or ask in the #comment-exporter Slack channel. Happy exporting!"

---

## FAQ for IT Support

**Q: Can this script access other documents or user data?**
A: No. The script only has access to the specific document it's installed in (via `DocumentApp.getActiveDocument()`) and can only write to the user's Google Drive in their own account. It makes no external API calls.

**Q: Is this secure?**
A: Yes. The script runs in the user's authorization context using standard Google OAuth. Code is open-source (users can read it). No data leaves Google Workspace. No third-party services involved.

**Q: What if a user leaves the company?**
A: Their scripts stop working when their account is deactivated. No cleanup needed. Documents they shared remain accessible to others who have their own installation.

**Q: Can we customize the script for our needs?**
A: Yes! You have the full source code. Common customizations:
- Change export file naming convention
- Modify markdown formatting
- Add export to different formats
- Integrate with internal tools

**Q: How do we update the script if we make changes?**
A: Phase 1: Users must manually update (paste new version). Phase 2: Update once in Add-on, applies to all users automatically.

**Q: What's the quota/limit for API calls?**
A: Google Apps Script quotas are generous:
- Consumer Google accounts: 20,000 executions/day
- Google Workspace: 100,000+ executions/day
- This script uses minimal quota (1-2 Drive API calls per export)

**Q: Can we track who's using this?**
A: Not directly in Phase 1 (each installation is independent). In Phase 2, you can add analytics via Apps Script properties or Google Analytics.

**Q: What if Google Docs changes its API?**
A: Google maintains backward compatibility. If breaking changes occur (rare), we'd need to update the script. Phase 2 makes this easy (update once for everyone).

---

## Success Stories Template

**Collect these during rollout to showcase value:**

**Template:**
```
Department: [e.g., Product Management]
User: [Name, Role]
Use Case: [What they used it for]

"[Quote from user about how it helped]"

Impact:
- Time saved: [e.g., 2 hours/week]
- Improved workflow: [e.g., faster AI review of feedback]
- Unexpected benefit: [e.g., discovered security concerns in comments]
```

**Example:**
```
Department: Product Management
User: Sarah Chen, Senior PM

Use Case: Exporting stakeholder feedback from PRD reviews to summarize with Claude

"I used to copy-paste comments manually into ChatGPT. With the Comment Exporter, I save 30 minutes per PRD review. The markdown format is perfect for AI analysis, and I've caught several conflicting requirements that I would have missed."

Impact:
- Time saved: 2 hours/month
- Improved decision-making: Faster identification of stakeholder conflicts
- Better documentation: Archived feedback for future reference
```

---

## Checklist: Phase 1 Go-Live

**Documentation:**
- ☐ Installation guide finalized
- ☐ User guide complete
- ☐ IT support guide reviewed
- ☐ FAQ section comprehensive
- ☐ Troubleshooting steps tested

**Infrastructure:**
- ☐ Wiki page published and tested
- ☐ Script file available (easy to copy)
- ☐ Shared Drive folder created
- ☐ Support channel created (#comment-exporter)
- ☐ Support team trained

**Communications:**
- ☐ Email templates ready
- ☐ All-hands announcement drafted
- ☐ Video tutorial recorded and published
- ☐ Success story examples prepared

**Tracking:**
- ☐ Metrics dashboard set up
- ☐ Survey created and tested
- ☐ Support ticket system configured
- ☐ Analytics tracking enabled

**Pilot/Beta:**
- ☐ Pilot group selected (10-15 users)
- ☐ Beta department identified
- ☐ Feedback mechanism in place
- ☐ Success criteria defined

---

## Contact & Support

**For IT Team Questions:**
- Project Lead: [Name, Email]
- Technical Contact: [Name, Email]
- Support Escalation: [Ticket system link]

**For Executive Sponsorship:**
- Executive Sponsor: [Name, Title]
- Business Case: [Link to ROI document]

---

**Last Updated:** February 2026
**Next Review:** After Phase 1 completion (Week 6)
**Phase 2 Target:** Q2 2026 (if Phase 1 successful)

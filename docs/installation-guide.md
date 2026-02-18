# Installation Guide: Google Docs Comment Exporter

**Estimated Time:** 5-10 minutes

This guide will walk you through installing the Comment Exporter in your Google Docs. Once installed, you'll be able to export all document comments to a markdown file with a single click.

## Prerequisites

Before you begin, make sure you have:

- ✅ A Google Workspace account
- ✅ Editor or Owner access to the Google Doc where you want to install the tool
- ✅ Basic familiarity with Google Docs

## Installation Steps

### Step 1: Open Your Google Doc

1. Navigate to the Google Doc where you want to use the comment exporter
2. Make sure you have edit access (you should see the full toolbar)

### Step 2: Open the Apps Script Editor

1. Click **Extensions** in the top menu
2. Select **Apps Script**
3. A new tab will open showing the Apps Script editor

   ![Apps Script Menu Location](https://i.imgur.com/placeholder.png)

   > **Note:** If you don't see "Apps Script" in the Extensions menu, contact your IT administrator - this feature may be disabled in your organization.

### Step 3: Clear the Default Code

1. In the Apps Script editor, you'll see a file called `Code.gs` with some default code
2. **Select all the default code** (Cmd+A on Mac, Ctrl+A on Windows)
3. **Delete it** (this is important - we need to start fresh)

### Step 4: Copy the Comment Exporter Script

1. Open the script source from your company's internal wiki/shared drive
   - Link: `[YOUR COMPANY WIKI LINK]`
   - Or get it from your IT support team

2. **Copy the entire script** to your clipboard

### Step 5: Paste the Script

1. Go back to the Apps Script editor tab
2. **Paste the script** into the empty `Code.gs` file
3. The editor should now show the complete comment exporter code

### Step 6: Add Google Drive API Service

This is a critical step - the script needs access to Google Drive to save your exported files.

1. In the Apps Script editor, look for **Services** in the left sidebar (it has a ⊕ plus icon)
2. Click the **⊕ (plus icon)** next to "Services"
3. In the popup, scroll down and find **"Drive API"**
4. Click on it, then click **Add**
5. In the Version dropdown, select **v3** (latest version)
6. Click **Add** to confirm

   ![Adding Drive API Service](https://i.imgur.com/placeholder.png)

   > **Tip:** After adding, you should see "Drive" listed under Services in the left sidebar.

### Step 7: Save the Script

1. Click the **Save icon** (💾 disk icon) in the toolbar
   - Or use keyboard shortcut: Cmd+S (Mac) / Ctrl+S (Windows)

2. **First-time authorization prompt:**
   - A dialog will appear asking you to name your project
   - Enter a name like "Comment Exporter" or "Doc Comments"
   - Click **OK**

### Step 8: Close Apps Script and Refresh Your Document

1. **Close the Apps Script tab** (or keep it open if you want)
2. Go back to your **Google Doc tab**
3. **Refresh the page** (Cmd+R on Mac, Ctrl+R on Windows, or F5)

   > **Important:** The script only activates when the document loads, so you must refresh!

### Step 9: Verify Installation

After refreshing, check your Google Docs menu bar:

1. Look for a new menu called **"Comment Exporter"** next to "Help"
2. Click on it - you should see two options:
   - "Export All Comments to Markdown"
   - "Export Open Comments to Markdown"

   ![Comment Exporter Menu](https://i.imgur.com/placeholder.png)

3. ✅ **Success!** The tool is now installed and ready to use.

## Troubleshooting

### I don't see the "Comment Exporter" menu

**Solution:**
- Make sure you refreshed the page after saving the script
- Try closing and reopening the document
- Clear your browser cache and reload
- Verify that you saved the script (check the Apps Script editor)

### Error: "Exception: Access denied: Drive"

**Solution:**
- You forgot to add the Drive API service (see Step 6)
- Go back to Apps Script → Services → Add Drive API v3
- Save again and refresh the document

### Error: "You do not have permission to call..."

**Solution:**
- The first time you run the script, Google will ask for authorization
- Click "Continue" and follow the authorization flow
- Accept the permissions (the script needs to read comments and write to Drive)
- Try exporting again

### The menu appeared but clicking it does nothing

**Solution:**
- Check for script errors: Extensions → Apps Script → View → Executions
- Look for error messages and contact IT support with the error details
- Make sure you copied the complete script (scroll to the very bottom to verify)

### "Authorization Required" popup appears

**Solution:**
- This is normal on first use
- Click **"Continue"**
- Select your Google account
- Click **"Advanced"** (if you see a warning screen)
- Click **"Go to [Project Name] (unsafe)"** - this is safe, it's your own script
- Click **"Allow"** to grant permissions
- Now try exporting again

## What Gets Installed?

When you complete this installation:

- ✅ A custom menu appears in your Google Doc
- ✅ The script runs only in THIS specific document
- ✅ No data leaves your Google Workspace environment
- ✅ You can export comments anytime with one click

## Uninstalling

To remove the Comment Exporter from a document:

1. Go to **Extensions → Apps Script**
2. Delete all the code in `Code.gs`
3. Save the empty file
4. Refresh your document
5. The "Comment Exporter" menu will be gone

## Next Steps

Now that you've installed the tool, learn how to use it:

👉 **See the [User Guide](user-guide.md)** for export instructions and tips

## Need Help?

- **IT Support:** Contact your IT help desk
- **Internal Wiki:** Check the Comment Exporter page for FAQs
- **Video Tutorial:** [Link to internal training video]

---

**Installation complete!** Ready to export your first set of comments? Check out the [User Guide](user-guide.md).

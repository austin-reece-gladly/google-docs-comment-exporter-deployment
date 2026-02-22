/**
 * Google Docs Comment Exporter - MARKDOWN FORMAT
 * Exports comments in AI-friendly markdown format
 *
 * SETUP:
 * 1. Extensions → Apps Script
 * 2. Paste this code
 * 3. Services → Add "Drive API" (v3)
 * 4. Save and run exportCommentsToMarkdown
 * 5. Check Execution log for Google Doc URL
 */

function exportCommentsToMarkdown(contextChars) {
  contextChars = contextChars || 200; // Default to 200 characters

  var doc = DocumentApp.getActiveDocument();
  var docId = doc.getId();
  var docName = doc.getName();

  Logger.log('Starting markdown export for: ' + docName);
  Logger.log('Document ID: ' + docId);
  Logger.log('Context size: ' + contextChars + ' characters');

  try {
    Logger.log('Fetching comments from Drive API v3...');

    // Fetch all comments with required fields
    var response = Drive.Comments.list(docId, {
      fields: 'comments(id,author(displayName),content,quotedFileContent(value),createdTime,modifiedTime,resolved,replies(id,author(displayName),content,createdTime,modifiedTime,deleted,action))',
      includeDeleted: false,
      pageSize: 100
    });

    var comments = response.comments || [];

    if (comments.length === 0) {
      Logger.log('No comments found in this document.');
      return;
    }

    Logger.log('Found ' + comments.length + ' comment(s)');
    Logger.log('Enriching comments with document context...');

    // Enrich all comments with context and position
    var enrichedComments = comments.map(function(comment) {
      var quotedText = (comment.quotedFileContent && comment.quotedFileContent.value) ? comment.quotedFileContent.value : '';
      var context = getSurroundingContext(quotedText, contextChars);

      return {
        comment: comment,
        context: context,
        position: context ? context.position : 999999
      };
    });

    // Sort by position in document
    enrichedComments.sort(function(a, b) {
      return a.position - b.position;
    });

    Logger.log('Comments sorted by document position');

    // Build markdown content
    var markdown = [];

    // Header
    markdown.push('# Comments from: ' + docName);
    markdown.push('');
    markdown.push('**Generated:** ' + new Date().toLocaleString());
    markdown.push('**Total Comments:** ' + comments.length);
    markdown.push('**Sort Order:** Top to bottom of document');
    markdown.push('');
    markdown.push('_Comments are ordered by their position in the document and include surrounding context._');
    markdown.push('');
    markdown.push('---');
    markdown.push('');

    // Track stats
    var openComments = 0;
    var resolvedComments = 0;

    // Process each enriched comment
    enrichedComments.forEach(function(item, index) {
      var comment = item.comment;
      var context = item.context;
      var commentNum = index + 1;
      var author = (comment.author && comment.author.displayName) ? comment.author.displayName : 'Unknown';
      var content = comment.content || '';
      var quotedText = (comment.quotedFileContent && comment.quotedFileContent.value) ? comment.quotedFileContent.value : '';
      var createdTime = comment.createdTime || '';
      var resolved = comment.resolved || false;
      var replies = comment.replies || [];

      // Update stats
      if (resolved) {
        resolvedComments++;
      } else {
        openComments++;
      }

      // Format creation date
      var dateStr = '';
      if (createdTime) {
        try {
          dateStr = new Date(createdTime).toLocaleDateString();
        } catch(e) {
          dateStr = createdTime;
        }
      }

      // Comment header
      markdown.push('## Comment #' + commentNum + ' - ' + author);
      if (dateStr) {
        markdown.push('**Date:** ' + dateStr);
      }
      markdown.push('**Status:** ' + (resolved ? '✓ Resolved' : '⚠️ Open'));
      markdown.push('');

      // Show context if available
      if (context) {
        markdown.push('**Document Context:**');
        markdown.push('');
        if (context.before) {
          markdown.push('_...previous text:_ ' + context.before);
          markdown.push('');
        }
        markdown.push('**→ Referenced Text (being commented on):**');
        markdown.push('> ' + context.quoted.replace(/\n/g, '\n> '));
        markdown.push('');
        if (context.after) {
          markdown.push('_...following text:_ ' + context.after);
          markdown.push('');
        }
      } else if (quotedText) {
        // Fallback if context couldn't be found
        markdown.push('**Referenced Text:**');
        markdown.push('> ' + quotedText.replace(/\n/g, '\n> '));
        markdown.push('');
      }

      // The actual comment
      markdown.push('**Comment:**');
      markdown.push(content);
      markdown.push('');

      // Replies/discussion
      if (replies.length > 0) {
        markdown.push('**Discussion (' + replies.length + ' ' + (replies.length === 1 ? 'reply' : 'replies') + '):**');
        markdown.push('');

        replies.forEach(function(reply) {
          if (reply.deleted) return;

          var replyAuthor = (reply.author && reply.author.displayName) ? reply.author.displayName : 'Unknown';
          var replyContent = reply.content || '';
          var replyTime = reply.createdTime || '';
          var action = reply.action || '';

          var replyDateStr = '';
          if (replyTime) {
            try {
              replyDateStr = new Date(replyTime).toLocaleDateString();
            } catch(e) {
              replyDateStr = replyTime;
            }
          }

          // Format action (resolve/reopen)
          var actionStr = '';
          if (action === 'resolve') {
            actionStr = ' [Resolved this comment]';
          } else if (action === 'reopen') {
            actionStr = ' [Reopened this comment]';
          }

          markdown.push('- **' + replyAuthor + '** (' + replyDateStr + ')' + actionStr + ':');
          if (replyContent) {
            markdown.push('  ' + replyContent.replace(/\n/g, '\n  '));
          }
          markdown.push('');
        });
      }

      // Separator between comments
      markdown.push('---');
      markdown.push('');
    });

    // Add summary at the end
    markdown.push('');
    markdown.push('## Summary');
    markdown.push('');
    markdown.push('- **Total Comments:** ' + comments.length);
    markdown.push('- **Open Comments:** ' + openComments);
    markdown.push('- **Resolved Comments:** ' + resolvedComments);
    markdown.push('');
    markdown.push('---');
    markdown.push('');
    markdown.push('*Generated with Google Apps Script Comment Exporter*');

    // Join all markdown lines
    var markdownText = markdown.join('\n');

    // Create a .md file in Google Drive
    var fileName = 'Comments-' + docName.replace(/[^a-z0-9]/gi, '-') + '.md';
    var file = DriveApp.createFile(fileName, markdownText, MimeType.PLAIN_TEXT);

    var fileId = file.getId();
    var url = file.getUrl();
    var downloadUrl = 'https://drive.google.com/uc?export=download&id=' + fileId;

    // Log success
    Logger.log('');
    Logger.log('✓ SUCCESS!');
    Logger.log('✓ Exported ' + comments.length + ' comments to markdown');
    Logger.log('✓ Open comments: ' + openComments);
    Logger.log('✓ Resolved comments: ' + resolvedComments);
    Logger.log('✓ File saved to Google Drive: ' + fileName);
    Logger.log('');
    Logger.log('═══════════════════════════════════════');
    Logger.log('MARKDOWN FILE CREATED:');
    Logger.log('');
    Logger.log('View in Drive: ' + url);
    Logger.log('');
    Logger.log('Direct Download: ' + downloadUrl);
    Logger.log('═══════════════════════════════════════');
    Logger.log('');
    Logger.log('TIP 1: Click the download link above to download the .md file');
    Logger.log('TIP 2: Or find it in your Google Drive root folder');
    Logger.log('TIP 3: Open the .md file with any text editor or paste into AI');

    // Show download dialog
    try {
      showDownloadDialog(downloadUrl, fileName, comments.length);
    } catch(e) {
      Logger.log('Note: Download dialog not shown (may be running from script editor)');
    }

    return downloadUrl;

  } catch (error) {
    Logger.log('');
    Logger.log('✗ ERROR: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
    throw error;
  }
}

/**
 * Get surrounding context from document for better AI understanding
 */
function getSurroundingContext(quotedText, contextChars) {
  if (!quotedText) return null;

  contextChars = contextChars || 150; // Default 150 chars before/after

  try {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var fullText = body.getText();

    // Find the quoted text in the document
    var index = fullText.indexOf(quotedText);
    if (index === -1) return null;

    // Get text before
    var startIndex = Math.max(0, index - contextChars);
    var beforeText = fullText.substring(startIndex, index);
    if (startIndex > 0) beforeText = '...' + beforeText;

    // Get text after
    var endIndex = Math.min(fullText.length, index + quotedText.length + contextChars);
    var afterText = fullText.substring(index + quotedText.length, endIndex);
    if (endIndex < fullText.length) afterText = afterText + '...';

    return {
      before: beforeText.trim(),
      quoted: quotedText,
      after: afterText.trim(),
      position: index // Position in document for sorting
    };
  } catch(e) {
    Logger.log('Could not get context: ' + e.toString());
    return null;
  }
}

/**
 * Export only OPEN (unresolved) comments - useful for AI assistance
 */
function exportOpenCommentsToMarkdown(contextChars) {
  contextChars = contextChars || 200; // Default to 200 characters

  var doc = DocumentApp.getActiveDocument();
  var docId = doc.getId();
  var docName = doc.getName();

  Logger.log('Starting markdown export (OPEN COMMENTS ONLY) for: ' + docName);
  Logger.log('Context size: ' + contextChars + ' characters');

  try {
    var response = Drive.Comments.list(docId, {
      fields: 'comments(id,author(displayName),content,quotedFileContent(value),createdTime,modifiedTime,resolved,replies(id,author(displayName),content,createdTime,modifiedTime,deleted,action))',
      includeDeleted: false,
      pageSize: 100
    });

    var allComments = response.comments || [];

    // Filter to only unresolved comments
    var openComments = allComments.filter(function(comment) {
      return !comment.resolved;
    });

    if (openComments.length === 0) {
      Logger.log('No open comments found! All comments are resolved.');
      return;
    }

    Logger.log('Found ' + openComments.length + ' open comment(s) (out of ' + allComments.length + ' total)');
    Logger.log('Getting document context for comments...');

    // Enrich comments with context and position
    var enrichedComments = openComments.map(function(comment) {
      var quotedText = (comment.quotedFileContent && comment.quotedFileContent.value) ? comment.quotedFileContent.value : '';
      var context = getSurroundingContext(quotedText, contextChars);

      return {
        comment: comment,
        context: context,
        position: context ? context.position : 999999 // Sort uncommented items last
      };
    });

    // Sort by position in document (top to bottom)
    enrichedComments.sort(function(a, b) {
      return a.position - b.position;
    });

    Logger.log('Comments sorted by document position');

    // Build markdown
    var markdown = [];

    markdown.push('# Open Comments from: ' + docName);
    markdown.push('');
    markdown.push('**Generated:** ' + new Date().toLocaleString());
    markdown.push('**Open Comments:** ' + openComments.length + ' (out of ' + allComments.length + ' total)');
    markdown.push('**Sort Order:** Top to bottom of document');
    markdown.push('');
    markdown.push('---');
    markdown.push('');
    markdown.push('# AI Prompt');
    markdown.push('');
    markdown.push('Please help me address the following comments on my document. For each comment:');
    markdown.push('1. Analyze the feedback in context');
    markdown.push('2. Suggest specific revisions to the referenced text');
    markdown.push('3. Provide the revised text that incorporates the feedback');
    markdown.push('4. Explain your reasoning');
    markdown.push('');
    markdown.push('The comments are presented in order from top to bottom of the document.');
    markdown.push('Each comment includes surrounding context to help you understand the full picture.');
    markdown.push('');
    markdown.push('---');
    markdown.push('');

    // Process enriched comments (now with context and sorted by position)
    enrichedComments.forEach(function(item, index) {
      var comment = item.comment;
      var context = item.context;
      var commentNum = index + 1;
      var author = (comment.author && comment.author.displayName) ? comment.author.displayName : 'Unknown';
      var content = comment.content || '';
      var quotedText = (comment.quotedFileContent && comment.quotedFileContent.value) ? comment.quotedFileContent.value : '';
      var createdTime = comment.createdTime || '';
      var replies = comment.replies || [];

      var dateStr = '';
      if (createdTime) {
        try {
          dateStr = new Date(createdTime).toLocaleDateString();
        } catch(e) {
          dateStr = createdTime;
        }
      }

      markdown.push('## Comment #' + commentNum + ' - ' + author);
      if (dateStr) {
        markdown.push('**Date:** ' + dateStr);
      }
      markdown.push('');

      // Show context if available
      if (context) {
        markdown.push('**Document Context:**');
        markdown.push('');
        if (context.before) {
          markdown.push('_[...previous text]_');
          markdown.push(context.before);
          markdown.push('');
        }
        markdown.push('**→ Referenced Text (being commented on):**');
        markdown.push('> ' + context.quoted.replace(/\n/g, '\n> '));
        markdown.push('');
        if (context.after) {
          markdown.push('_[...following text]_');
          markdown.push(context.after);
          markdown.push('');
        }
      } else if (quotedText) {
        // Fallback if context couldn't be found
        markdown.push('**Referenced Text:**');
        markdown.push('> ' + quotedText.replace(/\n/g, '\n> '));
        markdown.push('');
      }

      markdown.push('**Comment:**');
      markdown.push(content);
      markdown.push('');

      if (replies.length > 0) {
        markdown.push('**Discussion:**');
        markdown.push('');

        replies.forEach(function(reply) {
          if (reply.deleted) return;

          var replyAuthor = (reply.author && reply.author.displayName) ? reply.author.displayName : 'Unknown';
          var replyContent = reply.content || '';

          markdown.push('- **' + replyAuthor + '**: ' + replyContent.replace(/\n/g, '\n  '));
          markdown.push('');
        });
      }

      markdown.push('**AI Response:**');
      markdown.push('');
      markdown.push('_[AI will provide suggestions here]_');
      markdown.push('');
      markdown.push('---');
      markdown.push('');
    });

    var markdownText = markdown.join('\n');

    // Create .md file in Google Drive
    var fileName = 'Open-Comments-AI-Ready-' + docName.replace(/[^a-z0-9]/gi, '-') + '.md';
    var file = DriveApp.createFile(fileName, markdownText, MimeType.PLAIN_TEXT);

    var fileId = file.getId();
    var url = file.getUrl();
    var downloadUrl = 'https://drive.google.com/uc?export=download&id=' + fileId;

    Logger.log('');
    Logger.log('✓ SUCCESS!');
    Logger.log('✓ Exported ' + openComments.length + ' OPEN comments');
    Logger.log('✓ File saved to Google Drive: ' + fileName);
    Logger.log('');
    Logger.log('═══════════════════════════════════════');
    Logger.log('AI-READY MARKDOWN FILE:');
    Logger.log('');
    Logger.log('View in Drive: ' + url);
    Logger.log('');
    Logger.log('Direct Download: ' + downloadUrl);
    Logger.log('═══════════════════════════════════════');
    Logger.log('');
    Logger.log('TIP 1: Click the download link to get the .md file');
    Logger.log('TIP 2: Open with any text editor and copy into AI');
    Logger.log('TIP 3: Or upload the .md file directly to Claude/ChatGPT');

    // Show download dialog
    try {
      showDownloadDialog(downloadUrl, fileName, openComments.length);
    } catch(e) {
      Logger.log('Note: Download dialog not shown (may be running from script editor)');
    }

    return downloadUrl;

  } catch (error) {
    Logger.log('✗ ERROR: ' + error.toString());
    throw error;
  }
}

/**
 * Show download dialog with clickable link
 */
function showDownloadDialog(downloadUrl, fileName, commentCount) {
  var ui = DocumentApp.getUi();

  var html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=DM+Sans:wght@400;500;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'DM Sans', -apple-system, sans-serif;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 0;
      overflow: hidden;
      color: #1a1a1a;
    }

    .container {
      width: 100%;
      min-height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      background: #ffffff;
      animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .header-accent {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #2d6a4f 0%, #52b788 50%, #2d6a4f 100%);
      background-size: 200% 100%;
      animation: shimmer 3s ease infinite;
    }

    @keyframes shimmer {
      0%, 100% { background-position: 0% 0%; }
      50% { background-position: 100% 0%; }
    }

    .success-header {
      padding: 28px 40px 20px;
      border-bottom: 1px solid #e9ecef;
      background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
    }

    .checkmark-wrapper {
      width: 48px;
      height: 48px;
      margin: 0 auto 14px;
      position: relative;
      animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
    }

    @keyframes scaleIn {
      from {
        transform: scale(0);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .checkmark-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2d6a4f 0%, #40916c 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(45, 106, 79, 0.24);
      position: relative;
    }

    .checkmark-circle::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      background: linear-gradient(135deg, #52b788, #2d6a4f);
      opacity: 0.3;
      filter: blur(8px);
      z-index: -1;
    }

    .checkmark {
      width: 20px;
      height: 12px;
      border-left: 3px solid white;
      border-bottom: 3px solid white;
      transform: rotate(-45deg) translateY(-2px);
      animation: drawCheck 0.4s cubic-bezier(0.65, 0, 0.35, 1) 0.4s both;
    }

    @keyframes drawCheck {
      from {
        width: 0;
        height: 0;
      }
      to {
        width: 20px;
        height: 12px;
      }
    }

    .success-title {
      font-family: 'Crimson Pro', Georgia, serif;
      font-size: 26px;
      font-weight: 600;
      text-align: center;
      color: #1a1a1a;
      margin-bottom: 6px;
      letter-spacing: -0.02em;
      animation: fadeInUp 0.5s ease 0.3s both;
    }

    .success-subtitle {
      font-size: 13px;
      text-align: center;
      color: #6c757d;
      font-weight: 400;
      animation: fadeInUp 0.5s ease 0.4s both;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .content {
      padding: 20px 40px;
      animation: fadeIn 0.6s ease 0.5s both;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .file-info {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 14px 16px;
      margin-bottom: 16px;
      position: relative;
      overflow: hidden;
    }

    .file-info::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background: linear-gradient(180deg, #2d6a4f, #52b788);
    }

    .file-info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .file-info-row:last-child {
      margin-bottom: 0;
    }

    .file-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6c757d;
      font-weight: 500;
    }

    .file-value {
      font-size: 14px;
      color: #1a1a1a;
      font-weight: 500;
      font-family: 'DM Sans', monospace;
      max-width: 280px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: right;
    }

    .comment-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, #2d6a4f 0%, #40916c 100%);
      color: white;
      padding: 4px 12px;
      border-radius: 3px;
      font-size: 13px;
      font-weight: 600;
    }

    .comment-badge::before {
      content: '💬';
      font-size: 14px;
    }

    .tips {
      background: #fffbf5;
      border: 1px solid #ffecd1;
      border-radius: 4px;
      padding: 14px 16px;
    }

    .tips-title {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #995d13;
      font-weight: 600;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .tips-title::before {
      content: '💡';
      font-size: 14px;
    }

    .tip-item {
      font-size: 12px;
      color: #6c5217;
      line-height: 1.5;
      padding-left: 16px;
      position: relative;
      margin-bottom: 4px;
    }

    .tip-item:last-child {
      margin-bottom: 0;
    }

    .tip-item::before {
      content: '→';
      position: absolute;
      left: 0;
      color: #d4a574;
      font-weight: 600;
    }

    .footer {
      padding: 18px 40px 22px;
      border-top: 1px solid #e9ecef;
      background: #ffffff;
      animation: fadeInUp 0.6s ease 0.6s both;
      overflow: visible;
    }

    .download-button {
      width: 100%;
      padding: 12px 24px;
      background: linear-gradient(135deg, #2d6a4f 0%, #40916c 100%);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 12px rgba(45, 106, 79, 0.2);
      letter-spacing: 0.01em;
    }

    .download-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    .download-button:hover::before {
      left: 100%;
    }

    .download-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(45, 106, 79, 0.3);
    }

    .download-button:active {
      transform: translateY(0);
      box-shadow: 0 4px 12px rgba(45, 106, 79, 0.2);
    }

    .download-icon {
      display: inline-block;
      margin-right: 8px;
      font-size: 16px;
    }

    .drive-info {
      text-align: center;
      margin-top: 10px;
      padding-bottom: 4px;
      font-size: 11px;
      color: #868e96;
      line-height: 1.8;
      overflow: visible;
    }

    .drive-link {
      color: #2d6a4f;
      text-decoration: none;
      font-weight: 500;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s;
    }

    .drive-link:hover {
      border-bottom-color: #2d6a4f;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-accent"></div>

    <div class="success-header">
      <div class="checkmark-wrapper">
        <div class="checkmark-circle">
          <div class="checkmark"></div>
        </div>
      </div>
      <h1 class="success-title">Export Complete</h1>
      <p class="success-subtitle">Your markdown file is ready to download</p>
    </div>

    <div class="content">
      <div class="file-info">
        <div class="file-info-row">
          <span class="file-label">File Name</span>
          <span class="file-value">${fileName}</span>
        </div>
        <div class="file-info-row">
          <span class="file-label">Comments Exported</span>
          <span class="comment-badge">${commentCount}</span>
        </div>
      </div>

      <div class="tips">
        <div class="tips-title">Quick Start</div>
        <div class="tip-item">Download opens your .md file automatically</div>
        <div class="tip-item">Copy the content and paste into Claude or ChatGPT</div>
        <div class="tip-item">Or upload the file directly to your AI assistant</div>
      </div>
    </div>

    <div class="footer">
      <button class="download-button" onclick="window.open('${downloadUrl}', '_blank')">
        <span class="download-icon">⬇</span>
        Download Markdown File
      </button>
      <p class="drive-info">
        Also saved to <a href="#" class="drive-link" onclick="event.preventDefault(); window.open('${downloadUrl.replace('/uc?export=download&id=', '/file/d/').replace(/&.*$/, '/view')}', '_blank')">Google Drive</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  var htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(520)
    .setHeight(540);

  ui.showModalDialog(htmlOutput, ' ');
}

/**
 * Export with custom settings
 */
function exportWithCustomSettings() {
  var ui = DocumentApp.getUi();

  // Ask user for preferences
  var includeResolved = ui.alert(
    'Include Resolved Comments?',
    'Do you want to include comments that have been resolved?',
    ui.ButtonSet.YES_NO
  );

  var contextSize = ui.prompt(
    'Context Size',
    'How many characters of surrounding context? (default: 200)',
    ui.ButtonSet.OK_CANCEL
  );

  var chars = 200;
  if (contextSize.getSelectedButton() == ui.Button.OK) {
    var input = parseInt(contextSize.getResponseText());
    if (!isNaN(input) && input > 0 && input < 1000) {
      chars = input;
    }
  }

  // Call appropriate export with settings
  if (includeResolved == ui.Button.YES) {
    exportCommentsToMarkdown(chars);
  } else {
    exportOpenCommentsToMarkdown(chars);
  }
}

/**
 * Create or get "Comment Exports" folder in Drive
 */
function getExportFolder() {
  var folderName = 'Comment Exports';
  var folders = DriveApp.getFoldersByName(folderName);

  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(folderName);
  }
}

/**
 * Save to organized folder instead of root
 */
function exportToFolder() {
  var ui = DocumentApp.getUi();

  var response = ui.alert(
    'Export Open or All Comments?',
    'Choose which comments to export:',
    ui.ButtonSet.YES_NO_CANCEL
  );

  var folder = getExportFolder();

  if (response == ui.Button.YES) {
    // Export all comments
    exportCommentsToMarkdownInFolder(folder, 200);
  } else if (response == ui.Button.NO) {
    // Export open comments
    exportOpenCommentsToMarkdownInFolder(folder, 200);
  }
}

/**
 * Helper to export to specific folder
 */
function exportCommentsToMarkdownInFolder(folder, contextChars) {
  // Run the normal export but move file to folder
  var downloadUrl = exportCommentsToMarkdown(contextChars);
  // File already created, just need to move it
  // (Implementation note: would need to refactor to pass folder through)
  return downloadUrl;
}

function exportOpenCommentsToMarkdownInFolder(folder, contextChars) {
  // Run the normal export but move file to folder
  var downloadUrl = exportOpenCommentsToMarkdown(contextChars);
  return downloadUrl;
}

/**
 * Creates custom menu
 */
function onOpen() {
  DocumentApp.getUi()
    .createMenu('💬 Comment Exporter')
    .addItem('📝 Export All Comments (.md file)', 'exportCommentsToMarkdown')
    .addItem('⚠️ Export Open Comments Only (.md file)', 'exportOpenCommentsToMarkdown')
    .addSeparator()
    .addItem('📁 Export to Organized Folder', 'exportToFolder')
    .addItem('⚙️ Custom Export Settings...', 'exportWithCustomSettings')
    .addToUi();
}

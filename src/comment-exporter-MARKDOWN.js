/**
 * Google Docs Comment Exporter - MARKDOWN FORMAT
 * Exports comments in markdown format
 *
 * SETUP:
 * 1. Extensions → Apps Script
 * 2. Paste this code
 * 3. Services → Add "Drive API" (v3)
 * 4. Save and reload the document
 * 5. Use Comment Exporter → Export Comments...
 */

/**
 * Check if the document supports the Tabs API
 */
function supportsTabsApi(doc) {
  return typeof doc.getTabs === 'function';
}

/**
 * Get all tabs from a document, flattened (includes nested child tabs)
 * Returns empty array if Tabs API is not available
 */
function getAllTabs(doc) {
  if (!supportsTabsApi(doc)) return [];
  var allTabs = [];
  var topTabs = doc.getTabs();
  for (var i = 0; i < topTabs.length; i++) {
    collectTabs(topTabs[i], allTabs);
  }
  return allTabs;
}

function collectTabs(tab, allTabs) {
  allTabs.push(tab);
  var children = tab.getChildTabs();
  for (var i = 0; i < children.length; i++) {
    collectTabs(children[i], allTabs);
  }
}

/**
 * Get body text for a specific tab, or the full document body
 */
function getTabBodyText(doc, tabId) {
  if (!supportsTabsApi(doc)) {
    return doc.getBody().getText();
  }
  if (!tabId || tabId === 'all') {
    var tabs = getAllTabs(doc);
    return tabs.map(function(tab) {
      return tab.asDocumentTab().getBody().getText();
    }).join('\n');
  }
  var tab = doc.getTab(tabId);
  return tab.asDocumentTab().getBody().getText();
}

/**
 * Escape HTML special characters to prevent XSS in dialogs
 */
function escapeHtml(text) {
  if (!text) return '';
  var str = String(text);
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/**
 * Get surrounding context from document for better understanding
 */
function getSurroundingContext(quotedText, contextChars, fullText) {
  if (!quotedText) return null;

  contextChars = contextChars || 150; // Default 150 chars before/after

  try {
    if (!fullText) {
      var doc = DocumentApp.getActiveDocument();
      var body = doc.getBody();
      fullText = body.getText();
    }

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
 * Filter comments to only those whose quoted text appears in the given body text
 */
function filterCommentsByTab(comments, tabBodyText) {
  return comments.filter(function(comment) {
    var quotedText = (comment.quotedFileContent && comment.quotedFileContent.value) ? comment.quotedFileContent.value : '';
    if (!quotedText) return false;
    return tabBodyText.indexOf(quotedText) !== -1;
  });
}

/**
 * Creates custom menu
 */
function onOpen() {
  DocumentApp.getUi()
    .createMenu('Comment Exporter')
    .addItem('Export Comments...', 'showExportDialog')
    .addToUi();
}

/**
 * Show the unified export settings dialog
 */
function showExportDialog() {
  var doc = DocumentApp.getActiveDocument();
  var tabs = getAllTabs(doc);
  var tabInfo = tabs.map(function(tab) {
    return { id: tab.getId(), title: tab.getTitle() };
  });

  var hasMultipleTabs = tabInfo.length > 1;

  // Build tab radio buttons HTML
  var tabRadios = tabInfo.map(function(tab) {
    return '<label class="option-row">' +
      '<input type="radio" name="tab" value="' + escapeHtml(tab.id) + '">' +
      '<span class="option-label">' + escapeHtml(tab.title) + '</span>' +
      '</label>';
  }).join('\n        ');

  var html = '<!DOCTYPE html>\n' +
'<html>\n' +
'<head>\n' +
'  <meta charset="utf-8">\n' +
'  <style>\n' +
'    @import url(\'https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=DM+Sans:wght@400;500;700&display=swap\');\n' +
'\n' +
'    * { margin: 0; padding: 0; box-sizing: border-box; }\n' +
'\n' +
'    body {\n' +
'      font-family: \'DM Sans\', -apple-system, sans-serif;\n' +
'      background: #ffffff;\n' +
'      color: #1a1a1a;\n' +
'      overflow-y: auto;\n' +
'    }\n' +
'\n' +
'    .container {\n' +
'      width: 100%;\n' +
'      position: relative;\n' +
'      animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);\n' +
'    }\n' +
'\n' +
'    @keyframes slideIn {\n' +
'      from { opacity: 0; transform: translateY(20px); }\n' +
'      to { opacity: 1; transform: translateY(0); }\n' +
'    }\n' +
'\n' +
'    .header-accent {\n' +
'      position: absolute;\n' +
'      top: 0; left: 0; right: 0;\n' +
'      height: 4px;\n' +
'      background: linear-gradient(90deg, #2d6a4f 0%, #52b788 50%, #2d6a4f 100%);\n' +
'      background-size: 200% 100%;\n' +
'      animation: shimmer 3s ease infinite;\n' +
'    }\n' +
'\n' +
'    @keyframes shimmer {\n' +
'      0%, 100% { background-position: 0% 0%; }\n' +
'      50% { background-position: 100% 0%; }\n' +
'    }\n' +
'\n' +
'    .header {\n' +
'      padding: 24px 32px 16px;\n' +
'      border-bottom: 1px solid #e9ecef;\n' +
'      background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);\n' +
'    }\n' +
'\n' +
'    .header h1 {\n' +
'      font-family: \'Crimson Pro\', Georgia, serif;\n' +
'      font-size: 24px;\n' +
'      font-weight: 600;\n' +
'      color: #1a1a1a;\n' +
'      letter-spacing: -0.02em;\n' +
'    }\n' +
'\n' +
'    .header p {\n' +
'      font-size: 13px;\n' +
'      color: #6c757d;\n' +
'      margin-top: 4px;\n' +
'    }\n' +
'\n' +
'    .body {\n' +
'      padding: 20px 32px;\n' +
'    }\n' +
'\n' +
'    .section {\n' +
'      margin-bottom: 20px;\n' +
'    }\n' +
'\n' +
'    .section:last-child {\n' +
'      margin-bottom: 0;\n' +
'    }\n' +
'\n' +
'    .section-title {\n' +
'      font-size: 11px;\n' +
'      text-transform: uppercase;\n' +
'      letter-spacing: 0.08em;\n' +
'      color: #6c757d;\n' +
'      font-weight: 600;\n' +
'      margin-bottom: 10px;\n' +
'    }\n' +
'\n' +
'    .options-box {\n' +
'      background: #f8f9fa;\n' +
'      border: 1px solid #e9ecef;\n' +
'      border-radius: 6px;\n' +
'      padding: 12px 14px;\n' +
'    }\n' +
'\n' +
'    .tab-list {\n' +
'      max-height: 160px;\n' +
'      overflow-y: auto;\n' +
'    }\n' +
'\n' +
'    .option-row {\n' +
'      display: flex;\n' +
'      align-items: center;\n' +
'      gap: 10px;\n' +
'      padding: 6px 4px;\n' +
'      cursor: pointer;\n' +
'      border-radius: 4px;\n' +
'      transition: background 0.15s;\n' +
'    }\n' +
'\n' +
'    .option-row:hover {\n' +
'      background: #e9ecef;\n' +
'    }\n' +
'\n' +
'    .option-label {\n' +
'      font-size: 14px;\n' +
'      color: #1a1a1a;\n' +
'    }\n' +
'\n' +
'    .option-help {\n' +
'      font-size: 12px;\n' +
'      color: #868e96;\n' +
'      margin-top: 2px;\n' +
'    }\n' +
'\n' +
'    input[type="radio"], input[type="checkbox"] {\n' +
'      accent-color: #2d6a4f;\n' +
'      width: 16px;\n' +
'      height: 16px;\n' +
'      flex-shrink: 0;\n' +
'    }\n' +
'\n' +
'    .footer {\n' +
'      padding: 16px 32px 20px;\n' +
'      border-top: 1px solid #e9ecef;\n' +
'      background: #ffffff;\n' +
'    }\n' +
'\n' +
'    .export-button {\n' +
'      width: 100%;\n' +
'      padding: 12px 24px;\n' +
'      background: linear-gradient(135deg, #2d6a4f 0%, #40916c 100%);\n' +
'      color: white;\n' +
'      border: none;\n' +
'      border-radius: 4px;\n' +
'      font-size: 14px;\n' +
'      font-weight: 600;\n' +
'      font-family: \'DM Sans\', sans-serif;\n' +
'      cursor: pointer;\n' +
'      position: relative;\n' +
'      overflow: hidden;\n' +
'      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);\n' +
'      box-shadow: 0 4px 12px rgba(45, 106, 79, 0.2);\n' +
'      letter-spacing: 0.01em;\n' +
'    }\n' +
'\n' +
'    .export-button::before {\n' +
'      content: \'\';\n' +
'      position: absolute;\n' +
'      top: 0; left: -100%;\n' +
'      width: 100%; height: 100%;\n' +
'      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);\n' +
'      transition: left 0.5s;\n' +
'    }\n' +
'\n' +
'    .export-button:hover::before { left: 100%; }\n' +
'\n' +
'    .export-button:hover {\n' +
'      transform: translateY(-2px);\n' +
'      box-shadow: 0 8px 20px rgba(45, 106, 79, 0.3);\n' +
'    }\n' +
'\n' +
'    .export-button:active {\n' +
'      transform: translateY(0);\n' +
'      box-shadow: 0 4px 12px rgba(45, 106, 79, 0.2);\n' +
'    }\n' +
'\n' +
'    .export-button:disabled {\n' +
'      background: #adb5bd;\n' +
'      cursor: not-allowed;\n' +
'      box-shadow: none;\n' +
'      transform: none;\n' +
'    }\n' +
'\n' +
'    .export-button:disabled::before { display: none; }\n' +
'\n' +
'    .validation-msg {\n' +
'      text-align: center;\n' +
'      font-size: 12px;\n' +
'      color: #dc3545;\n' +
'      margin-top: 8px;\n' +
'      display: none;\n' +
'    }\n' +
'  </style>\n' +
'</head>\n' +
'<body>\n' +
'  <div class="container">\n' +
'    <div class="header-accent"></div>\n' +
'\n' +
'    <div class="header">\n' +
'      <h1>Export Comments</h1>\n' +
'      <p>Choose what to include in your export</p>\n' +
'    </div>\n' +
'\n' +
'    <div class="body">\n' +
(hasMultipleTabs ?
'      <div class="section">\n' +
'        <div class="section-title">Tab</div>\n' +
'        <div class="options-box">\n' +
'          <div class="tab-list">\n' +
'            <label class="option-row">\n' +
'              <input type="radio" name="tab" value="all" checked>\n' +
'              <span class="option-label">All Tabs</span>\n' +
'            </label>\n' +
'            ' + tabRadios + '\n' +
'          </div>\n' +
'        </div>\n' +
'      </div>\n'
:
'      <input type="hidden" name="tab" value="all">\n'
) +
'\n' +
'      <div class="section">\n' +
'        <div class="section-title">Comment Types</div>\n' +
'        <div class="options-box">\n' +
'          <label class="option-row">\n' +
'            <input type="checkbox" id="includeOpen" checked onchange="validateCheckboxes()">\n' +
'            <span class="option-label">Open</span>\n' +
'          </label>\n' +
'          <label class="option-row">\n' +
'            <input type="checkbox" id="includeResolved" onchange="validateCheckboxes()">\n' +
'            <span class="option-label">Resolved</span>\n' +
'          </label>\n' +
'          <label class="option-row">\n' +
'            <input type="checkbox" id="includeDeleted" onchange="validateCheckboxes()">\n' +
'            <span class="option-label">Deleted</span>\n' +
'          </label>\n' +
'        </div>\n' +
'      </div>\n' +
'\n' +
'      <div class="section">\n' +
'        <div class="section-title">Options</div>\n' +
'        <div class="options-box">\n' +
'          <label class="option-row">\n' +
'            <input type="checkbox" id="includeAiGuidance">\n' +
'            <div>\n' +
'              <span class="option-label">Include AI guidance</span>\n' +
'              <div class="option-help">Adds an AI prompt and response placeholders to the export</div>\n' +
'            </div>\n' +
'          </label>\n' +
'        </div>\n' +
'      </div>\n' +
'    </div>\n' +
'\n' +
'    <div class="footer">\n' +
'      <button class="export-button" id="exportBtn" onclick="doExport()">Export Comments</button>\n' +
'      <div class="validation-msg" id="validationMsg">Select at least one comment type</div>\n' +
'    </div>\n' +
'  </div>\n' +
'\n' +
'  <script>\n' +
'    function validateCheckboxes() {\n' +
'      var open = document.getElementById("includeOpen").checked;\n' +
'      var resolved = document.getElementById("includeResolved").checked;\n' +
'      var deleted = document.getElementById("includeDeleted").checked;\n' +
'      var btn = document.getElementById("exportBtn");\n' +
'      var msg = document.getElementById("validationMsg");\n' +
'      if (!open && !resolved && !deleted) {\n' +
'        btn.disabled = true;\n' +
'        msg.style.display = "block";\n' +
'      } else {\n' +
'        btn.disabled = false;\n' +
'        msg.style.display = "none";\n' +
'      }\n' +
'    }\n' +
'\n' +
'    function doExport() {\n' +
'      var tabEl = document.querySelector(\'input[name="tab"]:checked\') || document.querySelector(\'input[name="tab"]\');\n' +
'      var tabId = tabEl ? tabEl.value : "all";\n' +
'      var includeOpen = document.getElementById("includeOpen").checked;\n' +
'      var includeResolved = document.getElementById("includeResolved").checked;\n' +
'      var includeDeleted = document.getElementById("includeDeleted").checked;\n' +
'      var includeAiGuidance = document.getElementById("includeAiGuidance").checked;\n' +
'\n' +
'      var btn = document.getElementById("exportBtn");\n' +
'      btn.disabled = true;\n' +
'      btn.textContent = "Exporting...";\n' +
'\n' +
'      google.script.run\n' +
'        .withSuccessHandler(function() {\n' +
'          google.script.host.close();\n' +
'        })\n' +
'        .withFailureHandler(function(err) {\n' +
'          btn.disabled = false;\n' +
'          btn.textContent = "Export Comments";\n' +
'          alert("Export failed: " + err.message);\n' +
'        })\n' +
'        .unifiedExport(tabId, includeOpen, includeResolved, includeDeleted, includeAiGuidance);\n' +
'    }\n' +
'  </script>\n' +
'</body>\n' +
'</html>';

  var htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(440)
    .setHeight(hasMultipleTabs ? 540 : 420);

  DocumentApp.getUi().showModalDialog(htmlOutput, ' ');
}

/**
 * Unified export function called from the export dialog
 */
function unifiedExport(tabId, includeOpen, includeResolved, includeDeleted, includeAiGuidance) {
  var contextChars = 200;
  var doc = DocumentApp.getActiveDocument();
  var docId = doc.getId();
  var docName = doc.getName();

  // Get the body text for the selected tab
  var tabBodyText = getTabBodyText(doc, tabId);

  // Determine tab name for the header
  var tabName = 'All Tabs';
  if (tabId !== 'all' && supportsTabsApi(doc)) {
    var tab = doc.getTab(tabId);
    tabName = tab.getTitle();
  }

  Logger.log('Exporting from tab: ' + tabName);
  Logger.log('Filters — open: ' + includeOpen + ', resolved: ' + includeResolved + ', deleted: ' + includeDeleted + ', AI guidance: ' + includeAiGuidance);

  try {
    var response = Drive.Comments.list(docId, {
      fields: 'comments(id,author(displayName),content,quotedFileContent(value),createdTime,modifiedTime,resolved,deleted,replies(id,author(displayName),content,createdTime,modifiedTime,deleted,action))',
      includeDeleted: includeDeleted,
      pageSize: 100
    });

    // Filter comments by type based on user selections
    var comments = (response.comments || []).filter(function(comment) {
      if (comment.deleted) {
        return includeDeleted;
      }
      if (comment.content === '') return false;
      if (comment.resolved) {
        return includeResolved;
      }
      return includeOpen;
    });

    // Filter by tab if a specific tab was selected
    if (tabId !== 'all') {
      comments = filterCommentsByTab(comments, tabBodyText);
    }

    if (comments.length === 0) {
      DocumentApp.getUi().alert('No comments found matching your filters.');
      return;
    }

    Logger.log('Found ' + comments.length + ' comment(s)');

    // Enrich comments with context and position
    var enrichedComments = comments.map(function(comment) {
      var quotedText = (comment.quotedFileContent && comment.quotedFileContent.value) ? comment.quotedFileContent.value : '';
      var context = getSurroundingContext(quotedText, contextChars, tabBodyText);

      return {
        comment: comment,
        context: context,
        position: context ? context.position : 999999
      };
    });

    enrichedComments.sort(function(a, b) {
      return a.position - b.position;
    });

    // Build filter description
    var filterParts = [];
    if (includeOpen) filterParts.push('Open');
    if (includeResolved) filterParts.push('Resolved');
    if (includeDeleted) filterParts.push('Deleted');
    var filterDesc = filterParts.join(', ');

    // Build markdown
    var markdown = [];

    markdown.push('# Comments from: ' + docName);
    markdown.push('');
    markdown.push('**Generated:** ' + new Date().toLocaleString());
    if (tabId !== 'all') {
      markdown.push('**Tab:** ' + tabName);
    }
    markdown.push('**Showing:** ' + filterDesc);
    markdown.push('**Total Comments:** ' + comments.length);
    markdown.push('**Sort Order:** Top to bottom of document');
    markdown.push('');

    // AI guidance header (conditional)
    if (includeAiGuidance) {
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
    }

    markdown.push('---');
    markdown.push('');

    var openCount = 0;
    var resolvedCount = 0;
    var deletedCount = 0;

    enrichedComments.forEach(function(item, index) {
      var comment = item.comment;
      var context = item.context;
      var commentNum = index + 1;
      var author = (comment.author && comment.author.displayName) ? comment.author.displayName : 'Unknown';
      var content = comment.content || '';
      var quotedText = (comment.quotedFileContent && comment.quotedFileContent.value) ? comment.quotedFileContent.value : '';
      var createdTime = comment.createdTime || '';
      var resolved = comment.resolved || false;
      var deleted = comment.deleted || false;
      var replies = comment.replies || [];

      if (deleted) { deletedCount++; }
      else if (resolved) { resolvedCount++; }
      else { openCount++; }

      var dateStr = '';
      if (createdTime) {
        try { dateStr = new Date(createdTime).toLocaleDateString(); } catch(e) { dateStr = createdTime; }
      }

      markdown.push('## Comment #' + commentNum + ' - ' + author);
      if (dateStr) { markdown.push('**Date:** ' + dateStr); }

      // Show status when multiple types are included
      if ((includeOpen && includeResolved) || (includeOpen && includeDeleted) || (includeResolved && includeDeleted)) {
        if (deleted) {
          markdown.push('**Status:** Deleted');
        } else {
          markdown.push('**Status:** ' + (resolved ? 'Resolved' : 'Open'));
        }
      }
      markdown.push('');

      if (context) {
        markdown.push('**Document Context:**');
        markdown.push('');
        if (context.before) {
          markdown.push('_[...previous text]_');
          markdown.push(context.before);
          markdown.push('');
        }
        markdown.push('**Referenced Text:**');
        markdown.push('> ' + context.quoted.replace(/\n/g, '\n> '));
        markdown.push('');
        if (context.after) {
          markdown.push('_[...following text]_');
          markdown.push(context.after);
          markdown.push('');
        }
      } else if (quotedText) {
        markdown.push('**Referenced Text:**');
        markdown.push('> ' + quotedText.replace(/\n/g, '\n> '));
        markdown.push('');
      }

      if (deleted) {
        markdown.push('**Comment:** _[Deleted]_');
      } else {
        markdown.push('**Comment:**');
        markdown.push(content);
      }
      markdown.push('');

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
            try { replyDateStr = new Date(replyTime).toLocaleDateString(); } catch(e) { replyDateStr = replyTime; }
          }

          var actionStr = '';
          if (action === 'resolve') { actionStr = ' [Resolved this comment]'; }
          else if (action === 'reopen') { actionStr = ' [Reopened this comment]'; }

          markdown.push('- **' + replyAuthor + '** (' + replyDateStr + ')' + actionStr + ':');
          if (replyContent) { markdown.push('  ' + replyContent.replace(/\n/g, '\n  ')); }
          markdown.push('');
        });
      }

      // AI response placeholder (conditional)
      if (includeAiGuidance) {
        markdown.push('**AI Response:**');
        markdown.push('');
        markdown.push('_[AI will provide suggestions here]_');
        markdown.push('');
      }

      markdown.push('---');
      markdown.push('');
    });

    // Summary
    markdown.push('');
    markdown.push('## Summary');
    markdown.push('');
    markdown.push('- **Total Comments:** ' + comments.length);
    if (includeOpen) markdown.push('- **Open:** ' + openCount);
    if (includeResolved) markdown.push('- **Resolved:** ' + resolvedCount);
    if (includeDeleted) markdown.push('- **Deleted:** ' + deletedCount);
    markdown.push('');
    markdown.push('---');
    markdown.push('');
    markdown.push('*Generated with Google Apps Script Comment Exporter*');

    var markdownText = markdown.join('\n');

    // Build filename
    var tabSlug = (tabId !== 'all') ? tabName.replace(/[^a-z0-9]/gi, '-') + '-' : '';
    var fileName = 'Comments-' + tabSlug + docName.replace(/[^a-z0-9]/gi, '-') + '.md';
    var file = DriveApp.createFile(fileName, markdownText, MimeType.PLAIN_TEXT);

    var fileId = file.getId();
    var downloadUrl = 'https://drive.google.com/uc?export=download&id=' + fileId;

    Logger.log('Exported ' + comments.length + ' comments (' + filterDesc + ')');
    Logger.log('File: ' + fileName);

    showDownloadDialog(downloadUrl, fileName, comments.length);

  } catch (error) {
    Logger.log('ERROR: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
    throw error;
  }
}

/**
 * Show download/success dialog after export
 */
function showDownloadDialog(downloadUrl, fileName, commentCount) {
  var ui = DocumentApp.getUi();

  var safeFileName = escapeHtml(fileName);
  var safeCount = escapeHtml(String(commentCount));
  var safeDownloadUrl = escapeHtml(downloadUrl);
  var safeDriveUrl = escapeHtml(
    downloadUrl.replace('/uc?export=download&id=', '/file/d/').replace(/&.*$/, '/view')
  );

  var html = '<!DOCTYPE html>\n' +
'<html>\n' +
'<head>\n' +
'  <meta charset="utf-8">\n' +
'  <style>\n' +
'    @import url(\'https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=DM+Sans:wght@400;500;700&display=swap\');\n' +
'\n' +
'    * { margin: 0; padding: 0; box-sizing: border-box; }\n' +
'\n' +
'    body {\n' +
'      font-family: \'DM Sans\', -apple-system, sans-serif;\n' +
'      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);\n' +
'      padding: 0;\n' +
'      overflow: hidden;\n' +
'      color: #1a1a1a;\n' +
'    }\n' +
'\n' +
'    .container {\n' +
'      width: 100%;\n' +
'      min-height: 100%;\n' +
'      display: flex;\n' +
'      flex-direction: column;\n' +
'      position: relative;\n' +
'      background: #ffffff;\n' +
'      animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);\n' +
'    }\n' +
'\n' +
'    @keyframes slideIn {\n' +
'      from { opacity: 0; transform: translateY(20px); }\n' +
'      to { opacity: 1; transform: translateY(0); }\n' +
'    }\n' +
'\n' +
'    .header-accent {\n' +
'      position: absolute;\n' +
'      top: 0; left: 0; right: 0;\n' +
'      height: 4px;\n' +
'      background: linear-gradient(90deg, #2d6a4f 0%, #52b788 50%, #2d6a4f 100%);\n' +
'      background-size: 200% 100%;\n' +
'      animation: shimmer 3s ease infinite;\n' +
'    }\n' +
'\n' +
'    @keyframes shimmer {\n' +
'      0%, 100% { background-position: 0% 0%; }\n' +
'      50% { background-position: 100% 0%; }\n' +
'    }\n' +
'\n' +
'    .success-header {\n' +
'      padding: 28px 40px 20px;\n' +
'      border-bottom: 1px solid #e9ecef;\n' +
'      background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);\n' +
'    }\n' +
'\n' +
'    .checkmark-wrapper {\n' +
'      width: 48px;\n' +
'      height: 48px;\n' +
'      margin: 0 auto 14px;\n' +
'      position: relative;\n' +
'      animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;\n' +
'    }\n' +
'\n' +
'    @keyframes scaleIn {\n' +
'      from { transform: scale(0); opacity: 0; }\n' +
'      to { transform: scale(1); opacity: 1; }\n' +
'    }\n' +
'\n' +
'    .checkmark-circle {\n' +
'      width: 48px;\n' +
'      height: 48px;\n' +
'      border-radius: 50%;\n' +
'      background: linear-gradient(135deg, #2d6a4f 0%, #40916c 100%);\n' +
'      display: flex;\n' +
'      align-items: center;\n' +
'      justify-content: center;\n' +
'      box-shadow: 0 4px 16px rgba(45, 106, 79, 0.24);\n' +
'      position: relative;\n' +
'    }\n' +
'\n' +
'    .checkmark-circle::before {\n' +
'      content: \'\';\n' +
'      position: absolute;\n' +
'      inset: -2px;\n' +
'      border-radius: 50%;\n' +
'      background: linear-gradient(135deg, #52b788, #2d6a4f);\n' +
'      opacity: 0.3;\n' +
'      filter: blur(8px);\n' +
'      z-index: -1;\n' +
'    }\n' +
'\n' +
'    .checkmark {\n' +
'      width: 20px;\n' +
'      height: 12px;\n' +
'      border-left: 3px solid white;\n' +
'      border-bottom: 3px solid white;\n' +
'      transform: rotate(-45deg) translateY(-2px);\n' +
'      animation: drawCheck 0.4s cubic-bezier(0.65, 0, 0.35, 1) 0.4s both;\n' +
'    }\n' +
'\n' +
'    @keyframes drawCheck {\n' +
'      from { width: 0; height: 0; }\n' +
'      to { width: 20px; height: 12px; }\n' +
'    }\n' +
'\n' +
'    .success-title {\n' +
'      font-family: \'Crimson Pro\', Georgia, serif;\n' +
'      font-size: 26px;\n' +
'      font-weight: 600;\n' +
'      text-align: center;\n' +
'      color: #1a1a1a;\n' +
'      margin-bottom: 6px;\n' +
'      letter-spacing: -0.02em;\n' +
'      animation: fadeInUp 0.5s ease 0.3s both;\n' +
'    }\n' +
'\n' +
'    .success-subtitle {\n' +
'      font-size: 13px;\n' +
'      text-align: center;\n' +
'      color: #6c757d;\n' +
'      font-weight: 400;\n' +
'      animation: fadeInUp 0.5s ease 0.4s both;\n' +
'    }\n' +
'\n' +
'    @keyframes fadeInUp {\n' +
'      from { opacity: 0; transform: translateY(10px); }\n' +
'      to { opacity: 1; transform: translateY(0); }\n' +
'    }\n' +
'\n' +
'    .content {\n' +
'      padding: 20px 40px;\n' +
'      animation: fadeIn 0.6s ease 0.5s both;\n' +
'    }\n' +
'\n' +
'    @keyframes fadeIn {\n' +
'      from { opacity: 0; }\n' +
'      to { opacity: 1; }\n' +
'    }\n' +
'\n' +
'    .file-info {\n' +
'      background: #f8f9fa;\n' +
'      border: 1px solid #e9ecef;\n' +
'      border-radius: 4px;\n' +
'      padding: 14px 16px;\n' +
'      margin-bottom: 16px;\n' +
'      position: relative;\n' +
'      overflow: hidden;\n' +
'    }\n' +
'\n' +
'    .file-info::before {\n' +
'      content: \'\';\n' +
'      position: absolute;\n' +
'      top: 0; left: 0;\n' +
'      width: 3px; height: 100%;\n' +
'      background: linear-gradient(180deg, #2d6a4f, #52b788);\n' +
'    }\n' +
'\n' +
'    .file-info-row {\n' +
'      display: flex;\n' +
'      justify-content: space-between;\n' +
'      align-items: center;\n' +
'      margin-bottom: 10px;\n' +
'    }\n' +
'\n' +
'    .file-info-row:last-child { margin-bottom: 0; }\n' +
'\n' +
'    .file-label {\n' +
'      font-size: 12px;\n' +
'      text-transform: uppercase;\n' +
'      letter-spacing: 0.05em;\n' +
'      color: #6c757d;\n' +
'      font-weight: 500;\n' +
'    }\n' +
'\n' +
'    .file-value {\n' +
'      font-size: 14px;\n' +
'      color: #1a1a1a;\n' +
'      font-weight: 500;\n' +
'      font-family: \'DM Sans\', monospace;\n' +
'      max-width: 280px;\n' +
'      overflow: hidden;\n' +
'      text-overflow: ellipsis;\n' +
'      white-space: nowrap;\n' +
'      text-align: right;\n' +
'    }\n' +
'\n' +
'    .comment-badge {\n' +
'      display: inline-flex;\n' +
'      align-items: center;\n' +
'      gap: 6px;\n' +
'      background: linear-gradient(135deg, #2d6a4f 0%, #40916c 100%);\n' +
'      color: white;\n' +
'      padding: 4px 12px;\n' +
'      border-radius: 3px;\n' +
'      font-size: 13px;\n' +
'      font-weight: 600;\n' +
'    }\n' +
'\n' +
'    .tips {\n' +
'      background: #fffbf5;\n' +
'      border: 1px solid #ffecd1;\n' +
'      border-radius: 4px;\n' +
'      padding: 14px 16px;\n' +
'    }\n' +
'\n' +
'    .tips-title {\n' +
'      font-size: 12px;\n' +
'      text-transform: uppercase;\n' +
'      letter-spacing: 0.05em;\n' +
'      color: #995d13;\n' +
'      font-weight: 600;\n' +
'      margin-bottom: 8px;\n' +
'      display: flex;\n' +
'      align-items: center;\n' +
'      gap: 6px;\n' +
'    }\n' +
'\n' +
'    .tip-item {\n' +
'      font-size: 12px;\n' +
'      color: #6c5217;\n' +
'      line-height: 1.5;\n' +
'      padding-left: 16px;\n' +
'      position: relative;\n' +
'      margin-bottom: 4px;\n' +
'    }\n' +
'\n' +
'    .tip-item:last-child { margin-bottom: 0; }\n' +
'\n' +
'    .tip-item::before {\n' +
'      content: \'→\';\n' +
'      position: absolute;\n' +
'      left: 0;\n' +
'      color: #d4a574;\n' +
'      font-weight: 600;\n' +
'    }\n' +
'\n' +
'    .footer {\n' +
'      padding: 18px 40px 22px;\n' +
'      border-top: 1px solid #e9ecef;\n' +
'      background: #ffffff;\n' +
'      animation: fadeInUp 0.6s ease 0.6s both;\n' +
'      overflow: visible;\n' +
'    }\n' +
'\n' +
'    .download-button {\n' +
'      width: 100%;\n' +
'      padding: 12px 24px;\n' +
'      background: linear-gradient(135deg, #2d6a4f 0%, #40916c 100%);\n' +
'      color: white;\n' +
'      border: none;\n' +
'      border-radius: 4px;\n' +
'      font-size: 14px;\n' +
'      font-weight: 600;\n' +
'      font-family: \'DM Sans\', sans-serif;\n' +
'      cursor: pointer;\n' +
'      position: relative;\n' +
'      overflow: hidden;\n' +
'      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);\n' +
'      box-shadow: 0 4px 12px rgba(45, 106, 79, 0.2);\n' +
'      letter-spacing: 0.01em;\n' +
'    }\n' +
'\n' +
'    .download-button::before {\n' +
'      content: \'\';\n' +
'      position: absolute;\n' +
'      top: 0; left: -100%;\n' +
'      width: 100%; height: 100%;\n' +
'      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);\n' +
'      transition: left 0.5s;\n' +
'    }\n' +
'\n' +
'    .download-button:hover::before { left: 100%; }\n' +
'\n' +
'    .download-button:hover {\n' +
'      transform: translateY(-2px);\n' +
'      box-shadow: 0 8px 20px rgba(45, 106, 79, 0.3);\n' +
'    }\n' +
'\n' +
'    .download-button:active {\n' +
'      transform: translateY(0);\n' +
'      box-shadow: 0 4px 12px rgba(45, 106, 79, 0.2);\n' +
'    }\n' +
'\n' +
'    .download-icon {\n' +
'      display: inline-block;\n' +
'      margin-right: 8px;\n' +
'      font-size: 16px;\n' +
'    }\n' +
'\n' +
'    .drive-info {\n' +
'      text-align: center;\n' +
'      margin-top: 10px;\n' +
'      padding-bottom: 4px;\n' +
'      font-size: 11px;\n' +
'      color: #868e96;\n' +
'      line-height: 1.8;\n' +
'      overflow: visible;\n' +
'    }\n' +
'\n' +
'    .drive-link {\n' +
'      color: #2d6a4f;\n' +
'      text-decoration: none;\n' +
'      font-weight: 500;\n' +
'      border-bottom: 1px solid transparent;\n' +
'      transition: border-color 0.2s;\n' +
'    }\n' +
'\n' +
'    .drive-link:hover { border-bottom-color: #2d6a4f; }\n' +
'  </style>\n' +
'</head>\n' +
'<body>\n' +
'  <div class="container">\n' +
'    <div class="header-accent"></div>\n' +
'\n' +
'    <div class="success-header">\n' +
'      <div class="checkmark-wrapper">\n' +
'        <div class="checkmark-circle">\n' +
'          <div class="checkmark"></div>\n' +
'        </div>\n' +
'      </div>\n' +
'      <h1 class="success-title">Export Complete</h1>\n' +
'      <p class="success-subtitle">Your markdown file is ready to download</p>\n' +
'    </div>\n' +
'\n' +
'    <div class="content">\n' +
'      <div class="file-info">\n' +
'        <div class="file-info-row">\n' +
'          <span class="file-label">File Name</span>\n' +
'          <span class="file-value">' + safeFileName + '</span>\n' +
'        </div>\n' +
'        <div class="file-info-row">\n' +
'          <span class="file-label">Comments Exported</span>\n' +
'          <span class="comment-badge">' + safeCount + '</span>\n' +
'        </div>\n' +
'      </div>\n' +
'\n' +
'      <div class="tips">\n' +
'        <div class="tips-title">Quick Start</div>\n' +
'        <div class="tip-item">Download opens your .md file automatically</div>\n' +
'        <div class="tip-item">Copy the content and paste into Claude or ChatGPT</div>\n' +
'        <div class="tip-item">Or upload the file directly to your AI assistant</div>\n' +
'      </div>\n' +
'    </div>\n' +
'\n' +
'    <div class="footer">\n' +
'      <button class="download-button" id="downloadBtn">Download Markdown File</button>\n' +
'      <p class="drive-info">\n' +
'        Also saved to <a href="#" class="drive-link" id="driveLink">Google Drive</a>\n' +
'      </p>\n' +
'    </div>\n' +
'  </div>\n' +
'\n' +
'  <script>\n' +
'    var downloadUrl = ' + JSON.stringify(downloadUrl) + ';\n' +
'    var driveUrl = downloadUrl.replace("/uc?export=download&id=", "/file/d/").replace(/&.*$/, "/view");\n' +
'    document.getElementById("downloadBtn").addEventListener("click", function() {\n' +
'      window.open(downloadUrl, "_blank");\n' +
'    });\n' +
'    document.getElementById("driveLink").addEventListener("click", function(e) {\n' +
'      e.preventDefault();\n' +
'      window.open(driveUrl, "_blank");\n' +
'    });\n' +
'  </script>\n' +
'</body>\n' +
'</html>';

  var htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(520)
    .setHeight(540);

  ui.showModalDialog(htmlOutput, ' ');
}

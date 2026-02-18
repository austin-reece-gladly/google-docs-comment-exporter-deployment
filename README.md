# Google Docs Comment Exporter

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Export Google Docs comments to AI-ready markdown format**

> **Open Source Deployment Framework:** This repository contains comprehensive documentation and strategies for deploying the Google Docs Comment Exporter across medium-sized organizations (50-500 people). The deployment playbooks, guides, and templates are freely available under the MIT License.

## Overview

The Google Docs Comment Exporter is a lightweight Apps Script tool that extracts all comments from a Google Doc and exports them as a clean, structured markdown file. Perfect for:

- Preparing document feedback for AI analysis (Claude, ChatGPT, etc.)
- Creating comment archives for review cycles
- Extracting discussion threads from collaborative documents
- Generating stakeholder feedback summaries

## Features

- **Two Export Modes:**
  - Export all comments (including resolved)
  - Export only open/unresolved comments

- **AI-Optimized Format:**
  - Clean markdown structure
  - Preserves comment context and threading
  - Includes author names and timestamps
  - Shows quoted text from document

- **User-Friendly:**
  - Custom menu in Google Docs
  - Automatic file creation in Google Drive
  - Styled download dialog with one-click access
  - No external dependencies

## Quick Start

1. **For End Users:** See [Installation Guide](docs/installation-guide.md) for step-by-step setup
2. **For IT Teams:** See [IT Deployment Guide](docs/it-deployment-guide.md) for bulk deployment
3. **For Using the Tool:** See [User Guide](docs/user-guide.md) for export instructions

## Project Structure

```
google-doc-comment-export/
├── src/
│   └── comment-exporter-MARKDOWN.js    # Main script (copy to Apps Script)
├── docs/
│   ├── installation-guide.md           # End-user installation steps
│   ├── it-deployment-guide.md          # IT deployment guide
│   └── user-guide.md                   # How to use the exporter
├── examples/
│   ├── export-dialog.html              # Reference: styled download dialog
│   └── *.js                            # Legacy versions for reference
└── README.md                           # This file
```

## Deployment Phases

### Phase 1: Manual Installation (Current)
- Users install script per document
- ~5-10 minute setup time
- Full control over which documents have the tool
- See [Installation Guide](docs/installation-guide.md)

### Phase 2: Google Workspace Add-on (Planned)
- One-time installation by IT admin
- Automatic deployment across organization
- Zero user setup required
- Available in all Google Docs automatically

## Technical Details

- **Platform:** Google Apps Script
- **Dependencies:** Google Drive API v3
- **Triggers:** Custom menu on document open
- **Permissions Required:**
  - Read access to current document
  - Write access to Google Drive (for export files)

## Support

- **Documentation:** See `/docs` folder for comprehensive guides
- **Issues:** [Open an issue](https://github.com/austin-reece-gladly/google-docs-comment-exporter-deployment/issues) on GitHub
- **Questions:** [Start a discussion](https://github.com/austin-reece-gladly/google-docs-comment-exporter-deployment/discussions)
- **Feature Requests:** Submit via GitHub issues

## Version History

- **v1.0** - Initial markdown exporter with dual export modes
  - Clean markdown output optimized for AI tools
  - Styled download dialog with Google Drive integration
  - Complete deployment documentation and strategy

## Contributing

Contributions are welcome! This project includes:
- Deployment strategies and playbooks
- Installation and user guides
- Email templates and communication plans
- Success metrics frameworks

Feel free to:
- Submit improvements to documentation
- Share your deployment experiences
- Suggest enhancements to the rollout strategy
- Report issues or gaps in the guides

## License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Austin Reece

---

**Purpose:** Deployment framework for scaling across 50-500 person organizations
**Last Updated:** February 2026

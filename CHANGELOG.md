# Changelog

All notable changes to AI RTL Resolver will be documented in this file.

## [5.1.4] - 2026-08-26

### Fixed
- ChatGPT unresponsible when extension is enabled.

## [5.1.3] - 2026-08-11

### Changed
- Change persian weight from 50 to 30.

### Fixed
- Qwen AI detect rtl texts when there is ltr phrase.


## [5.1.2] - 2026-08-11

### Fixed
- Gemini and Claude icon issues


## [5.1.1] - 2026-08-08

### Added
- Support Multi fonts on popup panel.

### Changed
- Modify all notebooklm links to notebook.


## [5.1] - 2026-07-21

### Added
- Kimi (kimi.com) support with Vazirmatn font injection

### Changed
- Redesign extension popup to compact 2-column grid layout
- Rename NotebookLM to Gemini Notebook

### Improved
- Popup width reduced from 300px to 280px
- Smaller icons (18px vs 28px)
- Removed URL display for cleaner look

---

## [5.0] - 2026-06-XX

### Added
- Per-site toggle to enable/disable extension per platform
- z.ai support
- Duck.ai support
- Gemini Notebook (formerly NotebookLM) support

### Changed
- 9+ platforms now supported

---

## [4.2] - 2026-06-XX

### Added
- Qwen (chat.qwen.ai) support

---

## [4.1] - 2026-06-XX

### Added
- Gemini (gemini.google.com) support

### Fixed
- Various RTL detection issues

---

## [4.0] - 2026-06-XX

### Added
- Perplexity AI support

### Changed
- Complete rewrite using TypeScript
- Improved build system with Vite
- Self-contained content scripts (no shared chunks)

---

## [3.1] - 2026-06-XX

### Added
- Claude AI (claude.ai) support

---

## [2.0] - 2026-01-XX

### Added
- DeepSeek support

### Improved
- Better RTL text detection algorithm

---

## [1.0] - 2026-01-XX

### Added
- Initial release
- Basic ChatGPT support
- Automatic RTL text direction fixing
- Vazirmatn font injection for Persian/Arabic text
- Code blocks preserved as LTR

---

## Supported Platforms

| Platform | URL | Status |
|----------|-----|--------|
| ChatGPT | chatgpt.com | ✅ Supported |
| Claude AI | claude.ai | ✅ Supported |
| DeepSeek | chat.deepseek.com | ✅ Supported |
| Gemini | gemini.google.com | ✅ Supported |
| Perplexity | perplexity.ai | ✅ Supported |
| Qwen | chat.qwen.ai | ✅ Supported |
| z.ai | chat.z.ai | ✅ Supported |
| Gemini Notebook | notebook.google.com | ✅ Supported |
| Duck.ai | duck.ai | ✅ Supported |
| Kimi | kimi.com | ✅ Supported |

# Ai RTL Resolver

A browser extension that fixes text direction for Persian, Arabic, and other RTL languages on ChatGPT, Claude, Deepseek and Gemeni.

![Extension Screenshot](screenshots/promo-marquee.png)

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Supported Websites](#supported-websites)
- [License](#license)
- [Support](#support)

## Features

- ✅ Automatically detects and fixes RTL text direction on AI chat platforms
- ✅ Preserves mathematical formulas and code blocks (LTR)
- ✅ Works with Persian (Farsi), Arabic, Urdu, and Hebrew scripts
- ✅ Lightweight with minimal performance impact
- ✅ No configuration needed - works out of the box
- ✅ Open source and privacy-friendly

## Installation

### 1- Install via Stores

For Chrome based browsers: [Chrome Web Store](https://chromewebstore.google.com/detail/ai-rtl-resolver/fajdcnieohikiogbngkfedbpfoniobcc)

For Firefox: [Firefox Browser add-ons](https://addons.mozilla.org/en-US/firefox/addon/ai-rtl-resolver/)


### 2- Install Manually

1. Download the latest release from GitHub [Releases](https://github.com/miladniroee/ai-rtl-resolver/releases).
2. Extract the downloaded ZIP file.
3. Open your browser's extensions page:

   * **Chrome:** `chrome://extensions/`
   * **Edge:** `edge://extensions/`
   * **Brave:** `brave://extensions/`
   * **Opera:** `opera://extensions/`
   * **Firefox:** `about:debugging#/runtime/this-firefox`
4. Enable **Developer mode** (not required on Firefox).
5. Click **Load unpacked**.
6. Select the extracted extension folder.

> [!NOTE]
> The extension will stay installed as long as you don't delete the extracted folder. Don't move or delete it after loading.

### Building From Source

```bash
npm install
npm run typecheck   # optional strict TypeScript check
npm run build
```

Source is written in TypeScript under `src/`. The build emits one self-contained script per content script entry in `dist/` (no shared chunks), which is required for Manifest V3 content scripts.

## Usage

1. Install the extension following the instructions above
2. Navigate to chatbots:
   * [ChatGPT](https://chat.openai.com) 
   * [Deepseek](https://chat.deepseek.com) 
   * [Claude](https://claude.ai/)
   * [Perplexity](https://www.perplexity.ai/)
   * [Gemeni](https://gemini.google.com/)
3. The extension activates automatically
4. Type or paste RTL text - it will display correctly
5. Mathematical formulas and code remain LTR

## Supported Websites

| Website | Status | Notes |
|---------|--------|-------|
| ChatGPT (chat.openai.com) | ✅ Fully supported | - |
| Deepseek (chat.deepseek.com) | ✅ Fully supported | - |
| Claude (claude.ai) | ✅ Fully supported | - |
| Perplexity AI | ✅ Fully supported | - |
| Gemeni | ✅ Fully supported | - |

*Request a website by [opening an issue](https://github.com/miladniroee/ai-rtl-resolver/issues)*

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v4.1 | Current | Add Gemeni, Fix issues |
| v4.0 | Jun 2026 | Rewrite project using TS, add perplexity |
| v3.1 | Jun 2026 | Added Claude support |
| v2.0 | Jan 2026 | Added Deepseek support, improved RTL detection |
| v1.0 | Initial | Basic ChatGPT support |

## Roadmap

- [ ] Manual Rtl/Ltr Set for a text
- [ ] Copy Mathematical texts

## Acknowledgments

- [Vazirmatn](https://github.com/rastikerdar/vazirmatn) font by Rastikerdar

## Support

If you find this extension useful:
- ⭐ Star the [GitHub repository](https://github.com/miladniroee/ai-rtl-resolver)
- 📢 Share it with others who need RTL support
- 🐛 Report issues to help improve



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for Persian Speakers**


> اصلا نمی‌دونم چرا کل README رو انگلیسی نوشتم، لذت ببرید دیگه...

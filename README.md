![GitHub Release](https://img.shields.io/github/v/release/miladniroee/ai-rtl-resolver?style=for-the-badge&logo=github)
![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/fajdcnieohikiogbngkfedbpfoniobcc?style=for-the-badge&logo=google%20chrome&logoColor=gold&color=gold)
![Mozilla Add-on Version](https://img.shields.io/amo/v/ai-rtl-resolver?style=for-the-badge&logo=firefox&color=orange)


# Ai RTL Resolver

A browser extension that fixes text direction for Persian, Arabic, and other RTL languages on ChatGPT, Claude, Deepseek, Gemeni, Qwen, z.ai, NotebookLM and Ai Studio.

![Extension Screenshot](screenshots/promo-marquee.png)

## Supported Platforms

| Platform | Website |
|----------|---------|
| <img src="public/platforms/chatgpt.png" width="20"> ChatGPT | [chatgpt.com](chatgpt.com) |
| <img src="public/platforms/claude.png" width="20"> Claude | [claude.ai](claude.ai) |
| <img src="public/platforms/deepseek.png" width="20"> DeepSeek | [chat.deepseek.com](chat.deepseek.com) |
| <img src="public/platforms/gemini.png" width="20"> Gemini | [gemini.google.com](gemini.google.com) |
| <img src="public/platforms/perplexity.png" width="20"> Perplexity | [perplexity.ai](perplexity.ai) |
| <img src="public/platforms/qwen.png" width="20"> Qwen | [chat.qwen.ai](chat.qwen.ai) |
| <img src="public/platforms/zai.png" width="20"> z.ai | [chat.z.ai](chat.z.ai) |
| <img src="public/platforms/notebooklm%20.png" width="20"> NotebookLM | [notebooklm.google.com](notebooklm.google.com) |
| <img src="public/platforms/aistudio.png" width="20"> Ai Studio | [aistudio.google.com](aistudio.google.com) |

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
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


### Building From Source

```bash
npm install
npm run typecheck   # optional strict TypeScript check
npm run build
```

Source is written in TypeScript under `src/`. The build emits one self-contained script per content script entry in `dist/` (no shared chunks), which is required for Manifest V3 content scripts.

## Usage

1. Install the extension following the instructions above
2. Navigate to any supported platform
3. The extension activates automatically
4. Type or paste RTL text - it will display correctly
5. Mathematical formulas and code remain LTR
6. Click the extension icon to enable/disable per platform

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v5.0 | Current | Add per-site toggle, add z.ai, add NotebookLM |
| v4.2 | Jun 2026 | Add Qwen support |
| v4.1 | Jun 2026 | Add Gemeni, Fix issues |
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

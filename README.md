# Ai RTL Resolver

A browser extension that fixes text direction for Persian, Arabic, and other RTL languages on ChatGPT and Deepseek.

![Extension Screenshot](public/screenshots/extension.jpg)

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

> [!WARNING]
> Due to internet restrictions in Iran, the extension is currently not available on browser stores.
> Download the latest release and install it manually using the **Load unpacked** option.

### Chrome / Edge / Brave / Opera / Firefox

1. Download the latest release from GitHub Releases.
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
npm run build
```

The production-ready extension will be generated inside the `dist/` directory.

To load the extension manually, select the generated `dist/` folder using **Load unpacked**.

> [!NOTE]
> The extension will stay installed as long as you don't delete the extracted folder. Don't move or delete it after loading.

### Firefox

1. Install from Firefox Add-ons: [AI RTL Resolver](https://addons.mozilla.org/en-US/firefox/addon/ai-rtl-resolver/)
2. Click **Add to Firefox**
3. Open ChatGPT or DeepSeek
4. RTL text will work automatically

## Usage

1. Install the extension following the instructions above
2. Navigate to [ChatGPT](https://chat.openai.com) or [Deepseek](https://chat.deepseek.com)
3. The extension activates automatically
4. Type or paste RTL text - it will display correctly
5. Mathematical formulas and code remain LTR

## Supported Websites

| Website | Status | Notes |
|---------|--------|-------|
| ChatGPT (chat.openai.com) | ✅ Fully supported | - |
| Deepseek (chat.deepseek.com) | ✅ Fully supported | - |
| Claude (claude.ai) | 🚧 Planned | Coming in v3.0 |
| Perplexity AI | 🚧 Planned | Coming in v3.0 |

*Request a website by [opening an issue](https://github.com/miladniroee/ai-rtl-resolver/issues)*

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v2.0 | Current | Added Deepseek support, improved RTL detection |
| v1.0 | Initial | Basic ChatGPT support |

## Roadmap

- [ ] Add support for Claude AI
- [ ] Add support for Perplexity AI
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

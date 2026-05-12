# Ai RTL Resolver

A browser extension that fixes text direction for Persian, Arabic, and other RTL languages on ChatGPT and Deepseek.

![Extension Screenshot](extension.jpg)

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
> Extension is not available on official stores due to regional restrictions.<br>
> Download the zip file and use `Load Unpacked` option in your browser.

### Chrome / Edge / Brave / Opera

1. Download the latest release: [ai-rtl-resolver-v2.0.zip](https://github.com/miladniroee/ai-rtl-resolver/releases)
2. Extract the zip file to a permanent folder (don't delete this folder)
3. Open your browser and navigate to:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`
   - **Brave**: `brave://extensions/`
   - **Opera**: `opera://extensions/`
4. Enable **Developer mode** (toggle switch in top-right corner)
5. Click **Load unpacked**
6. Select the extracted folder

> [!NOTE]
> The extension will stay installed as long as you don't delete the extracted folder. Don't move or delete it after loading.

### Firefox

> Firefox version is not available on AMO. Use the manual method below.

1. Download the latest release: [ai-rtl-resolver-v2.0.zip](https://github.com/miladniroee/ai-rtl-resolver/releases)
2. Extract the zip file
3. Open Firefox and go to `about:debugging#/runtime/this-firefox`
4. Click **Load Temporary Add-on**
5. Select any file from the extracted folder (e.g., `manifest.json`)

> [!IMPORTANT]
> Firefox temporary add-ons are removed when you restart the browser. For permanent installation, you'll need to [sign the extension](https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/) or use Firefox Developer Edition.

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

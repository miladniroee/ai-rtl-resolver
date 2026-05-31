chrome.runtime.sendMessage({action:`injectFont`});var e=document.createElement(`style`);e.textContent=`
    @font-face {
        font-family: 'Vazirmatn';
        src: url('${chrome.runtime.getURL(`fonts/Vazirmatn-Regular.woff2`)}') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
    }
    
    @font-face {
        font-family: 'Vazirmatn';
        src: url('${chrome.runtime.getURL(`fonts/Vazirmatn-Bold.woff2`)}') format('woff2');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
    }

    .rtl, [dir="rtl"],.vazir {
        font-family: 'Vazirmatn', 'Arial', 'Segoe UI', sans-serif !important;
    }
`,document.head.appendChild(e);
import { WebElements } from './redistributables/units.js';
import { Mint } from './mintkit/mint.js';
import { include } from './mintkit/MintUtils.js';
import page from './styling/mintputs_page.js';

const RECENTS_KEY = 'mintputs_recents';
const FILE_PREFIX = 'mintputs_file_';
const MAX_RECENTS = 10;
let _modalCSSInjected = false;

function mint_getRecents() {
    const saved = localStorage.getItem(RECENTS_KEY);
    return saved ? JSON.parse(saved) : [];
}

function mint_saveRecents(list) {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(list));
}

function mint_addRecent(filename) {
    let recents = mint_getRecents();
    recents = recents.filter(f => f !== filename);
    recents.unshift(filename);
    if (recents.length > MAX_RECENTS) recents = recents.slice(0, MAX_RECENTS);
    mint_saveRecents(recents);
}

function mint_saveFile(filename, content) {
    localStorage.setItem('mintputs_file_' + filename, encodeURIComponent(content));
    mint_addRecent(filename);
}

function mint_loadFile(filename) {
    const raw = localStorage.getItem('mintputs_file_' + filename);
    if (!raw) return '';
    try {
        return decodeURIComponent(raw);
    } catch (e) {
        return raw;
    }
}

function mint_showSaveModal(onSave, onCancel) {
    if (!_modalCSSInjected) {
        include("./styling/save_model/mint_savemodal.css");
        _modalCSSInjected = true;
    }

    let modal = document.getElementById('mintputs-save-modal');
    if (!modal) {
        include("./styling/save_model/model.html");
        modal = document.getElementById('mintputs-save-modal');
    }

    modal.style.display = 'flex';
    const input = document.getElementById('mintputs-save-filename');
    input.value = '';

    let typewriterTimeout;
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let isTyping = false;

    const placeholderTexts = [
        "Enter Your Filename",
        "My Awesome Project",
        "Annual Report 2025",
        "Mintkit documentation",
        "Top Secret Document"
    ];

    function typeWriter() {
        // Stop if focused on input
        if (document.activeElement === input || input.value.trim() !== '') {
            return;
        }

        isTyping = true;
        const fullText = placeholderTexts[currentIndex];
        let typeSpeed = 50;

        if (isDeleting) {
            currentText = fullText.substring(0, currentText.length - 1);
            typeSpeed = 25;
        } else {
            currentText = fullText.substring(0, currentText.length + 1);
            typeSpeed = 50;
        }

        input.placeholder = currentText;

        if (!isDeleting && currentText === fullText) {
            // Wait before starting to delete
            typewriterTimeout = setTimeout(() => {
                isDeleting = true;
                typeWriter();
            }, 2000);
        } else if (isDeleting && currentText === '') {
            // Move to next text
            isDeleting = false;
            currentIndex = (currentIndex + 1) % placeholderTexts.length;
            typewriterTimeout = setTimeout(typeWriter, 500);
        } else {
            // Continue typing/deleting
            typewriterTimeout = setTimeout(typeWriter, typeSpeed);
        }
    }

    function startTypewriter() {
        // Clear any existing timeout
        clearTimeout(typewriterTimeout);

        // Reset state if needed
        if (!isTyping) {
            currentIndex = 0;
            currentText = '';
            isDeleting = false;
        }

        // Only start if input is not focused and empty
        if (document.activeElement !== input && input.value.trim() === '') {
            typeWriter();
        }
    }

    function stopTypewriter() {
        clearTimeout(typewriterTimeout);
        isTyping = false;
    }

    // Event listeners
    input.addEventListener('focus', () => {
        stopTypewriter();
        input.placeholder = "Enter filename...";
    });

    input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
            // Small delay before starting typewriter again
            setTimeout(startTypewriter, 300);
        }
    });

    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            stopTypewriter();
        }
    });

    // Start typewriter effect
    startTypewriter();

    // Focus the input
    setTimeout(() => input.focus(), 100);

    // Button event handlers
    document.getElementById('mintputs-save-cancel').onclick = () => {
        stopTypewriter();
        mint_hideSaveModal();
        if (typeof onCancel === 'function') onCancel();
    };

    document.getElementById('mintputs-save-confirm').onclick = () => {
        const filename = input.value.trim();
        if (!filename) {
            input.classList.add('error');
            setTimeout(() => input.classList.remove('error'), 300);
            input.focus();
            return;
        }
        stopTypewriter();
        mint_hideSaveModal();
        if (typeof onSave === 'function') onSave(filename);
    };

    // Keyboard shortcuts
    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('mintputs-save-confirm').click();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            document.getElementById('mintputs-save-cancel').click();
        }
    };
}

function mint_hideSaveModal() {
    const modal = document.getElementById('mintputs-save-modal');
    if (modal) modal.style.display = 'none';
}

function mint_bindCtrlS(getContent, setCurrentFile, updateRecentsUI) {
    window.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
            e.preventDefault();
            mint_showSaveModal(
                (filename) => {
                    const content = getContent();
                    mint_saveFile(filename, content);
                    if (typeof updateRecentsUI === 'function') updateRecentsUI();
                    if (typeof setCurrentFile === 'function') setCurrentFile(filename);
                },
                () => { }
            );
        }
    });
}

function mint_updateRecentsUI(onClickFile) {
    const recentsDiv = document.querySelector('.RecentsFiles');
    if (!recentsDiv) return;
    recentsDiv.innerHTML = '';
    mint_getRecents().forEach(name => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = 'javascript:void(0)';
        a.textContent = name;
        a.onclick = () => {
            if (typeof onClickFile === 'function') onClickFile(name);
        };
        li.appendChild(a);
        recentsDiv.appendChild(li);
    });
}

const lightThemeColors = {
    ColorPrimary: '#faf9f5;',
    TextColorPrimaryDisplay: '#080707;',
    TextColorPrimaryText: '#333333;',
    HighlightPrimary: '#ffe9e9;',
    FormatTextColors: '#242424',
    FormatBorderColors: '#deddd9',
    PrimaryHeaderText: '#303e35',
    PublicFormatBorderColors: '#b8b6b0',
    btnSecondary: {
        background: "#f4f2ee",
        border: "solid 1px #96948f",
        color: "#000",
    },
    OutputBackground: {
        PrimarySec: "#ecebe7",
        LinksBackground: "rgb(50, 50, 153)",
    },
    SIDEBAR: "#f6f5f3",
    Shadow: {
        Deep: "inset 4px 4px 10px #e4e3df, inset -4px -4px 10px #ffffff, 2px 2px 20px rgba(0, 0, 0, 0.1)",
        hover: "inset 2px 2px 10px #dddcd8, inset -2px -2px 10px #ffffff, 2px 2px 30px #d5d5d5, -2px -2px 30px #ffffff",
        inner: {
            Shadow: "inset 2px 2px 6px #deddd9,inset -8px -8px 12px rgba(255, 255, 255, 1)",
            background: "linear-gradient(180deg, #ffffff, #faf9f5)"
        }
    }
};

const darkThemeColors = {
    ColorPrimary: '#0f0f0f;',
    TextColorPrimaryDisplay: '#faf8f0;',
    TextColorPrimaryText: '#D9D9D9;',
    HighlightPrimary: '#413c3c;',
    FormatTextColors: '#D9D9D9',
    FormatBorderColors: '#202020',
    PrimaryHeaderText: '#dfffeb',
    PublicFormatBorderColors: '#343434',
    btnSecondary: {
        background: "#333",
        border: "solid 1px #545454",
        color: "#a2a2a2",
    },
    OutputBackground: {
        PrimarySec: "#161616",
        LinksBackground: "rgb(108, 108, 243)",
    },
    SIDEBAR: "#0c0c0c",
    Shadow: {
        Deep: "inset 2px 2px 8px #080808, inset -2px -2px 8px #202020, 2px 4px 10px rgba(20, 20, 20, 0.900)",
        hover: "inset 2px 2px 8px #050505, inset -2px -2px 8px #262626, 2px 4px 15px rgba(20, 20, 20, 0.900)",
        inner: {
            Shadow: "inset 2px 2px 8px #080808, inset -2px -2px 8px #1a1a1aff, 2px 4px 10px rgba(20, 20, 20, 0.900)",
            background: "linear-gradient(145deg, #0c0c0c, #161616)"
        }
    }
};

const getPlatformInfo = () => {
    const isElectron = !!window.electronAPI;

    return {
        isElectron: isElectron,
        isMacOS: isElectron && window.electronAPI.platform === 'darwin',
        isWindows: isElectron && window.electronAPI.platform === 'win32',
        inBrowser: !isElectron,
    };
};

const isMacOS = () => {
    return getPlatformInfo().isMacOS;
};

// Check if running in browser
const isBrowserOpening = () => {
    return getPlatformInfo().inBrowser;
};

export const WebContent = {
    _cachedCSS: null,
    PageTitle: 'Mintputs',
    CSScolor: {},
    _themeChangeCallback: null,

    setThemeChangeCallback(callback) {
        this._themeChangeCallback = callback;
    },

    _updateCurrentColors(isDarkMode) {
        const themeToApply = isDarkMode ? darkThemeColors : lightThemeColors;
        Object.keys(themeToApply).forEach(key => {
            this.CSScolor[key] = themeToApply[key];
        });
        this._cachedCSS = null;
    },

    initThemeSystem() {
        if (typeof window !== 'undefined' && window.matchMedia) {
            const darkModeMatcher = window.matchMedia('(prefers-color-scheme: dark)');
            const applyTheme = (isDark) => {
                this._updateCurrentColors(isDark);
                if (typeof this._themeChangeCallback === 'function') this._themeChangeCallback();
            };
            applyTheme(darkModeMatcher.matches);
            darkModeMatcher.addEventListener('change', e => applyTheme(e.matches));
        } else {
            this._updateCurrentColors(true);
        }
    },

    HTMLContent: {
        Name: 'Mintputs',
        Introduce(Name) {
            const DisplayName = Name || this.Name;
            return page.Introduce(Name)
        },
    },

    StaticCSSvalues: {
        CenterPositions: {
            CALL: `${WebElements.Units.CSSPosition[3]}`,
            PositionY: `
                top: 50%;
                transform: translateY(-50%);
            `,
            PositionX: `
                left: 50%;
                transform: translateX(-50%);
            `,
            get CALLPosition() {
                return `
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                `;
            },
        },
        // Interface preset example
        get KeyframeIntroduceAnim() {
            const animationName = 'IntroduceAnimation';
            return `
            @keyframes ${animationName} {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }
        `
        },
        IntroduceAnimationName: 'IntroduceAnimation',
    },

    // Reset ค่าเรื่มต้นเป็น CSS preset styling
    Normalize: {
        CALL: `${WebElements.Units.CSSSize.boxSizing};`,
        Unset: `
            margin: 0;
            padding: 0;
        `,
        get CALLReset() {
            return `
                ${WebElements.Units.CSSSize.boxSizing};
                margin: 0;
                padding: 0;
            `;
        }
    },

    // Force สำหรับการ rendering ข้อความในเเว็บ
    TextRendering: {
        ForceGrayStyleRendering: `
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-smooth: never;
            text-rendering: geometricPrecision;
            -webkit-text-size-adjust: none;
            -moz-text-size-adjust: none;
            text-size-adjust: none;
            font-feature-settings: "kern" 1;
            font-synthesis: none;
        `,
        SpecificTargetingRendering: `
            html, body, h1, h2, h3, h4, h5, h6, p, span, div, a, button, input, textarea, label {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                font-smooth: never;
                text-rendering: geometricPrecision;
            }

            input, textarea, button, select {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                font-smooth: never;
            }
        `,
    },

    ElementComponents() {
        return `
            ${this.HTMLContent.Introduce()}
        `;
    },

    StyledElementComponents() {
        if (this._cachedCSS) return this._cachedCSS;

        const {
            DefaultFontFallback,
            Typeface,
            Units,
            spacing,
            borderRadius,
            shadows,
            transitions,
            weights,
            DirectThemes,
        } = WebElements;

        const normalizeCallReset = `${Units.CSSSize.boxSizing};`;
        const textRenderForce = this.TextRendering.ForceGrayStyleRendering;
        const textRenderSpecific = this.TextRendering.SpecificTargetingRendering;

        const colorPrimary = this.CSScolor.ColorPrimary || '#0F0F0F';
        const textColorPrimaryDisplay = this.CSScolor.TextColorPrimaryDisplay;
        const textColorPrimaryText = this.CSScolor.TextColorPrimaryText;
        const FormatBorderColors = this.CSScolor.FormatBorderColors;
        const FormatTextColors = this.CSScolor.FormatTextColors;
        const PrimaryHeaderText = this.CSScolor.PrimaryHeaderText;
        const PublicFormatBorderColors = this.CSScolor.PublicFormatBorderColors;
        const btnSecondary = this.CSScolor.btnSecondary;
        const OutputBackground = this.CSScolor.OutputBackground;
        const SIDEBAR = this.CSScolor.SIDEBAR;

        const pixel = Units.CSSSize.AbsoluteLengths.StaticPX;
        const percent = Units.CSSSize.RelativeLengths.RelativePERCENT;
        const rem = Units.CSSSize.RelativeLengths.RelativeREM;
        const em = Units.CSSSize.RelativeLengths.RelativeEM;
        const vw = Units.CSSSize.RelativeLengths.RelativeVW;
        const vh = Units.CSSSize.RelativeLengths.RelativeVH;
        const auto = Units.CSSSize.AUTO;
        const absolute = Units.CSSPosition[3];
        const fixed = Units.CSSPosition[2];
        const bold = Units.weights.bold;
        const borderRadiusLg = borderRadius.lg;
        const borderRadiusFull = borderRadius.full;
        const shadowMd = shadows.md;
        const transitionAll = transitions.all;

        // Shadow intregration
        const shadowNew = this.CSScolor.Shadow;

        const GlobalCSS = `
            :root {
                --sidebar-width: 260px;
                --sidebar-width-mobile: 0px;
                --sidebar-width-tablet: 200px;
                --container-padding: ${spacing[4]};
                --container-padding-mobile: ${spacing[2]};
            }

            * {
                ${normalizeCallReset}
                ${textRenderForce}
                font-family: ${Typeface[8]}, ${DefaultFontFallback};
                color: ${FormatTextColors};
                fill: ${FormatTextColors};
                line-height: 1.8;
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            *::-webkit-scrollbar {
                height: 5${pixel};
                width: 5${pixel};
            }
            *::-webkit-scrollbar-track {
                border-radius: 0${pixel};
                background-color: transparent;
            }
            *::-webkit-scrollbar-track:hover {
                background-color: transparent;
            }
            *::-webkit-scrollbar-track:active {
                background-color: transparent;
            }
            *::-webkit-scrollbar-thumb {
                border-radius: 20${pixel};
                background-color: transparent;
            }
            *::-webkit-scrollbar-thumb:hover {
                background-color: #727272;
            }
            *::-webkit-scrollbar-thumb:active {
                background-color: #999999;
            }
            
            body {
                background-color: ${colorPrimary};
                overflow-x: hidden;
            }

            #mobile-menu-toggle {
                display: none;
                position: fixed;
                top: ${spacing[4]};
                left: ${spacing[4]};
                z-index: 9999;
                background: ${colorPrimary};
                border: ${FormatBorderColors} solid 1${pixel};
                border-radius: 6${pixel};
                padding: ${spacing[2]};
                cursor: pointer;
                -webkit-app-region: no-drag;
            }

            #mobile-menu-toggle svg {
                width: 20${pixel};
                height: 20${pixel};
                fill: ${textColorPrimaryDisplay};
            }

            #titlebar {
                width: var(--sidebar-width);
                height: 100${vh};
                background-color: ${SIDEBAR};
                -webkit-app-region: drag;
                user-select: none;
                position: ${fixed};
                z-index: 10;
                border-right: ${FormatBorderColors} solid 1${pixel};
                transition: transform 0.3s ease;
            }

            #titlebar.mobile-hidden {
                transform: translateX(-100%);
            }

            #TitleLinks {
                display: flex;
                align-items: center;
                position: ${fixed};
                top: ${spacing[4]};
                left: 50${percent};
                gap: 16${pixel};
                z-index: 9999;
                transform: translateX(-50${percent});
                flex-wrap: wrap;
                min-width: max-content;
            }

            #TitleLinks li {
                list-style: none;
            }

            #Highlight {
                opacity: 1 !important;
            }

            #TitleLinks li a {
                color: ${textColorPrimaryDisplay};
                padding: ${spacing[3]} ${spacing[4]};
                font-size: 14${pixel};
                opacity: 0.6;
                -webkit-app-region: no-drag;
                text-decoration: none;
                transition: ${transitionAll};
            }

            #TitleLinks li a:hover {
                opacity: 1;
            }

            .TitleSubLinks,
            .TitlePrimaryLinks {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: fit-content;
                border: ${FormatBorderColors} solid 1${pixel};
                height: 40${pixel};
                background-color: ${colorPrimary};
                -webkit-app-region: drag;
                border-radius: ${borderRadiusFull};
                box-shadow: ${shadowNew.inner.Shadow};
                background: ${shadowNew.inner.background};
            }
                
            .TitlePrimaryLinks {
                overflow: hidden;
                position: relative;
            }

            #drag-region {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 88${percent};
                gap: 8${pixel};
                position: ${absolute};
                left: ${spacing[4]};
                top: ${spacing[3.5]};
                margin-top: ${(() => {
                if (isBrowserOpening()) {
                    return '0';
                } else if (isMacOS()) {
                    return spacing[4];
                } else {
                    return '0';
                }
            })()};
            }

            #SBCloseButtons {
                fill: #fff;
                opacity: 0;
            }

            #icon {
                width: 70${pixel};
                height: ${auto};
                -webkit-app-region: no-drag;
                margin-top: ${(() => {
                if (isBrowserOpening()) {
                    return '0';
                } else if (isMacOS()) {
                    return spacing[4];
                } else {
                    return '0';
                }
            })()};
            }

            #icon, #icon path, #icon rect {
                fill: #fff;
            }

            #TitlebarLinks {
                display: flex;
                flex-direction: column;
                margin-top: ${spacing[14]};
                padding: 0 ${spacing[4]};
            }

            #TitlebarLinks li {
                list-style: none;
            }

            #TitlebarLinks li a {
                text-decoration: none;
                padding: ${spacing[1]} ${spacing[0]};
                padding-bottom: ${spacing[1]};
                font-size: 14${pixel};
                font-weight: 500;
                letter-spacing: -0.3${pixel};
                display: block;
                opacity: 0.8;
            }

            #TitlebarLinks li a svg {
                width: 20${pixel};
                height: 20${pixel};
                margin-right: ${spacing[1.5]};
                transform: translateY(3${pixel});
            }

            #TitlebarLinks span {
                padding: ${spacing[3]} ${spacing[0.5]};
                font-size: 14${pixel};
                opacity: 60${percent};
            }

            #CurrentFiles {
                padding: ${spacing[1]} ${spacing[3]} !important;
                background-color: ${OutputBackground.PrimarySec};
                display: block;
                border-radius: ${borderRadiusLg};
                outline: ${FormatBorderColors} solid 1${pixel};
                transition: ${transitionAll};
                box-shadow: ${shadowNew.Deep};
            }

            #CurrentFiles:hover {
                box-shadow: ${shadowNew.hover};
            }

            .RecentsFiles {
                margin-top: ${spacing[3]};
            }

            .container {
                overflow: hidden;
                backdrop-filter: blur(10${pixel});
                height: 100${vh};
                width: calc(100${vw} - var(--sidebar-width));
                position: ${fixed};
                left: var(--sidebar-width);
                transition: all 0.3s ease;
            }

            .main-content {
                display: flex;
                margin: auto;
                height: 100${vh};
                position: ${Units.CSSPosition[1]};
                right: -15${pixel};
            }

            .input-section, .output-section {
                display: flex;
                flex-direction: column;
                padding: var(--container-padding);
                width: 100${percent};
            }

            .output-section {
                position: fixed;
                top: 20px;
                right: -30px;
                width: calc(100vw - var(--sidebar-width));
                height: 100vh;
                background-color: ${colorPrimary};
                z-index: 5;
                display: none;
                flex-direction: column;
            }

            #html-output {
                flex: 1;
                overflow-y: auto;
                width: 100%;
                max-width: 850px;
                margin: auto;
                height: 100%;
                padding: 24${pixel} 32${pixel};
                /* background: ${OutputBackground.PrimarySec}; */
                border-radius: 8${pixel};
                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            }

            #markdown-input {
                flex: 1;
                font-size: 14${pixel};
                line-height: 1.6;
                resize: none;
                outline: none;
                border: none;
                transition: all 0.3s ease;
                background-color: transparent;
                color: ${FormatTextColors};
                font-weight: 480;
            }

            .controls {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                position: ${fixed};
                bottom: 0;
                right: 0;
                width: calc(100${vw} - var(--sidebar-width));
                height: 60${pixel};
                margin: auto;
                background: transparent;
                z-index: 6;
            }

            .controlsContent {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100${vw};
                flex-direction: column;
                gap: ${spacing[2]};
                padding: ${spacing[2]};
            }

            .stats {
                display: flex;
                gap: 18.5${pixel};
                font-size: 13.5${pixel};
                color: #A2A2A2;
                font-family: ${Typeface[0]},${DefaultFontFallback};
                flex-wrap: wrap;
            }

            pre {
                background: ${OutputBackground.PrimarySec};
                border-radius: 6${pixel};
                padding: ${spacing[2]} ${spacing[4]};
                overflow-x: auto;
                margin: 10${pixel} 0;
                border: 1${pixel} solid ${PublicFormatBorderColors};
            }

            pre code {
                background: none;
                padding: 0;
                border-radius: 0;
                font-family: ${Typeface[9]};
                color: ${textColorPrimaryText};
            }

            .input-section, #markdown-input-container {
                position: ${fixed} !important;
                inset: 0 !important;
                width: 100% !important;
                height: calc(100${vh} - 40${pixel}) !important;
                min-height: calc(100${vh} - 40${pixel}) !important;
                max-width: 100${vw} !important;
                max-height: calc(100${vh} - 40${pixel}) !important;
                margin: 0 !important;
                padding: 0 !important;
                z-index: 10;
                background: transparent !important;
                overflow: auto !important;
                bottom: 0 !important;
            }

            #markdown-input-container {
                margin-right: 0 !important;
                margin-bottom: 0 !important;
                margin-left: 0 !important;
                padding: 0 !important;
            }

            .CodeMirror-code {
                margin-top: 80${pixel} !important;
            }

            .CodeMirror-scroll, .CodeMirror-sizer {
                height: calc(100${vh} - 40${pixel}) !important;
                min-height: calc(100${vh} - 40${pixel}) !important;
                max-height: calc(100${vh} - 40${pixel}) !important;
                margin-left:   0${rem} !important;
                margin-right:  0${rem} !important;
                margin-top:    0${rem} !important;
                margin-bottom: 0${rem} !important;
                bottom: 0 !important;
            }

            .CodeMirror-sizer{
                margin-left: 55${pixel} !important;
            }

            .CodeMirror-gutters, .CodeMirror-gutter {
                height: calc(100${vh} - 40${pixel}) !important;
                min-height: calc(100${vh} - 40${pixel}) !important;
                max-height: calc(100${vh} - 40${pixel}) !important;
                background: transparent !important;
                bottom: 0 !important;
                border-right: none !important;
                border-left: none !important;
            }

            .CodeMirror-linenumber {   
                display: none !important;
            }
            .cm-s-monokai.CodeMirror {
                background: transparent !important;
            }

            .CodeMirror, .CodeMirror-gutters, .CodeMirror-code, .CodeMirror pre, .CodeMirror-line, .CodeMirror-line span {
                font-family: "JetBrains Mono", "Anuphan", sans-serif !important;
            }

            .CodeMirror-code .cm-tab {
                position: relative;
            }
                
            .CodeMirror-code .cm-tab:before {
                content: "";
                position: ${absolute};
                left: 0;
                top: 0;
                bottom: 0;
                border-left: 1${pixel} solid #e0e0e0;
                opacity: 0.5;
            }
        
            /* Keep because using by mintkit styling */
            .cm-command {
                background-color: rgba(107, 127, 95, 0.2);
                color: #8B9D83;
                transition: background 0.2s;
                padding: ${spacing[1]} ${spacing[3]};
                display: inline-block;
                vertical-align: middle;
                line-height: 1.4;
                border-left: 3px solid #6B7F5F;
                padding-left: 12${pixel}
            }

            .CodeMirror-line.has-command::after {
                content: '';
                display: block;
                height: 8${pixel};
            }

            #TemplatesDropdownBar {
                position: relative;
            }

            #ToggleDropdownPreset {
                padding: ${spacing[1.5]} ${spacing[0]};
                border: none;
                cursor: pointer;
                transition: ${transitionAll};
                background: transparent;
                font-size: 14${pixel};
                font-weight: 500;
                letter-spacing: -0.5${pixel};
                opacity: 0.8;
            }

            #ToggleDropdownPreset svg {
                width: 20${pixel};
                height: 20${pixel};
                margin-right: ${spacing[1.5]};
                transform: translateY(4${pixel});
            }
            
            #DropdownPresetMenu {
                display: block;
                position: ${absolute};
                left: 12${pixel};
                top: 130${pixel};
                background-color: ${colorPrimary};
                border: ${FormatBorderColors} solid 1${pixel};
                border-radius: 6${pixel};
                min-width: 230${pixel};
                height: 100${pixel};
                z-index: 100;
                padding: 4${pixel} 0;
                overflow: hidden;
                opacity: 0;
                pointer-events: none;
                transition: ${transitionAll};
                -webkit-app-region: no-drag;
            }

            #DropdownPresetMenu hr {
                width: 88${percent};
                margin-top: 0.2${rem};
                margin-bottom: 0.6${rem};
                margin-left: auto;
                margin-right: auto;
                opacity: 10${percent};
            }

            #DropdownPresetMenu span {
                padding: 14${pixel} 16${pixel};
                font-size: 12${pixel};
                opacity: 60${percent};
            }
                
            #DropdownPresetMenu.open {
                height: 205${pixel};
                opacity: 1;
                pointer-events: auto;
            }

            .dropdown-template-btn {
                display: block;
                width: 95${percent};
                margin: auto;
                margin-bottom: 0.15${rem};
                text-align: left;
                padding: 5${pixel} 10${pixel};
                border: none;
                background: none;
                cursor: pointer;
                font-size: 14.5${pixel};
                color: ${textColorPrimaryDisplay};
                opacity: 80${percent};
                border-radius: 8${pixel};
                transition: background 0.15s, color 0.15s;
                -webkit-app-region: no-drag;
            }
            .dropdown-template-btn:hover, .dropdown-template-btn:focus {
                background: ${btnSecondary.background};
            }
            .dropdown-template-btn:active {
                background: transparent;
            }
            
            @media (min-width: 1200${pixel}) {
                :root {
                    --sidebar-width: 250${pixel};
                }
                
                #html-output {
                    max-width: 1000${pixel};
                    padding: 32${pixel} 40${pixel};
                }
            }

            @media (max-width: 768${pixel}) {
                :root {
                    --sidebar-width: var(--sidebar-width-tablet);
                    --container-padding: ${spacing[3]};
                }

                #TitleLinks {
                    gap: 12${pixel};
                    top: ${spacing[4]};
                    min-width: max-content;
                }

                .TitleSubLinks, .TitlePrimaryLinks {
                    height: 40${pixel};
                }

                .stats {
                    gap: 12${pixel};
                    font-size: 12${pixel};
                }

                .controls {
                    height: auto;
                    min-height: 40${pixel};
                }

                #html-output {
                    padding: 16${pixel} 20${pixel};
                    max-width: none;
                    margin: 0;
                }

                .CodeMirror-sizer {
                    margin-left: 50${pixel} !important;
                }

                #DropdownPresetMenu {
                    min-width: 200${pixel};
                    left: ${spacing[2]};
                }
            }

            @media (max-width: 600px) {
                :root {
                    --sidebar-width: var(--sidebar-width-mobile);
                    --container-padding: var(--container-padding-mobile);
                }

                #mobile-menu-toggle {
                    display: block;
                }

                #titlebar {
                    width: 280${pixel};
                    transform: translateX(-100%);
                }

                #titlebar.mobile-show {
                    transform: translateX(0);
                }

                .container {
                    width: 100${vw};
                    left: 0;
                    background: ${colorPrimary} !important;
                }

                .output-section {
                    width: 100${vw};
                    right: 0;
                }

                .controls {
                    display: none;
                }

                .TitleSubLinks,
                .TitlePrimaryLinks {
                    height: 42${pixel};
                }

                .stats {
                    justify-content: center;
                    gap: 8${pixel};
                    font-size: 14${pixel};
                }

                #html-output {
                    padding: 12${pixel} 16${pixel};
                }

                .CodeMirror-code {
                    margin-top: 10${pixel} !important;
                }

                .CodeMirror-sizer {
                    margin-left: 55${pixel} !important;
                    margin-top: 24${pixel} !important;
                    background: ${colorPrimary} !important;
                }

                .CodeMirror-scroll {
                    background: ${colorPrimary} !important;
                }

                #markdown-input {
                    font-size: 13${pixel};
                }

                #DropdownPresetMenu {
                    min-width: 180${pixel};
                    left: ${spacing[1]};
                    top: 110${pixel};
                }

                .dropdown-template-btn {
                    font-size: 13${pixel};
                    padding: 4${pixel} 8${pixel};
                }

                #TitleLinks {
                    top: auto;
                    bottom: 25px;
                    align-items: end;
                    height: fit-content;
                    margin: 0;
                }

            }

            @media (max-width: 420px) {
                #TitleLinks li a {
                    padding: ${spacing[2]} ${spacing[3]};
                    letter-spacing: 0.3px;
                    font-size: 14${pixel};
                }
            }

            @media (max-width: 380px) {
                #TitleLinks li a {
                    padding: 1vw 4vw;
                    font-size: 12${pixel};
                }
                #TitleLinks {
                    bottom: 20px;
                }
            }

            @media (max-width: 320px) {
                :root {
                    --container-padding-mobile: ${spacing[1]};
                }

                #TitleLinks li a {
                    padding: ${spacing[0.5]} ${spacing[1]};
                    font-size: 11${pixel};
                }

                .stats {
                    font-size: 10${pixel};
                    gap: 6${pixel};
                }

                #html-output {
                    padding: 8${pixel} 12${pixel};
                }

                #markdown-input {
                    font-size: 12${pixel};
                }
            }

            @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
                * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
            }

            /* Dark Theme Media Query */
            @media ${DirectThemes[1]} {
                #icon {
                    filter: invert(100${percent});
                }
            }

            @media ${DirectThemes[0]} {
                .TitleSubLinks,
                .TitlePrimaryLinks {
                    box-shadow: ${shadowNew.inner.Shadow};
                    background: ${shadowNew.inner.background};
                }
            }

            @media print {
                #titlebar,
                .controls,
                #mobile-menu-toggle,
                #DropdownPresetMenu {
                    display: none !important;
                }

                .container {
                    position: static;
                    width: 100% !important;
                    left: 0 !important;
                    height: auto !important;
                }

                #html-output {
                    box-shadow: none;
                    border: 1${pixel} solid #ccc;
                    max-width: none;
                    margin: 0;
                }
            }

            /* Reduced Motion */
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }

            ${textRenderSpecific};
        `;
        // Mintputs/Output
        const htmlOutputModernCSS = `
            @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=Anuphan:wght@400;600;700&display=swap');

            #html-output {
                --text: #000;
                --background: #faf9f5;
                --muted: #666;
                --border: #a7a6a3;
                --code-bg: #eae9e5;
                --heading-border: #a7a6a3;
                --Links: rgb(50, 50, 153);

                font-family: 'Inter Tight', 'Anuphan', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 900px;
                margin: 0 auto;
                padding: 2.5rem;
                line-height: 1.75;
                color: var(--text);
                background-color: var(--background);
                animation: fadeIn 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
                height: 100%;
                overflow-y: auto;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            }

            @media (prefers-color-scheme: dark) {
                #html-output {
                    --text: #f4f4f4;
                    --background: #141414;
                    --muted: #999;
                    --border: #343434;
                    --code-bg: #1f1f1f;
                    --heading-border: #333;
                    --Links: rgb(108, 108, 243);
                }
            }

            #html-output p {
                margin: 0 0 1.5rem;
            }

            #html-output h1, #html-output h2, #html-output h3, #html-output h4, #html-output h5, #html-output h6 {
                margin-top: 32px;
                margin-bottom: 16px;
                font-weight: 550;
                line-height: 1.25; 
                letter-spacing: -1px;
            }

            #html-output h1 {
                font-size: 42px;
                border-bottom: 1px solid var(--heading-border);
                padding-bottom: 10px;
            }

            #html-output h2 {
                font-size: 36px;
                border-bottom: 1px solid var(--heading-border);
                padding-bottom: 8px;
            }

            #html-output h3 { font-size: 1.7em; }
            #html-output h4 { font-size: 1.425em; }
            #html-output h5 { font-size: 1.245em; }
            #html-output h6 { font-size: 1em; }

            #html-output a {
                color: var(--Links);
                text-decoration: underline;
                transition: color 0.2s ease;
            }

            #html-output a:hover, #html-output a:focus {
                color: var(--muted);
            }

            #html-output code {
                background: var(--code-bg);
                padding: 2px 4px;
                border-radius: 3px;
                font-family: Consolas, Menlo, Monaco, "Courier New", monospace;
                font-size: 0.95em;
            }

            #html-output pre {
                background: var(--code-bg);
                padding: 16px;
                border-radius: 6px;
                overflow-x: auto;
                margin: 0 0 1.5rem;
            }

            #html-output pre code {
                background: none;
                padding: 0;
                border-radius: 0;
                font-size: 0.95em;
                color: inherit;
            }

            #html-output blockquote {
                border-left: 4px solid var(--border);
                margin: 0 0 1.5rem;
                padding-left: 16px;
                color: var(--muted);
                font-style: italic;
            }

            #html-output ul, #html-output ol {
                margin-left: 2rem;
                margin-right: 0rem;
                margin-top: 2rem;
                margin-bottom: 2rem;
                padding: 0;
            }

            #html-output li {
                margin-bottom: 0.5rem;
            }

            #html-output li > ul, #html-output li > ol {
                margin-top: 0.5rem;
            }

            #html-output hr {
                border: none;
                border-top: 1px solid var(--border);
                margin: 2rem 0;
            }

            #html-output table {
                border-collapse: collapse;
                width: 100%;
                margin-bottom: 1.5rem;
            }

            #html-output th, #html-output td {
                border: 1px solid var(--border);
                padding: 8px 12px;
                text-align: left;
            }

            #html-output th {
                background: var(--code-bg);
                font-weight: 600;
            }

            #html-output img {
                max-width: 100%;
                height: auto;
                display: block;
                margin: 1rem auto;
            }

            @media (max-width: 640px) {
                #html-output {
                    padding: 1.5rem;
                }
            }

            @keyframes fadeIn {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }
        `;
        this._cachedCSS = GlobalCSS + htmlOutputModernCSS;
        return this._cachedCSS;
    },
};

// MintputsStorage * UI
function getContent() {
    if (window.editor && typeof window.editor.getValue === 'function') {
        const value = window.editor.getValue();
        return value;
    }
    const textarea = document.getElementById('markdown-input');
    const value = textarea ? textarea.value : '';
    return value;
}

function setCurrentFile(filename) {
    const currentFile = document.getElementById('CurrentFiles');
    if (currentFile) currentFile.textContent = filename;
}

function updateRecentsUI() {
    let recents = mint_getRecents();
    const recentsDiv = document.querySelector('.RecentsFiles');
    if (!recentsDiv) return;
    recentsDiv.innerHTML = '';
    recents.forEach(name => {
        if (!name) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = 'javascript:void(0)';
        a.textContent = name;
        a.onclick = () => {
            const content = mint_loadFile(name);
            const textarea = document.getElementById('markdown-input');
            if (window.editor && typeof window.editor.setValue === 'function') {
                window.editor.setValue(content);
                setCurrentFile(name);
                window.editor.focus();
            } else if (textarea) {
                textarea.value = content;
                setCurrentFile(name);
                textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                textarea.focus();
            } else {
                // console.warn('[DEBUG] Did not set editor or textarea. content:', content);
            }
        };
        li.appendChild(a);
        recentsDiv.appendChild(li);
    });
    // console.log('[DEBUG] RecentsFiles innerHTML:', recentsDiv.innerHTML);
}
window.updateRecentsUI = updateRecentsUI;

function setupAutoSaveReminder() {
    let reminderShown = false;
    let timerStarted = false;
    const REMINDER_DELAY = 5 * 60 * 1000;;

    const onEditorChange = (cm, change) => {
        const userOrigins = ['+input', '+delete', 'paste', 'cut', 'drag'];
        const isUserInput = change && change.origin && userOrigins.includes(change.origin);
        
        if (!isUserInput) return;

        if (reminderShown || timerStarted) return;

        timerStarted = true;
        setTimeout(() => {
            if (reminderShown) return;
            reminderShown = true;
            
            if (typeof mint_showSaveModal === 'function') {
                mint_showSaveModal(
                    (filename) => {
                        const content = getContent();
                        mint_saveFile(filename, content);
                        updateRecentsUI();
                        setCurrentFile(filename);
                    },
                    () => {}
                );
            } else {
                console.error('mint_showSaveModal is not available');
            }
        }, REMINDER_DELAY);
    };

    const checkEditorAndBind = () => {
        if (window.editor && typeof window.editor.on === 'function') {
            window.editor.on('change', onEditorChange);
            console.log('Auto save reminder setup complete');
        } else {
            setTimeout(checkEditorAndBind, 500);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkEditorAndBind);
    } else {
        checkEditorAndBind();
    }
}

function observeRecentsDivAndUpdate() {
    const targetSelector = '.RecentsFiles';
    const found = document.querySelector(targetSelector);
    if (found) {
        updateRecentsUI();
        return;
    }
    const observer = new MutationObserver(() => {
        const recentsDiv = document.querySelector(targetSelector);
        if (recentsDiv) {
            updateRecentsUI();
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        observeRecentsDivAndUpdate();
        setupAutoSaveReminder();
    });
}

// Clean localStorage
function cleanLocalStorageForMintputs() {
    const recents = mint_getRecents();
    let cleaned = false;
    recents.forEach(name => {
        const key = FILE_PREFIX + name;
        const raw = localStorage.getItem(key);
        if (raw && /<textarea|<div|<span|<p|<br|<script|<style/i.test(raw)) {
            localStorage.removeItem(key);
            cleaned = true;
        }
    });
    if (cleaned) {
        const newRecents = mint_getRecents().filter(name => {
            return !!localStorage.getItem(FILE_PREFIX + name);
        });
        mint_saveRecents(newRecents);
        updateRecentsUI();
    }
}
window.cleanLocalStorageForMintputs = cleanLocalStorageForMintputs;

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        cleanLocalStorageForMintputs();
        const recents = mint_getRecents();
        // console.log('Startup recents:', recents);
        if (recents.length > 0) {
            const firstFile = recents[0];
            const key = FILE_PREFIX + firstFile;
            const raw = localStorage.getItem(key);
            let decoded = '';
            if (raw) {
                try {
                    decoded = decodeURIComponent(raw);
                } catch (e) {
                    decoded = raw;
                }
            }
            // console.log('Trying to load:', key, 'raw:', raw, 'decoded:', decoded);
            const textarea = document.getElementById('markdown-input');
            if (window.editor && typeof window.editor.setValue === 'function') {
                window.editor.setValue(decoded);
                setCurrentFile(firstFile);
                window.editor.focus();
            } else if (textarea) {
                textarea.value = decoded;
                setCurrentFile(firstFile);
                textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                textarea.focus();
            } else {
                // console.warn('[DEBUG] Did not set editor or textarea. content:', content);
            }
        }
        updateRecentsUI();
    });
}

if (typeof window !== 'undefined') {
    mint_bindCtrlS(getContent, setCurrentFile, updateRecentsUI);
}

/**
 * @function clear
 * @desc 
 */

function clearAllRecentFiles() {
    localStorage.removeItem('mintputs_recents');
    const recents = mint_getRecents();
    recents.forEach(name => {
        if (name) localStorage.removeItem('mintputs_file_' + name);
    });
    updateRecentsUI();
}

if (typeof window !== 'undefined') {
    window.clearAllRecentFiles = clearAllRecentFiles;
}

function resetStr() {
    localStorage.removeItem('mintputs_recents');
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('mintputs_file_')) {
            localStorage.removeItem(key);
        }
    });
    updateRecentsUI();
}
if (typeof window !== 'undefined') {
    window.resetStr = resetStr;
}

WebContent.initThemeSystem();
import { WebElements } from './redistributables/units.js';
import { Mint } from './mintkit/mint.js';

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
    // console.log('[DEBUG] Saving file:', filename, '| content:', content, '| typeof:', typeof content, '| length:', content ? content.length : 0);
    localStorage.setItem('mintputs_file_' + filename, encodeURIComponent(content));
    mint_addRecent(filename);
    // console.log('[DEBUG] Saved file:', filename, 'content:', content);
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
        Mint.injectCSS(`
            #mintputs-save-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            .mintputs-modal-backdrop {
                position: absolute;
                left: 0;
                top: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.18);
                z-index: 0;
            }
            .mintputs-modal-content {
                position: relative;
                z-index: 1;
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 4px 32px rgba(0,0,0,0.13);
                padding: 2.2em 2.5em 1.5em 2.5em;
                min-width: 320px;
                max-width: 90vw;
                min-height: 120px;
                display: flex;
                flex-direction: column;
                align-items: stretch;
            }
            .mintputs-modal-content h2 {
                margin-top: 0;
            }
            #mintputs-save-filename {
                width: 100%;
                padding: 8px;
                font-size: 1.1em;
                margin-bottom: 1em;
                border-radius: 6px;
                border: 1px solid #ccc;
            }
            .mintputs-modal-content button {
                padding: 8px 18px;
                border-radius: 6px;
                border: none;
                cursor: pointer;
            }
            #mintputs-save-cancel {
                background: #eee;
            }
            #mintputs-save-confirm {
                background: #2d8cff;
                color: #fff;
            }
            @media (prefers-color-scheme: dark) {
                .mintputs-modal-content {
                    background: #232323;
                    color: #fafafa;
                }
            }
        `);
        _modalCSSInjected = true;
    }
    let modal = document.getElementById('mintputs-save-modal');
    if (!modal) {
        Mint.injectHTML('body', `
            <div id="mintputs-save-modal">
                <div class="mintputs-modal-backdrop"></div>
                <div class="mintputs-modal-content">
                    <h2>บันทึกไฟล์</h2>
                    <input id="mintputs-save-filename" type="text" placeholder="Files name" autofocus />
                    <div style="display:flex;gap:1em;justify-content:flex-end;">
                        <button id="mintputs-save-cancel">Cancel</button>
                        <button id="mintputs-save-confirm">Save</button>
                    </div>
                </div>
            </div>
        ` + document.body.innerHTML);
        modal = document.getElementById('mintputs-save-modal');
    }
    modal.style.display = 'flex';
    const input = document.getElementById('mintputs-save-filename');
    input.value = '';
    input.focus();
    document.getElementById('mintputs-save-cancel').onclick = () => {
        mint_hideSaveModal();
        if (typeof onCancel === 'function') onCancel();
    };
    document.getElementById('mintputs-save-confirm').onclick = () => {
        const filename = input.value.trim();
        if (!filename) {
            input.focus();
            return;
        }
        mint_hideSaveModal();
        if (typeof onSave === 'function') onSave(filename);
    };
    input.onkeydown = (e) => {
        if (e.key === 'Enter') document.getElementById('mintputs-save-confirm').click();
        if (e.key === 'Escape') document.getElementById('mintputs-save-cancel').click();
    };
}

function mint_hideSaveModal() {
    const modal = document.getElementById('mintputs-save-modal');
    if (modal) modal.style.display = 'none';
}

function mint_bindCtrlS(getContent, setCurrentFile, updateRecentsUI) {
    window.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
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
    ColorPrimary: '#faf8f0;',
    TextColorPrimaryDisplay: '#080707;',
    TextColorPrimaryText: '#333333;',
    HighlightPrimary: '#ffe9e9;',
    FormatTextColors: '#242424',
    FormatBorderColors: '#cfcec7',
    PrimaryHeaderText: '#303e35',
    PublicFormatBorderColors: '#b8b6b0',
    btnSecondary: {
        background: "#f4f1e6",
        border: "solid 1px #96948f",
        color: "#000",
    },
    OutputBackground: {
        PrimarySec: "#f4f1e6",
        LinksBackground: "rgb(50, 50, 153)",
    },
    SIDEBAR: "#ffffff",
};

const darkThemeColors = {
    ColorPrimary: '#141414;',
    TextColorPrimaryDisplay: '#faf8f0;',
    TextColorPrimaryText: '#D9D9D9;',
    HighlightPrimary: '#413c3c;',
    FormatTextColors: '#D9D9D9',
    FormatBorderColors: '#262626',
    PrimaryHeaderText: '#dfffeb',
    PublicFormatBorderColors: '#343434',
    btnSecondary: {
        background: "#333",
        border: "solid 1px #545454",
        color: "#a2a2a2",
    },
    OutputBackground: {
        PrimarySec: "#1e1e1e",
        LinksBackground: "rgb(108, 108, 243)",
    },
    SIDEBAR: "#0c0c0c",
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
    PageTitle: 'Markdown Parser',
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
            return `

                <div id="TitleLinks">
                    <li><a id="Highlight" data-base-id="ToggleMDEditer" href="javascript:void(0)">Markdown Editer</a></li>
                    <li><a id="ToggleHTMLOUTPUT" data-base-id="ToggleHTMLOUTPUT" href="javascript:void(0)">HTML Output</a></li>
                </div>


                <div id="titlebar">
                    <div id="drag-region">
                        <svg width="892" height="210" viewBox="0 0 892 210" fill="none" xmlns="http://www.w3.org/2000/svg" id="icon">
                            <path d="M794 132.467H821.863C822.103 142.764 829.789 149.23 843.24 149.23C856.931 149.23 864.377 143.722 864.377 135.102C864.377 129.115 861.255 124.805 850.686 122.41L829.309 117.381C807.931 112.592 797.603 102.534 797.603 83.6169C797.603 60.3889 817.299 46.5 844.681 46.5C871.343 46.5 889.358 61.8257 889.598 84.8142H861.735C861.495 74.7567 854.77 68.2912 843.48 68.2912C831.951 68.2912 825.225 73.5594 825.225 82.4195C825.225 89.1245 830.51 93.4349 840.598 95.8295L861.975 100.858C881.912 105.408 892 114.508 892 132.707C892 156.653 871.583 171.5 842.279 171.5C812.735 171.5 794 155.695 794 132.467Z" fill="black"/>
                            <path d="M36 168.5H1V1H44L84 97.5L122 1H165V168.5H131V57H129.5L91 168.5H73.5L37.5 57H36V168.5Z" fill="black" stroke="black"/>
                            <path d="M408.344 4V21V44.5L395.5 51.5C400.95 51.5 408.344 51.5 408.344 51.5H439.5V77.3889H408.344V138.5C408.344 141.352 409.781 142.778 412.656 142.778L433.5 143.267V171.5H404.75C400.917 171.5 397.467 171.12 394.4 170.359C391.333 169.599 388.65 168.458 386.35 166.937C384.05 165.606 382.133 163.752 380.6 161.376C379.067 158.999 377.917 156.385 377.15 153.533C376.383 150.491 376 147.069 376 143.267V77.3889H354V51.5H376V4H408.344Z" fill="black"/>
                            <path d="M754.344 4V21V44.5L741.5 51.5C746.95 51.5 754.344 51.5 754.344 51.5H785.5V77.3889H754.344V138.5C754.344 141.352 755.781 142.778 758.656 142.778L779.5 143.267V171.5H750.75C746.917 171.5 743.467 171.12 740.4 170.359C737.333 169.599 734.65 168.458 732.35 166.937C730.05 165.606 728.133 163.752 726.6 161.376C725.067 158.999 723.917 156.385 723.15 153.533C722.383 150.491 722 147.069 722 143.267V77.3889H700V51.5H722V4H754.344Z" fill="black"/>
                            <path d="M217.5 52H184.5V168.5H217.5V52Z" fill="black"/>
                            <path d="M217.5 33H184.5V5H217.5V33Z" fill="black"/>
                            <path d="M268 168.5H235.5V52H268V72.5C268 65.3333 285.5 48.7215 307.5 49C341.5 49.4304 348.5 80 349.5 87V168.5H316.5V97.5C315 90.3333 308.4 76 294 76C279.6 76 270.667 90.3333 268 97.5V168.5Z" fill="black"/>
                            <path d="M217.5 52H184.5V168.5H217.5V52Z" stroke="black"/>
                            <path d="M217.5 33H184.5V5H217.5V33Z" stroke="black"/>
                            <path d="M268 168.5H235.5V52H268V72.5C268 65.3333 285.5 48.7215 307.5 49C341.5 49.4304 348.5 80 349.5 87V168.5H316.5V97.5C315 90.3333 308.4 76 294 76C279.6 76 270.667 90.3333 268 97.5V168.5Z" stroke="black"/>
                            <path d="M622.111 172C613.168 172 605.811 168.768 599.608 165.304C593.405 161.839 588.717 156.715 585.544 149.931C582.515 143.003 581 134.631 581 124.816V52.5H612.807V116.372C612.807 122.434 613.528 127.558 614.971 131.744C616.558 135.93 618.938 139.178 622.111 141.487C625.429 143.652 629.684 144.735 634.877 144.735C640.214 144.735 644.758 143.436 648.509 140.838C652.259 138.239 655.144 134.847 657.164 130.661C659.183 126.331 660.193 121.64 660.193 116.588V52.5H692V168.551H660.193V147.333C657.452 154.839 651.25 160.613 644.614 164.654C638.123 168.551 630.478 172 622.111 172Z" fill="black"/>
                            <path d="M513 171C506.321 171 500.082 169.984 494.282 167.951C488.482 165.829 483.297 163.001 478.727 159.465C473.982 155.93 469.808 151.775 466.205 147.002C462.689 142.229 459.921 136.661 457.9 130.297C455.967 124.463 455 118.231 455 111.602C455 105.238 455.967 99.0951 457.9 93.173C459.833 87.2509 462.558 81.8592 466.073 76.9978C469.764 71.9595 474.026 67.6727 478.859 64.1371C483.78 60.6015 489.009 57.9056 494.545 56.0494C497.445 55.0772 500.433 54.3258 503.509 53.7955C506.585 53.2652 509.748 53 513 53C519.239 53 525.303 54.0165 531.191 56.0494C537.167 58.0824 542.527 60.8225 547.273 64.2697C551.93 67.8052 556.061 72.0479 559.664 76.9978C563.355 81.8592 566.167 87.2509 568.1 93.173C568.979 96.0899 569.682 99.0951 570.209 102.189C570.736 105.282 571 108.42 571 111.602C571 116.906 570.165 122.607 568.495 128.706C566.914 134.804 564.014 140.815 559.795 146.737C556.28 151.687 552.062 155.974 547.141 159.598C542.22 163.222 536.947 166.006 531.323 167.951C528.423 168.923 525.435 169.674 522.359 170.204C519.283 170.735 516.164 171 513 171ZM513.132 142.494C516.032 142.494 518.932 142.008 521.832 141.036C524.82 140.064 527.456 138.605 529.741 136.661C532.641 134.363 534.882 131.888 536.464 129.236C538.133 126.496 539.276 123.977 539.891 121.679C540.33 120.176 540.682 118.629 540.945 117.038C541.209 115.359 541.341 113.679 541.341 112C541.341 108.553 540.858 105.327 539.891 102.321C538.924 99.2277 537.606 96.3992 535.936 93.836C534.442 91.7146 532.553 89.6816 530.268 87.7371C527.983 85.7041 525.215 84.1131 521.964 82.964C519.064 81.9918 516.12 81.5056 513.132 81.5056C506.805 81.5056 501.224 83.406 496.391 87.2067C494.106 88.9745 492.041 91.1843 490.195 93.836C488.35 96.3992 486.988 99.1835 486.109 102.189C485.67 103.691 485.318 105.282 485.055 106.962C484.791 108.641 484.659 110.321 484.659 112C484.659 114.74 485.055 117.657 485.845 120.751C486.636 123.844 488.086 126.938 490.195 130.031C491.865 132.506 493.842 134.672 496.127 136.528C498.412 138.384 501.092 139.843 504.168 140.903C507.068 141.964 510.056 142.494 513.132 142.494Z" fill="black"/>
                            <rect x="452" y="52" width="33" height="158" fill="black"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" id="SBCloseButtons"><path d="M660-320v-320L500-480l160 160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z"/></svg>
                    </div>
                    <div id="TitlebarLinks">
                        <li><a href="javascript:void(0)">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z"/></svg>
                        New files</a></li>
                        <li><a href="javascript:void(0)">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z"/></svg>
                        About Mintputs</a></li>
                        
                        <div id="TemplatesDropdownBar">
                        <button id="ToggleDropdownPreset">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-160q-33 0-56.5-23.5T160-240q0-33 23.5-56.5T240-320q33 0 56.5 23.5T320-240q0 33-23.5 56.5T240-160Zm240 0q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm240 0q-33 0-56.5-23.5T640-240q0-33 23.5-56.5T720-320q33 0 56.5 23.5T800-240q0 33-23.5 56.5T720-160ZM240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400ZM240-640q-33 0-56.5-23.5T160-720q0-33 23.5-56.5T240-800q33 0 56.5 23.5T320-720q0 33-23.5 56.5T240-640Zm240 0q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Zm240 0q-33 0-56.5-23.5T640-720q0-33 23.5-56.5T720-800q33 0 56.5 23.5T800-720q0 33-23.5 56.5T720-640Z"/></svg>
                        Templates</button>
                        <div id="DropdownPresetMenu">
                                <span>TEMPLATES PRESET</span>
                                <hr>
                                <button class="dropdown-template-btn" onclick="insertTemplate('README')">README</button>
                                <button class="dropdown-template-btn" onclick="insertTemplate('Documentation')">Documentation</button>
                                <button class="dropdown-template-btn" onclick="insertTemplate('Blog Post')">Blog Post</button>
                                <button class="dropdown-template-btn" onclick="insertTemplate('Table Example')">Table Example</button>
                            </div>
                        </div>

                        <span>Recent files</span>
                        <li><a href="javascript:void(0)" id="CurrentFiles">Untitled</a></li>
                        <div class="RecentsFiles">
                            <li><a href="javascript:void(0)"></a></li>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="main-content">
                        <div class="input-section" style="font-family: "JetBrains Mono", "Anuphan", sans-serif !important;">
                            <div id="markdown-input-container" style="font-family: "JetBrains Mono", "Anuphan", sans-serif !important;">
                                <textarea id="markdown-input" placeholder="Input Your Markdown Syntax Here..." spellcheck="false"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="output-section">
                        <div class="section-title" id="HTML_outputText">
                            HTML Output
                        </div>
                        <div id="html-output"></div>
                    </div>
                </div>

                <div class="controls">
                    <div class="controlsContent">
                        <div class="Buttons">
                            <button class="btn btn-secondary" onclick="clearAll()">Clear All</button>
                            <button class="btn btn-primary" onclick="copyHtml()">Copy HTML</button>
                            <button class="btn btn-primary" onclick="downloadHtml()">Download HTML</button>
                        </div>
                        <div class="stats">
                            <span id="parse-time">Parse time: 0ms</span>
                            <span id="char-count">Characters: 0</span>
                        </div>
                    </div>
                </div>
            `
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

        const GlobalCSS = `
            * {
                ${normalizeCallReset}
                ${textRenderForce}
                font-family: ${Typeface[8]}, ${DefaultFontFallback};
                color: ${FormatTextColors};
                line-height: 1.8;
                /* Fallback */
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
                background-color: ${colorPrimary};
            }

            *::-webkit-scrollbar-track:hover {
                background-color: ${colorPrimary};
            }

            *::-webkit-scrollbar-track:active {
                background-color: ${colorPrimary};
            }

            *::-webkit-scrollbar-thumb {
                border-radius: 20${pixel};
                background-color: #484848;
            }

            *::-webkit-scrollbar-thumb:hover {
                background-color: #727272;
            }

            *::-webkit-scrollbar-thumb:active {
                background-color: #999999;
            }
            
            #titlebar {
                width: 260${pixel};
                height: 100${vh};
                background-color: ${SIDEBAR};
                -webkit-app-region: drag;
                user-select: none;
                position: ${fixed};
                z-index: 10;
                border-right: ${FormatBorderColors} solid 1${pixel};
            }

            #TitleLinks {
                display: flex;
                align-items: center;
                position: ${fixed};
                top: ${spacing[4]};
                left: 50${percent};
                transform: translateX(-50${percent});
                border: ${FormatBorderColors} solid 1${pixel};
                z-index: 10;
                width: fit-content;
                height: 40${pixel};
                background-color: ${colorPrimary};
                -webkit-app-region: drag;
                border-radius: ${borderRadiusFull};
                padding: 0 ${spacing[1]};
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
                display: block;
            }

            #TitlebarLinks li a svg {
                width: 20${pixel};
                height: 20${pixel};
                margin-right: ${spacing[1.5]};
                transform: translateY(3${pixel});
            }

            #TitlebarLinks span {
                padding: ${spacing[2]} ${spacing[0.5]};
                font-size: 14${pixel};
                opacity: 60${percent};
            }

            #CurrentFiles {
                padding: ${spacing[1]} ${spacing[3]} !important;
                background-color: ${OutputBackground.PrimarySec};
                display: block;
                border-radius: ${borderRadiusLg};
                outline: ${FormatBorderColors} solid 1${pixel};
            }

            .RecentsFiles {
                margin-top: ${spacing[3]}
            }

            body {
                background-color: ${colorPrimary};
            }

            .container {
                overflow: hidden;
                backdrop-filter: blur(10${pixel});
                height: 100${vh};
                width: calc(100${vw} - 260${pixel});
                position: ${fixed};
                left: 260${pixel};
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
                padding: ${spacing[4]};
                width: 100${percent};
            }

            .output-section {
                position: fixed;
                top: 0;
                right: -30px;
                width: calc(100vw - 260px);
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
                padding: 24px 32px;
                background: ${OutputBackground.PrimarySec};
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            }

            .section-title {
                font-size: 20${pixel};
                font-weight: ${bold};
                margin-bottom: ${spacing[4]};
                color: ${textColorPrimaryText};
                display: flex;
                align-items: center;
                font-family: ${Typeface[4]};
                margin-top: ${spacing[10]};
            }

            #HTML_outputText {
                margin-top: ${spacing[12]};
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
                font-family: ${Typeface[9]};
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
                width: calc(100${vw} - 260${pixel});
                height: 60${pixel};
                margin: auto;
                background-color: ${colorPrimary};
                z-index: 6;
            }

            .controlsContent {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 ${spacing[6]};
                width: 100${vw};
            }

            .Buttons {
                display: flex;
            }

            .btn {
                padding: ${spacing[2]} ${spacing[4]};
                border: none;
                font-weight: 400;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 13.5${pixel};
                border-radius: 50${pixel};
                font-family: ${Typeface[6]},${DefaultFontFallback};
                margin-right: ${spacing[1.5]};
                line-height: 1.2;
            }

            .btn-primary {
                color: ${FormatTextColors};
                background: transparent;
                border: solid 1${pixel} ${PublicFormatBorderColors};
            }

            .btn-secondary {
                background: ${btnSecondary.background};
                border: ${btnSecondary.border};  
                color: ${btnSecondary.color};
            }

            .stats {
                display: flex;
                gap: 18.5${pixel};
                font-size: 13.5${pixel};
                color: #A2A2A2;
                font-family: ${Typeface[0]},${DefaultFontFallback};
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
                width: 100${vw} !important;
                height: calc(100${vh} - 40${pixel}) !important;
                min-width: calc(100${vh} - 40${pixel}) !important;
                min-height: calc(100${vh} - 40${pixel}) !important;
                max-width: 100${vw} !important;
                max-height: calc(100${vh} - 40${pixel}) !important;
                margin: 0 !important;
                padding: 0 !important;
                z-index: 10;
                background: transparent !important;
                overflow: hidden !important;
                bottom: 0 !important;
            }

            #markdown-input-container {
                height: calc(100${vh} - 40${pixel}) !important;
                min-height: calc(100${vh} - 40${pixel}) !important;
                max-height: calc(100${vh} - 40${pixel}) !important; 
                bottom: 0 !important;
            }

            .CodeMirror {
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
            }

            .CodeMirror-linenumber {
                min-width: 45${pixel};
                width: 45${pixel};
                padding: 0 4${pixel} 0 0 !important;
                color: #8A8A8A !important;
                background: transparent !important;
                text-align: right !important;
                box-sizing: border-box !important;
            }

            .CodeMirror-foldgutter {
                width: 20${pixel};
                background: transparent !important;
            }

            .CodeMirror-foldgutter-open,
            .CodeMirror-foldgutter-folded {
                cursor: pointer;
                color: #8A8A8A !important;
                background: transparent !important;
            }

            .CodeMirror-foldgutter-open:after {
                content: "▼";
                font-size: 10${pixel};
            }

            .CodeMirror-foldgutter-folded:after {
                content: "▶";
                font-size: 10${pixel};
            }
            
            .cm-s-monokai.CodeMirror {
                background: transparent !important;
            }

            .CodeMirror-wrap pre.CodeMirror-line, .CodeMirror-wrap pre.CodeMirror-line-like {
                cursor: default !important;
                font-family: "JetBrains Mono", "Anuphan", sans-serif !important;
            }

            .CodeMirror-wrap pre.CodeMirror-line span, .CodeMirror-wrap pre.CodeMirror-line-like span {
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
            
            .cm-header { color: #ffc799 !important; }                         /* Header: Orange */
            .cm-strong { color: #DCDCAA !important; }                         /* Bold: Yellow */
            .cm-em { color: #CE9178 !important; font-style: italic; }         /* Italic: Orange */
            .cm-link, .cm-url { color: #569CD6 !important; text-decoration: underline; }  
            .cm-quote { color: #6A9955 !important; background-color: #222520; }         
            .cm-list { color: #DCDCAA !important; }                           /* List: Yellow */
            .cm-variable-2 { color: #CE9178 !important; }                     /* Inline code: Orange */
            .cm-formatting { color: #808080 !important; }                     /* Formatting: Gray */
            .cm-error { color: #F44747 !important; }                          /* Error: Red */
            .cm-string { color: #CE9178 !important; }                         /* String: Orange */
            .cm-keyword { color: #569CD6 !important; }                        /* Keyword: Blue */
            .cm-comment { color: #6A9955 !important; }   
            .cm-number { color: #DCDCAA !important; }                         /* Number: Yellow */
            .cm-property { color: #4EC9B0 !important; }                       /* Property: Cyan */
            .cm-operator { color: #DCDCAA !important; }                       /* Operator: Yellow */
            .cm-tag { color: #569CD6 !important; }                            /* Tag: Blue */
            .cm-attribute { color: #DCDCAA !important; }                      /* Attribute: Yellow */
            .cm-builtin { color: #4EC9B0 !important; }                        /* Builtin: Cyan */
            .cm-type { color: #4EC9B0 !important; }                           /* Type: Cyan */
            .cm-function { color: #DCDCAA !important; }                       /* Function: Yellow */
            .cm-meta { color: #808080 !important; }                           /* Meta: Gray */
            .cm-qualifier { color: #569CD6 !important; }                      /* Qualifier: Blue */
            .cm-atom { color: #569CD6 !important; }                           /* Atom: Blue */
            .cm-punctuation { color: #D4D4D4 !important; }                    /* Punctuation: Light Gray */
            .cm-bracket { color: #D4D4D4 !important; }                        /* Bracket: Light Gray */

            @media ${DirectThemes[1]} {
                #icon,#SBCloseButtons  {
                    filter: invert(100${percent});
                }
            }

            ${textRenderSpecific}; 
            
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
                font-weight: 600;
                line-height: 1.25; 
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
                margin-left: 0rem;
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
        // console.log('[DEBUG] getContent (CodeMirror):', value, '| editor:', window.editor);
        return value;
    }
    const textarea = document.getElementById('markdown-input');
    const value = textarea ? textarea.value : '';
    // console.log('[DEBUG] getContent (textarea):', value, '| textarea:', textarea);
    return value;
}

function setCurrentFile(filename) {
    const currentFile = document.getElementById('CurrentFiles');
    if (currentFile) currentFile.textContent = filename;
}

function updateRecentsUI() {
    // console.log('[DEBUG] updateRecentsUI called');
    let recents = mint_getRecents();
    // console.log('[DEBUG] recents:', recents);
    const recentsDiv = document.querySelector('.RecentsFiles');
    // console.log('[DEBUG] recentsDiv:', recentsDiv);
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
            // console.log('[CLEAN] Removed old HTML file from localStorage:', key);
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
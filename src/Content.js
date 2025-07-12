// Content.js Example to making content inside this file
// WebElements = Custon user agent stylesheet units 
export const WebElements = {
    StoredFontFamily: "@import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@100..700&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Manrope:wght@200..800&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&family=Trirong:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');",
    Typeface: [
        '"Inter Tight", sans-serif;',
        '"Merriweather", serif;',
        '"Trirong", serif;',
        '"Anuphan", sans-serif;',
        '"JetBrains Mono", monospace;',
        '"Manrope", sans-serif;',
        '"Instrument Sans", sans-serif;',
        '"Source Serif 4", serif;',
        '"Inter Tight", Anuphan, sans-serif',
        '"JetBrains Mono", Anuphan, sans-serif',
        '"Source Serif 4", "Trirong", serif;',
    ],
    DefaultFontFallback: '"Leelawadee UI", "Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif',
    Units: {
        CSSPosition: ['static', 'relative', 'fixed', 'absolute', 'sticky'],
        CSSSize: {
            AbsoluteLengths: {
                StaticCM: 'cm',
                StaticMM: 'mm',
                StaticIN: 'in',
                StaticPT: 'pt',
                StaticPC: 'pc',
                StaticPX: 'px'
            },
            RelativeLengths: {
                RelativeEM: 'em',
                RelativeREM: 'rem',
                RelativeVW: 'vw',
                RelativeVH: 'vh',
                RelativePERCENT: '%',
                RelativeVMAX: 'vmax',
                RelativeMXCON: 'max-content',
            },
            AUTO: 'auto',
            boxSizing: 'border-box',
        },
        weights: { // Added
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            extrabold: '800'
        },
    },
    DirectThemes: [
        '(prefers-color-scheme: dark)',
        '(prefers-color-scheme: light)'
    ],
    get BorderRadius() {
        return {};
    },
    get layout() {
        return {
            zIndex: {
                Hidden: '-1',
                Base: '0',
                Dropdown: '1000',
                Modal: '1050',
                Tooltip: '1100'
            },
            Overflow: {
                Hidden: 'hidden',
                Scroll: 'scroll',
                Auto: 'auto'
            },
            MediaQuery: [
                '(min-width: 1280px)',
                '(min-width: 768px)',
                '(min-width: 576px)',
                '(min-width: 380px)',
                '(min-width: 320px)',
            ],
        };
    },
    get Transition() {
        return {};
    },
    spacing: {
        0: '0',
        px: '1px',
        0.5: '0.125rem',  // 2px
        1: '0.25rem',     // 4px
        1.5: '0.375rem',  // 6px
        2: '0.5rem',      // 8px
        2.5: '0.625rem',  // 10px
        3: '0.75rem',     // 12px
        3.5: '0.875rem',  // 14px
        4: '1rem',        // 16px
        5: '1.25rem',     // 20px
        6: '1.5rem',      // 24px
        7: '1.75rem',     // 28px
        8: '2rem',        // 32px
        10: '2.5rem',     // 40px
        12: '3rem',       // 48px
        14: '3.5rem',
        16: '4rem',
        18: '4.5rem',
        20: '5rem',       // 80px
        24: '6rem',       // 96px
        32: '8rem',       // 128px
    },
    borderRadius: {
        none: '0',
        sm: '0.125rem',          // 2px
        DEFAULT: '0.25rem',      // 4px
        md: '0.375rem',          // 6px
        lg: '0.5rem',            // 8px
        xl: '0.75rem',           // 12px
        '2xl': '1rem',           // 16px
        '3xl': '1.5rem',         // 24px
        full: '100vmax'
    },
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        none: 'none'
    },
    transitions: {
        none: 'none',
        all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        DEFAULT: 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        colors: 'color, background-color, border-color, text-decoration-color, fill, stroke 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        shadow: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    easings: {
        linear: 'linear',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.19, 1, 0.22, 1)',
    },
    breakpoints: {
        mb: '411px',
        sm: '450px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
    }
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
    SIDEBAR: "#0f0f0f",
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
                        <span>Recent files</span>
                        <li><a href="javascript:void(0)" id="CurrentFiles">Untitled - Mintputs</a></li>
                        <div class="RecentsFiles">
                            <li><a href="javascript:void(0)">คิดแต่ไม่ถึง</a></li>
                            <li><a href="javascript:void(0)">โครงงานวิทยาศาสตร์</a></li>
                            <li><a href="javascript:void(0)">Math projects</a></li>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="main-content">
                        <div class="input-section">
                            <div class="section-title">
                                      
                            </div>
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

                <div id="TitleLinks">
                    <li><a id="Highlight" data-base-id="ToggleMDEditer" href="javascript:void(0)">Markdown Editer</a></li>
                    <li><a id="ToggleHTMLOUTPUT" data-base-id="ToggleHTMLOUTPUT" href="javascript:void(0)">HTML Output</a></li>
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
        // parameters values for MintAssembly
        MintAssemblySimpleAddition(variableAX = 200, variableBX = 'ax') {
            return `
                <Entry>
                    <mov dst="ax" src="${variableAX}"></mov>
                    <mov dst="bx" src="${variableBX}"></mov>
                    <print var="ax"></print>
                    <print var="bx"></print>
                </Entry>
            `;
        }
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

    // เราสามารถคัดลองอีกไปวางใน main ตาม layout ที่เราต้องการว่าจะมีเท่าใหร่
    ElementComponents() {
        return `
            ${this.HTMLContent.Introduce()}
        `;
    },

    ElementComponents2() {
        return `
            ${ /* Simple Addition values using MintAssembly */''}
            ${this.HTMLContent.MintAssemblySimpleAddition()}
        `;
    },

    // เช่นกันกับ CSS ว่าเราต้องการให้ไป style ในส่วนใหน
    StyledElementComponents() {
        if (this._cachedCSS) return this._cachedCSS;

        const {
            DefaultFontFallback,
            Typeface,
            Units,
            spacing,
            borderRadius,
            easings,
            breakpoints,
        } = WebElements;
        const { weights } = Units;

        // Hoist properties
        const normalizeCallReset = this.Normalize.CALLReset;
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

        const pixel = WebElements.Units.CSSSize.AbsoluteLengths.StaticPX;

        const GlobalCSS = `
            * {
                ${normalizeCallReset};
                ${textRenderForce};
                font-family: ${WebElements.Typeface[8]};
                color: ${FormatTextColors};
                line-height: 1.8;
            }

            *::-webkit-scrollbar {
                height: 5px;
                width: 5px;
            }
            *::-webkit-scrollbar-track {
                border-radius: 0px;
                background-color: ${colorPrimary};
            }

            *::-webkit-scrollbar-track:hover {
                background-color: ${colorPrimary};
            }

            *::-webkit-scrollbar-track:active {
                background-color: ${colorPrimary};
            }

            *::-webkit-scrollbar-thumb {
                border-radius: 20px;
                background-color: #484848;
            }

            *::-webkit-scrollbar-thumb:hover {
                background-color: #727272;
            }

            *::-webkit-scrollbar-thumb:active {
                background-color: #999999;
            }

            #titlebar {
                width: 260px;
                height: 100vh;
                background-color: ${SIDEBAR};
                -webkit-app-region: drag;
                user-select: none;
                position: fixed;
                z-index: 10;
                border-right: ${FormatBorderColors} solid 1px;
            }

            #TitleLinks {
                display: flex;
                align-items: center;
                position: fixed;
                top: ${spacing[0]};
                left: 260${pixel};
                border-bottom: ${FormatBorderColors} solid 1px;
                z-index: 10;
                width: calc(100vw - 260px);
                height: 40px;
            }

            #TitleLinks li {
                list-style: none;
            }

            #Highlight {
                opacity: 1 !important;
                background-color: ${OutputBackground.PrimarySec};
                border-bottom: ${FormatBorderColors} solid 1px;
            }

            #TitleLinks li a {
                color: ${textColorPrimaryDisplay};
                padding: ${spacing[2.5]} ${spacing[4]};
                font-size: 14${pixel};
                opacity: 0.6;
                -webkit-app-region: no-drag;
                text-decoration: none;
                transition: 0.2s ease;
            }

            #TitleLinks li a:hover {
                opacity: 1;
            }

            #drag-region {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 88%;
                gap: 8px;
                position: absolute;
                left: ${spacing[4]};
                top: ${spacing[3.5]};
            }

            #SBCloseButtons {
                fill: #fff;
            }

            #icon {
                width: 70${pixel};
                height: auto;
                -webkit-app-region: no-drag;
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
                width: 20px;
                height: 20px;
                margin-right: ${spacing[1.5]};
                transform: translateY(3px);
            }

            #TitlebarLinks span {
                padding: ${spacing[2]} ${spacing[0.5]};
                font-size: 14${pixel};
                opacity: 60%;
            }

            #CurrentFiles {
                padding: ${spacing[1]} ${spacing[3]} !important;
                background-color: ${OutputBackground.PrimarySec};
                display: block;
                border-radius: ${borderRadius.lg};
                outline: ${FormatBorderColors} solid 1px;
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
                height: 100vh;
                width: calc(100vw - 260px);
                position: fixed;
                right: 0;
            }

            .main-content {
                display: flex;
                margin: auto;
                height: 100vh;
            }

            .input-section, .output-section {
                display: flex;
                flex-direction: column;
                padding: ${spacing[4]};
                width: 100%;
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
            }

            .section-title {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: ${spacing[4]};
                color: ${textColorPrimaryText};
                display: flex;
                align-items: center;
                font-family: ${WebElements.Typeface[4]};
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
                font-family: ${WebElements.Typeface[9]};
                font-weight: 480;
            }

            #html-output {
                flex: 1;
                overflow-y: auto;
                width: 850px;
                margin: auto;
            }

            .controls {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                position: fixed;
                bottom: 0;
                right: 0;
                width: calc(100vw - 260px);
                height: 52.5${pixel};
                margin: auto;
                border-top: 1${pixel} solid ${PublicFormatBorderColors};
                background-color: ${colorPrimary};
                z-index: 6;
            }

            .controlsContent {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 ${spacing[4]};
                width: 100vw;
            }

            .Buttons {
                display: flex;
            }

            .btn {
                padding: ${spacing[2]} ${spacing[3.5]};
                border: none;
                font-weight: 400;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 13.5${pixel};
                border-radius: 50${pixel};
                font-family: ${WebElements.Typeface[6]},${DefaultFontFallback};
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
                font-family: ${WebElements.Typeface[0]},${DefaultFontFallback};
            }

            /* Syntax Highlighting Styles */
            .hljs {
                background: ${OutputBackground.PrimarySec};
                border-radius: 6${pixel};
                padding: ${spacing[2]} ${spacing[4]};
                overflow-x: auto;
                margin: 10${pixel} 0;
                border: 1px solid ${PublicFormatBorderColors};
            }

            .hljs-keyword { color: #d73a49; font-weight: bold; }
            .hljs-string { color: #032f62; }
            .hljs-comment { color: #6a737d; font-style: italic; }
            .hljs-number { color: #005cc5; }
            .hljs-function { color: #6f42c1; }
            .hljs-variable { color: #e36209; }
            .hljs-tag { color: #22863a; }
            .hljs-attr { color: #6f42c1; }

            /* Markdown Output Styles */
            #html-output h1, #html-output h2, #html-output h3, #html-output h4, #html-output h5, #html-output h6 {
                color: ${textColorPrimaryDisplay};
                margin: 18.5${pixel} 0 18.5${pixel} 0;
                ${WebElements.Typeface[8]};
            }

            #html-output h1 { font-size: 2.4em; font-family: ${WebElements.Typeface[8]}; line-height: 1.4; border-bottom: ${FormatBorderColors} solid 1px; margin: 10${pixel} 0 10${pixel} 0; color: ${PrimaryHeaderText} }
            #html-output h2 { font-size: 2em; line-height: 1.4; }
            #html-output h3 { font-size: 1.8em; line-height: 1.45; opacity: 0.72; }
            #html-output h4 { font-size: 1.6em; line-height: 1.5; opacity: 0.65; }
            #html-output h5 { font-size: 1.4em; line-height: 1.65; opacity: 0.60; }
            #html-output h6 { font-size: 1.2em; line-height: 1.82; opacity: 0.55; }

            #html-output p { margin: 10px 0; line-height: 1.6; color: ${textColorPrimaryText}; }
            #html-output code { background: transparnt; padding: 2${pixel} 6px; border-radius: 4px; font-family: ${WebElements.Typeface[9]}; }
            #html-output blockquote { border-left: 4px solid ${textColorPrimaryDisplay}; padding-left: 15px; margin: 15px 0; color: ${textColorPrimaryDisplay}; opacity: 0.8; }
            #html-output ul, #html-output ol { margin: 10px 0 10px 30px; }
            #html-output li { margin: 5px 0; }
            #html-output li a,strong { color: ${textColorPrimaryText}; }
            #html-output a { color: ${OutputBackground.LinksBackground}; text-decoration: none; margin: 18.5${pixel} 0 18.5${pixel} 0; }
            #html-output a:hover { text-decoration: underline; }
            #html-output table { border-collapse: collapse; width: 100%; margin: 10px 0; margin-bottom: ${spacing[3.5]}; }
            #html-output th, #html-output td { border-bottom: 1px solid ${PublicFormatBorderColors}; padding: ${spacing[2]} ${spacing[4]}; text-align: left; }
            #html-output th { font-weight: 600; }

            /* Responsive adjustments */
            @media (max-width: ${breakpoints.mb}), (max-width: ${breakpoints.sm}) {
                .btn {
                    font-size: 12.5${pixel};
                    padding: ${spacing[2]} ${spacing[3]};
                }

                .stats {
                    display: none;
                }
            }
            @media (max-width: ${breakpoints.md}) {}
            @media (min-width: ${breakpoints.lg}) {}
            @media (max-width: ${breakpoints.xl}) {
                #html-output {
                    width: 100%;
                }
            }
            @media ${WebElements.DirectThemes[1]} {
                #icon,#SBCloseButtons  {
                    filter: invert(100%);
                }
            }

            ${textRenderSpecific}; 
        `;
        this._cachedCSS = GlobalCSS;
        return GlobalCSS;
    }

};

WebContent.initThemeSystem();
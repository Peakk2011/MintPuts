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
        14: '3.5rem',       // 64px
        16: '4rem',       // 64px
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
    }
};

const darkThemeColors = {
    ColorPrimary: '#141414;',
    TextColorPrimaryDisplay: '#faf8f0;',
    TextColorPrimaryText: '#A2A2A2;',
    HighlightPrimary: '#413c3c;',
    FormatTextColors: '#A2A2A2',
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
    }
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
        Name: 'Markdown to HTML',
        Introduce(Name) {
            const DisplayName = Name || this.Name;
            return `
                <div id="titlebar">
                    <div id="drag-region">
                        <img id="icon" src="/assets/MintLogoPage.svg" alt="icon" />
                        <span>${DisplayName}</span>
                    </div>
                    <div id="TitleLinks">
                        <li><a id="Highlight">Markdown Editer</a></li>
                        <li><a>HTML Output</a></li>
                    </div>
                </div>
                <div class="container">
                    <div class="main-content">
                        <div class="input-section">
                            <div class="section-title">
                                Markdown Input
                            </div>
                            <textarea id="markdown-input" placeholder="Input Your Markdown Syntax Here..." spellcheck="false"></textarea>
                        </div>

                        
                    </div>
                </div>

                <div class="output-section">
                            <div class="section-title">
                                HTML Output
                            </div>
                            <div id="html-output"></div>
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
                height: 75px;
                background-color: ${colorPrimary};
                -webkit-app-region: drag;
                user-select: none;
                width: 100%;
                position: fixed;
                z-index: 10;
            }

            #TitleLinks {
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: absolute;
                top: ${spacing[10]};
                left: ${spacing[4]};
            }

            #TitleLinks li {
                list-style: none;
            }

            #Highlight {
                opacity: 1 !important;
            }

            #TitleLinks li a {
                color: ${textColorPrimaryDisplay};
                padding: ${spacing[2]} ${spacing[0]};
                margin-right: ${spacing[4]};
                font-size: 14${pixel};
                opacity: 0.6;
            }

            #drag-region {
                display: flex;
                align-items: center;
                gap: 8px;
                position: absolute;
                left: ${spacing[4]};
                top: ${spacing[2.5]};
            }

            #drag-region span {
                color: ${textColorPrimaryDisplay};
                font-weight: 500;
                font-size: 14.5px;
            }

            #icon {
                height: 18${pixel};
                width: 18${pixel};
                -webkit-app-region: no-drag;
            }

            body {
                background-color: ${colorPrimary};
            }

            .container {
                margin: 0 auto;
                overflow: hidden;
                backdrop-filter: blur(10${pixel});
                height: 100vh;
            }

            .main-content {
                display: flex;
                margin: auto;
                height: calc(100vh - 52.5px);
            }

            .input-section, .output-section {
                display: flex;
                flex-direction: column;
                padding: ${spacing[4]};
                width: 50%;
            }

            .section-title {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: ${spacing[4]};
                color: ${textColorPrimaryText};
                display: flex;
                align-items: center;
                font-family: ${WebElements.Typeface[4]};
                margin-top: ${spacing[16]};
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
                left: 50%;
                transform: translateX(-50%);
                width: 100vw;
                height: 52.5${pixel};
                margin: auto;
                border-top: 1${pixel} solid ${PublicFormatBorderColors};
                background-color: ${colorPrimary};
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

            #html-output h1 { font-size: 2.4em; font-family: ${WebElements.Typeface[10]}; line-height: 1.4; border-bottom: ${FormatBorderColors} solid 1px; margin: 10${pixel} 0 10${pixel} 0; color: ${PrimaryHeaderText} }
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
                #icon {
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
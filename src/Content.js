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
        Mint.injectCSS(`
            :root {
                --primary-background-color: rgba(250, 249, 246, 1);
                --primary-TextBG: #000000;
                --primary-accent: hsl(180, 16%, 30%);
                
                --modal-background: #ffffff;
                --modal-text: #000000;
                --modal-text-secondary: #4B4B4B;
                --modal-border: #deddd9;
                --modal-input-border: #ccc;
                --modal-shadow: 0px 12px 24px rgba(0, 0, 0, 0.10), 
                                0px 14px 128px rgba(0, 0, 0, 0.07), 
                                0px 60px 300px rgba(0, 0, 0, 0.05);
                
                /* Button Colors - Light Theme */
                --button-bg-gradient: linear-gradient(180deg, hsl(48 50% 96.1%), hsl(176 17% 81.6%));
                --button-border-gradient: linear-gradient(180deg, hsl(0 0% 100%), hsl(0 0% 82.7%), hsl(197 10% 59%));
                --button-text: #4B4B4B;
                --button-shadow: 0 6px 10px rgba(191, 200, 230, 0.4), 0 4px 20px rgba(191, 200, 230, 0.2);
                --button-hover-bg: hsl(0, 0%, 0%);
                --button-hover-text: hsl(0, 0%, 100%);
                --button-hover-shadow: transarent;
            }

            @media (prefers-color-scheme: dark) {
                :root {
                    --primary-background-color: rgba(27, 27, 27, 1);
                    --modal-background: #141414;
                    --modal-text: #FFFFFF;
                    --modal-text-secondary: #b9bebe;
                    --primary-accent: hsl(180, 35%, 92%);
                    --modal-border: #3a3a3a;
                    --modal-input-border: #555;
                    --modal-shadow: 0px 12px 24px rgba(0, 0, 0, 0.40), 
                                    0px 14px 128px rgba(0, 0, 0, 0.30), 
                                    0px 60px 300px rgba(0, 0, 0, 0.20);
                    
                    --button-bg-gradient: linear-gradient(180deg, hsl(176 10% 20%), hsl(0 0% 12%));
                    --button-border-gradient: linear-gradient(180deg, hsl(0 0% 20%), hsl(198 10% 25%), hsl(199 10% 50%));
                    --button-text: #e0e0e0;
                    --button-shadow: transparent;
                    --button-hover-bg: hsl(0, 0%, 100%);
                    --button-hover-text: hsl(0, 0%, 0%);
                    --button-hover-shadow: transparent;
                }
            }

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
                width:  100vw;
                height: 100vh;
                z-index: 0;
            }

            .mintputs-modal-content {
                position: relative;
                z-index: 1;
                border-radius: 10px;
                background: var(--modal-background);
                color: var(--modal-text);
                box-shadow: var(--modal-shadow);
                padding: 1.75rem 1.5rem 1.75rem 1.5rem;
                min-width: 320px;
                max-width: 360px;
                min-height: 360px;
                display: flex;
                flex-direction: column;
                align-items: stretch;
                border: 1px solid var(--modal-border);
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }

            .mintputs-modal-content h2 {
                margin-top: 0.5rem;
                color: var(--modal-text);
            }

            .mintputs-modal-content p {
                margin: 0.5rem 0;
                margin-bottom: 1rem;
                font-size: 0.9em;
                color: var(--modal-text-secondary);
                font-weight: 500;
                line-height: 1.4;
                letter-spacing: -0.4px;
            }

            .mintputs-modal-content img {
                width: 55px;
                height: auto;
                filter: var(--icon-filter, none);
            }

            #mintputs-save-filename {
                width: 100%;
                padding: 0.5rem 0rem;
                font-size: 0.95em;
                margin-bottom: 1em;
                border: none;
                border-bottom: 1.5px solid var(--modal-input-border);
                background: transparent;
                color: var(--modal-text);
                transition: border-color 0.2s ease, color 0.3s ease;
            }

            #mintputs-save-filename:focus {
                outline: none;
                border-bottom: 1.5px solid var(--primary-accent);
            }

            #mintputs-save-filename::placeholder {
                color: var(--modal-text-secondary);
                transition: color 0.3s ease;
            }

            #mintputs-save-filename:focus::placeholder {
                color: var(--primary-accent);
            }

            .mintputs-modal-content button {
                padding: 8px 18px;
                border-radius: 6px;
                border: none;
                cursor: pointer;
            }

            #mintputs-save-cancel {
                box-shadow: none;
                background: transparent;
            }

            #mintputs-save-cancel-inner {
                background: transparent;
                box-shadow: none;
                color: var(--modal-text-secondary);
                transition: color 0.2s ease;
            }

            #mintputs-save-cancel:hover #mintputs-save-cancel-inner {
                color: var(--modal-text);
            }
            
            .MintputsSaveButtons {
                position: relative;
                background: var(--button-border-gradient);
                padding: 2px;
                border-radius: 100vmax;
                display: inline-block;
                border: none;
                cursor: pointer;
                text-decoration: none;
                transition: all 0.2s ease-out;
            }

            .MintputsSaveButtons-inner {
                background: var(--button-bg-gradient);
                border-radius: 100vmax;
                text-align: center;
                color: var(--button-text);
                font-size: 14px;
                font-weight: 450;
                letter-spacing: 0.2px;
                padding: 0.3rem 1.25rem;
                transition: all 0.3s ease-out;
                box-shadow: var(--button-shadow);
            }

            .MintputsSaveButtons:hover {
                background: var(--button-hover-bg);
            }

            .MintputsSaveButtons:hover .MintputsSaveButtons-inner {
                background: var(--button-hover-bg);
                box-shadow: var(--button-hover-shadow);
                color: var(--button-hover-text);
            }

            .MintputsSaveButtons:active {
                transform: translateY(0px) scale(0.96);
                transition: all 0.08s ease-out;
            }

            .MintputsSaveButtons:active .MintputsSaveButtons-inner {
                transform: scale(0.92);
                transition: all 0.08s ease-out;
            }

            .MintputsSaveButtonsContainer {
                display: flex;
                gap: 0.15em;
                justify-content: flex-end;
                position: absolute;
                bottom: 1.5rem;
                right: 1.5rem;
            }

            @media (max-width: 480px) {
                .mintputs-modal-content {
                    min-width: 280px;
                    max-width: 320px;
                    margin: 1rem;
                }
            }

            #mintputs-save-filename {
                position: relative;
            }

            #mintputs-save-filename.error {
                border-bottom-color: #ff6b6b;
                animation: shake 0.3s ease;
            }

            #mintputs-save-modal {
                animation: modalFadeIn 400ms cubic-bezier(0.19, 1, 0.22, 1) forwards;
            }

            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `);
        _modalCSSInjected = true;
    }

    let modal = document.getElementById('mintputs-save-modal');
    if (!modal) {
        const modalHTML = `
            <div id="mintputs-save-modal">
                <div class="mintputs-modal-backdrop"></div>
                <div class="mintputs-modal-content">
                    <img src="./assets/folderIcons.svg" alt="Mintputs Logo">
                    <h2>Save</h2>
                    <p>
                        Save your file to this browser's storage.<br>
                        Only you can access it on this device.
                    </p>
                    <input id="mintputs-save-filename" type="text" placeholder="Enter filename..." autofocus />
                    <div class="MintputsSaveButtonsContainer">
                        <a class="MintputsSaveButtons" href="javascript:void(0)" id="mintputs-save-cancel">
                            <div class="MintputsSaveButtons-inner" id="mintputs-save-cancel-inner">
                                Cancel
                            </div>
                        </a>
                        <a class="MintputsSaveButtons" href="javascript:void(0)" id="mintputs-save-confirm">
                            <div class="MintputsSaveButtons-inner">
                                Save
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
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
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z"/></svg>
                        New files</a></li>
                        <li><a href="javascript:void(0)">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z"/></svg>
                        About Mintputs</a></li>
                        
                        <div id="TemplatesDropdownBar">
                        <button id="ToggleDropdownPreset">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M240-160q-33 0-56.5-23.5T160-240q0-33 23.5-56.5T240-320q33 0 56.5 23.5T320-240q0 33-23.5 56.5T240-160Zm240 0q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm240 0q-33 0-56.5-23.5T640-240q0-33 23.5-56.5T720-320q33 0 56.5 23.5T800-240q0 33-23.5 56.5T720-160ZM240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400ZM240-640q-33 0-56.5-23.5T160-720q0-33 23.5-56.5T240-800q33 0 56.5 23.5T320-720q0 33-23.5 56.5T240-640Zm240 0q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Zm240 0q-33 0-56.5-23.5T640-720q0-33 23.5-56.5T720-800q33 0 56.5 23.5T800-720q0 33-23.5 56.5T720-640Z"/></svg>
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
                    <div id="TitleLinks">
                        <div class="TitlePrimaryLinks">
                            <li><a id="Highlight" data-base-id="ToggleMDEditer" href="javascript:void(0)">Editer</a></li>
                            <li><a id="ToggleHTMLOUTPUT" data-base-id="ToggleHTMLOUTPUT" href="javascript:void(0)"> Output</a></li>
                        </div>
                        <div class="TitleSubLinks">
                            <li><a id="ToggleDownload" data-base-id="ToggleDownload" href="javascript:void(0)" onclick="downloadHtml()">Download</a></li>
                            <li><a id="CLearALL" data-base-id="CLearALL" href="javascript:void(0)" onclick="clearAll()">Clear Texts</a></li>
                        </div>
                        <!-- clearAll() -->
                    </div>
                    <div class="main-content">
                        <div class="input-section" style="font-family: "JetBrains Mono", "Anuphan", sans-serif !important;">
                            <div id="markdown-input-container" style="font-family: "JetBrains Mono", "Anuphan", sans-serif !important;">
                                <textarea id="markdown-input" placeholder="Input Your Markdown Syntax Here..." spellcheck="false"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="output-section">
                        <div id="html-output"></div>
                    </div>
                </div>

                <div class="controls">
                    <div class="controlsContent">
                        <div class="stats">
                            <span id="parse-time">0ms</span>
                            <span id="char-count">0</span>
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
            
            .cm-header { color: #bbdcad !important; font-weight: 400; }
            .cm-strong { color: #c55d68 !important; font-weight: 400; }
            .cm-em { color: #d6bb91 !important; font-style: italic; }
            .cm-link, .cm-url { color: #9CAF88 !important; text-decoration: underline; text-decoration-color: #8B9D83; }
            .cm-quote { color: #8B9D83 !important; background-color: rgba(107, 127, 95, 0.2); border-left: 3px solid #6B7F5F; padding: ${spacing[1]} ${spacing[3]}; }
            .cm-list { color: #D4A264 !important; }
            .cm-variable-2 { color: #B8956A !important; }
            .cm-formatting { color: #A0A0A0 !important; opacity: 0.8; }
            .cm-error { color: #B85450 !important; text-decoration: underline wavy; background-color: rgba(184, 84, 80, 0.1); }
            .cm-string { color: #d6bb91 !important; }
            .cm-keyword { color: #9CAF88 !important; font-weight: 400; }
            .cm-comment { color: #8B9D83 !important; font-style: italic; opacity: 0.9; }
            .cm-number { color: #d39f67ff !important; font-weight: 400; }
            .cm-property { color: #B8956A !important; }
            .cm-operator { color: #D4A264 !important; font-weight: 400; }
            .cm-tag { color: #9CAF88 !important; font-weight: 400; }
            .cm-attribute { color: #d39f67ff !important; }
            .cm-builtin { color: #8B6F47 !important; font-weight: 400; }
            .cm-type { color: #B8956A !important; font-weight: 400; }
            .cm-function { color: #D4A264 !important; font-weight: 400; }
            .cm-meta { color: #A0A0A0 !important; opacity: 0.8; }
            .cm-qualifier { color: #9CAF88 !important; }
            .cm-atom { color: #d39f67ff !important; }
            .cm-punctuation { color: #F5E6D3 !important; opacity: 0.9; }
            .cm-bracket { color: #F5E6D3 !important; font-weight: 400; }

            .CodeMirror-matchingbracket {
                background-color: rgba(255, 255, 255, 0.1) !important;
                color: #ffdf8e !important;
                border-bottom: 1px solid #ffdf8e;
                border-radius: 2px;
                font-weight: bold;
            }

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

            @media ${DirectThemes[1]} {
                .cm-header { color: #126420ff !important; font-weight: 400; font-size: 16.5${pixel}; }
                .cm-strong { color: #7A4B12 !important; font-weight: 400; }
                .cm-em { color: #6B4B26 !important; font-style: italic; }
                .cm-link, .cm-url { color: #3A5A2A !important; text-decoration: underline; text-decoration-color: #4A6B3A; }
                .cm-quote { color: #2A4B1A !important; background-color: rgba(74, 107, 58, 0.15); border-left: 3px solid #4A6B3A; padding: ${spacing[1]} ${spacing[3]}; }
                .cm-list { color: #7A4B12 !important; }
                .cm-variable-2 { color: #7c0a0a !important; }
                .cm-formatting { color: #4A4A4A !important; opacity: 0.9; }
                .cm-error { color: #A0342F !important; text-decoration: underline wavy; background-color: rgba(160, 52, 47, 0.1); }
                .cm-string { color: #6B3A15 !important; }
                .cm-keyword { color: #2A4B1A !important; font-weight: 400; }
                .cm-comment { color: #3A5A2A !important; font-style: italic; opacity: 0.85; }
                .cm-number { color: #7A4B12 !important; font-weight: 600; }
                .cm-property { color: #6B3625 !important; }
                .cm-operator { color: #6B4B26 !important; font-weight: 400; }
                .cm-tag { color: #2A4B1A !important; font-weight: 600; }
                .cm-attribute { color: #7A4B12 !important; }
                .cm-builtin { color: #566361 !important; font-weight: 400; }
                .cm-type { color: #6B3625 !important; font-weight: 600; }
                .cm-function { color: #6B4B26 !important; font-weight: 400; }
                .cm-meta { color: #4A4A4A !important; opacity: 0.9; }
                .cm-qualifier { color: #2A4B1A !important; }
                .cm-atom { color: #7A4B12 !important; }
                .cm-punctuation { color: #2A2A2A !important; opacity: 1; }
                .cm-bracket { color: #2A2A2A !important; font-weight: 400; }

                .CodeMirror-matchingbracket {
                    background-color: rgba(0, 0, 0, 0.08) !important;
                    color: #000000 !important;
                    border-bottom: 1px solid #444;
                    border-radius: 2px;
                    font-weight: bold;
                }

                .cm-command {
                    color: #2A4B1A !important;
                    background-color: rgba(74, 107, 58, 0.15);
                    border-left: 3px solid #4A6B3A;
                }
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
    const REMINDER_DELAY = 2000;

    const onEditorChange = (cm, change) => {
        const isUserInput = change && change.origin && ['+input', '+delete', 'paste', 'cut'].includes(change.origin);
        if (!isUserInput) {
            return;
        }

        if (reminderShown || timerStarted || window.innerWidth > 600) {
            return;
        }

        timerStarted = true;
        setTimeout(() => {
            if (reminderShown) return;
            reminderShown = true; // Mark as shown to prevent re-triggering
            mint_showSaveModal(
                (filename) => {
                    const content = getContent();
                    mint_saveFile(filename, content);
                    updateRecentsUI();
                    setCurrentFile(filename);
                },
                () => { /* User cancelled, do nothing. The reminder won't show again. */ }
            );
        }, REMINDER_DELAY);
    };

    const checkEditorAndBind = () => {
        if (window.editor) {
            window.editor.on('change', onEditorChange);
        } else {
            setTimeout(checkEditorAndBind, 500);
        }
    };

    checkEditorAndBind();
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
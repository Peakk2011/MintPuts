import { Mint } from './mintkit/mint.js';
import { Webfunctions } from './EventHandle.js';
import { WebContent } from './Content.js';
import { WebElements } from './redistributables/units.js';
import page from './styling/mintputs_page.js';

const ROOT = '#app';
const MAIN_CONTAINER_ID = 'ROOT';
const MAIN_STYLESHEET_ID = 'main-dynamic-stylesheet';
const FONT_STYLESHEET_ID = 'fonts-stylesheet';

const SetHTMLtitle = `<title>${WebContent.PageTitle}</title>`;
const CONTAINER_ROOT = `<div id="${MAIN_CONTAINER_ID}">`;
const CONTAINER_CLOSE = '</div>';

const cache = {
    head: document.head,
    target: null,
    mainStyle: null,
    fontStyle: null,
    css: null,
    cssValid: false,
    html: null,
    htmlValid: false,
    componentsValid: false,
    components: {
        comp1: null,
        comp2: null,
    }
};

cache.target = document.querySelector(ROOT);

const generateMainStylesheet = () => {
    if (!cache.cssValid) {
        cache.css = WebContent.StyledElementComponents();
        cache.cssValid = true;
    }
    return cache.css;
};

// Page import
const getCachedComponents = () => {
    if (!cache.componentsValid) {
        cache.components.comp1 = WebContent.ElementComponents();
        cache.componentsValid = true;
    }
    return cache.components.comp1 + cache.components.comp2;
};

const Main = Mint.createState({});

const Logger = {
    error: console.error.bind(console, '[Mintkit Error]'),
    info: console.info.bind(console, '[Mintkit]'),
    warn: console.warn.bind(console, '[Mintkit Warn]')
};

let renderQueued = false;
let lastHTML = '';
let firstRenderComplete = false; // flag render

const queueRender = () => {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => {
        const html = CONTAINER_ROOT + getCachedComponents() + CONTAINER_CLOSE;

        if (html !== lastHTML) {
            lastHTML = html;
            Mint.injectHTML(ROOT, html);
            Mint.MintAssembly?.();

            if (!firstRenderComplete && Webfunctions) {
                Webfunctions(Main).catch(err => Logger.error('Error in Webfunctions:', err));
                firstRenderComplete = true;
                if (typeof page !== 'undefined' && page.initTypingEffect) {
                    page.initTypingEffect();
                }
                if (typeof page !== 'undefined' && page.initAboutModal) {
                    page.initAboutModal();
                }
            }
        } else {
            console.log("No changes to render");
        }
        renderQueued = false;
    });
};

Main.subscribe(queueRender);

const InitialMintkit = () => {
    // Font injection
    if (WebElements.StoredFontFamily && !cache.fontStyle) {
        cache.fontStyle = document.createElement('style');
        cache.fontStyle.id = FONT_STYLESHEET_ID;
        cache.fontStyle.textContent = WebElements.StoredFontFamily;
        cache.head.appendChild(cache.fontStyle);
    }

    // Main stylesheet creation
    if (!cache.mainStyle) {
        cache.mainStyle = document.createElement('style');
        cache.mainStyle.id = MAIN_STYLESHEET_ID;
        cache.head.appendChild(cache.mainStyle);
    }

    // Stylesheet content
    cache.mainStyle.textContent = generateMainStylesheet();

    Mint.injectTitle(SetHTMLtitle);

    WebContent.setThemeChangeCallback(() => {
        cache.cssValid = false;
        cache.componentsValid = false;
        cache.mainStyle.textContent = generateMainStylesheet();
        Main.set(s => ({ ...s, _t: Date.now() }));
    });

    Main.set({});
};

const startMintkit = () => {
    Mint.AdjustHook?.();
    InitialMintkit();
};

if (document.readyState === 'complete') {
    startMintkit();
} else if (document.readyState === 'interactive') {
    setTimeout(startMintkit, 0);
} else {
    document.addEventListener('DOMContentLoaded', startMintkit, { once: true });
}
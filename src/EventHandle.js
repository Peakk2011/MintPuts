import { Mint } from './mintkit/mint.js';
import './Content.js';
import { typewriterInsertCM5, typewriterInsertLineCM5, setupIntellisense } from './intellisense.js';
import './styling/mintputs_page.js';

export const Webfunctions = async (Main) => {

    let untitledFileCounter = 1;

    async function initBinaryConverter() {
        try {
            if (typeof BinaryConverter !== 'undefined') {
                window.binaryConverterModule = await BinaryConverter();
                if (typeof showNotification === 'function') {
                    // showNotification('Binary converter', 'success');
                } else {
                    return;
                }
            } else {
                setTimeout(initBinaryConverter, 100);
            }
        } catch (error) {
            console.error('Failed to initialize binary converter:', error);
        }
    }

    initBinaryConverter();

    async function SyncFavicons() {
        try {
            const faviconLink = document.getElementById('favicon');
            if (!faviconLink) {
                return;
            }
            const lightModeFaviconPath = '/assets/MintLogoPage.svg';
            const darkModeFaviconPath = '/assets/MintLogoPage.svg';
            const checkFaviconExists = async (path) => {
                try {
                    const response = await fetch(path, { method: 'HEAD' });
                    return response.ok;
                } catch (error) {
                    console.warn(`Cannot check favicon at: ${path}`, error);
                    return false;
                }
            };
            const updateFaviconBasedOnTheme = async (isDarkMode) => {
                const targetPath = isDarkMode ? darkModeFaviconPath : lightModeFaviconPath;
                const exists = await checkFaviconExists(targetPath);
                if (exists) {
                    faviconLink.href = targetPath;
                } else {
                    console.warn(`Favicon file not found: ${targetPath}`);
                }
            };

            const darkModeFavicons = window.matchMedia('(prefers-color-scheme: dark)');
            await updateFaviconBasedOnTheme(darkModeFavicons.matches);
            darkModeFavicons.addEventListener('change', async (event) => {
                await updateFaviconBasedOnTheme(event.matches);
            });

        } catch (error) {
            console.error('Error to sync favicons:', error);
        }
    }

    const zoomPreventionState = Mint.createState({ preventedCount: 0 });

    const EventZoomHook = (state) => {
        document.addEventListener('keydown', async (event) => {
            if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '=' || event.key === '-')) {
                event.preventDefault();
                await new Promise(resolve => setTimeout(resolve, 1));
                state.set(currentState => ({ preventedCount: currentState.preventedCount + 1 }));
            }
        });
        document.addEventListener('wheel', async (event) => {
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                await new Promise(resolve => setTimeout(resolve, 1));
                state.set(currentState => ({ preventedCount: currentState.preventedCount + 1 }));
            }
        }, { passive: false });
    };

    EventZoomHook(zoomPreventionState);
    await SyncFavicons();

    class HighPerformanceMarkdownParser {
        constructor() {
            this.patterns = {
                heading: /^(#{1,6})\s+(.+)$/gm,
                bold: /\*\*(.*?)\*\*/g,
                italic: /\*(.*?)\*/g,
                strikethrough: /~~(.*?)~~/g,
                code: /`([^`]+)`/g,
                codeBlock: /```(\w+)?\n([\s\S]*?)```/g,
                link: /\[([^\]]+)\]\(([^)]+)\)/g,
                image: /!\[([^\]]*)\]\(([^)]+)\)/g,
                blockquote: /^>\s+(.+)$/gm,
                unorderedList: /^[-*+]\s+(.+)$/gm,
                orderedList: /^\d+\.\s+(.+)$/gm,
                horizontalRule: /^---+$/gm,
                table: /^\|(.+)\|\s*\n\|[-:|\s]+\|\s*\n((?:\|.+\|\s*\n?)*)/gm,
                taskList: /^[-*+]\s+\[([ xX])\]\s+(.+)$/gm,
                lineBreak: /\n\n+/g,
                paragraph: /^(?!#|>|[-*+]|\d+\.|```|---|\$|\|).+$/gm
            };

            this.templates = {
                'README': `# Project Title

## Description
Brief description of your project.

## Installation
\`\`\`bash
npm install
\`\`\`

## Usage
\`\`\`javascript
const example = require('./example');
console.log(example);
\`\`\`

## Features
- Feature 1
- Feature 2
- Feature 3

## Contributing
Pull requests are welcome.

## License
MIT`,
                'Documentation': `# API Documentation

## Overview
This document describes the API endpoints.

## Authentication
All requests require authentication.

### Headers
\`\`\`
Authorization: Bearer <token>
Content-Type: application/json
\`\`\`

## Endpoints

### GET /api/users
Returns a list of users.

**Response:**
\`\`\`json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
\`\`\`

### POST /api/users
Creates a new user.

**Request Body:**
\`\`\`json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
\`\`\``,
                'Blog Post': `# Blog Post Title

*Published on ${new Date().toLocaleDateString()}*

## Introduction
Start with an engaging introduction that hooks your readers.

## Main Content

### Section 1
Your first main point with supporting details.

> "A great quote that supports your point." - Author Name

### Section 2
Continue with your second main point.

#### Subsection
Break down complex topics into smaller sections.

## Code Example
\`\`\`javascript
function example() {
    console.log("Hello, world!");
}
\`\`\`

## Conclusion
Wrap up your thoughts and provide a call to action.

---

*Tags: #markdown #blog #writing*`,
                'Table Example': `# Data Table

| Name | Age | City | Occupation |
|------|-----|------|------------|
| John Doe | 30 | New York | Developer |
| Jane Smith | 25 | San Francisco | Designer |
| Bob Johnson | 35 | Chicago | Manager |
| Alice Brown | 28 | Seattle | Engineer |

## Task List

- [x] Complete project setup
- [x] Write documentation
- [ ] Add unit tests
- [ ] Deploy to production
- [ ] Conduct code review

## Statistics

> **Note:** The table above shows sample employee data.

### Summary
- Total employees: 4
- Average age: 29.5 years
- Cities represented: 4`
            };
        }

        parse(markdown) {
            if (!markdown) return '';

            const startTime = performance.now();
            let html = markdown;

            html = this.processCodeBlocks(html);
            html = this.processHeadings(html);
            html = this.processBlockquotes(html);
            html = this.processTables(html);
            html = this.processTaskLists(html);
            html = this.processLists(html);
            html = this.processInlineElements(html);
            html = this.processParagraphs(html);
            html = this.processHorizontalRules(html);

            const endTime = performance.now();
            this.lastParseTime = endTime - startTime;

            return html;
        }

        processCodeBlocks(text) {
            return text.replace(this.patterns.codeBlock, (match, lang, code) => {
                const escapedCode = this.escapeHtml(code.trim());
                return `<pre><code class="language-${lang || 'javascript'}">${escapedCode}</code></pre>`;
            });
        }

        processHeadings(text) {
            return text.replace(this.patterns.heading, (match, hashes, content) => {
                const level = hashes.length;
                const id = content.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                return `<h${level} id="${id}">${content}</h${level}>`;
            });
        }

        processBlockquotes(text) {
            return text.replace(this.patterns.blockquote, '<blockquote>$1</blockquote>');
        }

        processTables(text) {
            return text.replace(this.patterns.table, (match, header, rows) => {
                const headerCells = header.split('|').map(cell => cell.trim()).filter(cell => cell);
                const headerRow = headerCells.map(cell => `<th>${cell}</th>`).join('');

                const bodyRows = rows.trim().split('\n').map(row => {
                    const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
                    return `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
                }).join('');

                return `<table><thead><tr>${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table>`;
            });
        }

        processTaskLists(text) {
            return text.replace(this.patterns.taskList, (match, checked, content) => {
                const isChecked = checked.toLowerCase() === 'x';
                return `<div class="task-item"><input type="checkbox" ${isChecked ? 'checked' : ''} disabled> ${content}</div>`;
            });
        }

        processLists(text) {
            text = text.replace(/^([-*+]\s+.+(\n[-*+]\s+.+)*)/gm, (match) => {
                const items = match.split(/\n[-*+]\s+/).filter(item => item.trim());
                const listItems = items.map(item => `<li>${item.replace(/^[-*+]\s+/, '')}</li>`).join('');
                return `<ul>${listItems}</ul>`;
            });

            text = text.replace(/^(\d+\.\s+.+(\n\d+\.\s+.+)*)/gm, (match) => {
                const items = match.split(/\n\d+\.\s+/).filter(item => item.trim());
                const listItems = items.map(item => `<li>${item.replace(/^\d+\.\s+/, '')}</li>`).join('');
                return `<ol>${listItems}</ol>`;
            });

            return text;
        }

        processInlineElements(text) {
            text = text.replace(this.patterns.image, '<img src="$2" alt="$1" loading="lazy" />');
            text = text.replace(this.patterns.link, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
            text = text.replace(this.patterns.code, '<code>$1</code>');
            text = text.replace(this.patterns.strikethrough, '<del>$1</del>');
            text = text.replace(this.patterns.bold, '<strong>$1</strong>');
            text = text.replace(this.patterns.italic, '<em>$1</em>');

            return text;
        }

        processParagraphs(text) {
            const lines = text.split(/\n\s*\n/);
            return lines.map(line => {
                line = line.trim();
                if (!line) return '';

                if (/^<(h[1-6]|blockquote|ul|ol|pre|hr|table|div)/.test(line)) {
                    return line;
                }

                return `<p>${line}</p>`;
            }).join('\n\n');
        }

        processHorizontalRules(text) {
            return text.replace(this.patterns.horizontalRule, '<hr>');
        }

        highlightSyntax(code, language) {
            return this.escapeHtml(code);
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        getLastParseTime() {
            return this.lastParseTime || 0;
        }

        insertTemplate(templateName) {
            return this.templates[templateName] || '';
        }

        getWordCount(text) {
            return text.trim().split(/\s+/).filter(word => word.length > 0).length;
        }

        getReadingTime(text) {
            const words = this.getWordCount(text);
            const wordsPerMinute = 200;
            return Math.ceil(words / wordsPerMinute);
        }
    }

    const parser = new HighPerformanceMarkdownParser();

    let input = document.getElementById('markdown-input');
    const output = document.getElementById('html-output');
    const parseTimeEl = document.getElementById('parse-time');
    const charCountEl = document.getElementById('char-count');
    const wordCountEl = document.getElementById('word-count');
    const readingTimeEl = document.getElementById('reading-time');

    let editor = null;
    if (input && typeof CodeMirror !== 'undefined') {
        editor = CodeMirror.fromTextArea(input, {
            mode: {
                name: 'markdown',
                highlightFormatting: true,
                fencedCodeBlocks: true,
                base: 'markdown'
            },
            theme: 'monokai',
            lineNumbers: true,
            lineWrapping: false,
            autoCloseBrackets: true,
            matchBrackets: {
                bothTags: true,
                maxScanLineLength: 10000,
                maxScanLines: 1000
            },
            indentUnit: 2,
            tabSize: 4,
            placeholder: " ", // Will be replaced by rotating ones.
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            foldGutter: true,
            extraKeys: {
                "Ctrl-B": function (cm) {
                    const selection = cm.getSelection();
                    cm.replaceSelection(`**${selection}**`);
                },
                "Ctrl-I": function (cm) {
                    const selection = cm.getSelection();
                    cm.replaceSelection(`*${selection}*`);
                },
                "Ctrl-K": function (cm) {
                    const selection = cm.getSelection();
                    cm.replaceSelection(`[${selection}](url)`);
                },
                "Ctrl-`": function (cm) {
                    const selection = cm.getSelection();
                    cm.replaceSelection(`\`${selection}\``);
                },
                // Ctrl+S is handled by a global listener now to ensure it works even outside the editor.
                "Ctrl-Space": "autocomplete"
            }
        });

        // Add overlay for /command syntax highlighting
        CodeMirror.defineMode("slash-command-overlay", function (config, parserConfig) {
            var overlay = {
                token: function (stream, state) {
                    if (stream.sol() && stream.match(/^[\s]*\/[a-zA-Z].*$/)) {
                        stream.skipToEnd();
                        return "command";
                    }
                    while (!stream.eol()) stream.next();
                    return null;
                }
            };
            return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || "markdown"), overlay);
        });

        const placeholders = [
            "Input Your Markdown Syntax Here...",
            "Type /help to see all commands...",
            "Paste an image directly from your clipboard...",
            "Press Ctrl+S to save your work...",
            "Try our templates! Click on 'Templates' above."
        ];
        let placeholderIndex = 0;
        const placeholderEl = editor.getWrapperElement().querySelector('.CodeMirror-placeholder');

        if (placeholderEl) {
            placeholderEl.style.opacity = '0.7';

            let typewriterTimeout;
            let rotationInterval;

            const type = (text, i = 0) => {
                if (i < text.length) {
                    placeholderEl.textContent = text.slice(0, i + 1);
                    typewriterTimeout = setTimeout(() => type(text, i + 1), 50);
                }
            };

            const startAnimation = () => {
                const run = () => {
                    clearTimeout(typewriterTimeout);
                    type(placeholders[placeholderIndex]);
                    placeholderIndex = (placeholderIndex + 1) % placeholders.length;
                };
                run();
                rotationInterval = setInterval(run, 3000);
            };

            const stopAnimation = () => {
                clearTimeout(typewriterTimeout);
                clearInterval(rotationInterval);
                placeholderEl.textContent = '';
            };

            const onFirstChange = (cm) => {
                if (cm.getValue() !== '') {
                    stopAnimation();
                    editor.off('change', onFirstChange);
                }
            };

            // Start animation only if editor is empty
            if (editor.getValue() === '') {
                startAnimation();
                editor.on('change', onFirstChange);
            }
        }

        window.editor = editor;

        // resetStr(); --force :reset=all & resetStr(); :reset
        editor.on('keydown', function (cm, event) {
            if ((event.key === 'Enter' || event.keyCode === 13)) {
                const value = cm.getValue().trim();
                if (typeof window.resetStr === 'function' && (value === 'resetStr(); --force' || value === ':reset=all')) {
                    window.resetStr();
                    cm.setValue('');
                    if (typeof showNotification === 'function') {
                        showNotification('Storage cleared!', 'success');
                    } else {
                        alert('Storage cleared!');
                    }
                    event.preventDefault();
                } else if (typeof window.cleanLocalStorageForMintputs === 'function' && (value === 'resetStr();' || value === ':reset')) {
                    window.cleanLocalStorageForMintputs();
                    cm.setValue('');
                    if (typeof showNotification === 'function') {
                        showNotification('Storage cleaned!', 'success');
                    } else {
                        alert('Storage cleaned!');
                    }
                    event.preventDefault();
                } else if ((/^resetThis\s*\(\)\s*;?.*/.test(value) || value === 'resetThis' || value === ':clear') && typeof clearAll === 'function') {
                    clearAll();
                    cm.setValue('');
                    if (typeof showNotification === 'function') {
                        showNotification('Cleared!', 'success');
                    } else {
                        alert('Cleared!');
                    }
                    event.preventDefault();
                } else if (/^binary\s+(-?\d+(?:\.\d+)?)\s*$/.test(value)) {
                    const match = value.match(/^binary\s+(-?\d+(?:\.\d+)?)\s*$/);
                    const number = parseFloat(match[1]);

                    if (window.binaryConverterModule) {
                        try {
                            let result = '';
                            if (Number.isInteger(number)) {
                                // Integer to binary
                                const binaryPtr = window.binaryConverterModule._int_to_binary(number);
                                const binary = window.binaryConverterModule.UTF8ToString(binaryPtr);
                                result = `Integer ${number} → Binary: ${binary}`;
                            } else {
                                // Float to binary
                                const binaryPtr = window.binaryConverterModule._float_to_binary(number);
                                const binary = window.binaryConverterModule.UTF8ToString(binaryPtr);
                                const sign = window.binaryConverterModule._get_sign_bit(number);
                                const exponent = window.binaryConverterModule._get_exponent(number);
                                const mantissa = window.binaryConverterModule._get_mantissa(number);
                                result = `Float ${number} → Binary: ${binary}\nSign=${sign}, Exponent=${exponent}, Mantissa=${mantissa}`;
                            }

                            cm.setValue(result);
                            if (typeof showNotification === 'function') {
                                showNotification('Conversion completed!', 'success');
                            }
                        } catch (error) {
                            cm.setValue(`Error: ${error.message}`);
                            if (typeof showNotification === 'function') {
                                showNotification('Binary conversion failed!', 'error');
                            }
                        }
                    } else {
                        cm.setValue('Module not loaded');
                        if (typeof showNotification === 'function') {
                            return;
                        }
                    }
                    event.preventDefault();
                } else if (/^binary2int\s+([01]+)\s*$/.test(value)) {
                    const match = value.match(/^binary2int\s+([01]+)\s*$/);
                    const binaryStr = match[1];

                    if (window.binaryConverterModule) {
                        try {
                            const binaryPtr = window.binaryConverterModule._malloc(binaryStr.length + 1);
                            window.binaryConverterModule.stringToUTF8(binaryStr, binaryPtr, binaryStr.length + 1);
                            const result = window.binaryConverterModule._binary_to_int(binaryPtr);
                            window.binaryConverterModule._free(binaryPtr);

                            cm.setValue(`Binary ${binaryStr} → Integer: ${result}`);
                            if (typeof showNotification === 'function') {
                                showNotification('Binary to integer conversion completed', 'success');
                            }
                        }
                        catch (error) {
                            cm.setValue(`Error: ${error.message}`);
                            if (typeof showNotification === 'function') {
                                showNotification('Binary to integer conversion failed', 'error');
                            }
                        }
                    } else {
                        return;
                    }
                    event.preventDefault();
                } else if (/^binary2float\s+([01]{32})\s*$/.test(value)) {
                    const match = value.match(/^binary2float\s+([01]{32})\s*$/);
                    const binaryStr = match[1];

                    if (window.binaryConverterModule) {
                        try {
                            const binaryPtr = window.binaryConverterModule._malloc(binaryStr.length + 1);
                            window.binaryConverterModule.stringToUTF8(binaryStr, binaryPtr, binaryStr.length + 1);
                            const result = window.binaryConverterModule._binary_to_float(binaryPtr);
                            window.binaryConverterModule._free(binaryPtr);

                            cm.setValue(`Binary ${binaryStr} → Float: ${result}`);
                            if (typeof showNotification === 'function') {
                                showNotification('Binary to float conversion completed', 'success');
                            }
                        }
                        catch (error) {
                            cm.setValue(`Error: ${error.message}`);
                            if (typeof showNotification === 'function') {
                                showNotification('Binary to float conversion failed', 'error');
                            }
                        }
                    } else {
                        return;
                    }
                    event.preventDefault();
                } else if (
                    /^[\d\s\+\-\*\/\(\)\.]+$/.test(value.replace(/\n/g, '')) &&
                    /[\+\-\*\/\(\)]/.test(value)
                ) {
                    try {
                        const expr = value.replace(/\s+/g, '');
                        // ป้องกัน empty string
                        if (expr.length === 0) throw new Error('Empty expression');
                        // eslint-disable-next-line no-new-func
                        const result = Function(`"use strict";return (${expr})`)();
                        if (typeof result === 'number' && isFinite(result)) {
                            cm.setValue(`${result}`);
                            setTimeout(() => {
                                const doc = cm.getDoc();
                                const lastLine = doc.lastLine();
                                const lastCh = doc.getLine(lastLine).length;
                                doc.setCursor({ line: lastLine, ch: lastCh });
                            }, 0);
                        } else {
                            if (typeof showNotification === 'function') {
                                showNotification('Invalid math expression', 'error');
                            }
                        }
                    } catch (err) {
                        if (typeof showNotification === 'function') {
                            showNotification('Invalid math expression', 'error');
                        }
                    }
                    event.preventDefault();
                    return;
                }
            }
        });

        const originalInput = input;
        input = {
            value: '',
            addEventListener: function (type, handler) {
                if (type === 'input') {
                    editor.on('change', handler);
                } else if (type === 'paste') {
                    editor.on('paste', handler);
                } else if (type === 'keydown') {
                    editor.on('keydown', handler);
                }
            },
            focus: function () {
                editor.focus();
            },
            setSelectionRange: function (start, end) {
                editor.setSelection({ line: 0, ch: start }, { line: 0, ch: end });
            },
            get selectionStart() {
                const pos = editor.getCursor();
                return editor.indexFromPos(pos);
            },
            get selectionEnd() {
                const pos = editor.getCursor();
                return editor.indexFromPos(pos);
            },
            set value(val) {
                editor.setValue(val);
            },
            get value() {
                return editor.getValue();
            }
        };

        originalInput.style.display = 'none';

        const cmElement = editor.getWrapperElement();
        cmElement.style.height = '100%';
        cmElement.style.fontSize = '14px';
        cmElement.style.lineHeight = '1.6';

        const updateCodeMirrorTheme = (isDark) => {
            if (isDark) {
                editor.setOption('theme', 'monokai');
            } else {
                editor.setOption('theme', 'default');
            }
        };

        if (window.WebContent && window.WebContent.setThemeChangeCallback) {
            window.WebContent.setThemeChangeCallback(updateCodeMirrorTheme);
        }

        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        updateCodeMirrorTheme(prefersDark);

        setTimeout(() => {
            editor.refresh();
            editor.setOption('mode', editor.getOption('mode'));
            editor.on('change', function () {
                setTimeout(() => {
                    editor.refresh();
                }, 10);
            });
            editor.on('cursorActivity', function () {
                editor.refresh();
            });
            setTimeout(() => {
                editor.setOption('mode', {
                    name: 'markdown',
                    highlightFormatting: true,
                    fencedCodeBlocks: true,
                    base: 'markdown'
                });
                editor.setOption('mode', { name: 'slash-command-overlay', backdrop: 'markdown' });
            }, 250);
        }, 100);

        setupIntellisense(editor);
    }

    if (typeof CodeMirror !== 'undefined') {
        CodeMirror.defineMIME("text/x-go", "go");
        CodeMirror.defineMIME("text/x-php", "php");
        CodeMirror.defineMIME("text/x-sql", "sql");
        CodeMirror.defineMIME("text/x-yaml", "yaml");
        CodeMirror.defineMIME("text/x-toml", "toml");
        CodeMirror.defineMIME("text/x-vue", "vue");
        CodeMirror.defineMIME("text/x-swift", "swift");
        CodeMirror.defineMIME("text/x-perl", "perl");
        CodeMirror.defineMIME("text/x-powershell", "powershell");
        CodeMirror.defineMIME("text/x-sass", "sass");
        CodeMirror.defineMIME("text/x-stex", "stex");

        CodeMirror.defineMIME("text/x-typescript", "typescript");
        CodeMirror.defineMIME("text/x-jsx", "jsx");
        CodeMirror.defineMIME("text/x-coffeescript", "coffeescript");
        CodeMirror.defineMIME("text/x-lua", "lua");
        CodeMirror.defineMIME("text/x-erlang", "erlang");
        CodeMirror.defineMIME("text/x-haskell", "haskell");
        CodeMirror.defineMIME("text/x-elm", "elm");
        CodeMirror.defineMIME("text/x-fortran", "fortran");
        CodeMirror.defineMIME("text/x-octave", "octave");
        CodeMirror.defineMIME("text/x-r", "r");
        CodeMirror.defineMIME("text/x-julia", "julia");
        CodeMirror.defineMIME("text/x-d", "d");
        CodeMirror.defineMIME("text/x-nginx", "nginx");
        CodeMirror.defineMIME("text/x-apache", "apache");
        CodeMirror.defineMIME("text/x-properties", "properties");
        CodeMirror.defineMIME("text/x-ini", "ini");
        CodeMirror.defineMIME("text/x-cmake", "cmake");
        CodeMirror.defineMIME("text/x-makefile", "makefile");
        CodeMirror.defineMIME("text/x-diff", "diff");

        CodeMirror.defineMIME("text/x-js", "javascript");
        CodeMirror.defineMIME("text/x-ts", "typescript");
        CodeMirror.defineMIME("text/x-tsx", "jsx");
        CodeMirror.defineMIME("text/x-coffee", "coffeescript");
        CodeMirror.defineMIME("text/x-bash", "shell");
        CodeMirror.defineMIME("text/x-sh", "shell");
        CodeMirror.defineMIME("text/x-zsh", "shell");
        CodeMirror.defineMIME("text/x-fish", "shell");
        CodeMirror.defineMIME("text/x-c", "clike");
        CodeMirror.defineMIME("text/x-cpp", "clike");
        CodeMirror.defineMIME("text/x-csharp", "clike");
        CodeMirror.defineMIME("text/x-java", "clike");
        CodeMirror.defineMIME("text/x-scala", "clike");
        CodeMirror.defineMIME("text/x-kotlin", "clike");
        CodeMirror.defineMIME("text/x-html", "htmlmixed");
        CodeMirror.defineMIME("text/x-xml", "xml");
        CodeMirror.defineMIME("text/x-json", "application/json");
        CodeMirror.defineMIME("text/x-css", "css");
        CodeMirror.defineMIME("text/x-scss", "sass");
        CodeMirror.defineMIME("text/x-less", "css");
        CodeMirror.defineMIME("text/x-stylus", "css");
        CodeMirror.defineMIME("text/x-markdown", "markdown");
        CodeMirror.defineMIME("text/x-md", "markdown");
        CodeMirror.defineMIME("text/x-gfm", "gfm");

        CodeMirror.defineMIME("text/x-config", "properties");
        CodeMirror.defineMIME("text/x-env", "properties");
        CodeMirror.defineMIME("text/x-gitignore", "properties");
        CodeMirror.defineMIME("text/x-editorconfig", "properties");
    }

    if (!input) {
        console.error("Markdown input element ('markdown-input') not found. Markdown editor functionality will be disabled.");
        if (output) {
            Mint.injectHTML('#html-output', "<p style='color:red;'>Error: Markdown input UI component failed to load. Please refresh.</p>");
        }
        return;
    }

    if (!output || !parseTimeEl || !charCountEl) {
        console.warn("One or more Markdown UI elements not found. Some UI features might be affected.");
    }

    let isTyping = false;
    let isTypewriterActive = false;

    function parseMarkdown() {
        const markdown = input.value;
        const html = parser.parse(markdown);
        const wordCount = parser.getWordCount(markdown);
        const readingTime = parser.getReadingTime(markdown);

        if (output) Mint.injectHTML('#html-output', html);
        if (parseTimeEl) parseTimeEl.textContent = `${parser.getLastParseTime().toFixed(2)}ms`;
        if (charCountEl) charCountEl.textContent = `${markdown.length}`;
        if (wordCountEl) wordCountEl.textContent = `${wordCount}`;
        if (readingTimeEl) readingTimeEl.textContent = `${readingTime} min`;
    }

    function clearAll() {
        input.value = '';
        if (output) Mint.injectHTML('#html-output', '');
        if (parseTimeEl) parseTimeEl.textContent = '0ms';
        if (charCountEl) charCountEl.textContent = '0';
        if (wordCountEl) wordCountEl.textContent = '0';
        if (readingTimeEl) readingTimeEl.textContent = '0 min';
    }

    function copyHtml() {
        if (!output) {
            console.error('HTML output element not found for copyHtml.');
            alert('Error: Cannot copy HTML, output display area not found.');
            return;
        }
        const html = output.innerHTML;
        navigator.clipboard.writeText(html).then(() => {
            showNotification('HTML copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy HTML: ', err);
            showNotification('Failed to copy HTML', 'error');
        });
    }

    function copyMarkdown() {
        const markdown = input.value;
        navigator.clipboard.writeText(markdown).then(() => {
            showNotification('Markdown copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy Markdown: ', err);
            showNotification('Failed to copy Markdown', 'error');
        });
    }

    function downloadMarkdown() {
        const markdown = input.value;
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('Markdown downloaded!', 'success');
    }

    function downloadHtml() {
        if (!output) {
            showNotification('No HTML output available', 'error');
            return;
        }
        const html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Documents</title>\n    <style>\n@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=Anuphan:wght@400;600;700&display=swap');\n\n*,\n*::before,\n*::after {\n    box-sizing: border-box;\n    margin: 0;\n    padding: 0;\n}\n\nhtml {\n    line-height: var(--line-height-normal);\n    -webkit-text-size-adjust: 100%;\n    -moz-text-size-adjust: 100%;\n    text-size-adjust: 100%;\n    -webkit-tap-highlight-color: transparent;\n    scroll-behavior: smooth;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n    text-rendering: optimizeLegibility;\n}\n\n:root {\n  --text: #000;\n  --background: #faf9f5;\n  --muted: #666;\n  --border: #a7a6a3;\n  --code-bg: #eae9e5;\n  --heading-border: #a7a6a3;\n  --Links: color:rgb(50, 50, 153);\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --text: #f4f4f4;\n    --background: #141414;\n    --muted: #999;\n    --border: #343434;\n    --code-bg: #1f1f1f;\n    --heading-border: #333;\n    --Links: color:hsla(240, 85%, 69%, 1.00);\n  }\n}\n\nbody {\n  font-family: 'Inter Tight', 'Anuphan', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n  max-width: 600px;\n  margin: 0 auto;\n  padding: 2.5rem;\n  line-height: 1.75;\n  color: var(--text);\n  background-color: var(--background);\n  animation: fadeIn 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);\n}\n\n@keyframes fadeIn {\n  100% {\n    opacity: 0;\n  }\n  70% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n\np {\n  margin: 0 0 1.5rem;\n}\n\nh1, h2, h3, h4, h5, h6 {\n  margin-top: 24px;\n  margin-bottom: 16px;\n  font-weight: 600;\n  line-height: 1.25; \n}\n\nh1 {\n  font-size: 2em;\n  border-bottom: 1px solid var(--heading-border);\n  padding-bottom: 10px;\n}\n\nh2 {\n  font-size: 1.5em;\n  border-bottom: 1px solid var(--heading-border);\n  padding-bottom: 8px;\n}\n\nh3 { font-size: 1.7em; }\nh4 { font-size: 1.425em; }\nh5 { font-size: 1.245em; }\nh6 { font-size: 1em; }\n\na {\n    color: var(--Links);\n    text-decoration: underline;\n    transition: color 0.2s ease;\n    line-height: 0;\n    height: 30px;\n    display: inline-block;\n    align-content: center;\n    text-decoration: none;\n    border-bottom: solid 1px currentColor;\n}\n\na:hover, a:focus {\n  color: var(--muted);\n}\n\ncode {\n  background: var(--code-bg);\n  padding: 2px 4px;\n  border-radius: 3px;\n  font-family: Consolas, Menlo, Monaco, "Courier New", monospace;\n  font-size: 0.95em;\n}\n\npre {\n  background: var(--code-bg);\n  padding: 16px;\n  border-radius: 6px;\n  overflow-x: auto;\n  margin: 0 0 1.5rem;\n}\n\npre code {\n  background: none;\n  padding: 0;\n  border-radius: 0;\n  font-size: 0.95em;\n  color: inherit;\n}\n\nblockquote {\n  border-left: 4px solid var(--border);\n  margin: 0 0 1.5rem;\n  padding-left: 16px;\n  color: var(--muted);\n  font-style: italic;\n}\n\nul, ol {\n  margin: 0 0 1.5rem 1.5rem;\n  padding: 0;\n  margin-top: 1rem;\n}\n\nli {\n  margin-bottom: 0.5rem;\n}\n\nli > ul, li > ol {\n  margin-top: 0.5rem;\n}\n\nhr {\n  border: none;\n  border-top: 1px solid var(--border);\n  margin: 2rem 0;\n}\n\ntable {\n  border-collapse: collapse;\n  width: 100%;\n  margin-bottom: 1.5rem;\n}\n\nth, td {\n  border: 1px solid var(--border);\n  padding: 8px 12px;\n  text-align: left;\n}\n\nth {\n  background: var(--code-bg);\n  font-weight: 600;\n}\n\nimg {\n  max-width: 100%;\n  height: auto;\n  display: block;\n  margin: 1rem auto;\n}\n\ninput[type="checkbox"],\ninput[type="radio"] {\n    width: 1rem;\n    height: 1rem;\n    padding: 0;\n    margin-right: var(--space-2);\n    accent-color: var(--color-interactive-primary);\n    margin-right: 0.3rem;\n    transform: translateY(1.5px);\n}\n\nimg,\nvideo,\naudio,\niframe,\nembed,\nobject {\n    max-width: 100%;\n    height: auto;\n    display: block;\n}\n\nfigcaption {\n    font-size: var(--font-size-sm);\n    color: var(--color-text-secondary);\n    text-align: center;\n    margin-top: var(--space-2);\n    font-style: italic;\n}\n\nsection,\narticle,\naside,\nnav {\n    display: block;\n}\n\n@media (max-width: 640px) {\n  body {\n    padding: 1.5rem;\n  }\n}\n    </style>\n</head>\n<body>\n${output.innerHTML}\n</body>\n</html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('HTML downloaded!', 'success');
    }

    function insertTemplate(templateName) {
        const template = parser.insertTemplate(templateName);
        if (template) {
            if (typeof editor !== 'undefined' && editor) {
                typewriterInsertCM5(editor, template, 10, () => {
                    parseMarkdown();
                    showNotification(`${templateName} template loaded!`, 'success');
                });
            } else if (input && input.tagName === 'TEXTAREA') {
                let i = 0;
                input.value = '';
                function typeNext() {
                    input.value += template[i++];
                    if (i < template.length) {
                        setTimeout(typeNext, 10);
                    } else {
                        parseMarkdown();
                        // showNotification(`${templateName} template loaded!`, 'success');
                    }
                }
                typeNext();
            } else {
                input.value = template;
                parseMarkdown();
                // showNotification(`${templateName} template loaded!`, 'success');
            }
        }
    }

    function insertText(before, after = '', placeholder = '') {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const selectedText = input.value.substring(start, end);
        const textToInsert = selectedText || placeholder;
        const newText = before + textToInsert + after;

        input.value = input.value.substring(0, start) + newText + input.value.substring(end);

        const newCursorPos = start + before.length + textToInsert.length;
        input.focus();
        input.setSelectionRange(newCursorPos, newCursorPos + after.length);

        parseMarkdown();
    }

    function formatBold() { insertText('**', '**', 'bold text'); }
    function formatItalic() { insertText('*', '*', 'italic text'); }
    function formatCode() { insertText('`', '`', 'code'); }
    function formatStrikethrough() { insertText('~~', '~~', 'strikethrough'); }
    function insertLink() { insertText('[', '](url)', 'link text'); }
    function insertImage() { insertText('![', '](image-url)', 'alt text'); }
    function insertTable() {
        const table = `| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Row 1 Col 1 | Row 1 Col 2 | Row 1 Col 3 |\n| Row 2 Col 1 | Row 2 Col 2 | Row 2 Col 3 |`;
        insertText(table);
    }

    function getEditorContent() {
        if (typeof editor !== 'undefined' && editor) {
            return editor.getValue();
        }
        const input = document.getElementById('markdown-input');
        return input ? input.value : '';
    }

    function updateRecents(filename) {
        if (!filename) return;
        let recents = JSON.parse(localStorage.getItem('mintputs_recents') || '[]');
        recents = recents.filter(f => f !== filename);
        recents.unshift(filename);
        if (recents.length > 20) recents.length = 20;
        localStorage.setItem('mintputs_recents', JSON.stringify(recents));
        if (typeof window.updateRecentsUI === 'function') {
            window.updateRecentsUI();
        }
    }

    function createNewFile() {
        const newFileName = `Untitled file - ${untitledFileCounter++}`;

        // save current file if needed
        if (window.currentFileName) {
            saveActiveFile(); // Use the improved save function
        }

        // Create a new file
        setActiveFile(newFileName, '');
        updateRecents(newFileName);

        if (typeof showNotification === 'function') {
            showNotification('New file created!', 'success');
        }
    }

    function saveActiveFile(force = false) {
        if (!window.currentFileName || window.currentFileName.startsWith('Untitled file')) {
            window.mint_showSaveModal(
                (newName) => {
                    if (newName) {
                        // If there was an old "Untitled" file, we need to remove it from recents
                        if(window.currentFileName && window.currentFileName.startsWith('Untitled file')) {
                            let recents = JSON.parse(localStorage.getItem('mintputs_recents') || '[]');
                            recents = recents.filter(f => f !== window.currentFileName);
                            localStorage.setItem('mintputs_recents', JSON.stringify(recents));
                        }

                        window.currentFileName = newName;
                        const content = getEditorContent();
                        try {
                            localStorage.setItem(`mintputs_file_${window.currentFileName}`, content);
                            window.lastSavedContent = content;
                            updateRecents(window.currentFileName);
                            if (typeof showNotification === 'function') {
                                showNotification('File saved', 'success');
                            }
                            // Update the UI with the new name
                            const currentFileEl = document.getElementById('CurrentFiles');
                            if (currentFileEl) {
                                currentFileEl.textContent = newName;
                            }
                            if (typeof window.updateRecentsUI === 'function') {
                                window.updateRecentsUI();
                            }
                        } catch (error) {
                            if (typeof showNotification === 'function') {
                                showNotification('Failed to save file', 'error');
                            }
                            console.error('Save error:', error);
                        }
                    } else {
                        showNotification('Save cancelled.', 'info');
                    }
                },
                () => {
                    showNotification('Save cancelled.', 'info');
                },
                'Create New File', // modalTitle
                'Create' // confirmButtonText
            );
            return false;
        }

        const content = getEditorContent();

        if (!force && content === window.lastSavedContent) {
            return true; // No changes, no need to save
        }

        try {
            localStorage.setItem(`mintputs_file_${window.currentFileName}`, content);
            window.lastSavedContent = content;
            updateRecents(window.currentFileName);

            if (force && typeof showNotification === 'function') {
                showNotification('File saved', 'success');
            }

            return true;
        } catch (error) {
            if (typeof showNotification === 'function') {
                showNotification('Failed to save file', 'error');
            }
            console.error('Save error:', error);
            return false;
        }
    }

    function setupAutoSave() {
        let autoSaveTimer;

        const performAutoSave = () => {
            const content = input.value;
            if (content && content.trim().length > 0) {
                try {
                    const autoSaveData = {
                        content: content,
                        timestamp: new Date().getTime(),
                        saved: new Date().toISOString()
                    };
                    localStorage.setItem('mintputs_autosave', JSON.stringify(autoSaveData));
                } catch (error) {
                    console.warn('Auto-save failed:', error);
                }
            }
        };

        // Auto-save every 30 seconds if there are changes
        const startAutoSave = () => {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                performAutoSave();
                startAutoSave(); 
            }, 30000); 
        };

        // Auto-save on content change
        input.addEventListener('input', () => {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(performAutoSave, 2000); // Save after 2 seconds 
        });

        startAutoSave();
    }

    // Function to recover from auto-save
    function recoverFromAutoSave() {
        try {
            const autoSaveData = localStorage.getItem('mintputs_autosave');
            if (autoSaveData) {
                const parsed = JSON.parse(autoSaveData);
                const timeDiff = new Date().getTime() - parsed.timestamp;

                // Only offer recovery if auto-save is less than 24 hours old
                if (timeDiff < 24 * 60 * 60 * 1000) {
                    const recover = confirm(
                        `Found auto-saved content from ${new Date(parsed.saved).toLocaleString()}. ` +
                        'Do you want to recover it?'
                    );

                    if (recover) {
                        input.value = parsed.content;
                        parseMarkdown();
                        showNotification('Content recovered from auto-save!', 'success');
                        return true;
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to recover auto-save:', error);
        }
        return false;
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (!input.value || input.value.trim().length === 0) {
            recoverFromAutoSave();
        }

        setupAutoSave();
    });

    window.NewFile = createNewFile;
    window.recoverFromAutoSave = recoverFromAutoSave;


    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 0.35rem 0.8rem;
            border-radius: 8px;
            color: white;
            font-weight: 520;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
            font-family: "Inter Tight", Anuphan, sans-serif;
            ${type === 'success' ? 'background:rgb(28, 133, 98);' : type === 'error' ? 'background: #ef4444;' : 'background: #3b82f6;'}
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    window.parseMarkdown = parseMarkdown;
    window.clearAll = clearAll;
    window.copyHtml = copyHtml;
    window.copyMarkdown = copyMarkdown;
    window.downloadMarkdown = downloadMarkdown;
    window.downloadHtml = downloadHtml;
    window.insertTemplate = insertTemplate;
    window.formatBold = formatBold;
    window.formatItalic = formatItalic;
    window.formatCode = formatCode;
    window.formatStrikethrough = formatStrikethrough;
    window.insertLink = insertLink;
    window.insertImage = insertImage;
    window.insertTable = insertTable;

    let debounceTimer;
    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(parseMarkdown, 100);
    });

    input.addEventListener('paste', async (event) => {
        try {
            const clipboardData = event.clipboardData || (event.originalEvent && event.originalEvent.clipboardData);
            if (!clipboardData || !clipboardData.items) {
                return;
            }

            let imageFile = null;
            for (const item of clipboardData.items) {
                if (item && item.type && item.type.indexOf('image') !== -1) {
                    imageFile = item.getAsFile();
                    break;
                }
            }

            if (imageFile) {
                event.preventDefault();
                showNotification('Image pasting...', 'info');

                const reader = new FileReader();
                reader.onload = function (e) {
                    const base64Image = e.target.result;
                    const timestamp = new Date().getTime();
                    const htmlImageTag = `<img src="${base64Image}" alt="Pasted Image ${timestamp}" loading="lazy" />`;
                    insertText(htmlImageTag, '', '');
                    showNotification('Image pasted', 'success');
                };
                reader.onerror = function () {
                    showNotification('Failed to read image file.', 'error');
                };
                reader.readAsDataURL(imageFile);
            }
        } catch (error) {
            console.warn('Paste error:', error);
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.code) {
                case 'KeyB':
                    e.preventDefault();
                    formatBold();
                    break;
                case 'KeyI':
                    e.preventDefault();
                    formatItalic();
                    break;
                case 'KeyK':
                    e.preventDefault();
                    insertLink();
                    break;
                case 'Backquote':
                    e.preventDefault();
                    formatCode();
                    break;
            }
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            const start = input.selectionStart;
            const end = input.selectionEnd;
            input.value = input.value.substring(0, start) + '  ' + input.value.substring(end);
            input.selectionStart = input.selectionEnd = start + 2;
        }
    });

    parseMarkdown();

    // Dropdown
    const toggle = document.getElementById('ToggleDropdownPreset');
    const menu = document.getElementById('DropdownPresetMenu');
    if (toggle && menu) {
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            menu.classList.toggle('open');
        });
        document.addEventListener('click', function () {
            menu.classList.remove('open');
        });
    }

    const titleLinksContainer = document.getElementById('TitleLinks');
    const mainContentSection = document.querySelector('.main-content');
    const outputSection = document.querySelector('.output-section');

    if (titleLinksContainer && mainContentSection && outputSection) {
        const links = titleLinksContainer.querySelectorAll('a');

        links.forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault();

                const currentHighlighted = titleLinksContainer.querySelector('#Highlight');
                if (currentHighlighted && currentHighlighted !== this) {
                    const baseId = currentHighlighted.getAttribute('data-base-id');
                    if (baseId) {
                        currentHighlighted.id = baseId;
                    } else {
                        currentHighlighted.removeAttribute('id');
                    }
                }

                this.id = 'Highlight';

                const clickedBaseId = this.getAttribute('data-base-id');
                if (clickedBaseId === 'ToggleHTMLOUTPUT') {
                    mainContentSection.style.display = 'none';
                    outputSection.style.display = 'flex';
                } else if (clickedBaseId === 'ToggleMDEditer') {
                    mainContentSection.style.display = 'flex';
                    outputSection.style.display = 'none';
                }
            });
        });
    } else {
        console.warn('(TitleLinks, main-content, output-section) not found.');
    }

    // Active File Management & Auto Save
    window.currentFileName = null;
    let lastSavedContent = '';
    let autoSaveTimer = null;

    function setActiveFile(filename, content = '') {
        window.currentFileName = filename;
        window.lastSavedContent = content;

        // Sync
        if (typeof editor !== 'undefined' && editor && editor.setValue) {
            editor.setValue(content);
        } else {
            const input = document.getElementById('markdown-input');
            if (input) input.value = content;
        }

        const currentFileEl = document.getElementById('CurrentFiles');
        if (currentFileEl) {
            currentFileEl.textContent = filename;
        }
    }

    function setupAutoSaveActiveFile() {
        if (autoSaveTimer) clearInterval(autoSaveTimer);
        autoSaveTimer = setInterval(() => {
            saveActiveFile();
        }, 5000); // auto save
        if (typeof editor !== 'undefined' && editor) {
            editor.on('change', () => {
                saveActiveFile();
            });
        } else if (input && input.addEventListener) {
            input.addEventListener('input', () => {
                saveActiveFile();
            });
        }
    }

    function switchFile(filename) {
        if (!filename) return false;

        // save old file first
        if (window.currentFileName) {
            saveActiveFile();
        }

        try {
            const content = localStorage.getItem(`mintputs_file_${filename}`) || '';
            setActiveFile(filename, content);
            updateRecents(filename);

            // trigger parsing
            if (typeof window.parseMarkdown === 'function') {
                window.parseMarkdown();
            }

            if (typeof showNotification === 'function') {
                // showNotification(`Loaded: ${filename}`, 'info');
            }

            return true;
        } catch (error) {
            if (typeof showNotification === 'function') {
                showNotification('Failed to load file', 'error');
            }
            console.error('Load error:', error);
            return false;
        }
    }

    function createNewFileWithName(filename) {
        setActiveFile(filename, '');
        let recents = JSON.parse(localStorage.getItem('mintputs_recents') || '[]');
        recents = recents.filter(f => f !== filename);
        recents.unshift(filename);
        localStorage.setItem('mintputs_recents', JSON.stringify(recents));
        if (typeof window.updateRecentsUI === 'function') window.updateRecentsUI();
        showNotification('New file created: ' + filename, 'success');
    }

    function renameActiveFile(newName) {
        if (!window.currentFileName) {
            if (typeof showNotification === 'function') {
                showNotification('No active file to rename', 'warning');
            }
            return false;
        }

        if (newName === window.currentFileName) {
            return true;
        }

        try {
            // Chenge content
            const content = getEditorContent();
            localStorage.setItem(`mintputs_file_${newName}`, content);
            localStorage.removeItem(`mintputs_file_${window.currentFileName}`);

            let recents = JSON.parse(localStorage.getItem('mintputs_recents') || '[]');
            recents = recents.map(f => f === window.currentFileName ? newName : f);
            localStorage.setItem('mintputs_recents', JSON.stringify(recents));

            window.currentFileName = newName;
            window.lastSavedContent = content;

            const currentFileEl = document.getElementById('CurrentFiles');
            if (currentFileEl) {
                currentFileEl.textContent = newName;
            }

            updateRecentsUI();

            if (typeof showNotification === 'function') {
                showNotification(`Renamed to: ${newName}`, 'success');
            }

            return true;
        } catch (error) {
            if (typeof showNotification === 'function') {
                showNotification('Failed to rename file', 'error');
            }
            console.error('Rename error:', error);
            return false;
        }
    }

    // Buttons/Menus switch, new, rename (UI Can call by here)
    window.switchFile = switchFile;
    window.createNewFileWithName = createNewFileWithName;
    window.renameActiveFile = renameActiveFile;

    setupAutoSaveActiveFile();

    window.updateRecentsUI = function updateRecentsUI() {
        const recentsDiv = document.querySelector('.RecentsFiles');
        if (!recentsDiv) return;

        const recents = JSON.parse(localStorage.getItem('mintputs_recents') || '[]');
        const ul = document.createElement('ul');

        recents.forEach(filename => {
            const li = document.createElement('li');
            const a = document.createElement('a');

            a.href = 'javascript:void(0)';
            a.textContent = filename;
            a.onclick = () => switchFile(filename);

            // #CurrentFiles
            if (filename === window.currentFileName) {
                li.classList.add('active');
            }

            li.appendChild(a);
            ul.appendChild(li);
        });

        recentsDiv.innerHTML = '';
        recentsDiv.appendChild(ul);
    };

    setTimeout(() => {
        try {
            const currentFileEl = document.getElementById('CurrentFiles');
            const label = currentFileEl ? (currentFileEl.textContent || '').trim() : '';
            if (label && label.toLowerCase() !== 'untitled') {
                if (!window.currentFileName) setActiveFile(label);
            } else {
                const recents = JSON.parse(localStorage.getItem('mintputs_recents') || '[]');
                if (recents.length > 0) {
                    const name = recents[0];
                    const raw = localStorage.getItem('mintputs_file_' + name);
                    let content = '';
                    if (raw) { try { content = decodeURIComponent(raw); } catch (e) { content = raw; } }
                    setActiveFile(name, content);
                }
            }
        } catch (e) {
            console.warn('Initial active file sync failed:', e);
        }
        if (typeof window.updateRecentsUI === 'function') window.updateRecentsUI();
    }, 200);

    // Ctrl+S to save current active file silently (no popup)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            saveActiveFile(true);
        }
    });
};
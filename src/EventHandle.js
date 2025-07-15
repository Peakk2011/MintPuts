import { Mint } from './mintkit/mint.js';
import '/Content.js';

export const Webfunctions = async (Main) => {
    async function SyncFavicons() {
        try {
            const faviconLink = document.getElementById('favicon');
            if (!faviconLink) {
                console.error('id="favicon" not found.');
                return;
            }
            const lightModeFaviconPath = '/assets/FavIcons/lightmode.svg';
            const darkModeFaviconPath = '/assets/FavIcons/darkmode.svg';
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
                paragraph: /^(?!#|>|[-*+]|\d+\.|```|---|$|\|).+$/gm
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
            lineWrapping: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            indentUnit: 2,
            tabSize: 4,
            placeholder: "Input Your Markdown Syntax Here...",
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            foldGutter: true,
            matchBrackets: true,
            autoCloseBrackets: true,
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
                "Ctrl-Space": "autocomplete"
            }
        });

        // Add overlay for /command syntax highlighting
        CodeMirror.defineMode("slash-command-overlay", function (config, parserConfig) {
            var overlay = {
                token: function (stream, state) {
                    if (stream.sol() && stream.match(/^\s*\/[a-zA-Z].*$/)) {
                        stream.skipToEnd();
                        return "command";
                    }
                    while (!stream.eol()) stream.next();
                    return null;
                }
            };
            return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || "markdown"), overlay);
        });
        editor.setOption('mode', { name: 'slash-command-overlay', backdrop: 'markdown' });

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
        cmElement.style.fontFamily = 'Inter Tight, Anuphan, sans-serif';
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
            }, 200);
        }, 100);
    }

    if (typeof CodeMirror !== 'undefined') {
        CodeMirror.defineMIME("text/x-go", "go");
        CodeMirror.defineMIME("text/x-php", "php");
        CodeMirror.defineMIME("text/x-sql", "sql");
        CodeMirror.defineMIME("text/x-yaml", "yaml");
        CodeMirror.defineMIME("text/x-toml", "toml");
        CodeMirror.defineMIME("text/x-dockerfile", "dockerfile");
        CodeMirror.defineMIME("text/x-vue", "vue");
        CodeMirror.defineMIME("text/x-rustsrc", "rust");
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
            output.innerHTML = "<p style='color:red;'>Error: Markdown input UI component failed to load. Please refresh.</p>";
        }
        return;
    }

    if (!output || !parseTimeEl || !charCountEl) {
        console.warn("One or more Markdown UI elements not found. Some UI features might be affected.");
    }

    let isTyping = false;
    let isTypewriterActive = false;

    function typewriterInsertCM5(editor, text, delay = 10, callback) {
        isTypewriterActive = true;
        editor.off("inputRead", inputReadHandler);
        let i = 0;
        function typeNext() {
            editor.setValue(text.slice(0, i));
            const currentText = text.slice(0, i);
            const lines = currentText.split('\n');
            const line = lines.length - 1;
            const ch = lines[lines.length - 1].length;
            editor.setCursor({ line, ch });
            i++;
            if (i <= text.length) {
                setTimeout(typeNext, delay);
            } else {
                isTypewriterActive = false;
                editor.on("inputRead", inputReadHandler);
                if (callback) callback();
            }
        }
        typeNext();
    }

    function typewriterInsertLineCM5(editor, text, lineIndex, delay = 30, callback) {
        isTypewriterActive = true;
        editor.off("inputRead", inputReadHandler);
        let i = 0;
        function typeNext() {
            const currentText = text.slice(0, i);
            const lines = currentText.split('\n');
            const from = { line: lineIndex, ch: 0 };
            const to = {
                line: lineIndex + lines.length - 1,
                ch: lines[lines.length - 1].length
            };
            editor.replaceRange(currentText, from, to, "+typewriter");
            editor.setCursor(to);
            i++;
            if (i <= text.length) {
                setTimeout(typeNext, delay);
            } else {
                isTypewriterActive = false;
                editor.on("inputRead", inputReadHandler);
                if (callback) callback();
            }
        }
        typeNext();
    }

    let inputReadHandler = null;

    if (editor) {
        inputReadHandler = function (cm, change) {
            if (isTypewriterActive) return;
            if (change.text[0] && /[\w.]/.test(change.text[0])) {
                cm.showHint({ completeSingle: false });
            }
        };
        editor.on("inputRead", inputReadHandler);

        editor.on("keydown", function (cm, e) {
            if (isTypewriterActive) return;
            if (e.key === "Enter" || e.keyCode === 13) {
                const cursor = cm.getCursor();
                const line = cm.getLine(cursor.line);
                const cmd = line.trim();

                // Create Method
                if (cmd.toLowerCase() === "/ create heading with subtitle") {
                    e.preventDefault();
                    typewriterInsertLineCM5(
                        cm,
                        "# Heading <!-- This is Heading texts -->\n## Subtitle <!-- This is Subtitle -->",
                        cursor.line,
                        10
                    );
                    return;
                }
                if (cmd.toLowerCase() === "/ create heading") {
                    e.preventDefault();
                    typewriterInsertLineCM5(
                        cm,
                        "# Heading <!-- This is Heading texts -->",
                        cursor.line,
                        20
                    );
                    return;
                }
                if (cmd.toLowerCase() === "/ create list") {
                    e.preventDefault();
                    typewriterInsertLineCM5(
                        cm,
                        "- Item 1\n- Item 2\n- Item 3\n\n<!-- For ordered list, use: -->\n\n1. First\n2. Second\n3. Third",
                        cursor.line,
                        15
                    );
                    return;
                }
                if (cmd.toLowerCase() === "/ create table") {
                    e.preventDefault();
                    typewriterInsertLineCM5(
                        cm,
                        "| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Data 1   | Data 2   | Data 3   |\n| Data 4   | Data 5   | Data 6   |",
                        cursor.line,
                        22.5
                    );
                    return;
                }
                if (cmd.toLowerCase() === "/ create quote") {
                    e.preventDefault();
                    typewriterInsertLineCM5(
                        cm,
                        "> This is a quote box.\n> You can use it for important notes or highlights.",
                        cursor.line,
                        12.5
                    );
                    return;
                }
                if (cmd.toLowerCase() === "/ create social links") {
                    e.preventDefault();
                    typewriterInsertLineCM5(
                        cm,
                        "[Twitter](https://twitter.com/yourprofile)\n[Facebook](https://facebook.com/yourprofile)\n[LinkedIn](https://linkedin.com/in/yourprofile)",
                        cursor.line,
                        8
                    );
                    return;
                }
                if (cmd.toLowerCase() === "/ create about me section") {
                    e.preventDefault();
                    typewriterInsertLineCM5(
                        cm,
                        "## About Me\nHi! I'm [Peakk], a developer\n- I love coding\n- And love to create something that going better\n- How to reach me:\n[instagram](https://www.instagram.com/peakk.mint.teams/)",
                        cursor.line,
                        10
                    );
                    return;
                }
                if (cmd.toLowerCase() === "/ create all headings") {
                    e.preventDefault();
                    typewriterInsertLineCM5(
                        cm,
                        `
# This is how heading size look
## This is how heading size look
### This is how heading size look
#### This is how heading size look
##### This is how heading size look
                        `,
                        cursor.line,
                        25
                    );
                    return;
                }
                // HTML output tag
                if (cmd.toLowerCase() === "/ html") {
                    e.preventDefault();
                    typewriterInsertLineCM5(
                        cm,
                        `<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>HTML Example</title>\n</head>\n<body>\n    <h1>Hello, [YOUR_NAME]</h1>\n    <p>This is a basic HTML output example.</p>\n</body>\n</html>`,
                        cursor.line,
                        10
                    );
                    return;
                }
                if (cmd.toLowerCase() === "/ html with mintkit") {
                    e.preventDefault();
                    typewriterInsertLineCM5(
                        cm,
                        '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Mintkit Framework</title>\n</head>\n<body>\n    <div id="app"></div>\n\n    <script type="module">\n        import { Mint } from "https://cdn.jsdelivr.net/gh/Peakk2011/Mintkit_CDN/mint.min.js";\n\n        const app = async () => {\n            const root = {\n                html: `\n                    \n                `\n            }\n\n            queueMicrotask(() => {\n                Mint.injectHTML("#app",root.html);\n            })\n        }\n\n        app();\n    <\/script>\n\n</body>\n</html>',
                        cursor.line,
                        10
                    );
                    return;
                }
                // Easter EGG
                if (cmd.toLowerCase() === "/ peakk") {
                    e.preventDefault();
                    typewriterInsertLineCM5(
                        cm,
                        `
# Paris - The chainsmokers
## Peakk Favourite song

If we go down, then we go down together
They'll say you could do anything
They'll say that I was clever
If we go down, then we go down together
We'll get away with everything
Let's show them we are better

Let's show them we are better
Let's show them we are better
                        `,
                        cursor.line,
                        30
                    );
                    return;
                }
                if (cmd.toLowerCase() === "/ girlfriend") {
                    e.preventDefault();
                    typewriterInsertLineCM5(
                        cm,
                        `
# เพลงที่คนสร้างอยากสื่อถือแฟนเก่า
## คิด(แต่ไม่)ถึง

อยากรู้เพียงว่าความคิดถึงของเธอกับฉันมันเท่ากันหรือเปล่า
ถามจริง ๆ ว่าใจเธอเปลี่ยนไปหรือเปล่า
ฉันไม่คิดไปเองใช่ไหม
ความคิดถึงที่ฉันได้เคยส่งไป
ส่งไปได้เพียงในความทรงจำที่มีเราเรื่อยมา
แค่นึกภาพตอนนั้น ฉันก็มีน้ำตา
รู้บ้างไหมว่าเจ็บแค่ไหน
ความคิดถึงที่ฉันได้เคยส่งไป
ส่งไปไม่เคยถึงเธอเลย

(คิดแต่ไม่ถึง คิด คิด แต่ไม่ถึงเธอ) => x4

ว่าความคิดถึงของเธอกับฉันมันเท่ากันหรือเปล่า
ถามจริง ๆ ว่าใจเธอเปลี่ยนไปหรือเปล่า
ฉันไม่คิดไปเองใช่ไหม
ความคิดถึงที่ฉันได้เคยส่งไป
ส่งไปได้เพียงในความทรงจำที่มีเราเรื่อยมา
แค่นึกภาพตอนนั้น ฉันก็มีน้ำตา
รู้บ้างไหมว่าเจ็บแค่ไหน
ความคิดถึงที่ฉันได้เคยส่งไป
ส่งไปไม่เคยถึงเธอเลย
                        `,
                        cursor.line,
                        30
                    );
                    return;
                }
                if (cmd.toLowerCase() === "/ help") {
                    e.preventDefault();
                    typewriterInsertLineCM5(
                        cm,
                        "## Help\n- Type /create heading with subtitle To create a topic\n- Type /create heading To create a heading\n- Type /create list To create a list\n- Type /create table To create a table\n- Type /create quote box To create a quote\n- Type /create social links To create social links\n- Type /create about me section To create an about me section\n- Type /help To view all commands",
                        cursor.line,
                        10
                    );
                    return;
                }
            }
        });
    }

    function parseMarkdown() {
        const markdown = input.value;
        const html = parser.parse(markdown);
        const wordCount = parser.getWordCount(markdown);
        const readingTime = parser.getReadingTime(markdown);

        if (output) output.innerHTML = html;
        if (parseTimeEl) parseTimeEl.textContent = `${parser.getLastParseTime().toFixed(2)}ms`;
        if (charCountEl) charCountEl.textContent = `${markdown.length}`;
        if (wordCountEl) wordCountEl.textContent = `${wordCount}`;
        if (readingTimeEl) readingTimeEl.textContent = `${readingTime} min`;
    }

    function clearAll() {
        input.value = '';
        if (output) output.innerHTML = '';
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
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documents</title>
    <style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=Anuphan:wght@400;600;700&display=swap');

:root {
  --text: #000;
  --background: #faf9f5;
  --muted: #666;
  --border: #a7a6a3;
  --code-bg: #eae9e5;
  --heading-border: #a7a6a3;
  --Links: color:rgb(50, 50, 153);
}

@media (prefers-color-scheme: dark) {
  :root {
    --text: #f4f4f4;
    --background: #141414;
    --muted: #999;
    --border: #343434;
    --code-bg: #1f1f1f;
    --heading-border: #333;
    --Links: color:rgb(108, 108, 243);
  }
}

body {
  font-family: 'Inter Tight', 'Anuphan', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 2.5rem;
  line-height: 1.75;
  color: var(--text);
  background-color: var(--background);
  animation: fadeIn 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes fadeIn {
  from {
    scale: 80%;
    opacity: 0;
  }
  70% {
    opacity: 1;
  }
  to {
    scale: 100%;
  }
}

p {
  margin: 0 0 1.5rem;
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25; 
}

h1 {
  font-size: 2em;
  border-bottom: 1px solid var(--heading-border);
  padding-bottom: 10px;
}

h2 {
  font-size: 1.5em;
  border-bottom: 1px solid var(--heading-border);
  padding-bottom: 8px;
}

h3 { font-size: 1.7em; }
h4 { font-size: 1.425em; }
h5 { font-size: 1.245em; }
h6 { font-size: 1em; }

a {
  color: var(--Links);
  text-decoration: underline;
  transition: color 0.2s ease;
}

a:hover, a:focus {
  color: var(--muted);
}

code {
  background: var(--code-bg);
  padding: 2px 4px;
  border-radius: 3px;
  font-family: Consolas, Menlo, Monaco, "Courier New", monospace;
  font-size: 0.95em;
}

pre {
  background: var(--code-bg);
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0 0 1.5rem;
}

pre code {
  background: none;
  padding: 0;
  border-radius: 0;
  font-size: 0.95em;
  color: inherit;
}

blockquote {
  border-left: 4px solid var(--border);
  margin: 0 0 1.5rem;
  padding-left: 16px;
  color: var(--muted);
  font-style: italic;
}

ul, ol {
  margin: 0 0 1.5rem 1.5rem;
  padding: 0;
}

li {
  margin-bottom: 0.5rem;
}

li > ul, li > ol {
  margin-top: 0.5rem;
}

hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2rem 0;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1.5rem;
}

th, td {
  border: 1px solid var(--border);
  padding: 8px 12px;
  text-align: left;
}

th {
  background: var(--code-bg);
  font-weight: 600;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem auto;
}

@media (max-width: 640px) {
  body {
    padding: 1.5rem;
  }
}
    </style>
</head>
<body>
${output.innerHTML}
</body>
</html>`;

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
                        showNotification(`${templateName} template loaded!`, 'success');
                    }
                }
                typeNext();
            } else {
                input.value = template;
                parseMarkdown();
                showNotification(`${templateName} template loaded!`, 'success');
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
        const table = `| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1 Col 1 | Row 1 Col 2 | Row 1 Col 3 |
| Row 2 Col 1 | Row 2 Col 2 | Row 2 Col 3 |`;
        insertText(table);
    }

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
        const items = (event.clipboardData || event.originalEvent.clipboardData)?.items;
        if (!items) return;

        let imageFile = null;
        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
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
    });

    input.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'b':
                    e.preventDefault();
                    formatBold();
                    break;
                case 'i':
                    e.preventDefault();
                    formatItalic();
                    break;
                case 'k':
                    e.preventDefault();
                    insertLink();
                    break;
                case '`':
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
    if(toggle && menu){
        toggle.addEventListener('click', function(e){
            e.stopPropagation();
            menu.classList.toggle('open');
        });
        document.addEventListener('click', function(){
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
        console.warn('One or more elements for view toggling (TitleLinks, main-content, output-section) not found.');
    }
};
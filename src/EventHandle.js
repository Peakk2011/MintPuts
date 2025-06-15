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

            this.syntaxPatterns = {
                javascript: {
                    keyword: /\b(function|var|let|const|if|else|for|while|return|class|extends|import|export|async|await|try|catch|finally|switch|case|default|break|continue|throw|new|this|super|static|typeof|instanceof|in|of|delete|void)\b/g,
                    string: /(["'`])((?:(?!\1)[^\\]|\\.)*)(\1)/g,
                    comment: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
                    number: /\b\d+(\.\d+)?\b/g,
                    function: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
                    operator: /[+\-*/%=<>!&|^~?:]/g
                },
                python: {
                    keyword: /\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|with|pass|break|continue|and|or|not|in|is|lambda|yield|global|nonlocal|assert|del|raise)\b/g,
                    string: /(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g,
                    comment: /#.*$/gm,
                    number: /\b\d+(\.\d+)?\b/g,
                    function: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g
                },
                html: {
                    tag: /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g,
                    attr: /\s([a-zA-Z-]+)=/g,
                    string: /(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g,
                    comment: /<!--[\s\S]*?-->/g
                },
                css: {
                    selector: /([.#]?[a-zA-Z][a-zA-Z0-9-_]*)\s*{/g,
                    property: /([a-zA-Z-]+)\s*:/g,
                    value: /:\s*([^;]+);/g,
                    comment: /\/\*[\s\S]*?\*\//g,
                    important: /!important/g
                },
                json: {
                    key: /"([^"]+)":/g,
                    string: /"([^"\\]*(\\.[^"\\]*)*)"/g,
                    number: /\b-?\d+(\.\d+)?([eE][+-]?\d+)?\b/g,
                    boolean: /\b(true|false)\b/g,
                    null: /\bnull\b/g
                }
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
                const highlightedCode = this.highlightSyntax(code.trim(), lang || 'javascript');
                return `<pre class="hljs"><code class="language-${lang || 'javascript'}">${highlightedCode}</code></pre>`;
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
            if (!this.syntaxPatterns[language]) {
                return this.escapeHtml(code);
            }

            let highlighted = this.escapeHtml(code);
            const patterns = this.syntaxPatterns[language];

            for (const [type, pattern] of Object.entries(patterns)) {
                highlighted = highlighted.replace(pattern, (match, ...groups) => {
                    switch (type) {
                        case 'string':
                            return `<span class="hljs-string">${match}</span>`;
                        case 'comment':
                            return `<span class="hljs-comment">${match}</span>`;
                        case 'keyword':
                            return `<span class="hljs-keyword">${match}</span>`;
                        case 'number':
                            return `<span class="hljs-number">${match}</span>`;
                        case 'function':
                            return `<span class="hljs-function">${groups[0]}</span>(`;
                        case 'tag':
                            return `<span class="hljs-tag">${match}</span>`;
                        case 'attr':
                            return ` <span class="hljs-attr">${groups[0]}</span>=`;
                        case 'operator':
                            return `<span class="hljs-operator">${match}</span>`;
                        case 'boolean':
                            return `<span class="hljs-boolean">${match}</span>`;
                        case 'null':
                            return `<span class="hljs-null">${match}</span>`;
                        case 'key':
                            return `<span class="hljs-key">${match}</span>`;
                        case 'important':
                            return `<span class="hljs-important">${match}</span>`;
                        default:
                            return `<span class="hljs-${type}">${match}</span>`;
                    }
                });
            }

            return highlighted;
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

    const input = document.getElementById('markdown-input');
    const output = document.getElementById('html-output');
    const parseTimeEl = document.getElementById('parse-time');
    const charCountEl = document.getElementById('char-count');
    const wordCountEl = document.getElementById('word-count');
    const readingTimeEl = document.getElementById('reading-time');

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
            input.value = template;
            parseMarkdown();
            showNotification(`${templateName} template loaded!`, 'success');
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

    const titleLinksContainer = document.getElementById('TitleLinks');
    const mainContentSection = document.querySelector('.main-content');
    const outputSection = document.querySelector('.output-section');

    if (titleLinksContainer && mainContentSection && outputSection) {
        const links = titleLinksContainer.querySelectorAll('a');

        links.forEach(link => {
            link.addEventListener('click', function(event) {
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
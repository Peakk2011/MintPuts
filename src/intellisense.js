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

const speedArgs = {
    veryFast: 0,
    fast: 5,
    normal: 15,
    slow: 22.5,
};

const promptMap = {
    "/ create": {
        text: "Using `/ Create` method to type more options\nType  `/ help`   to see all options",
        speed: speedArgs.normal
    },
    "/ create texts structure": {
        text: "# This is Heading\n## This is subtitle\n**This is bold texts**\n*This is italic texts*\n>This is quote\n`This is block code`",
        speed: speedArgs.normal
    },
    "/ create bold texts": {
        text: "**This is bold text**",
        speed: speedArgs.fast
    },
    "/ create italic texts": {
        text: "*This is italic text*",
        speed: speedArgs.fast
    },
    "/ create checklist": {
        text: `- [x] Your list(1)\n- [x] Your list(2)\n- [ ] Your list(3)\n- [ ] Your list(4)\n- [ ] Your list(5)\n`,
        speed: speedArgs.fast
    },
    "/ create heading with subtitle": {
        text: "# Heading <!-- This is Heading texts -->\n## Subtitle <!-- This is Subtitle -->",
        speed: speedArgs.normal
    },
    "/ create heading": {
        text: "# Heading <!-- This is Heading texts -->",
        speed: speedArgs.normal
    },
    "/ create list": {
        text: "- Item 1\n- Item 2\n- Item 3\n\n<!-- For ordered list, use: -->\n\n1. First\n2. Second\n3. Third",
        speed: speedArgs.normal
    },
    "/ create table": {
        text: "| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Data 1   | Data 2   | Data 3   |\n| Data 4   | Data 5   | Data 6   |",
        speed: speedArgs.slow
    },
    "/ create quote": {
        text: "> This is a quote box.\n> You can use it for important notes or highlights.",
        speed: speedArgs.fast
    },
    "/ create social links": {
        text: "[Twitter](https://twitter.com/yourprofile)\n[Facebook](https://facebook.com/yourprofile)\n[LinkedIn](https://linkedin.com/in/yourprofile)",
        speed: speedArgs.normal
    },
    "/ create about me section": {
        text: "## About Me\nHi! I'm [Peakk], a developer\n- I love coding\n- And love to create something that going better\n- How to reach me:\n[instagram](https://www.instagram.com/peakk.mint.teams/)",
        speed: speedArgs.fast
    },
    "/ create all headings": {
        text: `\n# This is how heading size look\n## This is how heading size look\n### This is how heading size look\n#### This is how heading size look\n##### This is how heading size look\n                        `,
        speed: speedArgs.fast
    },
    "/ html": {
        text: `<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>HTML Example</title>\n</head>\n<body>\n    <h1>Hello, [YOUR_NAME]</h1>\n    <p>This is a basic HTML output example.</p>\n</body>\n</html>`,
        speed: speedArgs.slow
    },
    "/ html with mintkit": {
        text: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Mintkit Framework</title>\n</head>\n<body>\n    <div id="app"></div>\n\n    <script type="module">\n        import { Mint } from "https://cdn.jsdelivr.net/gh/Peakk2011/Mintkit_CDN/mint.min.js";\n\n        const app = async () => {\n            const root = {\n                html: `\n                    \n                `\n            }\n\n            queueMicrotask(() => {\n                Mint.injectHTML("#app",root.html);\n            })\n        }\n\n        app();\n    <\/script>\n\n</body>\n</html>',
        speed: speedArgs.slow
    },
    "/ create code block": {
        text: "```c\n#include <stdio.h>\nint main() {\n    printf(\"Hello Mintputs!\");\n}\n```",
        speed: speedArgs.fast
    },
    "/ create image": {
        text: "![Alt text](https://via.placeholder.com/150)",
        speed: speedArgs.fast
    },
    "/ create link": {
        text: "[MintPuts](https://github.com/Peakk2011/MintPuts)",
        speed: speedArgs.fast
    },
    "/ create warning": {
        text: "> **Warning:** This is a warning box!",
        speed: speedArgs.fast
    },
    "/ create info": {
        text: "> **Info:** This is an info box!",
        speed: speedArgs.fast
    },
    "/ create todo": {
        text: "- [ ] Task 1\n- [ ] Task 2\n- [ ] Task 3",
        speed: speedArgs.fast
    },
    "/ create contact": {
        text: "## Contact\n- Email: your@email.com\n- Instagram: @Peakk14",
        speed: speedArgs.fast
    },
    "/ create profile": {
        text: "# Profile\n- Name: Peakk\n- Role: Developer",
        speed: speedArgs.normal
    },
    "/ create faq": {
        text: "## FAQ\n**Q:** What is MintPuts?\n**A:** A cool editor!",
        speed: speedArgs.normal
    },
    "/ create product card": {
        text: `<!-- Minimal Product Card (Light & Dark mode) -->
<div class="product-card-minimal">
  <img src="https://images.unsplash.com/photo-1513708927688-890fe41c2e31?auto=format&fit=crop&w=400&q=80" alt="Product" class="product-img-minimal">
  <div class="product-info-minimal">
    <div class="product-title-minimal">MintPuts T-Shirt</div>
    <div class="product-price-minimal">$19.99</div>
    <button class="product-btn-minimal">Add to Cart</button>
  </div>
</div>

<style>
.product-card-minimal {
  width: 240px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
  font-family: sans-serif;
  margin: 24px auto;
  transition: background 0.2s, color 0.2s, border 0.2s;
}
.product-img-minimal {
  width: 100%;
  height: 140px;
  object-fit: cover;
  display: block;
}
.product-info-minimal {
  padding: 14px 12px 12px 12px;
}
.product-title-minimal {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: #222;
}
.product-price-minimal {
  font-size: 1rem;
  color: #0a8d48;
  margin-bottom: 10px;
}
.product-btn-minimal {
  width: 100%;
  background: #0a8d48;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 0;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.product-btn-minimal:hover {
  background: #066c36;
}
@media (prefers-color-scheme: dark) {
  .product-card-minimal {
    background: #181a1b;
    color: #e3e3e3;
    border: 1px solid #333;
  }
  .product-title-minimal {
    color: #e3e3e3;
  }
  .product-price-minimal {
    color: #7fffa7;
  }
  .product-btn-minimal {
    background: #1e9c5a;
    color: #fff;
  }
  .product-btn-minimal:hover {
    background: #0a8d48;
  }
}
</style>`,
        speed: speedArgs.normal
    },
    "/ help": {
        text: "## Help\n- Type /create heading with subtitle To create a topic\n- Type /create heading To create a heading\n- Type /create list To create a list\n- Type /create table To create a table\n- Type /create quote box To create a quote\n- Type /create social links To create social links\n- Type /create about me section To create an about me section\n- Type /create code block To create a code block\n- Type /create image To create an image\n- Type /create link To create a link\n- Type /create warning To create a warning box\n- Type /create info To create an info box\n- Type /create todo To create a todo list\n- Type /create contact To create a contact section\n- Type /create profile To create a profile section\n- Type /create faq To create a FAQ section",
        speed: speedArgs.veryFast
    },
    // Easter eggs
    "/ test.peakk": {
        text: `\n# Paris - The chainsmokers\n## Peakk Favourite song\n\nIf we go down, then we go down together\nThey'll say you could do anything\nThey'll say that I was clever\nIf we go down, then we go down together\nWe'll get away with everything\nLet's show them we are better\n\nLet's show them we are better\nLet's show them we are better\n                        `,
        speed: speedArgs.veryFast
    },
    "/ test.girlfriend": {
        text: `\n# เพลงที่คนสร้างอยากสื่อถือแฟนเก่า\n## คิด(แต่ไม่)ถึง\n\nอยากรู้เพียงว่าความคิดถึงของเธอกับฉันมันเท่ากันหรือเปล่า\nถามจริง ๆ ว่าใจเธอเปลี่ยนไปหรือเปล่า\nฉันไม่คิดไปเองใช่ไหม\nความคิดถึงที่ฉันได้เคยส่งไป\nส่งไปได้เพียงในความทรงจำที่มีเราเรื่อยมา\nแค่นึกภาพตอนนั้น ฉันก็มีน้ำตา\nรู้บ้างไหมว่าเจ็บแค่ไหน\nความคิดถึงที่ฉันได้เคยส่งไป\nส่งไปไม่เคยถึงเธอเลย\n\n(คิดแต่ไม่ถึง คิด คิด แต่ไม่ถึงเธอ) => x4\n\nว่าความคิดถึงของเธอกับฉันมันเท่ากันหรือเปล่า\nถามจริง ๆ ว่าใจเธอเปลี่ยนไปหรือเปล่า\nฉันไม่คิดไปเองใช่ไหม\nความคิดถึงที่ฉันได้เคยส่งไป\nส่งไปได้เพียงในความทรงจำที่มีเราเรื่อยมา\nแค่นึกภาพตอนนั้น ฉันก็มีน้ำตา\nรู้บ้างไหมว่าเจ็บแค่ไหน\nความคิดถึงที่ฉันได้เคยส่งไป\nส่งไปไม่เคยถึงเธอเลย\n                        `,
        speed: speedArgs.veryFast
    },
};

function getClosestPrompt(cmd) {
    const prompts = Object.keys(promptMap);
    const lowerCmd = cmd.toLowerCase();
    let suggestions = prompts.filter(p => p.includes(lowerCmd) || lowerCmd.includes(p.replace("/ ", "")));
    if (suggestions.length > 0) return suggestions.slice(0, 3); 
    return prompts.slice(0, 3);
}

function setupIntellisense(editor) {
    inputReadHandler = function (cm, change) {
        if (isTypewriterActive) return;
        if (change.text[0] && /[\w.]/.test(change.text[0])) {
            cm.showHint({ completeSingle: false });
        }
        const cursor = cm.getCursor();
        const line = cm.getLine(cursor.line);
        const cmd = line.trim();
        const prompt = promptMap[cmd.toLowerCase()];
        if (prompt && cmd.toLowerCase() !== '/ create') {
            if (!line.includes('`Press Enter to begin`')) {
                const oldCursor = cm.getCursor();
                cm.replaceRange(
                    line + '\n`Press Enter to begin`',
                    { line: cursor.line, ch: 0 },
                    { line: cursor.line, ch: line.length },
                    '+prompt-hint'
                );
                cm.setCursor(oldCursor);
            }
        }
    };

    editor.on("inputRead", inputReadHandler);

    editor.on("keydown", function (cm, e) {
        if (isTypewriterActive) return;
        if (e.key === "Enter" || e.keyCode === 13) {
            const cursor = cm.getCursor();
            const line = cm.getLine(cursor.line);
            const cmd = line.trim();
            const nextLine = cm.getLine(cursor.line + 1);
            if (nextLine && nextLine.trim() === '`Press Enter to begin`') {
                cm.replaceRange(
                    '',
                    { line: cursor.line + 1, ch: 0 },
                    { line: cursor.line + 1, ch: nextLine.length },
                    '+remove-prompt-hint'
                );
            }
            const prompt = promptMap[cmd.toLowerCase()];
            if (prompt) {
                e.preventDefault();
                typewriterInsertLineCM5(
                    cm,
                    prompt.text + "\n\n`Press Enter to begin`",
                    cursor.line,
                    prompt.speed,
                    () => removePressEnterHint(cm)
                );
                return;
            }
            // Auto-correct: ถ้าใกล้เคียง ให้แทรก prompt ที่ใกล้เคียงที่สุด
            if (/^\/(create|html|test|help)/.test(cmd.toLowerCase())) {
                e.preventDefault();
                const suggestions = getClosestPrompt(cmd);
                typewriterInsertLineCM5(
                    cm,
                    `Command not found: ${cmd}\nTry:\n${suggestions.map(s => `- ${s}`).join("\n")}` + "\n\n/ create",
                    cursor.line,
                    speedArgs.fast,
                    () => removePressEnterHint(cm)
                );
                return;
            }
        }
    });
}

function removePressEnterHint(cm) {
    const lineCount = cm.lineCount();
    for (let i = 0; i < lineCount; i++) {
        const text = cm.getLine(i);
        if (text && text.trim() === '`Press Enter to begin`') {
            cm.replaceRange('', { line: i, ch: 0 }, { line: i, ch: text.length }, '+remove-press-enter');
        }
    }
}

export { typewriterInsertCM5, typewriterInsertLineCM5, setupIntellisense, isTypewriterActive }; 
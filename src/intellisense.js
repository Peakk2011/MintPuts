let isTypewriterActive = false;
let pendingHintTimeout = null;
let currentHintLine = -1;

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
    clearPendingHint();
    
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

function clearPendingHint() {
    if (pendingHintTimeout) {
        clearTimeout(pendingHintTimeout);
        pendingHintTimeout = null;
    }
}

function showPressEnterHint(editor, lineNum, command) {
    clearPendingHint();
    removePressEnterHint(editor);
    
    pendingHintTimeout = setTimeout(() => {
        if (!isTypewriterActive && currentHintLine !== lineNum) {
            const line = editor.getLine(lineNum);
            if (line && line.trim() === command) {
                const hintText = '`Press Enter to execute`';
                editor.replaceRange(
                    line + '\n' + hintText,
                    { line: lineNum, ch: 0 },
                    { line: lineNum, ch: line.length },
                    '+prompt-hint'
                );
                currentHintLine = lineNum;
            }
        }
    }, 300);
}

let inputReadHandler = null;

const speedArgs = {
    veryFast: 0,
    fast: 5,
    normal: 15,
    slow: 22.5,
};

const promptMap = {
    "/ using": {
        text: "Using `/ using binary help` to see all commands",
        speed: speedArgs.normal,
        showHint: false
    },
    "/ using binary=<number>": {
        text: "Than Enter your number values.",
        speed: speedArgs.normal,
        showHint: false
    },
    "/ create": {
        text: "Using `/ Create` method to type more options\nType  `/ help`   to see all options",
        speed: speedArgs.normal,
        showHint: false
    },
    "/ create texts structure": {
        text: "# This is Heading\n## This is subtitle\n**This is bold texts**\n*This is italic texts*\n>This is quote\n`This is block code`",
        speed: speedArgs.normal,
        showHint: true
    },
    "/ create bold texts": {
        text: "**This is bold text**",
        speed: speedArgs.fast,
        showHint: true
    },
    "/ create italic texts": {
        text: "*This is italic text*",
        speed: speedArgs.fast,
        showHint: true
    },
    "/ create checklist": {
        text: `- [x] Your list(1)\n- [x] Your list(2)\n- [ ] Your list(3)\n- [ ] Your list(4)\n- [ ] Your list(5)\n`,
        speed: speedArgs.fast,
        showHint: true
    },
    "/ create heading with subtitle": {
        text: "# Heading <!-- This is Heading texts -->\n## Subtitle <!-- This is Subtitle -->",
        speed: speedArgs.normal,
        showHint: true
    },
    "/ create heading": {
        text: "# Heading <!-- This is Heading texts -->",
        speed: speedArgs.normal,
        showHint: true
    },
    "/ create list": {
        text: "- Item 1\n- Item 2\n- Item 3\n\n<!-- For ordered list, use: -->\n\n1. First\n2. Second\n3. Third",
        speed: speedArgs.normal,
        showHint: true
    },
    "/ create table": {
        text: "| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Data 1   | Data 2   | Data 3   |\n| Data 4   | Data 5   | Data 6   |",
        speed: speedArgs.slow,
        showHint: true
    },
    "/ create quote": {
        text: "> This is a quote box.\n> You can use it for important notes or highlights.",
        speed: speedArgs.fast,
        showHint: true
    },
    "/ create social links": {
        text: "[Twitter](https://twitter.com/yourprofile)\n[Facebook](https://facebook.com/yourprofile)\n[LinkedIn](https://linkedin.com/in/yourprofile)",
        speed: speedArgs.normal,
        showHint: true
    },
    "/ create about me section": {
        text: "## About Me\nHi! I'm [Peakk], a developer\n- I love coding\n- And love to create something that going better\n- How to reach me:\n[instagram](https://www.instagram.com/peakk.mint.teams/)",
        speed: speedArgs.fast,
        showHint: true
    },
    "/ create all headings": {
        text: `# This is how heading size look\n## This is how heading size look\n### This is how heading size look\n#### This is how heading size look\n##### This is how heading size look`,
        speed: speedArgs.fast,
        showHint: true
    },
    "/ html": {
        text: `<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>HTML Example</title>\n</head>\n<body>\n    <h1>Hello, [YOUR_NAME]</h1>\n    <p>This is a basic HTML output example.</p>\n</body>\n</html>`,
        speed: speedArgs.fast,
        showHint: true
    },
    "/ html with mintkit": {
        text: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Mintkit Framework</title>\n</head>\n<body>\n    <div id="app"></div>\n\n    <script type="module">\n        import { Mint } from "https://cdn.jsdelivr.net/gh/Peakk2011/Mintkit_CDN/mint.min.js";\n\n        const app = async () => {\n            const root = {\n                html: `\n                    \n                `\n            }\n\n            queueMicrotask(() => {\n                Mint.injectHTML("#app",root.html);\n            })\n        }\n\n        app();\n    <\/script>\n\n</body>\n</html>',
        speed: speedArgs.fast,
        showHint: true
    },
    "/ create code block": {
        text: "```cpp\n#include <iostream>\n#include <string>\n#include <vector>\n\nint main() {\n    std::string message = \"Hello Mintputs!\";\n    std::cout << message << std::endl;\n\n    // Example with a vector\n    std::vector<int> numbers = {1, 2, 3, 4, 5};\n    std::cout << \"Numbers: \";\n    for(int num : numbers) {\n        std::cout << num << \" \";\n    }\n    std::cout << std::endl;\n\n    return 0;\n}\n```",
        speed: speedArgs.fast,
        showHint: true
    },
    "/ create image": {
        text: "![Alt text](https://imageplaceholder.net/500x350/2d2d2d/eeeeee?text=Image)",
        speed: speedArgs.fast,
        showHint: true
    },
    "/ create link": {
        text: "[MintPuts](https://github.com/Peakk2011/MintPuts)",
        speed: speedArgs.fast,
        showHint: true
    },
    "/ create warning": {
        text: "> **Warning:** This is a warning box!",
        speed: speedArgs.fast,
        showHint: true
    },
    "/ create info": {
        text: "> **Info:** This is an info box!",
        speed: speedArgs.fast,
        showHint: true
    },
    "/ create todo": {
        text: "- [ ] Task 1\n- [ ] Task 2\n- [ ] Task 3",
        speed: speedArgs.fast,
        showHint: true
    },
    "/ create contact": {
        text: "## Contact\n- Email: your@email.com\n- Instagram: @Peakk14",
        speed: speedArgs.fast,
        showHint: true
    },
    "/ create profile": {
        text: "# Profile\n- Name: Peakk\n- Role: Developer",
        speed: speedArgs.normal,
        showHint: true
    },
    "/ create faq": {
        text: "## FAQ\n**Q:** What is MintPuts?\n**A:** A cool editor",
        speed: speedArgs.normal,
        showHint: true
    },
    "/ create button": {
        text: `
        <div class="Buttons">
            <div class="Buttons-inner">
                Click me
            </div>
        </div>

        .example6 {
            position: relative;
            background: linear-gradient(45deg, #ff9a9e, #fecfef);
            padding: 4px;
            border-radius: 15px;
        }

        .example6-inner {
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 11px;
            padding: 30px;
            text-align: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
        }
    `,
        speed: speedArgs.veryFast,
        showHint: true
    },
    "/ create component card": {
        text: `<!-- Modern Card Component -->
<div class="card-modern">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
    <p class="card-subtitle">Subtitle text here</p>
  </div>
  <div class="card-content">
    <p>This is the main content of the card. You can add any content here.</p>
  </div>
  <div class="card-actions">
    <button class="card-btn primary">Action</button>
    <button class="card-btn secondary">Cancel</button>
  </div>
</div>

<style>
.card-modern {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 400px;
  margin: 20px auto;
}
.card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}
.card-header {
  padding: 20px 20px 0;
}
.card-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 700;
  color: #333;
}
.card-subtitle {
  margin: 0;
  color: #666;
  font-size: 14px;
}
.card-content {
  padding: 16px 20px;
  color: #555;
  line-height: 1.6;
}
.card-actions {
  padding: 0 20px 20px;
  display: flex;
  gap: 12px;
}
.card-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.card-btn.primary {
  background: #007bff;
  color: white;
}
.card-btn.primary:hover {
  background: #0056b3;
}
.card-btn.secondary {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #dee2e6;
}
.card-btn.secondary:hover {
  background: #e9ecef;
}
</style>`,
        speed: speedArgs.veryFast,
        showHint: true
    },
    "/ create component input": {
        text: `<!-- Modern Input Component -->
<div class="input-group-modern">
  <label class="input-label">Email Address</label>
  <div class="input-wrapper">
    <input type="email" class="input-modern" placeholder="Enter your email">
    <div class="input-focus-border"></div>
  </div>
  <span class="input-helper">We'll never share your email</span>
</div>

<style>
.input-group-modern {
  margin: 16px 0;
}
.input-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}
.input-wrapper {
  position: relative;
}
.input-modern {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  box-sizing: border-box;
}
.input-modern:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}
.input-modern::placeholder {
  color: #adb5bd;
}
.input-focus-border {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background: linear-gradient(90deg, #007bff, #0056b3);
  transition: width 0.3s ease;
}
.input-modern:focus + .input-focus-border {
  width: 100%;
}
.input-helper {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #6c757d;
}
</style>`,
        speed: speedArgs.veryFast,
        showHint: true
    },
    "/ create animation loading": {
        text: `<!-- Loading Animations -->
<div class="loading-container">
  <div class="loading-spinner"></div>
  <div class="loading-dots">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <div class="loading-pulse"></div>
</div>

<style>
.loading-container {
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

/* Spinner */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Dots */
.loading-dots {
  display: flex;
  gap: 8px;
}
.loading-dots span {
  width: 12px;
  height: 12px;
  background: #007bff;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}
.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

/* Pulse */
.loading-pulse {
  width: 40px;
  height: 40px;
  background: #007bff;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>`,
        speed: speedArgs.veryFast,
        showHint: true
    },
    "/ create layout grid": {
        text: `<!-- Modern Grid Layout -->
<div class="grid-container">
  <div class="grid-item">Item 1</div>
  <div class="grid-item">Item 2</div>
  <div class="grid-item">Item 3</div>
  <div class="grid-item">Item 4</div>
  <div class="grid-item">Item 5</div>
  <div class="grid-item">Item 6</div>
</div>

<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.grid-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.grid-item:nth-child(2n) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);
}

.grid-item:nth-child(2n):hover {
  box-shadow: 0 8px 25px rgba(240, 147, 251, 0.4);
}

.grid-item:nth-child(3n) {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
}

.grid-item:nth-child(3n):hover {
  box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4);
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    padding: 10px;
  }
}
</style>`,
        speed: speedArgs.veryFast,
        showHint: true
    },
    "/ create product card": {
        text: `<!-- Minimal Product Card (Light & Dark mode) -->
<div class="product-card-minimal">
  <img src="https://images.unsplash.com/photo-1513708927688-890fe41c2e31?auto=format&fit=crop&w=400&q=80" alt="Product" class="product-img-minimal">
  <div class="product-info-minimal">
    <div class="product-title-minimal">[Example]</div>
    <div class="product-price-minimal">[Texts]</div>
    <button class="product-btn-minimal">[Texts]</button>
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
        speed: speedArgs.veryFast,
        showHint: true
    },
    "/ create navbar": {
        text: `<!-- Modern Navigation Bar -->
<nav class="navbar-modern">
  <div class="navbar-container">
    <div class="navbar-brand">
      <img src="https://via.placeholder.com/32x32" alt="Logo" class="navbar-logo">
      <span class="navbar-title">MintPuts</span>
    </div>
    <div class="navbar-menu">
      <a href="#" class="navbar-link active">Home</a>
      <a href="#" class="navbar-link">About</a>
      <a href="#" class="navbar-link">Services</a>
      <a href="#" class="navbar-link">Contact</a>
    </div>
    <div class="navbar-actions">
      <button class="navbar-btn">Login</button>
      <button class="navbar-btn primary">Sign Up</button>
    </div>
  </div>
</nav>

<style>
.navbar-modern {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.navbar-logo {
  width: 32px;
  height: 32px;
  border-radius: 6px;
}

.navbar-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.navbar-menu {
  display: flex;
  gap: 32px;
}

.navbar-link {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  position: relative;
  transition: color 0.3s ease;
}

.navbar-link:hover,
.navbar-link.active {
  color: #007bff;
}

.navbar-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #007bff;
  border-radius: 1px;
}

.navbar-actions {
  display: flex;
  gap: 12px;
}

.navbar-btn {
  padding: 8px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  background: transparent;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.navbar-btn:hover {
  background: #f8f9fa;
}

.navbar-btn.primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.navbar-btn.primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}

@media (max-width: 768px) {
  .navbar-menu {
    display: none;
  }
  
  .navbar-actions {
    gap: 8px;
  }
  
  .navbar-btn {
    padding: 6px 12px;
    font-size: 14px;
  }
}
</style>`,
        speed: speedArgs.veryFast,
        showHint: true
    },
    "/ create footer": {
        text: `<!-- Modern Footer -->
<footer class="footer-modern">
  <div class="footer-container">
    <div class="footer-content">
      <div class="footer-section">
        <h3 class="footer-title">MintPuts</h3>
        <p class="footer-description">Building amazing web experiences with modern tools and frameworks.</p>
        <div class="footer-social">
          <a href="#" class="social-link">Twitter</a>
          <a href="#" class="social-link">GitHub</a>
          <a href="#" class="social-link">LinkedIn</a>
        </div>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-heading">Product</h4>
        <ul class="footer-links">
          <li><a href="#" class="footer-link">Features</a></li>
          <li><a href="#" class="footer-link">Pricing</a></li>
          <li><a href="#" class="footer-link">Documentation</a></li>
          <li><a href="#" class="footer-link">API</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-heading">Company</h4>
        <ul class="footer-links">
          <li><a href="#" class="footer-link">About</a></li>
          <li><a href="#" class="footer-link">Blog</a></li>
          <li><a href="#" class="footer-link">Careers</a></li>
          <li><a href="#" class="footer-link">Contact</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-heading">Support</h4>
        <ul class="footer-links">
          <li><a href="#" class="footer-link">Help Center</a></li>
          <li><a href="#" class="footer-link">Community</a></li>
          <li><a href="#" class="footer-link">Status</a></li>
          <li><a href="#" class="footer-link">Security</a></li>
        </ul>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p class="footer-copyright">&copy; 2024 MintPuts. All rights reserved.</p>
      <div class="footer-legal">
        <a href="#" class="footer-legal-link">Privacy Policy</a>
        <a href="#" class="footer-legal-link">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>

<style>
.footer-modern {
  background: #1a1a1a;
  color: #e5e5e5;
  padding: 48px 0 24px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 32px;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #fff;
}

.footer-description {
  color: #a0a0a0;
  line-height: 1.6;
  margin-bottom: 24px;
}

.footer-social {
  display: flex;
  gap: 16px;
}

.social-link {
  color: #a0a0a0;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: #007bff;
}

.footer-heading {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #fff;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-link {
  color: #a0a0a0;
  text-decoration: none;
  line-height: 2;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #fff;
}

.footer-bottom {
  border-top: 1px solid #333;
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-copyright {
  color: #a0a0a0;
  margin: 0;
}

.footer-legal {
  display: flex;
  gap: 24px;
}

.footer-legal-link {
  color: #a0a0a0;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-legal-link:hover {
  color: #fff;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
</style>`,
        speed: speedArgs.veryFast,
        showHint: true
    },
    "/ create modal": {
        text: `<!-- Modern Modal -->
<div id="modal-overlay" class="modal-overlay" onclick="closeModal()">
  <div class="modal-modern" onclick="event.stopPropagation()">
    <div class="modal-header">
      <h3 class="modal-title">Modal Title</h3>
      <button class="modal-close" onclick="closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <p>This is the modal content. You can add any content here including forms, images, or other components.</p>
    </div>
    <div class="modal-footer">
      <button class="modal-btn secondary" onclick="closeModal()">Cancel</button>
      <button class="modal-btn primary" onclick="handleConfirm()">Confirm</button>
    </div>
  </div>
</div>

<button class="open-modal-btn" onclick="openModal()">Open Modal</button>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-overlay.active {
  display: flex;
}

.modal-modern {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease;
}

.modal-header {
  padding: 20px 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f5f5f5;
  color: #666;
}

.modal-body {
  padding: 20px;
  color: #555;
  line-height: 1.6;
}

.modal-footer {
  padding: 0 20px 20px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-btn.primary {
  background: #007bff;
  color: white;
}

.modal-btn.primary:hover {
  background: #0056b3;
}

.modal-btn.secondary {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #dee2e6;
}

.modal-btn.secondary:hover {
  background: #e9ecef;
}

.open-modal-btn {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.open-modal-btn:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>

<script>
function openModal() {
  document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

function handleConfirm() {
  console.log('Confirmed!');
  closeModal();
}
</script>`,
        speed: speedArgs.veryFast,
        showHint: true
    },
    "/ help": {
        text: "## MintPuts Editor Commands\n\n### Content Creation:\n- Type `/create heading` - Create a heading\n- Type `/create heading with subtitle` - Create heading with subtitle\n- Type `/create list` - Create a list\n- Type `/create table` - Create a table\n- Type `/create quote` - Create a quote\n- Type `/create checklist` - Create a checklist\n- Type `/create bold texts` - Create bold text\n- Type `/create italic texts` - Create italic text\n- Type `/create code block` - Create a code block\n- Type `/create image` - Create an image\n- Type `/create link` - Create a link\n\n### Components:\n- Type `/create component button` - Modern button component\n- Type `/create component card` - Modern card component\n- Type `/create component input` - Modern input component\n- Type `/create animation loading` - Loading animations\n- Type `/create layout grid` - Grid layout\n- Type `/create product card` - Product card\n- Type `/create navbar` - Navigation bar\n- Type `/create footer` - Footer component\n- Type `/create modal` - Modal dialog\n\n### Social & Profile:\n- Type `/create social links` - Create social links\n- Type `/create about me section` - Create about me section\n- Type `/create contact` - Create contact section\n- Type `/create profile` - Create profile section\n- Type `/create faq` - Create FAQ section\n\n### Utilities:\n- Type `/create warning` - Create warning box\n- Type `/create info` - Create info box\n- Type `/create todo` - Create todo list\n\n### HTML Templates:\n- Type `/html` - Basic HTML template\n- Type `/html with mintkit` - HTML with Mintkit framework\n\n### Binary Converter:\n- Type `/using binary help` - Binary converter commands\n- Type `/using binary=<number>` - Convert number to binary\n- Type `/using binary2int=<binary>` - Convert binary to integer\n- Type `/using binary2float=<32-bit-binary>` - Convert binary to float\n\n### Translation:\n- Type `/translate <lang>` - Translate text to specified language",
        speed: speedArgs.fast,
        showHint: false
    },
    // Easter eggs
    "/ test.peakk": {
        text: `# Paris - The chainsmokers\n## Peakk Favourite song\n\nIf we go down, then we go down together\nThey'll say you could do anything\nThey'll say that I was clever\nIf we go down, then we go down together\nWe'll get away with everything\nLet's show them we are better\n\nLet's show them we are better\nLet's show them we are better`,
        speed: speedArgs.fast,
        showHint: false
    },
    "/ test.girlfriend": {
        text: `# เพลงที่คนสร้างอยากสื่อถือแฟนเก่า\n## คิด(แต่ไม่)ถึง\n\nอยากรู้เพียงว่าความคิดถึงของเธอกับฉันมันเท่ากันหรือเปล่า\nถามจริง ๆ ว่าใจเธอเปลี่ยนไปหรือเปล่า\nฉันไม่คิดไปเองใช่ไหม\nความคิดถึงที่ฉันได้เคยส่งไป\nส่งไปได้เพียงในความทรงจำที่มีเราเรื่อยมา\nแค่นึกภาพตอนนั้น ฉันก็มีน้ำตา\nรู้บ้างไหมว่าเจ็บแค่ไหน\nความคิดถึงที่ฉันได้เคยส่งไป\nส่งไปไม่เคยถึงเธอเลย\n\n(คิดแต่ไม่ถึง คิด คิด แต่ไม่ถึงเธอ) => x4\n\nว่าความคิดถึงของเธอกับฉันมันเท่ากันหรือเปล่า\nถามจริง ๆ ว่าใจเธอเปลี่ยนไปหรือเปล่า\nฉันไม่คิดไปเองใช่ไหม\nความคิดถึงที่ฉันได้เคยส่งไป\nส่งไปได้เพียงในความทรงจำที่มีเราเรื่อยมา\nแค่นึกภาพตอนนั้น ฉันก็มีน้ำตา\nรู้บ้างไหมว่าเจ็บแค่ไหน\nความคิดถึงที่ฉันได้เคยส่งไป\nส่งไปไม่เคยถึงเธอเลย`,
        speed: speedArgs.fast,
        showHint: false
    },
    "/ using binary help": {
        text: `# Binary Converter Commands\n\n## All Commands:\n- \`/ using binary=<number>\` - Convert number to binary\n  - Example: \`/ using binary=42\` → Integer 42 to binary\n  - Example: \`/ using binary=3.14\` → Float 3.14 to binary (IEEE 754)\n\n- \`/ using binary2int=<binary>\` - Convert binary to integer\n  - Example: \`/ using binary2int=101010\` → Binary 101010 to integer\n\n- \`/ using binary2float=<32-bit-binary>\` - Convert 32-bit binary to float\n  - Example: \`/ using binary2float=01000000010010001111010111000011\` → 32-bit binary to float\n\n## Usage:\nType the command and press Enter in the editor\n\n## Examples:\n- \`/ using binary=255\`\n- \`/ using binary=-42\`\n- \`/ using binary=3.14159\`\n- \`/ using binary2int=1101\``,
        speed: speedArgs.fast,
        showHint: false
    },
};

function getClosestPrompt(cmd) {
    const prompts = Object.keys(promptMap);
    const lowerCmd = cmd.toLowerCase();
    let suggestions = prompts.filter(p => p.includes(lowerCmd) || lowerCmd.includes(p.replace("/ ", "")));
    if (suggestions.length > 0) return suggestions.slice(0, 3);
    return prompts.slice(0, 3);
}

async function translateText(text, targetLang) {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0][0][0];
        }
        return 'Translation failed';
    } catch (err) {
        return `Translation error: ${err.message}`;
    }
}

function setupIntellisense(editor) {
    inputReadHandler = function (cm, change) {
        if (isTypewriterActive) return;
        
        // Auto-completion trigger
        if (change.text[0] && /[\w.]/.test(change.text[0])) {
            cm.showHint({ completeSingle: false });
        }
        
        const cursor = cm.getCursor();
        const line = cm.getLine(cursor.line);
        const cmd = line.trim();
        const prompt = promptMap[cmd.toLowerCase()];
        
        // Show hint for valid commands that support it
        if (prompt && prompt.showHint && cmd.toLowerCase() !== '/ create') {
            showPressEnterHint(cm, cursor.line, cmd);
        } else {
            // Clear hint for non-matching commands
            if (!prompt || !prompt.showHint) {
                clearPendingHint();
                removePressEnterHint(cm);
                currentHintLine = -1;
            }
        }
    };

    editor.on("inputRead", inputReadHandler);

    editor.on("keydown", async function (cm, e) {
        if (isTypewriterActive) return;
        
        if (e.key === "Enter" || e.keyCode === 13) {
            const cursor = cm.getCursor();
            const line = cm.getLine(cursor.line);
            const cmd = line.trim();
            
            // Remove hint when executing command
            const nextLine = cm.getLine(cursor.line + 1);
            if (nextLine && (nextLine.trim() === '`Press Enter to execute`' || nextLine.trim() === '`Press Enter to begin`')) {
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
                clearPendingHint();
                currentHintLine = -1;
                
                // Execute command with appropriate hint behavior
                if (cmd.toLowerCase() === '/ using' || cmd.toLowerCase().startsWith('/ using binary=')) {
                    typewriterInsertLineCM5(
                        cm,
                        prompt.text,
                        cursor.line,
                        prompt.speed,
                        () => {
                            removePressEnterHint(cm);
                            if (prompt.showHint) {
                                setTimeout(() => showPressEnterHint(cm, cursor.line + prompt.text.split('\n').length, ""), 500);
                            }
                        }
                    );
                } else {
                    const finalText = prompt.showHint ? prompt.text : prompt.text;
                    typewriterInsertLineCM5(
                        cm,
                        finalText,
                        cursor.line,
                        prompt.speed,
                        () => {
                            removePressEnterHint(cm);
                            // Set cursor to end of inserted content
                            const lines = finalText.split('\n');
                            const finalLine = cursor.line + lines.length - 1;
                            const finalCh = lines[lines.length - 1].length;
                            cm.setCursor({ line: finalLine, ch: finalCh });
                        }
                    );
                }
                return;
            }

            // Binary converter commands
            if (/^\/ using binary(2int|2float)?=/.test(cmd.toLowerCase())) {
                e.preventDefault();
                clearPendingHint();
                currentHintLine = -1;
                
                let result = '';
                if (/^\/ using binary=/.test(cmd.toLowerCase())) {
                    const match = cmd.match(/^\/ using binary=(.+)$/i);
                    if (match) {
                        const value = match[1].trim();
                        const number = parseFloat(value);
                        if (window.binaryConverterModule) {
                            try {
                                if (!isNaN(number)) {
                                    if (Number.isInteger(number)) {
                                        const binaryPtr = window.binaryConverterModule._int_to_binary(number);
                                        const binary = window.binaryConverterModule.UTF8ToString(binaryPtr);
                                        result = `${number} → ${binary}`;
                                    } else {
                                        const binaryPtr = window.binaryConverterModule._float_to_binary(number);
                                        const binary = window.binaryConverterModule.UTF8ToString(binaryPtr);
                                        result = `${number} → ${binary}`;
                                    }
                                } else {
                                    result = `Error: Invalid number\n/ using binary=<number>`;
                                }
                            } catch (error) {
                                result = `Error: ${error.message}`;
                            }
                        } else {
                            result = 'Binary converter module not loaded';
                        }
                    } else {
                        result = 'Error: Invalid command format.';
                    }
                } else if (/^\/ using binary2int=/.test(cmd.toLowerCase())) {
                    const match = cmd.match(/^\/ using binary2int=([01]+)$/i);
                    if (match) {
                        const binaryStr = match[1];
                        if (window.binaryConverterModule) {
                            try {
                                const binaryPtr = window.binaryConverterModule._malloc(binaryStr.length + 1);
                                window.binaryConverterModule.stringToUTF8(binaryStr, binaryPtr, binaryStr.length + 1);
                                const intResult = window.binaryConverterModule._binary_to_int(binaryPtr);
                                window.binaryConverterModule._free(binaryPtr);
                                result = `Binary ${binaryStr} → Integer: ${intResult}`;
                            } catch (error) {
                                result = `Error: ${error.message}`;
                            }
                        } else {
                            result = 'Binary converter module not loaded';
                        }
                    } else {
                        result = 'Error: Invalid binary format (use only 0 and 1).';
                    }
                } else if (/^\/ using binary2float=/.test(cmd.toLowerCase())) {
                    const match = cmd.match(/^\/ using binary2float=([01]{32})$/i);
                    if (match) {
                        const binaryStr = match[1];
                        if (window.binaryConverterModule) {
                            try {
                                const binaryPtr = window.binaryConverterModule._malloc(binaryStr.length + 1);
                                window.binaryConverterModule.stringToUTF8(binaryStr, binaryPtr, binaryStr.length + 1);
                                const floatResult = window.binaryConverterModule._binary_to_float(binaryPtr);
                                window.binaryConverterModule._free(binaryPtr);
                                result = `Binary ${binaryStr} → Float: ${floatResult}`;
                            } catch (error) {
                                result = `Error: ${error.message}`;
                            }
                        } else {
                            result = 'Binary converter module not loaded';
                        }
                    } else {
                        result = 'Error: Must be exactly 32 bits (0/1 only).';
                    }
                }
                
                typewriterInsertLineCM5(
                    cm,
                    result,
                    cursor.line,
                    speedArgs.fast,
                    () => {
                        if (/Error:/i.test(result)) {
                            const lineCount = cm.lineCount();
                            let foundLine = 0;
                            for (let i = 0; i < lineCount; i++) {
                                const text = cm.getLine(i);
                                if (/\/ using binary(2int|2float)?=/.test(text)) {
                                    foundLine = i;
                                    break;
                                }
                            }
                            const text = cm.getLine(foundLine);
                            cm.setCursor({ line: foundLine, ch: text.length });
                        } else {
                            cm.setCursor({ line: cursor.line + result.split('\n').length, ch: 0 });
                        }
                        removePressEnterHint(cm);
                    }
                );
                return;
            }

            // Command suggestions for invalid commands
            if (/^\/(create|html|test|help)/.test(cmd.toLowerCase())) {
                e.preventDefault();
                clearPendingHint();
                currentHintLine = -1;
                
                const suggestions = getClosestPrompt(cmd);
                const suggestionText = `Command not found: ${cmd}\n\nDid you mean:\n${suggestions.map(s => `- ${s}`).join("\n")}\n\nType / help for all commands`;
                
                typewriterInsertLineCM5(
                    cm,
                    suggestionText,
                    cursor.line,
                    speedArgs.fast,
                    () => {
                        removePressEnterHint(cm);
                        cm.setCursor({ line: cursor.line + suggestionText.split('\n').length, ch: 0 });
                    }
                );
                return;
            }

            // Translation feature
            const translateRegex = /(?:^|\n)\/\s+translate\s+([a-zA-Z\-]+)(?:\s+(.+))?/i;
            const value = cm.getValue();
            const match = value.match(translateRegex);
            if (match) {
                const lang = match[1];
                const textToTranslate = match[2] ? match[2] : (cm.getSelection() || value);
                
                cm.setValue('Translating...');
                try {
                    const translated = await translateText(textToTranslate, lang);
                    cm.setValue(translated);
                    setTimeout(() => {
                        const doc = cm.getDoc();
                        const lastLine = doc.lastLine();
                        const lastCh = doc.getLine(lastLine).length;
                        doc.setCursor({ line: lastLine, ch: lastCh });
                    }, 100);
                } catch (error) {
                    cm.setValue(`Translation failed: ${error.message}`);
                }
                e.preventDefault();
                return;
            }
        }
        
        // Clear hints on other key presses
        if (e.key !== "Enter" && e.key !== "ArrowUp" && e.key !== "ArrowDown" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
            if (currentHintLine !== -1) {
                clearPendingHint();
                removePressEnterHint(cm);
                currentHintLine = -1;
            }
        }
    });

    // Syntax highlighting overlay
    const commandList = Object.keys(promptMap)
        .map(cmd => cmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .sort((a, b) => b.length - a.length);
    const commandPattern = new RegExp('^\\s*(' + commandList.join('|') + ')', 'i');

    if (typeof CodeMirror !== 'undefined' && CodeMirror.defineMode) {
        CodeMirror.defineMode("slash-command-overlay", function (config, parserConfig) {
            var overlay = {
                token: function (stream, state) {
                    if (stream.sol() && stream.match(commandPattern)) {
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
    }
    
    // Auto-save (diff)
    let autoSaveTimeout;
    editor.on("change", function() {
        if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {

        }, 6000);
    });
}

function removePressEnterHint(cm) {
    const lineCount = cm.lineCount();
    for (let i = 0; i < lineCount; i++) {
        const text = cm.getLine(i);
        if (text && (text.trim() === '`Press Enter to execute`' || text.trim() === '`Press Enter to begin`')) {
            cm.replaceRange('', { line: i, ch: 0 }, { line: i, ch: text.length }, '+remove-press-enter');
            // Also remove the line break if it exists
            if (i < lineCount - 1 && cm.getLine(i).length === 0) {
                cm.replaceRange('', { line: i, ch: 0 }, { line: i + 1, ch: 0 }, '+remove-empty-line');
            }
        }
    }
    currentHintLine = -1;
}

function addEditorFeatures(editor) {
    // Line numbers
    editor.setOption('lineNumbers', true);
    // Code folding
    editor.setOption('foldGutter', true);
    editor.setOption('gutters', ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']);
    
    // Search functionality
    editor.setOption('extraKeys', {
        'Ctrl-F': 'findPersistent',
        'Ctrl-H': 'replace',
        'Ctrl-G': 'findNext',
        'Shift-Ctrl-G': 'findPrev',
        'Ctrl-S': function(cm) {
            console.log('Saving document...');
            // save logic
        },
        'Ctrl-Z': 'undo',
        'Ctrl-Y': 'redo',
        'Ctrl-A': 'selectAll'
    });
    
    editor.setOption('lineWrapping', true);
    editor.setOption('matchBrackets', true);
    editor.setOption('autoCloseBrackets', true);    
    editor.setOption('highlightSelectionMatches', true);
}

// Command completion
function setupCommandCompletion(editor) {
    const commands = Object.keys(promptMap);
    
    editor.setOption('hintOptions', {
        hint: function(cm) {
            const cursor = cm.getCursor();
            const line = cm.getLine(cursor.line);
            const start = line.lastIndexOf('/', cursor.ch - 1);
            
            if (start >= 0) {
                const word = line.slice(start, cursor.ch);
                const suggestions = commands.filter(cmd => 
                    cmd.toLowerCase().startsWith(word.toLowerCase())
                ).slice(0, 10);
                
                if (suggestions.length > 0) {
                    return {
                        list: suggestions,
                        from: { line: cursor.line, ch: start },
                        to: { line: cursor.line, ch: cursor.ch }
                    };
                }
            }
        }
    });
}

// File operations
function addFileOperations(editor) {
    return {
        save: function() {
            const content = editor.getValue();
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mintputs-document.md';
            a.click();
            URL.revokeObjectURL(url);
            console.log('Document saved!');
        },
        
        load: function(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                editor.setValue(e.target.result);
            };
            reader.readAsText(file);
        },
        
        exportHTML: function() {
            const content = editor.getValue();
            const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MintPuts Export</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3, h4, h5, h6 { color: #333; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
    </style>
</head>
<body>
    <pre>${content}</pre>
</body>
</html>`;
            
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mintputs-export.html';
            a.click();
            URL.revokeObjectURL(url);
        }
    };
}

// Theme management
function addThemeSupport(editor) {
    const themes = {
        light: {
            background: '#ffffff',
            text: '#333333',
            accent: '#007bff'
        },
        dark: {
            background: '#1a1a1a',
            text: '#e5e5e5',
            accent: '#4facfe'
        },
        dracula: {
            background: '#282a36',
            text: '#f8f8f2',
            accent: '#bd93f9'
        }
    };
    
    return {
        setTheme: function(themeName) {
            if (themes[themeName]) {
                editor.setOption('theme', themeName);
                localStorage.setItem('mintputs-theme', themeName);
            }
        },
        
        getTheme: function() {
            return localStorage.getItem('mintputs-theme') || 'light';
        },
        
        initTheme: function() {
            const savedTheme = this.getTheme();
            this.setTheme(savedTheme);
        }
    };
}

// Statistics and analytics
function addEditorStats(editor) {
    let stats = {
        charactersTyped: 0,
        wordsTyped: 0,
        commandsExecuted: 0,
        sessionsStarted: 0
    };
    
    // Load saved stats
    const savedStats = localStorage.getItem('mintputs-stats');
    if (savedStats) {
        stats = { ...stats, ...JSON.parse(savedStats) };
    }
    
    // Track typing
    editor.on('change', function(cm, change) {
        if (change.origin === '+input') {
            stats.charactersTyped += change.text.join('').length;
            stats.wordsTyped += change.text.join(' ').split(/\s+/).filter(w => w.length > 0).length;
            saveStats();
        }
    });
    
    function saveStats() {
        localStorage.setItem('mintputs-stats', JSON.stringify(stats));
    }
    
    return {
        getStats: () => stats,
        incrementCommands: () => {
            stats.commandsExecuted++;
            saveStats();
        },
        resetStats: () => {
            stats = { charactersTyped: 0, wordsTyped: 0, commandsExecuted: 0, sessionsStarted: 0 };
            saveStats();
        }
    };
}

// Plugin system
function createPluginSystem(editor) {
    const plugins = {};
    
    return {
        register: function(name, plugin) {
            if (typeof plugin.init === 'function') {
                plugins[name] = plugin;
                plugin.init(editor);
                console.log(`Plugin "${name}" registered successfully`);
            } else {
                console.error(`Plugin "${name}" must have an init function`);
            }
        },
        
        unregister: function(name) {
            if (plugins[name] && typeof plugins[name].destroy === 'function') {
                plugins[name].destroy();
                delete plugins[name];
                console.log(`Plugin "${name}" unregistered`);
            }
        },
        
        getPlugin: function(name) {
            return plugins[name];
        },
        
        listPlugins: function() {
            return Object.keys(plugins);
        }
    };
}

// Live preview functionality
function addLivePreview(editor, previewElement) {
    let previewTimeout;
    
    function updatePreview() {
        if (previewTimeout) clearTimeout(previewTimeout);
        previewTimeout = setTimeout(() => {
            const content = editor.getValue();
            if (previewElement) {
                // Simple markdown-like rendering
                let html = content
                    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                    .replace(/\*(.*)\*/gim, '<em>$1</em>')
                    .replace(/`(.*)`/gim, '<code>$1</code>')
                    .replace(/\n/gim, '<br>');
                
                previewElement.innerHTML = html;
            }
        }, 300);
    }
    
    editor.on('change', updatePreview);
    updatePreview(); // Initial render
    
    return {
        update: updatePreview,
        toggle: function(show) {
            if (previewElement) {
                previewElement.style.display = show ? 'block' : 'none';
            }
        }
    };
}

// Export all functions
export { 
    typewriterInsertCM5, 
    typewriterInsertLineCM5, 
    setupIntellisense, 
    addEditorFeatures,
    setupCommandCompletion,
    addFileOperations,
    addThemeSupport,
    addEditorStats,
    createPluginSystem,
    addLivePreview,
    isTypewriterActive,
    removePressEnterHint,
    clearPendingHint
};
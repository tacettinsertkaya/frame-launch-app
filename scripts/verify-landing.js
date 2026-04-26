const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
    const fullPath = path.join(root, relativePath);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`Expected ${relativePath} to exist`);
    }
    return fs.readFileSync(fullPath, 'utf8');
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

const landingHtml = read('index.html');
const editorHtml = read('editor.html');
const landingCss = read('landing.css');
const landingJs = read('landing.js');

assert(
    landingHtml.includes('class="landing-page"'),
    'index.html should be the landing root'
);
assert(
    !landingHtml.includes('class="app-container"'),
    'index.html should not contain the editor shell'
);
assert(
    editorHtml.includes('class="app-container"'),
    'editor.html should contain the existing editor shell'
);

assert(
    landingHtml.includes('<link rel="stylesheet" href="landing.css">'),
    'landing.html should load landing.css'
);
assert(
    landingHtml.includes('<script src="landing.js" defer></script>'),
    'landing.html should load landing.js with defer'
);
assert(
    landingHtml.includes('href="editor.html"'),
    'landing CTAs should point to editor.html'
);
assert(
    landingHtml.includes('id="features"'),
    'landing page should include the features anchor'
);
assert(
    landingHtml.includes('Frame<span>Launch</span>'),
    'landing page should include the Frame Launch wordmark'
);

assert(
    landingCss.includes('.landing-page'),
    'landing styles should be scoped under .landing-page'
);
assert(
    landingCss.includes('@media (prefers-reduced-motion: reduce)'),
    'landing styles should include reduced motion safeguards'
);
assert(
    landingJs.includes('IntersectionObserver'),
    'landing script should animate stats only when visible'
);
assert(
    landingJs.includes('prefers-reduced-motion'),
    'landing script should respect reduced motion preferences'
);

console.log('Landing smoke test passed');

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const requiredRoutes = [
    'Dockerfile',
    'index.html',
    'editor.html',
    'privacy.html',
    'terms.html',
    'contact.html',
    'about.html',
    'cookies.html',
    'templates.html',
    '404.html',
    'ads.txt',
    'robots.txt',
    'sitemap.xml',
    'ad-config.js',
    'ads.js',
    'consent.js',
    'guides/index.html',
    'guides/app-store-screenshot-sizes.html',
    'guides/google-play-graphics.html',
    'guides/screenshot-localization.html',
    'guides/marketing-screenshot-design.html',
    'guides/frame-launch-workflow.html',
];

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

function routeToFile(href) {
    if (href === '/') return 'index.html';
    if (href.endsWith('/')) return path.join(href.slice(1), 'index.html');
    return href.replace(/^\//, '');
}

requiredRoutes.forEach(read);

const index = read('index.html');
const editor = read('editor.html');
const sitemap = read('sitemap.xml');
const adsTxt = read('ads.txt');
const adConfig = read('ad-config.js');
const nginx = read('nginx.conf');

assert(index.includes('<html lang="en">'), 'index.html should be English-first');
assert(index.includes('https://framelaunch.store/'), 'index.html should use the production canonical domain');
assert(index.includes('data-ad-slot="landing"'), 'landing page should include one disabled ad slot');
assert(!editor.includes('data-ad-slot='), 'editor.html should not include ad slots');
assert(!editor.includes('/ads.js'), 'editor.html should not load ad scripts');
assert(adConfig.includes('ADSENSE_CLIENT_ID'), 'ad config should expose ADSENSE_CLIENT_ID');
assert(adConfig.includes('enabled: false'), 'ads should be disabled by default');
assert(adsTxt.trim() === 'google.com, pub-2381519809541067, DIRECT, f08c47fec0942fa0', 'ads.txt should contain the configured AdSense publisher ID');
assert(nginx.includes('Content-Security-Policy-Report-Only'), 'nginx should include CSP report-only header');
assert(nginx.includes('Strict-Transport-Security'), 'nginx should include HSTS header');

[
    'https://framelaunch.store/privacy.html',
    'https://framelaunch.store/terms.html',
    'https://framelaunch.store/contact.html',
    'https://framelaunch.store/about.html',
    'https://framelaunch.store/cookies.html',
    'https://framelaunch.store/templates.html',
    'https://framelaunch.store/guides/app-store-screenshot-sizes.html',
    'https://framelaunch.store/guides/google-play-graphics.html',
    'https://framelaunch.store/guides/screenshot-localization.html',
    'https://framelaunch.store/guides/marketing-screenshot-design.html',
    'https://framelaunch.store/guides/frame-launch-workflow.html',
].forEach((url) => {
    assert(sitemap.includes(url), `sitemap.xml should include ${url}`);
});

const htmlFiles = requiredRoutes.filter((file) => file.endsWith('.html'));
const assetPattern = /\b(?:href|src)="([^"]+)"/g;

for (const file of htmlFiles) {
    const html = read(file);
    let match;
    while ((match = assetPattern.exec(html)) !== null) {
        const href = match[1];
        if (
            href.startsWith('#') ||
            href.startsWith('http://') ||
            href.startsWith('https://') ||
            href.startsWith('mailto:') ||
            href.startsWith('data:')
        ) {
            continue;
        }

        const cleanHref = href.split('#')[0].split('?')[0];
        if (!cleanHref) continue;
        const target = routeToFile(cleanHref);
        const fullTarget = path.join(root, target);
        assert(fs.existsSync(fullTarget), `${file} links to missing ${href}`);
    }
}

console.log('Production readiness checks passed');

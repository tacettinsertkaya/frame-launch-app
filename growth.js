(function () {
    var config = window.FrameLaunchGrowthConfig || {};
    var analytics = config.analytics || {};
    var dataLayer = window.dataLayer = window.dataLayer || [];
    var pagePath = window.location.pathname || '/';
    var isEditor = document.body && document.body.classList.contains('editor-page');

    function nowIso() {
        return new Date().toISOString();
    }

    function safeStorage(method, key, value) {
        try {
            if (method === 'get') return window.localStorage.getItem(key);
            if (method === 'set') window.localStorage.setItem(key, value);
        } catch (e) {}
        return null;
    }

    function readAttribution() {
        var params = new URLSearchParams(window.location.search);
        var fields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
        var attribution = {};
        var hasUtm = false;

        fields.forEach(function (field) {
            var value = params.get(field);
            if (!value) return;
            attribution[field] = value;
            hasUtm = true;
        });

        if (hasUtm) {
            attribution.landing_path = pagePath;
            attribution.captured_at = nowIso();
            safeStorage('set', config.utmStorageKey || 'fl-last-attribution-v1', JSON.stringify(attribution));
            return attribution;
        }

        var stored = safeStorage('get', config.utmStorageKey || 'fl-last-attribution-v1');
        if (!stored) return {};
        try {
            return JSON.parse(stored) || {};
        } catch (e) {
            return {};
        }
    }

    var attribution = readAttribution();

    function cleanPayload(payload) {
        var output = {};
        Object.keys(payload || {}).forEach(function (key) {
            var value = payload[key];
            if (value === undefined || value === null || value === '') return;
            output[key] = value;
        });
        return output;
    }

    function track(eventName, payload) {
        if (!eventName) return;
        var eventPayload = cleanPayload(Object.assign({
            event: eventName,
            event_name: eventName,
            page_path: pagePath,
            page_title: document.title,
            timestamp: nowIso(),
        }, attribution, payload || {}));

        dataLayer.push(eventPayload);

        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, eventPayload);
        }

        if (typeof window.clarity === 'function') {
            window.clarity('event', eventName);
        }
    }

    function loadScript(src, attrs) {
        var script = document.createElement('script');
        script.async = true;
        script.src = src;
        Object.keys(attrs || {}).forEach(function (key) {
            script.setAttribute(key, attrs[key]);
        });
        document.head.appendChild(script);
    }

    function bootGtm() {
        if (!analytics.gtmId) return;
        if (document.querySelector('script[src*="googletagmanager.com/gtm.js?id="]')) return;
        dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
        loadScript('https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(analytics.gtmId));
    }

    function bootGa4() {
        if (!analytics.ga4MeasurementId || analytics.gtmId) return;
        loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(analytics.ga4MeasurementId));
        window.gtag = window.gtag || function () { dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', analytics.ga4MeasurementId, { send_page_view: false });
    }

    function bootClarity() {
        if (!analytics.clarityProjectId) return;
        (function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
            t = l.createElement(r);
            t.async = 1;
            t.src = 'https://www.clarity.ms/tag/' + i;
            y = l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t, y);
        })(window, document, 'clarity', 'script', analytics.clarityProjectId);
    }

    window.FrameLaunchGrowth = {
        track: track,
        attribution: attribution,
    };

    function addJsonLd(id, data) {
        if (document.getElementById(id)) return;
        var script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
    }

    function addPageSchemas() {
        var canonical = document.querySelector('link[rel="canonical"]');
        var canonicalUrl = canonical ? canonical.href : window.location.href.split('#')[0];
        var description = document.querySelector('meta[name="description"]');
        var parts = pagePath.split('/').filter(Boolean);

        addJsonLd('fl-organization-schema', {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': 'https://framelaunch.store/#organization',
            name: 'Frame Launch',
            url: 'https://framelaunch.store/',
            logo: 'https://framelaunch.store/img/apple-touch-icon.png',
            sameAs: ['https://github.com/YUZU-Hub/appscreen']
        });

        if (parts.length > 0) {
            addJsonLd('fl-breadcrumb-schema', {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: parts.map(function (part, index) {
                    var path = '/' + parts.slice(0, index + 1).join('/');
                    if (!path.endsWith('.html') && index < parts.length - 1) path += '/';
                    return {
                        '@type': 'ListItem',
                        position: index + 1,
                        name: part.replace(/\.html$/, '').replace(/-/g, ' ').replace(/\s+/g, ' ').trim(),
                        item: 'https://framelaunch.store' + path
                    };
                })
            });
        }

        if (document.querySelector('meta[property="og:type"][content="article"]') || document.body.classList.contains('content-page')) {
            addJsonLd('fl-article-schema', {
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: document.title.replace(' - Frame Launch', ''),
                description: description ? description.content : '',
                mainEntityOfPage: canonicalUrl,
                author: { '@id': 'https://framelaunch.store/#organization' },
                publisher: { '@id': 'https://framelaunch.store/#organization' }
            });
        }
    }

    bootGtm();
    bootGa4();
    bootClarity();
    addPageSchemas();

    track('page_view', {
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        referrer: document.referrer,
    });

    if (isEditor) {
        track('editor_open');
    }

    document.addEventListener('click', function (event) {
        var tracked = event.target.closest('[data-track-event]');
        if (!tracked) return;
        track(tracked.getAttribute('data-track-event'), {
            event_label: tracked.getAttribute('data-track-label') || tracked.textContent.trim(),
            event_location: tracked.getAttribute('data-track-location') || '',
            href: tracked.getAttribute('href') || '',
        });
    });

    var firstEditTracked = false;
    if (isEditor) {
        document.addEventListener('input', function (event) {
            if (firstEditTracked || !event.target.closest('.sidebar-right')) return;
            firstEditTracked = true;
            track('first_edit', { event_source: 'input' });
        }, true);

        document.addEventListener('change', function (event) {
            if (firstEditTracked || !event.target.closest('.sidebar-right')) return;
            firstEditTracked = true;
            track('first_edit', { event_source: 'change' });
        }, true);
    }

    var leadForm = document.querySelector('[data-lead-form]');
    if (leadForm) {
        leadForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            var emailInput = leadForm.querySelector('input[type="email"]');
            var status = leadForm.querySelector('[data-lead-status]');
            var email = emailInput ? emailInput.value.trim() : '';
            if (!email) return;

            var lead = {
                email: email,
                page_path: pagePath,
                attribution: attribution,
                captured_at: nowIso(),
            };

            var endpoint = config.leadCapture && config.leadCapture.endpoint;
            var delivered = false;
            if (endpoint) {
                try {
                    var response = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(lead),
                    });
                    delivered = response.ok;
                } catch (e) {
                    delivered = false;
                }
            }

            if (!delivered) {
                var storageKey = (config.leadCapture && config.leadCapture.storageKey) || 'fl-screenshot-checklist-leads-v1';
                var existing = [];
                try {
                    existing = JSON.parse(safeStorage('get', storageKey) || '[]');
                } catch (e) {
                    existing = [];
                }
                existing.push(lead);
                safeStorage('set', storageKey, JSON.stringify(existing.slice(-50)));
            }

            track('email_submit', { form_name: leadForm.getAttribute('data-lead-form'), delivered: delivered });
            leadForm.reset();
            if (status) {
                status.textContent = 'Checklist request saved. We will use it to send launch tips and updates.';
            }
        });
    }
}());

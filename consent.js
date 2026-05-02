(function () {
    var config = window.FrameLaunchConfig && window.FrameLaunchConfig.ads;
    var storageKey = config && config.consentStorageKey ? config.consentStorageKey : 'fl-ad-consent-v1';

    function getAdConsent() {
        try {
            return localStorage.getItem(storageKey) || 'unset';
        } catch (e) {
            return 'unset';
        }
    }

    function setAdConsent(value) {
        try {
            localStorage.setItem(storageKey, value);
        } catch (e) {}
    }

    window.FrameLaunchConsent = {
        getAdConsent: getAdConsent,
        setAdConsent: setAdConsent,
    };

    if (!config || !config.enabled || !config.ADSENSE_CLIENT_ID) return;
    if (getAdConsent() !== 'unset') return;

    var banner = document.createElement('section');
    banner.className = 'consent-banner';
    banner.setAttribute('aria-label', 'Ad privacy choices');
    banner.innerHTML = [
        '<p>Frame Launch can show ads to keep the editor free. You can allow personalized ads or keep ads non-personalized. See our <a href="/privacy.html">Privacy Policy</a> and <a href="/cookies.html">Cookie Policy</a>.</p>',
        '<div class="consent-actions">',
        '<button type="button" data-consent="personalized">Allow personalized ads</button>',
        '<button type="button" data-consent="non_personalized">Use non-personalized ads</button>',
        '</div>',
    ].join('');

    banner.addEventListener('click', function (event) {
        var button = event.target.closest('[data-consent]');
        if (!button) return;
        setAdConsent(button.getAttribute('data-consent'));
        banner.remove();
    });

    document.addEventListener('DOMContentLoaded', function () {
        document.body.appendChild(banner);
    });
}());

(function () {
    var config = window.FrameLaunchConfig && window.FrameLaunchConfig.ads;
    if (!config || !config.enabled || !config.ADSENSE_CLIENT_ID) return;

    var clientId = config.ADSENSE_CLIENT_ID;
    var slots = config.slots || {};
    var containers = Array.from(document.querySelectorAll('[data-ad-slot]'));
    if (containers.length === 0) return;

    var consent = window.FrameLaunchConsent && window.FrameLaunchConsent.getAdConsent
        ? window.FrameLaunchConsent.getAdConsent()
        : 'unset';

    window.adsbygoogle = window.adsbygoogle || [];
    if (consent !== 'personalized') {
        window.adsbygoogle.requestNonPersonalizedAds = 1;
    }

    function enableSlot(container) {
        var slotKey = container.getAttribute('data-ad-slot');
        var slotId = slots[slotKey];
        if (!slotId) return;

        var ad = container.querySelector('.adsbygoogle');
        if (!ad) return;

        ad.setAttribute('data-ad-client', clientId);
        ad.setAttribute('data-ad-slot', slotId);
        container.hidden = false;
        try {
            window.adsbygoogle.push({});
        } catch (e) {}
    }

    var script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(clientId);
    script.addEventListener('load', function () {
        containers.forEach(enableSlot);
    });
    document.head.appendChild(script);
}());

(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nav = document.querySelector('.landing-nav');
    const yearTargets = Array.from(document.querySelectorAll('[data-current-year]'));
    const statTargets = Array.from(document.querySelectorAll('[data-stat-value]'));

    yearTargets.forEach(function (target) {
        target.textContent = String(new Date().getFullYear());
    });

    function syncNav() {
        if (!nav) return;
        nav.classList.toggle('is-scrolled', window.scrollY > 12);
    }

    syncNav();
    window.addEventListener('scroll', syncNav, { passive: true });

    function setFinalStatValues() {
        statTargets.forEach(function (target) {
            target.textContent = target.dataset.statValue || '0';
        });
    }

    if (reduceMotion || statTargets.length === 0) {
        setFinalStatValues();
    } else {
        function animateNumber(target) {
            var finalValue = Number(target.dataset.statValue || 0);
            var start = performance.now();
            var duration = 1100;

            function tick(now) {
                var progress = Math.min(1, (now - start) / duration);
                var eased = 1 - Math.pow(1 - progress, 3);
                target.textContent = String(Math.round(finalValue * eased));

                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            }

            requestAnimationFrame(tick);
        }

        var statObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                animateNumber(entry.target);
                statObserver.unobserve(entry.target);
            });
        }, { threshold: 0.35 });

        statTargets.forEach(function (target) { statObserver.observe(target); });
    }

    // ── Scroll-triggered reveal animations ──

    var revealItems = Array.from(document.querySelectorAll('.reveal-item'));

    if (!reduceMotion && revealItems.length > 0) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var siblings = el.parentElement ? Array.from(el.parentElement.querySelectorAll('.reveal-item')) : [];
                var idx = siblings.indexOf(el);
                var delay = Math.max(0, idx) * 80;
                el.style.transitionDelay = delay + 'ms';
                el.classList.add('is-visible');
                revealObserver.unobserve(el);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealItems.forEach(function (item) { revealObserver.observe(item); });
    } else {
        revealItems.forEach(function (item) { item.classList.add('is-visible'); });
    }

    // ── Smooth scroll for anchor links ──

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── i18n translations ──

    var translations = {
        tr: {
            page_title: 'Frame Launch - Framelaunch ekran görüntüleri saniyeler içinde',
            meta_desc: 'Frame Launch ile tarayıcıda ücretsiz, hesap açmadan Framelaunch ve Play Store görselleri oluşturun.',
            nav_aria: 'Ana navigasyon',
            lang_aria: 'Dil',
            lang_menu_aria: 'Dil listesi',
            nav_features: 'Özellikler',
            nav_how: 'Nasıl çalışır',
            nav_cta: 'Editörü aç',
            hero_pill: 'Hesap yok · Watermark yok · Sınır yok · Veriniz tarayıcınızda kalır',
            hero_title: 'Framelaunch ekran görüntülerinizi <span>saniyeler içinde</span> oluşturun',
            hero_lede: 'Frame Launch, Framelaunch ve Play Store başvuruları için profesyonel ekran görüntüleri tasarlamanın hızlı, ücretsiz ve gizlilik dostu yolu.',
            hero_cta_primary: 'Hemen oluşturmaya başla <span aria-hidden="true">→</span>',
            hero_cta_secondary: 'Özellikleri keşfet',
            stat_devices: 'Cihaz boyutu',
            stat_templates: 'Hazır şablon',
            stat_browser: 'Tarayıcıda',
            stat_free: 'Ücretsiz',
            how_badge: 'Nasıl çalışır',
            how_title: '3 adımda profesyonel görseller',
            how_step1_title: 'Yükleyin',
            how_step1_desc: 'Uygulama ekran görüntülerinizi sürükleyip bırakın veya dosya seçin.',
            how_step2_title: 'Tasarlayın',
            how_step2_desc: 'Arka plan, çerçeve, başlık, 3D görünüm ve efektleri özelleştirin.',
            how_step3_title: 'İndirin',
            how_step3_desc: 'Tek tıkla veya toplu ZIP olarak PNG formatında dışa aktarın.',
            features_badge: 'Neler sunuyor',
            features_title: 'Profesyonel screenshot için ihtiyacınız olan her şey',
            features_subtitle: 'Tasarımcı olmadan, kod yazmadan, hesap açmadan. Tüm araçlar bir tıkla erişiminizde.',
            feature_1_title: '14+ cihaz ve marketing boyutu',
            feature_1_desc: 'iPhone, iPad, Android, OG, Twitter Card, Website Hero ve custom boyutlar.',
            feature_2_title: 'Profesyonel arka planlar',
            feature_2_desc: 'Gradient, düz renk veya kendi görseliniz. Blur, overlay ve noise ile ince ayar.',
            feature_3_title: 'Çok dilli metinler',
            feature_3_desc: 'Headline ve subheadline içeriklerini her dil için ayrı yönetin.',
            feature_4_title: 'Ön plan elementleri',
            feature_4_desc: 'İkon, emoji, metin rozeti ve grafiklerle dikkat çekici detaylar oluşturun.',
            feature_5_title: 'Hazır şablon kütüphanesi',
            feature_5_desc: 'SaaS, e-ticaret, fitness, AI ve marketing tasarımlarıyla hızlı başlayın.',
            feature_6_title: 'Tek tık veya toplu PNG export',
            feature_6_desc: 'Tek bir görseli veya tüm projeyi marketlere uygun çözünürlükte indirin.',
            feature_7_title: 'Tarayıcıda yüzde yüz çalışır',
            feature_7_desc: 'Yüklediğiniz görseller sunucuya gitmez. Tüm işleme cihazınızda kalır.',
            feature_8_title: 'Hesap yok, watermark yok',
            feature_8_desc: 'Kayıt, ücret veya filigran olmadan sınırsız kullanım.',
            feature_9_title: 'Anında önizleme',
            feature_9_desc: 'Canvas tabanlı render ile yaptığınız değişiklikleri anında görün.',
            cta_pill: '60 saniye · 0 ücret',
            cta_title: 'İlk screenshot\'ınızı <span>60 saniyede</span> yapın',
            cta_desc: 'Hesap açmadan, kart bilgisi vermeden. Doğrudan editöre geçin.',
            cta_button: 'Editörü aç',
            footer_copy: '© <span data-current-year>' + new Date().getFullYear() + '</span> Frame Launch · Tarayıcıda ücretsiz',
            footer_editor: 'Editör',
            footer_features: 'Özellikler',
        },
        en: {
            page_title: 'Frame Launch - App Store screenshots in seconds',
            meta_desc: 'Create App Store, Google Play, and marketing screenshots in your browser. Free, no account, no watermark.',
            nav_aria: 'Main navigation',
            lang_aria: 'Language',
            lang_menu_aria: 'Choose language',
            nav_features: 'Features',
            nav_how: 'How it works',
            nav_cta: 'Open Editor',
            hero_pill: 'No account · No watermark · No limits · Your data stays in your browser',
            hero_title: 'Create your app screenshots <span>in seconds</span>',
            hero_lede: 'Frame Launch is the fast, free, and privacy-friendly way to design professional screenshots for App Store, Google Play, social, and launch pages.',
            hero_cta_primary: 'Start creating now <span aria-hidden="true">→</span>',
            hero_cta_secondary: 'Explore features',
            stat_devices: 'Device sizes',
            stat_templates: 'Templates',
            stat_browser: 'In-browser',
            stat_free: 'Free',
            how_badge: 'How it works',
            how_title: 'Professional visuals in 3 steps',
            how_step1_title: 'Upload',
            how_step1_desc: 'Drag and drop your app screenshots or browse files.',
            how_step2_title: 'Customize',
            how_step2_desc: 'Set background, frame, headline, 3D view and effects.',
            how_step3_title: 'Download',
            how_step3_desc: 'Export as PNG with one click or batch ZIP.',
            features_badge: 'What it offers',
            features_title: 'Everything you need for professional screenshots',
            features_subtitle: 'No designer, no code, no account. All the tools you need, one click away.',
            feature_1_title: '14+ device & marketing sizes',
            feature_1_desc: 'iPhone, iPad, Android, OG, Twitter Card, Website Hero and custom sizes.',
            feature_2_title: 'Professional backgrounds',
            feature_2_desc: 'Gradient, solid color or your own image. Fine-tune with blur, overlay and noise.',
            feature_3_title: 'Multi-language text',
            feature_3_desc: 'Manage headline and subheadline content separately for each language.',
            feature_4_title: 'Foreground elements',
            feature_4_desc: 'Create eye-catching details with icons, emojis, text badges and graphics.',
            feature_5_title: 'Ready-made template library',
            feature_5_desc: 'Quick start with SaaS, e-commerce, fitness, AI and marketing designs.',
            feature_6_title: 'One-click or batch PNG export',
            feature_6_desc: 'Download a single image or the entire project in market-ready resolution.',
            feature_7_title: 'Runs 100% in the browser',
            feature_7_desc: 'Your images never leave your device. All processing stays local.',
            feature_8_title: 'No account, no watermark',
            feature_8_desc: 'Unlimited use without registration, payment or watermarks.',
            feature_9_title: 'Instant preview',
            feature_9_desc: 'See your changes instantly with canvas-based rendering.',
            cta_pill: '60 seconds · $0',
            cta_title: 'Create your first screenshot <span>in 60 seconds</span>',
            cta_desc: 'No sign-up, no credit card. Jump straight into the editor.',
            cta_button: 'Open Editor',
            footer_copy: '© <span data-current-year>' + new Date().getFullYear() + '</span> Frame Launch · Free in browser',
            footer_editor: 'Editor',
            footer_features: 'Features',
        },
        de: {
            page_title: 'Frame Launch - Framelaunch-Screenshots in Sekunden',
            meta_desc: 'Framelaunch- und Play Store-Grafiken kostenlos im Browser erstellen. Kein Konto, kein Wasserzeichen.',
            nav_aria: 'Hauptnavigation',
            lang_aria: 'Sprache',
            lang_menu_aria: 'Sprachauswahl',
            nav_features: 'Funktionen',
            nav_how: 'So funktioniert\'s',
            nav_cta: 'Editor öffnen',
            hero_pill: 'Kein Konto · Kein Wasserzeichen · Keine Grenzen · Ihre Daten bleiben im Browser',
            hero_title: 'Erstellen Sie Ihre Framelaunch-Screenshots <span>in Sekunden</span>',
            hero_lede: 'Frame Launch ist der schnelle, kostenlose und datenschutzfreundliche Weg, professionelle Screenshots für Framelaunch und Play Store zu gestalten.',
            hero_cta_primary: 'Jetzt erstellen <span aria-hidden="true">→</span>',
            hero_cta_secondary: 'Funktionen entdecken',
            stat_devices: 'Gerätegrößen',
            stat_templates: 'Vorlagen',
            stat_browser: 'Im Browser',
            stat_free: 'Kostenlos',
            how_badge: 'So funktioniert\'s',
            how_title: 'Professionelle Visuals in 3 Schritten',
            how_step1_title: 'Hochladen',
            how_step1_desc: 'Ziehen Sie Ihre App-Screenshots per Drag & Drop oder wählen Sie Dateien aus.',
            how_step2_title: 'Gestalten',
            how_step2_desc: 'Hintergrund, Rahmen, Überschrift, 3D-Ansicht und Effekte anpassen.',
            how_step3_title: 'Herunterladen',
            how_step3_desc: 'Exportieren Sie als PNG mit einem Klick oder als Batch-ZIP.',
            features_badge: 'Was es bietet',
            features_title: 'Alles was Sie für professionelle Screenshots brauchen',
            features_subtitle: 'Kein Designer, kein Code, kein Konto. Alle Werkzeuge mit einem Klick.',
            feature_1_title: '14+ Geräte- und Marketinggrößen',
            feature_1_desc: 'iPhone, iPad, Android, OG, Twitter Card, Website Hero und eigene Größen.',
            feature_2_title: 'Professionelle Hintergründe',
            feature_2_desc: 'Gradient, Volltonfarbe oder eigenes Bild. Feinabstimmung mit Blur, Overlay und Noise.',
            feature_3_title: 'Mehrsprachige Texte',
            feature_3_desc: 'Überschriften und Unterüberschriften separat für jede Sprache verwalten.',
            feature_4_title: 'Vordergrund-Elemente',
            feature_4_desc: 'Erstellen Sie auffällige Details mit Icons, Emojis, Textbadges und Grafiken.',
            feature_5_title: 'Fertige Vorlagenbibliothek',
            feature_5_desc: 'Schnellstart mit SaaS-, E-Commerce-, Fitness-, AI- und Marketing-Designs.',
            feature_6_title: 'Ein-Klick oder Batch-PNG-Export',
            feature_6_desc: 'Einzelbild oder gesamtes Projekt in marktfertiger Auflösung herunterladen.',
            feature_7_title: 'Läuft 100% im Browser',
            feature_7_desc: 'Ihre Bilder verlassen nie Ihr Gerät. Alle Verarbeitung bleibt lokal.',
            feature_8_title: 'Kein Konto, kein Wasserzeichen',
            feature_8_desc: 'Unbegrenzte Nutzung ohne Registrierung, Zahlung oder Wasserzeichen.',
            feature_9_title: 'Sofortige Vorschau',
            feature_9_desc: 'Sehen Sie Ihre Änderungen sofort mit Canvas-basiertem Rendering.',
            cta_pill: '60 Sekunden · 0 €',
            cta_title: 'Erstellen Sie Ihren ersten Screenshot <span>in 60 Sekunden</span>',
            cta_desc: 'Ohne Anmeldung, ohne Kreditkarte. Direkt zum Editor.',
            cta_button: 'Editor öffnen',
            footer_copy: '© <span data-current-year>' + new Date().getFullYear() + '</span> Frame Launch · Kostenlos im Browser',
            footer_editor: 'Editor',
            footer_features: 'Funktionen',
        },
        fr: {
            page_title: 'Frame Launch - Captures Framelaunch en quelques secondes',
            meta_desc: 'Créez des visuels Framelaunch et Play Store dans le navigateur, gratuits, sans compte. Pas de filigrane.',
            nav_aria: 'Navigation principale',
            lang_aria: 'Langue',
            lang_menu_aria: 'Choisir la langue',
            nav_features: 'Fonctionnalités',
            nav_how: 'Comment ça marche',
            nav_cta: 'Ouvrir l\'éditeur',
            hero_pill: 'Pas de compte · Pas de filigrane · Sans limite · Vos données restent dans votre navigateur',
            hero_title: 'Créez vos captures Framelaunch <span>en quelques secondes</span>',
            hero_lede: 'Frame Launch est le moyen rapide, gratuit et respectueux de la vie privée pour concevoir des captures d\'écran professionnelles pour l\'Framelaunch et le Play Store.',
            hero_cta_primary: 'Commencer maintenant <span aria-hidden="true">→</span>',
            hero_cta_secondary: 'Découvrir les fonctionnalités',
            stat_devices: 'Tailles d\'écran',
            stat_templates: 'Modèles',
            stat_browser: 'Dans le navigateur',
            stat_free: 'Gratuit',
            how_badge: 'Comment ça marche',
            how_title: 'Des visuels professionnels en 3 étapes',
            how_step1_title: 'Téléchargez',
            how_step1_desc: 'Glissez-déposez vos captures d\'écran ou parcourez vos fichiers.',
            how_step2_title: 'Personnalisez',
            how_step2_desc: 'Fond, cadre, titre, vue 3D et effets.',
            how_step3_title: 'Téléchargez',
            how_step3_desc: 'Exportez en PNG en un clic ou en ZIP par lot.',
            features_badge: 'Ce qu\'il offre',
            features_title: 'Tout ce dont vous avez besoin pour des captures professionnelles',
            features_subtitle: 'Sans designer, sans code, sans compte. Tous les outils en un clic.',
            feature_1_title: '14+ tailles d\'appareils et marketing',
            feature_1_desc: 'iPhone, iPad, Android, OG, Twitter Card, Website Hero et tailles personnalisées.',
            feature_2_title: 'Arrière-plans professionnels',
            feature_2_desc: 'Dégradé, couleur unie ou votre propre image. Ajustement fin avec flou, overlay et bruit.',
            feature_3_title: 'Textes multilingues',
            feature_3_desc: 'Gérez les titres et sous-titres séparément pour chaque langue.',
            feature_4_title: 'Éléments de premier plan',
            feature_4_desc: 'Créez des détails accrocheurs avec des icônes, emojis, badges texte et graphiques.',
            feature_5_title: 'Bibliothèque de modèles prêts',
            feature_5_desc: 'Démarrage rapide avec des designs SaaS, e-commerce, fitness, IA et marketing.',
            feature_6_title: 'Export PNG en un clic ou par lot',
            feature_6_desc: 'Téléchargez une seule image ou le projet entier en résolution adaptée aux stores.',
            feature_7_title: 'Fonctionne à 100% dans le navigateur',
            feature_7_desc: 'Vos images ne quittent jamais votre appareil. Tout le traitement reste local.',
            feature_8_title: 'Pas de compte, pas de filigrane',
            feature_8_desc: 'Utilisation illimitée sans inscription, paiement ou filigrane.',
            feature_9_title: 'Aperçu instantané',
            feature_9_desc: 'Voyez vos modifications instantanément avec le rendu basé sur Canvas.',
            cta_pill: '60 secondes · 0 €',
            cta_title: 'Créez votre première capture <span>en 60 secondes</span>',
            cta_desc: 'Sans inscription, sans carte bancaire. Accédez directement à l\'éditeur.',
            cta_button: 'Ouvrir l\'éditeur',
            footer_copy: '© <span data-current-year>' + new Date().getFullYear() + '</span> Frame Launch · Gratuit dans le navigateur',
            footer_editor: 'Éditeur',
            footer_features: 'Fonctionnalités',
        },
        es: {
            page_title: 'Frame Launch - Capturas de Framelaunch en segundos',
            meta_desc: 'Crea imágenes de Framelaunch y Play Store en el navegador, gratis, sin cuenta. Sin marca de agua.',
            nav_aria: 'Navegación principal',
            lang_aria: 'Idioma',
            lang_menu_aria: 'Elegir idioma',
            nav_features: 'Características',
            nav_how: 'Cómo funciona',
            nav_cta: 'Abrir editor',
            hero_pill: 'Sin cuenta · Sin marca de agua · Sin límites · Tus datos permanecen en tu navegador',
            hero_title: 'Crea tus capturas de Framelaunch <span>en segundos</span>',
            hero_lede: 'Frame Launch es la forma rápida, gratuita y respetuosa con la privacidad de diseñar capturas de pantalla profesionales para Framelaunch y Play Store.',
            hero_cta_primary: 'Empieza a crear ahora <span aria-hidden="true">→</span>',
            hero_cta_secondary: 'Explorar características',
            stat_devices: 'Tamaños de dispositivo',
            stat_templates: 'Plantillas',
            stat_browser: 'En el navegador',
            stat_free: 'Gratis',
            how_badge: 'Cómo funciona',
            how_title: 'Visuales profesionales en 3 pasos',
            how_step1_title: 'Sube',
            how_step1_desc: 'Arrastra y suelta tus capturas o selecciona archivos.',
            how_step2_title: 'Personaliza',
            how_step2_desc: 'Fondo, marco, título, vista 3D y efectos.',
            how_step3_title: 'Descarga',
            how_step3_desc: 'Exporta como PNG con un clic o ZIP por lotes.',
            features_badge: 'Qué ofrece',
            features_title: 'Todo lo que necesitas para capturas profesionales',
            features_subtitle: 'Sin diseñador, sin código, sin cuenta. Todas las herramientas a un clic.',
            feature_1_title: '14+ tamaños de dispositivos y marketing',
            feature_1_desc: 'iPhone, iPad, Android, OG, Twitter Card, Website Hero y tamaños personalizados.',
            feature_2_title: 'Fondos profesionales',
            feature_2_desc: 'Degradado, color sólido o tu propia imagen. Ajuste fino con blur, overlay y ruido.',
            feature_3_title: 'Textos multilingüe',
            feature_3_desc: 'Gestiona títulos y subtítulos por separado para cada idioma.',
            feature_4_title: 'Elementos de primer plano',
            feature_4_desc: 'Crea detalles llamativos con iconos, emojis, insignias de texto y gráficos.',
            feature_5_title: 'Biblioteca de plantillas listas',
            feature_5_desc: 'Inicio rápido con diseños SaaS, e-commerce, fitness, IA y marketing.',
            feature_6_title: 'Exportación PNG con un clic o por lotes',
            feature_6_desc: 'Descarga una sola imagen o el proyecto completo en resolución lista para tiendas.',
            feature_7_title: 'Funciona 100% en el navegador',
            feature_7_desc: 'Tus imágenes nunca salen de tu dispositivo. Todo el procesamiento es local.',
            feature_8_title: 'Sin cuenta, sin marca de agua',
            feature_8_desc: 'Uso ilimitado sin registro, pago ni marcas de agua.',
            feature_9_title: 'Vista previa instantánea',
            feature_9_desc: 'Ve tus cambios al instante con renderizado basado en Canvas.',
            cta_pill: '60 segundos · $0',
            cta_title: 'Crea tu primera captura <span>en 60 segundos</span>',
            cta_desc: 'Sin registrarte, sin tarjeta de crédito. Pasa directo al editor.',
            cta_button: 'Abrir editor',
            footer_copy: '© <span data-current-year>' + new Date().getFullYear() + '</span> Frame Launch · Gratis en el navegador',
            footer_editor: 'Editor',
            footer_features: 'Características',
        },
        ja: {
            page_title: 'Frame Launch - Framelaunch スクリーンショットを数秒で',
            meta_desc: 'ブラウザ上でFramelaunch / Play Store向けの画像を無料で。アカウント不要、透かしなし。',
            nav_aria: 'メインナビゲーション',
            lang_aria: '言語',
            lang_menu_aria: '言語を選ぶ',
            nav_features: '機能',
            nav_how: '使い方',
            nav_cta: 'エディタを開く',
            hero_pill: 'アカウント不要 · 透かしなし · 制限なし · データはブラウザに保存',
            hero_title: 'Framelaunchのスクリーンショットを<span>数秒で</span>作成',
            hero_lede: 'Frame Launchは、FramelaunchとPlay Storeのプロフェッショナルなスクリーンショットを、高速・無料・プライバシーに配慮して作成できるツールです。',
            hero_cta_primary: '今すぐ作成を開始 <span aria-hidden="true">→</span>',
            hero_cta_secondary: '機能を見る',
            stat_devices: 'デバイスサイズ',
            stat_templates: 'テンプレート',
            stat_browser: 'ブラウザ内',
            stat_free: '無料',
            how_badge: '使い方',
            how_title: '3ステップでプロフェッショナルなビジュアル',
            how_step1_title: 'アップロード',
            how_step1_desc: 'アプリのスクリーンショットをドラッグ&ドロップまたはファイルを選択。',
            how_step2_title: 'カスタマイズ',
            how_step2_desc: '背景、フレーム、見出し、3Dビュー、エフェクトを設定。',
            how_step3_title: 'ダウンロード',
            how_step3_desc: 'ワンクリックでPNG、またはバッチZIPでエクスポート。',
            features_badge: '提供機能',
            features_title: 'プロフェッショナルなスクリーンショットに必要なすべて',
            features_subtitle: 'デザイナー不要、コード不要、アカウント不要。すべてのツールがワンクリックで。',
            feature_1_title: '14+のデバイスとマーケティングサイズ',
            feature_1_desc: 'iPhone、iPad、Android、OG、Twitter Card、Website Heroとカスタムサイズ。',
            feature_2_title: 'プロフェッショナルな背景',
            feature_2_desc: 'グラデーション、単色、または独自の画像。ブラー、オーバーレイ、ノイズで微調整。',
            feature_3_title: '多言語テキスト',
            feature_3_desc: '各言語ごとに見出しとサブ見出しを個別に管理。',
            feature_4_title: '前景要素',
            feature_4_desc: 'アイコン、絵文字、テキストバッジ、グラフィックで目を引くディテールを作成。',
            feature_5_title: '既製テンプレートライブラリ',
            feature_5_desc: 'SaaS、EC、フィットネス、AI、マーケティングデザインで素早くスタート。',
            feature_6_title: 'ワンクリックまたは一括PNGエクスポート',
            feature_6_desc: '単一画像またはプロジェクト全体をストア対応の解像度でダウンロード。',
            feature_7_title: '100%ブラウザで動作',
            feature_7_desc: '画像はデバイスから出ません。すべての処理はローカルで行われます。',
            feature_8_title: 'アカウント不要、透かしなし',
            feature_8_desc: '登録、支払い、透かしなしで無制限に利用可能。',
            feature_9_title: 'リアルタイムプレビュー',
            feature_9_desc: 'Canvasベースのレンダリングで変更を即座に確認。',
            cta_pill: '60秒 · ¥0',
            cta_title: '最初のスクリーンショットを<span>60秒で</span>作成',
            cta_desc: 'サインアップ不要、クレジットカード不要。すぐにエディタへ。',
            cta_button: 'エディタを開く',
            footer_copy: '© <span data-current-year>' + new Date().getFullYear() + '</span> Frame Launch · ブラウザで無料',
            footer_editor: 'エディタ',
            footer_features: '機能',
        },
    };

    var langMeta = {
        tr: { flag: '🇹🇷', label: 'TR', htmlLang: 'tr' },
        en: { flag: '🇺🇸', label: 'EN', htmlLang: 'en' },
        de: { flag: '🇩🇪', label: 'DE', htmlLang: 'de' },
        fr: { flag: '🇫🇷', label: 'FR', htmlLang: 'fr' },
        es: { flag: '🇪🇸', label: 'ES', htmlLang: 'es' },
        ja: { flag: '🇯🇵', label: 'JA', htmlLang: 'ja' },
    };

    // ── Language selector ──

    var langToggle = document.querySelector('.landing-lang-toggle');
    var langMenu = document.querySelector('.landing-lang-menu');

    if (langToggle && langMenu) {
        langToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = langMenu.classList.toggle('is-open');
            langToggle.setAttribute('aria-expanded', String(isOpen));
        });

        langMenu.addEventListener('click', function (e) {
            var item = e.target.closest('[data-lang]');
            if (!item) return;
            var lang = item.dataset.lang;
            setLanguage(lang);
            langMenu.classList.remove('is-open');
            langToggle.setAttribute('aria-expanded', 'false');
        });

        document.addEventListener('click', function () {
            langMenu.classList.remove('is-open');
            langToggle.setAttribute('aria-expanded', 'false');
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                langMenu.classList.remove('is-open');
                langToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function setLanguage(lang) {
        if (!translations[lang]) return;
        var strings = translations[lang];
        var meta = langMeta[lang];

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (strings[key] != null) el.textContent = strings[key];
        });

        document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-html');
            if (strings[key] != null) el.innerHTML = strings[key];
        });

        if (meta) {
            document.documentElement.lang = meta.htmlLang;
            if (langToggle) {
                var flagEl = langToggle.querySelector('.landing-lang-flag');
                var labelEl = langToggle.querySelector('.landing-lang-label');
                if (flagEl) flagEl.textContent = meta.flag;
                if (labelEl) labelEl.textContent = meta.label;
            }
        }

        if (langMenu) {
            langMenu.querySelectorAll('[data-lang]').forEach(function (li) {
                li.setAttribute('aria-selected', li.dataset.lang === lang ? 'true' : 'false');
            });
        }

        if (strings.page_title) {
            document.title = strings.page_title;
            var ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.setAttribute('content', strings.page_title);
        }
        if (strings.meta_desc) {
            var mDesc = document.querySelector('meta[name="description"]');
            if (mDesc) mDesc.setAttribute('content', strings.meta_desc);
            var ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) ogDesc.setAttribute('content', strings.meta_desc);
        }
        if (nav && strings.nav_aria) {
            nav.setAttribute('aria-label', strings.nav_aria);
        }
        if (langToggle && strings.lang_aria) {
            langToggle.setAttribute('aria-label', strings.lang_aria);
        }
        if (langMenu && strings.lang_menu_aria) {
            langMenu.setAttribute('aria-label', strings.lang_menu_aria);
        }

        try { localStorage.setItem('fl-landing-lang', lang); } catch (e) {}
    }

    var savedLang = null;
    try { savedLang = localStorage.getItem('fl-landing-lang'); } catch (e) {}
    if (savedLang && translations[savedLang]) {
        setLanguage(savedLang);
    }
}());

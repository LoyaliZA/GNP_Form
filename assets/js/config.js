// GNP_Local/assets/js/config.js

export const CONFIG = {
    FADE_DURATION: 400,
    SPLASH_DISPLAY_DURATION: 1500,
    SPLASH_FADE_DURATION: 500,
    API_ENDPOINT: '/tu-endpoint-real-en-el-servidor',
    LOGO_VELER_DARK: 'assets/img/VELER_DARK.png',
    LOGO_VELER_LIGHT: 'assets/img/VELER_LIGHT.png',
    LOGO_GNP_DARK: 'assets/img/GNP_DARK.png',
    LOGO_GNP_LIGHT: 'assets/img/GNP_LIGHT.png',
    THEME_STORAGE_KEY: 'theme_mode',
    MOBILE_BREAKPOINT: 767,
    AVAILABLE_THEMES: [
        { name: "Veler Blue v2", file: "assets/css/theme-veler-blue_2.css" },
        { name: "Veler Blue", file: "assets/css/theme-veler-blue.css" },
        { name: "Teal Green v2", file: "assets/css/theme-teal-green_v2.css" },
        { name: "Teal Green", file: "assets/css/theme-teal-green.css" },
        { name: "Slate Mauve v2", file: "assets/css/theme-slate-mauve_2.css" },
        { name: "Slate Mauve", file: "assets/css/theme-slate-mauve.css" },
        { name: "Pink v2", file: "assets/css/theme-pink_2.css"},
        { name: "Pink", file: "assets/css/theme-pink.css" },
        { name: "Gold Teal v2", file: "assets/css/theme-gold-teal_2.css" },
        { name: "Gold Teal", file: "assets/css/theme-gold-teal.css" },
        { name: "Gold v2", file: "assets/css/theme-gold_2.css"},
        { name: "Gold", file: "assets/css/theme-gold.css"},
        { name: "Red Dark v2", file: "assets/css/theme-red-dark_2.css"},
        { name: "Red Dark", file: "assets/css/theme-red-dark.css"},
        { name: "GNP Default", file: "assets/css/theme-default.css" }
    ],
    DEFAULT_THEME_FILE: "assets/css/theme-veler-blue_2.css",
    SELECTED_THEME_FILE_KEY: 'selected_theme_file',
    THEME_LINK_ID: 'dynamic-theme-style-link'
};

export let state = {
    currentSeccionIndex: 0,
    isSidebarExpanded: true,
    isSidebarVisibleMobile: false,
    lastSubmitButton: null,
    isSubmitting: false,
};

// Selectores DOM Comunes
export const DOMElements = {
    $html: document.documentElement,
    $body: document.body,
    $splashScreen: document.getElementById('splash-screen'),
    $mainHeader: document.getElementById('main-header'),
    $formularioCompleto: document.getElementById('formulario-completo'),
    $form: document.getElementById('miFormularioDinamico'),
    $themeSwitch: document.getElementById('theme-checkbox'),
    $themeSelector: document.getElementById('theme-selector'),
    $logoVelerSidebar: document.getElementById('logo-veler-sidebar'),
    $logo1Splash: document.getElementById('logo1-splash'),
    $logo2Splash: document.getElementById('logo2-splash'),
    $modalSuccessLogo: document.getElementById('modal-success-logo'),
    $sidebar: document.getElementById('sidebar-navegacion'),
    get $sidebarToggle() { return DOMElements.$sidebar ? DOMElements.$sidebar.querySelector('.sidebar-toggle') : null; },
    get $sidebarMenuItems() { return DOMElements.$sidebar ? Array.from(DOMElements.$sidebar.querySelectorAll('.menu-item')) : []; },
    get $progressBarFill() { return DOMElements.$sidebar ? DOMElements.$sidebar.querySelector('.progress-fill') : null; },
    get $progressText() { return DOMElements.$sidebar ? DOMElements.$sidebar.querySelector('.progress-text') : null; },
    get $allSections() { return DOMElements.$form ? Array.from(DOMElements.$form.querySelectorAll('.seccion-formulario')) : []; },
    get $seccionRevision() { return DOMElements.$allSections.find(sec => sec.id === 'seccion-revision'); },
    get $seccionesNavegables() { return DOMElements.$allSections.filter(sec => sec.id !== 'seccion-revision'); },
    get $allFormFields() { return DOMElements.$form ? Array.from(DOMElements.$form.querySelectorAll('input, select, textarea')) : []; },
    $modalOverlay: document.getElementById('modal-overlay'),
    $modalContainer: document.getElementById('modal-container'),
    $modalErrorIcon: document.getElementById('modal-error-icon'),
    $modalTitle: document.getElementById('modal-title'),
    $modalMessage: document.getElementById('modal-message'),
    $modalCloseBtn: document.getElementById('modal-close-btn'),
    $modalOkBtn: document.getElementById('modal-ok-btn'),
};
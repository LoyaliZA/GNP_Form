// GNP_Local/assets/js/config.js

/*
 * =================================================================
 * ARCHIVO DE CONFIGURACIÓN GLOBAL (config.js)
 * =================================================================
 * Este archivo centraliza las constantes de configuración, el estado
 * inicial de la aplicación y las referencias a los elementos del DOM.
 * Al exportar estos objetos, se pueden importar y utilizar de forma
 * consistente en otros módulos de JavaScript.
 * =================================================================
 */

/**
 * @const {object} CONFIG
 * @description Objeto que contiene constantes y configuraciones fijas
 * para toda la aplicación. Estos valores no deberían cambiar durante
 * la ejecución.
 */
export const CONFIG = {
    // --- Tiempos de Animación ---
    FADE_DURATION: 400,                   // Duración (en ms) para efectos de desvanecimiento (fade).
    SPLASH_DISPLAY_DURATION: 1500,        // Duración (en ms) que la pantalla de carga es visible.
    SPLASH_FADE_DURATION: 500,            // Duración (en ms) del desvanecimiento de la pantalla de carga.

    // --- Endpoints y Recursos ---
    API_ENDPOINT: '/tu-endpoint-real-en-el-servidor', // URL del servidor a donde se enviarán los datos del formulario.
    LOGO_VELER_DARK: 'assets/img/VELER_DARK.png',     // Ruta al logo para el tema oscuro.
    LOGO_VELER_LIGHT: 'assets/img/VELER_LIGHT.png',   // Ruta al logo para el tema claro.
    LOGO_GNP_DARK: 'assets/img/GNP_DARK.png',
    LOGO_GNP_LIGHT: 'assets/img/GNP_LIGHT.png',

    // --- Configuración de Tema y Almacenamiento ---
    THEME_STORAGE_KEY: 'theme_mode',      // Clave usada para guardar el modo (light/dark) en localStorage.
    SELECTED_THEME_FILE_KEY: 'selected_theme_file', // Clave para guardar el archivo del tema de color seleccionado.
    THEME_LINK_ID: 'dynamic-theme-style-link', // ID del elemento <link> que carga el CSS del tema.

    // --- Layout y Responsividad ---
    MOBILE_BREAKPOINT: 767,               // Ancho máximo (en px) para considerar un dispositivo como móvil.

    // --- Temas de Color Disponibles ---
    AVAILABLE_THEMES: [                   // Array de objetos que define los temas de color disponibles.
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
    DEFAULT_THEME_FILE: "assets/css/theme-veler-blue_2.css", // Archivo CSS del tema que se carga por defecto.
};

/**
 * @let {object} state
 * @description Objeto que mantiene el estado actual de la aplicación.
 * Estos valores pueden cambiar durante la interacción del usuario.
 * Se exporta con 'let' para permitir que otros módulos lo modifiquen.
 */
export let state = {
    currentSeccionIndex: 0,             // Índice de la sección del formulario que se está mostrando actualmente.
    isSidebarExpanded: true,            // Estado del sidebar en escritorio (true = expandido, false = colapsado).
    isSidebarVisibleMobile: false,      // Estado del sidebar en móvil (true = visible, false = oculto).
    lastSubmitButton: null,             // Referencia al último botón de envío que fue presionado.
    isSubmitting: false,                // Bandera para evitar envíos múltiples del formulario.
};

/**
 * @const {object} DOMElements
 * @description Objeto que centraliza las referencias a los elementos del DOM
 * más utilizados. Esto evita repetir `document.getElementById` en todo el código
 * y facilita el mantenimiento si un ID cambia.
 * Se usan 'getters' para elementos que pueden no existir al inicio o que
 * dependen de otros, asegurando que se busquen en el momento justo.
 */
export const DOMElements = {
    // --- Elementos Principales ---
    $html: document.documentElement,
    $body: document.body,
    $splashScreen: document.getElementById('splash-screen'),
    $mainHeader: document.getElementById('main-header'),
    $formularioCompleto: document.getElementById('formulario-completo'),
    $form: document.getElementById('miFormularioDinamico'),
    
    // --- Controles de Tema y Logos ---
    $themeSwitch: document.getElementById('theme-checkbox'),
    $themeSelector: document.getElementById('theme-selector'),
    $logoVelerSidebar: document.getElementById('logo-veler-sidebar'),
    $logo1Splash: document.getElementById('logo1-splash'),
    $logo2Splash: document.getElementById('logo2-splash'),
    $modalSuccessLogo: document.getElementById('modal-success-logo'),

    // --- Elementos del Sidebar (con getters para seguridad) ---
    $sidebar: document.getElementById('sidebar-navegacion'),
    get $sidebarToggle() { return this.$sidebar ? this.$sidebar.querySelector('.sidebar-toggle') : null; },
    get $sidebarMenuItems() { return this.$sidebar ? Array.from(this.$sidebar.querySelectorAll('.menu-item')) : []; },
    get $progressBarFill() { return this.$sidebar ? this.$sidebar.querySelector('.progress-fill') : null; },
    get $progressText() { return this.$sidebar ? this.$sidebar.querySelector('.progress-text') : null; },

    // --- Elementos del Formulario (con getters) ---
    get $allSections() { return this.$form ? Array.from(this.$form.querySelectorAll('.seccion-formulario')) : []; },
    get $seccionRevision() { return this.$allSections.find(sec => sec.id === 'seccion-revision'); },
    get $seccionesNavegables() { return this.$allSections.filter(sec => sec.id !== 'seccion-revision'); },
    get $allFormFields() { return this.$form ? Array.from(this.$form.querySelectorAll('input, select, textarea')) : []; },

    // --- Elementos del Modal ---
    $modalOverlay: document.getElementById('modal-overlay'),
    $modalContainer: document.getElementById('modal-container'),
    $modalErrorIcon: document.getElementById('modal-error-icon'),
    $modalTitle: document.getElementById('modal-title'),
    $modalMessage: document.getElementById('modal-message'),
    $modalCloseBtn: document.getElementById('modal-close-btn'),
    $modalOkBtn: document.getElementById('modal-ok-btn'),
};

// Línea de depuración para confirmar que la configuración se ha cargado.
// Esto es útil para verificar que el módulo se importa correctamente en otros archivos.
console.log("DEBUG: Módulo de configuración (config.js) cargado correctamente.");

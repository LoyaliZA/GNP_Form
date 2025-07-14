// assets/js/base/_switch.js

/*
 * =================================================================
 * MÓDULO DE CONTROL DE TEMAS (_switch.js)
 * =================================================================
 * Este módulo se encarga de inicializar y controlar los elementos
 * que permiten al usuario cambiar el tema de la aplicación, tanto
 * el modo (claro/oscuro) como la paleta de colores.
 * =================================================================
 */


// LISTA DE TEMAS ACTUALIZADA Y COMPLETA
// Constante que define todos los temas de color disponibles en la aplicación.
// Cada tema es un objeto con un nombre visible para el usuario y la ruta a su archivo CSS.
const AVAILABLE_THEMES = [
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
];

/**
 * @function initializeTheme
 * @description Crea y controla los elementos para cambiar de tema y modo (claro/oscuro).
 * Se encarga de inyectar el HTML, asignar eventos y cargar las preferencias del usuario.
 * @param {HTMLElement} headerContainer - El elemento <header> donde se insertarán los controles.
 */
export function initializeTheme(headerContainer) {
    // Verifica si el contenedor del header existe antes de continuar.
    if (!headerContainer) {
        console.error("El contenedor del header no fue encontrado para inicializar el tema.");
        return;
    }

    // 1. Crea el HTML de los controles y lo inyecta en la cabecera.
    headerContainer.innerHTML = `
        <div class="header-content-wrapper">
            <div class="theme-controls">
                <select id="theme-selector" title="Seleccionar Tema de Color"></select>
                <div class="theme-switch-wrapper">
                    <label class="theme-switch" for="theme-checkbox">
                        <input type="checkbox" id="theme-checkbox" />
                        <div class="slider round">
                            <span class="icon material-symbols-outlined sun">light_mode</span>
                            <span class="icon material-symbols-outlined moon">dark_mode</span>
                        </div>
                    </label>
                </div>
            </div>
        </div>`;
    
    // 2. Selecciona los elementos recién creados del DOM para poder manipularlos.
    const themeSelector = document.getElementById('theme-selector');
    const themeCheckbox = document.getElementById('theme-checkbox');
    const dynamicThemeLink = document.getElementById('dynamic-theme-style-link');

    // 3. Rellena el menú desplegable (select) con los temas disponibles en la constante.
    AVAILABLE_THEMES.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme.file;
        option.textContent = theme.name;
        themeSelector.appendChild(option);
    });

    // 4. Define las funciones para aplicar los cambios visuales.
    
    /**
     * Aplica el modo claro u oscuro a la aplicación.
     * @param {string} mode - 'light' o 'dark'.
     */
    const applyThemeMode = (mode) => {
        const isLight = mode === 'light';
        // Añade o quita la clase 'light-theme' del elemento <html>.
        document.documentElement.classList.toggle('light-theme', isLight);

        // Cambia el logo del sidebar según el modo.
        const logoSidebar = document.getElementById('logo-veler-sidebar');
        const logoSrc = isLight ? 'assets/img/veler_light.png' : 'assets/img/veler_dark.png';
        if (logoSidebar) logoSidebar.src = logoSrc;
        
        // Sincroniza el estado del checkbox con el modo actual.
        if (themeCheckbox) themeCheckbox.checked = isLight;
    };

    /**
     * Aplica la paleta de colores seleccionada cambiando el archivo CSS.
     * @param {string} themeFile - La ruta al archivo CSS del tema.
     */
    const applyThemePalette = (themeFile) => {
        // Cambia el 'href' del <link> para cargar la nueva hoja de estilos.
        if (dynamicThemeLink) dynamicThemeLink.href = themeFile;
        // Sincroniza el valor del menú desplegable con el tema actual.
        if (themeSelector) themeSelector.value = themeFile;
    };

    // 5. Asigna los eventos a los controles para que reaccionen a la interacción del usuario.
    
    // Evento para cuando el usuario selecciona una nueva paleta de colores.
    themeSelector.addEventListener('change', function() {
        localStorage.setItem('selected_theme_file', this.value); // Guarda la preferencia.
        applyThemePalette(this.value); // Aplica el cambio.
    });

    // Evento para cuando el usuario hace clic en el interruptor de modo claro/oscuro.
    themeCheckbox.addEventListener('change', function() {
        const mode = this.checked ? 'light' : 'dark';
        localStorage.setItem('theme_mode', mode); // Guarda la preferencia.
        applyThemeMode(mode); // Aplica el cambio.
    });

    // 6. Carga la configuración guardada en localStorage al iniciar la página.
    // Esto permite que la apariencia se mantenga entre visitas.
    const savedFile = localStorage.getItem('selected_theme_file') || AVAILABLE_THEMES[0].file;
    const savedMode = localStorage.getItem('theme_mode') || 'dark';
    applyThemePalette(savedFile);
    applyThemeMode(savedMode);

    // Línea de depuración que solicitaste.
    console.log("DEBUG: Módulo de temas (_switch.js) inicializado correctamente.");
}

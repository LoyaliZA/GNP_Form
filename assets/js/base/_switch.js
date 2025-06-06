// GNP_Local/assets/js/base/_switch.js
import { CONFIG, DOMElements } from '../config.js';

function applyThemeMode(themeMode) {
    const isLightTheme = themeMode === 'light';
    DOMElements.$html.classList.toggle('light-theme', isLightTheme);
    if (DOMElements.$logoVelerSidebar) DOMElements.$logoVelerSidebar.src = isLightTheme ? CONFIG.LOGO_VELER_LIGHT : CONFIG.LOGO_VELER_DARK;
    if (DOMElements.$logo1Splash) DOMElements.$logo1Splash.src = isLightTheme ? CONFIG.LOGO_VELER_LIGHT : CONFIG.LOGO_VELER_DARK;
    if (DOMElements.$logo2Splash) DOMElements.$logo2Splash.src = isLightTheme ? CONFIG.LOGO_GNP_LIGHT : CONFIG.LOGO_GNP_DARK;
    if (DOMElements.$modalSuccessLogo) {
        // $modalSuccessLogo.src = isLightTheme ? 'assets/img/V_icon_light.png' : 'assets/img/V_icon.png';
    }
}

function handleThemeSwitchChange() {
    const currentThemeMode = this.checked ? 'light' : 'dark';
    applyThemeMode(currentThemeMode);
    localStorage.setItem(CONFIG.THEME_STORAGE_KEY, currentThemeMode);
}

function handleThemeFileChange() {
    const selectedFile = this.value;
    const themeLink = document.getElementById(CONFIG.THEME_LINK_ID);
    if (themeLink) {
        themeLink.href = selectedFile;
        localStorage.setItem(CONFIG.SELECTED_THEME_FILE_KEY, selectedFile);
        const currentThemeMode = localStorage.getItem(CONFIG.THEME_STORAGE_KEY) || 'dark';
        applyThemeMode(currentThemeMode);
    }
}

function _initThemeSelectorDOM() {
    let themeLink = document.getElementById(CONFIG.THEME_LINK_ID);
    if (!themeLink) {
        themeLink = document.createElement('link');
        themeLink.id = CONFIG.THEME_LINK_ID;
        themeLink.rel = 'stylesheet';
        document.head.appendChild(themeLink);
    }

    if (DOMElements.$themeSelector) {
        CONFIG.AVAILABLE_THEMES.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.file;
            option.textContent = theme.name;
            DOMElements.$themeSelector.appendChild(option);
        });
        const savedThemeFile = localStorage.getItem(CONFIG.SELECTED_THEME_FILE_KEY) || CONFIG.DEFAULT_THEME_FILE;
        const isValidSavedTheme = CONFIG.AVAILABLE_THEMES.some(theme => theme.file === savedThemeFile);
        const themeFileToLoad = isValidSavedTheme ? savedThemeFile : CONFIG.DEFAULT_THEME_FILE;

        themeLink.href = themeFileToLoad;
        DOMElements.$themeSelector.value = themeFileToLoad;

        if (themeFileToLoad !== savedThemeFile) {
             localStorage.setItem(CONFIG.SELECTED_THEME_FILE_KEY, themeFileToLoad);
        }
    } else {
         console.error("Error Init: Elemento theme-selector no encontrado.");
    }
}

function _initCurrentThemeMode() {
    const savedThemeMode = localStorage.getItem(CONFIG.THEME_STORAGE_KEY) || 'dark';
    applyThemeMode(savedThemeMode);
    if (DOMElements.$themeSwitch) DOMElements.$themeSwitch.checked = (savedThemeMode === 'light');
}

export function initializeTheme() {
    if (DOMElements.$themeSwitch) DOMElements.$themeSwitch.addEventListener('change', handleThemeSwitchChange);
    if (DOMElements.$themeSelector) DOMElements.$themeSelector.addEventListener('change', handleThemeFileChange);
    _initThemeSelectorDOM();
    _initCurrentThemeMode();
}
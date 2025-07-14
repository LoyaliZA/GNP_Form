// GNP_Local/assets/js/main.js

/*
 * =================================================================
 * ARCHIVO JAVASCRIPT PRINCIPAL (main.js)
 * =================================================================
 * Este es el punto de entrada de toda la lógica de la aplicación.
 * Se encarga de importar los diferentes módulos y de inicializarlos
 * cuando el DOM está completamente cargado.
 * =================================================================
 */

// --- IMPORTACIÓN DE MÓDULOS ---
// Se importan las funciones y objetos necesarios de otros archivos.
// Esto permite mantener el código organizado y modular.

import { renderSidebarMenu } from './base/_sidebar.js'; // Función para renderizar el menú del sidebar.
import { CONFIG, state, DOMElements } from './config.js'; // Configuración, estado y elementos del DOM.
import { initializeTheme } from './base/_switch.js';       // Lógica para inicializar el tema (claro/oscuro).
import { initializeSidebar } from './base/_sidebar.js';    // Lógica para el sidebar (toggle, progreso).
import { initializeSplash } from './base/_splash.js';      // Lógica para la pantalla de carga (splash screen).
import { initializeModals } from './base/_modal.js';       // Lógica para las ventanas modales.
import { initializeTooltips } from './base/_tooltips.js';  // Lógica para los tooltips de ayuda.
import { validateEssentialElements } from './base/_utils.js'; // Utilidades, como la validación de elementos.

/**
 * @function initializeApp
 * @description Función principal que se ejecuta para inicializar todos los
 * componentes y la lógica de la aplicación.
 */
function initializeApp() {

    // --- VALIDACIÓN DE ELEMENTOS ESENCIALES ---
    // Se crea un objeto con los elementos del DOM que son cruciales para
    // que la aplicación funcione. Esto podría pasarse a una función de
    // validación para asegurar que todos existen antes de continuar.
    const essentialSkeletonElements = {
        $html: DOMElements.$html,
        $body: DOMElements.$body,
        $splashScreen: DOMElements.$splashScreen,
        $mainHeader: DOMElements.$mainHeader,
        $sidebar: DOMElements.$sidebar,
        $formularioCompleto: DOMElements.$formularioCompleto,
        $modalOverlay: DOMElements.$modalOverlay,
        $themeSwitch: DOMElements.$themeSwitch,
        $themeSelector: DOMElements.$themeSelector,
    };

    // --- INICIALIZACIÓN DE COMPONENTES ---
    // Se llama a las funciones de inicialización de cada módulo en un
    // orden lógico. Por ejemplo, el tema se inicializa primero para
    // que los demás componentes se rendericen con los colores correctos.
    initializeTheme();
    initializeSidebar();
    initializeTooltips();
    initializeModals();
    initializeSplash();

    // Línea de depuración para la consola.
    // Muestra un mensaje confirmando que la app se ha inicializado.
    // La variable `tipoDeSolicitante` debería definirse en algún punto antes de esta línea.
    // Como no está definida aquí, la comentaremos para evitar errores.
    // console.log(`Aplicación GNP con Formulario Dinámico Inicializada para: ${tipoDeSolicitante.toUpperCase()}`);
    console.log("DEBUG: Aplicación GNP inicializada correctamente.");
}

// --- PUNTO DE ENTRADA ---
// Se añade un "event listener" que espera a que todo el contenido HTML
// de la página (el DOM) se haya cargado por completo antes de ejecutar
// la función principal `initializeApp`. Esto previene errores que podrían
// ocurrir si el script intenta manipular elementos que aún no existen.
document.addEventListener('DOMContentLoaded', initializeApp);

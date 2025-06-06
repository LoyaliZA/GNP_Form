// GNP_Local/assets/js/main.js
import { CONFIG, state, DOMElements } from './config.js';
import { formSections } from './formDefinition.js'; // Cambiado de '../formDefinition.js'
import { renderDynamicForm } from './base/_formRenderer.js'; // <--- IMPORTAR RENDERIZADOR

import { initializeTheme } from './base/_switch.js';
import { initializeSidebar } from './base/_sidebar.js'; // Todavía se necesita actualizarProgreso
import { initializeFormNavigation, showSection } from './base/_formNavigation.js';
import { initializeFormLogic } from './base/_formLogic.js';
import { initializeSplash } from './base/_splash.js';
import { initializeModals } from './base/_modal.js';
import { initializeTooltips } from './base/_tooltips.js';
import { validateEssentialElements } from './base/_utils.js';

function initializeApp() {
    // Validar elementos esenciales del esqueleto HTML (splash, header, sidebar, main, modal overlay)
    // No validamos $form aquí porque aún no se ha renderizado su contenido.
    const essentialSkeletonElements = {
        $html: DOMElements.$html,
        $body: DOMElements.$body,
        $splashScreen: DOMElements.$splashScreen,
        $mainHeader: DOMElements.$mainHeader,
        $sidebar: DOMElements.$sidebar,
        $formularioCompleto: DOMElements.$formularioCompleto, // El <main>
        $modalOverlay: DOMElements.$modalOverlay,
        $themeSwitch: DOMElements.$themeSwitch,
        $themeSelector: DOMElements.$themeSelector,
    };
    let allPresent = true;
    for (const key in essentialSkeletonElements) {
        if (!essentialSkeletonElements[key]) {
            console.error(`Error Init: Elemento esqueleto ${key.replace('$', '')} no encontrado.`);
            allPresent = false;
        }
    }
    if (!allPresent) {
        console.error("Error Crítico: Faltan elementos esenciales del esqueleto HTML. La aplicación no puede iniciar correctamente.");
        return;
    }

    // 1. Renderizar el formulario dinámicamente AHORA
    if (DOMElements.$form) {
        renderDynamicForm(formSections); // Pasa la definición al renderizador
    } else {
        console.error("Elemento <form id='miFormularioDinamico'> no encontrado en el DOM.");
        return; // No se puede continuar sin el formulario
    }

    // 2. Ahora que el form y sus secciones existen, los módulos pueden inicializarse
    // y encontrar los elementos que necesitan.
    initializeTheme();
    initializeSidebar();
    initializeTooltips();  // Ahora encontrará los iconos de tooltip generados
    initializeModals();
    initializeFormLogic(); // Necesita los campos del formulario para la lógica condicional, etc.
    initializeFormNavigation(); // Necesita las secciones y botones generados

    initializeSplash(); // Splash al final, llamará a showSection(0)

    console.log('Aplicación GNP con Formulario Dinámico Inicializada');
}

document.addEventListener('DOMContentLoaded', initializeApp);
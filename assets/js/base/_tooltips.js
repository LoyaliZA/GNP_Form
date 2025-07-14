// GNP_Local/assets/js/base/_tooltips.js

/*
 * =================================================================
 * MÓDULO DE TOOLTIPS DE AYUDA (_tooltips.js)
 * =================================================================
 * Este módulo se encarga de la lógica para mostrar y ocultar
 * las ventanas de ayuda (tooltips) que aparecen cuando el usuario
 * interactúa con los iconos de información (?) en el formulario.
 * =================================================================
 */

// --- IMPORTACIONES ---
// Se importa el objeto DOMElements desde el archivo de configuración
// para tener acceso a las referencias de los elementos del DOM.
import { DOMElements } from '../config.js';

/**
 * @function showTooltip
 * @description Muestra un elemento de tooltip añadiéndole una clase CSS.
 * @param {HTMLElement} tooltipElement - El elemento del DOM que contiene el tooltip a mostrar.
 */
function showTooltip(tooltipElement) {
    // Si el elemento no existe, no hace nada.
    if (!tooltipElement) return;
    // Añade la clase 'tooltip-visible', que en el CSS se encarga de cambiar
    // la opacidad y visibilidad para que el tooltip aparezca.
    tooltipElement.classList.add('tooltip-visible');
}

/**
 * @function hideTooltip
 * @description Oculta un elemento de tooltip quitándole una clase CSS.
 * @param {HTMLElement} tooltipElement - El elemento del DOM que contiene el tooltip a ocultar.
 */
function hideTooltip(tooltipElement) {
    // Si el elemento no existe, no hace nada.
    if (!tooltipElement) return;
    // Quita la clase 'tooltip-visible', lo que hace que el tooltip se oculte
    // según las transiciones definidas en el CSS.
    tooltipElement.classList.remove('tooltip-visible');
}

/**
 * @function initializeTooltips
 * @description Función principal que se exporta para buscar todos los iconos de ayuda
 * en el formulario y asignarles los eventos necesarios para mostrar/ocultar sus tooltips.
 */
export function initializeTooltips() {
    // Si el formulario principal no existe, no continúa.
    if (!DOMElements.$form) return;

    // Busca todos los elementos con la clase 'help-icon' dentro del formulario.
    const helpIcons = DOMElements.$form.querySelectorAll('.help-icon');

    // Itera sobre cada icono de ayuda encontrado.
    helpIcons.forEach(icon => {
        // Obtiene el ID del contenido del tooltip desde el atributo 'data-tooltip-target' del icono.
        // Así es como el icono sabe a qué tooltip está conectado.
        const tooltipId = icon.dataset.tooltipTarget;
        // Busca el elemento del tooltip en el DOM usando el ID obtenido.
        const tooltipContent = document.getElementById(tooltipId);

        // Si no se encuentra el contenido del tooltip, muestra una advertencia en la consola y continúa con el siguiente icono.
        if (!tooltipContent) {
            console.warn(`Advertencia: No se encontró el contenido del tooltip para el objetivo: ${tooltipId}`);
            return;
        }

        // --- ASIGNACIÓN DE EVENTOS ---
        // Asigna los eventos al icono para mostrar y ocultar el tooltip correspondiente.

        // Muestra el tooltip cuando el cursor del ratón entra en el área del icono.
        icon.addEventListener('mouseenter', () => showTooltip(tooltipContent));
        // Muestra el tooltip cuando el icono recibe foco (ej. al navegar con el teclado).
        icon.addEventListener('focus', () => showTooltip(tooltipContent));
        
        // Oculta el tooltip cuando el cursor del ratón sale del área del icono.
        icon.addEventListener('mouseleave', () => hideTooltip(tooltipContent));
        // Oculta el tooltip cuando el icono pierde el foco.
        icon.addEventListener('blur', () => hideTooltip(tooltipContent));
    });

    // Línea de depuración que solicitaste.
    console.log("DEBUG: Módulo de tooltips (_tooltips.js) inicializado correctamente.");
}

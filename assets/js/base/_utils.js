// GNP_Local/assets/js/base/_utils.js

/*
 * =================================================================
 * MÓDULO DE UTILIDADES (_utils.js)
 * =================================================================
 * Este archivo contiene funciones de ayuda reutilizables (utilidades)
 * que realizan tareas comunes, como validaciones o manipulación
 * del DOM, y que pueden ser importadas por otros módulos.
 * =================================================================
 */

// --- IMPORTACIONES ---
// Se importa el objeto DOMElements desde el archivo de configuración
// para tener acceso a las referencias de los elementos del DOM.
import { DOMElements } from '../config.js';

/**
 * @function validateEssentialElements
 * @description Verifica que los elementos HTML cruciales para el funcionamiento
 * de la aplicación existan en el DOM. Si falta alguno, muestra un error en la consola.
 * @returns {boolean} Devuelve `true` si todos los elementos esenciales están presentes,
 * de lo contrario, devuelve `false`.
 */
export function validateEssentialElements() {
    // Objeto que contiene los elementos del DOM que se consideran esenciales.
    const essential = {
        $form: DOMElements.$form,
        $formularioCompleto: DOMElements.$formularioCompleto,
        $sidebar: DOMElements.$sidebar,
        $sidebarToggle: DOMElements.$sidebarToggle,
        $themeSwitch: DOMElements.$themeSwitch,
        $themeSelector: DOMElements.$themeSelector,
        $mainHeader: DOMElements.$mainHeader
    };
    let allPresent = true; // Bandera para rastrear si todos los elementos están presentes.

    // Itera sobre cada elemento en el objeto 'essential'.
    for (const key in essential) {
        // Si un elemento es nulo o indefinido (no se encontró en el DOM).
        if (!essential[key]) {
            // Muestra un mensaje de error específico en la consola.
            console.error(`Error de Inicialización: Elemento ${key.replace('$', '')} no encontrado en el DOM.`);
            allPresent = false; // Marca que falta al menos un elemento.
        }
    }
    
    // Comprobación adicional: si el formulario existe pero no tiene secciones navegables.
    if (DOMElements.$seccionesNavegables.length === 0 && DOMElements.$form) {
         console.warn("Advertencia de Inicialización: No se encontraron secciones navegables dentro del formulario.");
    }

    return allPresent;
}

/**
 * @function isValidInputValue
 * @description Comprueba si el valor de un campo de formulario es válido (no es nulo,
 * indefinido o una cadena de texto vacía después de quitar espacios).
 * @param {*} value - El valor a comprobar.
 * @returns {boolean} Devuelve `true` si el valor es válido, `false` en caso contrario.
 */
export function isValidInputValue(value) {
    return value !== null && value !== undefined && String(value).trim() !== '';
}

/**
 * @function getLabelText
 * @description Extrae el texto "limpio" de un elemento <label>, eliminando
 * cualquier elemento anidado como inputs, iconos o marcadores de campo requerido.
 * @param {HTMLElement} labelElement - El elemento <label> del que se extraerá el texto.
 * @returns {string} El texto limpio de la etiqueta, o una cadena vacía si no hay etiqueta.
 */
export function getLabelText(labelElement) {
    if (!labelElement) return ''; // Si no se proporciona un elemento, devuelve una cadena vacía.
    
    // Clona el elemento de la etiqueta para no modificar el original en el DOM.
    const clone = labelElement.cloneNode(true);
    
    // Elimina del clon todos los elementos que no son parte del texto de la etiqueta.
    clone.querySelectorAll('input, select, textarea, .required-marker, .help-icon-wrapper').forEach(el => el.remove());
    
    // Devuelve el contenido de texto del clon, quitando dos puntos y espacios extra.
    return clone.textContent.replace(':', '').trim();
}

/**
 * @function getLabelForInput
 * @description Intenta encontrar el texto de la etiqueta asociada a un elemento de input
 * utilizando varias estrategias.
 * @param {HTMLElement} inputElement - El elemento de input (input, select, textarea) para el que se busca la etiqueta.
 * @returns {string} El texto de la etiqueta encontrada, o el 'name' del input, o un texto genérico si no se encuentra nada.
 */
export function getLabelForInput(inputElement) {
    let label = null;

    // Estrategia 1: Buscar una etiqueta que apunte directamente al ID del input.
    if (inputElement.id) {
        label = DOMElements.$form.querySelector(`label[for="${inputElement.id}"]`);
    }

    // Estrategia 2: Si no se encontró, buscar el elemento <label> más cercano que envuelva al input.
    if (!label) {
        label = inputElement.closest('label');
    }

    // Estrategia 3: Si aún no se encuentra, buscar una etiqueta dentro del mismo grupo de formulario.
    if (!label) {
        const formGroup = inputElement.closest('.form-group, .question-group');
        if (formGroup) {
            label = formGroup.querySelector('label');
        }
    }

    // Si se encontró una etiqueta con cualquiera de las estrategias, se extrae su texto limpio.
    if (label) {
        return getLabelText(label);
    }

    // Fallback: Si no se encuentra ninguna etiqueta, se devuelve el atributo 'name' del input o un texto genérico.
    return inputElement.name || 'Campo sin etiqueta';
}

// Línea de depuración que solicitaste para confirmar la carga del módulo.
console.log("DEBUG: Módulo de utilidades (_utils.js) cargado correctamente.");

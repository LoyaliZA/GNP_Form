// GNP_Local/assets/js/base/_utils.js
import { DOMElements } from '../config.js';

export function validateEssentialElements() {
    const essential = {
        $form: DOMElements.$form,
        $formularioCompleto: DOMElements.$formularioCompleto,
        $sidebar: DOMElements.$sidebar,
        $sidebarToggle: DOMElements.$sidebarToggle,
        $themeSwitch: DOMElements.$themeSwitch,
        $themeSelector: DOMElements.$themeSelector,
        $mainHeader: DOMElements.$mainHeader
    };
    let allPresent = true;
    for (const key in essential) {
        if (!essential[key]) {
            console.error(`Error Init: Elemento ${key.replace('$', '')} no encontrado.`);
            allPresent = false;
        }
    }
    if (DOMElements.$seccionesNavegables.length === 0 && DOMElements.$form) {
         console.warn("Warning Init: No se encontraron secciones navegables.");
    }
    return allPresent;
}

export function isValidInputValue(value) {
    return value !== null && value !== undefined && String(value).trim() !== '';
}

export function getLabelText(labelElement) {
    if (!labelElement) return '';
    const clone = labelElement.cloneNode(true);
    // Remove specific elements that are not part of the label text itself
    clone.querySelectorAll('input, select, textarea, .required-marker, .help-icon-wrapper').forEach(el => el.remove());
    return clone.textContent.replace(':', '').trim();
}


export function getLabelForInput(inputElement) {
    let label = null;
    if (inputElement.id) {
        // Prioritize direct label for the input
        label = DOMElements.$form.querySelector(`label[for="${inputElement.id}"]`);
    }
    // If not found, try to find the closest label element
    if (!label) {
        label = inputElement.closest('label');
    }
    // If still not found, try to find a label within the same form-group
    if (!label) {
        const formGroup = inputElement.closest('.form-group.question-group');
        if (formGroup) {
            label = formGroup.querySelector('label');
        }
    }

    if (label) {
        return getLabelText(label);
    }
    // Fallback to input name or a generic placeholder
    return inputElement.name || 'Campo sin etiqueta';
}
// GNP_Local/assets/js/base/_tooltips.js
import { DOMElements } from '../config.js';

function showTooltip(tooltipElement) {
    if (!tooltipElement) return;
    tooltipElement.classList.add('tooltip-visible');
}

function hideTooltip(tooltipElement) {
    if (!tooltipElement) return;
    tooltipElement.classList.remove('tooltip-visible');
}

export function initializeTooltips() {
    if (!DOMElements.$form) return;
    const helpIcons = DOMElements.$form.querySelectorAll('.help-icon');

    helpIcons.forEach(icon => {
        const tooltipId = icon.dataset.tooltipTarget;
        const tooltipContent = document.getElementById(tooltipId);

        if (!tooltipContent) {
            console.warn(`Tooltip content not found for target: ${tooltipId}`);
            return;
        }

        icon.addEventListener('mouseenter', () => showTooltip(tooltipContent));
        icon.addEventListener('focus', () => showTooltip(tooltipContent));
        icon.addEventListener('mouseleave', () => hideTooltip(tooltipContent));
        icon.addEventListener('blur', () => hideTooltip(tooltipContent));
    });
}
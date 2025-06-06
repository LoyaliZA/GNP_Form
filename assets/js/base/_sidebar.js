// GNP_Local/assets/js/base/_sidebar.js
import { CONFIG, state, DOMElements } from '../config.js';

// Funciones internas (no necesitan ser exportadas si solo las usa initializeSidebar)
function updateSidebarToggleButton() {
    if (!DOMElements.$sidebarToggle) return;
    const isMobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
    if (isMobile) {
         DOMElements.$sidebarToggle.textContent = state.isSidebarVisibleMobile ? 'close' : 'menu';
         DOMElements.$sidebarToggle.title = state.isSidebarVisibleMobile ? 'Ocultar menú' : 'Mostrar menú';
    } else {
        DOMElements.$sidebarToggle.textContent = state.isSidebarExpanded ? 'menu_open' : 'menu';
        DOMElements.$sidebarToggle.title = state.isSidebarExpanded ? 'Contraer menú' : 'Expandir menú';
    }
}

function _applyInitialSidebarState() {
    const isMobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
    const savedSidebarState = localStorage.getItem('sidebar_expanded');
    const startExpanded = isMobile ? false : (savedSidebarState !== null ? JSON.parse(savedSidebarState) : true);

    state.isSidebarExpanded = startExpanded;
    state.isSidebarVisibleMobile = false;

    if (isMobile) {
        DOMElements.$body.classList.remove('body-sidebar-expanded', 'sidebar-visible');
        DOMElements.$body.classList.add('body-sidebar-collapsed');
    } else {
        DOMElements.$body.classList.toggle('body-sidebar-expanded', startExpanded);
        DOMElements.$body.classList.toggle('body-sidebar-collapsed', !startExpanded);
        DOMElements.$body.classList.remove('sidebar-visible');
    }
    updateSidebarToggleButton();
}

function handleResize() {
    _applyInitialSidebarState();
}

// --- Funciones Exportadas ---

export function toggleSidebar() { // <--- AHORA SE EXPORTA
    const isMobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
    if (isMobile) {
        state.isSidebarVisibleMobile = !state.isSidebarVisibleMobile;
        DOMElements.$body.classList.toggle('sidebar-visible', state.isSidebarVisibleMobile);
        DOMElements.$body.classList.remove('body-sidebar-expanded', 'body-sidebar-collapsed');
    } else {
        state.isSidebarExpanded = !state.isSidebarExpanded;
        DOMElements.$body.classList.toggle('body-sidebar-expanded', state.isSidebarExpanded);
        DOMElements.$body.classList.toggle('body-sidebar-collapsed', !state.isSidebarExpanded);
        DOMElements.$body.classList.remove('sidebar-visible');
        localStorage.setItem('sidebar_expanded', JSON.stringify(state.isSidebarExpanded));
    }
    updateSidebarToggleButton(); // Esta función es interna, así que está bien llamarla aquí
}

export function actualizarProgreso() {
    if (!DOMElements.$progressBarFill || !DOMElements.$progressText || !DOMElements.$form) return;

    let totalCamposVisiblesRequeridos = 0;
    let camposCompletadosVisiblesRequeridos = 0;
    // let todasSeccionesNavegablesCompletadas = true; // No se usa actualmente

    DOMElements.$seccionesNavegables.forEach((section) => {
        let sectionIsEffectivelyComplete = true;
        let sectionHasVisibleRequiredFields = false;
        const inputsInSection = section.querySelectorAll('.form-group [name]');

        inputsInSection.forEach(input => {
            const formGroup = input.closest('.form-group.question-group');
            const isVisible = formGroup && (formGroup.style.display !== 'none' && formGroup.classList.contains('field-visible'));

            if (isVisible && !input.disabled) {
                if (input.required) {
                    sectionHasVisibleRequiredFields = true;
                    totalCamposVisiblesRequeridos++;
                    if (input.checkValidity()) {
                        camposCompletadosVisiblesRequeridos++;
                    } else {
                        sectionIsEffectivelyComplete = false;
                        // todasSeccionesNavegablesCompletadas = false; // No se usa actualmente
                    }
                }
            }
        });

        const menuItem = DOMElements.$sidebarMenuItems.find(item => item.getAttribute('data-section') === section.id);
        if (menuItem) {
            const markAsCompleted = !sectionHasVisibleRequiredFields || sectionIsEffectivelyComplete;
            menuItem.classList.toggle('completed', markAsCompleted);
        }
    });

    const porcentaje = totalCamposVisiblesRequeridos > 0
        ? Math.round((camposCompletadosVisiblesRequeridos / totalCamposVisiblesRequeridos) * 100)
        : (DOMElements.$seccionesNavegables.length > 0 ? 0 : 100);

    if (DOMElements.$progressBarFill) DOMElements.$progressBarFill.style.width = `${porcentaje}%`;
    if (DOMElements.$progressText) DOMElements.$progressText.textContent = `${porcentaje}% completado`;
}


export function initializeSidebar() {
    if (DOMElements.$sidebarToggle) DOMElements.$sidebarToggle.addEventListener('click', toggleSidebar); // Llama a la función (ahora exportada)
    window.addEventListener('resize', handleResize);
    _applyInitialSidebarState();
    actualizarProgreso();
}
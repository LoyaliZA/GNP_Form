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

    DOMElements.$seccionesNavegables.forEach((section) => {
        // --- 1. CÁLCULO PARA CADA CÍRCULO INDIVIDUAL ---
        let camposEnSeccionRequeridos = 0;
        let camposEnSeccionCompletados = 0;
        
        const inputsInSection = section.querySelectorAll('.form-group [name]');

        inputsInSection.forEach(input => {
            const formGroup = input.closest('.form-group.question-group');
            // Un campo se considera "visible" para el cálculo si su contenedor está visible
            const isVisible = formGroup && (formGroup.style.display !== 'none');

            if (isVisible && !input.disabled && input.required) {
                // A. Contadores para la sección actual (para el círculo)
                camposEnSeccionRequeridos++;
                // B. Contadores para el progreso total (para la barra de abajo)
                totalCamposVisiblesRequeridos++;

                if (input.checkValidity()) {
                    camposEnSeccionCompletados++;
                    camposCompletadosVisiblesRequeridos++;
                }
            }
        });

        const menuItem = DOMElements.$sidebarMenuItems.find(item => item.getAttribute('data-section') === section.id);
        if (menuItem) {
            const statusElement = menuItem.querySelector('.menu-status');
            
            // Si hay campos requeridos en la sección, calcula el porcentaje.
            // Si no hay, se considera 100% completa.
            const porcentajeSeccion = camposEnSeccionRequeridos > 0
                ? (camposEnSeccionCompletados / camposEnSeccionRequeridos) * 100
                : 100;

            // Convierte el porcentaje (0-100) a un ángulo (0-360) para el CSS
            const angulo = (porcentajeSeccion / 100) * 360;

            // --- 2. ACTUALIZACIÓN DEL ESTILO DEL CÍRCULO ---
            if (statusElement) {
                // Actualiza la variable CSS que controla el relleno del gradiente
                statusElement.style.setProperty('--progress-angle', `${angulo}deg`);
            }
            
            // Añade/quita la clase 'completed' si está al 100% (para que el borde cambie de color)
            menuItem.classList.toggle('completed', porcentajeSeccion === 100);
        }
    });

    // --- 3. CÁLCULO PARA LA BARRA DE PROGRESO GENERAL (sin cambios) ---
    const porcentajeTotal = totalCamposVisiblesRequeridos > 0
        ? Math.round((camposCompletadosVisiblesRequeridos / totalCamposVisiblesRequeridos) * 100)
        : (DOMElements.$seccionesNavegables.length > 0 ? 0 : 100);

    if (DOMElements.$progressBarFill) DOMElements.$progressBarFill.style.width = `${porcentajeTotal}%`;
    if (DOMElements.$progressText) DOMElements.$progressText.textContent = `${porcentajeTotal}% completado`;
}


export function initializeSidebar() {
    if (DOMElements.$sidebarToggle) DOMElements.$sidebarToggle.addEventListener('click', toggleSidebar); // Llama a la función (ahora exportada)
    window.addEventListener('resize', handleResize);
    _applyInitialSidebarState();
    actualizarProgreso();
}
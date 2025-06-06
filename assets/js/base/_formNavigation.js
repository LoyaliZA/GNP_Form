// GNP_Local/assets/js/base/_formNavigation.js
import { CONFIG, state, DOMElements } from '../config.js';
import { getLabelForInput, isValidInputValue } from './_utils.js';
import { actualizarProgreso, toggleSidebar as hideSidebarOnMobile } from './_sidebar.js';
import { initializeFormLogic, initSequentialRevealForSection, clearSequentialRevealListeners, toggleHabitosFields, toggleDeportesFields } from './_formLogic.js';
import { handleSubmitButtonClick } from './_api.js';


function isValidSectionIndex(index) {
    return index >= 0 && index < DOMElements.$seccionesNavegables.length;
}

function updateActiveMenuItem(activeIndex) {
    const activeSectionId = activeIndex >= 0 && DOMElements.$seccionesNavegables[activeIndex]
        ? DOMElements.$seccionesNavegables[activeIndex].id
        : null;

    DOMElements.$sidebarMenuItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-section') === activeSectionId);
    });
}

function runSectionSpecificLogic(sectionId) {
    // This function now calls the imported handlers
    if (sectionId === 'seccion-habitos') {
        toggleHabitosFields();
    } else if (sectionId === 'seccion-deportes') {
        toggleDeportesFields();
    }
    // Add more direct calls if other sections have specific logic modules later
}

function fadeOutSection($section, callback) {
    if (!$section) { if(callback) callback(); return; }
    $section.style.opacity = '0';
    setTimeout(() => {
        $section.classList.remove('seccion-activa');
        $section.style.display = 'none';
        clearSequentialRevealListeners($section); // Clear listeners when hiding
        if (callback) callback();
    }, CONFIG.FADE_DURATION);
}

function fadeInSection($section, index) {
    if (!$section) return;
    $section.style.display = 'block'; // Or 'flex' if your sections are flex containers

    initSequentialRevealForSection($section); // Initialize sequential reveal for the new section

    setTimeout(() => {
        $section.style.opacity = '1';
        $section.classList.add('seccion-activa');
        updateActiveMenuItem(index);
        window.scrollTo(0, 0);
        runSectionSpecificLogic($section.id); // Run logic specific to this section
    }, 50); // Small delay to ensure display:block is applied before opacity transition
}

export function showSection(indexToShow) {
    if (!DOMElements.$form || !isValidSectionIndex(indexToShow)) return;

    const $currentActive = DOMElements.$form.querySelector('.seccion-formulario.seccion-activa');
    const $nextSection = DOMElements.$seccionesNavegables[indexToShow];

    if ($currentActive === $nextSection && $currentActive && $currentActive.classList.contains('seccion-activa')) return; // Already showing

    if ($currentActive) {
        fadeOutSection($currentActive, () => fadeInSection($nextSection, indexToShow));
    } else {
        fadeInSection($nextSection, indexToShow);
    }
    state.currentSeccionIndex = indexToShow;
    actualizarProgreso();
}


function generateFinalSummary() {
    if (!DOMElements.$seccionRevision) return;
    const $resumenFinal = DOMElements.$seccionRevision.querySelector('#resumen-final');
    if (!$resumenFinal) return;

    $resumenFinal.innerHTML = ''; // Clear previous summary
    const formData = new FormData(DOMElements.$form);
    const dataObject = {};
    formData.forEach((value, key) => {
        if (dataObject[key]) {
            if (!Array.isArray(dataObject[key])) dataObject[key] = [dataObject[key]];
            dataObject[key].push(value);
        } else {
            dataObject[key] = value;
        }
    });

    const $ul = document.createElement('ul');
    DOMElements.$seccionesNavegables.forEach(section => {
        const sectionId = section.id;
        const sectionTitleH2 = section.querySelector('h2');
        const sectionTitleText = sectionTitleH2 ? sectionTitleH2.textContent : sectionId.replace('seccion-', '').replace(/_/g, ' ');
        let sectionHasData = false;
        const $sectionUl = document.createElement('ul');

        // Iterate over visible fields within the section
        const visibleFields = section.querySelectorAll('.form-group.field-visible [name], .form-group:not(.question-group) [name]');


        Array.from(visibleFields).forEach(input => {
            // Ensure field is actually visible and not part of a hidden structure
            if (input.offsetParent === null && !input.closest('.seccion-activa')) return;

            const key = input.name;
            let value = dataObject[key]; // Get value from FormData object
            let displayValue = '';

            if (input.type === 'checkbox') {
                // For checkboxes, check if the key exists in dataObject (meaning it was checked)
                // If it's part of a group, dataObject[key] might be an array.
                const isChecked = dataObject.hasOwnProperty(key) &&
                                  (Array.isArray(dataObject[key]) ? dataObject[key].includes(input.value) : dataObject[key] === input.value);
                displayValue = isChecked ? 'Sí' : 'No';
                // If the checkbox itself has a label "X", and its value is "true", then label = X, value = Sí.
                // If it's a group, we need to be more specific.
                // For simple "Sí/No" based on checked status for a single named checkbox:
                if (input.value === "true" || !isValidInputValue(input.value)) { // Common pattern for boolean checkboxes
                    displayValue = dataObject.hasOwnProperty(key) ? 'Sí' : 'No';
                } else { // Checkbox is part of a group with distinct values
                     displayValue = (Array.isArray(value) ? value.join(', ') : value) || 'No seleccionado';
                }


            } else if (input.type === 'radio') {
                const checkedRadio = section.querySelector(`input[name="${key}"]:checked`);
                displayValue = checkedRadio ? (getLabelText(checkedRadio.parentElement) || checkedRadio.value) : 'No seleccionado';
            } else if (input.tagName === 'SELECT') {
                if (input.multiple) {
                    displayValue = value ? (Array.isArray(value) ? value.join(', ') : value) : 'No seleccionado';
                } else {
                    const selectedOption = input.options[input.selectedIndex];
                    displayValue = selectedOption && selectedOption.value ? selectedOption.text : 'No seleccionado';
                }
            } else if (input.type === 'file') {
                displayValue = value && value.name ? value.name : 'No adjuntado';
            } else if (isValidInputValue(value)) {
                displayValue = value;
            } else if (input.required) {
                displayValue = '--- PENDIENTE ---';
            } else {
                return; // Skip non-required empty fields
            }

            const labelText = getLabelForInput(input);
            if (labelText && (displayValue !== 'No seleccionado' || input.required)) {
                const $li = document.createElement('li');
                const $valueSpan = document.createElement('span');
                $valueSpan.className = 'respuesta-valor';
                $valueSpan.textContent = displayValue;

                $li.innerHTML = `<strong>${labelText}:</strong> `;
                $li.appendChild($valueSpan);
                $sectionUl.appendChild($li);
                sectionHasData = true;
            }
        });


        if (sectionHasData) {
            const $sectionHeaderLi = document.createElement('li');
            $sectionHeaderLi.innerHTML = `<h4>${sectionTitleText}</h4>`;
            $sectionHeaderLi.style.borderBottom = 'none';
            $sectionHeaderLi.style.marginBottom = '10px';
            $ul.appendChild($sectionHeaderLi);
            $ul.appendChild($sectionUl);

            // Add a visual separator between sections in the summary
            const $hr = document.createElement('hr');
            $hr.style.borderColor = 'var(--border)';
            $hr.style.opacity = '0.5';
            $hr.style.margin = '15px 0';
            $ul.appendChild($hr);
        }
    });
    if ($ul.lastElementChild && $ul.lastElementChild.tagName === 'HR') {
        $ul.removeChild($ul.lastElementChild); // Remove last HR
    }
    $resumenFinal.appendChild($ul);
}


function showReviewMode() {
    const $currentActive = DOMElements.$form.querySelector('.seccion-formulario.seccion-activa');
    const enterReview = () => {
        DOMElements.$formularioCompleto.classList.add('modo-revision');
        if (DOMElements.$seccionRevision) {
            DOMElements.$seccionRevision.style.display = 'block';
            setTimeout(() => {
                DOMElements.$seccionRevision.style.opacity = '1';
                DOMElements.$seccionRevision.classList.add('seccion-activa');
            }, 50);
            generateFinalSummary();
        }
        // Make all other navigable sections visible but not "active" for review layout
        DOMElements.$seccionesNavegables.forEach(sec => {
            sec.style.display = 'block'; // Or 'flex' if they are flex containers
            sec.style.opacity = '1';
            sec.classList.remove('seccion-activa'); // Ensure no other section is marked active
             // In review mode, sequential reveal should show all fields of a section
            const allInternalGroups = sec.querySelectorAll('.form-group.question-group');
            allInternalGroups.forEach(group => group.classList.add('field-visible'));
        });
        updateActiveMenuItem(-1); // No active menu item in sidebar
        window.scrollTo(0, 0);
    };

    if ($currentActive && $currentActive !== DOMElements.$seccionRevision) {
        fadeOutSection($currentActive, enterReview);
    } else {
        enterReview();
    }
}

function hideReviewMode() {
    DOMElements.$formularioCompleto.classList.remove('modo-revision');
    // Hide all sections first, then show the correct one
    DOMElements.$seccionesNavegables.forEach(sec => {
        sec.style.opacity = '0';
        sec.style.display = 'none';
        sec.classList.remove('seccion-activa');
    });

    if (DOMElements.$seccionRevision) {
        fadeOutSection(DOMElements.$seccionRevision, () => {
            showSection(state.currentSeccionIndex); // Show the section user was on
            actualizarProgreso();
        });
    } else {
        showSection(state.currentSeccionIndex);
        actualizarProgreso();
    }
}


function handleFormButtonClick(event) {
    const $button = event.target.closest('button');
    if (!$button) return;

    if ($button.classList.contains('btn-siguiente')) {
        if ($button.classList.contains('btn-final')) {
            // Before going to review, check validity of the current section
            const currentSection = DOMElements.$seccionesNavegables[state.currentSeccionIndex];
            let currentSectionValid = true;
            if (currentSection) {
                currentSection.querySelectorAll('.form-group.field-visible [name]:required').forEach(field => {
                    if (!field.checkValidity()) {
                        currentSectionValid = false;
                        field.classList.add('is-invalid'); // Mark invalid field
                    }
                });
            }
            if (!currentSectionValid) {
                 // Find the showModal function, assuming it's globally available or imported
                if (typeof showModal === 'function') { // Placeholder for actual modal call
                   showModal('error', 'Por favor, completa los campos requeridos en esta sección antes de continuar.', 'Campos Incompletos');
                } else {
                    alert('Por favor, completa los campos requeridos en esta sección.');
                }
                return;
            }
            showReviewMode();
        } else if (state.currentSeccionIndex < DOMElements.$seccionesNavegables.length - 1) {
            showSection(state.currentSeccionIndex + 1);
        }
    } else if ($button.classList.contains('btn-anterior')) {
        if ($button.classList.contains('btn-volver-a-editar')) {
            hideReviewMode();
        } else if (state.currentSeccionIndex > 0) {
            showSection(state.currentSeccionIndex - 1);
        }
    } else if ($button.type === 'submit' && $button.closest('#seccion-revision')) {
        handleSubmitButtonClick(event); // Pass the event
    }
}

function handleMenuItemClick(event) {
    if (DOMElements.$formularioCompleto.classList.contains('modo-revision')) return; // No navigation from sidebar in review mode

    const sectionId = event.currentTarget.getAttribute('data-section');
    const targetIndex = DOMElements.$seccionesNavegables.findIndex(sec => sec.id === sectionId);

    if (targetIndex !== -1) {
        showSection(targetIndex);
        const isMobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
        if (isMobile && DOMElements.$body.classList.contains('sidebar-visible')) {
            // This needs access to toggleSidebar or a similar mechanism
            // For now, assuming toggleSidebar is globally accessible or imported if needed
            if (typeof hideSidebarOnMobile === 'function') { // Assuming toggleSidebar from _sidebar.js is imported as hideSidebarOnMobile
                hideSidebarOnMobile();
            }
        }
    }
}

export function initializeFormNavigation() {
    DOMElements.$sidebarMenuItems.forEach(item => item.addEventListener('click', handleMenuItemClick));
    if (DOMElements.$form) DOMElements.$form.addEventListener('click', handleFormButtonClick);
    // Initial setup: show first section if available
    if (DOMElements.$seccionesNavegables.length > 0) {
        // showSection(0); // This will be called by _splash.js after animations
    }
}
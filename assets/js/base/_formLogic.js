import { DOMElements } from '../config.js';
import { actualizarProgreso } from './_sidebar.js';
import { formSections } from '../formDefinition.js';

// --- Helper Functions ---
function findFieldDefinitionByGroupId(sectionId, groupId) {
    const sectionDef = formSections.find(s => s.id === sectionId);
    if (!sectionDef) return null;
    const fieldIdFromGroup = groupId.startsWith('group-') ? groupId.substring(6) : groupId;

    let fieldDef = sectionDef.fields.find(f => f.id === fieldIdFromGroup || (f.isGroupWrapper && f.id === fieldIdFromGroup) );
    if (fieldDef) return fieldDef;

    if (sectionDef.conditionalSubSections) {
        for (const subSec of sectionDef.conditionalSubSections) {
            if (subSec.id === fieldIdFromGroup && subSec.isGroupWrapper) return subSec;
            fieldDef = subSec.fields.find(f => f.id === fieldIdFromGroup);
            if (fieldDef) return fieldDef;
        }
    }
    const mainGroupWrapper = sectionDef.fields.find(f => f.id === fieldIdFromGroup && f.isGroupWrapper);
    if (mainGroupWrapper) return mainGroupWrapper;
    return null;
}

function getFieldDefinitionFromElement(fieldElement) {
    if (!fieldElement) return null;
    const group = fieldElement.closest('.form-group.question-group');
    if (!group) return null;
    const section = group.closest('.seccion-formulario');
    if (!section) return null;
    return findFieldDefinitionByGroupId(section.id, group.id);
}

/**
 * --- FUNCIÓN CORREGIDA ---
 * Evalúa si un campo debe mostrarse basándose en las condiciones definidas.
 * @param {object} fieldDef La definición completa del campo desde formDefinition.js.
 * @returns {boolean} `true` si el campo debe mostrarse, `false` en caso contrario.
 */
function evaluateConditionalShow(fieldDef) {
    // Si el campo no tiene una regla `conditionalShow`, siempre es visible.
    if (!fieldDef || !fieldDef.conditionalShow) {
        return true;
    }

    const { fieldId, value, values, checked } = fieldDef.conditionalShow;

    // Busca el elemento del formulario que controla la visibilidad (ej. un radio button, un select).
    const controllerSelector = `[name="${fieldId}"], #${fieldId}`;
    const controllerElement = DOMElements.$form.querySelector(controllerSelector);
    
    // Si no se encuentra el elemento controlador, se oculta el campo dependiente por seguridad.
    if (!controllerElement) {
        console.warn(`Lógica Condicional: No se encontró el elemento controlador para el fieldId: ${fieldId}`);
        return false;
    }

    // Lógica para condiciones basadas en checkboxes (`checked: true` o `checked: false`).
    if (typeof checked !== 'undefined') {
        return controllerElement.checked === checked;
    }

    // Se obtiene el valor del elemento controlador.
    // Esto se ha adaptado para que funcione tanto con selects como con grupos de radio buttons.
    let controllerValue;
    if (controllerElement.type === 'radio') {
        const checkedRadio = DOMElements.$form.querySelector(`input[name="${fieldId}"]:checked`);
        controllerValue = checkedRadio ? checkedRadio.value : '';
    } else {
        controllerValue = controllerElement.value;
    }

    // --- CORRECCIÓN CLAVE PARA "DEPORTES" ---
    // Se añade esta lógica para manejar condiciones donde el valor debe estar en un arreglo (`values: [...]`).
    // Verifica si el valor del controlador está incluido en el arreglo de valores permitidos.
    if (values && Array.isArray(values)) {
        return values.includes(controllerValue);
    }
    
    // Lógica para condiciones de valor único (ej. `value: 'si'`).
    if (typeof value !== 'undefined') {
        return controllerValue === value;
    }

    // CORRECCIÓN FINAL: Si existe una regla `conditionalShow` pero ninguna de las condiciones
    // anteriores coincide, el campo debe ocultarse por defecto. El código anterior devolvía 'true'.
    return false;
}


function toggleFieldVisibility(groupId, show) {
    const formGroup = document.getElementById(groupId);
    if (formGroup) {
        const fieldDef = findFieldDefinitionByGroupId(formGroup.closest('.seccion-formulario')?.id, groupId);
        const wasVisible = formGroup.classList.contains('field-visible');

        if (show) {
            formGroup.style.display = 'flex';
            formGroup.classList.add('field-visible');
        } else {
            formGroup.style.display = 'none';
            formGroup.classList.remove('field-visible');
            clearRevealListenerFromGroup(formGroup);
            formGroup.querySelectorAll('input, select, textarea').forEach(input => {
                if(input.type === 'checkbox' || input.type === 'radio') input.checked = false;
                else input.value = '';
                input.classList.remove('is-invalid');
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
    }
}
export function toggleHabitosFields() {
    if (!DOMElements.$form) return;
    const currentSectionId = DOMElements.$form.querySelector('.seccion-formulario.seccion-activa')?.id;
    if (currentSectionId !== 'seccion-habitos' && currentSectionId !== 'seccion-solicitantes') return;

    const sectionDef = formSections.find(s => s.id === 'seccion-habitos');
    if (!sectionDef) return;

    sectionDef.fields.forEach(fieldDef => {
        const groupId = fieldDef.isGroupWrapper ? fieldDef.id : `group-${fieldDef.id}`;
        if (fieldDef.conditionalShow) {
            const show = evaluateConditionalShow(fieldDef);
            toggleFieldVisibility(groupId, show);
        }
        if (fieldDef.id === 'pregunta-embarazo' && fieldDef.isGroupWrapper) {
            const showWrapper = evaluateConditionalShow(fieldDef);
            toggleFieldVisibility(fieldDef.id, showWrapper);
            if (showWrapper && fieldDef.fields) {
                fieldDef.fields.forEach(innerFieldDef => {
                    const innerGroupId = `group-${innerFieldDef.id}`;
                    if (innerFieldDef.conditionalShow) {
                        const showInner = evaluateConditionalShow(innerFieldDef);
                        toggleFieldVisibility(innerGroupId, showInner);
                    } else {
                        toggleFieldVisibility(innerGroupId, true);
                    }
                });
            } else if (!showWrapper && fieldDef.fields) {
                 fieldDef.fields.forEach(innerFieldDef => {
                    toggleFieldVisibility(`group-${innerFieldDef.id}`, false);
                });
            }
        }
    });
    const habEmbarazadaGroupField = sectionDef.fields.find(f => f.id === 'pregunta-embarazo');
    if (habEmbarazadaGroupField && habEmbarazadaGroupField.isGroupWrapper) {
        const solGeneroVisible = evaluateConditionalShow(habEmbarazadaGroupField);
        const habEmbarazadaRadio = DOMElements.$form.querySelector('input[name="hab_embarazada"]:checked');
        const showSemanas = solGeneroVisible && habEmbarazadaRadio && habEmbarazadaRadio.value === 'si';
        toggleFieldVisibility('group-hab_semanas_embarazo', showSemanas);
    }
}

export function toggleDeportesFields() {
    if (!DOMElements.$form) return;
    const currentSectionId = DOMElements.$form.querySelector('.seccion-formulario.seccion-activa')?.id;
    if (currentSectionId !== 'seccion-deportes') return;

    const sectionDef = formSections.find(s => s.id === 'seccion-deportes');
    if (!sectionDef) return;

    sectionDef.fields.forEach(fieldDef => {
        if (fieldDef.conditionalShow) {
            const show = evaluateConditionalShow(fieldDef);
            toggleFieldVisibility(`group-${fieldDef.id}`, show);
        }
    });
}


// --- Revelación Secuencial ---
let revealDebounceTimer;
function handleFieldRevealInteractionDebounced(event) {
    clearTimeout(revealDebounceTimer);
    revealDebounceTimer = setTimeout(() => {
        handleFieldRevealInteraction(event);
    }, 300);
}

function fieldSatisfiesReveal(fieldElement, fieldDef) {
    if (!fieldElement || !fieldDef) return false;
    switch (fieldDef.type) {
        case 'checkbox':
        case 'radio':
            return true;
        case 'select':
            return fieldElement.required ? fieldElement.value !== "" : true;
        default:
            return fieldElement.required ? fieldElement.value.trim() !== "" && fieldElement.checkValidity() : (fieldElement.value.trim() !== "" || !fieldElement.required );
    }
}

function handleFieldRevealInteraction(event) {
    const currentFieldElement = event.target;
    const currentGroup = currentFieldElement.closest('.form-group.question-group');
    if (!currentGroup) return;

    const sectionElement = currentGroup.closest('.seccion-formulario');
    if (!sectionElement) return;

    const currentFieldDef = getFieldDefinitionFromElement(currentFieldElement);
    let canRevealNext = fieldSatisfiesReveal(currentFieldElement, currentFieldDef);

    if (canRevealNext) {
        const formColumnsContainer = sectionElement.querySelector('.form-columns-container');
        const fieldGroupsSource = formColumnsContainer || sectionElement;
        const potentialSequenceGroups = Array.from(fieldGroupsSource.children)
            .filter(el => el.classList.contains('form-group') && el.classList.contains('question-group'));
        
        const currentIndexInPotentialSequence = potentialSequenceGroups.indexOf(currentGroup);

        for (let i = currentIndexInPotentialSequence + 1; i < potentialSequenceGroups.length; i++) {
            const groupCandidate = potentialSequenceGroups[i];
            const fieldDefCandidate = findFieldDefinitionByGroupId(sectionElement.id, groupCandidate.id);

            if (groupCandidate.classList.contains('field-visible')) {
                 if (fieldDefCandidate && fieldDefCandidate.type !== 'checkbox' && fieldDefCandidate.type !== 'radio' && fieldDefCandidate.sequentialReveal) {
                    break; 
                }
                continue; 
            }

            if (fieldDefCandidate && fieldDefCandidate.sequentialReveal) {
                if (evaluateConditionalShow(fieldDefCandidate)) {
                    groupCandidate.classList.add('field-visible');
                    groupCandidate.style.display = 'flex';
                    addRevealListenerToGroup(groupCandidate);

                    if (fieldDefCandidate.type !== 'checkbox' && fieldDefCandidate.type !== 'radio') {
                        break; 
                    }
                } else {
                    break;
                }
            } else if (fieldDefCandidate && !fieldDefCandidate.sequentialReveal) {
                 if (evaluateConditionalShow(fieldDefCandidate)) {
                    groupCandidate.classList.add('field-visible');
                    groupCandidate.style.display = 'flex';
                } else {
                    break;
                }
            } else {
                break;
            }
        }
    }
    actualizarProgreso();
}

function addRevealListenerToGroup(groupElement) {
    if (!groupElement) return;
    clearRevealListenerFromGroup(groupElement);

    const fieldDef = findFieldDefinitionByGroupId(groupElement.closest('.seccion-formulario')?.id, groupElement.id);
    if (!fieldDef || !fieldDef.sequentialReveal) return;

    const inputElement = document.getElementById(fieldDef.id);
    const radioInputs = groupElement.querySelectorAll(`input[type="radio"][name="${fieldDef.name}"]`);

    if (fieldDef.type === 'radio' && radioInputs.length > 0) {
        radioInputs.forEach(radio => radio.addEventListener('change', handleFieldRevealInteraction));
    } else if (inputElement && fieldDef.type === 'checkbox' && !fieldDef.options) {
        inputElement.addEventListener('change', handleFieldRevealInteraction);
    } else if (inputElement) {
        const eventType = (inputElement.tagName === 'SELECT' || inputElement.type === 'date') ? 'change' : 'blur';
        inputElement.addEventListener(eventType, handleFieldRevealInteraction);
        if (['text', 'email', 'number', 'tel', 'url', 'textarea'].includes(inputElement.type) || inputElement.tagName === 'TEXTAREA') {
            inputElement.addEventListener('input', handleFieldRevealInteractionDebounced);
        }
    }
}

function clearRevealListenerFromGroup(groupElement) {
    if (!groupElement) return;
    const fieldDef = findFieldDefinitionByGroupId(groupElement.closest('.seccion-formulario')?.id, groupElement.id);
    if (!fieldDef) return;

    const inputElement = document.getElementById(fieldDef.id);
    const radioInputs = groupElement.querySelectorAll(`input[type="radio"][name="${fieldDef.name}"]`);

    if (fieldDef.type === 'radio' && radioInputs.length > 0) {
        radioInputs.forEach(radio => radio.removeEventListener('change', handleFieldRevealInteraction));
    } else if (inputElement && fieldDef.type === 'checkbox' && !fieldDef.options) {
        inputElement.removeEventListener('change', handleFieldRevealInteraction);
    } else if (inputElement) {
        const eventType = (inputElement.tagName === 'SELECT' || inputElement.type === 'date') ? 'change' : 'blur';
        inputElement.removeEventListener(eventType, handleFieldRevealInteraction);
        if (['text', 'email', 'number', 'tel', 'url', 'textarea'].includes(inputElement.type) || inputElement.tagName === 'TEXTAREA') {
            inputElement.removeEventListener('input', handleFieldRevealInteractionDebounced);
        }
    }
}

export function initSequentialRevealForSection(sectionElement) {
    if (!sectionElement) return;
    const sectionDef = formSections.find(s => s.id === sectionElement.id);
    if (!sectionDef) return;

    const processFieldsAndUpdateVisibility = (fieldsToProcess) => {
        let firstSequentialInScopeToShow = null;

        fieldsToProcess.forEach(fieldDef => {
            const groupId = fieldDef.isGroupWrapper ? fieldDef.id : `group-${fieldDef.id}`;
            const groupElement = document.getElementById(groupId);
            if (!groupElement) return;

            const isConditionallyVisible = evaluateConditionalShow(fieldDef);
            toggleFieldVisibility(groupId, isConditionallyVisible);

            if (isConditionallyVisible) {
                if (fieldDef.sequentialReveal) {
                    if (!firstSequentialInScopeToShow) {
                        firstSequentialInScopeToShow = groupElement;
                    } else {
                        groupElement.classList.remove('field-visible');
                        groupElement.style.display = 'none';
                        clearRevealListenerFromGroup(groupElement);
                    }
                } else {
                    groupElement.classList.add('field-visible');
                    groupElement.style.display = 'flex';
                }
                if (fieldDef.isGroupWrapper && fieldDef.fields && isConditionallyVisible) {
                    processFieldsAndUpdateVisibility(fieldDef.fields);
                }
            } else {
                 groupElement.classList.remove('field-visible');
                 groupElement.style.display = 'none';
                 clearRevealListenerFromGroup(groupElement);
            }
        });

        if (firstSequentialInScopeToShow) {
            firstSequentialInScopeToShow.classList.add('field-visible');
            firstSequentialInScopeToShow.style.display = 'flex';
            addRevealListenerToGroup(firstSequentialInScopeToShow);

            let currentGroupForCascade = firstSequentialInScopeToShow;
            let fieldElementForCascade = currentGroupForCascade.querySelector('input, select, textarea');
            
            while(fieldElementForCascade){
                const currentFieldDefCascade = getFieldDefinitionFromElement(fieldElementForCascade);
                if (!fieldSatisfiesReveal(fieldElementForCascade, currentFieldDefCascade) && currentFieldDefCascade.type !== 'checkbox' && currentFieldDefCascade.type !== 'radio') {
                    break;
                }

                const potentialSequenceGroups = Array.from((currentGroupForCascade.parentElement || sectionElement).children)
                    .filter(el => el.classList.contains('form-group') && el.classList.contains('question-group'));
                const currentIndex = potentialSequenceGroups.indexOf(currentGroupForCascade);
                let nextActualGroupInCascade = null;

                for (let i = currentIndex + 1; i < potentialSequenceGroups.length; i++) {
                    const candidate = potentialSequenceGroups[i];
                    const candidateDef = findFieldDefinitionByGroupId(sectionElement.id, candidate.id);
                    if (candidateDef && candidateDef.sequentialReveal && evaluateConditionalShow(candidateDef)) {
                        if(!candidate.classList.contains('field-visible')){
                            candidate.classList.add('field-visible');
                            candidate.style.display = 'flex';
                            addRevealListenerToGroup(candidate);
                        }
                        nextActualGroupInCascade = candidate;
                        if (candidateDef.type !== 'checkbox' && candidateDef.type !== 'radio') break;
                    } else if (candidateDef && !candidateDef.sequentialReveal && evaluateConditionalShow(candidateDef)){
                         if(!candidate.classList.contains('field-visible')){
                            candidate.classList.add('field-visible');
                            candidate.style.display = 'flex';
                        }
                    } else if (candidateDef && candidateDef.sequentialReveal && !evaluateConditionalShow(candidateDef)){
                        break;
                    }
                }
                if(!nextActualGroupInCascade) break;
                currentGroupForCascade = nextActualGroupInCascade;
                fieldElementForCascade = currentGroupForCascade.querySelector('input, select, textarea');
            }
        }
    };

    processFieldsAndUpdateVisibility(sectionDef.fields);

    if (sectionDef.conditionalSubSections) {
        sectionDef.conditionalSubSections.forEach(subSecDef => {
            const subSectionContainer = document.getElementById(subSecDef.id);
            if (subSectionContainer) {
                const isSubSectionVisible = evaluateConditionalShow({ conditionalShow: subSecDef.condition });
                subSectionContainer.style.display = isSubSectionVisible ? (subSectionContainer.classList.contains('form-columns-container') ? 'grid' : 'block') : 'none';
                if (isSubSectionVisible) {
                    processFieldsAndUpdateVisibility(subSecDef.fields);
                }
            }
        });
    }
     actualizarProgreso();
}


export function clearSequentialRevealListeners(sectionElement) {
    if (!sectionElement) return;
    const sectionDef = formSections.find(s => s.id === sectionElement.id);
    if (!sectionDef) return;
    const clearListenersForFields = (fields) => {
        fields.forEach(fieldDef => {
            const groupId = fieldDef.isGroupWrapper ? fieldDef.id : `group-${fieldDef.id}`;
            const groupElement = document.getElementById(groupId);
            if (groupElement) clearRevealListenerFromGroup(groupElement);
            if (fieldDef.isGroupWrapper && fieldDef.fields) {
                clearListenersForFields(fieldDef.fields);
            }
        });
    };
    clearListenersForFields(sectionDef.fields);
    if (sectionDef.conditionalSubSections) {
        sectionDef.conditionalSubSections.forEach(subSec => clearListenersForFields(subSec.fields));
    }
}

function handleFieldValidation(event) {
    const field = event.target;
    const group = field.closest('.form-group.question-group');
    if (group && group.style.display === 'none') {
        field.classList.remove('is-invalid');
        return;
    }
    if (field.value.trim() !== "" || field.required) {
        if (field.checkValidity()) field.classList.remove('is-invalid');
        else field.classList.add('is-invalid');
    } else {
         field.classList.remove('is-invalid');
    }
    actualizarProgreso();
}

export function initializeFormLogic() {
    const addConditionalListener = (controllerFieldIdentifier, handlerFunction) => {
        const elements = DOMElements.$form.querySelectorAll(`[name="${controllerFieldIdentifier}"], #${controllerFieldIdentifier}`);
        elements.forEach(el => {
            el.addEventListener('change', () => {
                handlerFunction();
                const activeSection = DOMElements.$form.querySelector('.seccion-formulario.seccion-activa');
                if (activeSection) initSequentialRevealForSection(activeSection);
                actualizarProgreso();
            });
        });
    };

    addConditionalListener("con_igual_titular", () => {
        const sel = DOMElements.$form.querySelector('input[name="con_igual_titular"]:checked');
        const datosContratanteDiferente = document.getElementById('datos-contratante-diferente');
        if (datosContratanteDiferente) {
            const show = sel?.value === 'no';
            datosContratanteDiferente.style.display = show ? 'block' : 'none';
             datosContratanteDiferente.querySelectorAll('input, select, textarea').forEach(f => {
                if (!show) { if (f.type === 'checkbox' || f.type === 'radio') f.checked = false; else f.value = ''; f.classList.remove('is-invalid'); }
            });
        }
    });
    addConditionalListener("pago_titular_igual_contratante", () => {
        const checkTitularPago = document.getElementById('pago_titular_igual_contratante');
        const datosTarjetaHabienteDiferente = document.getElementById('datos-tarjetahabiente-diferente');
        if (checkTitularPago && datosTarjetaHabienteDiferente) {
            const show = !checkTitularPago.checked;
            datosTarjetaHabienteDiferente.style.display = show ? 'block' : 'none';
            datosTarjetaHabienteDiferente.querySelectorAll('input, select, textarea').forEach(f => {
                if (!show) { if (f.type === 'checkbox' || f.type === 'radio') f.checked = false; else f.value = ''; f.classList.remove('is-invalid');}
            });
        }
    });
    
    addConditionalListener("sol_genero", toggleHabitosFields);
    ["hab_fuma", "hab_consume_alcohol", "hab_consume_drogas", "hab_embarazada"].forEach(name => addConditionalListener(name, toggleHabitosFields));
    addConditionalListener("dep_tipo_practica", toggleDeportesFields);
    addConditionalListener("dep_otros_riesgos", toggleDeportesFields);
    
    const padecimientosRadioNames = ["med_padece_enfermedad", "med_en_tratamiento", "med_hospitalizado_cirugia", "med_discapacidad", "med_otro_padecimiento"];
    padecimientosRadioNames.forEach(name => {
        DOMElements.$form.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
            radio.addEventListener('change', () => {
                let showDetalles = false;
                padecimientosRadioNames.forEach(n => {
                    const r = DOMElements.$form.querySelector(`input[name="${n}"]:checked`);
                    if (r && r.value === 'si') showDetalles = true;
                });
                toggleFieldVisibility('group-med_detalles_padecimiento', showDetalles);
                const activeSection = DOMElements.$form.querySelector('.seccion-formulario.seccion-activa');
                if (activeSection) initSequentialRevealForSection(activeSection);
                actualizarProgreso();
            });
        });
    });

    DOMElements.$form.addEventListener('blur', (event) => {
        if (event.target.matches('input:not([type="checkbox"]):not([type="radio"]), select, textarea')) {
            handleFieldValidation(event);
        }
    }, true);
    DOMElements.$form.addEventListener('input', (event) => {
        if (event.target.matches('input:not([type="checkbox"]):not([type="radio"]), textarea')) {
             actualizarProgreso();
        }
    }, true);
     DOMElements.$form.addEventListener('change', (event) => {
        if (event.target.matches('select, input[type="checkbox"], input[type="radio"]')) {
             actualizarProgreso();
        }
    }, true);

    const activeSectionNow = DOMElements.$form.querySelector('.seccion-formulario.seccion-activa');
    if(activeSectionNow?.id === 'seccion-habitos') toggleHabitosFields();
    if(activeSectionNow?.id === 'seccion-deportes') toggleDeportesFields();

    let showInitialDetallesPadecimiento = false;
    padecimientosRadioNames.forEach(n => {
        const r = DOMElements.$form.querySelector(`input[name="${n}"]:checked`);
        if (r && r.value === 'si') showInitialDetallesPadecimiento = true;
    });
    toggleFieldVisibility('group-med_detalles_padecimiento', showInitialDetallesPadecimiento);

    const conIgualTitular = DOMElements.$form.querySelector('input[name="con_igual_titular"]:checked');
    const datosContratanteDiferente = document.getElementById('datos-contratante-diferente');
    if (datosContratanteDiferente && conIgualTitular) {
        datosContratanteDiferente.style.display = (conIgualTitular.value === 'no') ? 'block' : 'none';
    }
    const titularPagoIgual = document.getElementById('pago_titular_igual_contratante');
    const datosPagadorDiferente = document.getElementById('datos-tarjetahabiente-diferente');
    if (titularPagoIgual && datosPagadorDiferente) {
         datosPagadorDiferente.style.display = !titularPagoIgual.checked ? 'block' : 'none';
    }
}

// Contenido completo para: GNP_Local/assets/js/base/_formRenderer.js

import { DOMElements } from '../config.js';

// --- Funciones auxiliares (las que ya tenías) ---
function createLabelElement(fieldDef) {
    const label = document.createElement('label');
    if (fieldDef.type !== 'checkbox' || fieldDef.options) {
        label.setAttribute('for', fieldDef.id);
    }
    label.textContent = fieldDef.label;

    if (fieldDef.required) {
        const requiredMarker = document.createElement('span');
        requiredMarker.className = 'required-marker';
        requiredMarker.textContent = '*';
        label.appendChild(requiredMarker);
    }

    if (fieldDef.tooltipText) {
        const helpIconWrapper = document.createElement('span');
        helpIconWrapper.className = 'help-icon-wrapper';
        const helpIcon = document.createElement('span');
        helpIcon.className = 'help-icon material-symbols-outlined';
        helpIcon.textContent = 'help';
        const tooltipId = `tooltip-${fieldDef.id}`;
        helpIcon.dataset.tooltipTarget = tooltipId;
        const tooltipContent = document.createElement('div');
        tooltipContent.className = 'tooltip-content';
        tooltipContent.id = tooltipId;
        tooltipContent.textContent = fieldDef.tooltipText;
        helpIconWrapper.appendChild(helpIcon);
        helpIconWrapper.appendChild(tooltipContent);
        label.appendChild(helpIconWrapper);
    }
    return label;
}

function createInputElement(fieldDef) {
    const input = document.createElement('input');
    input.type = fieldDef.type;
    input.id = fieldDef.id;
    input.name = fieldDef.name;
    if (fieldDef.type !== 'checkbox' && fieldDef.type !== 'radio') {
        input.className = 'form-control';
    }
    if (fieldDef.placeholder) input.placeholder = fieldDef.placeholder;
    if (fieldDef.maxLength) input.maxLength = fieldDef.maxLength;
    if (fieldDef.required) input.required = true;
    if (fieldDef.value) input.value = fieldDef.value;
    if (fieldDef.type === 'number') {
        if (fieldDef.step) input.step = fieldDef.step;
        if (fieldDef.min) input.min = fieldDef.min;
        if (fieldDef.max) input.max = fieldDef.max;
    }
    return input;
}

function createSelectElement(fieldDef) {
    const select = document.createElement('select');
    select.id = fieldDef.id;
    select.name = fieldDef.name;
    select.className = 'form-control';
    if (fieldDef.required) select.required = true;
    if (fieldDef.options) {
        fieldDef.options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            if (opt.disabled) option.disabled = true;
            if (opt.selected) option.selected = true;
            select.appendChild(option);
        });
    }
    return select;
}

function createTextareaElement(fieldDef) {
    const textarea = document.createElement('textarea');
    textarea.id = fieldDef.id;
    textarea.name = fieldDef.name;
    textarea.className = 'form-control';
    if (fieldDef.placeholder) textarea.placeholder = fieldDef.placeholder;
    if (fieldDef.maxLength) textarea.maxLength = fieldDef.maxLength;
    if (fieldDef.required) textarea.required = true;
    textarea.rows = fieldDef.rows || 3;
    return textarea;
}

function createRadioGroupElement(fieldDef) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'radio-group';
    fieldDef.options.forEach(opt => {
        const label = document.createElement('label');
        const radio = createInputElement({
            type: 'radio',
            id: `${fieldDef.id}_${opt.value}`,
            name: fieldDef.name,
            value: opt.value,
            required: fieldDef.required
        });
        if (fieldDef.defaultValue === opt.value) {
            radio.checked = true;
        }
        label.appendChild(radio);
        label.appendChild(document.createTextNode(` ${opt.text}`));
        groupDiv.appendChild(label);
    });
    return groupDiv;
}

// --- FUNCIÓN renderDynamicForm COMPLETA Y CORREGIDA ---
export function renderDynamicForm(formDefinition) {
    if (!DOMElements.$form) {
        console.error('Elemento <form id="miFormularioDinamico"> no encontrado.');
        return;
    }
    DOMElements.$form.innerHTML = '';

    formDefinition.forEach(sectionDef => {
        if (sectionDef.id === "seccion-revision") return;

        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'table-form seccion-formulario';
        sectionDiv.id = sectionDef.id;
        sectionDiv.style.display = 'none';

        const titleH2 = document.createElement('h2');
        titleH2.textContent = sectionDef.title;
        sectionDiv.appendChild(titleH2);

        if (sectionDef.subtitle) {
            const subtitleP = document.createElement('p');
            subtitleP.className = 'subtitulo-ligero';
            subtitleP.textContent = sectionDef.subtitle;
            sectionDiv.appendChild(subtitleP);
        }

        const columnsContainer = document.createElement('div');
        columnsContainer.className = 'form-columns-container';

        sectionDef.fields.forEach(fieldDef => {
            const formGroupDiv = document.createElement('div');
            formGroupDiv.className = 'form-group question-group';
            formGroupDiv.id = `group-${fieldDef.id}`;

            if (fieldDef.type === 'separator') {
                formGroupDiv.innerHTML = `<h4 class="form-separator">${fieldDef.title || ''}</h4>`;
                formGroupDiv.classList.add('separator-group', 'full-width-column');
                columnsContainer.appendChild(formGroupDiv);
                return;
            }

            if (fieldDef.type === 'info') {
                formGroupDiv.innerHTML = `<p class="form-info-text">${fieldDef.text || ''}</p>`;
                formGroupDiv.classList.add('info-group', 'full-width-column');
                columnsContainer.appendChild(formGroupDiv);
                return;
            }

            let fieldLabel, fieldInput;

            if (fieldDef.type === 'checkbox' && !fieldDef.options) {
                const combinedLabel = document.createElement('label');
                fieldInput = createInputElement(fieldDef);
                combinedLabel.appendChild(fieldInput);
                combinedLabel.appendChild(document.createTextNode(` ${fieldDef.label}`));
                if (fieldDef.required) {
                    const marker = document.createElement('span');
                    marker.className = 'required-marker';
                    marker.textContent = '*';
                    combinedLabel.appendChild(marker);
                }
                formGroupDiv.appendChild(combinedLabel);
            } else {
                fieldLabel = createLabelElement(fieldDef);
                formGroupDiv.appendChild(fieldLabel);
                switch (fieldDef.type) {
                    case 'select':
                        fieldInput = createSelectElement(fieldDef);
                        break;
                    case 'textarea':
                        fieldInput = createTextareaElement(fieldDef);
                        break;
                    case 'radio':
                        fieldInput = createRadioGroupElement(fieldDef);
                        break;
                    default:
                        fieldInput = createInputElement(fieldDef);
                        break;
                }
                formGroupDiv.appendChild(fieldInput);
            }
            columnsContainer.appendChild(formGroupDiv);
        });

        sectionDiv.appendChild(columnsContainer);

        if (sectionDef.conditionalSubSections) {
            sectionDef.conditionalSubSections.forEach(subSectionDef => {
                const subSectionContainer = document.createElement('div');
                subSectionContainer.id = subSectionDef.id;
                subSectionContainer.style.display = 'none';
                const subColumnsContainer = document.createElement('div');
                subColumnsContainer.className = 'form-columns-container';
                subSectionDef.fields.forEach(fieldDef => {
                    const formGroupDiv = document.createElement('div');
                    formGroupDiv.className = 'form-group question-group';
                    formGroupDiv.id = `group-${fieldDef.id}`;
                    let fieldLabel, fieldInput;
                    if (fieldDef.type === 'checkbox' && !fieldDef.options) {
                        const combinedLabel = document.createElement('label');
                        fieldInput = createInputElement(fieldDef);
                        combinedLabel.appendChild(fieldInput);
                        combinedLabel.appendChild(document.createTextNode(` ${fieldDef.label}`));
                        if (fieldDef.required) {
                            const marker = document.createElement('span');
                            marker.className = 'required-marker';
                            marker.textContent = '*';
                            combinedLabel.appendChild(marker);
                        }
                        formGroupDiv.appendChild(combinedLabel);
                    } else {
                        fieldLabel = createLabelElement(fieldDef);
                        formGroupDiv.appendChild(fieldLabel);
                        switch (fieldDef.type) {
                            case 'select': fieldInput = createSelectElement(fieldDef); break;
                            case 'textarea': fieldInput = createTextareaElement(fieldDef); break;
                            case 'radio': fieldInput = createRadioGroupElement(fieldDef); break;
                            default: fieldInput = createInputElement(fieldDef); break;
                        }
                        formGroupDiv.appendChild(fieldInput);
                    }
                    subColumnsContainer.appendChild(formGroupDiv);
                });
                subSectionContainer.appendChild(subColumnsContainer);
                sectionDiv.appendChild(subSectionContainer);
            });
        }
        
        const navButtonsDiv = document.createElement('div');
        navButtonsDiv.className = 'botones-navegacion';
        const esPrimeraSeccionNavegable = DOMElements.$seccionesNavegables && DOMElements.$seccionesNavegables.length > 0 && DOMElements.$seccionesNavegables[0]?.id === sectionDef.id;
        const esUltimaSeccionNavegable = DOMElements.$seccionesNavegables && DOMElements.$seccionesNavegables.length > 0 && DOMElements.$seccionesNavegables[DOMElements.$seccionesNavegables.length - 1]?.id === sectionDef.id;

        if (!esPrimeraSeccionNavegable && sectionDef.id !== "seccion-revision") {
            const prevButton = document.createElement('button');
            prevButton.type = 'button';
            prevButton.className = 'btn-anterior';
            prevButton.textContent = 'Anterior';
            navButtonsDiv.appendChild(prevButton);
        }
        if (!esUltimaSeccionNavegable && sectionDef.id !== "seccion-revision") {
            const nextButton = document.createElement('button');
            nextButton.type = 'button';
            nextButton.className = 'btn-siguiente';
            nextButton.textContent = 'Siguiente';
            navButtonsDiv.appendChild(nextButton);
        } else if (esUltimaSeccionNavegable) {
            const reviewButton = document.createElement('button');
            reviewButton.type = 'button';
            reviewButton.className = 'btn-siguiente btn-final';
            reviewButton.textContent = 'Ir a Revisión Final';
            navButtonsDiv.appendChild(reviewButton);
        }
        
        sectionDiv.appendChild(navButtonsDiv);
        DOMElements.$form.appendChild(sectionDiv);
    });

    const reviewSectionDef = formDefinition.find(s => s.id === "seccion-revision");
    if (reviewSectionDef) {
        const reviewSectionDiv = document.createElement('div');
        reviewSectionDiv.id = reviewSectionDef.id;
        reviewSectionDiv.className = 'seccion-formulario';
        reviewSectionDiv.style.display = 'none';
        const titleH2 = document.createElement('h2');
        titleH2.textContent = reviewSectionDef.title || "Revisa tu información";
        reviewSectionDiv.appendChild(titleH2);
        if (reviewSectionDef.subtitle) {
            const subtitleP = document.createElement('p');
            subtitleP.className = 'subtitulo-ligero';
            subtitleP.textContent = reviewSectionDef.subtitle;
            reviewSectionDiv.appendChild(subtitleP);
        }
        const resumenFinalDiv = document.createElement('div');
        resumenFinalDiv.id = 'resumen-final';
        reviewSectionDiv.appendChild(resumenFinalDiv);
        const reviewNavButtonsDiv = document.createElement('div');
        reviewNavButtonsDiv.className = 'botones-navegacion';
        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'btn-anterior btn-volver-a-editar';
        editButton.textContent = 'Volver a Editar';
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'btn-primary';
        submitButton.textContent = 'Enviar Formulario';
        reviewNavButtonsDiv.appendChild(editButton);
        reviewNavButtonsDiv.appendChild(submitButton);
        reviewSectionDiv.appendChild(reviewNavButtonsDiv);
        DOMElements.$form.appendChild(reviewSectionDiv);
    }
}
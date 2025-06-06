// GNP_Local/assets/js/base/_api.js
import { CONFIG, state, DOMElements } from '../config.js';
import { showModal } from './_modal.js'; // Import showModal

async function sendFormData(data) {
    try {
        const response = await fetch(CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
             let errorMsg = `Error del servidor: ${response.status} ${response.statusText}`;
             try { const errorData = await response.json(); errorMsg = errorData.message || errorData.error || errorMsg; } catch (e) { /* No JSON */ }
             throw new Error(errorMsg);
        }
        const result = await response.json(); // Assuming server sends JSON back
        showModal('success', 'Tu solicitud ha sido enviada exitosamente.', 'Envío Exitoso');
    } catch (error) {
        console.error('Error en sendFormData:', error);
        showModal('error', `No se pudo enviar la solicitud. ${error.message}`, 'Error de Envío');
    } finally {
         if (state.lastSubmitButton && state.isSubmitting) {
             state.lastSubmitButton.disabled = false;
             state.lastSubmitButton.textContent = 'Enviar Formulario'; // Or its original text
             state.isSubmitting = false;
             // state.lastSubmitButton = null; // Keep it null unless re-set on next submit
         }
    }
}

export function handleSubmitButtonClick(event) { // event is passed directly
    event.preventDefault();
    if (state.isSubmitting) return;

    const button = event.target.closest('button[type="submit"]'); // Ensure it's the submit button
    if (!button) return;


    if (!DOMElements.$form.checkValidity()) {
         showModal('error', 'Por favor, revisa los campos marcados o incompletos antes de enviar.', 'Formulario Incompleto');
         DOMElements.$form.reportValidity(); // Shows native browser validation messages
         return;
    }

    state.isSubmitting = true;
    state.lastSubmitButton = button;
    button.disabled = true;
    button.textContent = 'Enviando...';

    const formData = new FormData(DOMElements.$form);
    const dataObject = {};
    formData.forEach((value, key) => {
        // Handle multi-select or checkbox groups if necessary
        if (dataObject[key]) {
            if (!Array.isArray(dataObject[key])) {
                dataObject[key] = [dataObject[key]];
            }
            dataObject[key].push(value);
        } else {
            dataObject[key] = value;
        }
    });
    sendFormData(dataObject);
}
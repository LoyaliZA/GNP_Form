// GNP_Local/assets/js/base/_api.js

/*
 * =================================================================
 * MÓDULO DE API (_api.js)
 * =================================================================
 * Este módulo se encarga de toda la lógica relacionada con la
 * comunicación con el servidor, incluyendo la recolección, validación
 * y envío de los datos del formulario.
 * =================================================================
 */

// --- IMPORTACIONES ---
// Se importan las configuraciones, el estado de la aplicación, los elementos del DOM
// y la función para mostrar modales desde otros módulos.
import { CONFIG, state, DOMElements } from '../config.js';
import { showModal } from './_modal.js'; // Importa la función para mostrar ventanas modales.

/**
 * @async
 * @function sendFormData
 * @description Envía los datos del formulario al servidor de forma asíncrona.
 * @param {object} data - Un objeto JavaScript con todos los datos del formulario.
 */
async function sendFormData(data) {
    try {
        // Inicia la comunicación con el servidor usando fetch.
        // La URL del servidor se toma del archivo de configuración.
        const response = await fetch(CONFIG.API_ENDPOINT, {
            method: 'POST', // Se usa el método POST para enviar datos.
            headers: {
                'Content-Type': 'application/json', // Se especifica que el cuerpo de la petición es JSON.
            },
            body: JSON.stringify(data) // Convierte el objeto de datos a una cadena de texto JSON.
        });

        // Verifica si la respuesta del servidor NO fue exitosa (ej. error 404, 500).
        if (!response.ok) {
             // Crea un mensaje de error por defecto.
             let errorMsg = `Error del servidor: ${response.status} ${response.statusText}`;
             try {
                 // Intenta leer un mensaje de error más específico desde la respuesta del servidor.
                 const errorData = await response.json();
                 errorMsg = errorData.message || errorData.error || errorMsg;
             } catch (e) {
                 // Si la respuesta de error no es un JSON válido, se ignora y se usa el mensaje por defecto.
                 console.warn("DEBUG: La respuesta de error del servidor no contenía un JSON válido.");
             }
             // Lanza un error para ser capturado por el bloque catch.
             throw new Error(errorMsg);
        }

        // Si la respuesta fue exitosa, se asume que el servidor devuelve un JSON.
        const result = await response.json();
        console.log("DEBUG: Respuesta exitosa del servidor:", result); // Línea de depuración
        // Muestra un modal de éxito al usuario.
        showModal('success', 'Tu solicitud ha sido enviada exitosamente.', 'Envío Exitoso');

    } catch (error) {
        // Captura cualquier error que ocurra durante el fetch (ej. problemas de red) o los errores lanzados manualmente.
        console.error('Error en sendFormData:', error); // Línea de depuración
        // Muestra un modal de error con el mensaje correspondiente.
        showModal('error', `No se pudo enviar la solicitud. ${error.message}`, 'Error de Envío');

    } finally {
        // Este bloque se ejecuta SIEMPRE, tanto si la petición tuvo éxito como si falló.
        // Es crucial para reestablecer el estado del botón de envío.
         if (state.lastSubmitButton && state.isSubmitting) {
             state.lastSubmitButton.disabled = false; // Vuelve a habilitar el botón.
             state.lastSubmitButton.textContent = 'Enviar Formulario'; // Restaura el texto original del botón.
             state.isSubmitting = false; // Permite que se pueda volver a enviar el formulario.
         }
    }
}

/**
 * @function handleSubmitButtonClick
 * @description Maneja el evento de clic en el botón de envío del formulario.
 * @param {Event} event - El objeto del evento de clic.
 */
export function handleSubmitButtonClick(event) {
    // Previene el comportamiento por defecto del formulario (que es recargar la página).
    event.preventDefault();
    // Si ya se está enviando una solicitud, no hace nada para evitar envíos duplicados.
    if (state.isSubmitting) return;

    // Se asegura de que el objetivo del evento sea el botón de envío.
    const button = event.target.closest('button[type="submit"]');
    if (!button) return;

    // Utiliza la validación nativa del navegador para comprobar si todos los campos requeridos están llenos.
    if (!DOMElements.$form.checkValidity()) {
         // Si el formulario no es válido, muestra un modal de error.
         showModal('error', 'Por favor, revisa los campos marcados o incompletos antes de enviar.', 'Formulario Incompleto');
         // Muestra los mensajes de validación nativos del navegador junto a los campos inválidos.
         DOMElements.$form.reportValidity();
         return; // Detiene la ejecución.
    }

    // Actualiza el estado para indicar que se está procesando un envío.
    state.isSubmitting = true;
    state.lastSubmitButton = button;
    // Deshabilita el botón y cambia su texto para dar feedback visual al usuario.
    button.disabled = true;
    button.textContent = 'Enviando...';

    // Recolecta todos los datos del formulario.
    const formData = new FormData(DOMElements.$form);
    const dataObject = {};
    // Convierte el objeto FormData a un objeto JavaScript simple.
    formData.forEach((value, key) => {
        // Maneja el caso de campos con múltiples valores (como grupos de checkboxes).
        if (dataObject[key]) {
            // Si la clave ya existe, convierte su valor en un array (si no lo es ya).
            if (!Array.isArray(dataObject[key])) {
                dataObject[key] = [dataObject[key]];
            }
            // Añade el nuevo valor al array.
            dataObject[key].push(value);
        } else {
            // Si la clave no existe, simplemente la añade al objeto.
            dataObject[key] = value;
        }
    });

    console.log("DEBUG: Datos del formulario a enviar:", dataObject); // Línea de depuración
    // Llama a la función que realmente enviará los datos al servidor.
    sendFormData(dataObject);
}

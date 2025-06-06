// GNP_Local/assets/js/base/_modal.js
import { DOMElements, state } from '../config.js';

export function showModal(type, message = '', title = '') {
    if (!DOMElements.$modalOverlay || !DOMElements.$modalContainer) return;

    DOMElements.$modalMessage.textContent = message;
    DOMElements.$modalTitle.textContent = title || (type === 'error' ? 'Error' : 'Éxito');

    if (DOMElements.$modalErrorIcon) DOMElements.$modalErrorIcon.style.display = (type === 'error') ? 'inline-block' : 'none';
    if (DOMElements.$modalSuccessLogo) DOMElements.$modalSuccessLogo.style.display = (type === 'success') ? 'inline-block' : 'none';

    // Ensure OK button is visible for success, and potentially for errors too if it acts as a close button
    if (DOMElements.$modalOkBtn) DOMElements.$modalOkBtn.style.display = 'inline-block';
    if (DOMElements.$modalCloseBtn) DOMElements.$modalCloseBtn.style.display = 'inline-block'; // Or conditional

    DOMElements.$body.classList.add('modal-visible');
}

export function hideModal() {
    if (!DOMElements.$body.classList.contains('modal-visible')) return;

    DOMElements.$body.classList.remove('modal-visible');
    if (DOMElements.$modalMessage) DOMElements.$modalMessage.textContent = '';
    if (DOMElements.$modalTitle) DOMElements.$modalTitle.textContent = '';

    // Reset submitting state if a modal closure implies it
    if (state.lastSubmitButton && state.isSubmitting) {
        state.lastSubmitButton.disabled = false;
        state.lastSubmitButton.textContent = 'Enviar Formulario'; // Or original text
        state.isSubmitting = false;
        state.lastSubmitButton = null;
    }
}

export function initializeModals() {
    if (DOMElements.$modalOverlay) DOMElements.$modalOverlay.addEventListener('click', hideModal);
    if (DOMElements.$modalCloseBtn) DOMElements.$modalCloseBtn.addEventListener('click', hideModal);
    if (DOMElements.$modalOkBtn) DOMElements.$modalOkBtn.addEventListener('click', hideModal);
}
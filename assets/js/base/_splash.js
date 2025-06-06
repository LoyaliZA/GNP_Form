// GNP_Local/assets/js/base/_splash.js
import { CONFIG, DOMElements } from '../config.js';
import { showSection as showFirstSection } from './_formNavigation.js'; // Import for revealing first section
import { actualizarProgreso } from './_sidebar.js'; // Import for initial progress update

function revealMainContent() {
    if(DOMElements.$mainHeader) DOMElements.$mainHeader.style.display = 'flex';
    if(DOMElements.$sidebar) DOMElements.$sidebar.style.display = 'flex'; // Changed from block to flex
    if(DOMElements.$formularioCompleto) DOMElements.$formularioCompleto.style.display = 'block';

    if (DOMElements.$seccionesNavegables.length > 0) {
       showFirstSection(0); // Use imported showSection
       actualizarProgreso(); // Use imported actualizarProgreso
    }
}

export function initializeSplash() {
    if (DOMElements.$splashScreen) {
        DOMElements.$splashScreen.style.opacity = '1';
        DOMElements.$splashScreen.style.pointerEvents = 'auto';
        setTimeout(() => {
            DOMElements.$splashScreen.style.opacity = '0';
            DOMElements.$splashScreen.style.pointerEvents = 'none';
            setTimeout(() => {
                if (DOMElements.$splashScreen) DOMElements.$splashScreen.style.display = 'none';
                revealMainContent();
            }, CONFIG.SPLASH_FADE_DURATION);
        }, CONFIG.SPLASH_DISPLAY_DURATION);
    } else {
        revealMainContent(); // Directly reveal if no splash screen
    }
}
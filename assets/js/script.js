/**
 * Script para Formulario de Solicitud GNP
 * Maneja navegación, temas (archivo y modo), sidebar, progreso y envío.
 * VERSIÓN: Lógica condicional mejorada para Hábitos y validación onblur.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- Configuración ---
    const CONFIG = {
        FADE_DURATION: 400,
        SPLASH_DISPLAY_DURATION: 1500,
        SPLASH_FADE_DURATION: 500,
        API_ENDPOINT: '/tu-endpoint-real-en-el-servidor', // Reemplazar con el endpoint real
        LOGO_VELER_DARK: 'assets/img/VELER_DARK.png',
        LOGO_VELER_LIGHT: 'assets/img/VELER_LIGHT.png',
        LOGO_GNP_DARK: 'assets/img/GNP_DARK.png',
        LOGO_GNP_LIGHT: 'assets/img/GNP_LIGHT.png',
        THEME_STORAGE_KEY: 'theme_mode',
        MOBILE_BREAKPOINT: 767,
        AVAILABLE_THEMES: [
            { name: "Veler Blue v2", file: "assets/css/theme-veler-blue_2.css" },
            { name: "Veler Blue", file: "assets/css/theme-veler-blue.css" },
            { name: "Teal Green v2", file: "assets/css/theme-teal-green_v2.css" },
            { name: "Teal Green", file: "assets/css/theme-teal-green.css" },
            { name: "Slate Mauve v2", file: "assets/css/theme-slate-mauve_2.css" },
            { name: "Slate Mauve", file: "assets/css/theme-slate-mauve.css" },
            { name: "Pink v2", file: "assets/css/theme-pink_2.css"}, // Corregido nombre si es v2
            { name: "Pink", file: "assets/css/theme-pink.css" },
            { name: "Gold Teal v2", file: "assets/css/theme-gold-teal_2.css" },
            { name: "Gold Teal", file: "assets/css/theme-gold-teal.css" },
            { name: "Gold v2", file: "assets/css/theme-gold_2.css"}, // Corregido nombre si es v2
            { name: "Gold", file: "assets/css/theme-gold.css"},
            { name: "Red Dark v2", file: "assets/css/theme-red-dark_2.css"}, // Corregido nombre si es v2
            { name: "Red Dark", file: "assets/css/theme-red-dark.css"},
            { name: "GNP Default", file: "assets/css/theme-default.css" }
        ],
        DEFAULT_THEME_FILE: "assets/css/theme-veler-blue_2.css",
        SELECTED_THEME_FILE_KEY: 'selected_theme_file',
        THEME_LINK_ID: 'dynamic-theme-style-link'
    };

    // --- Selección de Elementos DOM ---
    const $html = document.documentElement;
    const $body = document.body;
    const $splashScreen = document.getElementById('splash-screen');
    const $mainHeader = document.getElementById('main-header');
    const $formularioCompleto = document.getElementById('formulario-completo');
    const $form = document.getElementById('miFormularioDinamico');
    const $modalOverlay = document.getElementById('modal-overlay');
    const $modalContainer = document.getElementById('modal-container');
    const $modalErrorIcon = document.getElementById('modal-error-icon');
    const $modalSuccessLogo = document.getElementById('modal-success-logo');
    const $modalTitle = document.getElementById('modal-title');
    const $modalMessage = document.getElementById('modal-message');
    const $modalCloseBtn = document.getElementById('modal-close-btn');
    const $modalOkBtn = document.getElementById('modal-ok-btn');
    const $themeSwitch = document.getElementById('theme-checkbox');
    const $themeSelector = document.getElementById('theme-selector');
    const $sidebar = document.getElementById('sidebar-navegacion');
    const $sidebarToggle = $sidebar ? $sidebar.querySelector('.sidebar-toggle') : null;
    const $sidebarMenuItems = $sidebar ? Array.from($sidebar.querySelectorAll('.menu-item')) : [];
    const $progressBarFill = $sidebar ? $sidebar.querySelector('.progress-fill') : null;
    const $progressText = $sidebar ? $sidebar.querySelector('.progress-text') : null;

    const $logoVelerSidebar = document.getElementById('logo-veler-sidebar');
    const $logo1Splash = document.getElementById('logo1-splash');
    const $logo2Splash = document.getElementById('logo2-splash');

    const $allSections = $form ? Array.from($form.querySelectorAll('.seccion-formulario')) : [];
    const $seccionRevision = $allSections.find(sec => sec.id === 'seccion-revision');
    const $seccionesNavegables = $allSections.filter(sec => sec.id !== 'seccion-revision');
    const $allFormFields = $form ? Array.from($form.querySelectorAll('input, select, textarea')) : [];

    // --- Estado de la Aplicación ---
    let state = {
        currentSeccionIndex: 0,
        isSidebarExpanded: true,
        isSidebarVisibleMobile: false,
        lastSubmitButton: null,
        isSubmitting: false,
    };

    // --- Inicialización ---
    function initializeApp() {
        if (!validateEssentialElements()) {
            console.error("Error Crítico: Faltan elementos esenciales del DOM. La aplicación no puede iniciar correctamente.");
            return;
        }
        initThemeSelector();
        initTheme();
        initializeSidebarState();
        initFormNavigation();
        initEventListeners();
        initAppAnimation();
        if ($seccionesNavegables.length > 0) {
            // La lógica de revelación secuencial se iniciará en fadeInSection
            // runSectionSpecificLogic($seccionesNavegables[0].id); // No es necesario aquí si fadeInSection lo maneja
        }
    }

    function validateEssentialElements() {
        // ... (código existente)
        const essential = {
             $form, $formularioCompleto, $sidebar, $sidebarToggle,
             $themeSwitch, $themeSelector,
             $mainHeader
        };
         let allPresent = true;
        for (const key in essential) {
            if (!essential[key]) {
                console.error(`Error Init: Elemento ${key.replace('$', '')} no encontrado.`);
                allPresent = false;
            }
        }
        if ($seccionesNavegables.length === 0 && $form) {
             console.warn("Warning Init: No se encontraron secciones navegables.");
        }
        return allPresent;
    }

    function initThemeSelector() {
        // ... (código existente)
        let themeLink = document.getElementById(CONFIG.THEME_LINK_ID);
        if (!themeLink) {
            themeLink = document.createElement('link');
            themeLink.id = CONFIG.THEME_LINK_ID;
            themeLink.rel = 'stylesheet';
            document.head.appendChild(themeLink);
        }

        if ($themeSelector) {
            CONFIG.AVAILABLE_THEMES.forEach(theme => {
                const option = document.createElement('option');
                option.value = theme.file;
                option.textContent = theme.name;
                $themeSelector.appendChild(option);
            });
        } else {
             console.error("Error Init: Elemento theme-selector no encontrado.");
             return;
        }
        const savedThemeFile = localStorage.getItem(CONFIG.SELECTED_THEME_FILE_KEY) || CONFIG.DEFAULT_THEME_FILE;
        const isValidSavedTheme = CONFIG.AVAILABLE_THEMES.some(theme => theme.file === savedThemeFile);
        const themeFileToLoad = isValidSavedTheme ? savedThemeFile : CONFIG.DEFAULT_THEME_FILE;

        themeLink.href = themeFileToLoad;
        $themeSelector.value = themeFileToLoad;

        if (themeFileToLoad !== savedThemeFile) {
             localStorage.setItem(CONFIG.SELECTED_THEME_FILE_KEY, themeFileToLoad);
        }
    }

    function initTheme() {
        // ... (código existente)
        const savedThemeMode = localStorage.getItem(CONFIG.THEME_STORAGE_KEY) || 'dark';
        applyThemeMode(savedThemeMode);
        if ($themeSwitch) $themeSwitch.checked = (savedThemeMode === 'light');
    }

    function applyThemeMode(themeMode) {
        // ... (código existente)
        const isLightTheme = themeMode === 'light';
        $html.classList.toggle('light-theme', isLightTheme);
        if ($logoVelerSidebar) $logoVelerSidebar.src = isLightTheme ? CONFIG.LOGO_VELER_LIGHT : CONFIG.LOGO_VELER_DARK;
        if ($logo1Splash) $logo1Splash.src = isLightTheme ? CONFIG.LOGO_VELER_LIGHT : CONFIG.LOGO_VELER_DARK;
        if ($logo2Splash) $logo2Splash.src = isLightTheme ? CONFIG.LOGO_GNP_LIGHT : CONFIG.LOGO_GNP_DARK;
        if ($modalSuccessLogo) {
            // $modalSuccessLogo.src = isLightTheme ? 'assets/img/V_icon_light.png' : 'assets/img/V_icon.png';
        }
    }

    function handleThemeSwitchChange() {
        // ... (código existente)
        const currentThemeMode = this.checked ? 'light' : 'dark';
        applyThemeMode(currentThemeMode);
        localStorage.setItem(CONFIG.THEME_STORAGE_KEY, currentThemeMode);
    }

    function handleThemeFileChange() {
        // ... (código existente)
        const selectedFile = this.value;
        const themeLink = document.getElementById(CONFIG.THEME_LINK_ID);
        if (themeLink) {
            themeLink.href = selectedFile;
            localStorage.setItem(CONFIG.SELECTED_THEME_FILE_KEY, selectedFile);
            const currentThemeMode = localStorage.getItem(CONFIG.THEME_STORAGE_KEY) || 'dark';
            applyThemeMode(currentThemeMode);
        }
    }

    function initAppAnimation() {
        // ... (código existente)
        if ($splashScreen) {
            $splashScreen.style.opacity = '1';
            $splashScreen.style.pointerEvents = 'auto';
            setTimeout(() => {
                $splashScreen.style.opacity = '0';
                $splashScreen.style.pointerEvents = 'none';
                setTimeout(() => {
                    if ($splashScreen) $splashScreen.style.display = 'none'; // Chequeo extra
                    revealMainContent();
                }, CONFIG.SPLASH_FADE_DURATION);
            }, CONFIG.SPLASH_DISPLAY_DURATION);
        } else {
            revealMainContent();
        }
    }

    function revealMainContent() {
        // ... (código existente)
         if($mainHeader) $mainHeader.style.display = 'flex';
         if($sidebar) $sidebar.style.display = 'flex';
         if($formularioCompleto) $formularioCompleto.style.display = 'block';
         if ($seccionesNavegables.length > 0) {
            showSection(0);
            actualizarProgreso();
         }
    }

    function initializeSidebarState() {
        // ... (código existente)
        const isMobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
        const savedSidebarState = localStorage.getItem('sidebar_expanded');
        const startExpanded = isMobile ? false : (savedSidebarState !== null ? JSON.parse(savedSidebarState) : state.isSidebarExpanded);
        state.isSidebarExpanded = startExpanded;
        state.isSidebarVisibleMobile = false;
        if (isMobile) {
            $body.classList.remove('body-sidebar-expanded', 'sidebar-visible');
            $body.classList.add('body-sidebar-collapsed');
        } else {
            $body.classList.toggle('body-sidebar-expanded', startExpanded);
            $body.classList.toggle('body-sidebar-collapsed', !startExpanded);
            $body.classList.remove('sidebar-visible');
        }
        updateSidebarToggleButton();
    }

    function toggleSidebar() {
        // ... (código existente)
        const isMobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
        if (isMobile) {
            state.isSidebarVisibleMobile = !state.isSidebarVisibleMobile;
            $body.classList.toggle('sidebar-visible', state.isSidebarVisibleMobile);
            $body.classList.remove('body-sidebar-expanded', 'body-sidebar-collapsed');
        } else {
            state.isSidebarExpanded = !state.isSidebarExpanded;
            $body.classList.toggle('body-sidebar-expanded', state.isSidebarExpanded);
            $body.classList.toggle('body-sidebar-collapsed', !state.isSidebarExpanded);
            $body.classList.remove('sidebar-visible');
            localStorage.setItem('sidebar_expanded', JSON.stringify(state.isSidebarExpanded));
        }
        updateSidebarToggleButton();
    }

    function updateSidebarToggleButton() {
        // ... (código existente)
        if (!$sidebarToggle) return;
        const isMobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
        if (isMobile) {
             $sidebarToggle.textContent = state.isSidebarVisibleMobile ? 'close' : 'menu';
             $sidebarToggle.title = state.isSidebarVisibleMobile ? 'Ocultar menú' : 'Mostrar menú';
        } else {
            $sidebarToggle.textContent = state.isSidebarExpanded ? 'menu_open' : 'menu';
            $sidebarToggle.title = state.isSidebarExpanded ? 'Contraer menú' : 'Expandir menú';
        }
    }

    function handleResize() { initializeSidebarState(); }

    function initFormNavigation() {
        // ... (código existente)
        $sidebarMenuItems.forEach(item => item.addEventListener('click', handleMenuItemClick));
    }

    function isValidSectionIndex(index) { return index >= 0 && index < $seccionesNavegables.length; }

    function showSection(indexToShow) {
        if (!$form || !isValidSectionIndex(indexToShow)) return;
        const $currentActive = $form.querySelector('.seccion-formulario.seccion-activa');
        const $nextSection = $seccionesNavegables[indexToShow];
        if ($currentActive === $nextSection) return;

        // --- NUEVO: Limpiar listeners de revelación secuencial de la sección anterior ---
        if ($currentActive) {
            clearSequentialRevealListeners($currentActive);
        }
        // --- FIN NUEVO ---

        if ($currentActive) {
            fadeOutSection($currentActive, () => fadeInSection($nextSection, indexToShow));
        } else {
            fadeInSection($nextSection, indexToShow);
        }
        state.currentSeccionIndex = indexToShow;
    }

    function fadeOutSection($section, callback) {
        // ... (código existente)
        $section.style.opacity = '0';
        setTimeout(() => {
            $section.classList.remove('seccion-activa');
            $section.style.display = 'none';
            if (callback) callback();
        }, CONFIG.FADE_DURATION);
    }

    function fadeInSection($section, index) {
        if (!$section) return; 
        $section.style.display = 'block'; 
        
        // --- : Inicializar revelación secuencial para la nueva sección ---
        initSequentialReveal($section); 
        // --- FIN  ---

        setTimeout(() => { 
            $section.style.opacity = '1';
            $section.classList.add('seccion-activa');
            updateActiveMenuItem(index);
            window.scrollTo(0, 0);
            runSectionSpecificLogic($section.id); 
        }, 50); 
    }
    
    function runSectionSpecificLogic(sectionId) {
        // Llama a las funciones de lógica condicional para la sección actual
        if (sectionId === 'seccion-habitos') {
            toggleHabitosFields();
        }
        // Añadir más secciones aquí si es necesario
        // if (sectionId === 'seccion-deportes') { toggleDeportesFields(); }
    }

    function updateActiveMenuItem(activeIndex) {
        // ... (código existente)
        const activeSectionId = activeIndex >= 0 && $seccionesNavegables[activeIndex] ? $seccionesNavegables[activeIndex].id : null;
        $sidebarMenuItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-section') === activeSectionId);
        });
    }

    function handleFormButtonClick(event) {
        // ... (código existente)
        const $button = event.target.closest('button');
        if (!$button) return;

        if ($button.classList.contains('btn-siguiente')) {
            if ($button.classList.contains('btn-final')) {
                showReviewMode();
            } else if (state.currentSeccionIndex < $seccionesNavegables.length - 1) {
                showSection(state.currentSeccionIndex + 1);
            }
        } else if ($button.classList.contains('btn-anterior')) {
            if ($button.classList.contains('btn-volver-a-editar')) {
                hideReviewMode();
            } else if (state.currentSeccionIndex > 0) {
                showSection(state.currentSeccionIndex - 1);
            }
        } else if ($button.type === 'submit' && $button.closest('#seccion-revision')) {
            handleSubmitButtonClick($button, event);
        }
    }

    function handleMenuItemClick(event) {
        // ... (código existente)
        if ($formularioCompleto.classList.contains('modo-revision')) return;
        const sectionId = event.currentTarget.getAttribute('data-section');
        const targetIndex = $seccionesNavegables.findIndex(sec => sec.id === sectionId);
        if (targetIndex !== -1) {
            showSection(targetIndex);
            const isMobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
            if (isMobile && $body.classList.contains('sidebar-visible')) {
                toggleSidebar();
            }
        }
    }

    function showReviewMode() {
        // ... (código existente)
        const $currentActive = $form.querySelector('.seccion-formulario.seccion-activa');
        const enterReview = () => {
            $formularioCompleto.classList.add('modo-revision');
            if ($seccionRevision) {
                $seccionRevision.style.display = 'block';
                setTimeout(() => { $seccionRevision.style.opacity = '1'; $seccionRevision.classList.add('seccion-activa'); }, 50);
                generateFinalSummary();
            }
            $seccionesNavegables.forEach(sec => { sec.style.display = 'block'; sec.style.opacity = '1'; sec.classList.remove('seccion-activa'); });
            updateActiveMenuItem(-1);
            window.scrollTo(0, 0);
        };
        if ($currentActive && $currentActive !== $seccionRevision) {
            fadeOutSection($currentActive, enterReview);
        } else { enterReview(); }
    }

    function hideReviewMode() {
        // ... (código existente)
        $formularioCompleto.classList.remove('modo-revision');
        $seccionesNavegables.forEach(sec => { sec.style.opacity = '0'; sec.style.display = 'none'; sec.classList.remove('seccion-activa'); });
        if ($seccionRevision) {
            fadeOutSection($seccionRevision, () => { showSection(state.currentSeccionIndex); actualizarProgreso(); });
        } else { showSection(state.currentSeccionIndex); actualizarProgreso(); }
    }

    function generateFinalSummary() {
        // ... (código existente)
        if (!$seccionRevision) return;
        const $resumenFinal = $seccionRevision.querySelector('#resumen-final');
        if (!$resumenFinal) return;
        $resumenFinal.innerHTML = '';
        const formData = new FormData($form);
        const dataObject = {};
        formData.forEach((value, key) => {
            if (dataObject[key]) {
                if (!Array.isArray(dataObject[key])) dataObject[key] = [dataObject[key]];
                dataObject[key].push(value);
            } else { dataObject[key] = value; }
        });
        const $ul = document.createElement('ul');
        $seccionesNavegables.forEach(section => {
            const sectionId = section.id;
            const sectionTitle = section.querySelector('h2')?.textContent || sectionId.replace('seccion-', '').replace(/_/g, ' ');
            let sectionHasData = false;
            const $sectionUl = document.createElement('ul');
            section.querySelectorAll('.form-group [name]').forEach(input => {
                if (input.offsetParent === null && !input.closest('.seccion-formulario.seccion-activa')) return; // Evitar campos ocultos
                const key = input.name;
                let value = dataObject[key];
                let displayValue = '';
                if (input.type === 'checkbox') {
                    displayValue = dataObject.hasOwnProperty(key) ? 'Sí' : 'No';
                } else if (input.type === 'radio') {
                    const checkedRadio = section.querySelector(`input[name="${key}"]:checked`);
                    displayValue = checkedRadio ? (getLabelText(checkedRadio.parentElement) || checkedRadio.value) : 'No seleccionado';
                } else if (input.tagName === 'SELECT' && input.multiple) {
                     displayValue = value ? (Array.isArray(value) ? value.join(', ') : value) : 'No seleccionado';
                } else if (input.tagName === 'SELECT') {
                    const selectedOption = input.options[input.selectedIndex];
                    displayValue = selectedOption && selectedOption.value ? selectedOption.text : 'No seleccionado';
                } else if (isValidInputValue(value)) {
                    displayValue = value;
                } else if (input.required) {
                    displayValue = '--- PENDIENTE ---';
                } else { return; }
                const labelText = getLabelForInput(input);
                if (labelText) {
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
                $sectionHeaderLi.innerHTML = `<h4>${sectionTitle}</h4>`;
                $sectionHeaderLi.style.borderBottom = 'none'; $sectionHeaderLi.style.marginBottom = '10px';
                $ul.appendChild($sectionHeaderLi); $ul.appendChild($sectionUl);
                const $hr = document.createElement('hr');
                $hr.style.borderColor = 'var(--border)'; $hr.style.opacity = '0.5'; $hr.style.margin = '15px 0';
                $ul.appendChild($hr);
            }
        });
        const lastElement = $ul.lastElementChild;
        if (lastElement && lastElement.tagName === 'HR') $ul.removeChild(lastElement);
        $resumenFinal.appendChild($ul);
    }
    function isValidInputValue(value) { return value !== null && value !== undefined && String(value).trim() !== ''; }

    function getLabelForInput(inputElement) {
        // ... (código existente para obtener el label)
        let label = null;
        if (inputElement.id) label = $form.querySelector(`label[for="${inputElement.id}"]`);
        if (!label) label = inputElement.closest('label');
        if (!label) {
            const formGroup = inputElement.closest('.form-group.question-group');
            if (formGroup) label = formGroup.querySelector('label');
        }
        if (label) {
            const clone = label.cloneNode(true);
            const inputInside = clone.querySelector('input, select, textarea, .required-marker');
            if (inputInside) inputInside.remove();
             // Remover spans de marcadores si están fuera del input pero dentro del label
            clone.querySelectorAll('.required-marker').forEach(marker => marker.remove());
            return clone.textContent.replace(':', '').trim();
        }
        return inputElement.name || 'Campo sin etiqueta';
    }


    function actualizarProgreso() {
        // ... (código existente)
        if (!$progressBarFill || !$progressText || !$form) return;
        let totalCamposNavegables = 0;
        let camposCompletadosNavegables = 0;
        $seccionesNavegables.forEach((section) => {
            let sectionIsComplete = true;
            let sectionHasRequiredFields = false;
            const inputsInSection = section.querySelectorAll('.form-group [name]');
            inputsInSection.forEach(input => {
                if (input.offsetParent !== null && !input.disabled) {
                    totalCamposNavegables++;
                    if (input.checkValidity()) {
                        camposCompletadosNavegables++;
                    } else {
                         if (input.required) sectionIsComplete = false;
                    }
                    if (input.required) sectionHasRequiredFields = true;
                }
            });
            const menuItem = $sidebarMenuItems.find(item => item.getAttribute('data-section') === section.id);
            if (menuItem) {
                 const markAsCompleted = (sectionHasRequiredFields && sectionIsComplete) || (!sectionHasRequiredFields && sectionIsComplete);
                 menuItem.classList.toggle('completed', markAsCompleted);
            }
        });
        const porcentaje = totalCamposNavegables > 0 ? Math.round((camposCompletadosNavegables / totalCamposNavegables) * 100) : 0;
        $progressBarFill.style.width = `${porcentaje}%`;
        $progressText.textContent = `${porcentaje}% completado`;
    }

    function showModal(type, message = '', title = '') {
        // ... (código existente)
        if (!$modalOverlay || !$modalContainer) return;
        $modalMessage.textContent = message;
        $modalTitle.textContent = title || (type === 'error' ? 'Error' : 'Éxito');
        if ($modalErrorIcon) $modalErrorIcon.style.display = (type === 'error') ? 'inline-block' : 'none';
        if ($modalSuccessLogo) $modalSuccessLogo.style.display = (type === 'success') ? 'inline-block' : 'none';
        if ($modalOkBtn) $modalOkBtn.style.display = (type === 'success') ? 'inline-block' : 'inline-block';
        if ($modalCloseBtn) $modalCloseBtn.style.display = 'inline-block';
        $body.classList.add('modal-visible');
    }

    function hideModal() {
        // ... (código existente)
        if (!$body.classList.contains('modal-visible')) return;
        $body.classList.remove('modal-visible');
         if ($modalMessage) $modalMessage.textContent = '';
         if ($modalTitle) $modalTitle.textContent = '';
         if (state.lastSubmitButton && state.isSubmitting) {
             state.lastSubmitButton.disabled = false;
             state.lastSubmitButton.textContent = 'Enviar Formulario';
             state.isSubmitting = false;
             state.lastSubmitButton = null;
         }
    }

    function handleSubmitButtonClick($button, event) {
        // ... (código existente)
        event.preventDefault();
        if (state.isSubmitting) return;
        if (!$form.checkValidity()) {
             showModal('error', 'Por favor, revisa los campos marcados o incompletos antes de enviar.', 'Formulario Incompleto');
             $form.reportValidity();
             return;
        }
        state.isSubmitting = true;
        state.lastSubmitButton = $button;
        $button.disabled = true;
        $button.textContent = 'Enviando...';
        const formData = new FormData($form);
        const dataObject = {};
        formData.forEach((value, key) => { dataObject[key] = value; });
        sendFormData(dataObject);
    }

    async function sendFormData(data) {
        // ... (código existente)
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
            const result = await response.json();
            showModal('success', 'Tu solicitud ha sido enviada exitosamente.', 'Envío Exitoso');
        } catch (error) {
            showModal('error', `No se pudo enviar la solicitud. ${error.message}`, 'Error de Envío');
        } finally {
             if (state.lastSubmitButton && state.isSubmitting) {
                 state.lastSubmitButton.disabled = false;
                 state.lastSubmitButton.textContent = 'Enviar Formulario';
                 state.isSubmitting = false;
             }
        }
    }

    // --- Lógica Condicional de Campos ---
    function toggleFieldVisibility(fieldId, show, dependentFieldIdToClear = null) {
        const fieldElement = document.getElementById(fieldId);
        const formGroup = fieldElement ? fieldElement.closest('.form-group.question-group') : null;
        if (formGroup) {
            formGroup.style.display = show ? 'flex' : 'none'; // 'flex' porque .form-group es flex
            if (!show && dependentFieldIdToClear) {
                const dependentField = document.getElementById(dependentFieldIdToClear);
                if (dependentField) {
                    if (dependentField.type === 'checkbox' || dependentField.type === 'radio') {
                        dependentField.checked = false;
                    } else {
                        dependentField.value = '';
                    }
                    // Disparar evento change para que otras lógicas (como validación o progreso) se actualicen
                    dependentField.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }
    }

    // --- INICIO: Lógica Condicional Sección Hábitos ---
    // (Este bloque de código es el que ya tenías y funcionaba)
    function toggleHabitosFields() {
        if (!$form) return;

        const fumaRadio = $form.querySelector('input[name="hab_fuma"]:checked');
        const consumeAlcoholRadio = $form.querySelector('input[name="hab_consume_alcohol"]:checked');
        const consumeDrogasRadio = $form.querySelector('input[name="hab_consume_drogas"]:checked');
        const generoSelect = document.getElementById('sol_genero');
        const embarazadaRadio = $form.querySelector('input[name="hab_embarazada"]:checked');

        if (fumaRadio) {
            toggleFieldVisibility('hab_cigarrillos_dia', fumaRadio.value === 'si', 'hab_cigarrillos_dia');
            toggleFieldVisibility('hab_cuando_dejo_fumar', fumaRadio.value === 'no', 'hab_cuando_dejo_fumar');
        } else { 
            toggleFieldVisibility('hab_cigarrillos_dia', false, 'hab_cigarrillos_dia');
            toggleFieldVisibility('hab_cuando_dejo_fumar', false, 'hab_cuando_dejo_fumar');
        }

        if (consumeAlcoholRadio) {
            toggleFieldVisibility('hab_frecuencia_alcohol', consumeAlcoholRadio.value === 'si', 'hab_frecuencia_alcohol');
        } else {
            toggleFieldVisibility('hab_frecuencia_alcohol', false, 'hab_frecuencia_alcohol');
        }

        if (consumeDrogasRadio) {
            toggleFieldVisibility('hab_tipo_droga_frecuencia', consumeDrogasRadio.value === 'si', 'hab_tipo_droga_frecuencia');
        } else {
            toggleFieldVisibility('hab_tipo_droga_frecuencia', false, 'hab_tipo_droga_frecuencia');
        }
        
        const preguntaEmbarazoFormGroup = document.getElementById('pregunta-embarazo'); 
        const semanasEmbarazoInput = document.getElementById('hab_semanas_embarazo');

        if (generoSelect && preguntaEmbarazoFormGroup && semanasEmbarazoInput) {
            const esFemenino = generoSelect.value === 'F';
            toggleFieldVisibility('pregunta-embarazo', esFemenino, null, true); 

            if (esFemenino) {
                const radiosEmbarazo = preguntaEmbarazoFormGroup.querySelectorAll('input[name="hab_embarazada"]');
                if (radiosEmbarazo) radiosEmbarazo.forEach(r => r.disabled = false);
                
                if (embarazadaRadio) { 
                    toggleFieldVisibility('hab_semanas_embarazo', embarazadaRadio.value === 'si', 'hab_semanas_embarazo');
                } else { 
                    toggleFieldVisibility('hab_semanas_embarazo', false, 'hab_semanas_embarazo');
                }
            } else { 
                toggleFieldVisibility('hab_semanas_embarazo', false, 'hab_semanas_embarazo');
                const naRadio = preguntaEmbarazoFormGroup.querySelector('input[name="hab_embarazada"][value="na"]');
                if (naRadio) naRadio.checked = true; 
                const otrosRadiosEmbarazo = preguntaEmbarazoFormGroup.querySelectorAll('input[name="hab_embarazada"]:not([value="na"])');
                if (otrosRadiosEmbarazo) otrosRadiosEmbarazo.forEach(r => {
                    r.checked = false;
                    r.disabled = true;
                });
            }
        }
        actualizarProgreso(); 
    }
    // --- FIN: Lógica Condicional Sección Hábitos ---


    // --- : INICIO Lógica Condicional Sección Deportes ---
    function toggleDeportesFields() {
        if (!$form) return; // Asegurar que el formulario existe
        const tipoPracticaSelect = document.getElementById('dep_tipo_practica');
        const otrosDeportesCheckbox = $form.querySelector('input[name="dep_otros_riesgos"]'); // Asumiendo que solo hay uno con este nombre

        // Lógica para "Nombre del Deporte" y "Frecuencia"
        if (tipoPracticaSelect) {
            const showNombreYFrecuencia = tipoPracticaSelect.value === 'Profesional' || tipoPracticaSelect.value === 'Amateur';
            toggleFieldVisibility('dep_nombre_deporte', showNombreYFrecuencia, 'dep_nombre_deporte');
            toggleFieldVisibility('dep_frecuencia_deporte', showNombreYFrecuencia, 'dep_frecuencia_deporte');
        } else { // Si no se encuentra el select, ocultar los campos dependientes por seguridad
            toggleFieldVisibility('dep_nombre_deporte', false, 'dep_nombre_deporte');
            toggleFieldVisibility('dep_frecuencia_deporte', false, 'dep_frecuencia_deporte');
        }

        // Lógica para "Describe otros"
        if (otrosDeportesCheckbox) {
            toggleFieldVisibility('dep_descripcion_otros', otrosDeportesCheckbox.checked, 'dep_descripcion_otros');
        } else { // Si no se encuentra el checkbox, ocultar el campo dependiente
            toggleFieldVisibility('dep_descripcion_otros', false, 'dep_descripcion_otros');
        }
        actualizarProgreso(); // Actualizar progreso después de cambiar visibilidad
    }
    // --- : FIN Lógica Condicional Sección Deportes ---

     // --- INICIO Lógica para Revelación Secuencial de Campos ---
    function initSequentialReveal(sectionElement) {
        if (!sectionElement) return;

        // --- MODIFICADO: Se elimina la condición if (sectionElement.id !== 'seccion-solicitantes') ---
        // Ahora la lógica se aplicará a todas las secciones que tengan la estructura esperada.

        console.log(`DEBUG: initSequentialReveal para ${sectionElement.id}`);
        const formColumnsContainer = sectionElement.querySelector('.form-columns-container');
        
        // Si no hay un .form-columns-container, buscar .form-group directamente en la sección
        // Esto es para secciones que no usan el layout de columnas pero sí tienen form-groups directos.
        const fieldGroupsSource = formColumnsContainer || sectionElement;
        
        // Asegurarse de que solo tomamos hijos directos que sean form-group.question-group
        const fieldGroups = Array.from(fieldGroupsSource.children).filter(el => el.classList.contains('form-group') && el.classList.contains('question-group'));
        
        if (fieldGroups.length === 0) {
            // Si no hay fieldGroups directos (ej. en secciones como padecimientos_detalle que tienen un div intermedio),
            // hacer todos los .form-group.question-group visibles por defecto dentro de la sección.
            // Esto evita que campos en estructuras más complejas queden ocultos.
            const allInternalGroups = sectionElement.querySelectorAll('.form-group.question-group');
            allInternalGroups.forEach(group => group.classList.add('field-visible'));
            console.log(`DEBUG: No se encontraron fieldGroups directos en ${sectionElement.id}, mostrando todos los internos.`);
            return;
        }
        
        fieldGroups.forEach((group, index) => {
            if (index === 0) {
                group.classList.add('field-visible');
                addRevealListenerToGroup(group, fieldGroups, index);
            } else {
                group.classList.remove('field-visible');
                const inputElement = group.querySelector('input, select, textarea');
                if (inputElement) {
                    inputElement.removeEventListener('change', handleFieldRevealInteraction);
                    inputElement.removeEventListener('blur', handleFieldRevealInteraction);
                    inputElement.removeEventListener('input', handleFieldRevealInteractionDebounced);
                }
            }
        });
    }

    function addRevealListenerToGroup(groupElement, allGroups, currentIndex) {
        if (!groupElement) return;
        const inputElement = groupElement.querySelector('input:not([type="radio"]):not([type="checkbox"]), select, textarea');
        const radioGroup = groupElement.querySelector('.radio-group');
        const checkboxElements = groupElement.querySelectorAll('input[type="checkbox"]');

        if (inputElement) { 
            const eventType = inputElement.tagName === 'SELECT' ? 'change' : 'blur';
            inputElement.removeEventListener(eventType, handleFieldRevealInteraction);
            inputElement.addEventListener(eventType, handleFieldRevealInteraction);
            if (inputElement.type === 'text' || inputElement.type === 'email' || inputElement.type === 'number' || inputElement.type === 'date' || inputElement.tagName === 'TEXTAREA') {
                inputElement.removeEventListener('input', handleFieldRevealInteractionDebounced);
                inputElement.addEventListener('input', handleFieldRevealInteractionDebounced);
            }
        } else if (radioGroup) { 
            const radios = groupElement.querySelectorAll('input[type="radio"]');
            radios.forEach(radio => {
                radio.removeEventListener('change', handleFieldRevealInteraction);
                radio.addEventListener('change', handleFieldRevealInteraction);
            });
        } else if (checkboxElements.length > 0) { 
             checkboxElements.forEach(checkbox => {
                checkbox.removeEventListener('change', handleFieldRevealInteraction);
                checkbox.addEventListener('change', handleFieldRevealInteraction);
             });
        }
    }
    
    let revealDebounceTimer;
    function handleFieldRevealInteractionDebounced(event) {
        clearTimeout(revealDebounceTimer);
        revealDebounceTimer = setTimeout(() => {
            handleFieldRevealInteraction(event);
        }, 750); 
    }

    function handleFieldRevealInteraction(event) {
        const currentField = event.target;
        const currentGroup = currentField.closest('.form-group.question-group');
        if (!currentGroup) return;

        let canRevealNext = true;
        if (currentField.required && currentField.value.trim() === "" && currentField.type !== "checkbox" && currentField.type !== "radio") {
            canRevealNext = false;
        }
        if (currentField.tagName === 'SELECT' && currentField.required && currentField.value === "") {
            canRevealNext = false;
        }

        if (canRevealNext || event.type === 'change') { 
            const sectionElement = currentGroup.closest('.seccion-formulario');
            if (!sectionElement) return;
            
            const formColumnsContainer = sectionElement.querySelector('.form-columns-container');
            const fieldGroupsSource = formColumnsContainer || sectionElement;
            const fieldGroups = Array.from(fieldGroupsSource.children).filter(el => el.classList.contains('form-group') && el.classList.contains('question-group'));
            const currentIndex = fieldGroups.indexOf(currentGroup);

            if (currentIndex !== -1 && currentIndex < fieldGroups.length - 1) {
                const nextGroup = fieldGroups[currentIndex + 1];
                if (nextGroup && !nextGroup.classList.contains('field-visible')) {
                    nextGroup.classList.add('field-visible');
                    addRevealListenerToGroup(nextGroup, fieldGroups, currentIndex + 1);
                }
            }
        }
    }

    function clearSequentialRevealListeners(sectionElement) {
        if (!sectionElement) return;
        const fieldGroups = sectionElement.querySelectorAll('.form-columns-container > .form-group.question-group, .seccion-formulario > .form-group.question-group');
        fieldGroups.forEach(group => {
            const inputElement = group.querySelector('input:not([type="radio"]):not([type="checkbox"]), select, textarea');
            const radios = group.querySelectorAll('input[type="radio"]');
            const checkboxes = group.querySelectorAll('input[type="checkbox"]');

            if (inputElement) {
                inputElement.removeEventListener('change', handleFieldRevealInteraction);
                inputElement.removeEventListener('blur', handleFieldRevealInteraction);
                inputElement.removeEventListener('input', handleFieldRevealInteractionDebounced);
            }
            radios.forEach(radio => radio.removeEventListener('change', handleFieldRevealInteraction));
            checkboxes.forEach(checkbox => checkbox.removeEventListener('change', handleFieldRevealInteraction));
        });
    }
    // --- FIN Lógica para Revelación Secuencial de Campos ---

     // --- NUEVO: INICIO Lógica para Tooltips de Ayuda ---
    function initTooltipListeners() {
        if (!$form) return;
        const helpIcons = $form.querySelectorAll('.help-icon');

        helpIcons.forEach(icon => {
            const tooltipId = icon.dataset.tooltipTarget;
            const tooltipContent = document.getElementById(tooltipId);

            if (!tooltipContent) {
                console.warn(`Tooltip content not found for target: ${tooltipId}`);
                return;
            }

            // Mostrar con mouseenter/focus, ocultar con mouseleave/blur
            icon.addEventListener('mouseenter', () => showTooltip(tooltipContent));
            icon.addEventListener('focus', () => showTooltip(tooltipContent)); // Para accesibilidad con teclado
            
            icon.addEventListener('mouseleave', () => hideTooltip(tooltipContent));
            icon.addEventListener('blur', () => hideTooltip(tooltipContent)); // Para accesibilidad con teclado

            // Opcional: cerrar tooltip al hacer clic fuera
            // document.addEventListener('click', (event) => {
            //     if (!tooltipContent.contains(event.target) && !icon.contains(event.target) && tooltipContent.classList.contains('tooltip-visible')) {
            //         hideTooltip(tooltipContent);
            //     }
            // });
        });
    }

    function showTooltip(tooltipElement) {
        if (!tooltipElement) return;
        // Calcular posición para evitar desbordamiento (simplificado, podría necesitar Popper.js para casos complejos)
        // Por ahora, el CSS maneja el posicionamiento básico.
        tooltipElement.classList.add('tooltip-visible');
    }

    function hideTooltip(tooltipElement) {
        if (!tooltipElement) return;
        tooltipElement.classList.remove('tooltip-visible');
    }
    // --- NUEVO: FIN Lógica para Tooltips de Ayuda ---


    function initConditionalLogicHandlers() {
        // Contratante
        const radioContratanteIgual = $form.querySelectorAll('input[name="con_igual_titular"]');
        const datosContratanteDiferente = document.getElementById('datos-contratante-diferente');
        const toggleContratante = () => {
            if (!datosContratanteDiferente) return;
            const sel = $form.querySelector('input[name="con_igual_titular"]:checked');
            datosContratanteDiferente.style.display = (sel?.value === 'no') ? 'block' : 'none';
            actualizarProgreso();
        };
        if (radioContratanteIgual?.length > 0) {
            radioContratanteIgual.forEach(radio => radio.addEventListener('change', toggleContratante));
            toggleContratante(); // Llamada inicial
        }

        // Tarjetahabiente
        const $checkTitularIgual = document.getElementById('pago_titular_igual_contratante');
        const $datosTarjetaHabienteDiferente = document.getElementById('datos-tarjetahabiente-diferente');
        const toggleTarjeta = () => {
            if (!$checkTitularIgual || !$datosTarjetaHabienteDiferente) return;
            $datosTarjetaHabienteDiferente.style.display = $checkTitularIgual.checked ? 'none' : 'block';
            actualizarProgreso();
        };
        if ($checkTitularIgual) {
            $checkTitularIgual.addEventListener('change', toggleTarjeta);
            toggleTarjeta(); // Llamada inicial
        }

        // --- Listeners para sección Hábitos ---
        $form.querySelectorAll('input[name="hab_fuma"], input[name="hab_consume_alcohol"], input[name="hab_consume_drogas"], input[name="hab_embarazada"]')
             .forEach(radio => radio.addEventListener('change', toggleHabitosFields));
        const generoSelect = document.getElementById('sol_genero');
        if (generoSelect) generoSelect.addEventListener('change', toggleHabitosFields);
        
        // Llamada inicial para la lógica de hábitos al cargar la página (si la sección está visible)
        // Esto se manejará mejor con runSectionSpecificLogic al mostrar la sección.
        // toggleHabitosFields();
        // --- NUEVO: INICIO Listeners para Lógica Condicional Sección Deportes ---
        const tipoPracticaSelect = document.getElementById('dep_tipo_practica');
        if (tipoPracticaSelect) {
            tipoPracticaSelect.addEventListener('change', toggleDeportesFields);
        }
        const otrosDeportesCheckbox = $form.querySelector('input[name="dep_otros_riesgos"]');
        if (otrosDeportesCheckbox) {
            otrosDeportesCheckbox.addEventListener('change', toggleDeportesFields);
        }
        // --- NUEVO: FIN Listeners para Lógica Condicional Sección Deportes ---
    }


    // --- Validación de Campos (onblur) ---
    function initFieldValidationListeners() {
        const allFieldsToValidate = $form.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), select, textarea');
        allFieldsToValidate.forEach(field => {
            field.addEventListener('blur', handleFieldValidation);
            // Opcional: field.addEventListener('input', handleFieldValidation);
        });
    }

    function handleFieldValidation(event) {
        const field = event.target;
        // Solo aplicar .is-invalid si el campo ha sido tocado o tiene valor (para no marcar todo en rojo al inicio)
        // O si es requerido y está vacío
        if (field.value.trim() !== "" || field.required) {
            if (field.checkValidity()) {
                field.classList.remove('is-invalid');
            } else {
                field.classList.add('is-invalid');
            }
        } else { // Si no es requerido y está vacío, no lo marcamos como inválido al perder foco
             field.classList.remove('is-invalid');
        }
    }

    function initEventListeners() {
        if ($themeSwitch) $themeSwitch.addEventListener('change', handleThemeSwitchChange);
        if ($themeSelector) $themeSelector.addEventListener('change', handleThemeFileChange);
        if ($sidebarToggle) $sidebarToggle.addEventListener('click', toggleSidebar);
        window.addEventListener('resize', handleResize);
        if ($form) $form.addEventListener('click', handleFormButtonClick);
        if ($modalOverlay) $modalOverlay.addEventListener('click', hideModal);
        if ($modalCloseBtn) $modalCloseBtn.addEventListener('click', hideModal);
        if ($modalOkBtn) $modalOkBtn.addEventListener('click', hideModal);

        $allFormFields.forEach(field => {
            field.addEventListener('input', actualizarProgreso);
            field.addEventListener('change', actualizarProgreso);
        });

        initFieldValidationListeners(); // Añadido para validación onblur
        initConditionalLogicHandlers(); // Añadido para manejar lógica condicional
        // --- NUEVO: Llamada para inicializar listeners de tooltips ---
        initTooltipListeners();
        // --- FIN NUEVO ---
    }

    initializeApp();
});

/**
 * Script para Formulario de Solicitud GNP
 * Maneja navegación, temas (archivo y modo), sidebar, progreso y envío.
 * VERSIÓN: Selector de Temas Integrado
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- Configuración ---
    const CONFIG = {
        FADE_DURATION: 400,
        SPLASH_DISPLAY_DURATION: 1500,
        SPLASH_FADE_DURATION: 500,
        API_ENDPOINT: '/tu-endpoint-real-en-el-servidor', // Reemplazar con el endpoint real
        // Rutas a logos
        LOGO_VELER_DARK: 'assets/img/VELER_DARK.png',
        LOGO_VELER_LIGHT: 'assets/img/VELER_LIGHT.png',
        LOGO_GNP_DARK: 'assets/img/GNP_DARK.png',
        LOGO_GNP_LIGHT: 'assets/img/GNP_LIGHT.png',
        THEME_STORAGE_KEY: 'theme_mode', // Clave para guardar modo claro/oscuro
        MOBILE_BREAKPOINT: 767,

        // --- Configuración del Selector de Temas ---
        AVAILABLE_THEMES: [
            { name: "Veler Blue v2", file: "assets/css/theme-veler-blue_2.css" },
            { name: "Veler Blue", file: "assets/css/theme-veler-blue.css" },
            { name: "Teal Green v2", file: "assets/css/theme-teal-green_v2.css" },
            { name: "Teal Green", file: "assets/css/theme-teal-green.css" },
            { name: "Slate Mauve v2", file: "assets/css/theme-slate-mauve_2.css" },
            { name: "Slate Mauve", file: "assets/css/theme-slate-mauve.css" },
            { name: "Pink", file: "assets/css/theme-pink.css" },
            { name: "Gold Teal v2", file: "assets/css/theme-gold-teal_2.css" },
            { name: "Gold Teal", file: "assets/css/theme-gold-teal.css" },
            { name: "GNP Default", file: "assets/css/theme-default.css" }
            // Añade más temas aquí si los creas
        ],
        DEFAULT_THEME_FILE: "assets/css/theme-veler-blue_2.css", // Tema por defecto si no hay nada guardado
        SELECTED_THEME_FILE_KEY: 'selected_theme_file', // Clave para guardar el archivo de tema
        THEME_LINK_ID: 'dynamic-theme-style-link' // ID para el <link> dinámico
        // --- FIN Configuración Selector ---
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
    const $themeSelector = document.getElementById('theme-selector'); // Selector de tema
    const $sidebar = document.getElementById('sidebar-navegacion');
    const $sidebarToggle = $sidebar ? $sidebar.querySelector('.sidebar-toggle') : null;
    const $sidebarMenuItems = $sidebar ? Array.from($sidebar.querySelectorAll('.menu-item')) : [];
    const $progressBarFill = $sidebar ? $sidebar.querySelector('.progress-fill') : null;
    const $progressText = $sidebar ? $sidebar.querySelector('.progress-text') : null;

    // Logos
    const $logoVelerSidebar = document.getElementById('logo-veler-sidebar');
    const $logo1Splash = document.getElementById('logo1-splash');
    const $logo2Splash = document.getElementById('logo2-splash');

    // Secciones
    const $allSections = $form ? Array.from($form.querySelectorAll('.seccion-formulario')) : [];
    const $seccionRevision = $allSections.find(sec => sec.id === 'seccion-revision');
    const $seccionesNavegables = $allSections.filter(sec => sec.id !== 'seccion-revision');
    const $allFormFields = $form ? Array.from($form.querySelectorAll('input, select, textarea')) : [];

    // --- Estado de la Aplicación ---
    let state = {
        currentSeccionIndex: 0,
        isSidebarExpanded: true, // Estado inicial del sidebar en desktop
        isSidebarVisibleMobile: false,
        lastSubmitButton: null,
        isSubmitting: false,
    };

    // --- Inicialización ---
    function initializeApp() {
        if (!validateEssentialElements()) return;
        initThemeSelector(); // 1. Carga el archivo CSS del tema
        initTheme();         // 2. Aplica modo claro/oscuro
        initializeSidebarState(); // 3. Ajusta el estado inicial del sidebar
        initFormNavigation();
        initEventListeners();
        initFieldValidationListeners();
        initAppAnimation();
    }

    function validateEssentialElements() {
        const essential = {
            $form, $formularioCompleto, $sidebar, $sidebarToggle,
            $themeSwitch, $themeSelector, // Añadido $themeSelector
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

    // --- Inicializar Selector de Temas ---
    function initThemeSelector() {
        // Crear el elemento <link> dinámico si no existe
        let themeLink = document.getElementById(CONFIG.THEME_LINK_ID);
        if (!themeLink) {
            themeLink = document.createElement('link');
            themeLink.id = CONFIG.THEME_LINK_ID;
            themeLink.rel = 'stylesheet';
            document.head.appendChild(themeLink);
        }

        // Poblar el menú desplegable
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

        // Cargar el tema guardado o el predeterminado
        const savedThemeFile = localStorage.getItem(CONFIG.SELECTED_THEME_FILE_KEY) || CONFIG.DEFAULT_THEME_FILE;
        const isValidSavedTheme = CONFIG.AVAILABLE_THEMES.some(theme => theme.file === savedThemeFile);
        const themeFileToLoad = isValidSavedTheme ? savedThemeFile : CONFIG.DEFAULT_THEME_FILE;

        themeLink.href = themeFileToLoad;
        $themeSelector.value = themeFileToLoad;

        if (themeFileToLoad !== savedThemeFile) {
            localStorage.setItem(CONFIG.SELECTED_THEME_FILE_KEY, themeFileToLoad);
        }
        console.log(`Tema CSS inicial cargado: ${themeFileToLoad}`);
    }

    // --- Manejo de Tema (Claro/Oscuro) ---
    function initTheme() {
        const savedThemeMode = localStorage.getItem(CONFIG.THEME_STORAGE_KEY) || 'dark';
        applyThemeMode(savedThemeMode); // Aplica la clase light/dark
        if ($themeSwitch) $themeSwitch.checked = (savedThemeMode === 'light');
    }

    function applyThemeMode(themeMode) {
        const isLightTheme = themeMode === 'light';
        $html.classList.toggle('light-theme', isLightTheme);

        // Actualiza logos que dependen del modo claro/oscuro
        if ($logoVelerSidebar) {
            $logoVelerSidebar.src = isLightTheme ? CONFIG.LOGO_VELER_LIGHT : CONFIG.LOGO_VELER_DARK;
        }
        if ($logo1Splash) { $logo1Splash.src = isLightTheme ? CONFIG.LOGO_VELER_LIGHT : CONFIG.LOGO_VELER_DARK; }
        if ($logo2Splash) { $logo2Splash.src = isLightTheme ? CONFIG.LOGO_GNP_LIGHT : CONFIG.LOGO_GNP_DARK; }
        // El logo de éxito en el modal también podría cambiar si tienes versiones
        if ($modalSuccessLogo) {
            // Asumiendo que tienes un V_icon_light.png y V_icon_dark.png o similar
            // $modalSuccessLogo.src = isLightTheme ? 'assets/img/V_icon_light.png' : 'assets/img/V_icon.png';
        }
    }

    // Handler para el interruptor claro/oscuro
    function handleThemeSwitchChange() {
        const currentThemeMode = this.checked ? 'light' : 'dark';
        applyThemeMode(currentThemeMode);
        localStorage.setItem(CONFIG.THEME_STORAGE_KEY, currentThemeMode);
    }

    // --- Handler para el selector de archivo de tema ---
    function handleThemeFileChange() {
        const selectedFile = this.value;
        const themeLink = document.getElementById(CONFIG.THEME_LINK_ID);
        if (themeLink) {
            themeLink.href = selectedFile; // Cambia el archivo CSS
            localStorage.setItem(CONFIG.SELECTED_THEME_FILE_KEY, selectedFile); // Guarda la preferencia
            console.log(`Cambiado a tema CSS: ${selectedFile}`);

            // Forzar la reaplicación del modo claro/oscuro actual
            // para actualizar elementos dependientes (logos, etc.)
            const currentThemeMode = localStorage.getItem(CONFIG.THEME_STORAGE_KEY) || 'dark';
            applyThemeMode(currentThemeMode);

        } else {
            console.error("Error: Elemento link del tema no encontrado al intentar cambiar.");
        }
    }

    // --- Animación Inicial ---
    function initAppAnimation() {
        if ($splashScreen) {
            $splashScreen.style.opacity = '1';
            $splashScreen.style.pointerEvents = 'auto';
            setTimeout(() => {
                $splashScreen.style.opacity = '0';
                $splashScreen.style.pointerEvents = 'none';
                setTimeout(() => {
                    $splashScreen.style.display = 'none';
                    revealMainContent();
                }, CONFIG.SPLASH_FADE_DURATION);
            }, CONFIG.SPLASH_DISPLAY_DURATION);
        } else {
            revealMainContent();
        }
    }

    function revealMainContent() {
        if ($mainHeader) $mainHeader.style.display = 'flex';
        if ($sidebar) $sidebar.style.display = 'flex';
        if ($formularioCompleto) $formularioCompleto.style.display = 'block';
        if ($seccionesNavegables.length > 0) {
            showSection(0);
            actualizarProgreso();
        }
    }

    // --- Manejo del Sidebar ---
    function initializeSidebarState() {
        const isMobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
        // Recuperar estado guardado si existe, sino usar default
        const savedSidebarState = localStorage.getItem('sidebar_expanded');
        const startExpanded = isMobile ? false : (savedSidebarState !== null ? JSON.parse(savedSidebarState) : state.isSidebarExpanded);

        state.isSidebarExpanded = startExpanded; // Actualiza estado lógico
        state.isSidebarVisibleMobile = false; // Móvil siempre inicia oculto lógicamente

        if (isMobile) {
            $body.classList.remove('body-sidebar-expanded', 'sidebar-visible');
            $body.classList.add('body-sidebar-collapsed'); // Usa colapsado como base en móvil
        } else {
            $body.classList.toggle('body-sidebar-expanded', startExpanded);
            $body.classList.toggle('body-sidebar-collapsed', !startExpanded);
            $body.classList.remove('sidebar-visible');
        }
        updateSidebarToggleButton();
    }

    function toggleSidebar() {
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
            // Guardar preferencia en desktop
            localStorage.setItem('sidebar_expanded', JSON.stringify(state.isSidebarExpanded));
        }
        updateSidebarToggleButton();
    }

    function updateSidebarToggleButton() {
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

    function handleResize() {
        initializeSidebarState(); // Reajusta estado al cambiar tamaño
    }

    // --- Navegación del Formulario ---
    function initFormNavigation() {
        $sidebarMenuItems.forEach(item => item.addEventListener('click', handleMenuItemClick));
    }

    function isValidSectionIndex(index) {
        return index >= 0 && index < $seccionesNavegables.length;
    }

    function showSection(indexToShow) {
        if (!isValidSectionIndex(indexToShow)) return;
        const $currentActive = $form.querySelector('.seccion-formulario.seccion-activa');
        const $nextSection = $seccionesNavegables[indexToShow];
        if ($currentActive === $nextSection) return; // Ya está visible

        if ($currentActive) {
            fadeOutSection($currentActive, () => fadeInSection($nextSection, indexToShow));
        } else {
            fadeInSection($nextSection, indexToShow); // Primera sección
        }
        state.currentSeccionIndex = indexToShow;
    }

    function fadeOutSection($section, callback) {
        $section.style.opacity = '0';
        setTimeout(() => {
            $section.classList.remove('seccion-activa');
            $section.style.display = 'none';
            if (callback) callback();
        }, CONFIG.FADE_DURATION);
    }

    function fadeInSection($section, index) {
        $section.style.display = 'block';
        // Pequeño delay para asegurar que display:block se aplique antes de la transición
        setTimeout(() => {
            $section.style.opacity = '1';
            $section.classList.add('seccion-activa');
            updateActiveMenuItem(index);
            window.scrollTo(0, 0); // Scroll al inicio de la página
        }, 50);
    }

    function updateActiveMenuItem(activeIndex) {
        const activeSectionId = activeIndex >= 0 ? $seccionesNavegables[activeIndex]?.id : null;
        $sidebarMenuItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-section') === activeSectionId);
        });
    }

    function handleFormButtonClick(event) {
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
        // Prevenir si se está en modo revisión
        if ($formularioCompleto.classList.contains('modo-revision')) {
            console.log("Navegación deshabilitada en modo revisión.");
            return;
        }
        const sectionId = event.currentTarget.getAttribute('data-section');
        const targetIndex = $seccionesNavegables.findIndex(sec => sec.id === sectionId);
        if (targetIndex !== -1) {
            showSection(targetIndex);
            // Ocultar sidebar en móvil después de seleccionar
            const isMobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
            if (isMobile && $body.classList.contains('sidebar-visible')) {
                toggleSidebar();
            }
        } else {
            console.warn(`Warning Nav Sidebar: Sección ID ${sectionId} no encontrada.`);
        }
    }

    // --- Modo Revisión ---
    function showReviewMode() {
        console.log("Entrando a modo revisión...");
        const $currentActive = $form.querySelector('.seccion-formulario.seccion-activa');

        const enterReview = () => {
            $formularioCompleto.classList.add('modo-revision');
            if ($seccionRevision) {
                $seccionRevision.style.display = 'block';
                setTimeout(() => {
                    $seccionRevision.style.opacity = '1';
                    $seccionRevision.classList.add('seccion-activa');
                }, 50);
                generateFinalSummary();
            } else {
                console.error("Error Revisión: #seccion-revision no encontrada.");
            }
            // Mostrar todas las demás secciones para revisión
            $seccionesNavegables.forEach(sec => {
                sec.style.display = 'block';
                sec.style.opacity = '1';
                sec.classList.remove('seccion-activa'); // Quitar activa de la sección anterior
            });
            updateActiveMenuItem(-1); // Ningún item de menú activo
            window.scrollTo(0, 0);
        };

        if ($currentActive && $currentActive !== $seccionRevision) {
            fadeOutSection($currentActive, enterReview);
        } else {
            enterReview(); // Si no había sección activa o ya estaba en revisión (improbable)
        }
    }

    function hideReviewMode() {
        console.log("Saliendo de modo revisión...");
        $formularioCompleto.classList.remove('modo-revision');

        // Ocultar todas las secciones excepto la de revisión que se desvanecerá
        $seccionesNavegables.forEach(sec => {
            sec.style.opacity = '0';
            sec.style.display = 'none';
            sec.classList.remove('seccion-activa');
        });

        if ($seccionRevision) {
            fadeOutSection($seccionRevision, () => {
                // Volver a la última sección navegable activa antes de entrar a revisión
                // Si state.currentSeccionIndex no se modificó, esto funciona.
                showSection(state.currentSeccionIndex);
                actualizarProgreso(); // Recalcular progreso
            });
        } else {
            showSection(state.currentSeccionIndex);
            actualizarProgreso();
        }
    }

    function generateFinalSummary() {
        if (!$seccionRevision) return;
        const $resumenFinal = $seccionRevision.querySelector('#resumen-final');
        if (!$resumenFinal) return;

        $resumenFinal.innerHTML = ''; // Limpiar resumen anterior
        const formData = new FormData($form);
        const dataObject = {};
        formData.forEach((value, key) => {
            // Manejo de checkboxes (múltiples valores con el mismo name)
            if (dataObject[key]) {
                if (!Array.isArray(dataObject[key])) {
                    dataObject[key] = [dataObject[key]];
                }
                dataObject[key].push(value);
            } else {
                // Si es un input de radio o select, o el primer checkbox con ese nombre
                dataObject[key] = value;
            }
        });


        const $ul = document.createElement('ul');

        $seccionesNavegables.forEach(section => {
            const sectionId = section.id;
            const sectionTitle = section.querySelector('h2')?.textContent || sectionId.replace('seccion-', '').replace(/_/g, ' ');
            let sectionHasData = false;
            const $sectionUl = document.createElement('ul');

            section.querySelectorAll('.form-group [name]').forEach(input => {
                // Evitar mostrar campos ocultos (ej. contratante diferente si es igual)
                if (input.offsetParent === null) return;

                const key = input.name;
                const value = dataObject[key];

                // Mejorar manejo de checkboxes: si es array, unir; si es booleano, mostrar Sí/No
                let displayValue = '';
                if (input.type === 'checkbox') {
                    // Para checkboxes individuales que guardan 'true' o no existen si no están marcados
                    displayValue = dataObject.hasOwnProperty(key) ? 'Sí' : 'No';
                    // Ignorar si es 'No' y no es obligatorio mostrarlo explícitamente? Depende del diseño.
                    // if (displayValue === 'No') return;
                } else if (input.type === 'radio') {
                    // Para radios, obtener el label del radio seleccionado
                    const checkedRadio = section.querySelector(`input[name="${key}"]:checked`);
                    displayValue = checkedRadio ? (getLabelText(checkedRadio) || checkedRadio.value) : 'No seleccionado';
                    if (displayValue === 'No seleccionado' && !input.required) return; // No mostrar si no es req. y no se seleccionó
                } else if (isValidInputValue(value)) {
                    displayValue = value;
                } else if (input.required) {
                    displayValue = '--- PENDIENTE ---'; // Marcar campos requeridos vacíos
                } else {
                    return; // No mostrar campos opcionales vacíos
                }

                const labelText = getLabelText($form, key, true); // Obtener texto del label

                if (labelText) {
                    const $li = document.createElement('li');
                    $li.innerHTML = `<strong>${labelText}:</strong> ${displayValue}`;
                    $sectionUl.appendChild($li);
                    sectionHasData = true;
                }
            });

            if (sectionHasData) {
                const $sectionHeaderLi = document.createElement('li');
                $sectionHeaderLi.innerHTML = `<h4>${sectionTitle}</h4>`;
                $sectionHeaderLi.style.borderBottom = 'none'; // Sin borde para el título de sección
                $sectionHeaderLi.style.marginBottom = '10px';
                $ul.appendChild($sectionHeaderLi);
                $ul.appendChild($sectionUl); // Añadir la lista de esa sección
                // Añadir un separador visual entre secciones del resumen
                const $hr = document.createElement('hr');
                $hr.style.borderColor = 'var(--border)';
                $hr.style.opacity = '0.5';
                $hr.style.margin = '15px 0';
                $ul.appendChild($hr);
            }
        });

        // Eliminar el último separador <hr> si existe
        const lastElement = $ul.lastElementChild;
        if (lastElement && lastElement.tagName === 'HR') {
            $ul.removeChild(lastElement);
        }

        $resumenFinal.appendChild($ul);
    }

    function isValidInputValue(value) {
        // Considera 'false' como un valor válido si viene de un checkbox que no se marcó
        // pero queremos mostrarlo explícitamente como 'No'.
        // Modificamos para que solo valores realmente nulos, undefined o strings vacíos se consideren inválidos.
        return value !== null && value !== undefined && String(value).trim() !== '';
    }

    function getLabelText(element, getFullContent = false) {
        let label = null;
        if (element.id) {
            label = $form.querySelector(`label[for="${element.id}"]`);
        }
        // Si no hay 'for', buscar label padre
        if (!label) {
            label = element.closest('label');
        }
        // Si sigue sin haber, buscar label hermano o dentro de form-group
        if (!label) {
            const formGroup = element.closest('.form-group');
            if (formGroup) {
                label = formGroup.querySelector('label');
            }
        }

        if (label) {
            if (getFullContent) {
                // Clonar el label para no afectar el original
                const clone = label.cloneNode(true);
                // Remover el input/select/textarea del clon para obtener solo el texto
                const inputInside = clone.querySelector('input, select, textarea');
                if (inputInside) inputInside.remove();
                // Remover otros elementos si es necesario (ej. íconos)
                // const iconsInside = clone.querySelectorAll('.material-symbols-outlined');
                // iconsInside.forEach(icon => icon.remove());
                return clone.textContent.replace(':', '').trim();
            } else {
                // Devuelve solo el texto principal (puede ser menos preciso)
                return label.textContent.split('\n')[0].replace(':', '').trim();
            }
        }
        // Fallback al name del input si no hay label
        return element.name || 'Campo sin etiqueta';
    }


    // --- Seguimiento de Progreso ---
    function actualizarProgreso() {
        if (!$progressBarFill || !$progressText || !$form) return;

        let totalCamposNavegables = 0;
        let camposCompletadosNavegables = 0;

        // Itera solo sobre las secciones navegables para el progreso
        $seccionesNavegables.forEach((section) => {
            let sectionIsComplete = true;
            let sectionHasRequiredFields = false; // Verifica si la sección tiene campos *requeridos*

            const inputsInSection = section.querySelectorAll('.form-group [name]');

            inputsInSection.forEach(input => {
                // Considerar solo campos visibles y no deshabilitados
                if (input.offsetParent !== null && !input.disabled) {
                    // Contamos todos los campos visibles para el total
                    totalCamposNavegables++;
                    if (input.checkValidity()) {
                        camposCompletadosNavegables++;
                    } else {
                        // Si *algún* campo (requerido o no) es inválido, la sección no está completa
                        // Pero solo marcamos la sección como incompleta si el campo inválido es *requerido*
                        if (input.required) {
                            sectionIsComplete = false;
                        }
                    }
                    // Marcar si la sección tiene al menos un campo requerido
                    if (input.required) {
                        sectionHasRequiredFields = true;
                    }
                }
            });

            const menuItem = $sidebarMenuItems.find(item => item.getAttribute('data-section') === section.id);
            if (menuItem) {
                // La sección se marca como completa SOLO si tiene campos requeridos y todos ellos son válidos
                // O si no tiene campos requeridos y todos los opcionales son válidos (o no tiene campos)
                const markAsCompleted = (sectionHasRequiredFields && sectionIsComplete) || (!sectionHasRequiredFields && sectionIsComplete);
                menuItem.classList.toggle('completed', markAsCompleted);
            }
        });

        // Calcular porcentaje basado en campos válidos sobre el total de campos visibles
        const porcentaje = totalCamposNavegables > 0 ? Math.round((camposCompletadosNavegables / totalCamposNavegables) * 100) : 0;
        $progressBarFill.style.width = `${porcentaje}%`;
        $progressText.textContent = `${porcentaje}% completado`;
    }

    // --- Manejo de Modales ---
    function showModal(type, message = '', title = '') {
        if (!$modalOverlay || !$modalContainer) return;

        // Configurar contenido
        $modalMessage.textContent = message;
        $modalTitle.textContent = title || (type === 'error' ? 'Error' : 'Éxito');
        $modalErrorIcon.style.display = (type === 'error') ? 'inline-block' : 'none';
        $modalSuccessLogo.style.display = (type === 'success') ? 'inline-block' : 'none';

        // Configurar botones (ej. ocultar OK en error si solo se quiere Cerrar)
        $modalOkBtn.style.display = (type === 'success') ? 'inline-block' : 'inline-block'; // Mostrar OK siempre por ahora
        $modalCloseBtn.style.display = 'inline-block'; // Mostrar Cerrar siempre

        // Mostrar modal
        $body.classList.add('modal-visible');
    }

    function hideModal() {
        if (!$body.classList.contains('modal-visible')) return;
        $body.classList.remove('modal-visible');
        // Limpiar contenido si es necesario
        $modalMessage.textContent = '';
        $modalTitle.textContent = '';
        // Restaurar botón de envío si estaba deshabilitado
        if (state.lastSubmitButton && state.isSubmitting) {
            state.lastSubmitButton.disabled = false;
            state.lastSubmitButton.textContent = 'Enviar Formulario';
            state.isSubmitting = false;
            state.lastSubmitButton = null;
        }
    }

    // --- Envío de Formulario ---
    function handleSubmitButtonClick($button, event) {
        event.preventDefault(); // Prevenir envío HTML normal
        if (state.isSubmitting) return; // Evitar doble envío

        // Validar todo el formulario antes de enviar
        if (!$form.checkValidity()) {
            // Si la validación HTML5 falla, mostrar un mensaje general
            // Los navegadores modernos suelen resaltar los campos inválidos
            showModal('error', 'Por favor, revisa los campos marcados en rojo o incompletos antes de enviar.', 'Formulario Incompleto');
            $form.reportValidity(); // Intenta mostrar los mensajes nativos del navegador
            return;
        }

        state.isSubmitting = true;
        state.lastSubmitButton = $button;
        $button.disabled = true;
        $button.textContent = 'Enviando...';

        const formData = new FormData($form);
        // Convertir FormData a un objeto simple si la API lo prefiere
        const dataObject = {};
        formData.forEach((value, key) => { dataObject[key] = value; });

        // console.log('Enviando datos:', JSON.stringify(dataObject, null, 2)); // Para depuración
        sendFormData(dataObject); // O enviar formData directamente si la API lo acepta
    }

    async function sendFormData(data) {
        try {
            const response = await fetch(CONFIG.API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // O 'multipart/form-data' si envías archivos y usas FormData
                    // Añadir otros headers si son necesarios (ej. Autorización)
                },
                body: JSON.stringify(data) // O 'body: data' si envías FormData
            });

            if (!response.ok) {
                // Intentar obtener mensaje de error del cuerpo de la respuesta
                let errorMsg = `Error del servidor: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorData.error || errorMsg;
                } catch (e) { /* No era JSON, usar mensaje status */ }
                throw new Error(errorMsg);
            }

            const result = await response.json(); // Asumiendo que la API responde con JSON

            // Éxito
            console.log('Respuesta API:', result);
            showModal('success', 'Tu solicitud ha sido enviada exitosamente.', 'Envío Exitoso');
            // Opcional: Redirigir o limpiar formulario aquí
            // $form.reset();
            // hideReviewMode();
            // showSection(0);

        } catch (error) {
            console.error('Error al enviar formulario:', error);
            showModal('error', `No se pudo enviar la solicitud. ${error.message}`, 'Error de Envío');
            // El botón se reactivará en hideModal()
        } finally {
            // Asegurarse de resetear el estado de envío incluso si hideModal no se llama
            if (state.lastSubmitButton && state.isSubmitting) {
                state.lastSubmitButton.disabled = false;
                state.lastSubmitButton.textContent = 'Enviar Formulario';
                state.isSubmitting = false;
            }
        }
    }


    // --- Asignación de Event Listeners ---
    function initEventListeners() {
        if ($themeSwitch) $themeSwitch.addEventListener('change', handleThemeSwitchChange);
        if ($themeSelector) $themeSelector.addEventListener('change', handleThemeFileChange); // Listener para selector de tema
        if ($sidebarToggle) $sidebarToggle.addEventListener('click', toggleSidebar);
        window.addEventListener('resize', handleResize);
        if ($form) $form.addEventListener('click', handleFormButtonClick); // Delegación de eventos para botones del form
        if ($modalOverlay) $modalOverlay.addEventListener('click', hideModal);
        if ($modalCloseBtn) $modalCloseBtn.addEventListener('click', hideModal);
        if ($modalOkBtn) $modalOkBtn.addEventListener('click', hideModal); // OK también cierra el modal

        // Listener para actualizar progreso en cada cambio de input/select
        $allFormFields.forEach(field => {
            field.addEventListener('input', actualizarProgreso); // Para texto, etc.
            field.addEventListener('change', actualizarProgreso); // Para selects, checkboxes, radios
        });

        // Mover aquí la lógica de visibilidad condicional si no está inline
        // (ej. contratante, tarjetahabiente, embarazo)
        // Ejemplo Contratante:
        const radioContratanteIgual = $form?.querySelectorAll('input[name="con_igual_titular"]');
        const datosContratanteDiferente = document.getElementById('datos-contratante-diferente');
        if (radioContratanteIgual?.length > 0 && datosContratanteDiferente) {
            const toggleContratante = () => { const sel = $form.querySelector('input[name="con_igual_titular"]:checked'); datosContratanteDiferente.style.display = (sel?.value === 'no') ? 'block' : 'none'; actualizarProgreso(); };
            radioContratanteIgual.forEach(radio => radio.addEventListener('change', toggleContratante));
            // toggleContratante(); // Ya no se llama aquí, se hace inline o al mostrar la sección
        }
        // Ejemplo Tarjetahabiente:
        const $checkTitularIgual = document.getElementById('pago_titular_igual_contratante');
        const $datosTarjetaHabienteDiferente = document.getElementById('datos-tarjetahabiente-diferente');
        if ($checkTitularIgual && $datosTarjetaHabienteDiferente) {
            const toggleTarjeta = () => { $datosTarjetaHabienteDiferente.style.display = $checkTitularIgual.checked ? 'none' : 'block'; actualizarProgreso(); };
            $checkTitularIgual.addEventListener('change', toggleTarjeta);
            // toggleTarjeta(); // Ya no se llama aquí
        }
        // Ejemplo Pregunta Embarazo:
        const $generoSelect = document.getElementById('sol_genero');
        const $preguntaEmbarazoDiv = document.getElementById('pregunta-embarazo');
        if ($generoSelect && $preguntaEmbarazoDiv) {
            const toggleEmbarazo = () => { const esMasculino = $generoSelect.value === 'M'; $preguntaEmbarazoDiv.style.display = esMasculino ? 'none' : 'block'; if (esMasculino) { const naRadio = $preguntaEmbarazoDiv.querySelector('input[name="hab_embarazada"][value="na"]'); if (naRadio) naRadio.checked = true; } actualizarProgreso(); };
            $generoSelect.addEventListener('change', toggleEmbarazo);
            // toggleEmbarazo(); // Ya no se llama aquí
        }
        // Nota: La llamada inicial a estas funciones de toggle
        // es mejor hacerla cuando la sección correspondiente se muestra (en fadeInSection)
        // o mantenerla en el script inline del HTML.


    }

    function initFieldValidationListeners() {
        const allFields = $form.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), select, textarea');
        allFields.forEach(field => {
            field.addEventListener('blur', handleFieldValidation);
            // Opcional: también validar en el evento 'input' para feedback instantáneo mientras escribe
            // field.addEventListener('input', handleFieldValidation);
        });
    }

    function handleFieldValidation(event) {
        const field = event.target;
        if (field.checkValidity()) {
            field.classList.remove('is-invalid');
            // Opcional: añadir clase para válido si se quiere un estilo específico
            // field.classList.add('is-valid');
        } else {
            field.classList.add('is-invalid');
            // Opcional: quitar clase de válido si se usa
            // field.classList.remove('is-valid');
        }
        // No queremos que el progreso se actualice en cada 'blur' si no es un cambio real de validez,
        // la función actualizarProgreso() ya se llama en 'input' y 'change'.
        // Si se decide validar en 'input', entonces sí podría tener sentido llamar a actualizarProgreso() aquí.
    }

    // --- Iniciar la aplicación ---
    initializeApp();

}); // Fin DOMContentLoaded
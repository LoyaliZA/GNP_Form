document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURACIÓN CENTRALIZADA (ACTUALIZADA CON 11 SECCIONES) ---
    const config = {
        menuItems: [
            { id: 'solicitante', icon: 'person', text: 'Solicitantes' },
            { id: 'domicilio', icon: 'home', text: 'Domicilio' },
            { id: 'contratante-asegurado', icon: 'how_to_reg', text: 'Contratante' },
            { id: 'actividades-riesgo', icon: 'warning', text: 'Actividades de Riesgo' },
            { id: 'habitos', icon: 'health_and_safety', text: 'Hábitos' },
            { id: 'deportes', icon: 'sports_soccer', text: 'Deportes' },
            { id: 'info-medica', icon: 'medical_services', text: 'Información Médica' },
            { id: 'detalles-solicitud', icon: 'description', text: 'Detalles de la Solicitud' },
            { id: 'forma-pago', icon: 'payment', text: 'Forma de Pago' },
            { id: 'declaraciones', icon: 'gavel', text: 'Declaraciones' },
            { id: 'revision', icon: 'preview', text: 'Revisión Final' }
        ],
        availableThemes: [
            { name: "Veler Blue v2", file: "assets/css/theme-veler-blue_2.css" },
            { name: "Veler Blue", file: "assets/css/theme-veler-blue.css" },
            { name: "Teal Green v2", file: "assets/css/theme-teal-green_v2.css" },
            { name: "Teal Green", file: "assets/css/theme-teal-green.css" },
            { name: "Slate Mauve v2", file: "assets/css/theme-slate-mauve_2.css" },
            { name: "Slate Mauve", file: "assets/css/theme-slate-mauve.css" },
            { name: "Pink v2", file: "assets/css/theme-pink_2.css"},
            { name: "Pink", file: "assets/css/theme-pink.css" },
            { name: "Gold Teal v2", file: "assets/css/theme-gold-teal_2.css" },
            { name: "Gold Teal", file: "assets/css/theme-gold-teal.css" },
            { name: "Gold v2", file: "assets/css/theme-gold_2.css"},
            { name: "Gold", file: "assets/css/theme-gold.css"},
            { name: "Red Dark v2", file: "assets/css/theme-red-dark_2.css"},
            { name: "Red Dark", file: "assets/css/theme-red-dark.css"},
            { name: "GNP Default", file: "assets/css/theme-default.css" }
        ],
        domSelectors: {
            sidebar: '#sidebar-navegacion',
            header: '#main-header',
            form: '#formulario-completo',
            sections: '.seccion-formulario',
            menuItems: '.sidebar-menu .menu-item',
            nextBtn: '#next-btn',
            prevBtn: '#prev-btn',
            submitBtn: '#submit-btn',
            editBtn: '#edit-btn',
            dynamicThemeLink: '#dynamic-theme-style-link'
        },
        storageKeys: {
            themeMode: 'theme_mode',
            themeFile: 'selected_theme_file',
            sidebarCollapsed: 'sidebar_collapsed'
        }
    };

    // --- 2. ESTADO DE LA APLICACIÓN (SIN CAMBIOS) ---
    let state = {
        currentSectionIndex: 0,
        isLightMode: false,
        formSections: [],
        menuItems: []
    };

    // --- PARA LO DE SOLICITANTES EXTRA ---
    let solicitanteCount = 1;
    const MAX_SOLICITANTES = 10;

    // Objeto con las plantillas para los campos de detalle de actividades de riesgo
    const detalleActividadesPlantillas = {
        motocicleta: (sufijo) => `
            <div class="detalle-actividad-solicitante">
                <h5>Detalles para Solicitante ${sufijo.split('_').pop()}</h5>
                <div class="form-group">
                    <label for="moto_uso${sufijo}">Tipo de Uso</label>
                    <input type="text" id="moto_uso${sufijo}" name="moto_uso${sufijo}" class="form-control" placeholder="Transporte, Recreativo">
                </div>
                <div class="form-group">
                    <label for="moto_cc${sufijo}">Cilindrada (cc)</label>
                    <input type="text" id="moto_cc${sufijo}" name="moto_cc${sufijo}" class="form-control" placeholder="Ej: 250">
                </div>
            </div>
        `,
        aviones: (sufijo) => `
            <div class="detalle-actividad-solicitante">
                <h5>Detalles para Solicitante ${sufijo.split('_').pop()}</h5>
                <div class="form-group">
                    <label for="avion_rol${sufijo}">Rol en Vuelo</label>
                    <input type="text" id="avion_rol${sufijo}" name="avion_rol${sufijo}" class="form-control" placeholder="Piloto, Pasajero">
                </div>
                <div class="form-group">
                    <label for="avion_horas${sufijo}">Horas de Vuelo Anuales</label>
                    <input type="number" id="avion_horas${sufijo}" name="avion_horas${sufijo}" class="form-control" placeholder="Aprox.">
                </div>
            </div>
        `
    };

    // Objeto con las plantillas para los campos de detalle de la sección Hábitos
    const detalleHabitosPlantillas = {
        fumar: (sufijo) => `
            <div class="detalle-habito-solicitante" data-habito-detalle="fumar">
                <h5>Detalles para ${document.getElementById(`nombres${sufijo.replace('_solicitante', '')}`)?.value.split(' ')[0] || `Solicitante ${sufijo.split('_').pop()}`}</h5>
                <div class="form-group">
                    <label>¿Es fumador(a) actualmente?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="fumar_actualmente${sufijo}" value="si" checked> Sí</label>
                        <label><input type="radio" name="fumar_actualmente${sufijo}" value="no"> No (Ex-fumador)</label>
                    </div>
                </div>
                <div class="fumar_details" style="display:block;">
                    <div class="form-group"><label for="cigarrillos_dia${sufijo}">¿Cuántos cigarros o puros al día?</label><input type="number" id="cigarrillos_dia${sufijo}" name="cigarrillos_dia${sufijo}" class="form-control" placeholder="Cantidad"></div>
                    <div class="form-group"><label for="fumar_desde${sufijo}">¿Desde cuándo?</label><input type="text" id="fumar_desde${sufijo}" name="fumar_desde${sufijo}" class="form-control" placeholder="Ej: Hace 5 años, 2010"></div>
                </div>
                <div class="no_fumar_details" style="display:none;">
                    <div class="form-group"><label for="dejo_fumar_tiempo${sufijo}">¿Cuándo dejó de fumar?</label><input type="text" id="dejo_fumar_tiempo${sufijo}" name="dejo_fumar_tiempo${sufijo}" class="form-control" placeholder="Ej: Hace 3 meses, en 2020"></div>
                </div>
            </div>`,
        alcohol: (sufijo) => `
            <div class="detalle-habito-solicitante" data-habito-detalle="alcohol">
                <h5>Detalles para ${document.getElementById(`nombres${sufijo.replace('_solicitante', '')}`)?.value.split(' ')[0] || `Solicitante ${sufijo.split('_').pop()}`}</h5>
                <div class="form-group">
                    <label>¿Consume bebidas alcohólicas actualmente?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="alcohol_actualmente${sufijo}" value="si" checked> Sí</label>
                        <label><input type="radio" name="alcohol_actualmente${sufijo}" value="no"> No</label>
                    </div>
                </div>
                <div class="alcohol_details" style="display:block;">
                    <div class="form-group"><label for="alcohol_frecuencia${sufijo}">Frecuencia</label><input type="text" id="alcohol_frecuencia${sufijo}" name="alcohol_frecuencia${sufijo}" class="form-control" placeholder="Ej: Dos veces por semana"></div>
                    <div class="form-group"><label for="alcohol_cantidad${sufijo}">Cantidad por ocasión</label><input type="text" id="alcohol_cantidad${sufijo}" name="alcohol_cantidad${sufijo}" class="form-control" placeholder="Ej: 3 copas, 1 cerveza"></div>
                    <div class="form-group"><label for="alcohol_tipo${sufijo}">Tipo de bebida</label><input type="text" id="alcohol_tipo${sufijo}" name="alcohol_tipo${sufijo}" class="form-control" placeholder="Ej: Cerveza, vino, whisky"></div>
                    <div class="form-group"><label for="alcohol_desde${sufijo}">¿Desde cuándo consume?</label><input type="text" id="alcohol_desde${sufijo}" name="alcohol_desde${sufijo}" class="form-control" placeholder="Ej: Ocasionalmente, desde 2015"></div>
                </div>
                <div class="no_alcohol_details" style="display:none;">
                    <div class="form-group"><label for="dejo_alcohol_tiempo${sufijo}">¿Cuándo dejó de consumir?</label><input type="text" id="dejo_alcohol_tiempo${sufijo}" name="dejo_alcohol_tiempo${sufijo}" class="form-control" placeholder="Ej: Hace 1 año"></div>
                </div>
            </div>`,
        drogas: (sufijo) => `
            <div class="detalle-habito-solicitante" data-habito-detalle="drogas">
                <h5>Detalles para ${document.getElementById(`nombres${sufijo.replace('_solicitante', '')}`)?.value.split(' ')[0] || `Solicitante ${sufijo.split('_').pop()}`}</h5>
                <div class="form-group">
                    <label>¿Consume o ha consumido drogas (no prescritas)?</label>
                    <div class="radio-group">
                        <label><input type="radio" name="drogas_actualmente${sufijo}" value="si" checked> Sí</label>
                        <label><input type="radio" name="drogas_actualmente${sufijo}" value="no"> No</label>
                    </div>
                </div>
                <div class="drogas_details" style="display:block;">
                    <div class="form-group"><label for="drogas_tipo${sufijo}">Tipo de droga</label><input type="text" id="drogas_tipo${sufijo}" name="drogas_tipo${sufijo}" class="form-control" placeholder="Especifique la sustancia"></div>
                    <div class="form-group"><label for="drogas_frecuencia${sufijo}">Frecuencia</label><input type="text" id="drogas_frecuencia${sufijo}" name="drogas_frecuencia${sufijo}" class="form-control" placeholder="Ej: Semanal, ocasional"></div>
                    <div class="form-group"><label for="drogas_desde${sufijo}">¿Desde cuándo consume?</label><input type="text" id="drogas_desde${sufijo}" name="drogas_desde${sufijo}" class="form-control" placeholder="Ej: Ocasionalmente, desde 2018"></div>
                </div>
                <div class="no_drogas_details" style="display:none;">
                    <div class="form-group"><label for="dejo_drogas_tiempo${sufijo}">¿Cuándo dejó de consumir?</label><input type="text" id="dejo_drogas_tiempo${sufijo}" name="dejo_drogas_tiempo${sufijo}" class="form-control" placeholder="Ej: Hace 5 años"></div>
                </div>
            </div>`
    };

    // Objeto con las plantillas para los campos de detalle de la sección Deportes
    const detalleDeportesPlantillas = {
        amateur: (sufijo) => `
            <div class="deporte-fila" data-sufijo="${sufijo}">
                <div class="form-group">
                    <label for="deporte_amateur_nombre${sufijo}">Deporte:</label>
                    <input type="text" id="deporte_amateur_nombre${sufijo}" name="deporte_amateur_nombre${sufijo}" class="form-control" placeholder="Nombre del deporte">
                </div>
                <div class="form-group">
                    <label>Frecuencia: <span class="required-marker">*</span></label>
                    <div class="radio-group">
                        <label><input type="radio" name="deporte_amateur_frecuencia${sufijo}" value="hasta_3" checked> Hasta 3 veces/semana</label>
                        <label><input type="radio" name="deporte_amateur_frecuencia${sufijo}" value="mas_3"> Más de 3 veces/semana</label>
                    </div>
                </div>
                <button type="button" class="btn-remover-fila" title="Eliminar este deporte">&times;</button>
            </div>
        `,
        profesional: (sufijo) => `
            <div class="deporte-fila" data-sufijo="${sufijo}">
                <div class="form-group">
                    <label for="deporte_profesional_nombre${sufijo}">Deporte:</label>
                    <input type="text" id="deporte_profesional_nombre${sufijo}" name="deporte_profesional_nombre${sufijo}" class="form-control" placeholder="Nombre del deporte">
                </div>
                <button type="button" class="btn-remover-fila" title="Eliminar este deporte">&times;</button>
            </div>
        `
    };

    // Objeto con la plantilla para los detalles del viaje
    const detalleViajePlantilla = (sufijo) => `
        <div class="detalle-viaje-solicitante">
            <h5>Detalles del viaje para ${document.getElementById(`nombres${sufijo.replace('_solicitante', '')}`)?.value.split(' ')[0] || `Solicitante ${sufijo.split('_').pop()}`}</h5>
            <div class="form-columns-container">
                <div class="form-group">
                    <label for="viaje_inicio${sufijo}">Fecha de Inicio</label>
                    <input type="date" id="viaje_inicio${sufijo}" name="viaje_inicio${sufijo}" class="form-control">
                </div>
                <div class="form-group">
                    <label for="viaje_fin${sufijo}">Fecha de Fin</label>
                    <input type="date" id="viaje_fin${sufijo}" name="viaje_fin${sufijo}" class="form-control">
                </div>
                <div class="form-group">
                    <label for="viaje_destino${sufijo}">Destino(s)</label>
                    <input type="text" id="viaje_destino${sufijo}" name="viaje_destino${sufijo}" class="form-control" placeholder="Ciudad, País">
                </div>
            </div>
        </div>
    `;

    // --- 3. FUNCIONES DE INICIALIZACIÓN (CON LÓGICA AÑADIDA) ---
    function initialize() {
        state.isLightMode = (localStorage.getItem(config.storageKeys.themeMode) || 'dark') === 'light';
        buildHeader();
        buildSidebar();

        state.formSections = document.querySelectorAll(config.domSelectors.sections);
        state.menuItems = document.querySelectorAll(config.domSelectors.menuItems);
        
        setupFormNavigation();
        setupConditionalFields(); // <--- LÓGICA NUEVA AÑADIDA AQUÍ
        document.getElementById('btn-agregar-asegurado').addEventListener('click', agregarNuevoSolicitante);
        setupRiskActivities();
        setupHabits();
        setupSports();
        setupMedicalInfo(); 
        setupSolicitudDetails();
        setupPaymentForm();
        showSection(0);
    }

    // El resto de tus funciones originales se mantienen, pero actualizadas
    function buildHeader() {
        const headerContainer = document.querySelector(config.domSelectors.header);
        if (!headerContainer) return;
        headerContainer.innerHTML = `
            <div class="header-content-wrapper">
                <div class="theme-controls">
                    <select id="theme-selector" title="Seleccionar Tema de Color"></select>
                    <label class="theme-switch" for="theme-checkbox">
                        <input type="checkbox" id="theme-checkbox" />
                        <div class="slider round">
                            <span class="icon material-symbols-outlined sun">light_mode</span>
                            <span class="icon material-symbols-outlined moon">dark_mode</span>
                        </div>
                    </label>
                </div>
            </div>`;
        const themeSelector = headerContainer.querySelector('#theme-selector');
        const themeCheckbox = headerContainer.querySelector('#theme-checkbox');
        config.availableThemes.forEach(theme => {
            const option = new Option(theme.name, theme.file);
            themeSelector.add(option);
        });
        themeSelector.addEventListener('change', (e) => setThemePalette(e.target.value));
        themeCheckbox.addEventListener('change', (e) => setThemeMode(e.target.checked ? 'light' : 'dark'));
        const savedFile = localStorage.getItem(config.storageKeys.themeFile) || config.availableThemes[config.availableThemes.length - 1].file;
        themeSelector.value = savedFile;
        setThemePalette(savedFile);
        themeCheckbox.checked = state.isLightMode;
        setThemeMode(state.isLightMode ? 'light' : 'dark');
    }

    function buildSidebar() {
        const sidebarContainer = document.querySelector(config.domSelectors.sidebar);
        if (!sidebarContainer) return;
        const menuItemsHTML = config.menuItems.map((item, index) => `
            <li class="menu-item" data-section-index="${index}">
                <span class="menu-icon material-symbols-outlined">${item.icon}</span>
                <span class="menu-text">${item.text}</span>
            </li>`).join('');
        sidebarContainer.innerHTML = `
            <div class="sidebar-top-area">
                <img id="logo-veler-sidebar" src="assets/img/veler_light.png" alt="Logo Veler Technologies">
                <button class="sidebar-toggle material-symbols-outlined" title="Contraer/Expandir menú">menu_open</button>
            </div>
            <div class="sidebar-bottom-area">
                <nav class="sidebar-menu"><ul class="menu-navegacion">${menuItemsHTML}</ul></nav>
            </div>`;
        sidebarContainer.querySelector('.sidebar-toggle').addEventListener('click', toggleSidebar);
        sidebarContainer.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const targetIndex = parseInt(e.currentTarget.dataset.sectionIndex, 10);
                showSection(targetIndex);
            });
        });
        if (localStorage.getItem(config.storageKeys.sidebarCollapsed) === 'true') {
            document.body.classList.replace('body-sidebar-expanded', 'body-sidebar-collapsed');
        }
    }

        /**
         * Clona los campos del solicitante titular para registrar asegurados adicionales.
         */
        function agregarNuevoSolicitante() {
            // 1. Validar el límite
            if (solicitanteCount >= MAX_SOLICITANTES) {
                console.log("DEBUG: Límite de solicitantes alcanzado.");
                document.getElementById('btn-agregar-asegurado').disabled = true;
                document.getElementById('btn-agregar-asegurado').textContent = "Límite de 10 solicitantes alcanzado";
                return;
            }

            solicitanteCount++;
            console.log(`DEBUG: Agregando Solicitante número ${solicitanteCount}`);

            // 2. Definir el contenedor principal y el punto de inserción
            const seccionSolicitante = document.getElementById('seccion-solicitante');
            const contenedorBoton = document.querySelector('.accion-adicional-container');

            // 3. Crear el nuevo bloque
            const nuevoBloque = document.createElement('div');
            nuevoBloque.className = 'bloque-solicitante-adicional';
            
            // 4. Clonar los campos del primer solicitante
            const camposOriginales = document.querySelector('#seccion-solicitante .form-columns-container');
            let camposClonadosHTML = camposOriginales.innerHTML;
            
            // 5. Crear identificadores únicos para los nuevos campos
            const sufijo = `_solicitante_${solicitanteCount}`;
            camposClonadosHTML = camposClonadosHTML.replace(/id="/g, `id="`);
            camposClonadosHTML = camposClonadosHTML.replace(/for="([a-zA-Z0-9_]+)"/g, `for="$1${sufijo}"`);
            camposClonadosHTML = camposClonadosHTML.replace(/id="([a-zA-Z0-9_]+)"/g, `id="$1${sufijo}"`);
            camposClonadosHTML = camposClonadosHTML.replace(/name="([a-zA-Z0-9_]+)"/g, `name="$1${sufijo}"`);

            // 6. Construir el HTML del nuevo bloque
            nuevoBloque.innerHTML = `
                <hr class="form-separator">
                <h3>Solicitante ${solicitanteCount}</h3>
                <div class="form-columns-container">
                    ${camposClonadosHTML}
                </div>
            `;

            // 7. Insertar el nuevo bloque en el DOM, antes del botón
            seccionSolicitante.insertBefore(nuevoBloque, contenedorBoton);

            // 8. Limpiar los valores de los campos recién creados
            const camposNuevos = nuevoBloque.querySelectorAll('input, select');
            camposNuevos.forEach(campo => {
                if (campo.type === 'radio' || campo.type === 'checkbox') {
                    campo.checked = false;
                } else if (campo.tagName === 'SELECT') {
                    campo.selectedIndex = 0;
                } else {
                    campo.value = '';
                }
            });

            // Después de limpiar, establecemos explícitamente el 'No' como seleccionado.
            const radioNoGobierno = nuevoBloque.querySelector(`input[name="cargo_gobierno${sufijo}"][value="no"]`);
            if (radioNoGobierno) {
                radioNoGobierno.checked = true;
            }

            // 9. Reactivar la lógica condicional para los campos del nuevo bloque
            const nuevosRadiosGobierno = nuevoBloque.querySelectorAll(`input[name="cargo_gobierno${sufijo}"]`);
            const nuevoGrupoDependencia = nuevoBloque.querySelector(`#cargo_dependencia_group${sufijo}`);

            // Nos aseguramos que los elementos existan antes de añadir el 'listener'
            if (nuevosRadiosGobierno && nuevoGrupoDependencia) {
                nuevosRadiosGobierno.forEach(radio => {
                    radio.addEventListener('change', (event) => {
                        if (event.target.value === 'si') {
                            nuevoGrupoDependencia.style.display = 'block';
                        } else {
                            nuevoGrupoDependencia.style.display = 'none';
                        }
                    });
                });
                console.log(`DEBUG: Lógica condicional de 'cargo gobierno' activada para Solicitante ${solicitanteCount}`);
            }

        }
    
    // --- 4. LÓGICA DE FORMULARIO (ACTUALIZADA) ---
    function setupFormNavigation() {
        document.querySelector(config.domSelectors.nextBtn)?.addEventListener('click', () => {
            if (state.currentSectionIndex < config.menuItems.length - 1) {
                showSection(state.currentSectionIndex + 1);
            }
        });
        document.querySelector(config.domSelectors.prevBtn)?.addEventListener('click', () => {
            if (state.currentSectionIndex > 0) {
                showSection(state.currentSectionIndex - 1);
            }
        });
        document.querySelector(config.domSelectors.editBtn)?.addEventListener('click', () => {
            const lastEditableSectionIndex = config.menuItems.length - 2;
            showSection(lastEditableSectionIndex);
        });
    }

    const cantidadContainer = document.getElementById('cantidadAseguradosContainer');

/**
 * Asigna todos los event listeners para los campos condicionales del formulario.
 * (Versión final completa con todas las condiciones y validaciones).
 */
function setupConditionalFields() {

    // --- Funciones "Guardianas" de Validación de Caracteres ---
    const forzarSoloNumeros = (event) => {
        if (/[^0-9]/.test(event.key) && !event.ctrlKey && !event.metaKey && event.key.length === 1) {
            event.preventDefault();
        }
    };
    const forzarSoloAlfanumerico = (event) => {
        if (/[^a-zA-Z0-9]/.test(event.key) && !event.ctrlKey && !event.metaKey && event.key.length === 1) {
            event.preventDefault();
        }
    };

    // --- Aplicar Guardianes a todos los campos que los necesitan ---
    // Sección Domicilio
    document.getElementById('tel_fijo')?.addEventListener('keydown', forzarSoloNumeros);
    document.getElementById('tel_celular')?.addEventListener('keydown', forzarSoloNumeros);

    // Sección Contratante
    document.getElementById('contratante_telefono')?.addEventListener('keydown', forzarSoloNumeros);
    document.getElementById('moral_telefono')?.addEventListener('keydown', forzarSoloNumeros);
    document.getElementById('contratante_cp_fiscal')?.addEventListener('keydown', forzarSoloNumeros);
    document.getElementById('moral_cp_fiscal')?.addEventListener('keydown', forzarSoloNumeros);
    document.getElementById('contratante_rfc')?.addEventListener('keydown', forzarSoloAlfanumerico);
    document.getElementById('moral_rfc')?.addEventListener('keydown', forzarSoloAlfanumerico);


    // --- Lógica para mostrar/ocultar secciones ---

    // Lógica para la sección SOLICITANTE
    const radiosCargoGobierno = document.querySelectorAll('input[name="cargo_gobierno"]');
    const grupoDependencia = document.getElementById('cargo_dependencia_group');
    if (radiosCargoGobierno.length > 0 && grupoDependencia) {
        radiosCargoGobierno.forEach(radio => {
            radio.addEventListener('change', (event) => {
                grupoDependencia.style.display = (event.target.value === 'si') ? 'block' : 'none';
            });
        });
    }

    const selectSexo = document.getElementById('sexo_nacer');
    const fechaNacimientoInput = document.getElementById('fecha_nacimiento');
    const embarazoGroup = document.getElementById('embarazo_group');
    const embarazoDetails = document.getElementById('embarazo_details');
    if (selectSexo && fechaNacimientoInput && embarazoGroup) {
        const toggleEmbarazoQuestion = () => {
            const esFemenino = selectSexo.value === 'femenino';
            let edad = 0;
            if (fechaNacimientoInput.value) {
                const hoy = new Date();
                const nacimiento = new Date(fechaNacimientoInput.value);
                edad = hoy.getFullYear() - nacimiento.getFullYear();
                const m = hoy.getMonth() - nacimiento.getMonth();
                if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
                    edad--;
                }
            }
            embarazoGroup.style.display = (esFemenino && edad >= 15) ? 'block' : 'none';
            if (!esFemenino || edad < 15) {
                embarazoDetails.style.display = 'none';
            }
        };
        selectSexo.addEventListener('change', toggleEmbarazoQuestion);
        fechaNacimientoInput.addEventListener('change', toggleEmbarazoQuestion);
    }
    if (embarazoGroup && embarazoDetails) {
        const radiosEmbarazo = embarazoGroup.querySelectorAll('input[name="embarazo"]');
        radiosEmbarazo.forEach(radio => {
            radio.addEventListener('change', (e) => {
                embarazoDetails.style.display = e.target.value === 'si' ? 'block' : 'none';
            });
        });
    }

    // Lógica para la sección DOMICILIO DEL TITULAR
    const checkDomicilioFiscalTitular = document.getElementById('domicilioFiscalDiferente');
    const domicilioFiscalContainerTitular = document.getElementById('domicilioFiscalContainer');
    if (checkDomicilioFiscalTitular && domicilioFiscalContainerTitular) {
        checkDomicilioFiscalTitular.addEventListener('change', (event) => {
            domicilioFiscalContainerTitular.style.display = event.target.checked ? 'grid' : 'none';
        });
    }

    // Lógica para la sección DATOS DEL CONTRATANTE (anidada)
    const radiosContratanteEsTitular = document.querySelectorAll('input[name="contratanteEsTitular"]');
    const datosContratanteContainer = document.getElementById('datosContratanteDiferenteContainer');
    if (radiosContratanteEsTitular.length > 0 && datosContratanteContainer) {
        radiosContratanteEsTitular.forEach(radio => {
            radio.addEventListener('change', (event) => {
                datosContratanteContainer.style.display = (event.target.value === 'no') ? 'block' : 'none';
            });
        });
    }

    const radiosTipoContratante = document.querySelectorAll('input[name="tipo_contratante"]');
    const formPersonaFisica = document.getElementById('contratante_persona_fisica_container');
    const formPersonaMoral = document.getElementById('contratante_persona_moral_container');
    if (radiosTipoContratante.length > 0 && formPersonaFisica && formPersonaMoral) {
        radiosTipoContratante.forEach(radio => {
            radio.addEventListener('change', (event) => {
                const esFisica = (event.target.value === 'fisica');
                formPersonaFisica.style.display = esFisica ? 'block' : 'none';
                formPersonaMoral.style.display = esFisica ? 'none' : 'block';
            });
        });
    }

    // Lógica para la sección de ANTIGÜEDAD (en Detalles de Solicitud)
    const radiosAntiguedad = document.querySelectorAll('input[name="antiguedad"]');
    const detallesAntiguedad = document.getElementById('antiguedad_details');
    if (radiosAntiguedad.length > 0 && detallesAntiguedad) {
         radiosAntiguedad.forEach(radio => radio.addEventListener('change', (e) => {
            detallesAntiguedad.style.display = e.target.value === 'si' ? 'block' : 'none';
        }));
    }
}

    function showSection(index) {
        const mainForm = document.querySelector(config.domSelectors.form);
        if (!mainForm) return;

        const isReviewMode = config.menuItems[index].id === 'revision';
        mainForm.classList.toggle('modo-revision', isReviewMode);

        state.formSections.forEach(section => {
            section.querySelectorAll('input, select, textarea').forEach(el => {
                el.disabled = isReviewMode;
            });
        });

        if (!isReviewMode) {
            state.formSections.forEach((section, i) => {
                section.classList.toggle('seccion-activa', i === index);
            });
        }
        
        state.currentSectionIndex = index;
        document.querySelectorAll(config.domSelectors.menuItems).forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        updateButtons();
    }
    
    function updateButtons() {
        const isLastSection = state.currentSectionIndex === config.menuItems.length - 1;
        document.querySelector(config.domSelectors.prevBtn).style.display = (state.currentSectionIndex > 0 && !isLastSection) ? 'inline-block' : 'none';
        document.querySelector(config.domSelectors.nextBtn).style.display = isLastSection ? 'none' : 'inline-block';
        document.querySelector(config.domSelectors.submitBtn).style.display = isLastSection ? 'inline-block' : 'none';
        document.querySelector(config.domSelectors.editBtn).style.display = isLastSection ? 'inline-block' : 'none';
    }

    // --- 5. LÓGICA DE TEMAS Y SIDEBAR (TU CÓDIGO ORIGINAL) ---
    function toggleSidebar() {
        const isCollapsed = document.body.classList.contains('body-sidebar-collapsed');
        document.body.classList.replace(isCollapsed ? 'body-sidebar-collapsed' : 'body-sidebar-expanded', isCollapsed ? 'body-sidebar-expanded' : 'body-sidebar-collapsed');
        localStorage.setItem(config.storageKeys.sidebarCollapsed, !isCollapsed);
    }

    function setThemeMode(mode) {
        state.isLightMode = mode === 'light';
        localStorage.setItem(config.storageKeys.themeMode, mode);
        document.documentElement.classList.toggle('light-theme', state.isLightMode);
        const logo = document.getElementById('logo-veler-sidebar');
        if (logo) {
            logo.src = state.isLightMode ? 'assets/img/VELER_LIGHT.png' : 'assets/img/VELER_DARK.png';
        }
    }

    function setThemePalette(themeFile) {
        const dynamicThemeLink = document.querySelector(config.domSelectors.dynamicThemeLink);
        if (dynamicThemeLink) {
            dynamicThemeLink.href = themeFile;
            localStorage.setItem(config.storageKeys.themeFile, themeFile);
        }
    }

    // --- 6. EJECUTAR LA APLICACIÓN ---
    initialize();

    /**
 * Configura la lógica interactiva para la sección de Actividades de Riesgo.
 */
function setupRiskActivities() {
    const actividadesItems = document.querySelectorAll('.actividad-riesgo-item');

    actividadesItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const asignacionContainer = item.querySelector('.asignacion-container');

        checkbox.addEventListener('change', (event) => {
            // Limpiamos el contenedor cada vez que hay un cambio
            asignacionContainer.innerHTML = '';
            
            if (event.target.checked) {
                asignacionContainer.style.display = 'block';
                crearSelectorDeSolicitantes(asignacionContainer, checkbox.value);
            } else {
                asignacionContainer.style.display = 'none';
            }
        });
    });
}

/**
 * Crea y añade una lista de checkboxes para seleccionar a los solicitantes,
 * usando sus nombres si están disponibles.
 * (Versión actualizada para mostrar nombres).
 */
function crearSelectorDeSolicitantes(container, actividadValue) {
    // 1. Crear el contenedor y la etiqueta
    const selectorContainer = document.createElement('div');
    selectorContainer.className = 'form-group';
    const preguntaLabel = document.createElement('label');
    preguntaLabel.className = 'asignacion-label';
    preguntaLabel.textContent = '¿Quién(es) la practican?';
    selectorContainer.appendChild(preguntaLabel);

    // 2. Crear el div que contendrá todos los checkboxes
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.className = 'solicitante-checkbox-container';

    // Contenedor para los campos de detalle
    const detallesContainer = document.createElement('div');
    detallesContainer.className = 'detalles-por-solicitante-container';

    // 3. Llenar el wrapper con un checkbox por cada solicitante
    for (let i = 1; i <= solicitanteCount; i++) {
        // --- INICIA LÓGICA PARA OBTENER EL NOMBRE ---
        let nombreSolicitante = '';
        if (i === 1) {
            // Para el titular, el ID no tiene sufijo
            const nombreInput = document.getElementById('nombres');
            if (nombreInput && nombreInput.value) {
                nombreSolicitante = nombreInput.value.split(' ')[0]; // Usamos solo el primer nombre para brevedad
            }
        } else {
            // Para los adicionales, el ID tiene sufijo
            const nombreInput = document.getElementById(`nombres_solicitante_${i}`);
            if (nombreInput && nombreInput.value) {
                nombreSolicitante = nombreInput.value.split(' ')[0];
            }
        }
        
        // Texto final para la etiqueta del checkbox
        const textoLabel = nombreSolicitante 
            ? `${i}.- ${nombreSolicitante}` 
            : (i === 1 ? 'Solicitante 1 - Titular' : `Solicitante ${i}`);
        // --- TERMINA LÓGICA PARA OBTENER EL NOMBRE ---

        const checkboxID = `${actividadValue}_solicitante_${i}`;
        
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        
        checkbox.type = 'checkbox';
        checkbox.id = checkboxID;
        checkbox.name = `quien_practica_${actividadValue}`;
        checkbox.value = i;
        
        checkbox.addEventListener('change', () => {
            actualizarCamposDeDetalle(checkboxWrapper, detallesContainer, actividadValue);
        });

        label.appendChild(checkbox);
        label.append(` ${textoLabel}`); // Añadimos el texto dinámico
        
        checkboxWrapper.appendChild(label);
    }
    
    // 4. Añadir los nuevos elementos al DOM
    selectorContainer.appendChild(checkboxWrapper);
    container.appendChild(selectorContainer);
    container.appendChild(detallesContainer);
}

/**
 * Muestra u oculta los campos de detalle para una actividad según los checkboxes marcados.
 * (Versión actualizada para funcionar con checkboxes).
 */
function actualizarCamposDeDetalle(checkboxWrapper, container, actividadValue) {
    // Limpiar detalles anteriores
    container.innerHTML = '';
    
    // Obtener todos los checkboxes que están marcados dentro del wrapper
    const checkboxesSeleccionados = checkboxWrapper.querySelectorAll('input[type="checkbox"]:checked');
    
    // Verificar si para esta actividad se necesitan detalles
    if (detalleActividadesPlantillas[actividadValue]) {
        checkboxesSeleccionados.forEach(checkbox => {
            const index = checkbox.value; // Obtenemos el índice del solicitante desde el valor del checkbox
            const sufijo = `_solicitante_${index}`;
            const plantillaFn = detalleActividadesPlantillas[actividadValue];
            container.innerHTML += plantillaFn(sufijo);
        });
    }
}

// --- SECCIÓN DE HÁBITOS (VERSIÓN FINAL Y CORRECTA) ---
function setupHabits() {
    const seccionHabitos = document.getElementById('seccion-habitos');
    if (!seccionHabitos) return;

    // Usamos un solo listener para toda la sección de hábitos
    seccionHabitos.addEventListener('change', (event) => {
        const target = event.target;

        // 1. Si se marca el checkbox principal de un hábito
        if (target.matches('input[name="habito_check"]')) {
            const asignacionContainer = target.closest('.habito-item').querySelector('.asignacion-container');
            asignacionContainer.innerHTML = '';
            if (target.checked) {
                asignacionContainer.style.display = 'block';
                crearAsignadorDeHabitos(asignacionContainer, target.value);
            } else {
                asignacionContainer.style.display = 'none';
            }
        }

        // 2. Si se marca el checkbox de un solicitante
        if (target.matches('.solicitante-checkbox')) {
            const asignacionContainer = target.closest('.asignacion-container');
            actualizarDetallesDeHabito(asignacionContainer);
        }

        // 3. Si se cambia el radio button de "actualmente"
        if (target.matches('input[type="radio"][name*="_actualmente"]')) {
            const detalleContainer = target.closest('.detalle-habito-solicitante');
            if (!detalleContainer) return;

            const habito = detalleContainer.dataset.habitoDetalle;
            const detallesSi = detalleContainer.querySelector(`.${habito}_details`);
            const detallesNo = detalleContainer.querySelector(`.no_${habito}_details`);

            if (detallesSi && detallesNo) {
                detallesSi.style.display = (target.value === 'si') ? 'block' : 'none';
                detallesNo.style.display = (target.value === 'no') ? 'block' : 'none';
            }
        }
    });
}

function crearAsignadorDeHabitos(container, habitoValue) {
    container.innerHTML = `
        <div class="form-group">
            <label class="asignacion-label">¿Quién(es)?</label>
            <div class="solicitante-checkbox-container"></div>
        </div>
        <div class="detalles-por-solicitante-container"></div>`;
    
    const checkboxWrapper = container.querySelector('.solicitante-checkbox-container');
    for (let i = 1; i <= solicitanteCount; i++) {
        const nombre = document.getElementById(i === 1 ? 'nombres' : `nombres_solicitante_${i}`)?.value.split(' ')[0] || '';
        const textoLabel = nombre ? `${i}.- ${nombre}` : (i === 1 ? 'Solicitante 1 - Titular' : `Solicitante ${i}`);
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = i;
        checkbox.className = 'solicitante-checkbox';
        checkbox.dataset.habito = habitoValue;
        label.append(checkbox, ` ${textoLabel}`);
        checkboxWrapper.appendChild(label);
    }
}

function actualizarDetallesDeHabito(container) {
    const detallesContainer = container.querySelector('.detalles-por-solicitante-container');
    const checkboxesSeleccionados = container.querySelectorAll('.solicitante-checkbox:checked');
    detallesContainer.innerHTML = '';
    checkboxesSeleccionados.forEach(checkbox => {
        const habitoValue = checkbox.dataset.habito;
        const plantillaFn = detalleHabitosPlantillas[habitoValue];
        if (plantillaFn) {
            const index = checkbox.value;
            const sufijo = `_solicitante_${index}`;
            detallesContainer.innerHTML += plantillaFn(sufijo);
        }
    });
}

/**
 * Configura la lógica interactiva para la sección de Deportes.
 */
function setupSports() {
    document.querySelectorAll('.deporte-categoria-item').forEach(item => {
        const checkCategoria = item.querySelector('input[name="deporte_categoria_check"]');
        const asignacionContainer = item.querySelector('.asignacion-container');

        checkCategoria.addEventListener('change', event => {
            asignacionContainer.innerHTML = ''; // Limpiar al cambiar
            if (event.target.checked) {
                asignacionContainer.style.display = 'block';
                crearAsignadorDeDeportes(asignacionContainer, checkCategoria.value);
            } else {
                asignacionContainer.style.display = 'none';
            }
        });
    });
}

/**
 * Crea la lista de solicitantes para asignar una categoría de deporte (amateur/profesional).
 */
function crearAsignadorDeDeportes(container, categoria) {
    container.innerHTML = `
        <div class="form-group">
            <label class="asignacion-label">¿Quién(es) lo practican?</label>
            <div class="solicitante-checkbox-container"></div>
        </div>
        <div class="detalles-por-solicitante-container"></div>
    `;

    const checkboxWrapper = container.querySelector('.solicitante-checkbox-container');
    const detallesContainer = container.querySelector('.detalles-por-solicitante-container');

    for (let i = 1; i <= solicitanteCount; i++) {
        const nombre = document.getElementById(i === 1 ? 'nombres' : `nombres_solicitante_${i}`)?.value.split(' ')[0] || '';
        const textoLabel = nombre ? `${i}.- ${nombre}` : (i === 1 ? 'Solicitante 1 - Titular' : `Solicitante ${i}`);
        
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = i;
        label.append(checkbox, ` ${textoLabel}`);
        
        checkbox.addEventListener('change', () => actualizarBloqueDeportesPersona(checkbox, detallesContainer, categoria));
        checkboxWrapper.appendChild(label);
    }
}

/**
 * Muestra u oculta el bloque de gestión de deportes para una persona.
 */
function actualizarBloqueDeportesPersona(checkbox, container, categoria) {
    const solicitanteIndex = checkbox.value;
    const bloqueExistente = container.querySelector(`#bloque_deportes_${categoria}_${solicitanteIndex}`);

    if (checkbox.checked && !bloqueExistente) {
        const nombre = document.getElementById(solicitanteIndex === '1' ? 'nombres' : `nombres_solicitante_${solicitanteIndex}`)?.value || `Solicitante ${solicitanteIndex}`;
        const nuevoBloque = document.createElement('div');
        nuevoBloque.id = `bloque_deportes_${categoria}_${solicitanteIndex}`;
        nuevoBloque.className = 'detalle-actividad-solicitante'; // Reutilizamos clase de estilo
        nuevoBloque.innerHTML = `
            <h5>Deportes (${categoria}) de ${nombre.split(' ')[0]}</h5>
            <div class="lista-deportes-container"></div>
            <div class="accion-adicional-container" style="border-top: none; text-align: left; padding-top: 10px;">
                <button type="button" class="btn-secundario btn-agregar-deporte">
                    <span class="material-symbols-outlined">add</span>
                    Agregar Deporte
                </button>
            </div>
        `;
        container.appendChild(nuevoBloque);
        
        // Asignar evento al nuevo botón "Agregar Deporte"
        nuevoBloque.querySelector('.btn-agregar-deporte').addEventListener('click', () => {
            agregarFilaDeporte(nuevoBloque.querySelector('.lista-deportes-container'), categoria, solicitanteIndex);
        });

    } else if (!checkbox.checked && bloqueExistente) {
        bloqueExistente.remove();
    }
}

/**
 * Añade una nueva fila para registrar un deporte.
 */
function agregarFilaDeporte(container, categoria, solicitanteIndex) {
    const numDeportes = container.querySelectorAll('.deporte-fila').length;
    const sufijo = `_solicitante_${solicitanteIndex}_${numDeportes}`;
    const plantillaFn = detalleDeportesPlantillas[categoria];
    
    const divFila = document.createElement('div');
    divFila.innerHTML = plantillaFn(sufijo);

    // Asignar evento al nuevo botón "Eliminar"
    divFila.querySelector('.btn-remover-fila').addEventListener('click', (e) => {
        e.target.closest('.deporte-fila').remove();
    });

    container.appendChild(divFila.firstElementChild);
}

/**
 * Configura la lógica interactiva para la sección de Información Médica
 */
function setupMedicalInfo() {
    const checkPreguntas = document.querySelectorAll('input[name="pregunta_medica"]');
    const contenedorAccion = document.getElementById('contenedor-accion-padecimiento');
    const btnAgregar = document.getElementById('btn-agregar-padecimiento');
    const listaFormsContainer = document.getElementById('lista-padecimientos-forms');
    let padecimientoCounter = 0;

    const toggleAgregarBoton = () => {
        const algunoMarcado = Array.from(checkPreguntas).some(c => c.checked);
        contenedorAccion.style.display = algunoMarcado ? 'block' : 'none';
        
        // CAMBIO: Si ninguna pregunta está marcada, limpiamos los formularios agregados.
        if (!algunoMarcado) {
            listaFormsContainer.innerHTML = '';
            padecimientoCounter = 0; // Reseteamos el contador
        }
    };

    checkPreguntas.forEach(check => check.addEventListener('change', toggleAgregarBoton));

    btnAgregar.addEventListener('click', () => {
        padecimientoCounter++;
        const sufijo = `_pad_${padecimientoCounter}`;
        const nuevoFormHTML = crearFormularioPadecimientoHTML(sufijo);

        const divTemporal = document.createElement('div');
        divTemporal.innerHTML = nuevoFormHTML;

        activarLogicaFormularioPadecimiento(divTemporal, sufijo);
        llenarDesplegablesPadecimiento(divTemporal, sufijo);

        listaFormsContainer.appendChild(divTemporal.firstElementChild);
    });
}

/**
 * Crea el HTML para un nuevo formulario de detalle de padecimiento.
 * (Versión actualizada con todos los campos y labels corregidos).
 */
function crearFormularioPadecimientoHTML(sufijo) {
    return `
        <div class="item-registrado-card" id="padecimiento_card${sufijo}">
            <div class="card-header">
                <h4>Detalle de Padecimiento #${sufijo.split('_').pop()}</h4>
                <button type="button" class="btn-remover-item" title="Eliminar este padecimiento">&times;</button>
            </div>
            <div class="form-columns-container">
                <div class="form-group"><label for="padecimiento_solicitante${sufijo}">No. Solicitante <span class="required-marker">*</span></label><select id="padecimiento_solicitante${sufijo}" name="padecimiento_solicitante${sufijo}" class="form-control" required></select></div>
                <div class="form-group"><label for="padecimiento_pregunta${sufijo}">No. Pregunta <span class="required-marker">*</span></label><select id="padecimiento_pregunta${sufijo}" name="padecimiento_pregunta${sufijo}" class="form-control" required></select></div>
                <div class="form-group full-width">
                    <label for="padecimiento_nombre${sufijo}">Nombre del Padecimiento <span class="required-marker">*</span></label>
                    <input type="text" id="padecimiento_nombre${sufijo}" name="padecimiento_nombre${sufijo}" class="form-control" required placeholder="Ej: Diabetes Tipo 2, Fractura de tobillo">
                </div>
                <div class="form-group"><label>Tipo de Evento:</label><div class="radio-group"><label><input type="radio" name="padecimiento_evento${sufijo}" value="enfermedad" checked> Enfermedad</label><label><input type="radio" name="padecimiento_evento${sufijo}" value="accidente"> Accidente</label></div></div>
                <div class="form-group"><label for="padecimiento_inicio${sufijo}">Fecha de Inicio</label><input type="date" id="padecimiento_inicio${sufijo}" name="padecimiento_inicio${sufijo}" class="form-control"></div>
                <div class="form-group full-width"><label>Tipo de Tratamiento:</label><div class="checkbox-group-grid"><label><input type="checkbox" name="padecimiento_tratamiento${sufijo}" value="quirurgico"> Quirúrgico</label><label><input type="checkbox" name="padecimiento_tratamiento${sufijo}" value="medico"> Médico</label><label><input type="checkbox" name="padecimiento_tratamiento${sufijo}" value="psicologico"> Psicológico</label><label><input type="checkbox" name="padecimiento_tratamiento${sufijo}" value="rehabilitacion"> Rehabilitación</label><label><input type="checkbox" name="padecimiento_tratamiento${sufijo}" value="quimioterapia"> Quimioterapia</label><label><input type="checkbox" name="padecimiento_tratamiento${sufijo}" value="radioterapia"> Radioterapia</label><label><input type="checkbox" name="padecimiento_tratamiento${sufijo}" value="trasplante"> Trasplante</label><label><input type="checkbox" name="padecimiento_tratamiento${sufijo}" value="observacion"> En observación</label></div></div>
                <div class="form-group"><label>¿Estuvo hospitalizado?</label><div class="radio-group"><label><input type="radio" name="padecimiento_hosp${sufijo}" value="si"> Sí</label><label><input type="radio" name="padecimiento_hosp${sufijo}" value="no" checked> No</label></div></div>
                <div class="form-group"><label>¿Quedó con alguna complicación?</label><div class="radio-group"><label><input type="radio" name="padecimiento_comp${sufijo}" value="si"> Sí</label><label><input type="radio" name="padecimiento_comp${sufijo}" value="no" checked> No</label></div></div>
                <div class="form-group" style="display:none;">
                    <label for="padecimiento_comp_cual${sufijo}">En caso afirmativo: ¿Cuál?</label>
                    <input type="text" id="padecimiento_comp_cual${sufijo}" name="padecimiento_comp_cual${sufijo}" class="form-control" placeholder="Describa la complicación">
                </div>
                <div class="form-group"><label>¿Actualmente toma algún medicamento?</label><div class="radio-group"><label><input type="radio" name="padecimiento_meds${sufijo}" value="si"> Sí</label><label><input type="radio" name="padecimiento_meds${sufijo}" value="no" checked> No</label></div></div>
                <div class="form-group" style="display:none;">
                    <label for="padecimiento_meds_cual${sufijo}">En caso afirmativo: ¿Cuál?</label>
                    <input type="text" id="padecimiento_meds_cual${sufijo}" name="padecimiento_meds_cual${sufijo}" class="form-control" placeholder="Nombre del medicamento y dosis">
                </div>
                <div class="form-group"><label>Estado Actual de Salud:</label><div class="radio-group"><label><input type="radio" name="padecimiento_salud${sufijo}" value="sano" checked> Sano</label><label><input type="radio" name="padecimiento_salud${sufijo}" value="tratamiento"> En tratamiento</label></div></div>
            </div>
        </div>
    `;
}

/**
 * Activa los event listeners para los campos condicionales de un formulario de padecimiento específico.
 */
function activarLogicaFormularioPadecimiento(container, sufijo) {
    // Botón de eliminar
    container.querySelector('.btn-remover-item').addEventListener('click', (e) => {
        e.target.closest('.item-registrado-card').remove();
    });

    // Lógica para 'complicaciones'
    const compRadios = container.querySelectorAll(`input[name="padecimiento_comp${sufijo}"]`);
    const compCualGroup = container.querySelector(`#padecimiento_comp_cual${sufijo}`).closest('.form-group');
    compRadios.forEach(r => r.addEventListener('change', e => compCualGroup.style.display = e.target.value === 'si' ? 'block' : 'none'));

    // Lógica para 'medicamentos'
    const medsRadios = container.querySelectorAll(`input[name="padecimiento_meds${sufijo}"]`);
    const medsCualGroup = container.querySelector(`#padecimiento_meds_cual${sufijo}`).closest('.form-group');
    medsRadios.forEach(r => r.addEventListener('change', e => medsCualGroup.style.display = e.target.value === 'si' ? 'block' : 'none'));
}

/**
 * Llena los menús desplegables de un formulario de padecimiento específico.
 */
function llenarDesplegablesPadecimiento(container, sufijo) {
    // Llenar solicitantes
    const selectSolicitante = container.querySelector(`#padecimiento_solicitante${sufijo}`);
    selectSolicitante.innerHTML = '<option value="">Seleccione...</option>';
    for (let i = 1; i <= solicitanteCount; i++) {
        const nombre = document.getElementById(i === 1 ? 'nombres' : `nombres_solicitante_${i}`)?.value || `Solicitante ${i}`;
        selectSolicitante.innerHTML += `<option value="${i}">${i}.- ${nombre}</option>`;
    }

    // Llenar preguntas
    const selectPregunta = container.querySelector(`#padecimiento_pregunta${sufijo}`);
    selectPregunta.innerHTML = '<option value="">Seleccione...</option>';
    document.querySelectorAll('input[name="pregunta_medica"]:checked').forEach(check => {
        const label = check.closest('label').textContent.trim().substring(0, 50) + '...';
        selectPregunta.innerHTML += `<option value="${check.value}">${label}</option>`;
    });
}

/**
 * Configura la lógica interactiva para la sección de Detalles de la Solicitud.
 */
function setupSolicitudDetails() {
    // 1. Llenar la fecha de solicitud automáticamente
    const fechaSolicitudInput = document.getElementById('fecha_solicitud');
    if (fechaSolicitudInput) {
        fechaSolicitudInput.valueAsDate = new Date();
    }

    // 2. Lógica para la pregunta de viaje al extranjero
    const checkViaje = document.querySelector('input[name="viaje_extranjero_check"]');
    const asignacionContainer = document.getElementById('viaje-asignacion-container');

    if (checkViaje && asignacionContainer) {
        checkViaje.addEventListener('change', event => {
            asignacionContainer.innerHTML = '';
            if (event.target.checked) {
                asignacionContainer.style.display = 'block';
                // Usamos una función genérica para crear los checkboxes
                crearAsignadorGenerico(asignacionContainer, 'viaje', detalleViajePlantilla);
            } else {
                asignacionContainer.style.display = 'none';
            }
        });
    }

    // 3. La lógica para la antigüedad (esta ya debería estar en setupConditionalFields)
    // Nos aseguramos que siga funcionando.
    const radiosAntiguedad = document.querySelectorAll('input[name="antiguedad"]');
    const detallesAntiguedad = document.getElementById('antiguedad_details');
    if (radiosAntiguedad.length > 0 && detallesAntiguedad) {
         radiosAntiguedad.forEach(radio => radio.addEventListener('change', (e) => {
            detallesAntiguedad.style.display = e.target.value === 'si' ? 'block' : 'none';
        }));
    }
}

/**
 * Configura la lógica interactiva para la sección de Forma de Pago.
 * (Versión actualizada con validador de solo números).
 */
function setupPaymentForm() {
    const medioPagoSelect = document.getElementById('pago_medio');
    if (!medioPagoSelect) return;

    const tarjetaDetails = document.getElementById('pago_tarjeta_details');
    const clabeDetails = document.getElementById('pago_clabe_details');

    // --- INICIA EL CÓDIGO NUEVO ---
    // Función "guardián" para permitir solo números
    const forzarSoloNumeros = (event) => {
        // Si la tecla presionada NO es un número Y NO es una tecla de control (como borrar, tab, etc.)
        if (/[^0-9]/.test(event.key) && !event.ctrlKey && !event.metaKey && event.key.length === 1) {
            event.preventDefault(); // Bloqueamos la escritura de esa tecla
        }
    };

    // Aplicamos el "guardián" a los campos numéricos
    const camposNumericos = ['tarjeta_numero', 'tarjeta_cvv', 'clabe_numero'];
    camposNumericos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener('keydown', forzarSoloNumeros);
        }
    });
    // --- TERMINA EL CÓDIGO NUEVO ---

    // La lógica para mostrar/ocultar los contenedores no cambia
    medioPagoSelect.addEventListener('change', (event) => {
        const seleccion = event.target.value;
        
        if(tarjetaDetails) tarjetaDetails.style.display = 'none';
        if(clabeDetails) clabeDetails.style.display = 'none';

        if (seleccion === 'tarjeta' && tarjetaDetails) {
            tarjetaDetails.style.display = 'block';
        } else if (seleccion === 'clabe' && clabeDetails) {
            clabeDetails.style.display = 'block';
        }
    });
}

});
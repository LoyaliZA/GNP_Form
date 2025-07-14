document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURACIÓN CENTRALIZADA (ACTUALIZADA CON 11 SECCIONES) ---
    // Objeto 'config' que centraliza todas las configuraciones importantes de la aplicación.
    // Esto facilita la gestión y actualización de las rutas, selectores, etc.
    const config = {
        // Define los elementos del menú lateral, incluyendo su ID, ícono de Material Symbols y texto.
        // Cada objeto representa una sección del formulario a la que se puede navegar.
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
        // Define los temas de color disponibles para la aplicación, con su nombre y archivo CSS.
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
        // Selectores del DOM utilizados comúnmente para acceder a elementos HTML.
        domSelectors: {
            sidebar: '#sidebar-navegacion', // Contenedor de la barra lateral
            header: '#main-header',       // Contenedor del encabezado principal
            form: '#formulario-completo', // El formulario completo
            sections: '.seccion-formulario', // Todas las secciones individuales del formulario
            menuItems: '.sidebar-menu .menu-item', // Elementos del menú de la barra lateral
            nextBtn: '#next-btn',         // Botón para avanzar a la siguiente sección
            prevBtn: '#prev-btn',         // Botón para retroceder a la sección anterior
            submitBtn: '#submit-btn',     // Botón para enviar el formulario
            editBtn: '#edit-btn',         // Botón para editar en modo revisión
            dynamicThemeLink: '#dynamic-theme-style-link' // Link para el CSS de tema dinámico
        },
        // Claves para almacenar preferencias en el localStorage del navegador.
        storageKeys: {
            themeMode: 'theme_mode',         // Modo de tema (claro/oscuro)
            themeFile: 'selected_theme_file',// Archivo del tema de color seleccionado
            sidebarCollapsed: 'sidebar_collapsed' // Estado de la barra lateral (colapsada/expandida)
        }
    };

    // --- 2. ESTADO DE LA APLICACIÓN (SIN CAMBIOS) ---
    // Objeto 'state' que mantiene el estado actual de la aplicación.
    let state = {
        currentSectionIndex: 0, // Índice de la sección del formulario que se está mostrando actualmente.
        isLightMode: false,     // Booleano que indica si el modo claro está activado.
        formSections: [],       // Array para almacenar todas las secciones del formulario.
        menuItems: []           // Array para almacenar todos los elementos del menú lateral.
    };

    // --- PARA LO DE SOLICITANTES EXTRA ---
    // Contador para el número de solicitantes adicionales en el formulario.
    let solicitanteCount = 1;
    // Límite máximo de solicitantes permitidos.
    const MAX_SOLICITANTES = 10;

    // Objeto con las plantillas HTML para los campos de detalle de actividades de riesgo.

    
    const detalleActividadesPlantillas = {
        // Plantilla para detalles de uso de motocicleta.
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
        // Plantilla para detalles de uso de aviones.
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

    // Objeto con las plantillas HTML para los campos de detalle de la sección Hábitos.
    const detalleHabitosPlantillas = {
        // Plantilla para detalles del hábito de fumar.
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
        // Plantilla para detalles del hábito de consumo de alcohol.
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
        // Plantilla para detalles del hábito de consumo de drogas.
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

    // Objeto con las plantillas HTML para los campos de detalle de la sección Deportes.
    const detalleDeportesPlantillas = {
        // Plantilla para un deporte amateur.
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
        // Plantilla para un deporte profesional.
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

    // Objeto con la plantilla HTML para los detalles del viaje.
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
    /**
     * Inicializa la aplicación configurando el estado, construyendo la UI y
     * asignando los event listeners necesarios.
     */
    function initialize() {
        // Recupera el modo de tema del localStorage o establece 'dark' por defecto.
        state.isLightMode = (localStorage.getItem(config.storageKeys.themeMode) || 'dark') === 'light';
        buildHeader(); // Construye el encabezado.
        buildSidebar(); // Construye la barra lateral.

        // Obtiene todas las secciones del formulario y los elementos del menú.
        state.formSections = document.querySelectorAll(config.domSelectors.sections);
        state.menuItems = document.querySelectorAll(config.domSelectors.menuItems);
        
        setupFormNavigation(); // Configura la navegación entre secciones del formulario.
        setupConditionalFields(); // Configura campos condicionales.
        // Asigna el event listener para agregar nuevos solicitantes.
        document.getElementById('btn-agregar-asegurado').addEventListener('click', agregarNuevoSolicitante);
        setupRiskActivities(); // Configura la lógica para actividades de riesgo.
        setupHabits();         // Configura la lógica para hábitos.
        setupSports();         // Configura la lógica para deportes.
        setupMedicalInfo();    // Configura la lógica para información médica.
        setupSolicitudDetails(); // Configura la lógica para detalles de la solicitud.
        setupPaymentForm();    // Configura la lógica para la forma de pago.
        showSection(0);        // Muestra la primera sección al inicio.

        // Asigna un event listener para actualizar la barra de progreso en cada entrada del formulario.
        document.getElementById('miFormularioDinamico').addEventListener('input', updateProgressBar);
    }

    function buildHeader() {
        const headerContainer = document.querySelector(config.domSelectors.header);
        if (!headerContainer) return; // Si no encuentra el contenedor, sale.

        // Inserta el HTML del encabezado.
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
        
        // Rellena el selector de tema con las opciones disponibles en la configuración.
        config.availableThemes.forEach(theme => {
            const option = new Option(theme.name, theme.file);
            themeSelector.add(option);
        });
        
        // Asigna event listeners para cambiar el tema y el modo (claro/oscuro).
        themeSelector.addEventListener('change', (e) => setThemePalette(e.target.value));
        themeCheckbox.addEventListener('change', (e) => setThemeMode(e.target.checked ? 'light' : 'dark'));
        
        // Carga el tema guardado previamente o el último de la lista como predeterminado.
        const savedFile = localStorage.getItem(config.storageKeys.themeFile) || config.availableThemes[config.availableThemes.length - 1].file;
        themeSelector.value = savedFile;
        setThemePalette(savedFile);
        
        // Establece el estado inicial del checkbox y el modo de tema.
        themeCheckbox.checked = state.isLightMode;
        setThemeMode(state.isLightMode ? 'light' : 'dark');
    }

    /**
     * Construye y renderiza la barra lateral de navegación, incluyendo el logo,
     * el botón de colapsar/expandir y la lista de elementos del menú.
     */
    function buildSidebar() {
        const sidebarContainer = document.querySelector(config.domSelectors.sidebar);
        if (!sidebarContainer) return; // Si no encuentra el contenedor, sale.

        // Mapea los elementos del menú de la configuración a HTML para la barra lateral.
        const menuItemsHTML = config.menuItems.map((item, index) => `
            <li class="menu-item" data-section-index="${index}">
                <span class="menu-icon material-symbols-outlined">${item.icon}</span>
                <span class="menu-text">${item.text}</span>
                <span class="completion-indicator"></span>
            </li>`).join('');
        
        // Inserta el HTML de la barra lateral.
        sidebarContainer.innerHTML = `
            <div class="sidebar-top-area">
                <img id="logo-veler-sidebar" src="assets/img/veler_light.png" alt="Logo Veler Technologies">
                <button class="sidebar-toggle material-symbols-outlined" title="Contraer/Expandir menú">menu_open</button>
            </div>
            <div class="sidebar-bottom-area">
                <nav class="sidebar-menu"><ul class="menu-navegacion">${menuItemsHTML}</ul></nav>
                <div class="progress-container">
                    <div class="progress-bar-wrapper">
                        <div id="progress-bar-fill" class="progress-bar-fill"></div>
                    </div>
                    <span id="progress-bar-text" class="progress-bar-text">0% completado</span>
                </div>
            </div>`;
        
        // Asigna el event listener para el botón de colapsar/expandir la barra lateral.
        sidebarContainer.querySelector('.sidebar-toggle').addEventListener('click', toggleSidebar);
        
        // Asigna event listeners a cada elemento del menú para navegar a la sección correspondiente.
        sidebarContainer.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const targetIndex = parseInt(e.currentTarget.dataset.sectionIndex, 10);
                showSection(targetIndex);
            });
        });
        
        // Aplica el estado de la barra lateral guardado en localStorage.
        if (localStorage.getItem(config.storageKeys.sidebarCollapsed) === 'true') {
            document.body.classList.replace('body-sidebar-expanded', 'body-sidebar-collapsed');
        }
    }

    /**
     * Clona los campos del solicitante titular para registrar asegurados adicionales.
     * Añade un nuevo bloque de formulario para un solicitante adicional, copiando la
     * estructura de los campos del primer solicitante y asignando IDs/nombres únicos.
     */
    function agregarNuevoSolicitante() {
        // 1. Validar el límite de solicitantes.
        if (solicitanteCount >= MAX_SOLICITANTES) {
            console.log("DEBUG: Límite de solicitantes alcanzado.");
            // Deshabilita y cambia el texto del botón cuando se alcanza el límite.
            document.getElementById('btn-agregar-asegurado').disabled = true;
            document.getElementById('btn-agregar-asegurado').textContent = "Límite de 10 solicitantes alcanzado";
            return;
        }

        solicitanteCount++; // Incrementa el contador de solicitantes.
        console.log(`DEBUG: Agregando Solicitante número ${solicitanteCount}`);

        // 2. Definir el contenedor principal y el punto de inserción.
        const seccionSolicitante = document.getElementById('seccion-solicitante');
        const contenedorBoton = document.querySelector('.accion-adicional-container');

        // 3. Crear el nuevo bloque de solicitante.
        const nuevoBloque = document.createElement('div');
        nuevoBloque.className = 'bloque-solicitante-adicional';
        
        // 4. Clonar los campos del primer solicitante.
        const camposOriginales = document.querySelector('#seccion-solicitante .form-columns-container');
        let camposClonadosHTML = camposOriginales.innerHTML;
        
        // 5. Crear identificadores únicos para los nuevos campos reemplazando IDs y nombres con un sufijo.
        const sufijo = `_solicitante_${solicitanteCount}`;
        camposClonadosHTML = camposClonadosHTML.replace(/id="/g, `id="`); // Esto prepara para la siguiente sustitución
        camposClonadosHTML = camposClonadosHTML.replace(/for="([a-zA-Z0-9_]+)"/g, `for="$1${sufijo}"`);
        camposClonadosHTML = camposClonadosHTML.replace(/id="([a-zA-Z0-9_]+)"/g, `id="$1${sufijo}"`);
        camposClonadosHTML = camposClonadosHTML.replace(/name="([a-zA-Z0-9_]+)"/g, `name="$1${sufijo}"`);

        // 6. Construir el HTML del nuevo bloque.
        nuevoBloque.innerHTML = `
            <hr class="form-separator">
            <h3>Solicitante ${solicitanteCount}</h3>
            <div class="form-columns-container">
                ${camposClonadosHTML}
            </div>
        `;

        // 7. Insertar el nuevo bloque en el DOM, antes del botón de "Agregar Asegurado".
        seccionSolicitante.insertBefore(nuevoBloque, contenedorBoton);

        // 8. Limpiar los valores de los campos recién creados para que aparezcan vacíos.
        const camposNuevos = nuevoBloque.querySelectorAll('input, select');
        camposNuevos.forEach(campo => {
            if (campo.type === 'radio' || campo.type === 'checkbox') {
                campo.checked = false; // Desmarca radios y checkboxes.
            } else if (campo.tagName === 'SELECT') {
                campo.selectedIndex = 0; // Selecciona la primera opción (usualmente un placeholder).
            } else {
                campo.value = ''; // Borra el valor de otros campos de texto.
            }
        });

        // Después de limpiar, establece explícitamente el 'No' como seleccionado para el cargo de gobierno.
        const radioNoGobierno = nuevoBloque.querySelector(`input[name="cargo_gobierno${sufijo}"][value="no"]`);
        if (radioNoGobierno) {
            radioNoGobierno.checked = true;
        }

        // 9. Reactivar la lógica condicional para los campos del nuevo bloque.
        // Esto es crucial para que los campos condicionales del nuevo solicitante funcionen.
        const nuevosRadiosGobierno = nuevoBloque.querySelectorAll(`input[name="cargo_gobierno${sufijo}"]`);
        const nuevoGrupoDependencia = nuevoBloque.querySelector(`#cargo_dependencia_group${sufijo}`);

        // Asegurarse de que los elementos existan antes de añadir el 'listener'.
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
    /**
     * Configura los event listeners para los botones de navegación del formulario
     * (siguiente, anterior, enviar, editar).
     */
    function setupFormNavigation() {
        // Event listener para el botón "Siguiente".
        document.querySelector(config.domSelectors.nextBtn)?.addEventListener('click', () => {
            if (state.currentSectionIndex < config.menuItems.length - 1) {
                showSection(state.currentSectionIndex + 1); // Avanza a la siguiente sección.
            }
        });
        // Event listener para el botón "Anterior".
        document.querySelector(config.domSelectors.prevBtn)?.addEventListener('click', () => {
            if (state.currentSectionIndex > 0) {
                showSection(state.currentSectionIndex - 1); // Retrocede a la sección anterior.
            }
        });
        // Event listener para el botón "Editar" (en modo revisión).
        document.querySelector(config.domSelectors.editBtn)?.addEventListener('click', () => {
            // Navega a la penúltima sección para permitir la edición antes de la revisión final.
            const lastEditableSectionIndex = config.menuItems.length - 2;
            showSection(lastEditableSectionIndex);
        });
    }

    const cantidadContainer = document.getElementById('cantidadAseguradosContainer');

    /**
     * Asigna todos los event listeners para los campos condicionales del formulario.
     * (Versión final completa con todas las condiciones y validaciones).
     * Esta función maneja la visibilidad de ciertos campos basándose en las selecciones del usuario.
     */
    function setupConditionalFields() {

        // --- Funciones "Guardianas" de Validación de Caracteres ---
        // Previene la entrada de caracteres no numéricos.
        const forzarSoloNumeros = (event) => {
            // Verifica si la tecla presionada NO es un número, y NO es una tecla de control (ej. Ctrl, Meta),
            // y si la longitud de la tecla es 1 (para evitar capturar teclas especiales como 'Enter').
            if (/[^0-9]/.test(event.key) && !event.ctrlKey && !event.metaKey && event.key.length === 1) {
                event.preventDefault(); // Detiene la acción por defecto (la escritura del caracter).
            }
        };
        // Previene la entrada de caracteres no alfanuméricos.
        const forzarSoloAlfanumerico = (event) => {
            // Verifica si la tecla presionada NO es alfanumérica, y NO es una tecla de control,
            // y si la longitud de la tecla es 1.
            if (/[^a-zA-Z0-9]/.test(event.key) && !event.ctrlKey && !event.metaKey && event.key.length === 1) {
                event.preventDefault(); // Detiene la acción por defecto.
            }
        };

        // --- Aplicar Guardianes a todos los campos que los necesitan ---
        // Sección Domicilio: Campos de teléfono.
        document.getElementById('tel_fijo')?.addEventListener('keydown', forzarSoloNumeros);
        document.getElementById('tel_celular')?.addEventListener('keydown', forzarSoloNumeros);

        // Sección Contratante: Campos de teléfono, CP fiscal y RFC.
        document.getElementById('contratante_telefono')?.addEventListener('keydown', forzarSoloNumeros);
        document.getElementById('moral_telefono')?.addEventListener('keydown', forzarSoloNumeros);
        document.getElementById('contratante_cp_fiscal')?.addEventListener('keydown', forzarSoloNumeros);
        document.getElementById('moral_cp_fiscal')?.addEventListener('keydown', forzarSoloNumeros);
        document.getElementById('contratante_rfc')?.addEventListener('keydown', forzarSoloAlfanumerico);
        document.getElementById('moral_rfc')?.addEventListener('keydown', forzarSoloAlfanumerico);


        // --- Lógica para mostrar/ocultar secciones ---

        // Lógica para la sección SOLICITANTE: Cargo de gobierno.
        const radiosCargoGobierno = document.querySelectorAll('input[name="cargo_gobierno"]');
        const grupoDependencia = document.getElementById('cargo_dependencia_group');
        if (radiosCargoGobierno.length > 0 && grupoDependencia) {
            radiosCargoGobierno.forEach(radio => {
                radio.addEventListener('change', (event) => {
                    // Muestra el grupo de dependencia si se selecciona 'si', de lo contrario, lo oculta.
                    grupoDependencia.style.display = (event.target.value === 'si') ? 'block' : 'none';
                });
            });
        }

        // Lógica para la sección SOLICITANTE: Pregunta de embarazo.
        const selectSexo = document.getElementById('sexo_nacer');
        const fechaNacimientoInput = document.getElementById('fecha_nacimiento');
        const embarazoGroup = document.getElementById('embarazo_group');
        const embarazoDetails = document.getElementById('embarazo_details');
        if (selectSexo && fechaNacimientoInput && embarazoGroup) {
            // Función para alternar la visibilidad de la pregunta de embarazo.
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
                // La pregunta de embarazo se muestra solo si el sexo es femenino y la edad es 15 o más.
                embarazoGroup.style.display = (esFemenino && edad >= 15) ? 'block' : 'none';
                if (!esFemenino || edad < 15) {
                    embarazoDetails.style.display = 'none'; // Oculta los detalles si la pregunta no es relevante.
                }
            };
            selectSexo.addEventListener('change', toggleEmbarazoQuestion);
            fechaNacimientoInput.addEventListener('change', toggleEmbarazoQuestion);
        }
        if (embarazoGroup && embarazoDetails) {
            const radiosEmbarazo = embarazoGroup.querySelectorAll('input[name="embarazo"]');
            radiosEmbarazo.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    // Muestra los detalles de embarazo si se selecciona 'si'.
                    embarazoDetails.style.display = e.target.value === 'si' ? 'block' : 'none';
                });
            });
        }

        // Lógica para la sección DOMICILIO DEL TITULAR: Domicilio fiscal diferente.
        const checkDomicilioFiscalTitular = document.getElementById('domicilioFiscalDiferente');
        const domicilioFiscalContainerTitular = document.getElementById('domicilioFiscalContainer');
        if (checkDomicilioFiscalTitular && domicilioFiscalContainerTitular) {
            checkDomicilioFiscalTitular.addEventListener('change', (event) => {
                // Muestra el contenedor del domicilio fiscal si el checkbox está marcado.
                domicilioFiscalContainerTitular.style.display = event.target.checked ? 'grid' : 'none';
            });
        }

        // Lógica para la sección DATOS DEL CONTRATANTE: Contratante es titular.
        const radiosContratanteEsTitular = document.querySelectorAll('input[name="contratanteEsTitular"]');
        const datosContratanteContainer = document.getElementById('datosContratanteDiferenteContainer');
        if (radiosContratanteEsTitular.length > 0 && datosContratanteContainer) {
            radiosContratanteEsTitular.forEach(radio => {
                radio.addEventListener('change', (event) => {
                    // Muestra los campos de contratante diferente si se selecciona 'no'.
                    datosContratanteContainer.style.display = (event.target.value === 'no') ? 'block' : 'none';
                });
            });
        }

        // Lógica para la sección DATOS DEL CONTRATANTE: Tipo de contratante (física/moral).
        const radiosTipoContratante = document.querySelectorAll('input[name="tipo_contratante"]');
        const formPersonaFisica = document.getElementById('contratante_persona_fisica_container');
        const formPersonaMoral = document.getElementById('contratante_persona_moral_container');
        if (radiosTipoContratante.length > 0 && formPersonaFisica && formPersonaMoral) {
            radiosTipoContratante.forEach(radio => {
                radio.addEventListener('change', (event) => {
                    const esFisica = (event.target.value === 'fisica');
                    // Muestra el formulario correspondiente al tipo de contratante seleccionado.
                    formPersonaFisica.style.display = esFisica ? 'block' : 'none';
                    formPersonaMoral.style.display = esFisica ? 'none' : 'block';
                });
            });
        }

        // Lógica para la sección de ANTIGÜEDAD (en Detalles de Solicitud).
        const radiosAntiguedad = document.querySelectorAll('input[name="antiguedad"]');
        const detallesAntiguedad = document.getElementById('antiguedad_details');
        if (radiosAntiguedad.length > 0 && detallesAntiguedad) {
            radiosAntiguedad.forEach(radio => radio.addEventListener('change', (e) => {
                // Muestra los detalles de antigüedad si se selecciona 'si'.
                detallesAntiguedad.style.display = e.target.value === 'si' ? 'block' : 'none';
            }));
        }
    }

    /**
     * Muestra la sección del formulario especificada por el índice.
     * También actualiza la visibilidad de los botones de navegación y el estado de los elementos del menú.
     * @param {number} index - El índice de la sección a mostrar.
     */
    function showSection(index) {
        const mainForm = document.querySelector(config.domSelectors.form);
        if (!mainForm) return;

        // Determina si la sección actual es la de revisión final.
        const isReviewMode = config.menuItems[index].id === 'revision';
        // Agrega o quita la clase 'modo-revision' al formulario principal.
        mainForm.classList.toggle('modo-revision', isReviewMode);

        // Deshabilita o habilita todos los campos de entrada en las secciones
        // si el modo de revisión está activo (excepto los botones de navegación).
        state.formSections.forEach(section => {
            section.querySelectorAll('input, select, textarea, button').forEach(el => {
                if (el.id !== 'prev-btn' && el.id !== 'next-btn' && el.id !== 'submit-btn' && el.id !== 'edit-btn') {
                    el.disabled = isReviewMode;
                }
            });
        });

        // Si no estamos en modo revisión, muestra la sección actual y oculta las demás.
        if (!isReviewMode) {
            state.formSections.forEach((section, i) => {
                section.style.display = i === index ? 'block' : 'none';
            });
            // Añade una clase para indicar la sección activa para estilos.
            document.querySelectorAll(config.domSelectors.sections).forEach(sec => {
                if (sec.style.display === 'block') {
                    sec.classList.add('seccion-activa');
                } else {
                    sec.classList.remove('seccion-activa');
                }
            });
        }
        
        state.currentSectionIndex = index; // Actualiza el índice de la sección actual.

        // Si existe, muestra un modal persuasivo (función externa a este script).
        const modalType = config.menuItems[index].id;
        if (typeof window.showPersuasiveModal === 'function') {
            window.showPersuasiveModal(modalType);
        }
        
        // --- LÓGICA DEL INDICADOR DE COMPLETADO ---
        // Actualiza las clases 'active' y 'completed' en los elementos del menú lateral.
        document.querySelectorAll(config.domSelectors.menuItems).forEach((item, i) => {
            item.classList.toggle('active', i === index); // Marca la sección activa.
            // Si el índice del item es menor que el actual, se considera completado.
            if (i < index) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }
        });
        // --- FIN DE LA LÓGICA ---

        updateButtons();     // Actualiza la visibilidad de los botones de navegación.
        updateProgressBar(); // Actualiza el progreso del formulario.
    }
    
    /**
     * Actualiza la visibilidad de los botones de navegación (Anterior, Siguiente, Enviar, Editar)
     * basándose en la sección actual.
     */
    function updateButtons() {
        const isLastSection = state.currentSectionIndex === config.menuItems.length - 1;
        // El botón "Anterior" se muestra si no es la primera sección y no es la última.
        document.querySelector(config.domSelectors.prevBtn).style.display = (state.currentSectionIndex > 0 && !isLastSection) ? 'inline-block' : 'none';
        // El botón "Siguiente" se muestra si no es la última sección.
        document.querySelector(config.domSelectors.nextBtn).style.display = isLastSection ? 'none' : 'inline-block';
        // Los botones "Enviar" y "Editar" solo se muestran en la última sección (revisión).
        document.querySelector(config.domSelectors.submitBtn).style.display = isLastSection ? 'inline-block' : 'none';
        document.querySelector(config.domSelectors.editBtn).style.display = isLastSection ? 'inline-block' : 'none';
    }

    // --- 5. LÓGICA DE TEMAS Y SIDEBAR (TU CÓDIGO ORIGINAL) ---
    /**
     * Alterna el estado colapsado/expandido de la barra lateral
     * y guarda la preferencia en localStorage.
     */
    function toggleSidebar() {
        const isCollapsed = document.body.classList.contains('body-sidebar-collapsed');
        // Cambia la clase del body para alternar entre estados.
        document.body.classList.replace(isCollapsed ? 'body-sidebar-collapsed' : 'body-sidebar-expanded', isCollapsed ? 'body-sidebar-expanded' : 'body-sidebar-collapsed');
        // Guarda el nuevo estado en localStorage.
        localStorage.setItem(config.storageKeys.sidebarCollapsed, !isCollapsed);
    }

    /**
     * Establece el modo de tema de la aplicación (claro u oscuro).
     * @param {string} mode - 'light' o 'dark'.
     */
    function setThemeMode(mode) {
        state.isLightMode = mode === 'light'; // Actualiza el estado del modo claro.
        localStorage.setItem(config.storageKeys.themeMode, mode); // Guarda la preferencia en localStorage.
        document.documentElement.classList.toggle('light-theme', state.isLightMode); // Aplica/quita la clase al elemento <html>.
        
        // Cambia la fuente del logo de la barra lateral según el modo de tema.
        const logo = document.getElementById('logo-veler-sidebar');
        if (logo) {
            logo.src = state.isLightMode ? 'assets/img/VELER_LIGHT.png' : 'assets/img/VELER_DARK.png';
        }
    }

    /**
     * Aplica el archivo de tema de color CSS especificado a la aplicación.
     * @param {string} themeFile - La ruta del archivo CSS del tema.
     */
    function setThemePalette(themeFile) {
        const dynamicThemeLink = document.querySelector(config.domSelectors.dynamicThemeLink);
        if (dynamicThemeLink) {
            dynamicThemeLink.href = themeFile; // Cambia la URL del archivo CSS.
            localStorage.setItem(config.storageKeys.themeFile, themeFile); // Guarda la preferencia en localStorage.
        }
    }

    // --- 6. EJECUTAR LA APLICACIÓN ---
    initialize(); // Llama a la función de inicialización para arrancar la aplicación.

    /**
     * Configura la lógica interactiva para la sección de Actividades de Riesgo.
     * Maneja la visibilidad de los selectores de solicitantes y los campos de detalle
     * cuando se selecciona una actividad de riesgo.
     */
    function setupRiskActivities() {
        const actividadesItems = document.querySelectorAll('.actividad-riesgo-item');

        actividadesItems.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const asignacionContainer = item.querySelector('.asignacion-container');

            // Agrega un event listener al checkbox de cada actividad de riesgo.
            checkbox.addEventListener('change', (event) => {
                asignacionContainer.innerHTML = ''; // Limpia el contenedor de asignación al cambiar.
                
                if (event.target.checked) {
                    asignacionContainer.style.display = 'block'; // Muestra el contenedor si la actividad está marcada.
                    // Crea el selector de solicitantes para esta actividad.
                    crearSelectorDeSolicitantes(asignacionContainer, checkbox.value);
                } else {
                    asignacionContainer.style.display = 'none'; // Oculta el contenedor si la actividad no está marcada.
                }
            });
        });
    }

    /**
     * Crea y añade una lista de checkboxes para seleccionar a los solicitantes,
     * usando sus nombres si están disponibles, para una actividad específica.
     * @param {HTMLElement} container - El contenedor donde se añadirán los checkboxes.
     * @param {string} actividadValue - El valor de la actividad (ej. 'motocicleta', 'aviones').
     */
    function crearSelectorDeSolicitantes(container, actividadValue) {
        // 1. Crear el contenedor y la etiqueta de la pregunta.
        const selectorContainer = document.createElement('div');
        selectorContainer.className = 'form-group';
        const preguntaLabel = document.createElement('label');
        preguntaLabel.className = 'asignacion-label';
        preguntaLabel.textContent = '¿Quién(es) la practican?';
        selectorContainer.appendChild(preguntaLabel);

        // 2. Crear el div que contendrá todos los checkboxes de solicitantes.
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.className = 'solicitante-checkbox-container';

        // Contenedor para los campos de detalle de la actividad por solicitante.
        const detallesContainer = document.createElement('div');
        detallesContainer.className = 'detalles-por-solicitante-container';

        // 3. Llenar el wrapper con un checkbox por cada solicitante.
        for (let i = 1; i <= solicitanteCount; i++) {
            // --- INICIA LÓGICA PARA OBTENER EL NOMBRE DEL SOLICITANTE ---
            let nombreSolicitante = '';
            if (i === 1) {
                // Para el solicitante titular, el ID del campo de nombre no tiene sufijo.
                const nombreInput = document.getElementById('nombres');
                if (nombreInput && nombreInput.value) {
                    nombreSolicitante = nombreInput.value.split(' ')[0]; // Usa solo el primer nombre.
                }
            } else {
                // Para los solicitantes adicionales, el ID tiene un sufijo.
                const nombreInput = document.getElementById(`nombres_solicitante_${i}`);
                if (nombreInput && nombreInput.value) {
                    nombreSolicitante = nombreInput.value.split(' ')[0];
                }
            }
            
            // Texto final para la etiqueta del checkbox (incluye nombre si está disponible).
            const textoLabel = nombreSolicitante 
                ? `${i}.- ${nombreSolicitante}` 
                : (i === 1 ? 'Solicitante 1 - Titular' : `Solicitante ${i}`);
            // --- TERMINA LÓGICA PARA OBTENER EL NOMBRE ---

            const checkboxID = `${actividadValue}_solicitante_${i}`; // ID único para el checkbox.
            
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            
            checkbox.type = 'checkbox';
            checkbox.id = checkboxID;
            checkbox.name = `quien_practica_${actividadValue}`; // Nombre para agrupar los checkboxes.
            checkbox.value = i; // El valor es el índice del solicitante.
            
            // Agrega un event listener al checkbox para actualizar los campos de detalle.
            checkbox.addEventListener('change', () => {
                actualizarCamposDeDetalle(checkboxWrapper, detallesContainer, actividadValue);
            });

            label.appendChild(checkbox);
            label.append(` ${textoLabel}`); // Añade el texto dinámico.
            
            checkboxWrapper.appendChild(label);
        }
        
        // 4. Añadir los nuevos elementos al DOM.
        selectorContainer.appendChild(checkboxWrapper);
        container.appendChild(selectorContainer);
        container.appendChild(detallesContainer);
    }

    /**
     * Muestra u oculta los campos de detalle para una actividad específica
     * según los checkboxes de solicitantes marcados.
     * @param {HTMLElement} checkboxWrapper - El contenedor de los checkboxes de solicitantes.
     * @param {HTMLElement} container - El contenedor donde se renderizarán los detalles.
     * @param {string} actividadValue - El valor de la actividad de riesgo.
     */
    function actualizarCamposDeDetalle(checkboxWrapper, container, actividadValue) {
        container.innerHTML = ''; // Limpia los detalles anteriores.
        
        // Obtiene todos los checkboxes marcados dentro del contenedor.
        const checkboxesSeleccionados = checkboxWrapper.querySelectorAll('input[type="checkbox"]:checked');
        
        // Verifica si existe una plantilla de detalles para esta actividad.
        if (detalleActividadesPlantillas[actividadValue]) {
            // Para cada solicitante seleccionado, añade la plantilla de detalles.
            checkboxesSeleccionados.forEach(checkbox => {
                const index = checkbox.value; // Obtiene el índice del solicitante.
                const sufijo = `_solicitante_${index}`; // Crea el sufijo para IDs/nombres.
                const plantillaFn = detalleActividadesPlantillas[actividadValue]; // Obtiene la función de plantilla.
                container.innerHTML += plantillaFn(sufijo); // Agrega el HTML de la plantilla.
            });
        }
    }

    // --- SECCIÓN DE HÁBITOS (VERSIÓN FINAL Y CORRECTA) ---
    /**
     * Configura la lógica interactiva para la sección de Hábitos.
     * Maneja la aparición de los asignadores de solicitantes y los detalles de los hábitos.
     */
    function setupHabits() {
        const seccionHabitos = document.getElementById('seccion-habitos');
        if (!seccionHabitos) return;

        // Usa un solo event listener delegado para toda la sección de hábitos
        // para manejar los cambios en los checkboxes de hábitos, checkboxes de solicitantes
        // y radio buttons de "actualmente".
        seccionHabitos.addEventListener('change', (event) => {
            const target = event.target;

            // 1. Si se marca el checkbox principal de un hábito (ej. "Fumar").
            if (target.matches('input[name="habito_check"]')) {
                // Encuentra el contenedor de asignación para este hábito.
                const asignacionContainer = target.closest('.habito-item').querySelector('.asignacion-container');
                asignacionContainer.innerHTML = ''; // Limpia el contenedor.
                if (target.checked) {
                    asignacionContainer.style.display = 'block'; // Muestra el contenedor.
                    // Crea los checkboxes de solicitantes para este hábito.
                    crearAsignadorDeHabitos(asignacionContainer, target.value);
                } else {
                    asignacionContainer.style.display = 'none'; // Oculta el contenedor.
                }
            }

            // 2. Si se marca el checkbox de un solicitante dentro de un hábito.
            if (target.matches('.solicitante-checkbox')) {
                const asignacionContainer = target.closest('.asignacion-container');
                // Actualiza los detalles del hábito para los solicitantes seleccionados.
                actualizarDetallesDeHabito(asignacionContainer);
            }

            // 3. Si se cambia el radio button de "actualmente" (ej. "Fumador actualmente: Sí/No").
            if (target.matches('input[type="radio"][name*="_actualmente"]')) {
                // Encuentra el contenedor de detalles de hábito específico para el solicitante.
                const detalleContainer = target.closest('.detalle-habito-solicitante');
                if (!detalleContainer) return;

                const habito = detalleContainer.dataset.habitoDetalle; // Obtiene el tipo de hábito (fumar, alcohol, drogas).
                const detallesSi = detalleContainer.querySelector(`.${habito}_details`); // Contenedor para detalles si "sí".
                const detallesNo = detalleContainer.querySelector(`.no_${habito}_details`); // Contenedor para detalles si "no".

                if (detallesSi && detallesNo) {
                    // Muestra/oculta los detalles correspondientes según la selección.
                    detallesSi.style.display = (target.value === 'si') ? 'block' : 'none';
                    detallesNo.style.display = (target.value === 'no') ? 'block' : 'none';
                }
            }
        });
    }

    /**
     * Crea los checkboxes para asignar un hábito a los solicitantes.
     * @param {HTMLElement} container - El contenedor donde se añadirán los elementos.
     * @param {string} habitoValue - El valor del hábito (ej. 'fumar').
     */
    function crearAsignadorDeHabitos(container, habitoValue) {
        // Inserta la estructura básica para los checkboxes de solicitantes y el contenedor de detalles.
        container.innerHTML = `
            <div class="form-group">
                <label class="asignacion-label">¿Quién(es)?</label>
                <div class="solicitante-checkbox-container"></div>
            </div>
            <div class="detalles-por-solicitante-container"></div>`;
        
        const checkboxWrapper = container.querySelector('.solicitante-checkbox-container');
        // Para cada solicitante, crea un checkbox con su nombre (o un texto por defecto).
        for (let i = 1; i <= solicitanteCount; i++) {
            const nombre = document.getElementById(i === 1 ? 'nombres' : `nombres_solicitante_${i}`)?.value.split(' ')[0] || '';
            const textoLabel = nombre ? `${i}.- ${nombre}` : (i === 1 ? 'Solicitante 1 - Titular' : `Solicitante ${i}`);
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = i;
            checkbox.className = 'solicitante-checkbox';
            checkbox.dataset.habito = habitoValue; // Almacena el hábito asociado al checkbox.
            label.append(checkbox, ` ${textoLabel}`);
            checkboxWrapper.appendChild(label);
        }
    }

    /**
     * Actualiza y renderiza los campos de detalle específicos para cada hábito
     * basándose en los solicitantes seleccionados.
     * @param {HTMLElement} container - El contenedor principal de asignación del hábito.
     */
    function actualizarDetallesDeHabito(container) {
        const detallesContainer = container.querySelector('.detalles-por-solicitante-container');
        const checkboxesSeleccionados = container.querySelectorAll('.solicitante-checkbox:checked');
        detallesContainer.innerHTML = ''; // Limpia los detalles anteriores.
        
        // Para cada solicitante seleccionado, busca la plantilla de detalles del hábito
        // y la añade al contenedor.
        checkboxesSeleccionados.forEach(checkbox => {
            const habitoValue = checkbox.dataset.habito;
            const plantillaFn = detalleHabitosPlantillas[habitoValue];
            if (plantillaFn) {
                const index = checkbox.value;
                const sufijo = `_solicitante_${index}`;
                detallesContainer.innerHTML += plantillaFn(sufijo); // Agrega el HTML de la plantilla.
            }
        });
    }

    /**
     * Configura la lógica interactiva para la sección de Deportes.
     * Maneja la visibilidad de los asignadores de solicitantes para cada categoría de deporte.
     */
    function setupSports() {
        document.querySelectorAll('.deporte-categoria-item').forEach(item => {
            const checkCategoria = item.querySelector('input[name="deporte_categoria_check"]');
            const asignacionContainer = item.querySelector('.asignacion-container');

            // Agrega un event listener al checkbox de categoría de deporte (amateur/profesional).
            checkCategoria.addEventListener('change', event => {
                asignacionContainer.innerHTML = ''; // Limpia el contenedor de asignación al cambiar.
                if (event.target.checked) {
                    asignacionContainer.style.display = 'block'; // Muestra el contenedor si la categoría está marcada.
                    // Crea el asignador de deportes para esta categoría.
                    crearAsignadorDeDeportes(asignacionContainer, checkCategoria.value);
                } else {
                    asignacionContainer.style.display = 'none'; // Oculta el contenedor.
                }
            });
        });
    }

    /**
     * Crea la lista de checkboxes de solicitantes para asignar una categoría de deporte
     * (amateur/profesional).
     * @param {HTMLElement} container - El contenedor donde se añadirán los elementos.
     * @param {string} categoria - La categoría del deporte ('amateur' o 'profesional').
     */
    function crearAsignadorDeDeportes(container, categoria) {
        // Inserta la estructura básica para los checkboxes de solicitantes y el contenedor de detalles.
        container.innerHTML = `
            <div class="form-group">
                <label class="asignacion-label">¿Quién(es) lo practican?</label>
                <div class="solicitante-checkbox-container"></div>
            </div>
            <div class="detalles-por-solicitante-container"></div>
        `;

        const checkboxWrapper = container.querySelector('.solicitante-checkbox-container');
        const detallesContainer = container.querySelector('.detalles-por-solicitante-container');

        // Para cada solicitante, crea un checkbox para asignación de deporte.
        for (let i = 1; i <= solicitanteCount; i++) {
            const nombre = document.getElementById(i === 1 ? 'nombres' : `nombres_solicitante_${i}`)?.value.split(' ')[0] || '';
            const textoLabel = nombre ? `${i}.- ${nombre}` : (i === 1 ? 'Solicitante 1 - Titular' : `Solicitante ${i}`);
            
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = i;
            label.append(checkbox, ` ${textoLabel}`);
            
            // Agrega un event listener para actualizar el bloque de deportes cuando se selecciona/deselecciona un solicitante.
            checkbox.addEventListener('change', () => actualizarBloqueDeportesPersona(checkbox, detallesContainer, categoria));
            checkboxWrapper.appendChild(label);
        }
    }

    /**
     * Muestra u oculta el bloque de gestión de deportes para una persona específica,
     * y habilita el botón para añadir deportes a esa persona.
     * @param {HTMLInputElement} checkbox - El checkbox del solicitante.
     * @param {HTMLElement} container - El contenedor donde se mostrarán los bloques de deportes.
     * @param {string} categoria - La categoría del deporte ('amateur' o 'profesional').
     */
    function actualizarBloqueDeportesPersona(checkbox, container, categoria) {
        const solicitanteIndex = checkbox.value;
        const bloqueExistente = container.querySelector(`#bloque_deportes_${categoria}_${solicitanteIndex}`);

        if (checkbox.checked && !bloqueExistente) {
            // Si el solicitante está marcado y el bloque no existe, lo crea.
            const nombre = document.getElementById(solicitanteIndex === '1' ? 'nombres' : `nombres_solicitante_${solicitanteIndex}`)?.value || `Solicitante ${solicitanteIndex}`;
            const nuevoBloque = document.createElement('div');
            nuevoBloque.id = `bloque_deportes_${categoria}_${solicitanteIndex}`;
            nuevoBloque.className = 'detalle-actividad-solicitante'; // Reutiliza clase de estilo.
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
            
            // Asigna evento al nuevo botón "Agregar Deporte" para añadir filas de deportes.
            nuevoBloque.querySelector('.btn-agregar-deporte').addEventListener('click', () => {
                agregarFilaDeporte(nuevoBloque.querySelector('.lista-deportes-container'), categoria, solicitanteIndex);
            });

        } else if (!checkbox.checked && bloqueExistente) {
            // Si el solicitante está desmarcado y el bloque existe, lo elimina.
            bloqueExistente.remove();
        }
    }

    /**
     * Añade una nueva fila para registrar un deporte específico dentro de un bloque de solicitante.
     * @param {HTMLElement} container - El contenedor de la lista de deportes para un solicitante.
     * @param {string} categoria - La categoría del deporte ('amateur' o 'profesional').
     * @param {string} solicitanteIndex - El índice del solicitante al que pertenece el deporte.
     */
    function agregarFilaDeporte(container, categoria, solicitanteIndex) {
        const numDeportes = container.querySelectorAll('.deporte-fila').length;
        // Crea un sufijo único para los campos de este deporte.
        const sufijo = `_solicitante_${solicitanteIndex}_${numDeportes}`;
        const plantillaFn = detalleDeportesPlantillas[categoria]; // Obtiene la plantilla de deporte.
        
        const divFila = document.createElement('div');
        divFila.innerHTML = plantillaFn(sufijo); // Genera el HTML de la fila del deporte.

        // Asigna evento al nuevo botón "Eliminar" para remover esta fila.
        divFila.querySelector('.btn-remover-fila').addEventListener('click', (e) => {
            e.target.closest('.deporte-fila').remove();
        });

        container.appendChild(divFila.firstElementChild); // Añade la fila al contenedor.
    }

    /**
     * Configura la lógica interactiva para la sección de Información Médica.
     * Maneja la aparición del botón "Agregar Padecimiento" y la adición de nuevos formularios de padecimiento.
     */
    function setupMedicalInfo() {
        const checkPreguntas = document.querySelectorAll('input[name="pregunta_medica"]');
        const contenedorAccion = document.getElementById('contenedor-accion-padecimiento');
        const btnAgregar = document.getElementById('btn-agregar-padecimiento');
        const listaFormsContainer = document.getElementById('lista-padecimientos-forms');
        let padecimientoCounter = 0; // Contador para generar IDs únicos para los padecimientos.

        /**
         * Alterna la visibilidad del botón "Agregar Padecimiento"
         * y limpia los formularios si no hay preguntas marcadas.
         */
        const toggleAgregarBoton = () => {
            // Verifica si al menos una pregunta médica está marcada.
            const algunoMarcado = Array.from(checkPreguntas).some(c => c.checked);
            contenedorAccion.style.display = algunoMarcado ? 'block' : 'none';
            
            // CAMBIO: Si ninguna pregunta está marcada, limpia los formularios agregados.
            if (!algunoMarcado) {
                listaFormsContainer.innerHTML = ''; // Elimina todos los formularios de padecimiento.
                padecimientoCounter = 0; // Resetea el contador de padecimientos.
            }
        };

        // Agrega un event listener a cada checkbox de pregunta médica.
        checkPreguntas.forEach(check => check.addEventListener('change', toggleAgregarBoton));

        // Agrega un event listener al botón "Agregar Padecimiento".
        btnAgregar.addEventListener('click', () => {
            padecimientoCounter++; // Incrementa el contador de padecimientos.
            const sufijo = `_pad_${padecimientoCounter}`; // Genera un sufijo único.
            const nuevoFormHTML = crearFormularioPadecimientoHTML(sufijo); // Crea el HTML del formulario.

            const divTemporal = document.createElement('div');
            divTemporal.innerHTML = nuevoFormHTML; // Inserta el HTML en un div temporal.

            activarLogicaFormularioPadecimiento(divTemporal, sufijo); // Activa la lógica condicional del nuevo formulario.
            llenarDesplegablesPadecimiento(divTemporal, sufijo); // Rellena los selectores del nuevo formulario.

            listaFormsContainer.appendChild(divTemporal.firstElementChild); // Añade el formulario al DOM.
        });
    }

    /**
     * Crea el HTML para un nuevo formulario de detalle de padecimiento.
     * (Versión actualizada con todos los campos y labels corregidos).
     * @param {string} sufijo - Sufijo único para los IDs y nombres de los campos.
     * @returns {string} El HTML del formulario de padecimiento.
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
     * Esto incluye el botón de eliminar y la visibilidad de campos de complicación y medicamentos.
     * @param {HTMLElement} container - El contenedor del formulario de padecimiento.
     * @param {string} sufijo - Sufijo único del formulario de padecimiento.
     */
    function activarLogicaFormularioPadecimiento(container, sufijo) {
        // Event listener para el botón de eliminar el padecimiento.
        container.querySelector('.btn-remover-item').addEventListener('click', (e) => {
            e.target.closest('.item-registrado-card').remove(); // Elimina la tarjeta completa.
        });

        // Lógica para mostrar/ocultar el campo "En caso afirmativo: ¿Cuál?" para complicaciones.
        const compRadios = container.querySelectorAll(`input[name="padecimiento_comp${sufijo}"]`);
        const compCualGroup = container.querySelector(`#padecimiento_comp_cual${sufijo}`).closest('.form-group');
        compRadios.forEach(r => r.addEventListener('change', e => compCualGroup.style.display = e.target.value === 'si' ? 'block' : 'none'));

        // Lógica para mostrar/ocultar el campo "En caso afirmativo: ¿Cuál?" para medicamentos.
        const medsRadios = container.querySelectorAll(`input[name="padecimiento_meds${sufijo}"]`);
        const medsCualGroup = container.querySelector(`#padecimiento_meds_cual${sufijo}`).closest('.form-group');
        medsRadios.forEach(r => r.addEventListener('change', e => medsCualGroup.style.display = e.target.value === 'si' ? 'block' : 'none'));
    }

    /**
     * Llena los menús desplegables (selectores) de un formulario de padecimiento específico
     * con la lista de solicitantes y las preguntas médicas marcadas.
     * @param {HTMLElement} container - El contenedor del formulario de padecimiento.
     * @param {string} sufijo - Sufijo único del formulario de padecimiento.
     */
    function llenarDesplegablesPadecimiento(container, sufijo) {
        // Llenar el selector de solicitantes.
        const selectSolicitante = container.querySelector(`#padecimiento_solicitante${sufijo}`);
        selectSolicitante.innerHTML = '<option value="">Seleccione...</option>'; // Opción por defecto.
        for (let i = 1; i <= solicitanteCount; i++) {
            const nombre = document.getElementById(i === 1 ? 'nombres' : `nombres_solicitante_${i}`)?.value || `Solicitante ${i}`;
            selectSolicitante.innerHTML += `<option value="${i}">${i}.- ${nombre}</option>`; // Agrega una opción por cada solicitante.
        }

        // Llenar el selector de preguntas médicas.
        const selectPregunta = container.querySelector(`#padecimiento_pregunta${sufijo}`);
        selectPregunta.innerHTML = '<option value="">Seleccione...</option>'; // Opción por defecto.
        // Itera sobre las preguntas médicas que están marcadas y las añade como opciones.
        document.querySelectorAll('input[name="pregunta_medica"]:checked').forEach(check => {
            // Obtiene el texto de la etiqueta de la pregunta, truncándolo si es muy largo.
            const label = check.closest('label').textContent.trim().substring(0, 50) + '...';
            selectPregunta.innerHTML += `<option value="${check.value}">${label}</option>`;
        });
    }

    /**
     * Configura la lógica interactiva para la sección de Detalles de la Solicitud.
     * Incluye la auto-generación de la fecha de solicitud y la lógica para viajes al extranjero.
     */
    function setupSolicitudDetails() {
        // 1. Llenar la fecha de solicitud automáticamente con la fecha actual.
        const fechaSolicitudInput = document.getElementById('fecha_solicitud');
        if (fechaSolicitudInput) {
            fechaSolicitudInput.valueAsDate = new Date();
        }

        // 2. Lógica para la pregunta de viaje al extranjero.
        const checkViaje = document.querySelector('input[name="viaje_extranjero_check"]');
        const asignacionContainer = document.getElementById('viaje-asignacion-container');

        if (checkViaje && asignacionContainer) {
            checkViaje.addEventListener('change', event => {
                asignacionContainer.innerHTML = ''; // Limpia el contenedor de asignación.
                if (event.target.checked) {
                    asignacionContainer.style.display = 'block'; // Muestra el contenedor.
                    // Usa una función genérica para crear los checkboxes de solicitantes para viajes.
                    crearAsignadorGenerico(asignacionContainer, 'viaje', detalleViajePlantilla);
                } else {
                    asignacionContainer.style.display = 'none'; // Oculta el contenedor.
                }
            });
        }

        // 3. La lógica para la antigüedad (esta ya debería estar en setupConditionalFields).
        // Se asegura que siga funcionando si se mueve o se llama por separado.
        const radiosAntiguedad = document.querySelectorAll('input[name="antiguedad"]');
        const detallesAntiguedad = document.getElementById('antiguedad_details');
        if (radiosAntiguedad.length > 0 && detallesAntiguedad) {
            radiosAntiguedad.forEach(radio => radio.addEventListener('change', (e) => {
                detallesAntiguedad.style.display = e.target.value === 'si' ? 'block' : 'none';
            }));
        }
    }

    /**
     * Función genérica para crear un asignador de solicitantes (checkboxes)
     * y gestionar la visibilidad de los detalles asociados, usando una plantilla.
     * Esta función se utiliza para "Viaje al extranjero" y puede ser reutilizada
     * para otras secciones que requieran asignar una característica a múltiples solicitantes.
     * @param {HTMLElement} container - El contenedor donde se añadirán los elementos.
     * @param {string} tipo - El tipo de característica (ej. 'viaje').
     * @param {function} plantillaFn - La función de plantilla que genera el HTML de detalle.
     */
    function crearAsignadorGenerico(container, tipo, plantillaFn) {
        container.innerHTML = `
            <div class="form-group">
                <label class="asignacion-label">¿Quién(es)?</label>
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
            checkbox.value = i; // El valor es el índice del solicitante
            label.append(checkbox, ` ${textoLabel}`);
            
            checkbox.addEventListener('change', () => {
                actualizarDetallesGenerico(checkboxWrapper, detallesContainer, tipo, plantillaFn);
            });
            checkboxWrapper.appendChild(label);
        }
    }

    /**
     * Actualiza y renderiza los campos de detalle específicos para una característica genérica
     * (ej. viaje) basándose en los solicitantes seleccionados.
     * @param {HTMLElement} checkboxWrapper - El contenedor de los checkboxes de solicitantes.
     * @param {HTMLElement} container - El contenedor donde se renderizarán los detalles.
     * @param {string} tipo - El tipo de característica (ej. 'viaje').
     * @param {function} plantillaFn - La función de plantilla que genera el HTML de detalle.
     */
    function actualizarDetallesGenerico(checkboxWrapper, container, tipo, plantillaFn) {
        container.innerHTML = ''; // Limpia los detalles anteriores.
        
        const checkboxesSeleccionados = checkboxWrapper.querySelectorAll('input[type="checkbox"]:checked');
        
        checkboxesSeleccionados.forEach(checkbox => {
            const index = checkbox.value; // Obtiene el índice del solicitante.
            const sufijo = `_solicitante_${index}`; // Crea el sufijo para IDs/nombres.
            container.innerHTML += plantillaFn(sufijo); // Agrega el HTML de la plantilla de detalle.
        });
    }

    /**
     * Configura la lógica interactiva para la sección de Forma de Pago.
     * Muestra/oculta los campos de detalle según el medio de pago seleccionado
     * y aplica validación para permitir solo números en campos específicos.
     */
    function setupPaymentForm() {
        const medioPagoSelect = document.getElementById('pago_medio');
        if (!medioPagoSelect) return;

        const tarjetaDetails = document.getElementById('pago_tarjeta_details');
        const clabeDetails = document.getElementById('pago_clabe_details');

        // --- INICIA EL CÓDIGO NUEVO ---
        // Función "guardián" para permitir solo números (reutilizada de setupConditionalFields).
        const forzarSoloNumeros = (event) => {
            if (/[^0-9]/.test(event.key) && !event.ctrlKey && !event.metaKey && event.key.length === 1) {
                event.preventDefault();
            }
        };

        // Aplica el "guardián" a los campos numéricos de la forma de pago.
        const camposNumericos = ['tarjeta_numero', 'tarjeta_cvv', 'clabe_numero'];
        camposNumericos.forEach(id => {
            const campo = document.getElementById(id);
            if (campo) {
                campo.addEventListener('keydown', forzarSoloNumeros);
            }
        });
        // --- TERMINA EL CÓDIGO NUEVO ---

        // La lógica para mostrar/ocultar los contenedores de detalles de pago.
        medioPagoSelect.addEventListener('change', (event) => {
            const seleccion = event.target.value;
            
            // Oculta ambos contenedores de detalles inicialmente.
            if(tarjetaDetails) tarjetaDetails.style.display = 'none';
            if(clabeDetails) clabeDetails.style.display = 'none';

            // Muestra el contenedor correspondiente a la selección del medio de pago.
            if (seleccion === 'tarjeta' && tarjetaDetails) {
                tarjetaDetails.style.display = 'block';
            } else if (seleccion === 'clabe' && clabeDetails) {
                clabeDetails.style.display = 'block';
            }
        });
    }

    /**
     * Calcula y actualiza la barra de progreso del formulario.
     * Considera solo los campos 'required' que están visibles (no ocultos por lógica condicional).
     */
    function updateProgressBar() {
        const progressBarFill = document.getElementById('progress-bar-fill');
        const progressBarText = document.getElementById('progress-bar-text');
        if (!progressBarFill || !progressBarText) return; // Salir si los elementos no existen.

        // 1. Obtenemos TODOS los campos con el atributo 'required'.
        const allPotentialFields = document.querySelectorAll('#miFormularioDinamico [required]');

        // 2. Filtramos para obtener solo los campos que son "realmente" requeridos.
        //    Un campo es "realmente" requerido si no está dentro de un contenedor condicional oculto.
        const activeRequiredFields = Array.from(allPotentialFields).filter(field => {
            let parent = field.parentElement;
            // Subimos por el DOM desde el campo hasta la sección del formulario o hasta que no haya más padres.
            while (parent && !parent.classList.contains('seccion-formulario')) {
                // Si encontramos un padre con `display: none`, significa que el campo está oculto
                // por lógica condicional, por lo tanto, no se cuenta para el progreso.
                if (parent.style.display === 'none') {
                    return false;
                }
                parent = parent.parentElement;
            }
            // Si llegamos hasta la sección sin encontrar un padre oculto, el campo es válido y visible.
            return true;
        });

        // Si no hay campos requeridos activos, el progreso es 0%.
        if (activeRequiredFields.length === 0) {
            progressBarFill.style.width = '0%';
            progressBarText.textContent = '0% completado';
            return;
        }

        // 3. Contamos cuántos de esos campos activos ya están llenos.
        const completedFields = activeRequiredFields.filter(field => {
            if (field.type === 'checkbox') {
                return field.checked; // Los checkboxes se consideran llenos si están marcados.
            }
            if (field.type === 'radio') {
                // Los radio buttons se consideran llenos si al menos una opción de su grupo está marcada.
                return document.querySelector(`input[name="${field.name}"]:checked`);
            }
            // Para los demás campos (text, select, date, number, etc.), se consideran llenos si no están vacíos.
            return field.value.trim() !== '';
        }).length;

        // 4. Calculamos y mostramos el porcentaje de progreso.
        const percentage = Math.round((completedFields / activeRequiredFields.length) * 100);
        
        progressBarFill.style.width = `${percentage}%`;
        progressBarText.textContent = `${percentage}% completado`;
    }

}); // Fin del event listener DOMContentLoaded
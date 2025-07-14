// assets/js/base/_sidebar.js

/*
 * =================================================================
 * MÓDULO DE LA BARRA LATERAL (_sidebar.js)
 * =================================================================
 * Este módulo se encarga de la inicialización y renderizado de la
 * barra de navegación lateral (sidebar), así como de la lógica
 * para sus botones de control en escritorio y móvil.
 * =================================================================
 */

/**
 * @function initializeSidebar
 * @description Inicializa la barra lateral completa. Renderiza su estructura base,
 * crea un botón de colapso para la vista de escritorio y un botón de menú
 * "hamburguesa" para la vista móvil que se inyecta dinámicamente en la cabecera.
 * @param {HTMLElement} sidebarContainer - El elemento <aside> que contendrá el sidebar.
 * @param {Array} menuItems - Un array de objetos que definen los elementos del menú.
 * @param {string} initialLogoSrc - La ruta a la imagen del logo que se debe cargar inicialmente.
 */
export function initializeSidebar(sidebarContainer, menuItems, initialLogoSrc) {
    // Verifica si el contenedor del sidebar existe antes de continuar.
    if (!sidebarContainer) {
        // Línea de depuración para la consola, como pediste.
        console.error("DEBUG: Contenedor del sidebar no fue proporcionado. No se puede inicializar.");
        return;
    }

    // --- 1. RENDERIZADO DEL SIDEBAR (SIN BOTONES) ---
    // Se renderiza una estructura limpia del sidebar. Los botones de control
    // se crean y gestionan por separado para mayor flexibilidad.
    sidebarContainer.innerHTML = `
        <div class="sidebar-top-area">
            <img id="logo-veler-sidebar" src="${initialLogoSrc}" alt="Logo Veler Technologies">
        </div>
        <div class="sidebar-bottom-area">
            <nav class="sidebar-menu"><ul id="sidebar-menu-dinamico" class="menu-navegacion"></ul></nav>
        </div>
    `;

    // Obtiene el elemento <ul> donde se renderizarán los items del menú.
    const menuElement = document.getElementById('sidebar-menu-dinamico');
    if (menuElement) {
        // Llama a la función para renderizar los elementos del menú.
        renderMenuItems(menuElement, menuItems);
    }

    // --- 2. MANEJO DEL BOTÓN DE ESCRITORIO (COLAPSAR/EXPANDIR) ---
    // Este botón solo es visible en la vista de escritorio.
    const desktopToggleButton = document.createElement('button');
    desktopToggleButton.className = 'sidebar-toggle-desktop material-symbols-outlined';
    desktopToggleButton.title = 'Contraer/Expandir menú';
    desktopToggleButton.innerHTML = 'menu_open';
    // Añade el botón al área superior del sidebar.
    sidebarContainer.querySelector('.sidebar-top-area').appendChild(desktopToggleButton);

    // Añade el event listener para alternar la clase que colapsa/expande el sidebar.
    desktopToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('body-sidebar-collapsed');
        // Guarda el estado (colapsado o no) en localStorage para recordarlo en futuras visitas.
        localStorage.setItem('sidebar_collapsed', document.body.classList.contains('body-sidebar-collapsed'));
    });

    // Al cargar la página, aplica el estado guardado si estamos en vista de escritorio.
    if (window.innerWidth > 767 && localStorage.getItem('sidebar_collapsed') === 'true') {
        document.body.classList.add('body-sidebar-collapsed');
    }

    // --- 3. MANEJO DEL BOTÓN MÓVIL (MENÚ HAMBURGUESA) ---
    // Este botón se inyecta en la cabecera y solo es visible en la vista móvil.
    const header = document.querySelector('#main-header .header-content-wrapper');
    if (!header) {
        // Línea de depuración.
        console.error("DEBUG: Contenedor del header (.header-content-wrapper) no encontrado. El botón móvil no se puede crear.");
        return;
    }

    const mobileToggleButton = document.createElement('button');
    mobileToggleButton.id = 'mobile-sidebar-toggle';
    mobileToggleButton.className = 'mobile-sidebar-toggle';
    mobileToggleButton.setAttribute('aria-label', 'Abrir menú');
    mobileToggleButton.innerHTML = `<span class="material-symbols-outlined">menu</span>`;

    // Función que se encarga de AÑADIR o QUITAR el botón móvil del DOM
    // según el tamaño de la pantalla.
    const handleResize = () => {
        const isMobile = window.innerWidth <= 767;
        const buttonExists = header.contains(mobileToggleButton);

        if (isMobile && !buttonExists) {
            // Si es móvil y el botón no existe, lo añade al principio de la cabecera.
            header.prepend(mobileToggleButton);
        } else if (!isMobile && buttonExists) {
            // Si no es móvil y el botón existe, lo quita.
            header.removeChild(mobileToggleButton);
            // Limpieza: se asegura que el menú se cierre al pasar a la vista de escritorio.
            document.body.classList.remove('sidebar-visible');
        }
    };

    // Evento de clic para el botón móvil.
    mobileToggleButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que otros eventos de clic se disparen.
        // Alterna la clase 'sidebar-visible' en el body para mostrar/ocultar el menú.
        const isVisible = document.body.classList.toggle('sidebar-visible');

        // Cambia el ícono del botón (menú/cerrar) para una mejor experiencia de usuario.
        mobileToggleButton.innerHTML = `<span class="material-symbols-outlined">${isVisible ? 'close' : 'menu'}</span>`;
    });

    // Ejecuta la lógica de redimensionamiento al cargar la página y cada vez que la ventana cambia de tamaño.
    handleResize();
    window.addEventListener('resize', handleResize);
}

/**
 * @function renderMenuItems
 * @description Renderiza la lista de elementos del menú dentro del elemento <ul> proporcionado.
 * @param {HTMLElement} menuElement - El elemento <ul> donde se insertarán los items.
 * @param {Array} menuItems - El array de configuración de los items del menú.
 */
function renderMenuItems(menuElement, menuItems) {
    menuElement.innerHTML = ''; // Limpia el menú para evitar duplicados si se llama varias veces.
    // Itera sobre la configuración de los items del menú.
    menuItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'menu-item';
        // Añade 'data attributes' para identificar la sección y su índice, útil para la navegación.
        li.dataset.sectionId = `seccion-${item.id}`;
        li.dataset.sectionIndex = index;
        // Crea el HTML interno del elemento del menú con su icono y texto.
        li.innerHTML = `<span class="menu-icon material-symbols-outlined">${item.icon}</span><span class="menu-text">${item.text}</span>`;
        menuElement.appendChild(li);
    });
}

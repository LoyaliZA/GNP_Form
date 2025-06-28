// assets/js/base/_sidebar.js

/**
 * Inicializa la barra lateral completa, creando un botón de colapso para escritorio
 * y un botón de menú "hamburguesa" para la vista móvil que se inyecta en el header.
 * @param {HTMLElement} sidebarContainer - El elemento <aside> que contendrá el sidebar.
 * @param {Array} menuItems - Un array de objetos que definen los elementos del menú.
 * @param {string} initialLogoSrc - La ruta a la imagen del logo que se debe cargar inicialmente.
 */
export function initializeSidebar(sidebarContainer, menuItems, initialLogoSrc) {
    if (!sidebarContainer) {
        // Línea de depuración, como pediste.
        console.error("DEBUG: Contenedor del sidebar no fue proporcionado. No se puede inicializar.");
        return;
    }

    // --- 1. RENDERIZADO DEL SIDEBAR (SIN BOTONES) ---
    // Se renderiza una estructura limpia. Los botones se gestionan por separado.
    sidebarContainer.innerHTML = `
        <div class="sidebar-top-area">
            <img id="logo-veler-sidebar" src="${initialLogoSrc}" alt="Logo Veler Technologies">
            </div>
        <div class="sidebar-bottom-area">
            <nav class="sidebar-menu"><ul id="sidebar-menu-dinamico" class="menu-navegacion"></ul></nav>
        </div>
    `;

    const menuElement = document.getElementById('sidebar-menu-dinamico');
    if (menuElement) {
        renderMenuItems(menuElement, menuItems);
    }

    // --- 2. MANEJO DEL BOTÓN DE ESCRITORIO (COLAPSAR/EXPANDIR) ---
    // Se usa una clase específica (.sidebar-toggle-desktop) para no entrar en conflicto.
    const desktopToggleButton = document.createElement('button');
    desktopToggleButton.className = 'sidebar-toggle-desktop material-symbols-outlined';
    desktopToggleButton.title = 'Contraer/Expandir menú';
    desktopToggleButton.innerHTML = 'menu_open';
    sidebarContainer.querySelector('.sidebar-top-area').appendChild(desktopToggleButton);

    desktopToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('body-sidebar-collapsed');
        localStorage.setItem('sidebar_collapsed', document.body.classList.contains('body-sidebar-collapsed'));
    });

    // Aplicar estado guardado solo en vista de escritorio.
    if (window.innerWidth > 767 && localStorage.getItem('sidebar_collapsed') === 'true') {
        document.body.classList.add('body-sidebar-collapsed');
    }

    // --- 3. MANEJO DEL BOTÓN MÓVIL (MENÚ HAMBURGUESA) ---
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

    // Lógica para AÑADIR/QUITAR el botón móvil según el tamaño de la pantalla.
    const handleResize = () => {
        const isMobile = window.innerWidth <= 767;
        const buttonExists = header.contains(mobileToggleButton);

        if (isMobile && !buttonExists) {
            header.prepend(mobileToggleButton); // Lo añade al principio del header.
        } else if (!isMobile && buttonExists) {
            header.removeChild(mobileToggleButton);
            document.body.classList.remove('sidebar-visible'); // Limpieza: se asegura que el menú se cierre al pasar a desktop.
        }
    };

    // Evento de clic para el botón móvil.
    mobileToggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = document.body.classList.toggle('sidebar-visible');

        // Cambiar el ícono dinámicamente para mejor UX.
        mobileToggleButton.innerHTML = `<span class="material-symbols-outlined">${isVisible ? 'close' : 'menu'}</span>`;
    });

    // Ejecutar la lógica al cargar la página y al redimensionar la ventana.
    handleResize();
    window.addEventListener('resize', handleResize);
}

/**
 * Renderiza los elementos de la lista del menú en el elemento <ul>.
 * @param {HTMLElement} menuElement - El elemento <ul> donde se insertarán los items.
 * @param {Array} menuItems - El array de configuración de los items.
 */
function renderMenuItems(menuElement, menuItems) {
    menuElement.innerHTML = ''; // Limpia el menú para evitar duplicados.
    menuItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'menu-item';
        li.dataset.sectionId = `seccion-${item.id}`;
        li.dataset.sectionIndex = index;
        li.innerHTML = `<span class="menu-icon material-symbols-outlined">${item.icon}</span><span class="menu-text">${item.text}</span>`;
        menuElement.appendChild(li);
    });
}
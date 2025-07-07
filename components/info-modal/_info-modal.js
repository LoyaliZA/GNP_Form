document.addEventListener('DOMContentLoaded', () => {
    // 1. El objeto con los datos se queda aquí
    const modalData = {
        domicilio: { title: "¿Por qué importa tu domicilio?", text: "...", case: "..." },
        'actividades-riesgo': { title: "Tus actividades y profesión", text: "...", case: "..." },
        deportes: { title: "Sobre tus deportes", text: "...", case: "..." },
        'info-medica': { title: "Tu historial médico", text: "...", case: "..." },
        habitos: { title: "¿Por qué tus hábitos?", text: "...", case: "..." }
        // Rellena los "..." con tu texto persuasivo
    };

    // 2. Función para configurar el modal (inyectar HTML, CSS y eventos de cierre)
    function setupModal() {
        if (document.getElementById('info-modal-persuasive')) return;

        // Inyecta el CSS del modal en el <head>
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'components/info-modal/_info-modal.css';
        document.head.appendChild(link);
        
        // Inyecta el HTML del modal en el <body>
        fetch('components/info-modal/_info-modal.html')
            .then(response => response.text())
            .then(html => {
                document.body.insertAdjacentHTML('beforeend', html);
                const modalElement = document.getElementById('info-modal-persuasive');
                
                // Función para cerrar
                const closeModal = () => {
                    modalElement.style.opacity = '0';
                    modalElement.querySelector('.info-modal-content').style.transform = 'scale(0.9)';
                    setTimeout(() => modalElement.style.display = 'none', 300);
                };

                // Asignar eventos de cierre
                modalElement.querySelector('.info-modal-close-btn').addEventListener('click', closeModal);
                modalElement.addEventListener('click', e => (e.target === modalElement) && closeModal());
            });
    }

    // 3. Definimos una función GLOBAL que `persona.js` podrá llamar
    window.showPersuasiveModal = function(modalType) {
        const modalElement = document.getElementById('info-modal-persuasive');
        const data = modalData[modalType];
        
        // Si hay datos para esta sección y el modal existe, lo mostramos
        if (data && modalElement) {
            console.log(`Llamada para mostrar modal: ${modalType}`); // Línea de depuración

            // Rellenar el contenido
            modalElement.querySelector('#info-modal-title').textContent = data.title;
            modalElement.querySelector('#info-modal-text').textContent = data.text;
            modalElement.querySelector('#info-modal-case-text').innerHTML = data.case;
            
            // Mostrar con animación
            modalElement.style.display = 'flex';
            setTimeout(() => {
                modalElement.style.opacity = '1';
                modalElement.querySelector('.info-modal-content').style.transform = 'scale(1)';
            }, 10);
        }
    };

    // Ejecutar la configuración inicial
    setupModal();
});
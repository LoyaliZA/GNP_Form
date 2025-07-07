document.addEventListener('DOMContentLoaded', () => {
    // 1. El objeto con los datos se queda aquí
    const modalData = {
        domicilio: {
            title: "¿Por qué es tan importante tu domicilio?",
            text: "Tu dirección no es solo un dato más. Nos permite identificar la red de hospitales, médicos y servicios de emergencia más cercana a ti. En una urgencia, cada minuto cuenta y saber dónde estás hace la diferencia.",
            case: "<strong>Caso de Sofía:</strong> Durante una cena, su hijo pequeño se atragantó. Al llamar a GNP, gracias a que su domicilio estaba registrado y verificado, se envió la ambulancia más cercana en menos de 8 minutos, recibiendo atención vital de inmediato."
        },
        'actividades-riesgo': {
            title: "Tu profesión nos ayuda a protegerte mejor",
            text: "No todas las profesiones tienen los mismos riesgos. Entender a qué te dedicas nos permite ofrecerte una cobertura que realmente se ajuste a tu día a día, cubriendo situaciones que una póliza genérica podría pasar por alto.",
            case: "<strong>Caso de Alejandro:</strong> Es arquitecto y, aunque su trabajo es de oficina, visita obras constantemente. Un día resbaló, sufriendo una fractura. Su seguro, ajustado a su actividad, cubrió la terapia física y el tiempo de incapacidad sin objeciones."
        },
        deportes: {
            title: "Tus pasiones también merecen estar aseguradas",
            text: "Practicar un deporte, incluso de forma amateur, es increíble para tu salud, pero a veces ocurren accidentes. Al saber qué deportes practicas, nos aseguramos de que tu póliza te cubra si sufres una lesión mientras disfrutas de tu hobby.",
            case: "<strong>Caso de Mariana:</strong> Jugando pádel el fin de semana, sufrió una rotura de ligamentos en la rodilla. Como lo había declarado en su póliza, el seguro cubrió la cirugía y las 10 sesiones de rehabilitación, que de otro modo habrían costado más de $80,000 MXN."
        },
        'info-medica': {
            title: "Tu historial médico es la clave de tu tranquilidad",
            text: "Ser transparente con tu salud actual y pasada es el acto de mayor confianza hacia nosotros y hacia ti mismo. Esto garantiza que, cuando más lo necesites, tu póliza responda sin contratiempos ni sorpresas, cubriendo lo que realmente importa.",
            case: "<strong>Caso de Ricardo:</strong> Declaró que tuvo hipertensión controlada hace años. Cuando necesitó un estudio cardiológico de emergencia, el seguro lo autorizó de inmediato porque esa condición ya estaba registrada y evaluada en su plan. No hubo dudas ni demoras."
        },
        habitos: {
            title: "¿Por qué nos interesan tus hábitos?",
            text: "Ciertos hábitos, como fumar o beber, están estadísticamente ligados a padecimientos específicos. Conocerlos nos permite ser justos y transparentes, ofreciéndote una tarifa adecuada a tu estilo de vida y, en muchos casos, ¡premiando tus buenos hábitos con un mejor costo!",
            case: "<strong>Caso de Fernanda:</strong> Al declarar que no fumaba desde hace más de 5 años, calificó para una tarifa preferencial en su seguro. Esto le significó un ahorro anual del 18% en su prima, un beneficio directo por mantener un hábito saludable."
        }
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
            const titleElement = modalElement.querySelector('#info-modal-title');
            
            // Rellenar el contenido
            titleElement.textContent = data.title;
            modalElement.querySelector('#info-modal-text').textContent = data.text;
            modalElement.querySelector('#info-modal-case-text').innerHTML = data.case;
            
            // --- SOLUCIÓN DEFINITIVA PARA CENTRAR EL TÍTULO ---
            // Aplicamos el estilo directamente con JavaScript para máxima prioridad.
            titleElement.style.textAlign = 'center';
            
            // Mostrar el modal con animación
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
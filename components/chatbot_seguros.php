<?php
// components/chatbot_seguros.php
?>

<button id="chatbot-gnp-toggle-button" class="chatbot-gnp-toggle-button">
    <span class="material-symbols-outlined icon-open">support_agent</span>
    <span class="material-symbols-outlined icon-close" style="display:none;">close</span>
</button>

<div id="chatbotGNPContainer" class="chatbot-gnp-container" style="display: none;">
    <div class="chatbot-gnp-header">
        <img src="assets/img/Mascota/asistente_gnp_icon.png" alt="Asistente GNP" class="chatbot-gnp-avatar">
        <div class="chatbot-gnp-header-info">
            <span class="chatbot-gnp-name">Asistente de Seguros GNP</span>
            <span class="chatbot-gnp-status">En línea para ayudarte</span>
        </div>
        <button id="chatbot-gnp-close-button" class="chatbot-gnp-close-button">&times;</button>
    </div>
    <div class="chatbot-gnp-chat-area" id="chatbotGNPChatArea">
        <div class="chatbot-gnp-message Bот-message" id="initialBotMessageSection"> <div class="chatbot-gnp-bubble">
                <p>¡Hola! 👋 Soy tu Asistente Virtual GNP. Estoy aquí para ayudarte con tus dudas sobre nuestros planes de seguro.</p>
                <p>¿Sobre qué te gustaría saber?</p>
                <div class="chatbot-gnp-quick-replies">
                    <button onclick="showGNPFAQ('faqCoberturaEsencial')">Plan Esencial</button>
                    <button onclick="showGNPFAQ('faqDeducibleCoaseguro')">Deducible y Coaseguro</button>
                    <button onclick="showGNPFAQ('faqComoContratar')">¿Cómo contratar?</button>
                    <button onclick="showGNPFAQ('faqContactoAgente')">Contactar un Agente</button>
                </div>
                <div class="chatbot-gnp-timestamp">Ahora mismo</div>
            </div>
        </div>

        <div class="chatbot-gnp-message bot-message" id="faqCoberturaEsencial" style="display: none;">
            <div class="chatbot-gnp-bubble">
                <p><strong>🛡️ Sobre el Plan Esencial GNP...</strong></p>
                <p>El Plan Esencial te ofrece una cobertura nacional con una suma asegurada de $2,000,000 MXN, un deducible de $15,000 MXN y un coaseguro del 10%. Es ideal si buscas protección completa a un costo accesible.</p>
                <p>¿Tienes alguna pregunta específica sobre este plan?</p>
                <div class="chatbot-gnp-quick-replies">
                    <button onclick="showGNPInitialOptions()">Ver otras preguntas</button>
                </div>
                <div class="chatbot-gnp-timestamp">Información</div>
            </div>
        </div>

        <div class="chatbot-gnp-message bot-message" id="faqDeducibleCoaseguro" style="display: none;">
            <div class="chatbot-gnp-bubble">
                <p><strong>💰 ¿Qué es Deducible y Coaseguro?</strong></p>
                <p>El <strong>deducible</strong> es la cantidad fija que pagas primero en caso de un siniestro antes de que el seguro comience a cubrir.</p>
                <p>El <strong>coaseguro</strong> es un porcentaje del total de los gastos cubiertos (después del deducible) que también corre por tu cuenta. Por ejemplo, un coaseguro del 10% significa que tú pagas ese porcentaje y GNP el 90% restante.</p>
                <div class="chatbot-gnp-quick-replies">
                    <button onclick="showGNPInitialOptions()">Ver otras preguntas</button>
                </div>
                <div class="chatbot-gnp-timestamp">Información</div>
            </div>
        </div>
        
        <div class="chatbot-gnp-message bot-message" id="faqComoContratar" style="display: none;">
            <div class="chatbot-gnp-bubble">
                <p><strong>✍️ ¿Cómo puedo contratar un seguro?</strong></p>
                <p>¡Es muy sencillo! Una vez que eliges un plan en esta página, haz clic en "Seleccionar Plan". Esto te llevará a un formulario donde podrás ingresar tus datos para completar la solicitud. Si tienes dudas durante el proceso, ¡no dudes en preguntar!</p>
                <div class="chatbot-gnp-quick-replies">
                    <button onclick="showGNPInitialOptions()">Ver otras preguntas</button>
                </div>
                <div class="chatbot-gnp-timestamp">Información</div>
            </div>
        </div>

        <div class="chatbot-gnp-message bot-message" id="faqContactoAgente" style="display: none;">
            <div class="chatbot-gnp-bubble">
                <p><strong>🧑‍💼 ¿Cómo contacto a un agente?</strong></p>
                <p>Si prefieres atención personalizada, un agente GNP puede asesorarte. Puedes indicarlo al final del proceso de solicitud o buscar un agente en nuestro <a href='#' onclick='alert(\"Redirigiendo a directorio de agentes...\")'>directorio oficial</a>.</p>
                <div class="chatbot-gnp-quick-replies">
                    <button onclick="showGNPInitialOptions()">Ver otras preguntas</button>
                </div>
                <div class="chatbot-gnp-timestamp">Información</div>
            </div>
        </div>
        </div>
</div>
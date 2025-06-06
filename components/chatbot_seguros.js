// components/chatbot_seguros.js
document.addEventListener('DOMContentLoaded', function() {
    const chatToggleButton = document.getElementById('chatbot-gnp-toggle-button');
    const chatContainer = document.getElementById('chatbotGNPContainer');
    const chatCloseButton = document.getElementById('chatbot-gnp-close-button');
    const chatArea = document.getElementById('chatbotGNPChatArea');
    const iconOpen = chatToggleButton ? chatToggleButton.querySelector('.icon-open') : null;
    const iconClose = chatToggleButton ? chatToggleButton.querySelector('.icon-close') : null;

    function toggleChat() {
        if (!chatContainer || !chatToggleButton) return;

        const isVisible = chatContainer.classList.contains('chat-visible');
        if (!isVisible) {
            chatContainer.style.display = 'flex';
            setTimeout(() => { 
                chatContainer.classList.add('chat-visible');
            }, 10); 
            // chatToggleButton.innerHTML = '<span class="material-symbols-outlined">close</span>';
            if(iconOpen) iconOpen.style.display = 'none';
            if(iconClose) iconClose.style.display = 'inline-block';
            chatToggleButton.classList.add('open');


            if (chatArea) {
                showGNPInitialOptions(); // Mostrar opciones iniciales al abrir
                chatArea.scrollTop = chatArea.scrollHeight;
            }
        } else {
            chatContainer.classList.remove('chat-visible');
            setTimeout(() => {
                chatContainer.style.display = 'none';
            }, 300); 
            // chatToggleButton.innerHTML = '<span class="material-symbols-outlined">support_agent</span>';
            if(iconOpen) iconOpen.style.display = 'inline-block';
            if(iconClose) iconClose.style.display = 'none';
            chatToggleButton.classList.remove('open');
        }
    }

    if (chatToggleButton && chatContainer) {
        chatToggleButton.addEventListener('click', toggleChat);
    }

    if (chatCloseButton && chatContainer) {
        chatCloseButton.addEventListener('click', toggleChat); 
    }
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && chatContainer && chatContainer.classList.contains('chat-visible')) {
            toggleChat();
        }
    });
});

// Estas funciones ahora son globales para ser llamadas por onclick
function showGNPFAQ(sectionId) {
    const chatArea = document.getElementById('chatbotGNPChatArea');
    if (!chatArea) {
        console.error('Chat area (#chatbotGNPChatArea) not found!');
        return;
    }

    const allBotSections = chatArea.querySelectorAll('.chatbot-gnp-message.bot-message');
    const selectedSection = document.getElementById(sectionId);
    const initialSection = document.getElementById('initialBotMessageSection');

    if (!selectedSection) {
        console.error(`Section with ID ${sectionId} not found!`);
        return;
    }

    allBotSections.forEach(section => {
        if (section.id !== 'initialBotMessageSection') { 
            section.style.display = 'none';
        }
    });
    if(initialSection && initialSection.id !== selectedSection.id) { 
        initialSection.style.display = 'none';
    }

    selectedSection.style.display = 'flex'; // .chatbot-gnp-message es flex

    chatArea.appendChild(selectedSection); // Mover al final para mantener el orden visual si se reabre
    selectedSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function showGNPInitialOptions() {
    const chatArea = document.getElementById('chatbotGNPChatArea');
    if (!chatArea) return;

    const allBotSections = chatArea.querySelectorAll('.chatbot-gnp-message.bot-message');
    const initialSection = document.getElementById('initialBotMessageSection');

    allBotSections.forEach(section => {
        if (section.id !== 'initialBotMessageSection') {
            section.style.display = 'none';
        }
    });

    if (initialSection) {
        initialSection.style.display = 'flex'; // .chatbot-gnp-message es flex
        chatArea.appendChild(initialSection); 
        initialSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
}
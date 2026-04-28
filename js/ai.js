document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (!chatForm || !chatInput || !chatMessages) return;

    const appendMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const callAI = async (query) => {
        const { key, model, baseUrl } = App.apiConfig;
        const cases = Storage.get('court_cases');
        const schedule = Storage.get('court_schedule');
        const systemPrompt = `You are a helpful Legal AI Assistant for a Court Management System. You answer questions concisely. System context: Cases: ${JSON.stringify(cases)}, Schedule: ${JSON.stringify(schedule)}`;

        try {
            const response = await fetch(baseUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${key}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: query }
                    ]
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.choices[0].message.content;
            } else {
                const err = await response.json();
                return `API Error: ${err.error?.message || 'Failed to connect to AI service'}`;
            }
        } catch (e) {
            console.error("AI Error:", e);
            return "Connection error: Unable to reach the AI service.";
        }
    };

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage(text, 'user');
        chatInput.value = '';

        const loadingDiv = document.createElement('div');
        loadingDiv.className = `message bot`;
        loadingDiv.textContent = "AI is analyzing...";
        loadingDiv.id = "loading-message";
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const response = await callAI(text);

        const loadingEl = document.getElementById('loading-message');
        if (loadingEl) loadingEl.remove();

        appendMessage(response, 'bot');
    });
});

const API_URL = 'http://localhost:3000/api';

// Selectors
const consoleOutput = document.getElementById('console-output');
const addStationForm = document.getElementById('add-station-form');
const addConnectionForm = document.getElementById('add-connection-form');
const findPathForm = document.getElementById('find-path-form');
const showStationsBtn = document.getElementById('show-stations-btn');

// Utility to display text in console
const logToConsole = (text, type = 'success') => {
    // Escape HTML to prevent injection
    const escapedText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // Add timestamp
    const time = new Date().toLocaleTimeString();
    
    const entry = document.createElement('div');
    entry.style.marginBottom = '12px';
    entry.style.paddingBottom = '12px';
    entry.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    
    const timeSpan = `<span style="color:#64748b;font-size:0.8rem;">[${time}]</span> `;
    let formattedText = escapedText;
    
    // Format based on type
    if (type === 'error') {
        formattedText = `<span style="color:#f43f5e;font-weight:600;">Error:</span> ${escapedText}`;
    } else if (text.includes('=== SHORTEST PATH ===')) {
        // Highlight shortest path specifically
        formattedText = escapedText.replace(/=== SHORTEST PATH ===/g, '<strong style="color:#10b981;">=== SHORTEST PATH ===</strong>');
    }

    entry.innerHTML = `${timeSpan} ${formattedText}`;
    
    // Remove placeholder if present
    const placeholder = consoleOutput.querySelector('.placeholder-text');
    if (placeholder) {
        placeholder.remove();
    }
    
    consoleOutput.prepend(entry);
};

// API Call Wrapper
const apiCall = async (endpoint, options = {}, btnElement = null) => {
    try {
        if (btnElement) {
            btnElement.classList.add('loading');
            btnElement.dataset.originalText = btnElement.innerText;
            btnElement.innerText = '';
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const data = await response.json();
        
        if (data.success) {
            logToConsole(data.message, 'success');
        } else {
            console.error("API Error", data);
            logToConsole(data.error || JSON.stringify(data), 'error');
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        logToConsole(`Failed to connect to the Metro System Backend at ${API_URL}`, 'error');
    } finally {
        if (btnElement) {
            btnElement.classList.remove('loading');
            btnElement.innerText = btnElement.dataset.originalText;
        }
    }
};

// Event Listeners

addStationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('station-name');
    const btn = e.target.querySelector('button');
    
    apiCall('/station', {
        method: 'POST',
        body: JSON.stringify({ name: nameInput.value.trim() })
    }, btn).then(() => {
        nameInput.value = '';
    });
});

addConnectionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fromInput = document.getElementById('conn-from');
    const toInput = document.getElementById('conn-to');
    const timeInput = document.getElementById('conn-time');
    const btn = e.target.querySelector('button');
    
    apiCall('/connection', {
        method: 'POST',
        body: JSON.stringify({
            from: fromInput.value.trim(),
            to: toInput.value.trim(),
            time: parseInt(timeInput.value.trim(), 10)
        })
    }, btn).then(() => {
        fromInput.value = '';
        toInput.value = '';
        timeInput.value = '';
    });
});

findPathForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fromInput = document.getElementById('path-from');
    const toInput = document.getElementById('path-to');
    const btn = e.target.querySelector('button');
    
    const params = new URLSearchParams({
        from: fromInput.value.trim(),
        to: toInput.value.trim()
    });

    apiCall(`/path?${params.toString()}`, {
        method: 'GET'
    }, btn).then(() => {
        // Keep inputs filled for easy re-query
    });
});

showStationsBtn.addEventListener('click', (e) => {
    apiCall('/stations', { method: 'GET' }, e.target);
});

// Initial Welcome
logToConsole("System Initialized. Connected to C++ DSA Core Engine natively via Node.js Express.");

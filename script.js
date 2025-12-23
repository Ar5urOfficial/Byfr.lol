function tab(e, id) {
    document.querySelectorAll('.main').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (e) e.currentTarget.classList.add('active');
}

let heartsInterval;

function setTheme(theme) {
    document.body.className = 'theme-' + theme;
    if(theme === 'red') {
        console.log("Startowanie serc..."); // Sprawdź w konsoli (F12) czy to się pojawia
        startHearts();
    } else {
        stopHearts();
    }
}

function startHearts() {
    stopHearts();
    const container = document.getElementById('hearts-container');
    heartsInterval = setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = (Math.random() * 2 + 3) + "s";
        container.appendChild(heart);
        
        setTimeout(() => heart.remove(), 5000);
    }, 400);
}

function stopHearts() {
    clearInterval(heartsInterval);
    const container = document.getElementById('hearts-container');
    if(container) container.innerHTML = '';
}

// System powiadomień
function notify(text) {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.style.cssText = "position:fixed; bottom:20px; right:20px; background:rgba(0,0,0,0.8); color:white; padding:15px 25px; border-radius:10px; border-left:4px solid var(--accent); z-index:1000;";
    toast.innerHTML = `✅ ${text}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

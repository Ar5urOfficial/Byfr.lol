// Przełączanie zakładek
function tab(e, id) {
    document.querySelectorAll('.main').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (e) e.currentTarget.classList.add('active');
}

// System Motywów
function setTheme(theme) {
    document.body.className = 'theme-' + theme;
    if(theme === 'red') {
        startHearts();
    } else {
        stopHearts();
    }
    notify(`Motyw ${theme} aktywowany!`);
}

// Logika spadających serc
let heartsInterval;
function startHearts() {
    stopHearts(); // Czyścimy przed startem
    heartsInterval = setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = (Math.random() * 3 + 2) + "s";
        document.getElementById('hearts-container').appendChild(heart);
        
        // Usunięcie serca z DOM po 5 sekundach
        setTimeout(() => heart.remove(), 5000);
    }, 400); 
}

function stopHearts() {
    clearInterval(heartsInterval);
    const container = document.getElementById('hearts-container');
    if(container) container.innerHTML = '';
}

// System Powiadomień
function notify(text) {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.className = 'glass-toast';
    toast.innerHTML = `✅ ${text}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(120%)";
        toast.style.transition = "0.4s";
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Wyszukiwarka ScriptBlox
async function search() {
    const query = document.getElementById('q').value;
    const list = document.getElementById('results-list');
    if(!query) return;

    list.innerHTML = '<p style="color:var(--accent)">Wyszukiwanie w bazie Byfr...</p>';

    try {
        const url = `https://api.allorigins.win/get?url=${encodeURIComponent('https://scriptblox.com/api/script/search?q=' + query + '&max=20')}`;
        const response = await fetch(url);
        const data = await response.json();
        const json = JSON.parse(data.contents);

        list.innerHTML = '';
        if(!json.result || !json.result.scripts) {
            list.innerHTML = '<p>Brak wyników.</p>';
            return;
        }

        json.result.scripts.forEach(s => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <div style="font-weight:bold; font-size:16px;">${s.title}</div>
                <button class="search-btn" style="padding:5px 12px; margin-top:8px; font-size:12px;" onclick="copyLua('${s.slug}')">KOPIUJ</button>
            `;
            list.appendChild(card);
        });
    } catch(e) {
        list.innerHTML = '<p style="color:red">Błąd połączenia.</p>';
    }
}

// Kopiowanie do schowka
function copyLua(slug) {
    const loader = `loadstring(game:HttpGet("https://scriptblox.com/raw/${slug}"))()`;
    navigator.clipboard.writeText(loader).then(() => {
        notify("Skopiowano Loader!");
    });
}

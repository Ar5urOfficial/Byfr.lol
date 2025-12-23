function tab(e, id) {
    document.querySelectorAll('.main').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (e) e.currentTarget.classList.add('active');
}

// MOTYWY
function setTheme(themeName) {
    document.body.className = 'theme-' + themeName;
    notify(`Zmieniono motyw na: ${themeName}`);
    
    if(themeName === 'red') {
        startHearts();
    } else {
        stopHearts();
    }
}

// SPADAJĄCE SERCA
let heartInterval;
function startHearts() {
    stopHearts(); // Czyścimy stare interwały
    heartInterval = setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = Math.random() * 3 + 2 + "s";
        heart.style.opacity = Math.random();
        document.getElementById('hearts-container').appendChild(heart);
        
        setTimeout(() => heart.remove(), 5000);
    }, 300);
}

function stopHearts() {
    clearInterval(heartInterval);
    const container = document.getElementById('hearts-container');
    if(container) container.innerHTML = '';
}

// NOTIFICATION
function notify(text) {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.className = 'glass-toast';
    toast.style.cssText = "background:rgba(20,20,20,0.9); padding:15px; border-radius:10px; margin-bottom:10px; border-left:4px solid var(--accent); color:white;";
    toast.innerHTML = `✅ ${text}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 500); }, 3000);
}

// SEARCH (BEZ ZMIAN)
async function search() {
    const query = document.getElementById('q').value;
    const list = document.getElementById('results-list');
    if(!query) return;
    list.innerHTML = '<p style="color:var(--accent)">Szukanie...</p>';
    try {
        const target = `https://scriptblox.com/api/script/search?q=${encodeURIComponent(query)}&max=20`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`;
        const response = await fetch(proxyUrl);
        const rawData = await response.json();
        const data = JSON.parse(rawData.contents);
        list.innerHTML = '';
        data.result.scripts.forEach(s => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.style.cssText = "background:#111; padding:15px; border-radius:10px; margin-bottom:10px; border:1px solid #222; display:flex; gap:15px;";
            card.innerHTML = `<div><div style="font-weight:bold">${s.title}</div><button style="background:var(--accent); border:none; padding:5px 10px; border-radius:5px; margin-top:10px; cursor:pointer;" onclick="copyLua('${s.slug}')">KOPIUJ</button></div>`;
            list.appendChild(card);
        });
    } catch(e) { list.innerHTML = 'Błąd!'; }
}

function copyLua(slug) {
    const code = `loadstring(game:HttpGet("https://scriptblox.com/raw/${slug}"))()`;
    navigator.clipboard.writeText(code);
    notify("Skopiowano!");
}

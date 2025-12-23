function tab(e, id) {
    document.querySelectorAll('.main').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (e) e.currentTarget.classList.add('active');
    
    // Resetuj animacje wewnątrz zakładki
    const currentTab = document.getElementById(id);
    const anims = currentTab.querySelectorAll('.anim-slide-in');
    anims.forEach(a => {
        a.style.animation = 'none';
        a.offsetHeight; /* trigger reflow */
        a.style.animation = null;
    });
}

let heartsInterval;

function setTheme(theme) {
    document.body.className = 'theme-' + theme;
    if(theme === 'red') {
        startHearts();
    } else {
        stopHearts();
    }
    notify(`Motyw ${theme === 'red' ? 'Minecraft' : 'Standardowy'} aktywowany!`);
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
    }, 450);
}

function stopHearts() {
    clearInterval(heartsInterval);
    const container = document.getElementById('hearts-container');
    if(container) container.innerHTML = '';
}

function notify(text) {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.className = 'glass-toast';
    toast.innerHTML = `✅ ${text}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.transform = "translateX(150%)";
        toast.style.transition = "0.5s ease-in";
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

async function search() {
    const q = document.getElementById('q').value;
    const res = document.getElementById('results-list');
    if(!q) return;
    
    res.innerHTML = '<div class="anim-slide-in" style="color:var(--accent)">Skanowanie bazy ScriptBlox...</div>';
    
    try {
        const url = `https://api.allorigins.win/get?url=${encodeURIComponent('https://scriptblox.com/api/script/search?q=' + q + '&max=20')}`;
        const response = await fetch(url);
        const data = await response.json();
        const json = JSON.parse(data.contents);

        res.innerHTML = '';
        if(!json.result || !json.result.scripts.length) {
            res.innerHTML = '<p class="anim-slide-in">Nie znaleziono skryptów.</p>';
            return;
        }

        json.result.scripts.forEach((s, index) => {
            const card = document.createElement('div');
            card.className = 'result-card anim-slide-in';
            card.style.animationDelay = (index * 0.05) + "s";
            card.innerHTML = `
                <div>
                    <div style="font-weight:700; font-size:16px;">${s.title}</div>
                    <div style="font-size:12px; color:#555; margin-top:4px;">${s.game ? s.game.name : 'Universal'}</div>
                </div>
                <button class="btn-primary" onclick="copyLua('${s.slug}')">KOPIUJ</button>
            `;
            res.appendChild(card);
        });
    } catch(e) {
        res.innerHTML = '<p style="color:red">Błąd połączenia z API.</p>';
    }
}

function copyLua(slug) {
    const loader = `loadstring(game:HttpGet("https://scriptblox.com/raw/${slug}"))()`;
    navigator.clipboard.writeText(loader).then(() => {
        notify("Loader skopiowany!");
    });
}

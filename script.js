function tab(e, id) {
    document.querySelectorAll('.main').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (e) e.currentTarget.classList.add('active');
}

function notify(text) {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.className = 'glass-toast';
    toast.innerHTML = `✅ ${text}`;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}

async function search() {
    const query = document.getElementById('q').value;
    const list = document.getElementById('results-list');
    if(!query) return;

    list.innerHTML = '<p>Ładowanie...</p>';

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
            
            // Naprawiony system obrazków
            let thumb = 'https://via.placeholder.com/100';
            if (s.game && s.game.image) {
                const fullImg = 'https://scriptblox.com' + s.game.image;
                thumb = `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=${encodeURIComponent(fullImg)}`;
            }
            
            card.innerHTML = `
                <img src="${thumb}" class="game-img">
                <div>
                    <div style="font-weight:bold">${s.title}</div>
                    <div style="font-size:12px; color:#888">${s.game ? s.game.name : 'Universal'}</div>
                    <button class="copy-btn" onclick="copyLua('${s.slug}')">KOPIUJ LOADER</button>
                </div>`;
            list.appendChild(card);
        });
    } catch(e) {
        list.innerHTML = '<p style="color:red">Błąd połączenia!</p>';
    }
}

function copyLua(slug) {
    const code = `loadstring(game:HttpGet("https://scriptblox.com/raw/${slug}"))()`;
    navigator.clipboard.writeText(code);
    notify("Skopiowano do schowka!");
}

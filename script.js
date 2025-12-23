// Przełączanie zakładek
function tab(e, id) {
    document.querySelectorAll('.main').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (e) e.currentTarget.classList.add('active');
}

// System animowanych powiadomień
function notify(text) {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.className = 'glass-toast';
    toast.innerHTML = `✅ ${text}`;
    
    container.appendChild(toast);

    // Po 3 sekundach zacznij animację znikania
    setTimeout(() => {
        toast.classList.add('hide');
        // Usuń element z HTML po zakończeniu animacji (400ms)
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3000);
}

// Wyszukiwarka ScriptBlox
async function search() {
    const query = document.getElementById('q').value;
    const list = document.getElementById('results-list');
    if(!query) return;

    list.innerHTML = '<p style="color: #00c2ff;">Wyszukiwanie w bazie Byfr...</p>';

    try {
        const target = `https://scriptblox.com/api/script/search?q=${encodeURIComponent(query)}&max=20`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`;
        
        const response = await fetch(proxyUrl);
        const rawData = await response.json();
        const data = JSON.parse(rawData.contents);

        list.innerHTML = '';

        if(!data.result || !data.result.scripts) {
            list.innerHTML = '<p>Brak wyników.</p>';
            return;
        }

        data.result.scripts.forEach(s => {
            const card = document.createElement('div');
            card.className = 'result-card';
            
            // Proxy dla obrazków
            let thumb = 'https://via.placeholder.com/100';
            if (s.game && s.game.image) {
                const fullImg = s.game.image.startsWith('http') ? s.game.image : 'https://scriptblox.com' + s.game.image;
                thumb = `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=${encodeURIComponent(fullImg)}`;
            }
            
            card.innerHTML = `
                <img src="${thumb}" class="game-img" onerror="this.src='https://via.placeholder.com/100'">
                <div>
                    <div style="font-weight:bold; font-size:16px;">${s.title}</div>
                    <div style="font-size:12px; color:#555; margin-bottom: 8px;">Gra: ${s.game ? s.game.name : 'Universal'}</div>
                    <button class="copy-btn" onclick="copyLua('${s.slug}')">KOPIUJ LOADER</button>
                </div>`;
            list.appendChild(card);
        });
    } catch(e) {
        list.innerHTML = '<p style="color:red">Błąd połączenia. Spróbuj ponownie.</p>';
    }
}

// Kopiowanie do schowka
function copyLua(slug) {
    const code = `loadstring(game:HttpGet("https://scriptblox.com/raw/${slug}"))()`;
    navigator.clipboard.writeText(code).then(() => {
        notify("Skopiowano Loader!");
    });
}

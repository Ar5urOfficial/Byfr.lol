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
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

async function search() {
    const query = document.getElementById('q').value;
    const list = document.getElementById('results-list');
    if(!query) return;

    list.innerHTML = '<p style="text-align: center; color: #ff3b30;">Ładowanie danych Byfr...</p>';

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
            
            // Proxy obrazków przez Google
            let imageUrl = 'https://via.placeholder.com/100?text=No+Img';
            if (s.game && s.game.image) {
                const fullUrl = 'https://scriptblox.com' + s.game.image;
                imageUrl = `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=${encodeURIComponent(fullUrl)}`;
            }
            
            card.innerHTML = `
                <img src="${imageUrl}" class="game-img">
                <div class="info">
                    <div style="font-weight:bold; color:white;">${s.title}</div>
                    <div style="font-size:12px; color:#777;">Gra: ${s.game ? s.game.name : 'Unknown'}</div>
                    <button class="copy-btn" onclick="copyLua('${s.slug}')">KOPIUJ LOADER</button>
                </div>`;
            list.appendChild(card);
        });
    } catch(e) {
        list.innerHTML = '<p style="text-align: center; color: red;">Błąd API. Spróbuj CTRL+F5.</p>';
    }
}

function copyLua(slug) {
    const code = `loadstring(game:HttpGet("https://scriptblox.com/raw/${slug}"))()`;
    const el = document.createElement('textarea');
    el.value = code;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    notify("Skopiowano Loader!");
}

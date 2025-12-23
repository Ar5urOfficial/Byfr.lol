// Funkcja przełączania zakładek (Tabs)
function tab(e, id) {
    document.querySelectorAll('.main').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    e.currentTarget.classList.add('active');
}

// Główna funkcja wyszukiwania
async function search() {
    const query = document.getElementById('q').value;
    const list = document.getElementById('results-list');
    if(!query) return;

    list.innerHTML = '<p style="text-align: center; color: #ff3b30;">Łączenie ze ScriptBlox przez Proxy...</p>';

    try {
        // Używamy mostka 'codetabs', który najlepiej omija blokady CORS
        const proxy = 'https://api.codetabs.com/v1/proxy?quest=';
        const api = `https://scriptblox.com/api/script/search?q=${encodeURIComponent(query)}&max=15`;
        
        const response = await fetch(proxy + api);
        const data = await response.json();

        list.innerHTML = '';

        if(!data.result || data.result.scripts.length === 0) {
            list.innerHTML = '<p style="text-align: center;">Brak wyników dla tej gry.</p>';
            return;
        }

        data.result.scripts.forEach(s => {
            const card = document.createElement('div');
            card.className = 'result-card';
            const thumb = s.game.image ? `https://scriptblox.com${s.game.image}` : 'https://via.placeholder.com/100?text=No+Img';
            
            card.innerHTML = `
                <img src="${thumb}" class="game-img">
                <div class="info">
                    <div class="title">${s.title}</div>
                    <div class="meta">Gra: ${s.game.name} | Autor: ${s.owner.username}</div>
                    <button class="copy-btn" onclick="copyLua('${s.slug}')">KOPIUJ LOADER</button>
                </div>
            `;
            list.appendChild(card);
        });
    } catch(e) {
        list.innerHTML = '<p style="text-align: center; color: red;">Przeglądarka nadal blokuje połączenie lokalne. Spróbuj na GitHubie.</p>';
    }
}

function copyLua(slug) {
    const code = `loadstring(game:HttpGet("https://scriptblox.com/raw/${slug}"))()`;
    navigator.clipboard.writeText(code);
    const t = document.getElementById('toast');
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 2000);
}
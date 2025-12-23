// Funkcja przełączania zakładek
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

    list.innerHTML = '<p style="text-align: center; color: #ff3b30;">Łączenie z bazą ScriptBlox...</p>';

    try {
        // Używamy mostka AllOrigins, aby ominąć błąd blokady widoczny na screenie
        const target = `https://scriptblox.com/api/script/search?q=${encodeURIComponent(query)}&max=20`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`;
        
        const response = await fetch(proxyUrl);
        const rawData = await response.json();
        const data = JSON.parse(rawData.contents);

        list.innerHTML = '';

        if(!data.result || !data.result.scripts || data.result.scripts.length === 0) {
            list.innerHTML = '<p style="text-align: center;">Brak wyników dla tej gry.</p>';
            return;
        }

        data.result.scripts.forEach(s => {
            const card = document.createElement('div');
            card.className = 'result-card';
            
            // Pobieranie zdjęcia gry
            const thumb = (s.game && s.game.image) 
                ? `https://scriptblox.com${s.game.image}` 
                : 'https://via.placeholder.com/100?text=No+Img';
            
            card.innerHTML = `
                <img src="${thumb}" class="game-img">
                <div class="info">
                    <div class="title">${s.title}</div>
                    <div class="meta">Gra: ${s.game ? s.game.name : 'Unknown'} | Autor: ${s.owner ? s.owner.username : 'Anon'}</div>
                    <button class="copy-btn" onclick="copyLua('${s.slug}')">KOPIUJ LOADER</button>
                </div>
            `;
            list.appendChild(card);
        });
    } catch(e) {
        list.innerHTML = '<p style="text-align: center; color: red;">Wystąpił błąd API. Spróbuj ponownie za chwilę.</p>';
    }
}

// Funkcja kopiowania skryptu
function copyLua(slug) {
    const code = `loadstring(game:HttpGet("https://scriptblox.com/raw/${slug}"))()`;
    navigator.clipboard.writeText(code).then(() => {
        const t = document.getElementById('toast');
        if(t) {
            t.style.display = 'block';
            setTimeout(() => t.style.display = 'none', 2000);
        } else {
            alert("Skopiowano skrypt!");
        }
    });
}

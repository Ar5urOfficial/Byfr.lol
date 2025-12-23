// Funkcja przełączania zakładek
function tab(e, id) {
    document.querySelectorAll('.main').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    e.currentTarget.classList.add('active');
}

// Główna funkcja wyszukiwania - Naprawione obrazki i API
async function search() {
    const query = document.getElementById('q').value;
    const list = document.getElementById('results-list');
    if(!query) return;

    list.innerHTML = '<p style="text-align: center; color: #ff3b30;">Szukanie w bazie...</p>';

    try {
        const target = `https://scriptblox.com/api/script/search?q=${encodeURIComponent(query)}&max=20`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`;
        
        const response = await fetch(proxyUrl);
        const rawData = await response.json();
        const data = JSON.parse(rawData.contents);

        list.innerHTML = '';

        if(!data.result || !data.result.scripts || data.result.scripts.length === 0) {
            list.innerHTML = '<p style="text-align: center;">Brak wyników.</p>';
            return;
        }

        data.result.scripts.forEach(s => {
            const card = document.createElement('div');
            card.className = 'result-card';
            
            // NAPRAWA OBRAZKÓW: Używamy proxy dla zdjęć, żeby ScriptBlox ich nie blokował
            let thumb = 'https://via.placeholder.com/100?text=No+Img';
            if(s.game && s.game.image) {
                thumb = `https://api.allorigins.win/raw?url=${encodeURIComponent('https://scriptblox.com' + s.game.image)}`;
            }
            
            card.innerHTML = `
                <img src="${thumb}" class="game-img" style="width:100px; height:100px; border-radius:8px; object-fit:cover;">
                <div class="info">
                    <div class="title" style="font-weight:bold; color:white;">${s.title}</div>
                    <div class="meta" style="font-size:12px; color:#aaa;">Gra: ${s.game ? s.game.name : 'Unknown'}</div>
                    <button class="copy-btn" 
                            onclick="copyLua('${s.slug}')" 
                            style="margin-top:10px; padding:8px 15px; cursor:pointer; background:#333; color:white; border:1px solid #555; border-radius:5px;">
                        KOPIUJ LOADER
                    </button>
                </div>
            `;
            list.appendChild(card);
        });
    } catch(e) {
        list.innerHTML = '<p style="text-align: center; color: red;">Błąd API. Odśwież stronę.</p>';
    }
}

// NAPRAWIONE KOPIOWANIE: Metoda działająca na GitHub Pages i telefonach
function copyLua(slug) {
    const code = `loadstring(game:HttpGet("https://scriptblox.com/raw/${slug}"))()`;
    
    // Tworzymy niewidoczne pole tekstowe, żeby "oszukać" zabezpieczenia kopiowania
    const el = document.createElement('textarea');
    el.value = code;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    // Powiadomienie (Toast)
    const t = document.getElementById('toast');
    if(t) {
        t.innerText = "SKOPIOWANO!";
        t.style.display = 'block';
        setTimeout(() => t.style.display = 'none', 2000);
    } else {
        alert("Skopiowano Loader!");
    }
}

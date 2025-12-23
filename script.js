// Funkcja przełączania zakładek
function tab(e, id) {
    document.querySelectorAll('.main').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    e.currentTarget.classList.add('active');
}

// Główna funkcja wyszukiwania - Ulepszona wersja
async function search() {
    const query = document.getElementById('q').value;
    const list = document.getElementById('results-list');
    if(!query) return;

    list.innerHTML = '<p style="text-align: center; color: #ff3b30;">Łączenie z bazą ScriptBlox...</p>';

    try {
        // Używamy mostka AllOrigins (często stabilniejszy na GitHub Pages)
        const target = `https://scriptblox.com/api/script/search?q=${encodeURIComponent(query)}&max=20`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`;
        
        const response = await fetch(proxyUrl);
        const rawData = await response.json();
        
        // Wyciągamy dane z "pudełka" AllOrigins
        const data = JSON.parse(rawData.contents);

        list.innerHTML = '';

        if(!data.result || !data.result.scripts || data.result.scripts.length === 0) {
            list.innerHTML = '<p style="text-align: center;">Brak wyników dla tej gry.</p>';
            return;
        }

        data.result.scripts.forEach(s => {
            const card = document.createElement('div');
            card.className = 'result-card';
            
            // Poprawione pobieranie obrazka
            const thumb = (s.game && s.game.image) 
                ? `https://scriptblox.com${s.game.image}` 
                : 'https://via.placeholder.com/100?text=No+Img';
            
            card.innerHTML = `
                <img src="${thumb}" class="game-img" onerror="this.src='https://via.placeholder.com/100?text=Error'">
                <div class="info">
                    <div class="title">${s.title}</div>
                    <div class="meta">Gra: ${s.game ? s.game.name : 'Unknown'} | Autor: ${s.owner ? s.owner.username : 'Anon'}</div>
                    <button class="copy-btn" onclick="copyLua('${s.slug}')">KOPIUJ LOADER</button>
                </div>
            `;
            list.appendChild(card);
        });
    } catch(e) {
        console.error(e);
        list.innerHTML = '<p style="text-align: center; color: red;">Wystąpił błąd podczas pobierania. Odśwież stronę (CTRL+F5).</p>';
    }
}

// Funkcja kopiowania
function copyLua(slug) {
    const code = `loadstring(game:HttpGet("https://scriptblox.com/raw/${slug}"))()`;
    
    // Nowoczesny sposób kopiowania
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
            showToast();
        });
    } else {
        // Rezerwowy sposób (stary)
        const textArea = document.createElement("textarea");
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast();
    }
}

function showToast() {
    const t = document.getElementById('toast');
    if(t) {
        t.style.display = 'block';
        setTimeout(() => t.style.display = 'none', 2500);
    } else {
        alert("Skopiowano skrypt!");
    }
}

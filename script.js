const button = document.getElementById('randomBtn');
const houseInfo = document.getElementById('houseInfo');

const API_URL = 'https://anapioficeandfire.com/api/houses';

// Funcție pentru a obține o casă random
async function getRandomHouse() {
    try {
        // Primul, aflăm câte case sunt
        const response = await fetch(API_URL);
        const data = await response.json();
        const totalHouses = data.length;

        // Alegem un index random
        const randomIndex = Math.floor(Math.random() * totalHouses);

        // Obținem detalii despre casa aleasă
        const houseResponse = await fetch(`${API_URL}/${randomIndex + 1}`);
        const house = await houseResponse.json();

        displayHouse(house);

    } catch (error) {
        console.error('Eroare la obținerea casei:', error);
        houseInfo.innerHTML = `<p>Eroare la încărcarea casei. Încearcă din nou.</p>`;
    }
}

// Funcție pentru afișarea casei
function displayHouse(house) {
    houseInfo.innerHTML = `
        <p><strong>Nume:</strong> ${house.name || 'N/A'}</p>
        <p><strong>Region:</strong> ${house.region || 'N/A'}</p>
        <p><strong>Words:</strong> ${house.words || 'N/A'}</p>
        <p><strong>Titles:</strong> ${house.titles.join(', ') || 'N/A'}</p>
        <p><strong>Seats:</strong> ${house.seats.join(', ') || 'N/A'}</p>
        <p><strong>Founded:</strong> ${house.founded || 'N/A'}</p>
    `;
}

// Adăugăm event listener la buton
button.addEventListener('click', getRandomHouse);
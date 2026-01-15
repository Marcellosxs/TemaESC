const button = document.getElementById('randomBtn');
const tableBody = document.querySelector('#houseTable tbody');

const API_URL = 'https://anapioficeandfire.com/api/houses';

// Obiect cu simboluri/imagine pentru câteva case (poți adăuga mai multe)
const houseSymbols = {
    'House Stark': 'https://awoiaf.westeros.org/images/thumb/8/81/House_Stark.svg/120px-House_Stark.svg.png',
    'House Lannister': 'https://awoiaf.westeros.org/images/thumb/9/9d/House_Lannister.svg/120px-House_Lannister.svg.png',
    'House Targaryen': 'https://awoiaf.westeros.org/images/thumb/3/31/House_Targaryen.svg/120px-House_Targaryen.svg.png',
    'House Baratheon': 'https://awoiaf.westeros.org/images/thumb/5/5f/House_Baratheon.svg/120px-HOUSE_Baratheon.svg.png',
    'House Greyjoy': 'https://awoiaf.westeros.org/images/thumb/5/53/House_Greyjoy.svg/120px-House_Greyjoy.svg.png'
};

// Funcție pentru a obține toate casele
async function getAllHouses() {
    try {
        const response = await fetch(`${API_URL}?pageSize=50`);
        const data = await response.json();
        console.log('Toate casele încărcate:', data);
        return data;
    } catch (error) {
        console.error('Eroare la încărcarea caselor:', error);
        return [];
    }
}

// Funcție pentru a obține o casă aleatorie
async function getRandomHouse() {
    try {
        const houses = await getAllHouses();
        if (houses.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7">Nu s-au găsit case.</td></tr>`;
            return;
        }

        const randomIndex = Math.floor(Math.random() * houses.length);
        const house = houses[randomIndex];
        console.log('Casa aleasă:', house);

        displayHouse(house);
    } catch (error) {
        console.error('Eroare la obținerea unei case random:', error);
    }
}

// Funcție pentru afișarea casei în tabel
function displayHouse(house) {
    const symbolUrl = houseSymbols[house.name] || 'https://via.placeholder.com/50?text=?';
    tableBody.innerHTML = `
        <tr>
            <td><img src="${symbolUrl}" alt="${house.name}"></td>
            <td>${house.name || 'N/A'}</td>
            <td>${house.region || 'N/A'}</td>
            <td>${house.words || 'N/A'}</td>
            <td>${house.titles.length ? house.titles.join(', ') : 'N/A'}</td>
            <td>${house.seats.length ? house.seats.join(', ') : 'N/A'}</td>
            <td>${house.founded || 'N/A'}</td>
        </tr>
    `;
}

// Event listener pentru buton
button.addEventListener('click', getRandomHouse);

// Afișăm o casă la încărcarea paginii
getRandomHouse();
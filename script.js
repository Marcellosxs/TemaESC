const API_URL = 'https://anapioficeandfire.com/api/houses';
const tableBody = document.querySelector('#houseTable tbody');
const randomBtn = document.getElementById('randomBtn');

let allHouses = [];

// Funcție pentru a prelua toate casele (paginat)
async function fetchAllHouses() {
    try {
        let houses = [];
        let page = 1;
        let keepFetching = true;

        while (keepFetching && page <= 10) { // max 10 pagini x 50 case = 500 case
            const response = await fetch(`${API_URL}?page=${page}&pageSize=50`);
            const data = await response.json();
            console.log(`Pagina ${page} încărcată, case:`, data.length);

            if (data.length === 0) {
                keepFetching = false;
            } else {
                houses = houses.concat(data);
                page++;
            }
        }

        console.log('Total case încărcate:', houses.length);
        return houses;
    } catch (error) {
        console.error('Eroare la preluarea caselor:', error);
        return [];
    }
}

// Funcție pentru a genera un URL pentru simbol / stemă (folosim placeholder dacă nu există)
function generateSymbolURL(coatOfArms, houseName) {
    if (coatOfArms && coatOfArms.trim() !== '') {
        // Dacă coatOfArms are link real, îl putem transforma în imagine cu placeholder (simplificat)
        // Din păcate API-ul oferă text, așa că folosim placeholder cu inițiala casei
        return `https://via.placeholder.com/50/8e6b3b/f0e6d2?text=${encodeURIComponent(houseName.charAt(0))}`;
    } else {
        return `https://via.placeholder.com/50/8e6b3b/f0e6d2?text=${encodeURIComponent(houseName.charAt(0))}`;
    }
}

// Funcție pentru a popula tabelul cu o casă
function displayHouse(house) {
    // Aplicăm efect vizual pentru schimbare
    tableBody.innerHTML = ''; // reset
    const symbolUrl = generateSymbolURL(house.coatOfArms, house.name);

    const tr = document.createElement('tr');

    // Cream fiecare td
    const tdSymbol = document.createElement('td');
    const img = document.createElement('img');
    img.src = symbolUrl;
    img.alt = house.name;
    tdSymbol.appendChild(img);
    tdSymbol.classList.add('change-highlight');

    const tdName = document.createElement('td');
    tdName.textContent = house.name || 'N/A';
    tdName.classList.add('change-highlight');

    const tdRegion = document.createElement('td');
    tdRegion.textContent = house.region || 'N/A';
    tdRegion.classList.add('change-highlight');

    const tdWords = document.createElement('td');
    tdWords.textContent = house.words || 'N/A';
    tdWords.classList.add('change-highlight');

    const tdTitles = document.createElement('td');
    tdTitles.textContent = house.titles.length ? house.titles.join(', ') : 'N/A';
    tdTitles.classList.add('change-highlight');

    const tdSeats = document.createElement('td');
    tdSeats.textContent = house.seats.length ? house.seats.join(', ') : 'N/A';
    tdSeats.classList.add('change-highlight');

    const tdCurrentLord = document.createElement('td');
    tdCurrentLord.textContent = house.currentLord || 'N/A';
    tdCurrentLord.classList.add('change-highlight');

    const tdHeir = document.createElement('td');
    tdHeir.textContent = house.heir || 'N/A';
    tdHeir.classList.add('change-highlight');

    const tdOverlord = document.createElement('td');
    tdOverlord.textContent = house.overlord || 'N/A';
    tdOverlord.classList.add('change-highlight');

    const tdFounded = document.createElement('td');
    tdFounded.textContent = house.founded || 'N/A';
    tdFounded.classList.add('change-highlight');

    const tdFounder = document.createElement('td');
    tdFounder.textContent = house.founder || 'N/A';
    tdFounder.classList.add('change-highlight');

    const tdCadetBranches = document.createElement('td');
    tdCadetBranches.textContent = house.cadetBranches.length ? house.cadetBranches.join(', ') : 'N/A';
    tdCadetBranches.classList.add('change-highlight');

    const tdSwornMembers = document.createElement('td');
    tdSwornMembers.textContent = house.swornMembers.length ? house.swornMembers.join(', ') : 'N/A';
    tdSwornMembers.classList.add('change-highlight');

    tr.append(
        tdSymbol, tdName, tdRegion, tdWords, tdTitles,
        tdSeats, tdCurrentLord, tdHeir, tdOverlord,
        tdFounded, tdFounder, tdCadetBranches, tdSwornMembers
    );

    tableBody.appendChild(tr);

    // Eliminăm clasa de highlight după un delay pentru efect tranzitional
    setTimeout(() => {
        const tds = tr.querySelectorAll('.change-highlight');
        tds.forEach(td => td.classList.remove('change-highlight'));
    }, 800);
}

// Funcție pentru a selecta o casă aleatorie
function showRandomHouse() {
    if (!allHouses.length) return;
    const randomIndex = Math.floor(Math.random() * allHouses.length);
    const house = allHouses[randomIndex];
    console.log('Casa aleasă:', house);
    displayHouse(house);
}

// Initializare: preluăm toate casele
async function init() {
    allHouses = await fetchAllHouses();
    if (allHouses.length) {
        showRandomHouse(); // afișăm prima casă la încărcarea paginii
    } else {
        tableBody.innerHTML = '<tr><td colspan="13">Nu s-au găsit case.</td></tr>';
    }
}

// Eveniment pentru buton
randomBtn.addEventListener('click', showRandomHouse);

// Pornim aplicația
init();
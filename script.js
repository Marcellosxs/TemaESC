const API_URL = 'https://anapioficeandfire.com/api/houses';
const tableBody = document.querySelector('#houseTable tbody');
const randomBtn = document.getElementById('randomBtn');

let allHouses = [];

// Fetch pentru toate casele (paginat)
async function fetchAllHouses() {
    try {
        let houses = [];
        let page = 1;
        let keepFetching = true;

        while (keepFetching && page <= 10) { // max 500 case
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

// Preia numele real dintr-un URL (pentru currentLord, heir, overlord)
async function fetchNameFromURL(url) {
    if (!url || url.trim() === "") return "N/A";
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.name || "N/A";
    } catch (error) {
        console.error("Eroare la fetch URL:", url, error);
        return "N/A";
    }
}

// Preia numele dintr-un array de URL-uri (pentru cadetBranches, swornMembers)
async function fetchNamesFromURLs(urls) {
    if (!urls || urls.length === 0) return "N/A";
    try {
        const names = await Promise.all(
            urls.map(async (url) => {
                const res = await fetch(url);
                const data = await res.json();
                return data.name || "N/A";
            })
        );
        return names.join(', ');
    } catch (error) {
        console.error("Eroare la fetch multiple URLs:", error);
        return "N/A";
    }
}

// Generează un simbol / stemă pentru casă (placeholder dacă nu există coatOfArms real)
function generateSymbolURL(coatOfArms, houseName) {
    if (coatOfArms && coatOfArms.trim() !== '') {
        return `https://via.placeholder.com/50/8e6b3b/f0e6d2?text=${encodeURIComponent(houseName.charAt(0))}`;
    } else {
        return `https://via.placeholder.com/50/8e6b3b/f0e6d2?text=${encodeURIComponent(houseName.charAt(0))}`;
    }
}

// Populează tabelul cu datele unei case
async function displayHouse(house) {
    tableBody.innerHTML = ''; // reset

    const tr = document.createElement('tr');

    // Simbol / stemă
    const tdSymbol = document.createElement('td');
    const img = document.createElement('img');
    img.src = generateSymbolURL(house.coatOfArms, house.name);
    img.alt = house.name;
    tdSymbol.appendChild(img);
    tdSymbol.classList.add('change-highlight');

    // Nume, region, words, titles, seats
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

    // URL fields preluate din API
    const tdCurrentLord = document.createElement('td');
    tdCurrentLord.textContent = await fetchNameFromURL(house.currentLord);
    tdCurrentLord.classList.add('change-highlight');

    const tdHeir = document.createElement('td');
    tdHeir.textContent = await fetchNameFromURL(house.heir);
    tdHeir.classList.add('change-highlight');

    const tdOverlord = document.createElement('td');
    tdOverlord.textContent = await fetchNameFromURL(house.overlord);
    tdOverlord.classList.add('change-highlight');

    // Fondată și fondator
    const tdFounded = document.createElement('td');
    tdFounded.textContent = house.founded || 'N/A';
    tdFounded.classList.add('change-highlight');

    const tdFounder = document.createElement('td');
    tdFounder.textContent = house.founder || 'N/A';
    tdFounder.classList.add('change-highlight');

    // Arrays de URL-uri
    const tdCadetBranches = document.createElement('td');
    tdCadetBranches.textContent = await fetchNamesFromURLs(house.cadetBranches);
    tdCadetBranches.classList.add('change-highlight');

    const tdSwornMembers = document.createElement('td');
    tdSwornMembers.textContent = await fetchNamesFromURLs(house.swornMembers);
    tdSwornMembers.classList.add('change-highlight');

    // Adăugăm toate td-urile în tr
    tr.append(
        tdSymbol, tdName, tdRegion, tdWords, tdTitles,
        tdSeats, tdCurrentLord, tdHeir, tdOverlord,
        tdFounded, tdFounder, tdCadetBranches, tdSwornMembers
    );

    tableBody.appendChild(tr);

    // Eliminăm clasa highlight după un delay pentru efect tranzitional
    setTimeout(() => {
        const tds = tr.querySelectorAll('.change-highlight');
        tds.forEach(td => td.classList.remove('change-highlight'));
    }, 800);
}

// Afișează o casă aleatorie
function showRandomHouse() {
    if (!allHouses.length) return;
    const randomIndex = Math.floor(Math.random() * allHouses.length);
    const house = allHouses[randomIndex];
    console.log('Casa aleasă:', house);
    displayHouse(house);
}

// Inițializare aplicație
async function init() {
    allHouses = await fetchAllHouses();
    if (allHouses.length) {
        showRandomHouse(); // prima casă la încărcarea paginii
    } else {
        tableBody.innerHTML = '<tr><td colspan="13">Nu s-au găsit case.</td></tr>';
    }
}

// Eveniment pentru buton
randomBtn.addEventListener('click', showRandomHouse);

// Pornim aplicația
init();
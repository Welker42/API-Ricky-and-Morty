// scripts.js

const apiUrls = {
  characters: "https://rickandmortyapi.com/api/character",
  locations: "https://rickandmortyapi.com/api/location",
  episodes: "https://rickandmortyapi.com/api/episode"
};

// Função para buscar dados da API
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Função para buscar personagens por IDs
async function fetchCharacterByIds(ids) {
  if (ids.length === 0) return { results: [] };
  const url = `${apiUrls.characters}?ids=${ids.join(',')}`;
  return fetchData(url);
}

// Função para exibir personagens
async function displayCharacters() {
  const characters = await fetchData(apiUrls.characters);
  const container = document.getElementById('characters-list');
  container.innerHTML = '';  // Limpa o container antes de adicionar novos dados

  if (characters && characters.results) {
    characters.results.forEach(character => {
      const div = document.createElement('div');
      div.className = 'card';
      div.dataset.id = character.id; // Adiciona identificador único
      div.innerHTML = `
        <img src="${character.image}" alt="${character.name}">
        <h3>${character.name}</h3>
        <p>Status: ${character.status}</p>
        <p>Species: ${character.species}</p>
        <p>Origin: ${character.origin.name}</p>
        <p>Location: ${character.location.name}</p>
      `;
      div.addEventListener('click', () => showCharacterDetails(character.id)); // Adiciona evento de clique
      container.appendChild(div);
    });
  } else {
    container.innerHTML = '<p>Unable to load characters data.</p>';
  }
}

// Função para exibir locais
async function displayLocations() {
  const locations = await fetchData(apiUrls.locations);
  const container = document.getElementById('locations-list');
  container.innerHTML = '';  // Limpa o container antes de adicionar novos dados

  if (locations && locations.results) {
    // Obtém todos os IDs de residentes
    const allResidentIds = new Set();
    for (const location of locations.results) {
      location.residents.forEach(url => {
        const id = url.split('/').pop();
        allResidentIds.add(id);
      });
    }

    const residentIds = Array.from(allResidentIds);
    const characters = await fetchCharacterByIds(residentIds);

    if (characters) {
      locations.results.forEach(location => {
        // Filtra os residentes para cada local
        const residentIds = location.residents.map(url => url.split('/').pop());
        const residentsHtml = characters.results
          .filter(character => residentIds.includes(character.id))
          .map(character => `
            <div class="resident">
              <img src="${character.image}" alt="${character.name}">
              <p>${character.name}</p>
            </div>
          `).join('');

        const div = document.createElement('div');
        div.className = 'card';
        div.dataset.id = location.id; // Adiciona identificador único
        div.innerHTML = `
          <h3>${location.name}</h3>
          <p>Type: ${location.type}</p>
          <p>Dimension: ${location.dimension}</p>
          <div class="residents">
            ${residentsHtml}
          </div>
        `;
        div.addEventListener('click', () => showLocationDetails(location.id)); // Adiciona evento de clique
        container.appendChild(div);
      });
    }
  } else {
    container.innerHTML = '<p>Unable to load locations data.</p>';
  }
}

// Função para exibir episódios
async function displayEpisodes() {
  const episodes = await fetchData(apiUrls.episodes);
  const container = document.getElementById('episodes-list');
  container.innerHTML = '';  // Limpa o container antes de adicionar novos dados

  if (episodes && episodes.results) {
    // Obtém todos os IDs de personagens
    const allCharacterIds = new Set();
    for (const episode of episodes.results) {
      episode.characters.forEach(url => {
        const id = url.split('/').pop();
        allCharacterIds.add(id);
      });
    }

    const characterIds = Array.from(allCharacterIds);
    const characters = await fetchCharacterByIds(characterIds);

    if (characters) {
      episodes.results.forEach(episode => {
        // Filtra os personagens para cada episódio
        const characterIds = episode.characters.map(url => url.split('/').pop());
        const charactersHtml = characters.results
          .filter(character => characterIds.includes(character.id))
          .map(character => `
            <div class="character">
              <img src="${character.image}" alt="${character.name}">
              <p>${character.name}</p>
            </div>
          `).join('');

        const div = document.createElement('div');
        div.className = 'card';
        div.dataset.id = episode.id; // Adiciona identificador único
        div.innerHTML = `
          <h3>${episode.name}</h3>
          <p>Air Date: ${episode.air_date}</p>
          <p>Episode: ${episode.episode}</p>
          <div class="characters">
            ${charactersHtml}
          </div>
        `;
        div.addEventListener('click', () => showEpisodeDetails(episode.id)); // Adiciona evento de clique
        container.appendChild(div);
      });
    }
  } else {
    container.innerHTML = '<p>Unable to load episodes data.</p>';
  }
}

// Função para mostrar detalhes do personagem
async function showCharacterDetails(characterId) {
  const character = await fetchData(`${apiUrls.characters}/${characterId}`);
  if (character) {
    alert(`Character: ${character.name}\nStatus: ${character.status}\nSpecies: ${character.species}\nOrigin: ${character.origin.name}`);
  } else {
    alert('Unable to load character details.');
  }
}

// Função para mostrar detalhes do local
async function showLocationDetails(locationId) {
  const location = await fetchData(`${apiUrls.locations}/${locationId}`);
  if (location) {
    alert(`Location: ${location.name}\nType: ${location.type}\nDimension: ${location.dimension}`);
  } else {
    alert('Unable to load location details.');
  }
}

// Função para mostrar detalhes do episódio
async function showEpisodeDetails(episodeId) {
  const episode = await fetchData(`${apiUrls.episodes}/${episodeId}`);
  if (episode) {
    alert(`Episode: ${episode.name}\nAir Date: ${episode.air_date}\nEpisode: ${episode.episode}`);
  } else {
    alert('Unable to load episode details.');
  }
}

// Função para abrir abas
function openTab(evt, tabName) {
  // Esconde todas as abas
  const tabcontents = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontents.length; i++) {
    tabcontents[i].style.display = "none";
  }

  // Remove a classe "active" de todos os botões
  const tablinks = document.getElementsByClassName("tablink");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Mostra a aba atual e adiciona a classe "active" ao botão
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Função para buscar e exibir todos os dados
async function fetchAllData() {
  await displayCharacters();
  await displayLocations();
  await displayEpisodes();
}

// Inicializa os dados e exibe a aba padrão
fetchAllData();
document.querySelector(".tablink").click(); // Simula um clique na primeira aba para exibir

async function fetchCharacters() {
    try {
        const response = await fetch('https://rickandmortyapi.com/api/character/');
        const data = await response.json();
        console.log(data.results); // Exibe a lista de personagens no console
    } catch (error) {
        console.error('Erro ao buscar personagens:', error);
    }
}

// Chama a função para buscar personagens
fetchCharacters();

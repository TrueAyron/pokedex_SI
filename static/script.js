const pokemonName = document.querySelector('.pokemon_name');
const pokemonNumber = document.querySelector('.pokemon_number');
const pokemonImage = document.querySelector('.pokemon_image');

const form = document.querySelector('.form');
const input = document.querySelector('.input_search');

const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchPokemon = 1;


const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toString().toLowerCase()}`);

    if (APIResponse.status === 200) {
        const data = await APIResponse.json();
        return data;
    }
};

const renderPokemon = async (pokemon) => {
    // Configura para um estado de 'Carregando' antes de iniciar a busca
    pokemonName.innerHTML = 'Carregando...';
    pokemonNumber.innerHTML = '';
    pokemonImage.style.display = 'none';  // Esconde a imagem durante o carregamento

    const data = await fetchPokemon(pokemon);

    if (data) {
        // Atualiza todas as propriedades juntas após os dados serem carregados
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
        pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${data.id}.gif`;
        pokemonImage.style.display = 'block';  // Mostra a imagem
        searchPokemon = data.id;
    } else {
        pokemonName.innerHTML = 'Não encontrado';
        pokemonNumber.innerHTML = '';
        pokemonImage.style.display = 'none';  // Continua escondendo a imagem se não encontrar dados
    }

    // Limpa a caixa de pesquisa
    input.value = '';
};


form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value);
});

buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
});

buttonNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});

renderPokemon(searchPokemon);
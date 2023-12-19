const pokemonName = document.querySelector('.pokemon_name');
const pokemonNumber = document.querySelector('.pokemon_number');
const pokemonImage = document.querySelector('.pokemon_image');

const form = document.querySelector('.form');
const input = document.querySelector('.input_search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');


let searchPokemon = 1;

const fetchPokemon = async (pokemon) => {
    try {
        const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

        if (APIResponse.status === 200) {
            const data = await APIResponse.json();
            return data;
        } else {
            throw new Error('Erro na requisição à API');
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}
const renderPokemon = async (pokemonId) => {
    pokemonName.innerHTML = 'Carregando...';
    pokemonNumber.innerHTML = '';
    pokemonImage.style.display = 'none';

    const data = await fetchPokemon(pokemonId);

    if (data) {
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
        pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${data.id}.gif`;
        pokemonImage.style.display = 'block';
    } else {
        pokemonName.innerHTML = 'Não encontrado';
        pokemonNumber.innerHTML = '';
        pokemonImage.style.display = 'none';
    }
    input.value = '';
};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const userInput = parseInt(input.value.toLowerCase(), 10);
    searchPokemon = userInput || 1; // Se o usuário não inserir um número válido, volta para o Pokémon 1
    renderPokemon(searchPokemon);
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
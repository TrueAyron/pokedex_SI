const pokemonName = document.querySelector('.pokemon_name');
const pokemonNumber = document.querySelector('.pokemon_number');
const pokemonImage = document.querySelector('.pokemon_image');
const form = document.querySelector('.form');
const input = document.querySelector('.input_search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');
const typesSelect = document.querySelector('.input_type');

let currentType = 'all';
let currentPokemonList = [];
let currentIndex = 0;
let totalPokemon = 898; // Número total de Pokémon até a última geração conhecida

const fetchPokemon = async (pokemonId) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    if (APIResponse.status === 200) {
        const data = await APIResponse.json();
        return data;
    }
};

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

const fetchPokemonTypes = async () => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/type/`);
    if (APIResponse.status === 200) {
        const data = await APIResponse.json();
        data.results.forEach((type) => {
            const option = document.createElement('option');
            option.value = type.name;
            option.innerText = type.name.charAt(0).toUpperCase() + type.name.slice(1);
            typesSelect.appendChild(option);
        });
    }
};

fetchPokemonTypes();

const updatePokemonList = async (type) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    if (APIResponse.status === 200) {
        const data = await APIResponse.json();
        currentPokemonList = data.pokemon.map(p => p.pokemon.name);
        currentIndex = 0;
        renderPokemon(currentPokemonList[currentIndex]);
    }
};

if (typesSelect) {
    typesSelect.addEventListener('change', () => {
        currentType = typesSelect.value;
        if (currentType === 'all') {
            currentIndex = 1; // Começa com o primeiro Pokémon
            renderPokemon(currentIndex);
        } else {
            updatePokemonList(currentType);
        }
    });
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const userInput = input.value.toLowerCase();

    if (currentType === 'all') {
        const pokemonId = parseInt(userInput);
        if (!isNaN(pokemonId) && pokemonId >= 1 && pokemonId <= totalPokemon) {
            currentIndex = pokemonId;
            renderPokemon(currentIndex);
        } else {
            pokemonName.innerHTML = 'Não encontrado';
            pokemonNumber.innerHTML = '';
            pokemonImage.style.display = 'none';
        }
    } else {
        const pokemonIndex = currentPokemonList.findIndex(pokemon => pokemon === userInput);
        if (pokemonIndex !== -1) {
            currentIndex = pokemonIndex;
            renderPokemon(currentPokemonList[currentIndex]);
        } else {
            pokemonName.innerHTML = 'Não encontrado';
            pokemonNumber.innerHTML = '';
            pokemonImage.style.display = 'none';
        }
    }
});

buttonPrev.addEventListener('click', () => {
    if (currentType === 'all') {
        if (currentIndex > 1) {
            currentIndex -= 1;
            renderPokemon(currentIndex);
        }
    } else {
        let prevIndex = currentIndex - 1;
        while (prevIndex >= 0 && !currentPokemonList[prevIndex].types.some(type => type.type.name === currentType)) {
            prevIndex -= 1;
        }

        if (prevIndex >= 0) {
            currentIndex = prevIndex;
            renderPokemon(currentPokemonList[currentIndex]);
        }
    }
});

buttonNext.addEventListener('click', () => {
    if (currentType === 'all') {
        if (currentIndex < totalPokemon) {
            currentIndex += 1;
            renderPokemon(currentIndex);
        }
    } else {
        let nextIndex = currentIndex + 1;
        while (nextIndex < currentPokemonList.length && !currentPokemonList[nextIndex].types.some(type => type.type.name === currentType)) {
            nextIndex += 1;
        }

        if (nextIndex < currentPokemonList.length) {
            currentIndex = nextIndex;
            renderPokemon(currentPokemonList[currentIndex]);
        }
    }
});


const btnNormal = document.getElementById('btn-normal');
const btnGrass = document.getElementById('btn-grass');
const btnFire = document.getElementById('btn-fire');
// Adicione outros botões de tipo semelhantemente
const btnReset = document.getElementById('btn-reset');

btnNormal.addEventListener('click', () => {
    updatePokemonList('normal');
});

btnGrass.addEventListener('click', () => {
    updatePokemonList('grass');
});

btnFire.addEventListener('click', () => {
    updatePokemonList('fire');
});

// Adicione outros ouvintes de evento para outros tipos, se necessário

btnReset.addEventListener('click', () => {
    currentType = 'all';
    currentIndex = 1;
    renderPokemon(currentIndex);
    typesSelect.value = 'all';
});

renderPokemon(1); // Renderiza o primeiro Pokémon por padrão
// script.js

document.addEventListener('DOMContentLoaded', function () {
    // Aguarde até que o DOM esteja completamente carregado

    const pokemonImage = document.querySelector('.pokemon_image');
    const pokemonNumber = document.querySelector('.pokemon_number');
    const pokemonName = document.querySelector('.pokemon_name');
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
    };

    const renderPokemon = async (pokemonId) => {
        pokemonName.innerHTML = 'Carregando...';
        pokemonNumber.innerHTML = '';
        pokemonImage.style.display = 'none';

        try {
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
        } catch (error) {
            console.error(error);
        }

        input.value = ''; // Limpar a entrada após o processamento
    };

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const userInput = input.value.trim().toLowerCase();

        if (userInput) {
            if (!isNaN(userInput)) {
                const pokemonId = parseInt(userInput, 10);
                searchPokemon = pokemonId;
                renderPokemon(searchPokemon);
            } else {
                // Se não for um número, tentar buscar pelo nome
                const data = await fetchPokemon(userInput);
                if (data) {
                    searchPokemon = data.id;
                    renderPokemon(searchPokemon);
                } else {
                    alert('Pokémon não encontrado. Por favor, insira um número ou nome de Pokémon válido.');
                }
            }
        } else {
            alert('Por favor, insira um número ou nome de Pokémon válido.');
        }
    });

    buttonPrev.addEventListener('click', function () {
        if (searchPokemon > 1) {
            searchPokemon -= 1;
            renderPokemon(searchPokemon);
        }
    });

    buttonNext.addEventListener('click', function () {
        searchPokemon += 1;
        renderPokemon(searchPokemon);
    });

    renderPokemon(searchPokemon);
});

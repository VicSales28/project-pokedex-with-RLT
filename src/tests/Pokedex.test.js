import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../renderWithRouter';
import App from '../App';
import pokemonsList from '../data';

describe('Testa o componente <Pokedex.js />', () => {
  beforeEach(() => { renderWithRouter(<App />); });
  test('Testa se a página contém um heading h2 com o texto Encountered Pokémon', () => {
    const subtitle = screen.getByRole('heading', {
      name: 'Encountered Pokémon',
      level: 2,
    });
    expect(subtitle).toBeVisible();
  });

  test('Testa se é exibido o próximo Pokémon da lista quando o botão Próximo Pokémon é clicado', () => {
    const allPokemonsNames = pokemonsList.map((specie) => specie.name);

    allPokemonsNames.forEach((name, index, array) => {
      const currentPokemon = screen.getByTestId('pokemon-name');
      expect(currentPokemon).toBeVisible();
      expect(currentPokemon).toHaveTextContent(name);

      const firstIndex = array.indexOf('Pikachu');
      const nextIndex = index + 1;
      const lastIndex = array.indexOf('Dragonair');

      const nextBtn = screen.getByRole('button', { name: 'Próximo Pokémon' });
      expect(nextBtn).toBeVisible();
      userEvent.click(nextBtn);

      if (index >= firstIndex && index < lastIndex) {
        expect(currentPokemon).toBeVisible();
        expect(currentPokemon).toHaveTextContent(array[nextIndex]);
      } else {
        const firstPokemon = screen.getByText(array[firstIndex]);
        expect(firstPokemon).toBeVisible();
      }
    });
  });

  test('Testa se é mostrado apenas um Pokémon por vez', () => {
    const currentArray = screen.getAllByTestId('pokemon-name');
    expect(currentArray).toHaveLength(1);
  });

  test('Testa se a Pokédex tem os botões de filtro', () => {
    // Testa se a quantidade de botões de filtragem corresponde à quantidade de tipos de Pokemón:
    const allFilterBtns = screen.getAllByTestId('pokemon-type-button');
    const pokemonsTypes = [...new Set(pokemonsList.map((specie) => specie.type))];
    const numTypes = pokemonsTypes.length;
    expect(allFilterBtns).toHaveLength(numTypes);

    const currentType = screen.getByTestId('pokemon-type');
    // Testa se a Pokédex circula somente pelos Pokemóns daquele tipo:
    allFilterBtns.forEach((filterBtn) => {
      expect(filterBtn).toBeVisible();
      userEvent.click(filterBtn);
      expect(currentType).toBeVisible();
      expect(currentType.textContent).toEqual(filterBtn.textContent);
    });

    // Testa se o texto do botão corresponde ao nome do tipo:
    allFilterBtns.forEach((filterBtn, index) => {
      expect(filterBtn.textContent).toEqual(pokemonsTypes[index]);
    });

    // Testa se a Pokédex contém um botão para resetar o filtro:
    const psychicBtn = screen.getByRole('button', { name: 'Psychic' });
    expect(psychicBtn).toBeInTheDocument();
    userEvent.click(psychicBtn);
    expect(currentType).toBeInTheDocument();
    expect(currentType.textContent).toBe('Psychic');

    // Testa se a Pokedéx mostra os Pokémon normalmente (sem filtros) quando o botão All é clicado:
    const allBtn = screen.getByRole('button', { name: 'All' });
    expect(allBtn).toBeInTheDocument();
    userEvent.click(allBtn);
    expect(currentType).toBeInTheDocument();
    expect(currentType.textContent).toBe('Electric');

    const nextBtn = screen.getByRole('button', { name: 'Próximo Pokémon' });
    userEvent.click(nextBtn);
    expect(currentType.textContent).toBe('Fire');
  });
});

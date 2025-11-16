import { Pokemon, PokemonApiResponse } from '../types/pokemon';

const API_BASE_URL = 'https://challenge.solimain.com/api/v1';


export const pokemonService = {
  async getPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error(`Error fetching Pokemon list: ${response.status}`);
      }
      const data = await response.json();
      
      data.results = data.pokemons.map((pokemon: any, index: number) => ({
        ...pokemon,
        id: offset + index + 1
      }));
      
      return data;
    } catch (error) {
      console.error('Error fetching Pokemon list:', error);
      throw error;
    }
  },

  async getPokemonByName(name: string): Promise<Pokemon> {
    try {
      const response = await fetch(`${API_BASE_URL}/pokemon/name/${name.toLowerCase()}`);
      if (!response.ok) {
        const responseData:any = await response.json();
        console.log(response)
        throw new Error(`Error name: ${name} ${responseData.message} status service: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching Pokemon ${name}:`, error);
      throw error;
    }
  },

  async getPokemonById(id: number): Promise<Pokemon> {
    try {
      const response = await fetch(`${API_BASE_URL}/pokemon/${id}`);
      if (!response.ok) {
        throw new Error(`Error fetching Pokemon with ID ${id}: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching Pokemon with ID ${id}:`, error);
      throw error;
    }
  },
};

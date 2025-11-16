import { Pokemon, PokemonApiResponse } from '../types/pokemon';
import { cacheService } from './cacheService';

const API_BASE_URL = 'https://challenge.solimain.com/api/v1';


export const pokemonService = {
  async getPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonApiResponse> {
    const cachedData = cacheService.getPokemonList(limit, offset) as PokemonApiResponse | null;
    if (cachedData) {
      console.log(`CacheData: Pokemon list (limit=${limit}, offset=${offset})`);
      return cachedData;
    }

    try {
      console.log(`Fetching from Bakcend Go: Pokemon list (limit=${limit}, offset=${offset})`);
      const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error(`Error fetching Pokemon list: ${response.status}`);
      }
      const data = await response.json();
      
      data.results = data.pokemons.map((pokemon: any, index: number) => ({
        ...pokemon,
        id: offset + index + 1
      }));
      
      cacheService.setPokemonList(limit, offset, data);
      
      return data;
    } catch (error) {
      console.error('Error fetching Pokemon list:', error);
      throw error;
    }
  },

  async getPokemonByName(name: string): Promise<Pokemon> {

    const cachedData = cacheService.getPokemonByName(name) as Pokemon | null;
    if (cachedData) {
      console.log(`Cache: Pokemon by name (${name})`);
      return cachedData;
    }

    try {
      console.log(`Call Backend GO: Pokemon by name (${name})`);
      const response = await fetch(`${API_BASE_URL}/pokemon/name/${name.toLowerCase()}`);
      if (!response.ok) {
        const responseData:any = await response.json();
        console.log(response)
        throw new Error(`Error name: ${name} ${responseData.message} status service: ${response.status}`);
      }
      const data = await response.json();
      
      cacheService.setPokemonByName(name, data);
      cacheService.setPokemonById(data.id, data);
      
      return data;
    } catch (error) {
      console.error(`Error fetching Pokemon ${name}:`, error);
      throw error;
    }
  },

  async getPokemonById(id: number): Promise<Pokemon> {
    const cachedData = cacheService.getPokemonById(id) as Pokemon | null;
    if (cachedData) {
      console.log(`Cache form: Pokemon by ID (${id})`);
      return cachedData;
    }

    try {
      console.log(`Call from Backend Go: Pokemon by ID (${id})`);
      const response = await fetch(`${API_BASE_URL}/pokemon/${id}`);
      if (!response.ok) {
        throw new Error(`Error fetching Pokemon with ID ${id}: ${response.status}`);
      }
      const data = await response.json();
      
      cacheService.setPokemonById(id, data);
      cacheService.setPokemonByName(data.name, data);
      
      return data;
    } catch (error) {
      console.error(`Error fetching Pokemon with ID ${id}:`, error);
      throw error;
    }
  },
};
